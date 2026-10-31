import Phaser from 'phaser';
import { GameBridgeCallbacks, GameSkinConfig } from '../../common/GameBridge';
import { soundFx } from '../../common/SoundFx';

export class TrafficRacerScene extends Phaser.Scene {
  private callbacks: GameBridgeCallbacks;
  private skin: GameSkinConfig;

  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private roadStripes: Phaser.GameObjects.Rectangle[] = [];
  private trafficGroup!: Phaser.Physics.Arcade.Group;
  private coinGroup!: Phaser.Physics.Arcade.Group;

  public isGameActive = false;
  private isGameOver = false;
  private isPaused = false;
  private score = 0;
  private coins = 0;
  private baseSpeed = 380;
  private currentSpeed = 380;
  private distanceTravelled = 0;
  private spawnTimer = 0;
  private coinTimer = 0;

  // Lanes X coordinates for 4-lane highway (Canvas width 480, height 720)
  private lanes = [105, 195, 285, 375];

  // Mobile input state
  public touchDirection: number = 0; // -1 for left, 1 for right, 0 for none
  public touchBoost: boolean = false;

  constructor(callbacks: GameBridgeCallbacks, skin: GameSkinConfig) {
    super({ key: 'TrafficRacerScene' });
    this.callbacks = callbacks;
    this.skin = skin;
  }

  preload() {
    this.generateProceduralTextures();
  }

  private generateProceduralTextures() {
    // 1. Player Car Texture
    if (!this.textures.exists(`player_car_${this.skin.id}`)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      const pColor = Phaser.Display.Color.HexStringToColor(this.skin.primaryColor).color;
      const sColor = Phaser.Display.Color.HexStringToColor(this.skin.secondaryColor || '#FFFFFF').color;

      // Shadow
      g.fillStyle(0x000000, 0.4);
      g.fillRoundedRect(4, 4, 46, 84, 12);

      // Car body
      g.fillStyle(pColor, 1);
      g.fillRoundedRect(5, 5, 44, 80, 10);

      // Roof / Cabin
      g.fillStyle(0x0F172A, 1);
      g.fillRoundedRect(11, 24, 32, 42, 6);

      // Windshield
      g.fillStyle(0x38BDF8, 0.85);
      g.fillRoundedRect(13, 26, 28, 14, 4);

      // Rear window
      g.fillStyle(0x1E293B, 1);
      g.fillRoundedRect(14, 52, 26, 10, 3);

      // Racing stripe
      g.fillStyle(sColor, 0.8);
      g.fillRect(25, 5, 4, 80);

      // Headlights
      g.fillStyle(0xFEF08A, 1);
      g.fillCircle(11, 8, 3);
      g.fillCircle(43, 8, 3);

      // Taillights
      g.fillStyle(0xEF4444, 1);
      g.fillRect(10, 81, 7, 3);
      g.fillRect(37, 81, 7, 3);

      g.generateTexture(`player_car_${this.skin.id}`, 54, 90);
      g.destroy();
    }

    // 2. Traffic Sedan (Blue)
    if (!this.textures.exists('traffic_sedan')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x0284C7, 1);
      g.fillRoundedRect(4, 4, 44, 76, 8);
      g.fillStyle(0x0F172A, 1);
      g.fillRoundedRect(10, 22, 32, 38, 5);
      g.fillStyle(0x94A3B8, 0.8);
      g.fillRoundedRect(12, 24, 28, 12, 3);
      g.fillStyle(0xEF4444, 1);
      g.fillRect(9, 76, 7, 3);
      g.fillRect(36, 76, 7, 3);
      g.generateTexture('traffic_sedan', 52, 84);
      g.destroy();
    }

    // 3. Traffic Truck (Amber/Orange)
    if (!this.textures.exists('traffic_truck')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xD97706, 1);
      g.fillRoundedRect(4, 4, 48, 108, 6);
      g.fillStyle(0x78350F, 1);
      g.fillRect(6, 32, 44, 76);
      g.fillStyle(0x0F172A, 1);
      g.fillRoundedRect(10, 10, 36, 18, 4);
      g.fillStyle(0xEF4444, 1);
      g.fillRect(8, 107, 8, 3);
      g.fillRect(38, 107, 8, 3);
      g.generateTexture('traffic_truck', 56, 114);
      g.destroy();
    }

    // 4. Traffic Sports Car (Emerald)
    if (!this.textures.exists('traffic_sports')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x10B981, 1);
      g.fillRoundedRect(4, 4, 44, 80, 12);
      g.fillStyle(0x064E3B, 1);
      g.fillRoundedRect(10, 24, 32, 40, 6);
      g.fillStyle(0x6EE7B7, 0.8);
      g.fillRoundedRect(12, 26, 28, 12, 4);
      g.fillStyle(0xEF4444, 1);
      g.fillRect(9, 80, 8, 3);
      g.fillRect(35, 80, 8, 3);
      g.generateTexture('traffic_sports', 52, 88);
      g.destroy();
    }

    // 5. Coin Texture
    if (!this.textures.exists('highway_coin')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xFBBF24, 1);
      g.fillCircle(14, 14, 12);
      g.lineStyle(2, 0xD97706, 1);
      g.strokeCircle(14, 14, 11);
      g.fillStyle(0x78350F, 1);
      g.fillRect(13, 8, 2, 12);
      g.generateTexture('highway_coin', 28, 28);
      g.destroy();
    }

    // 6. Particle Spark
    if (!this.textures.exists('particle_spark')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xFEF08A, 1);
      g.fillCircle(4, 4, 4);
      g.generateTexture('particle_spark', 8, 8);
      g.destroy();
    }
  }

  create() {
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.currentSpeed = this.baseSpeed;
    this.distanceTravelled = 0;

    const width = 480;
    const height = 720;

    // Road Background (Asphalt & grass shoulders)
    this.add.rectangle(width / 2, height / 2, width, height, 0x111827);
    this.add.rectangle(30, height / 2, 60, height, 0x064E3B);
    this.add.rectangle(width - 30, height / 2, 60, height, 0x064E3B);
    this.add.rectangle(62, height / 2, 6, height, 0xEF4444);
    this.add.rectangle(width - 62, height / 2, 6, height, 0xEF4444);

    // Highway Dashed Lanes (3 divider lines separating 4 lanes)
    const dividerX = [150, 240, 330];
    this.roadStripes = [];
    dividerX.forEach(x => {
      for (let y = -40; y < height + 80; y += 60) {
        const stripe = this.add.rectangle(x, y, 4, 32, 0xF8FAFC, 0.7);
        this.roadStripes.push(stripe);
      }
    });

    // Player Car Setup
    this.player = this.physics.add.sprite(240, 580, `player_car_${this.skin.id}`);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(38, 74);

    // Groups
    this.trafficGroup = this.physics.add.group();
    this.coinGroup = this.physics.add.group();

    // Input Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    // Collisions
    this.physics.add.overlap(this.player, this.trafficGroup, this.handleCrash, undefined, this);
    this.physics.add.overlap(this.player, this.coinGroup, this.handleCollectCoin, undefined, this);
  }

  public startGame() {
    this.isGameActive = true;
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.distanceTravelled = 0;
    this.currentSpeed = this.baseSpeed;
    this.trafficGroup.clear(true, true);
    this.coinGroup.clear(true, true);
    this.player.setPosition(240, 580);
    this.player.setVelocity(0, 0);
    this.player.clearTint();
    this.callbacks.onGameStarted?.();
  }

  update(time: number, delta: number) {
    if (!this.isGameActive || this.isGameOver || this.isPaused) return;

    const dt = delta / 1000;

    // Gradual difficulty / speed scaling
    this.currentSpeed = Math.min(850, this.baseSpeed + this.distanceTravelled * 0.12);

    // Boost acceleration
    let effectiveSpeed = this.currentSpeed;
    if (this.cursors?.up.isDown || this.wasd?.up.isDown || this.touchBoost) {
      effectiveSpeed *= 1.35;
    } else if (this.cursors?.down.isDown || this.wasd?.down.isDown) {
      effectiveSpeed *= 0.65;
    }

    // Scroll road markings
    const scrollDelta = effectiveSpeed * dt;
    this.roadStripes.forEach(stripe => {
      stripe.y += scrollDelta;
      if (stripe.y > 760) {
        stripe.y -= 840;
      }
    });

    // Steer Player
    const steerSpeed = 340;
    let moveX = 0;
    if (this.cursors?.left.isDown || this.wasd?.left.isDown || this.touchDirection < 0) {
      moveX = -steerSpeed;
      this.player.setAngle(-6);
    } else if (this.cursors?.right.isDown || this.wasd?.right.isDown || this.touchDirection > 0) {
      moveX = steerSpeed;
      this.player.setAngle(6);
    } else {
      this.player.setAngle(0);
    }

    this.player.setVelocityX(moveX);

    // Keep player strictly in road boundaries (between shoulders)
    if (this.player.x < 90) this.player.x = 90;
    if (this.player.x > 390) this.player.x = 390;

    // Distance tracking & score update
    this.distanceTravelled += (effectiveSpeed * dt) / 10;
    this.score = Math.floor(this.distanceTravelled + this.coins * 15);
    this.callbacks.onScoreUpdate(this.score);

    // Traffic Spawning
    this.spawnTimer += delta;
    const spawnInterval = Math.max(700, 1900 - this.distanceTravelled * 0.6);
    if (this.spawnTimer > spawnInterval) {
      this.spawnTimer = 0;
      this.spawnTrafficVehicle(effectiveSpeed);
    }

    // Coin Spawning
    this.coinTimer += delta;
    if (this.coinTimer > 2400) {
      this.coinTimer = 0;
      this.spawnCoin(effectiveSpeed);
    }

    // Move & Cleanup Traffic
    this.trafficGroup.getChildren().forEach((child: any) => {
      const vehicle = child as Phaser.Physics.Arcade.Sprite;
      const vSpeed = (vehicle.getData('speed') || 180);
      vehicle.y += (effectiveSpeed - vSpeed) * dt;

      // Close overtake bonus detection
      if (!vehicle.getData('overtaken') && vehicle.y > this.player.y && Math.abs(vehicle.x - this.player.x) < 70) {
        vehicle.setData('overtaken', true);
        this.score += 25;
        this.showScoreFloat(vehicle.x, vehicle.y, '+25 CLOSE!');
        soundFx.playPowerup();
      }

      if (vehicle.y > 800 || vehicle.y < -300) {
        vehicle.destroy();
      }
    });

    // Move & Cleanup Coins
    this.coinGroup.getChildren().forEach((child: any) => {
      const coin = child as Phaser.Physics.Arcade.Sprite;
      coin.y += effectiveSpeed * dt;
      if (coin.y > 760) {
        coin.destroy();
      }
    });
  }

  private spawnTrafficVehicle(playerSpeed: number) {
    const laneIndex = Phaser.Math.Between(0, this.lanes.length - 1);
    const laneX = this.lanes[laneIndex];

    const types = ['traffic_sedan', 'traffic_truck', 'traffic_sports'];
    const selectedType = Phaser.Utils.Array.GetRandom(types);

    const vehicle = this.physics.add.sprite(laneX, -120, selectedType);
    this.trafficGroup.add(vehicle);

    // Relative speed assigned based on vehicle type
    let naturalSpeed = 160;
    if (selectedType === 'traffic_sports') naturalSpeed = 240;
    if (selectedType === 'traffic_truck') naturalSpeed = 120;

    vehicle.setData('speed', naturalSpeed);
    vehicle.setData('overtaken', false);
    vehicle.body?.setSize(38, vehicle.height - 10);
  }

  private spawnCoin(playerSpeed: number) {
    const laneIndex = Phaser.Math.Between(0, this.lanes.length - 1);
    const laneX = this.lanes[laneIndex];
    const coin = this.physics.add.sprite(laneX, -60, 'highway_coin');
    this.coinGroup.add(coin);
  }

  private handleCollectCoin(playerObj: any, coinObj: any) {
    const coin = coinObj as Phaser.Physics.Arcade.Sprite;
    coin.destroy();
    this.coins += 1;
    soundFx.playCoin();
    this.callbacks.onCoinCollected(this.coins);
    this.showScoreFloat(playerObj.x, playerObj.y - 40, '+1 COIN', '#FBBF24');
  }

  private handleCrash() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isGameActive = false;

    soundFx.playCrash();
    soundFx.playExplosion();

    // Spawn crash particles
    const emitter = this.add.particles(this.player.x, this.player.y, 'particle_spark', {
      speed: { min: 80, max: 260 },
      scale: { start: 1.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 600,
      quantity: 35,
    });

    this.player.setTint(0xEF4444);
    this.player.setVelocity(0, 0);

    this.time.delayedCall(400, () => {
      emitter.destroy();
      soundFx.playGameOver();
      this.callbacks.onGameOver(this.score, this.coins);
    });
  }

  private showScoreFloat(x: number, y: number, text: string, color = '#38BDF8') {
    const floatText = this.add.text(x, y, text, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      color: color,
      stroke: '#0B0F19',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: floatText,
      y: y - 40,
      alpha: 0,
      duration: 700,
      onComplete: () => floatText.destroy(),
    });
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
