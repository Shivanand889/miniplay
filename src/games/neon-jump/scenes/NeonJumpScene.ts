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

  private isGameOver = false;
  private isPaused = false;
  private score = 0;
  private maxHeight = 0;
  private highestY = 600;
  private nextPlatformY = 560;

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

    // 2. Static Platform (Cyan/Green)
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

    // 3. Moving Platform (Purple)
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
      // Dashed line indicating fragile
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
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.maxHeight = 0;
    this.highestY = 600;
    this.nextPlatformY = 560;

    const width = 480;
    const height = 720;

    // Cosmic background stars
    this.stars = [];
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(10, width - 10);
      const y = Phaser.Math.Between(0, height);
      const r = Phaser.Math.FloatBetween(1, 2.5);
      const star = this.add.circle(x, y, r, 0x38BDF8, Phaser.Math.FloatBetween(0.3, 0.8));
      this.stars.push(star);
    }

    // Groups
    this.platforms = this.physics.add.group();
    this.springs = this.physics.add.group();

    // Initial base platform directly below player
    const basePlat = this.platforms.create(240, 650, 'plat_static');
    basePlat.body.immovable = true;
    basePlat.body.checkCollision.down = false;
    basePlat.body.checkCollision.left = false;
    basePlat.body.checkCollision.right = false;

    // Spawn starting ladder of platforms up to top of screen
    while (this.nextPlatformY > -200) {
      this.spawnPlatform(this.nextPlatformY);
      this.nextPlatformY -= Phaser.Math.Between(75, 115);
    }

    // Player setup
    this.player = this.physics.add.sprite(240, 580, `jumper_${this.skin.id}`);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(false);
    this.player.body?.setSize(28, 28);
    this.player.setVelocityY(-450); // Initial jump boost

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

    this.callbacks.onGameStarted?.();
  }

  update(time: number, delta: number) {
    if (this.isGameOver || this.isPaused) return;

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
        const moveSpeed = plat.getData('speed') || 100;
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

    // Camera scrolling upward smoothly when player climbs into upper half of screen
    const thresholdY = 320;
    if (this.player.y < thresholdY) {
      const diff = thresholdY - this.player.y;
      this.player.y = thresholdY;

      // Scroll all world elements down by diff
      this.platforms.getChildren().forEach((p: any) => {
        p.y += diff;
      });
      this.springs.getChildren().forEach((s: any) => {
        s.y += diff;
      });

      // Shift nextPlatformY down by diff
      this.nextPlatformY += diff;

      // Track height and score
      this.maxHeight += Math.floor(diff);
      this.score = Math.floor(this.maxHeight / 5);
      this.callbacks.onScoreUpdate(this.score);

      // Coins earned periodically every 100 points
      const earnedCoins = Math.floor(this.score / 100);
      this.callbacks.onCoinCollected(earnedCoins);
    }

    // Clean up platforms that have scrolled off the bottom
    this.platforms.getChildren().forEach((p: any) => {
      if (p.y > 750) {
        p.destroy();
      }
    });
    this.springs.getChildren().forEach((s: any) => {
      if (s.y > 750) {
        s.destroy();
      }
    });

    // Procedurally spawn new platforms above the screen
    while (this.nextPlatformY > -80) {
      this.spawnPlatform(this.nextPlatformY);
      // Distance between platforms scales gently with score
      const spacing = Phaser.Math.Between(80, Math.min(145, 90 + Math.floor(this.score / 60)));
      this.nextPlatformY -= spacing;
    }

    // Check Fall Death (fell off bottom of screen)
    if (this.player.y > 740 && !this.isGameOver) {
      this.handleGameOver();
    }
  }

  private spawnPlatform(y: number) {
    const x = Phaser.Math.Between(55, 425);
    const rand = Math.random();

    let texture = 'plat_static';
    let type = 'static';

    if (rand < 0.28 && this.score > 80) {
      texture = 'plat_moving';
      type = 'moving';
    } else if (rand < 0.45 && this.score > 150) {
      texture = 'plat_fragile';
      type = 'fragile';
    }

    const plat = this.platforms.create(x, y, texture);
    plat.body.immovable = true;
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;
    plat.setData('type', type);

    if (type === 'moving') {
      plat.setData('minX', Math.max(50, x - 90));
      plat.setData('maxX', Math.min(430, x + 90));
      plat.setData('dir', Math.random() > 0.5 ? 1 : -1);
      plat.setData('speed', Phaser.Math.Between(90, 160));
    }

    // Chance to spawn super spring on static platforms
    if (type === 'static' && Math.random() < 0.18) {
      const spring = this.springs.create(x, y - 16, 'power_spring');
      spring.body.immovable = true;
    }
  }

  private handlePlatformLand(playerObj: any, platObj: any) {
    const p = playerObj as Phaser.Physics.Arcade.Sprite;
    const plat = platObj as Phaser.Physics.Arcade.Sprite;

    // Only bounce if falling downward and player's feet are above or near the platform top
    if (p.body && p.body.velocity.y > 0 && p.y + 16 < plat.y + 12) {
      p.setVelocityY(-560);
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

      // Spring compression bounce effect
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
    this.scene.restart();
  }
}
