import Phaser from 'phaser';
import { FighterTextureGenerator } from './TextureGenerator';
import { FighterDefinition, FighterId, CombatHitEvent, MatchRoundResult } from '../types';
import { fighterAudio } from '../audio/FighterAudio';

export interface DesiFightersCallbacks {
  onHealthUpdate: (playerHp: number, playerMaxHp: number, oppHp: number, oppMaxHp: number) => void;
  onEnergyUpdate: (playerSpecial: number, playerUlt: number, oppSpecial: number, oppUlt: number) => void;
  onTimerUpdate: (secondsRemaining: number) => void;
  onRoundUpdate: (currentRound: number, playerWins: number, oppWins: number) => void;
  onBannerMessage: (message: string, subMessage?: string) => void;
  onMatchComplete: (winner: 'player' | 'opponent', roundResults: MatchRoundResult[], stats: any) => void;
}

export class DesiFightersScene extends Phaser.Scene {
  private callbacks: DesiFightersCallbacks;
  private playerDef: FighterDefinition;
  private oppDef: FighterDefinition;
  private difficulty: 'easy' | 'normal' | 'hard';

  // Sprites
  private playerSprite!: Phaser.Physics.Arcade.Sprite;
  private oppSprite!: Phaser.Physics.Arcade.Sprite;
  private ground!: Phaser.Physics.Arcade.StaticGroup;

  // Projectiles
  private projectiles!: Phaser.Physics.Arcade.Group;

  // Combat States
  public playerHp = 1000;
  public playerMaxHp = 1000;
  public playerSpecialEnergy = 0;
  public playerUltEnergy = 0;
  public isPlayerBlocking = false;
  private isPlayerAttacking = false;
  private playerAttackTimer = 0;
  private playerAttackCooldown = 0;
  private playerHitStun = 0;

  public oppHp = 1000;
  public oppMaxHp = 1000;
  public oppSpecialEnergy = 0;
  public oppUltEnergy = 0;
  public isOppBlocking = false;
  private isOppAttacking = false;
  private oppAttackTimer = 0;
  private oppAttackCooldown = 0;
  private oppHitStun = 0;

  // AI Decision Timer
  private aiDecisionTimer = 0;
  private aiCurrentAction: 'idle' | 'walk_left' | 'walk_right' | 'jump' | 'block' = 'idle';

  // Round & Match Structure
  public currentRound = 1;
  public playerRoundWins = 0;
  public oppRoundWins = 0;
  public roundTimeRemaining = 60;
  private roundTimerEvent?: Phaser.Time.TimerEvent;
  public isRoundActive = false;
  private roundResults: MatchRoundResult[] = [];

  // Match Statistics
  public totalDamageDealt = 0;
  public totalDamageTaken = 0;
  public playerSpecialsUsed = 0;
  public playerUltsUsed = 0;

  // Keyboard Keys
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyJ!: Phaser.Input.Keyboard.Key;
  private keyK!: Phaser.Input.Keyboard.Key;
  private keyL!: Phaser.Input.Keyboard.Key;
  private keyU!: Phaser.Input.Keyboard.Key;
  private keyI!: Phaser.Input.Keyboard.Key;

  // External Mobile Input
  public touchMoveDir = 0;
  public touchBlocking = false;

  // ---------------------------------------------------------------
  // FIX: Track projectiles that have already hit to prevent double-fire
  // Using object reference (no .id on Arcade.Sprite in types)
  // ---------------------------------------------------------------
  private hitProjectiles = new Set<Phaser.Physics.Arcade.Sprite>();

  constructor(
    callbacks: DesiFightersCallbacks,
    playerDef: FighterDefinition,
    oppDef: FighterDefinition,
    difficulty: 'easy' | 'normal' | 'hard'
  ) {
    super({ key: 'DesiFightersScene' });
    this.callbacks = callbacks;
    this.playerDef = playerDef;
    this.oppDef = oppDef;
    this.difficulty = difficulty;
  }

  preload() {
    const generator = new FighterTextureGenerator(this);
    generator.generateAllTextures();
  }

  create() {
    // 1. Background Arena
    this.add.image(240, 360, 'fighter_arena_bg').setOrigin(0.5, 0.5);

    // 2. Arena Floor Platform (y = 430)
    this.ground = this.physics.add.staticGroup();
    const floorBar = this.add.rectangle(240, 440, 480, 20, 0x000000, 0);
    this.ground.add(floorBar);

    // 3. Projectiles Group (no gravity)
    this.projectiles = this.physics.add.group({
      allowGravity: false,
    });

    // 4. Initialize Fighters
    this.playerMaxHp = this.playerDef.stats.health;
    this.playerHp = this.playerMaxHp;
    this.oppMaxHp = this.oppDef.stats.health;
    this.oppHp = this.oppMaxHp;

    // Player Sprite (Left side: x = 120, y = 370)
    this.playerSprite = this.physics.add.sprite(120, 370, `fighter_${this.playerDef.id}_idle`);
    this.playerSprite.setCollideWorldBounds(true);
    this.playerSprite.setSize(50, 100);
    this.playerSprite.setOffset(30, 20);

    // Opponent Sprite (Right side: x = 360, y = 370)
    this.oppSprite = this.physics.add.sprite(360, 370, `fighter_${this.oppDef.id}_idle`);
    this.oppSprite.setCollideWorldBounds(true);
    this.oppSprite.setSize(50, 100);
    this.oppSprite.setOffset(30, 20);
    this.oppSprite.setFlipX(true);

    // Physics Collisions
    this.physics.add.collider(this.playerSprite, this.ground);
    this.physics.add.collider(this.oppSprite, this.ground);

    // ---------------------------------------------------------------
    // FIX: Projectile overlaps — guard with isRoundActive + hitProjectileIds
    // ---------------------------------------------------------------
    this.physics.add.overlap(this.projectiles, this.oppSprite, (obj1) => {
      if (!this.isRoundActive) return;
      const proj = obj1 as Phaser.Physics.Arcade.Sprite;
      if (!proj.active || this.hitProjectiles.has(proj)) return;
      this.handleProjectileHit(proj, 'opponent');
    });
    this.physics.add.overlap(this.projectiles, this.playerSprite, (obj1) => {
      if (!this.isRoundActive) return;
      const proj = obj1 as Phaser.Physics.Arcade.Sprite;
      if (!proj.active || this.hitProjectiles.has(proj)) return;
      this.handleProjectileHit(proj, 'player');
    });

    // 5. Setup Keyboard Controls (A/D/W, Arrow Keys, Spacebar, J/K/L/U/I)
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
      this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
      this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
      this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

      // Key Down Events for Attacks & Jump
      this.keyJ.on('down', () => this.handlePlayerPunch());
      this.keyK.on('down', () => this.handlePlayerKick());
      this.keyU.on('down', () => this.handlePlayerSpecial());
      this.keyI.on('down', () => this.handlePlayerUltimate());
      this.keyW.on('down', () => this.triggerPlayerJump());
      this.cursors.up.on('down', () => this.triggerPlayerJump());
      this.keySpace.on('down', () => this.triggerPlayerJump());
    }

    // 6. Start Round 1
    this.startRound(1);
  }

  // -------------------------------------------------------------
  // ROUND MANAGEMENT
  // -------------------------------------------------------------
  public startRound(roundNum: number) {
    this.physics.resume();
    this.currentRound = roundNum;
    this.isRoundActive = false;

    // ---------------------------------------------------------------
    // FIX: Full state reset on round start — clears all locks
    // ---------------------------------------------------------------
    this.roundTimeRemaining = 60;
    this.isPlayerAttacking = false;
    this.isOppAttacking = false;
    this.playerAttackTimer = 0;
    this.oppAttackTimer = 0;
    this.playerHitStun = 0;
    this.oppHitStun = 0;
    this.playerAttackCooldown = 0;
    this.oppAttackCooldown = 0;
    this.isPlayerBlocking = false;
    this.isOppBlocking = false;
    this.touchBlocking = false;
    this.touchMoveDir = 0;
    this.aiDecisionTimer = 0;
    this.hitProjectiles.clear();

    // Destroy any lingering projectiles from previous round
    this.projectiles.clear(true, true);

    // Reset health and positions
    this.playerHp = this.playerMaxHp;
    this.oppHp = this.oppMaxHp;
    this.playerSprite.setPosition(120, 370);
    this.playerSprite.setVelocity(0, 0);
    this.playerSprite.setTexture(`fighter_${this.playerDef.id}_idle`);
    this.oppSprite.setPosition(360, 370);
    this.oppSprite.setVelocity(0, 0);
    this.oppSprite.setTexture(`fighter_${this.oppDef.id}_idle`);

    this.callbacks.onHealthUpdate(this.playerHp, this.playerMaxHp, this.oppHp, this.oppMaxHp);
    this.callbacks.onEnergyUpdate(this.playerSpecialEnergy, this.playerUltEnergy, this.oppSpecialEnergy, this.oppUltEnergy);
    this.callbacks.onRoundUpdate(this.currentRound, this.playerRoundWins, this.oppRoundWins);
    this.callbacks.onTimerUpdate(this.roundTimeRemaining);

    // Announce Round
    const roundTitle = roundNum === 3 ? 'FINAL ROUND' : `ROUND ${roundNum}`;
    this.callbacks.onBannerMessage(roundTitle, 'GET READY!');
    fighterAudio.playCountdown(false);

    // 1.5s delay then FIGHT!
    this.time.delayedCall(1500, () => {
      this.callbacks.onBannerMessage('FIGHT!', 'GO ALL OUT!');
      fighterAudio.playCountdown(true);
      this.isRoundActive = true;

      // Start 60s countdown timer
      if (this.roundTimerEvent) this.roundTimerEvent.remove();
      this.roundTimerEvent = this.time.addEvent({
        delay: 1000,
        repeat: 59,
        callback: () => {
          if (!this.isRoundActive) return;
          this.roundTimeRemaining--;
          this.callbacks.onTimerUpdate(this.roundTimeRemaining);
          if (this.roundTimeRemaining <= 0) {
            this.handleTimeOut();
          }
        },
      });
    });
  }

  private handleTimeOut() {
    this.isRoundActive = false;
    fighterAudio.playCountdown(false);

    let roundWinner: 'player' | 'opponent' | 'draw' = 'draw';
    if (this.playerHp > this.oppHp) {
      roundWinner = 'player';
      this.playerRoundWins++;
    } else if (this.oppHp > this.playerHp) {
      roundWinner = 'opponent';
      this.oppRoundWins++;
    }

    this.finishRound(roundWinner, 'TIME UP!');
  }

  private finishRound(winner: 'player' | 'opponent' | 'draw', bannerTitle: string) {
    // ---------------------------------------------------------------
    // FIX: Guard against double-finish (can be called by K.O. and
    // then timer simultaneously — only execute once)
    // ---------------------------------------------------------------
    if (!this.isRoundActive && bannerTitle === 'K.O.!') return;
    this.isRoundActive = false;

    if (this.roundTimerEvent) {
      this.roundTimerEvent.remove();
      this.roundTimerEvent = undefined;
    }

    // ---------------------------------------------------------------
    // FIX: Immediately clear all attack/stun locks so sprites don't
    // stay frozen during the end-of-round display
    // ---------------------------------------------------------------
    this.isPlayerAttacking = false;
    this.isOppAttacking = false;
    this.playerHitStun = 0;
    this.oppHitStun = 0;
    this.isPlayerBlocking = false;
    this.isOppBlocking = false;
    this.playerSprite.setVelocity(0, 0);
    this.oppSprite.setVelocity(0, 0);
    this.projectiles.clear(true, true);
    this.hitProjectiles.clear();

    this.roundResults.push({
      roundNumber: this.currentRound,
      winner,
      playerHealthRemaining: this.playerHp,
      opponentHealthRemaining: this.oppHp,
      timeRemaining: this.roundTimeRemaining,
    });

    const subText =
      winner === 'player'
        ? `${this.playerDef.name} WINS ROUND!`
        : winner === 'opponent'
        ? `${this.oppDef.name} WINS ROUND!`
        : 'DRAW ROUND!';

    this.callbacks.onBannerMessage(bannerTitle, subText);
    this.callbacks.onRoundUpdate(this.currentRound, this.playerRoundWins, this.oppRoundWins);

    // Check Match Win Condition (First to 2 wins)
    if (this.playerRoundWins >= 2 || this.oppRoundWins >= 2 || this.currentRound >= 3) {
      // Match Complete!
      const finalWinner = this.playerRoundWins >= this.oppRoundWins ? 'player' : 'opponent';
      this.time.delayedCall(2200, () => {
        if (finalWinner === 'player') {
          fighterAudio.playVictory();
          this.playerSprite.setTexture(`fighter_${this.playerDef.id}_idle`);
          this.oppSprite.setTexture(`fighter_${this.oppDef.id}_ko`);
        } else {
          fighterAudio.playDefeat();
          this.playerSprite.setTexture(`fighter_${this.playerDef.id}_ko`);
          this.oppSprite.setTexture(`fighter_${this.oppDef.id}_idle`);
        }

        const matchScore = Math.max(
          500,
          Math.floor(this.totalDamageDealt * 1.5 + this.playerRoundWins * 2000 - this.totalDamageTaken * 0.5)
        );

        this.callbacks.onMatchComplete(finalWinner, this.roundResults, {
          totalDamageDealt: this.totalDamageDealt,
          totalDamageTaken: this.totalDamageTaken,
          playerSpecialsUsed: this.playerSpecialsUsed,
          playerUltsUsed: this.playerUltsUsed,
          finalScore: matchScore,
        });
      });
    } else {
      // Advance to Next Round after 2.5s
      this.time.delayedCall(2500, () => {
        this.startRound(this.currentRound + 1);
      });
    }
  }

  // -------------------------------------------------------------
  // SAFETY: Single guard used everywhere to protect against
  // Phaser's extra rAF tick after Game.destroy() and against
  // React touch events firing into an already-torn-down scene
  // -------------------------------------------------------------
  private spritesAlive(): boolean {
    return !!(
      this.playerSprite &&
      this.playerSprite.active &&
      this.playerSprite.body &&
      this.oppSprite &&
      this.oppSprite.active &&
      this.oppSprite.body
    );
  }

  // -------------------------------------------------------------
  // UPDATE LOOP: Movement, AI, Hit-stuns, Direction Facing
  // -------------------------------------------------------------
  update(_time: number, delta: number) {
    // Guard: scene may still get a rAF tick after Phaser Game.destroy()
    if (!this.spritesAlive()) return;
    if (!this.isRoundActive) return;

    // Decrement Hit Stun and Cooldowns
    if (this.playerHitStun > 0) this.playerHitStun -= delta;
    if (this.oppHitStun > 0) this.oppHitStun -= delta;
    if (this.playerAttackCooldown > 0) this.playerAttackCooldown -= delta;
    if (this.oppAttackCooldown > 0) this.oppAttackCooldown -= delta;

    // ---------------------------------------------------------------
    // FIX: Attack watchdog timeout reduced to 500ms for specials/ults
    // (prev value was 380ms which was too short for ult animations)
    // ---------------------------------------------------------------
    if (this.isPlayerAttacking) {
      this.playerAttackTimer += delta;
      if (this.playerAttackTimer > 700) {
        this.isPlayerAttacking = false;
        this.playerAttackTimer = 0;
        this.playerSprite.setVelocityX(0);
      }
    } else {
      this.playerAttackTimer = 0;
    }

    if (this.isOppAttacking) {
      this.oppAttackTimer += delta;
      if (this.oppAttackTimer > 700) {
        this.isOppAttacking = false;
        this.oppAttackTimer = 0;
        this.oppSprite.setVelocityX(0);
      }
    } else {
      this.oppAttackTimer = 0;
    }

    // ---------------------------------------------------------------
    // FIX: Auto-stop velocity at world edges to prevent corner lock
    // ---------------------------------------------------------------
    const pw = this.playerSprite.body as Phaser.Physics.Arcade.Body;
    const ow = this.oppSprite.body as Phaser.Physics.Arcade.Body;
    if (pw?.blocked.left || pw?.blocked.right) {
      this.playerSprite.setVelocityX(0);
    }
    if (ow?.blocked.left || ow?.blocked.right) {
      this.oppSprite.setVelocityX(0);
    }

    // 1. Automatic Face Direction (Face opponent)
    if (!this.isPlayerAttacking && this.playerHitStun <= 0) {
      this.playerSprite.setFlipX(this.playerSprite.x > this.oppSprite.x);
    }
    if (!this.isOppAttacking && this.oppHitStun <= 0) {
      this.oppSprite.setFlipX(this.oppSprite.x > this.playerSprite.x);
    }

    // 2. Player Controls (Keyboard & Touch)
    this.updatePlayerMovement();

    // 3. AI Opponent Logic
    this.updateOpponentAI(delta);

    // ---------------------------------------------------------------
    // FIX: Destroy any projectiles that have gone off-screen
    // ---------------------------------------------------------------
    this.projectiles.getChildren().forEach((obj) => {
      const p = obj as Phaser.Physics.Arcade.Sprite;
      if (p.active && (p.x < -60 || p.x > 540 || p.y < -60 || p.y > 750)) {
        this.hitProjectiles.delete(p);
        p.destroy();
      }
    });
  }

  // -------------------------------------------------------------
  // PLAYER MOVEMENT & ACTIONS
  // -------------------------------------------------------------
  private updatePlayerMovement() {
    if (!this.spritesAlive()) return;
    if (this.playerHitStun > 0 || this.isPlayerAttacking) return;

    const baseSpeed = 160 * (this.playerDef.stats.speed / 75);
    let moveX = 0;

    // Blocking Check
    const keyBlock = this.keyL ? this.keyL.isDown : false;
    this.isPlayerBlocking = keyBlock || this.touchBlocking;

    if (this.isPlayerBlocking) {
      this.playerSprite.setVelocityX(0);
      this.playerSprite.setTexture(`fighter_${this.playerDef.id}_block`);
      return;
    }

    // Horizontal Movement (A/D or Arrow Left/Right or Touch)
    const keyLeft = (this.keyA && this.keyA.isDown) || (this.cursors && this.cursors.left.isDown);
    const keyRight = (this.keyD && this.keyD.isDown) || (this.cursors && this.cursors.right.isDown);

    if (keyLeft || this.touchMoveDir === -1) {
      moveX = -baseSpeed;
    } else if (keyRight || this.touchMoveDir === 1) {
      moveX = baseSpeed;
    }

    this.playerSprite.setVelocityX(moveX);

    // Jump (W or Arrow Up or Space or touch)
    const keyJump =
      (this.keyW && this.keyW.isDown) ||
      (this.cursors && this.cursors.up.isDown) ||
      (this.keySpace && this.keySpace.isDown);
    const isGrounded = this.playerSprite.body?.touching.down;
    if (keyJump && isGrounded) {
      this.triggerPlayerJump();
    }

    // Texture State Update (Idle vs Walk)
    if (isGrounded) {
      if (Math.abs(moveX) > 10) {
        this.playerSprite.setTexture(`fighter_${this.playerDef.id}_walk`);
      } else {
        this.playerSprite.setTexture(`fighter_${this.playerDef.id}_idle`);
      }
    }
  }

  public triggerPlayerJump() {
    if (!this.spritesAlive()) return;
    if (!this.isRoundActive || this.playerHitStun > 0 || this.isPlayerAttacking) return;
    if (this.playerSprite.body?.touching.down) {
      this.playerSprite.setVelocityY(-460);
      fighterAudio.playJump();
    }
  }

  // -------------------------------------------------------------
  // ATTACKS: PUNCH, KICK, SPECIAL, ULTIMATE
  // -------------------------------------------------------------
  public handlePlayerPunch() {
    if (!this.spritesAlive()) return;
    if (!this.isRoundActive || this.playerHitStun > 0 || this.isPlayerAttacking || this.isPlayerBlocking) return;
    this.executePunch('player');
  }

  public handlePlayerKick() {
    if (!this.spritesAlive()) return;
    if (!this.isRoundActive || this.playerHitStun > 0 || this.isPlayerAttacking || this.isPlayerBlocking) return;
    this.executeKick('player');
  }

  public handlePlayerSpecial() {
    if (!this.spritesAlive()) return;
    if (!this.isRoundActive || this.playerHitStun > 0 || this.isPlayerAttacking) return;
    const cost = this.playerDef.specialMove.energyCost;
    if (this.playerSpecialEnergy < cost) return;

    this.playerSpecialEnergy -= cost;
    this.playerSpecialsUsed++;
    this.callbacks.onEnergyUpdate(this.playerSpecialEnergy, this.playerUltEnergy, this.oppSpecialEnergy, this.oppUltEnergy);
    this.executeSpecial('player', this.playerDef);
  }

  public handlePlayerUltimate() {
    if (!this.spritesAlive()) return;
    if (!this.isRoundActive || this.playerHitStun > 0 || this.isPlayerAttacking) return;
    if (this.playerUltEnergy < 100) return;

    this.playerUltEnergy = 0;
    this.playerUltsUsed++;
    this.callbacks.onEnergyUpdate(this.playerSpecialEnergy, this.playerUltEnergy, this.oppSpecialEnergy, this.oppUltEnergy);
    this.executeUltimate('player', this.playerDef);
  }

  // -------------------------------------------------------------
  // CORE COMBAT EXECUTION LOGIC
  // -------------------------------------------------------------
  private executePunch(attacker: 'player' | 'opponent') {
    if (!this.spritesAlive()) return;
    const isPlayer = attacker === 'player';
    const sprite = isPlayer ? this.playerSprite : this.oppSprite;
    const def = isPlayer ? this.playerDef : this.oppDef;

    if (isPlayer) this.isPlayerAttacking = true;
    else this.isOppAttacking = true;

    sprite.setTexture(`fighter_${def.id}_punch`);
    fighterAudio.playPunch();

    // Hit Range Check (within ~85px)
    this.time.delayedCall(100, () => {
      if (!this.isRoundActive) return;
      this.checkMeleeHit(attacker, 'punch', 85, 30);
    });

    // Reset back to idle
    this.time.delayedCall(260, () => {
      if (isPlayer) this.isPlayerAttacking = false;
      else this.isOppAttacking = false;
    });
  }

  private executeKick(attacker: 'player' | 'opponent') {
    if (!this.spritesAlive()) return;
    const isPlayer = attacker === 'player';
    const sprite = isPlayer ? this.playerSprite : this.oppSprite;
    const def = isPlayer ? this.playerDef : this.oppDef;

    if (isPlayer) this.isPlayerAttacking = true;
    else this.isOppAttacking = true;

    sprite.setTexture(`fighter_${def.id}_kick`);
    fighterAudio.playKick();

    // Hit Range Check (within ~105px)
    this.time.delayedCall(140, () => {
      if (!this.isRoundActive) return;
      this.checkMeleeHit(attacker, 'kick', 105, 52);
    });

    // Reset back to idle
    this.time.delayedCall(360, () => {
      if (isPlayer) this.isPlayerAttacking = false;
      else this.isOppAttacking = false;
    });
  }

  private executeSpecial(attacker: 'player' | 'opponent', def: FighterDefinition) {
    if (!this.spritesAlive()) return;
    const isPlayer = attacker === 'player';
    const sprite = isPlayer ? this.playerSprite : this.oppSprite;
    const target = isPlayer ? this.oppSprite : this.playerSprite;

    if (isPlayer) this.isPlayerAttacking = true;
    else this.isOppAttacking = true;

    sprite.setTexture(`fighter_${def.id}_special`);
    fighterAudio.playSpecial();

    const clearAttacking = () => {
      if (isPlayer) this.isPlayerAttacking = false;
      else this.isOppAttacking = false;
    };
    // Safe velocity clear — only if sprite is still alive
    const safeStopSprite = () => {
      if (sprite && sprite.active && sprite.body) sprite.setVelocityX(0);
      clearAttacking();
    };

    if (def.id === 'jaldi') {
      // LATE ENTRY: Hyper Speed Dash across stage
      const forwardDir = sprite.x < target.x ? 1 : -1;
      sprite.setVelocityX(forwardDir * 520);
      this.spawnClockEffect(sprite.x, sprite.y);

      this.time.delayedCall(180, () => {
        if (!this.isRoundActive) { clearAttacking(); return; }
        this.checkMeleeHit(attacker, 'special', 180, 130, 'comic_late');
      });

      this.time.delayedCall(400, () => {
        // ---------------------------------------------------------------
        // FIX: Always clear velocity and flag even if round ended
        // ---------------------------------------------------------------
        safeStopSprite();
      });

    } else if (def.id === 'pookie') {
      // POOKIE SHUFFLE: Cute erratic dance glide + flurry kick
      fighterAudio.playSparkles();
      this.spawnHeartParticles(sprite.x, sprite.y);
      const forwardDir = sprite.x < target.x ? 1 : -1;
      sprite.setVelocityX(forwardDir * 280);

      this.time.delayedCall(220, () => {
        if (!this.isRoundActive) { clearAttacking(); return; }
        this.checkMeleeHit(attacker, 'special', 120, 125, 'comic_pookie');
      });

      this.time.delayedCall(480, () => {
        safeStopSprite();
      });

    } else if (def.id === 'guard') {
      // ENTRY DENIED: Whistle + Energy barrier push
      fighterAudio.playWhistle();
      const barrierX = sprite.x + (sprite.x < target.x ? 45 : -45);
      const barrier = this.add.image(barrierX, sprite.y - 10, 'fx_barrier');

      // ---------------------------------------------------------------
      // FIX: Guard the hit check with isRoundActive
      // ---------------------------------------------------------------
      if (this.isRoundActive) {
        this.checkMeleeHit(attacker, 'special', 130, 110, 'comic_denied');
      }

      this.time.delayedCall(500, () => {
        if (barrier && barrier.active) barrier.destroy();
        clearAttacking();
      });

    } else if (def.id === 'vadapav') {
      // CHUTNEY BLAST: Launch Chutney Projectile
      fighterAudio.playSplash();
      const projX = sprite.x + (sprite.x < target.x ? 35 : -35);
      const proj = this.projectiles.create(projX, sprite.y - 15, 'proj_chutney') as Phaser.Physics.Arcade.Sprite;
      if (proj && proj.active) {
        const projDir = sprite.x < target.x ? 1 : -1;
        proj.setVelocityX(projDir * 360);
        proj.setData('owner', attacker);
        proj.setData('damage', 135);
        proj.setData('comicText', 'comic_spicy');
      }

      this.time.delayedCall(380, () => {
        clearAttacking();
      });
    }
  }

  private executeUltimate(attacker: 'player' | 'opponent', def: FighterDefinition) {
    if (!this.spritesAlive()) return;
    const isPlayer = attacker === 'player';
    const sprite = isPlayer ? this.playerSprite : this.oppSprite;
    const target = isPlayer ? this.oppSprite : this.playerSprite;

    if (isPlayer) this.isPlayerAttacking = true;
    else this.isOppAttacking = true;

    fighterAudio.playUltimate();
    this.cameras.main.flash(300, 255, 255, 255);
    this.callbacks.onBannerMessage(def.ultimateMove.comicText, def.ultimateMove.cinematicLine);

    sprite.setTexture(`fighter_${def.id}_special`);

    const clearAttacking = () => {
      // ---------------------------------------------------------------
      // FIX: Always stop dash velocity when ultimate ends
      // Safe-guard: sprite may be gone if Phaser was destroyed
      // ---------------------------------------------------------------
      if (sprite && sprite.active && sprite.body) sprite.setVelocityX(0);
      if (isPlayer) this.isPlayerAttacking = false;
      else this.isOppAttacking = false;
    };

    if (def.id === 'vadapav') {
      // VADA PAV VOLCANO: Launch 3 giant flying Vada Pavs!
      for (let i = 0; i < 3; i++) {
        this.time.delayedCall(i * 180, () => {
          // ---------------------------------------------------------------
          // FIX: Guard projectile creation — only if round still active and sprites alive
          // ---------------------------------------------------------------
          if (!this.isRoundActive || !this.spritesAlive()) return;
          // Capture target position at time of launch so it can't be undefined
          const targetX = target.x;
          const projDir = sprite.x < targetX ? 1 : -1;
          const p = this.projectiles.create(sprite.x, sprite.y - 20, 'proj_vadapav') as Phaser.Physics.Arcade.Sprite;
          if (p && p.active) {
            p.setVelocityX(projDir * (300 + i * 40));
            p.setVelocityY(-40 + i * 20);
            p.setData('owner', attacker);
            p.setData('damage', 80);
            p.setData('comicText', 'comic_dhishoom');
          }
        });
      }
    } else {
      // Cinematic Multi-hit Dash Barrage (Jaldi / Pookie / Guard)
      const forwardDir = sprite.x < target.x ? 1 : -1;
      sprite.setVelocityX(forwardDir * 420);

      this.time.delayedCall(300, () => {
        if (!this.isRoundActive) { clearAttacking(); return; }
        this.checkMeleeHit(attacker, 'ultimate', 180, 240, 'comic_dhishoom');
        this.cameras.main.shake(250, 0.015);
      });
    }

    // ---------------------------------------------------------------
    // FIX: clearAttacking fires regardless of round state so the lock
    // is always released (600ms covers all attack branches)
    // ---------------------------------------------------------------
    this.time.delayedCall(650, () => {
      clearAttacking();
    });
  }

  // -------------------------------------------------------------
  // HIT DETECTION, DAMAGE CALCULATION & COMIC FEEDBACK
  // -------------------------------------------------------------
  private checkMeleeHit(
    attacker: 'player' | 'opponent',
    attackType: 'punch' | 'kick' | 'special' | 'ultimate',
    reach: number,
    baseDmg: number,
    specialComicText?: string
  ) {
    // ---------------------------------------------------------------
    // FIX: Early exit if round ended between attack start and hit check
    // ---------------------------------------------------------------
    if (!this.isRoundActive) return;
    if (!this.spritesAlive()) return;

    const isPlayer = attacker === 'player';
    const atkSprite = isPlayer ? this.playerSprite : this.oppSprite;
    const defSprite = isPlayer ? this.oppSprite : this.playerSprite;
    const atkDef = isPlayer ? this.playerDef : this.oppDef;
    const defDef = isPlayer ? this.oppDef : this.playerDef;
    const isDefBlocking = isPlayer ? this.isOppBlocking : this.isPlayerBlocking;

    // Check Distance & Alignment (Seamless hit detection including corners & point-blank)
    const distance = Math.abs(atkSprite.x - defSprite.x);
    const isPointBlank = distance < 65;
    const isFacingTarget = atkSprite.flipX ? defSprite.x <= atkSprite.x + 15 : defSprite.x >= atkSprite.x - 15;

    if ((isPointBlank || isFacingTarget) && distance <= reach) {
      // Calculate Damage
      const atkPower = atkDef.stats.attack / 75;
      const defResist = isDefBlocking ? 0.22 * (1 - defDef.stats.defence / 250) : 1;
      const finalDamage = Math.round(baseDmg * atkPower * defResist);

      // Camera Shake for impact
      if (attackType === 'special' || attackType === 'ultimate') {
        this.cameras.main.shake(180, 0.012);
      } else if (attackType === 'kick') {
        this.cameras.main.shake(100, 0.005);
      }

      // Apply Damage & Knockback
      const hitX = (atkSprite.x + defSprite.x) / 2;
      const hitY = defSprite.y - 20;

      if (isPlayer) {
        this.oppHp = Math.max(0, this.oppHp - finalDamage);
        this.totalDamageDealt += finalDamage;
        this.oppHitStun = isDefBlocking ? 120 : 320;
        this.isOppAttacking = false;
        this.oppAttackTimer = 0;
        // ---------------------------------------------------------------
        // FIX: Clamp knockback so fighter doesn't clip into wall and stick
        // ---------------------------------------------------------------
        const knockDir = atkSprite.x < defSprite.x ? 1 : -1;
        this.oppSprite.setVelocityX(knockDir * 180);
        this.oppSprite.setTexture(`fighter_${this.oppDef.id}_hit`);

        this.playerSpecialEnergy = Math.min(100, this.playerSpecialEnergy + (attackType === 'punch' ? 14 : 18));
        this.playerUltEnergy = Math.min(100, this.playerUltEnergy + (attackType === 'punch' ? 10 : 15));
      } else {
        this.playerHp = Math.max(0, this.playerHp - finalDamage);
        this.totalDamageTaken += finalDamage;
        this.playerHitStun = isDefBlocking ? 120 : 320;
        this.isPlayerAttacking = false;
        this.playerAttackTimer = 0;
        const knockDir = atkSprite.x < defSprite.x ? 1 : -1;
        this.playerSprite.setVelocityX(knockDir * 180);
        this.playerSprite.setTexture(`fighter_${this.playerDef.id}_hit`);

        this.oppSpecialEnergy = Math.min(100, this.oppSpecialEnergy + (attackType === 'punch' ? 14 : 18));
        this.oppUltEnergy = Math.min(100, this.oppUltEnergy + (attackType === 'punch' ? 10 : 15));
      }

      this.callbacks.onHealthUpdate(this.playerHp, this.playerMaxHp, this.oppHp, this.oppMaxHp);
      this.callbacks.onEnergyUpdate(this.playerSpecialEnergy, this.playerUltEnergy, this.oppSpecialEnergy, this.oppUltEnergy);

      // Audio & Comic Visual Popups
      if (isDefBlocking) {
        fighterAudio.playBlock();
        this.spawnComicBurst(hitX, hitY, 'comic_oye');
      } else {
        const comicKey = specialComicText || (attackType === 'kick' ? 'comic_dhishoom' : 'comic_pow');
        this.spawnComicBurst(hitX, hitY, comicKey);
        this.spawnDamageNumber(hitX, hitY - 15, finalDamage, false);
      }

      // Check K.O.
      if (this.oppHp <= 0) {
        this.oppSprite.setTexture(`fighter_${this.oppDef.id}_ko`);
        this.playerRoundWins++;
        this.finishRound('player', 'K.O.!');
      } else if (this.playerHp <= 0) {
        this.playerSprite.setTexture(`fighter_${this.playerDef.id}_ko`);
        this.oppRoundWins++;
        this.finishRound('opponent', 'K.O.!');
      }
    }
  }

  // ---------------------------------------------------------------
  // FIX: Projectile hit — mark as hit immediately to block re-entry,
  // then safely read position before destroy(), guard all sprite calls
  // ---------------------------------------------------------------
  private handleProjectileHit(proj: Phaser.Physics.Arcade.Sprite, defender: 'player' | 'opponent') {
    if (!proj.active) return;

    const owner = proj.getData('owner');
    if (owner === defender) return; // Don't hit self

    // Mark as consumed immediately to prevent double-hit
    this.hitProjectiles.add(proj);

    const dmg = proj.getData('damage') || 100;
    const comicKey = proj.getData('comicText') || 'comic_dhishoom';

    // Capture position BEFORE destroy
    const hitX = proj.x;
    const hitY = proj.y;

    proj.destroy();

    if (!this.isRoundActive) return;

    fighterAudio.playSplash();
    this.spawnComicBurst(hitX, hitY, comicKey);

    if (defender === 'opponent') {
      // ---------------------------------------------------------------
      // FIX: Null-check oppSprite before calling physics methods
      // ---------------------------------------------------------------
      if (!this.oppSprite || !this.oppSprite.active) return;
      const isBlock = this.isOppBlocking;
      const finalDmg = isBlock ? Math.round(dmg * 0.3) : dmg;
      this.oppHp = Math.max(0, this.oppHp - finalDmg);
      this.totalDamageDealt += finalDmg;
      this.oppHitStun = 350;
      this.isOppAttacking = false;
      this.oppAttackTimer = 0;
      const knockDir = hitX < this.oppSprite.x ? 1 : -1;
      this.oppSprite.setVelocityX(knockDir * 220);
      this.oppSprite.setTexture(`fighter_${this.oppDef.id}_hit`);
      this.spawnDamageNumber(hitX, hitY, finalDmg, true);

      this.playerSpecialEnergy = Math.min(100, this.playerSpecialEnergy + 20);
      this.playerUltEnergy = Math.min(100, this.playerUltEnergy + 16);
    } else {
      // ---------------------------------------------------------------
      // FIX: Null-check playerSprite before calling physics methods
      // ---------------------------------------------------------------
      if (!this.playerSprite || !this.playerSprite.active) return;
      const isBlock = this.isPlayerBlocking;
      const finalDmg = isBlock ? Math.round(dmg * 0.3) : dmg;
      this.playerHp = Math.max(0, this.playerHp - finalDmg);
      this.totalDamageTaken += finalDmg;
      this.playerHitStun = 350;
      this.isPlayerAttacking = false;
      this.playerAttackTimer = 0;
      const knockDir = hitX < this.playerSprite.x ? 1 : -1;
      this.playerSprite.setVelocityX(knockDir * 220);
      this.playerSprite.setTexture(`fighter_${this.playerDef.id}_hit`);
      this.spawnDamageNumber(hitX, hitY, finalDmg, true);

      this.oppSpecialEnergy = Math.min(100, this.oppSpecialEnergy + 20);
      this.oppUltEnergy = Math.min(100, this.oppUltEnergy + 16);
    }

    this.callbacks.onHealthUpdate(this.playerHp, this.playerMaxHp, this.oppHp, this.oppMaxHp);
    this.callbacks.onEnergyUpdate(this.playerSpecialEnergy, this.playerUltEnergy, this.oppSpecialEnergy, this.oppUltEnergy);

    if (this.oppHp <= 0) {
      this.oppSprite.setTexture(`fighter_${this.oppDef.id}_ko`);
      this.playerRoundWins++;
      this.finishRound('player', 'K.O.!');
    } else if (this.playerHp <= 0) {
      this.playerSprite.setTexture(`fighter_${this.playerDef.id}_ko`);
      this.oppRoundWins++;
      this.finishRound('opponent', 'K.O.!');
    }
  }

  // -------------------------------------------------------------
  // COMIC FX SPAWNERS
  // -------------------------------------------------------------
  private spawnComicBurst(x: number, y: number, comicKey: string) {
    // Starburst backdrop
    const star = this.add.image(x, y, 'fx_hitburst').setScale(0.6);
    this.tweens.add({
      targets: star,
      scale: 1.1,
      alpha: 0,
      duration: 350,
      onComplete: () => star.destroy(),
    });

    // Comic Word Popup
    const word = this.add.image(x, y - 10, comicKey).setScale(0.5);
    this.tweens.add({
      targets: word,
      y: y - 35,
      scale: 1.0,
      alpha: { from: 1, to: 0 },
      duration: 480,
      ease: 'Back.easeOut',
      onComplete: () => word.destroy(),
    });
  }

  private spawnDamageNumber(x: number, y: number, damage: number, isCritical: boolean) {
    const text = this.add.text(x, y, `-${damage}`, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: isCritical ? '24px' : '18px',
      color: isCritical ? '#FEF08A' : '#FFFFFF',
      stroke: isCritical ? '#DC2626' : '#7F1D1D',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: text,
      y: y - 40,
      alpha: 0,
      duration: 550,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy(),
    });
  }

  private spawnClockEffect(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      const clock = this.add.image(x - 20 - i * 15, y, 'fx_clock').setScale(0.7).setAlpha(0.8);
      this.tweens.add({
        targets: clock,
        scale: 1.2,
        alpha: 0,
        duration: 300 + i * 100,
        onComplete: () => clock.destroy(),
      });
    }
  }

  private spawnHeartParticles(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      const heart = this.add.image(x + (Math.random() * 40 - 20), y - 15, 'fx_heart').setScale(0.8);
      this.tweens.add({
        targets: heart,
        y: y - 55 - Math.random() * 20,
        alpha: 0,
        duration: 450,
        onComplete: () => heart.destroy(),
      });
    }
  }

  // -------------------------------------------------------------
  // STATE-BASED AI OPPONENT CONTROLLER
  // -------------------------------------------------------------
  private updateOpponentAI(delta: number) {
    // ---------------------------------------------------------------
    // FIX: Hard-gate AI on isRoundActive to prevent specials/ults
    // from firing after K.O. or after round ends
    // ---------------------------------------------------------------
    if (!this.isRoundActive) return;
    if (!this.spritesAlive()) return;
    if (this.oppHitStun > 0 || this.isOppAttacking) return;

    this.aiDecisionTimer -= delta;
    if (this.aiDecisionTimer > 0) return;

    // Decision Interval by Difficulty
    const decisionInterval = this.difficulty === 'easy' ? 450 : this.difficulty === 'normal' ? 260 : 130;
    this.aiDecisionTimer = decisionInterval;

    const dist = Math.abs(this.playerSprite.x - this.oppSprite.x);
    const oppSpeed = 150 * (this.oppDef.stats.speed / 75);

    // 1. Ultimate Trigger if Meter Full
    if (this.oppUltEnergy >= 100 && Math.random() < 0.75) {
      this.oppUltEnergy = 0;
      this.callbacks.onEnergyUpdate(this.playerSpecialEnergy, this.playerUltEnergy, this.oppSpecialEnergy, this.oppUltEnergy);
      this.executeUltimate('opponent', this.oppDef);
      return;
    }

    // 2. Special Move Check
    const specCost = this.oppDef.specialMove.energyCost;
    if (this.oppSpecialEnergy >= specCost && Math.random() < 0.5) {
      this.oppSpecialEnergy -= specCost;
      this.callbacks.onEnergyUpdate(this.playerSpecialEnergy, this.playerUltEnergy, this.oppSpecialEnergy, this.oppUltEnergy);
      this.executeSpecial('opponent', this.oppDef);
      return;
    }

    // 3. Close Range Combat (<105px)
    if (dist <= 105) {
      // If player is attacking and AI is Normal/Hard -> high chance to block!
      if (this.isPlayerAttacking && (this.difficulty === 'hard' ? Math.random() < 0.75 : Math.random() < 0.4)) {
        this.isOppBlocking = true;
        this.oppSprite.setVelocityX(0);
        this.oppSprite.setTexture(`fighter_${this.oppDef.id}_block`);
        this.time.delayedCall(300, () => {
          this.isOppBlocking = false;
        });
        return;
      }

      this.isOppBlocking = false;
      // Punch or Kick
      if (Math.random() < 0.55) {
        this.executePunch('opponent');
      } else {
        this.executeKick('opponent');
      }
      return;
    }

    // 4. Mid / Far Range Navigation
    const dirToPlayer = this.playerSprite.x < this.oppSprite.x ? -1 : 1;

    if (this.oppDef.id === 'guard' && Math.random() < 0.3) {
      // Guard holds ground defensively
      this.oppSprite.setVelocityX(0);
      this.oppSprite.setTexture(`fighter_${this.oppDef.id}_idle`);
      return;
    }

    // Approach Player
    this.oppSprite.setVelocityX(dirToPlayer * oppSpeed);
    this.oppSprite.setTexture(`fighter_${this.oppDef.id}_walk`);

    // Occasional Jump (if grounded)
    if (Math.random() < (this.difficulty === 'hard' ? 0.25 : 0.1) && this.oppSprite.body?.touching.down) {
      this.oppSprite.setVelocityY(-450);
      fighterAudio.playJump();
    }
  }

  // -------------------------------------------------------------
  // EXTERNAL MOBILE TOUCH HANDLERS
  // -------------------------------------------------------------
  public setMobileMove(dir: number) {
    this.touchMoveDir = dir;
  }

  public setMobileBlock(block: boolean) {
    this.touchBlocking = block;
  }
}
