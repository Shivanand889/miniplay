import Phaser from 'phaser';
import { GameBridgeCallbacks, GameSkinConfig } from '../../common/GameBridge';
import { soundFx } from '../../common/SoundFx';

export class NeonJumpScene extends Phaser.Scene {
  private callbacks: GameBridgeCallbacks;
  private skin: GameSkinConfig;

  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private platforms!: Phaser.Physics.Arcade.Group;
  private springs!: Phaser.Physics.Arcade.Group;
  private stars!: Phaser.GameObjects.Arc[];

  public isGameActive = false;
  private isGameOver = false;
  private isPaused = false;
  private score = 0;
  private maxHeight = 0;
  private highestPlatformY = 560;

  public touchDirection: number = 0; // -1 for left, 1 for right, 0 for none

  constructor(callbacks: GameBridgeCallbacks, skin: GameSkinConfig) {
    super({ key: 'NeonJumpScene' });
    this.callbacks = callbacks;
    this.skin = skin;
  }

  preload() {
    this.generateProceduralTextures();
  }

  private generateProceduralTextures() {
    // 1. Character
    if (!this.textures.exists(`jumper_${this.skin.id}`)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      const pColor = Phaser.Display.Color.HexStringToColor(this.skin.primaryColor).color;
      const sColor = Phaser.Display.Color.HexStringToColor(this.skin.secondaryColor || '#FFFFFF').color;

      // Glow halo
      g.fillStyle(pColor, 0.35);
      g.fillCircle(24, 24, 22);

      // Main Orb Body
      g.fillStyle(pColor, 1);
      g.fillCircle(24, 24, 18);
      g.lineStyle(2, sColor, 1);
      g.strokeCircle(24, 24, 18);

      // Cute Eyes
      g.fillStyle(0x0F172A, 1);
      g.fillCircle(18, 20, 3.5);
      g.fillCircle(30, 20, 3.5);
      g.fillStyle(0xFFFFFF, 1);
      g.fillCircle(19, 19, 1.5);
      g.fillCircle(31, 19, 1.5);

      // Cheerful smile
      g.lineStyle(2, 0x0F172A, 1);
      g.beginPath();
      g.arc(24, 25, 4, 0.2, Math.PI - 0.2, false);
      g.strokePath();

      g.generateTexture(`jumper_${this.skin.id}`, 48, 48);
      g.destroy();
    }

    // 2. Static Platform (Cyan/Green neon)
    if (!this.textures.exists('plat_static')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x0891B2, 1);
      g.fillRoundedRect(2, 2, 86, 16, 8);
      g.lineStyle(2, 0x22D3EE, 1);
      g.strokeRoundedRect(2, 2, 86, 16, 8);
      g.fillStyle(0xE0F2FE, 0.9);
      g.fillRoundedRect(16, 6, 58, 4, 2);
      g.generateTexture('plat_static', 90, 20);
      g.destroy();
    }

    // 3. Moving Platform (Purple neon)
    if (!this.textures.exists('plat_moving')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x7C3AED, 1);
      g.fillRoundedRect(2, 2, 86, 16, 8);
      g.lineStyle(2, 0xC084FC, 1);
      g.strokeRoundedRect(2, 2, 86, 16, 8);
      g.fillStyle(0xFAF5FF, 0.9);
      g.fillRoundedRect(16, 6, 58, 4, 2);
      g.generateTexture('plat_moving', 90, 20);
      g.destroy();
    }

    // 4. Fragile Platform (Orange warning)
    if (!this.textures.exists('plat_fragile')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xC2410C, 1);
      g.fillRoundedRect(2, 2, 86, 16, 8);
      g.lineStyle(2, 0xFB923C, 1);
      g.strokeRoundedRect(2, 2, 86, 16, 8);
      g.fillStyle(0xFEF3C7, 0.9);
      g.fillRect(14, 7, 12, 3);
      g.fillRect(38, 7, 12, 3);
      g.fillRect(62, 7, 12, 3);
      g.generateTexture('plat_fragile', 90, 20);
      g.destroy();
    }

    // 5. Spring
    if (!this.textures.exists('power_spring')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xFBBF24, 1);
      g.fillRect(6, 16, 16, 4);
      g.lineStyle(3, 0xF59E0B, 1);
      g.beginPath();
      g.moveTo(8, 16);
      g.lineTo(20, 11);
      g.lineTo(8, 6);
      g.lineTo(20, 2);
      g.strokePath();
      g.generateTexture('power_spring', 28, 22);
      g.destroy();
    }
  }

  create() {
    this.isGameActive = false;
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.maxHeight = 0;
    this.highestPlatformY = 560;

    const width = 480;
    const height = 720;

    // Reset Camera
    this.cameras.main.scrollY = 0;

    // Cosmic background stars
    this.stars = [];
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(10, width - 10);
      const y = Phaser.Math.Between(-1000, height);
      const r = Phaser.Math.FloatBetween(1, 2.5);
      const star = this.add.circle(x, y, r, 0x38BDF8, Phaser.Math.FloatBetween(0.3, 0.8));
      star.setScrollFactor(0.2); // Parallax starfield
      this.stars.push(star);
    }

    // Groups
    this.platforms = this.physics.add.group();
    this.springs = this.physics.add.group();

    this.buildInitialWorld();

    // Player setup - starts sitting on base platform with gravity paused until started!
    this.player = this.physics.add.sprite(240, 600, `jumper_${this.skin.id}`);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(false);
    this.player.body?.setSize(28, 28);
    (this.player.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    // Platform Collisions (only when falling downwards)
    this.physics.add.overlap(this.player, this.platforms, this.handlePlatformLand, undefined, this);
    this.physics.add.overlap(this.player, this.springs, this.handleSpringLand, undefined, this);
  }

  private buildInitialWorld() {
    this.platforms.clear(true, true);
    this.springs.clear(true, true);
    this.highestPlatformY = 560;

    // Initial base platform directly below player
    const basePlat = this.platforms.create(240, 640, 'plat_static');
    (basePlat.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    basePlat.body.immovable = true;
    basePlat.body.checkCollision.down = false;
    basePlat.body.checkCollision.left = false;
    basePlat.body.checkCollision.right = false;

    // Spawn starting ladder of platforms up to Y = -400
    while (this.highestPlatformY > -400) {
      this.spawnPlatform(this.highestPlatformY);
      this.highestPlatformY -= Phaser.Math.Between(75, 110);
    }
  }

  public startGame() {
    this.physics.resume();
    this.isGameActive = true;
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.maxHeight = 0;
    this.cameras.main.scrollY = 0;
    this.touchDirection = 0;

    this.player.setPosition(240, 600);
    if (this.player.body) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.reset(240, 600);
      body.enable = true;
      body.setAllowGravity(true);
      body.setVelocity(0, -580);
    } else {
      this.player.setVelocityY(-580);
    }
    soundFx.playJump();
    this.callbacks.onGameStarted?.();
  }

  update(time: number, delta: number) {
    if (!this.isGameActive || this.isGameOver || this.isPaused) return;

    const dt = delta / 1000;

    // Horizontal Movement
    const speed = 360;
    let vx = 0;
    if (this.cursors?.left.isDown || this.wasd?.left.isDown || this.touchDirection < 0) {
      vx = -speed;
    } else if (this.cursors?.right.isDown || this.wasd?.right.isDown || this.touchDirection > 0) {
      vx = speed;
    }
    this.player.setVelocityX(vx);

    // Screen wrapping left-to-right & right-to-left
    if (this.player.x < -15) {
      this.player.x = 495;
    } else if (this.player.x > 495) {
      this.player.x = -15;
    }

    // Moving platforms horizontal update
    this.platforms.getChildren().forEach((p: any) => {
      const plat = p as Phaser.Physics.Arcade.Sprite;
      if (plat.getData('type') === 'moving') {
        const minX = plat.getData('minX');
        const maxX = plat.getData('maxX');
        const dir = plat.getData('dir');
        const moveSpeed = plat.getData('speed') || 110;
        plat.x += dir * moveSpeed * dt;

        if (plat.x <= minX) {
          plat.x = minX;
          plat.setData('dir', 1);
        } else if (plat.x >= maxX) {
          plat.x = maxX;
          plat.setData('dir', -1);
        }
      }
    });

    // Camera scrolls upward smoothly as player climbs
    const targetScrollY = this.player.y - 360;
    if (targetScrollY < this.cameras.main.scrollY) {
      this.cameras.main.scrollY = targetScrollY;

      // Score based on highest altitude climbed
      const currentHeight = Math.max(0, Math.floor(-this.cameras.main.scrollY));
      if (currentHeight > this.maxHeight) {
        this.maxHeight = currentHeight;
        this.score = Math.floor(this.maxHeight / 5);
        this.callbacks.onScoreUpdate(this.score);

        // Coins earned every 100 points
        const earnedCoins = Math.floor(this.score / 100);
        this.callbacks.onCoinCollected(earnedCoins);
      }
    }

    // Clean up platforms that have scrolled past the bottom of the visible camera
    this.platforms.getChildren().forEach((p: any) => {
      if (p.y > this.cameras.main.scrollY + 760) {
        p.destroy();
      }
    });
    this.springs.getChildren().forEach((s: any) => {
      if (s.y > this.cameras.main.scrollY + 760) {
        s.destroy();
      }
    });

    // Procedurally spawn new platforms above the camera view (infinite climber!)
    while (this.highestPlatformY > this.cameras.main.scrollY - 300) {
      this.spawnPlatform(this.highestPlatformY);
      const spacing = Phaser.Math.Between(75, Math.min(130, 85 + Math.floor(this.score / 80)));
      this.highestPlatformY -= spacing;
    }

    // Check Fall Death (fell off bottom of current camera view)
    if (this.player.y > this.cameras.main.scrollY + 740 && !this.isGameOver) {
      this.handleGameOver();
    }
  }

  private spawnPlatform(y: number) {
    const x = Phaser.Math.Between(55, 425);
    const rand = Math.random();

    let texture = 'plat_static';
    let type = 'static';

    if (rand < 0.28 && this.score > 60) {
      texture = 'plat_moving';
      type = 'moving';
    } else if (rand < 0.45 && this.score > 120) {
      texture = 'plat_fragile';
      type = 'fragile';
    }

    const plat = this.platforms.create(x, y, texture);
    // CRITICAL: disable gravity so platforms don't fall!
    (plat.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    plat.body.immovable = true;
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
    plat.setData('type', type);

    if (type === 'moving') {
      plat.setData('minX', Math.max(50, x - 90));
      plat.setData('maxX', Math.min(430, x + 90));
      plat.setData('dir', Math.random() > 0.5 ? 1 : -1);
      plat.setData('speed', Phaser.Math.Between(90, 150));
    }

    // Chance to spawn super spring on static platforms
    if (type === 'static' && Math.random() < 0.18) {
      const spring = this.springs.create(x, y - 16, 'power_spring');
      (spring.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      spring.body.immovable = true;
      spring.body.checkCollision.down = false;
      spring.body.checkCollision.left = false;
      spring.body.checkCollision.right = false;
    }
  }

  private handlePlatformLand(playerObj: any, platObj: any) {
    const p = playerObj as Phaser.Physics.Arcade.Sprite;
    const plat = platObj as Phaser.Physics.Arcade.Sprite;

    // Only bounce if falling downward and player's feet are above or near the platform top
    if (p.body && p.body.velocity.y > 0 && p.y + 14 < plat.y + 12) {
      p.setVelocityY(-580);
      soundFx.playJump();

      // If fragile, break platform
      if (plat.getData('type') === 'fragile') {
        this.tweens.add({
          targets: plat,
          alpha: 0,
          scaleY: 0,
          duration: 150,
          onComplete: () => plat.destroy(),
        });
      }
    }
  }

  private handleSpringLand(playerObj: any, springObj: any) {
    const p = playerObj as Phaser.Physics.Arcade.Sprite;
    const spring = springObj as Phaser.Physics.Arcade.Sprite;

    if (p.body && p.body.velocity.y > 0) {
      p.setVelocityY(-920); // Massive rocket bounce!
      soundFx.playPowerup();

      this.tweens.add({
        targets: spring,
        scaleY: 0.4,
        y: spring.y + 6,
        yoyo: true,
        duration: 100,
      });

      this.score += 50;
      this.callbacks.onScoreUpdate(this.score);
    }
  }

  private handleGameOver() {
    this.isGameOver = true;
    this.isGameActive = false;
    this.physics.pause();
    soundFx.playGameOver();
    const earnedCoins = Math.floor(this.score / 60);
    this.callbacks.onGameOver(this.score, earnedCoins);
  }

  public pauseGame() {
    this.isPaused = true;
    this.physics.pause();
    this.callbacks.onGamePaused?.();
  }

  public resumeGame() {
    this.isPaused = false;
    this.physics.resume();
    this.callbacks.onGameResumed?.();
  }

  public restartGame() {
    this.physics.resume();
    this.buildInitialWorld();
    this.startGame();
  }
}
