import Phaser from 'phaser';
import { GameBridgeCallbacks, GameSkinConfig } from '../../common/GameBridge';
import { soundFx } from '../../common/SoundFx';

export class SpaceShooterScene extends Phaser.Scene {
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
  private spaceKey!: Phaser.Input.Keyboard.Key;

  private starsNear: Phaser.GameObjects.Arc[] = [];
  private starsFar: Phaser.GameObjects.Arc[] = [];

  private playerLasers!: Phaser.Physics.Arcade.Group;
  private enemyLasers!: Phaser.Physics.Arcade.Group;
  private enemiesGroup!: Phaser.Physics.Arcade.Group;
  private powerupsGroup!: Phaser.Physics.Arcade.Group;

  // Boss
  private boss: Phaser.Physics.Arcade.Sprite | null = null;
  private bossHealth = 0;
  private bossMaxHealth = 30;
  private bossActive = false;

  private isGameOver = false;
  private isPaused = false;
  private score = 0;
  private coins = 0;
  private lives = 3;
  private fireTimer = 0;
  private spawnTimer = 0;

  // Upgrades
  public weaponLevel = 1; // 1 = Single/Twin, 2 = Triple
  private weaponTimer = 0;
  public hasShield = false;
  private shieldGraphic!: Phaser.GameObjects.Arc;

  // Mobile touch control
  public touchMoveX = 0;
  public touchMoveY = 0;
  public autoFire = true;

  constructor(callbacks: GameBridgeCallbacks, skin: GameSkinConfig) {
    super({ key: 'SpaceShooterScene' });
    this.callbacks = callbacks;
    this.skin = skin;
  }

  preload() {
    this.generateProceduralTextures();
  }

  private generateProceduralTextures() {
    // 1. Player Spaceship
    if (!this.textures.exists(`player_ship_${this.skin.id}`)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      const pColor = Phaser.Display.Color.HexStringToColor(this.skin.primaryColor).color;
      const sColor = Phaser.Display.Color.HexStringToColor(this.skin.secondaryColor || '#38BDF8').color;

      // Thruster flame
      g.fillStyle(0x38BDF8, 0.8);
      g.fillTriangle(24, 52, 19, 44, 29, 44);

      // Delta Wings & Hull
      g.fillStyle(pColor, 1);
      g.fillTriangle(24, 4, 4, 46, 44, 46);
      g.lineStyle(2, sColor, 1);
      g.strokeTriangle(24, 4, 4, 46, 44, 46);

      // Cockpit Glass
      g.fillStyle(0x0284C7, 1);
      g.fillEllipse(24, 24, 5, 12);
      g.fillStyle(0xE0F2FE, 0.9);
      g.fillCircle(24, 20, 2);

      // Cannons
      g.fillStyle(0x94A3B8, 1);
      g.fillRect(6, 32, 4, 14);
      g.fillRect(38, 32, 4, 14);

      g.generateTexture(`player_ship_${this.skin.id}`, 48, 54);
      g.destroy();
    }

    // 2. Player Laser Bolt
    if (!this.textures.exists('laser_player')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x38BDF8, 1);
      g.fillRoundedRect(1, 0, 4, 18, 2);
      g.fillStyle(0xFFFFFF, 1);
      g.fillRoundedRect(2, 2, 2, 14, 1);
      g.generateTexture('laser_player', 6, 18);
      g.destroy();
    }

    // 3. Enemy Laser Bolt
    if (!this.textures.exists('laser_enemy')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xEF4444, 1);
      g.fillCircle(4, 4, 4);
      g.fillStyle(0xFEE2E2, 1);
      g.fillCircle(4, 4, 2);
      g.generateTexture('laser_enemy', 8, 8);
      g.destroy();
    }

    // 4. Enemy Scout
    if (!this.textures.exists('enemy_scout')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xE11D48, 1);
      g.fillTriangle(18, 32, 2, 6, 34, 6);
      g.fillStyle(0xFDE047, 1);
      g.fillCircle(18, 16, 4);
      g.generateTexture('enemy_scout', 36, 36);
      g.destroy();
    }

    // 5. Enemy Gunship (Heavy)
    if (!this.textures.exists('enemy_gunship')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x7C3AED, 1);
      g.fillRoundedRect(4, 4, 44, 32, 8);
      g.lineStyle(2, 0xC084FC, 1);
      g.strokeRoundedRect(4, 4, 44, 32, 8);
      g.fillStyle(0xF43F5E, 1);
      g.fillCircle(16, 20, 5);
      g.fillCircle(36, 20, 5);
      g.generateTexture('enemy_gunship', 52, 40);
      g.destroy();
    }

    // 6. Boss Dreadnought
    if (!this.textures.exists('boss_dreadnought')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x881337, 1);
      g.fillRoundedRect(10, 10, 120, 60, 14);
      g.lineStyle(3, 0xF43F5E, 1);
      g.strokeRoundedRect(10, 10, 120, 60, 14);
      // Main core
      g.fillStyle(0xFBBF24, 1);
      g.fillCircle(70, 40, 16);
      g.fillStyle(0xDC2626, 1);
      g.fillCircle(70, 40, 9);
      // Turrets
      g.fillStyle(0xE11D48, 1);
      g.fillRect(25, 65, 8, 14);
      g.fillRect(107, 65, 8, 14);
      g.generateTexture('boss_dreadnought', 140, 84);
      g.destroy();
    }

    // 7. Powerup: Triple Shot (W)
    if (!this.textures.exists('pow_weapon')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x0284C7, 1);
      g.fillCircle(14, 14, 13);
      g.lineStyle(2, 0x38BDF8, 1);
      g.strokeCircle(14, 14, 12);
      g.fillStyle(0xFFFFFF, 1);
      g.fillRect(12, 6, 4, 16);
      g.fillRect(6, 10, 4, 12);
      g.fillRect(18, 10, 4, 12);
      g.generateTexture('pow_weapon', 28, 28);
      g.destroy();
    }
  }

  create() {
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.weaponLevel = 1;
    this.weaponTimer = 0;
    this.hasShield = false;
    this.boss = null;
    this.bossActive = false;

    const width = 480;
    const height = 720;

    // Deep space background
    this.add.rectangle(width / 2, height / 2, width, height, 0x050814);

    // Parallax Starfield
    this.starsFar = [];
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.FloatBetween(0.8, 1.4),
        0x6366F1,
        0.5
      );
      this.starsFar.push(star);
    }

    this.starsNear = [];
    for (let i = 0; i < 35; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.FloatBetween(1.5, 2.4),
        0x38BDF8,
        0.8
      );
      this.starsNear.push(star);
    }

    // Groups
    this.playerLasers = this.physics.add.group();
    this.enemyLasers = this.physics.add.group();
    this.enemiesGroup = this.physics.add.group();
    this.powerupsGroup = this.physics.add.group();

    // Player
    this.player = this.physics.add.sprite(240, 620, `player_ship_${this.skin.id}`);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(34, 38);

    // Shield graphic
    this.shieldGraphic = this.add.circle(this.player.x, this.player.y, 34, 0x38BDF8, 0.3);
    this.shieldGraphic.setStrokeStyle(2, 0x7DD3FC, 0.9);
    this.shieldGraphic.setVisible(false);

    // Keyboard
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Touch Dragging on Mobile
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && !this.isPaused && !this.isGameOver) {
        this.player.x = Phaser.Math.Clamp(pointer.x, 30, 450);
        this.player.y = Phaser.Math.Clamp(pointer.y, 80, 680);
      }
    });

    // Overlaps
    this.physics.add.overlap(this.playerLasers, this.enemiesGroup, this.handleLaserHitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.enemiesGroup, this.handleShipCrash, undefined, this);
    this.physics.add.overlap(this.player, this.enemyLasers, this.handleShipHitByLaser, undefined, this);
    this.physics.add.overlap(this.player, this.powerupsGroup, this.handleCollectPowerup, undefined, this);

    this.callbacks.onGameStarted?.();
  }

  update(time: number, delta: number) {
    if (this.isGameOver || this.isPaused) return;

    const dt = delta / 1000;

    // Parallax scrolling
    this.starsFar.forEach(s => {
      s.y += 60 * dt;
      if (s.y > 730) s.y = -10;
    });
    this.starsNear.forEach(s => {
      s.y += 140 * dt;
      if (s.y > 730) s.y = -10;
    });

    // Player Keyboard Movement
    const speed = 360;
    let vx = 0;
    let vy = 0;

    if (this.cursors?.left.isDown || this.wasd?.left.isDown) vx = -speed;
    else if (this.cursors?.right.isDown || this.wasd?.right.isDown) vx = speed;

    if (this.cursors?.up.isDown || this.wasd?.up.isDown) vy = -speed;
    else if (this.cursors?.down.isDown || this.wasd?.down.isDown) vy = speed;

    this.player.setVelocity(vx, vy);

    // Shield follow
    this.shieldGraphic.setPosition(this.player.x, this.player.y);
    this.shieldGraphic.setVisible(this.hasShield);

    // Weapon timer
    if (this.weaponTimer > 0) {
      this.weaponTimer -= dt;
      if (this.weaponTimer <= 0) {
        this.weaponLevel = 1;
      }
    }

    // Firing blasters (auto-fire or spacebar)
    this.fireTimer += delta;
    const shouldFire = this.autoFire || this.spaceKey?.isDown || this.cursors?.space?.isDown;
    const fireInterval = this.weaponLevel > 1 ? 140 : 200;

    if (shouldFire && this.fireTimer > fireInterval) {
      this.fireTimer = 0;
      this.firePlayerLaser();
    }

    // Spawning Enemies
    this.spawnTimer += delta;
    const spawnRate = Math.max(600, 1400 - Math.floor(this.score / 2));
    if (this.spawnTimer > spawnRate && !this.bossActive) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    // Trigger Boss at score thresholds (e.g. 500, 1200)
    if (!this.bossActive && this.score >= 500 && this.bossHealth === 0) {
      this.spawnBoss();
    }

    // Boss Movement & Firing
    if (this.boss && this.boss.active) {
      if (this.boss.y < 120) {
        this.boss.y += 60 * dt;
      } else {
        // Sway horizontally
        const dir = this.boss.getData('dir') || 1;
        this.boss.x += dir * 100 * dt;
        if (this.boss.x < 100) {
          this.boss.x = 100;
          this.boss.setData('dir', 1);
        } else if (this.boss.x > 380) {
          this.boss.x = 380;
          this.boss.setData('dir', -1);
        }

        // Boss fire
        const bFire = (this.boss.getData('fireTimer') || 0) + delta;
        if (bFire > 800) {
          this.boss.setData('fireTimer', 0);
          this.fireBossSpread(this.boss.x, this.boss.y + 40);
        } else {
          this.boss.setData('fireTimer', bFire);
        }
      }
    }

    // Move & Cleanup Lasers
    this.playerLasers.getChildren().forEach((l: any) => {
      l.y -= 700 * dt;
      if (l.y < -30) l.destroy();
    });

    this.enemyLasers.getChildren().forEach((l: any) => {
      const vy = (l.getData('vy') || 280);
      const vx = (l.getData('vx') || 0);
      l.y += vy * dt;
      l.x += vx * dt;
      if (l.y > 750 || l.x < -30 || l.x > 510) l.destroy();
    });

    // Move & Cleanup Enemies
    this.enemiesGroup.getChildren().forEach((e: any) => {
      const enemy = e as Phaser.Physics.Arcade.Sprite;
      const vy = enemy.getData('vy') || 160;
      const vx = enemy.getData('vx') || 0;
      enemy.y += vy * dt;
      enemy.x += vx * dt;

      // Enemy gunship firing
      if (enemy.getData('type') === 'enemy_gunship') {
        const ft = (enemy.getData('fireTimer') || 0) + delta;
        if (ft > 1200) {
          enemy.setData('fireTimer', 0);
          this.fireEnemyLaser(enemy.x, enemy.y + 20);
        } else {
          enemy.setData('fireTimer', ft);
        }
      }

      if (enemy.y > 760) enemy.destroy();
    });

    // Move Powerups
    this.powerupsGroup.getChildren().forEach((p: any) => {
      p.y += 120 * dt;
      if (p.y > 750) p.destroy();
    });
  }

  private firePlayerLaser() {
    soundFx.playLaser();
    if (this.weaponLevel === 1) {
      // Twin lasers
      const l1 = this.playerLasers.create(this.player.x - 12, this.player.y - 18, 'laser_player');
      const l2 = this.playerLasers.create(this.player.x + 12, this.player.y - 18, 'laser_player');
    } else {
      // Triple spread lasers
      const l1 = this.playerLasers.create(this.player.x - 16, this.player.y - 16, 'laser_player');
      const l2 = this.playerLasers.create(this.player.x, this.player.y - 24, 'laser_player');
      const l3 = this.playerLasers.create(this.player.x + 16, this.player.y - 16, 'laser_player');
    }
  }

  private fireEnemyLaser(x: number, y: number) {
    const laser = this.enemyLasers.create(x, y, 'laser_enemy');
    laser.setData('vy', 320);
  }

  private fireBossSpread(x: number, y: number) {
    soundFx.playLaser();
    [-120, 0, 120].forEach(vx => {
      const l = this.enemyLasers.create(x, y, 'laser_enemy');
      l.setData('vy', 260);
      l.setData('vx', vx);
    });
  }

  private spawnEnemy() {
    const x = Phaser.Math.Between(40, 440);
    const isGunship = Math.random() < 0.35 && this.score > 150;
    const type = isGunship ? 'enemy_gunship' : 'enemy_scout';

    const enemy = this.enemiesGroup.create(x, -50, type);
    enemy.setData('type', type);
    enemy.setData('vy', isGunship ? 130 : 210);
    enemy.setData('vx', isGunship ? 0 : Phaser.Math.Between(-40, 40));
    enemy.setData('hp', isGunship ? 3 : 1);
  }

  private spawnBoss() {
    this.bossActive = true;
    this.bossMaxHealth = 35;
    this.bossHealth = this.bossMaxHealth;

    this.boss = this.physics.add.sprite(240, -100, 'boss_dreadnought');
    this.boss.setData('dir', 1);
    this.boss.setData('fireTimer', 0);
    this.enemiesGroup.add(this.boss);

    soundFx.playPowerup();
  }

  private handleLaserHitEnemy(laserObj: any, enemyObj: any) {
    laserObj.destroy();
    const enemy = enemyObj as Phaser.Physics.Arcade.Sprite;

    if (enemy === this.boss) {
      this.bossHealth -= 1;
      this.boss.setTint(0xFFFFFF);
      this.time.delayedCall(50, () => this.boss?.clearTint());

      if (this.bossHealth <= 0) {
        // Boss Defeated!
        this.boss.destroy();
        this.boss = null;
        this.bossActive = false;
        soundFx.playExplosion();
        this.score += 250;
        this.coins += 25;
        this.callbacks.onCoinCollected(this.coins);
        this.callbacks.onScoreUpdate(this.score);
        this.cameras.main.shake(300, 0.02);
      }
      return;
    }

    const hp = (enemy.getData('hp') || 1) - 1;
    if (hp <= 0) {
      const type = enemy.getData('type');
      enemy.destroy();
      soundFx.playExplosion();

      const pts = type === 'enemy_gunship' ? 30 : 15;
      this.score += pts;
      this.callbacks.onScoreUpdate(this.score);

      // Chance to drop powerup or coin
      if (Math.random() < 0.12) {
        const pow = this.powerupsGroup.create(enemy.x, enemy.y, 'pow_weapon');
      } else if (Math.random() < 0.25) {
        this.coins += 1;
        this.callbacks.onCoinCollected(this.coins);
      }
    } else {
      enemy.setData('hp', hp);
      enemy.setTint(0xFCA5A5);
      this.time.delayedCall(60, () => enemy.clearTint());
    }
  }

  private handleShipCrash(playerObj: any, enemyObj: any) {
    enemyObj.destroy();
    this.takeDamage();
  }

  private handleShipHitByLaser(playerObj: any, laserObj: any) {
    laserObj.destroy();
    this.takeDamage();
  }

  private takeDamage() {
    if (this.hasShield) {
      this.hasShield = false;
      soundFx.playExplosion();
      this.cameras.main.shake(120, 0.01);
      return;
    }

    this.lives -= 1;
    soundFx.playCrash();
    this.cameras.main.shake(200, 0.02);
    this.player.setTint(0xEF4444);
    this.time.delayedCall(120, () => this.player.clearTint());

    if (this.lives <= 0) {
      this.isGameOver = true;
      soundFx.playGameOver();
      this.callbacks.onGameOver(this.score, this.coins);
    }
  }

  private handleCollectPowerup(playerObj: any, powObj: any) {
    powObj.destroy();
    this.weaponLevel = 2;
    this.weaponTimer = 10;
    this.hasShield = true;
    soundFx.playPowerup();
  }

  public getLives() {
    return this.lives;
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
