import Phaser from 'phaser';
import { GameBridgeCallbacks, GameSkinConfig } from '../../common/GameBridge';
import { soundFx } from '../../common/SoundFx';

interface BladePoint {
  x: number;
  y: number;
  time: number;
}

export class FruitSlashScene extends Phaser.Scene {
  private callbacks: GameBridgeCallbacks;
  private skin: GameSkinConfig;

  private bladeTrailGraphics!: Phaser.GameObjects.Graphics;
  private bladePoints: BladePoint[] = [];

  private fruitsGroup!: Phaser.Physics.Arcade.Group;
  private slicedGroup!: Phaser.Physics.Arcade.Group;
  private bombsGroup!: Phaser.Physics.Arcade.Group;

  public isGameActive = false;
  private isGameOver = false;
  private isPaused = false;
  private score = 0;
  private coins = 0;
  private missedCount = 0;
  private maxMisses = 3;

  private tossTimer = 0;
  private tossInterval = 1800;

  // Combo system
  private recentSlices: number[] = [];

  constructor(callbacks: GameBridgeCallbacks, skin: GameSkinConfig) {
    super({ key: 'FruitSlashScene' });
    this.callbacks = callbacks;
    this.skin = skin;
  }

  preload() {
    this.generateProceduralTextures();
  }

  private generateProceduralTextures() {
    // 1. Watermelon
    if (!this.textures.exists('fruit_watermelon')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x15803D, 1);
      g.fillCircle(30, 30, 28);
      g.fillStyle(0x166534, 1);
      g.fillRect(10, 8, 5, 44);
      g.fillRect(27, 6, 6, 48);
      g.fillRect(45, 8, 5, 44);
      g.generateTexture('fruit_watermelon', 60, 60);
      g.destroy();
    }

    // 2. Watermelon Half
    if (!this.textures.exists('fruit_watermelon_half')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x15803D, 1);
      g.beginPath();
      g.arc(30, 30, 28, Math.PI / 2, (3 * Math.PI) / 2, false);
      g.fillPath();
      g.fillStyle(0xEF4444, 1);
      g.beginPath();
      g.arc(30, 30, 23, Math.PI / 2, (3 * Math.PI) / 2, false);
      g.fillPath();
      g.fillStyle(0x000000, 1);
      g.fillCircle(18, 22, 2.5);
      g.fillCircle(18, 38, 2.5);
      g.generateTexture('fruit_watermelon_half', 32, 60);
      g.destroy();
    }

    // 3. Orange
    if (!this.textures.exists('fruit_orange')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xF97316, 1);
      g.fillCircle(26, 26, 24);
      g.fillStyle(0xFDBA74, 1);
      g.fillCircle(26, 26, 20);
      g.fillStyle(0xEA580C, 1);
      g.fillCircle(26, 26, 16);
      g.generateTexture('fruit_orange', 52, 52);
      g.destroy();
    }

    // 4. Strawberry
    if (!this.textures.exists('fruit_strawberry')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xDC2626, 1);
      g.fillTriangle(22, 46, 4, 16, 40, 16);
      g.fillCircle(13, 16, 9);
      g.fillCircle(31, 16, 9);
      // Leaves
      g.fillStyle(0x22C55E, 1);
      g.fillTriangle(22, 4, 14, 16, 30, 16);
      g.generateTexture('fruit_strawberry', 44, 50);
      g.destroy();
    }

    // 5. Bomb
    if (!this.textures.exists('bomb_explosive')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x18181B, 1);
      g.fillCircle(28, 32, 24);
      g.lineStyle(2, 0x52525B, 1);
      g.strokeCircle(28, 32, 24);
      // Cap
      g.fillStyle(0x71717A, 1);
      g.fillRect(24, 4, 8, 8);
      // Spark
      g.fillStyle(0xF59E0B, 1);
      g.fillCircle(28, 3, 5);
      // Danger skull dots
      g.fillStyle(0xEF4444, 1);
      g.fillCircle(22, 30, 3.5);
      g.fillCircle(34, 30, 3.5);
      g.fillRect(24, 39, 8, 3);
      g.generateTexture('bomb_explosive', 56, 60);
      g.destroy();
    }

    // 6. Splatter Particle
    if (!this.textures.exists('splat_drop')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xEF4444, 1);
      g.fillCircle(4, 4, 4);
      g.generateTexture('splat_drop', 8, 8);
      g.destroy();
    }
  }

  create() {
    this.isGameActive = false;
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.missedCount = 0;
    this.tossInterval = 1800;
    this.bladePoints = [];
    this.recentSlices = [];

    const width = 480;
    const height = 720;

    // Dojo Dark Wood Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0F172A);
    for (let y = 0; y < height; y += 120) {
      this.add.line(0, 0, 0, y, width, y, 0x1E293B, 0.4).setOrigin(0);
    }

    // Blade Trail Graphics Layer
    this.bladeTrailGraphics = this.add.graphics();

    // Groups
    this.fruitsGroup = this.physics.add.group();
    this.slicedGroup = this.physics.add.group();
    this.bombsGroup = this.physics.add.group();

    // Pointer Input Handlers
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.isGameActive || this.isPaused || this.isGameOver) return;
      if (pointer.isDown) {
        this.addBladePoint(pointer.x, pointer.y);
        this.checkSliceCollisions(pointer.x, pointer.y);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.isGameActive || this.isPaused || this.isGameOver) return;
      this.addBladePoint(pointer.x, pointer.y);
      this.checkSliceCollisions(pointer.x, pointer.y);
    });
  }

  public startGame() {
    this.isGameActive = true;
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.missedCount = 0;
    this.fruitsGroup.clear(true, true);
    this.slicedGroup.clear(true, true);
    this.bombsGroup.clear(true, true);
    // Toss first fruit wave after 300ms
    this.tossTimer = this.tossInterval - 300;
    this.callbacks.onGameStarted?.();
  }

  private addBladePoint(x: number, y: number) {
    const now = Date.now();
    this.bladePoints.push({ x, y, time: now });
  }

  private checkSliceCollisions(px: number, py: number) {
    // 1. Check Bombs (Explosion!)
    this.bombsGroup.getChildren().forEach((b: any) => {
      const bomb = b as Phaser.Physics.Arcade.Sprite;
      if (bomb.active && Phaser.Math.Distance.Between(px, py, bomb.x, bomb.y) < 36) {
        this.detonateBomb(bomb);
      }
    });

    if (this.isGameOver) return;

    // 2. Check Fruits
    this.fruitsGroup.getChildren().forEach((f: any) => {
      const fruit = f as Phaser.Physics.Arcade.Sprite;
      if (fruit.active && Phaser.Math.Distance.Between(px, py, fruit.x, fruit.y) < 40) {
        this.sliceFruit(fruit);
      }
    });
  }

  private sliceFruit(fruit: Phaser.Physics.Arcade.Sprite) {
    const type = fruit.getData('type');
    const x = fruit.x;
    const y = fruit.y;
    fruit.destroy();

    soundFx.playSlice();

    // Juice splash particles
    const particleColor = type === 'fruit_orange' ? 0xF97316 : 0xEF4444;
    const emitter = this.add.particles(x, y, 'splat_drop', {
      speed: { min: 120, max: 260 },
      scale: { start: 1.2, end: 0 },
      tint: particleColor,
      lifespan: 400,
      quantity: 18,
    });
    this.time.delayedCall(450, () => emitter.destroy());

    // Spawn 2 separating halves
    const half1 = this.physics.add.sprite(x - 10, y, 'fruit_watermelon_half');
    half1.setVelocity(-200, -120);
    half1.setAngularVelocity(-260);

    const half2 = this.physics.add.sprite(x + 10, y, 'fruit_watermelon_half');
    half2.setFlipX(true);
    half2.setVelocity(200, -120);
    half2.setAngularVelocity(260);

    this.slicedGroup.add(half1);
    this.slicedGroup.add(half2);

    // Score & Combos
    const now = Date.now();
    this.recentSlices.push(now);
    this.recentSlices = this.recentSlices.filter(t => now - t <= 320);

    let pts = 10;
    if (this.recentSlices.length >= 3) {
      const comboMult = this.recentSlices.length;
      pts = 10 * comboMult;
      soundFx.playCombo();
      this.showComboPopup(x, y, `COMBO ${comboMult}X! +${pts}`);
      this.coins += 2;
    } else {
      if (Math.random() < 0.25) this.coins += 1;
    }

    this.score += pts;
    this.callbacks.onScoreUpdate(this.score);
    this.callbacks.onCoinCollected(this.coins);
  }

  private detonateBomb(bomb: Phaser.Physics.Arcade.Sprite) {
    bomb.destroy();
    this.isGameOver = true;
    this.isGameActive = false;
    soundFx.playExplosion();
    soundFx.playCrash();
    this.cameras.main.shake(400, 0.03);

    this.time.delayedCall(400, () => {
      soundFx.playGameOver();
      this.callbacks.onGameOver(this.score, this.coins);
    });
  }

  private showComboPopup(x: number, y: number, text: string) {
    const comboText = this.add.text(x, y - 20, text, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#FBBF24',
      stroke: '#0B0F19',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: comboText,
      y: y - 70,
      scale: 1.3,
      alpha: 0,
      duration: 800,
      onComplete: () => comboText.destroy(),
    });
  }

  update(time: number, delta: number) {
    if (!this.isGameActive || this.isGameOver || this.isPaused) {
      this.bladeTrailGraphics.clear();
      return;
    }

    this.renderBladeTrail();

    // Spawning waves of fruits & occasional bomb
    this.tossTimer += delta;
    this.tossInterval = Math.max(900, 1800 - Math.floor(this.score / 2));
    if (this.tossTimer > this.tossInterval) {
      this.tossTimer = 0;
      this.tossFruitWave();
    }

    // Check missed fruits falling off the screen bottom
    this.fruitsGroup.getChildren().forEach((f: any) => {
      const fruit = f as Phaser.Physics.Arcade.Sprite;

      // Mark entry when fruit has reached the upper half of the screen
      // (confirming it flew up properly and the player had a chance to slice it)
      if (fruit.y < 500) {
        fruit.setData('enteredScreen', true);
      }

      // Destroy and count as missed when fruit falls back down past the bottom
      if (fruit.y > 730 && fruit.body && fruit.body.velocity.y > 0) {
        if (fruit.getData('enteredScreen')) {
          this.handleMissedFruit();
        }
        fruit.destroy();
      }
    });

    // Clean up sliced halves
    this.slicedGroup.getChildren().forEach((h: any) => {
      if (h.y > 760) h.destroy();
    });

    // Clean up fallen bombs (bombs falling off do NOT count as a miss)
    this.bombsGroup.getChildren().forEach((b: any) => {
      if (b.y > 760) b.destroy();
    });
  }

  private tossFruitWave() {
    const waveCount = Phaser.Math.Between(1, 3);
    const fruitTypes = ['fruit_watermelon', 'fruit_orange', 'fruit_strawberry'];

    for (let i = 0; i < waveCount; i++) {
      this.time.delayedCall(i * 150, () => {
        if (!this.isGameActive || this.isGameOver || this.isPaused) return;

        // Spawn near bottom-centre of canvas (always within camera view)
        const x = Phaser.Math.Between(70, 410);
        // Horizontal arc toward screen centre
        const vx = (240 - x) * Phaser.Math.FloatBetween(0.6, 1.2);
        // With gravity=1200, vy=-1700 → apex 1204px above spawn → y=710-1204=-494 (above screen top!)
        const vy = Phaser.Math.Between(-1600, -2000);

        const type = Phaser.Utils.Array.GetRandom(fruitTypes);
        // Spawn at y=710 — bottom of the canvas but still inside camera view
        const fruit = this.physics.add.sprite(x, 710, type);
        fruit.setData('type', type);
        fruit.setData('enteredScreen', false);
        fruit.setVelocity(vx, vy);
        fruit.setAngularVelocity(Phaser.Math.Between(-200, 200));
        this.fruitsGroup.add(fruit);
      });
    }

    // Chance to toss a bomb (only after some score)
    if (Math.random() < 0.28 && this.score > 60) {
      this.time.delayedCall(250, () => {
        if (!this.isGameActive || this.isGameOver || this.isPaused) return;
        const bx = Phaser.Math.Between(100, 380);
        const bvx = (240 - bx) * 0.85;
        const bvy = Phaser.Math.Between(-1500, -1900);
        const bomb = this.physics.add.sprite(bx, 710, 'bomb_explosive');
        bomb.setVelocity(bvx, bvy);
        bomb.setAngularVelocity(Phaser.Math.Between(-120, 120));
        this.bombsGroup.add(bomb);
      });
    }
  }

  private handleMissedFruit() {
    this.missedCount += 1;
    soundFx.playHit();
    this.callbacks.onScoreUpdate(this.score);

    if (this.missedCount >= this.maxMisses) {
      this.isGameOver = true;
      this.isGameActive = false;
      soundFx.playGameOver();
      this.callbacks.onGameOver(this.score, this.coins);
    }
  }

  private renderBladeTrail() {
    this.bladeTrailGraphics.clear();
    const now = Date.now();
    this.bladePoints = this.bladePoints.filter(p => now - p.time < 160);

    if (this.bladePoints.length < 2) return;

    const bladeColor = Phaser.Display.Color.HexStringToColor(this.skin.primaryColor).color;

    for (let i = 0; i < this.bladePoints.length - 1; i++) {
      const p1 = this.bladePoints[i];
      const p2 = this.bladePoints[i + 1];
      const age = (now - p1.time) / 160;
      const alpha = 1 - age;
      const width = (1 - age) * 7;

      // Outer glow
      this.bladeTrailGraphics.lineStyle(width + 4, bladeColor, alpha * 0.5);
      this.bladeTrailGraphics.lineBetween(p1.x, p1.y, p2.x, p2.y);

      // Inner white core
      this.bladeTrailGraphics.lineStyle(Math.max(1, width - 2), 0xFFFFFF, alpha);
      this.bladeTrailGraphics.lineBetween(p1.x, p1.y, p2.x, p2.y);
    }
  }

  public getMisses() {
    return this.missedCount;
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
