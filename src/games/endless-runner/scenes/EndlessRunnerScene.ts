import Phaser from 'phaser';
import { GameBridgeCallbacks, GameSkinConfig } from '../../common/GameBridge';
import { soundFx } from '../../common/SoundFx';

export class EndlessRunnerScene extends Phaser.Scene {
  private callbacks: GameBridgeCallbacks;
  private skin: GameSkinConfig;

  private player!: Phaser.Physics.Arcade.Sprite;
  private shieldGraphic!: Phaser.GameObjects.Arc;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private lanes = [130, 240, 350];
  private currentLaneIndex = 1; // Center lane

  private trackLines: Phaser.GameObjects.Line[] = [];
  private obstaclesGroup!: Phaser.Physics.Arcade.Group;
  private coinsGroup!: Phaser.Physics.Arcade.Group;
  private powerupsGroup!: Phaser.Physics.Arcade.Group;

  public isGameActive = false;
  private isGameOver = false;
  private isPaused = false;
  private score = 0;
  private coins = 0;
  private distance = 0;
  private speed = 420;

  // Player state: 'running' | 'jumping' | 'sliding'
  private playerState: 'running' | 'jumping' | 'sliding' = 'running';
  private stateTimer = 0;

  // Power-up states
  private hasShield = false;
  private magnetTimer = 0;
  private multiplierTimer = 0;

  private spawnTimer = 0;
  private coinTimer = 0;

  constructor(callbacks: GameBridgeCallbacks, skin: GameSkinConfig) {
    super({ key: 'EndlessRunnerScene' });
    this.callbacks = callbacks;
    this.skin = skin;
  }

  preload() {
    this.generateProceduralTextures();
  }

  private generateProceduralTextures() {
    // 1. Runner Character Texture (Running)
    if (!this.textures.exists(`runner_${this.skin.id}`)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      const pColor = Phaser.Display.Color.HexStringToColor(this.skin.primaryColor).color;
      const sColor = Phaser.Display.Color.HexStringToColor(this.skin.secondaryColor || '#FFFFFF').color;

      // Shadow
      g.fillStyle(0x000000, 0.4);
      g.fillEllipse(24, 76, 20, 6);

      // Torso & Cyber suit
      g.fillStyle(pColor, 1);
      g.fillRoundedRect(12, 28, 24, 30, 6);
      g.lineStyle(2, sColor, 1);
      g.strokeRoundedRect(12, 28, 24, 30, 6);

      // Cyber Visor / Head
      g.fillStyle(0x1E293B, 1);
      g.fillCircle(24, 16, 12);
      g.fillStyle(0x38BDF8, 1);
      g.fillRoundedRect(16, 13, 16, 6, 2);

      // Legs
      g.fillStyle(sColor, 1);
      g.fillRect(15, 58, 6, 18);
      g.fillRect(27, 58, 6, 18);

      g.generateTexture(`runner_${this.skin.id}`, 48, 80);
      g.destroy();
    }

    // 2. Hurdle (Low hurdle - Requires Jump)
    if (!this.textures.exists('obs_hurdle')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xDC2626, 1);
      g.fillRoundedRect(2, 6, 68, 20, 4);
      g.lineStyle(2, 0xFCA5A5, 1);
      g.strokeRoundedRect(2, 6, 68, 20, 4);
      // Hazard stripes
      g.fillStyle(0xFEF08A, 1);
      g.fillRect(12, 8, 10, 16);
      g.fillRect(32, 8, 10, 16);
      g.fillRect(52, 8, 10, 16);
      g.generateTexture('obs_hurdle', 72, 28);
      g.destroy();
    }

    // 3. High Overhead Barrier (Requires Slide)
    if (!this.textures.exists('obs_barrier')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Legs on sides
      g.fillStyle(0xF59E0B, 1);
      g.fillRect(4, 0, 6, 64);
      g.fillRect(62, 0, 6, 64);
      // Overhead warning beam (leaves bottom 24px clear for sliding!)
      g.fillRoundedRect(0, 0, 72, 28, 4);
      g.lineStyle(2, 0xFEF08A, 1);
      g.strokeRoundedRect(0, 0, 72, 28, 4);
      g.fillStyle(0x000000, 0.8);
      g.fillRect(16, 8, 40, 12);
      g.generateTexture('obs_barrier', 72, 64);
      g.destroy();
    }

    // 4. Solid Block (Requires lane change)
    if (!this.textures.exists('obs_block')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x475569, 1);
      g.fillRoundedRect(2, 2, 68, 64, 8);
      g.lineStyle(3, 0x94A3B8, 1);
      g.strokeRoundedRect(2, 2, 68, 64, 8);
      g.fillStyle(0xEF4444, 1);
      g.fillCircle(36, 34, 14);
      g.generateTexture('obs_block', 72, 68);
      g.destroy();
    }

    // 5. Runner Coin
    if (!this.textures.exists('runner_coin')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xFBBF24, 1);
      g.fillCircle(12, 12, 10);
      g.lineStyle(2, 0xD97706, 1);
      g.strokeCircle(12, 12, 9);
      g.generateTexture('runner_coin', 24, 24);
      g.destroy();
    }

    // 6. Power-up: Shield
    if (!this.textures.exists('pow_shield')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x0284C7, 1);
      g.fillCircle(16, 16, 14);
      g.lineStyle(2, 0x38BDF8, 1);
      g.strokeCircle(16, 16, 13);
      g.fillStyle(0xFFFFFF, 1);
      g.fillRect(14, 8, 4, 16);
      g.fillRect(8, 14, 16, 4);
      g.generateTexture('pow_shield', 32, 32);
      g.destroy();
    }

    // 7. Power-up: Magnet
    if (!this.textures.exists('pow_magnet')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xDC2626, 1);
      g.fillCircle(16, 16, 14);
      g.lineStyle(2, 0xF87171, 1);
      g.strokeCircle(16, 16, 13);
      g.fillStyle(0xFFFFFF, 1);
      g.fillRect(11, 10, 10, 12);
      g.fillStyle(0xDC2626, 1);
      g.fillRect(14, 13, 4, 9);
      g.generateTexture('pow_magnet', 32, 32);
      g.destroy();
    }
  }

  create() {
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.distance = 0;
    this.speed = 420;
    this.playerState = 'running';
    this.hasShield = false;
    this.magnetTimer = 0;
    this.multiplierTimer = 0;
    this.currentLaneIndex = 1;

    const width = 480;
    const height = 720;

    // Track Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0B0F19);

    // Track 3 Lanes Canvas
    this.add.rectangle(width / 2, height / 2, 360, height, 0x111827);

    // Lane dividing lines
    this.add.line(0, 0, 185, 0, 185, height, 0x38BDF8, 0.4).setOrigin(0);
    this.add.line(0, 0, 295, 0, 295, height, 0x38BDF8, 0.4).setOrigin(0);

    // Outer track borders
    this.add.line(0, 0, 60, 0, 60, height, 0x6366F1, 0.8).setOrigin(0);
    this.add.line(0, 0, 420, 0, 420, height, 0x6366F1, 0.8).setOrigin(0);

    // Horizontal Scrolling Gridlines
    this.trackLines = [];
    for (let y = 0; y < height + 80; y += 60) {
      const line = this.add.line(0, 0, 60, y, 420, y, 0x1E293B, 0.8).setOrigin(0);
      this.trackLines.push(line);
    }

    // Groups
    this.obstaclesGroup = this.physics.add.group();
    this.coinsGroup = this.physics.add.group();
    this.powerupsGroup = this.physics.add.group();

    // Player Sprite
    this.player = this.physics.add.sprite(this.lanes[this.currentLaneIndex], 570, `runner_${this.skin.id}`);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(32, 64);

    // Shield graphic bubble (hidden initially)
    this.shieldGraphic = this.add.circle(this.player.x, this.player.y, 38, 0x38BDF8, 0.35);
    this.shieldGraphic.setStrokeStyle(2, 0x7DD3FC, 0.9);
    this.shieldGraphic.setVisible(false);

    // Inputs
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };

      // Keyboard JustDown events
      this.input.keyboard.on('keydown-LEFT', () => this.changeLane(-1));
      this.input.keyboard.on('keydown-A', () => this.changeLane(-1));
      this.input.keyboard.on('keydown-RIGHT', () => this.changeLane(1));
      this.input.keyboard.on('keydown-D', () => this.changeLane(1));
      this.input.keyboard.on('keydown-UP', () => this.jump());
      this.input.keyboard.on('keydown-W', () => this.jump());
      this.input.keyboard.on('keydown-SPACE', () => this.jump());
      this.input.keyboard.on('keydown-DOWN', () => this.slide());
      this.input.keyboard.on('keydown-S', () => this.slide());
    }

    // Overlaps
    this.physics.add.overlap(this.player, this.obstaclesGroup, this.handleObstacleHit, undefined, this);
    this.physics.add.overlap(this.player, this.coinsGroup, this.handleCollectCoin, undefined, this);
    this.physics.add.overlap(this.player, this.powerupsGroup, this.handleCollectPowerup, undefined, this);
  }

  public startGame() {
    this.isGameActive = true;
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.distance = 0;
    this.speed = 420;
    this.playerState = 'running';
    this.hasShield = false;
    this.magnetTimer = 0;
    this.multiplierTimer = 0;
    this.currentLaneIndex = 1;
    this.obstaclesGroup.clear(true, true);
    this.coinsGroup.clear(true, true);
    this.powerupsGroup.clear(true, true);
    this.player.setPosition(this.lanes[1], 570);
    this.player.setScale(1);
    this.player.clearTint();
    this.callbacks.onGameStarted?.();
  }

  public changeLane(dir: number) {
    if (this.isGameOver || this.isPaused) return;
    const targetIndex = Phaser.Math.Clamp(this.currentLaneIndex + dir, 0, 2);
    if (targetIndex !== this.currentLaneIndex) {
      this.currentLaneIndex = targetIndex;
      soundFx.playClick();
      this.tweens.add({
        targets: this.player,
        x: this.lanes[this.currentLaneIndex],
        duration: 120,
        ease: 'Cubic.easeOut',
      });
    }
  }

  public jump() {
    if (this.isGameOver || this.isPaused || this.playerState !== 'running') return;
    this.playerState = 'jumping';
    this.stateTimer = 550; // Jump duration ms
    soundFx.playJump();

    this.tweens.add({
      targets: this.player,
      y: 460,
      scaleY: 1.1,
      yoyo: true,
      duration: 275,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.playerState = 'running';
        this.player.y = 570;
        this.player.setScale(1);
      },
    });
  }

  public slide() {
    if (this.isGameOver || this.isPaused || this.playerState !== 'running') return;
    this.playerState = 'sliding';
    this.stateTimer = 550;
    soundFx.playSlice();

    // Shrink player scale Y for slide under overhead barrier
    this.tweens.add({
      targets: this.player,
      scaleY: 0.45,
      y: 595,
      yoyo: true,
      duration: 275,
      onComplete: () => {
        this.playerState = 'running';
        this.player.y = 570;
        this.player.setScale(1);
      },
    });
  }

  update(time: number, delta: number) {
    if (!this.isGameActive || this.isGameOver || this.isPaused) return;

    const dt = delta / 1000;

    // Speed progression
    this.speed = Math.min(800, 420 + this.distance * 0.15);

    // Scroll track lines
    const dy = this.speed * dt;
    this.trackLines.forEach(line => {
      line.y += dy;
      if (line.y > 740) {
        line.y -= 780;
      }
    });

    // Distance & Score
    const multiplier = this.multiplierTimer > 0 ? 2 : 1;
    this.distance += (this.speed * dt) / 8;
    this.score = Math.floor((this.distance + this.coins * 10) * multiplier);
    this.callbacks.onScoreUpdate(this.score);

    // Timers
    if (this.magnetTimer > 0) this.magnetTimer -= dt;
    if (this.multiplierTimer > 0) this.multiplierTimer -= dt;

    // Shield graphic follow player
    this.shieldGraphic.setPosition(this.player.x, this.player.y);
    this.shieldGraphic.setVisible(this.hasShield);

    // Coin Magnet attraction: pull coins towards player
    if (this.magnetTimer > 0) {
      this.coinsGroup.getChildren().forEach((c: any) => {
        const coin = c as Phaser.Physics.Arcade.Sprite;
        const dx = this.player.x - coin.x;
        const dist = Math.abs(dx);
        if (dist > 5) {
          coin.x += Math.sign(dx) * 450 * dt;
        }
      });
    }

    // Spawn Obstacles
    this.spawnTimer += delta;
    const spawnRate = Math.max(700, 1600 - this.distance * 0.5);
    if (this.spawnTimer > spawnRate) {
      this.spawnTimer = 0;
      this.spawnObstacle();
    }

    // Spawn Coins & Powerups
    this.coinTimer += delta;
    if (this.coinTimer > 1800) {
      this.coinTimer = 0;
      this.spawnCoinPattern();
    }

    // Move & Cleanup Obstacles
    this.obstaclesGroup.getChildren().forEach((obs: any) => {
      obs.y += this.speed * dt;
      if (obs.y > 760) obs.destroy();
    });

    // Move & Cleanup Coins
    this.coinsGroup.getChildren().forEach((coin: any) => {
      coin.y += this.speed * dt;
      if (coin.y > 760) coin.destroy();
    });

    // Move & Cleanup Powerups
    this.powerupsGroup.getChildren().forEach((p: any) => {
      p.y += this.speed * dt;
      if (p.y > 760) p.destroy();
    });
  }

  private spawnObstacle() {
    const laneIdx = Phaser.Math.Between(0, 2);
    const laneX = this.lanes[laneIdx];

    const types = ['obs_hurdle', 'obs_barrier', 'obs_block'];
    const selected = Phaser.Utils.Array.GetRandom(types);

    const obs = this.physics.add.sprite(laneX, -60, selected);
    obs.setData('type', selected);
    this.obstaclesGroup.add(obs);
  }

  private spawnCoinPattern() {
    // 85% coins, 15% power-up
    const laneIdx = Phaser.Math.Between(0, 2);
    const laneX = this.lanes[laneIdx];

    if (Math.random() < 0.15) {
      const powType = Math.random() > 0.5 ? 'pow_shield' : 'pow_magnet';
      const pow = this.physics.add.sprite(laneX, -60, powType);
      pow.setData('type', powType);
      this.powerupsGroup.add(pow);
    } else {
      // Line of 3 coins
      for (let i = 0; i < 3; i++) {
        const coin = this.physics.add.sprite(laneX, -50 - i * 40, 'runner_coin');
        this.coinsGroup.add(coin);
      }
    }
  }

  private handleObstacleHit(playerObj: any, obsObj: any) {
    if (this.isGameOver) return;
    const obs = obsObj as Phaser.Physics.Arcade.Sprite;
    const type = obs.getData('type');

    // Rule 1: Hurdle can be cleared by JUMPING
    if (type === 'obs_hurdle' && this.playerState === 'jumping') {
      return; // Successfully leapt over hurdle!
    }

    // Rule 2: Barrier can be cleared by SLIDING
    if (type === 'obs_barrier' && this.playerState === 'sliding') {
      return; // Successfully slid under overhead beam!
    }

    // Collided with obstacle!
    if (this.hasShield) {
      // Shield absorbs hit
      this.hasShield = false;
      obs.destroy();
      soundFx.playExplosion();
      this.cameras.main.shake(150, 0.01);
      return;
    }

    // Fatal Crash
    this.isGameOver = true;
    this.isGameActive = false;
    soundFx.playCrash();
    soundFx.playGameOver();

    this.player.setTint(0xEF4444);
    this.time.delayedCall(300, () => {
      this.callbacks.onGameOver(this.score, this.coins);
    });
  }

  private handleCollectCoin(playerObj: any, coinObj: any) {
    coinObj.destroy();
    this.coins += 1;
    soundFx.playCoin();
    this.callbacks.onCoinCollected(this.coins);
  }

  private handleCollectPowerup(playerObj: any, powObj: any) {
    const pow = powObj as Phaser.Physics.Arcade.Sprite;
    const type = pow.getData('type');
    pow.destroy();

    soundFx.playPowerup();

    if (type === 'pow_shield') {
      this.hasShield = true;
    } else if (type === 'pow_magnet') {
      this.magnetTimer = 8; // 8 seconds magnet
    }
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
    this.startGame();
  }
}
