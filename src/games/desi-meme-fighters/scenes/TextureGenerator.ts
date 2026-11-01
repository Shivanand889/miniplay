import Phaser from 'phaser';
import { FighterId } from '../types';

export class FighterTextureGenerator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public generateAllTextures(): void {
    this.generateArenaBackground();
    this.generateCommonFX();
    this.generateJaldiTextures();
    this.generatePookieTextures();
    this.generateGuardTextures();
    this.generateVadapavTextures();
    this.generateProjectiles();
  }

  // -------------------------------------------------------------
  // ARENA BACKGROUND: Desi Street Comic Atmosphere
  // -------------------------------------------------------------
  private generateArenaBackground(): void {
    if (this.scene.textures.exists('fighter_arena_bg')) return;

    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;

    // 1. Evening Sky Gradient (Vibrant Twilight)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 480);
    skyGrad.addColorStop(0, '#0F0C20');
    skyGrad.addColorStop(0.4, '#241442');
    skyGrad.addColorStop(0.7, '#431448');
    skyGrad.addColorStop(1, '#6B214A');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 480, 480);

    // Stars & Moon
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.arc(410, 70, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#241442';
    ctx.beginPath();
    ctx.arc(400, 64, 20, 0, Math.PI * 2);
    ctx.fill();

    // Distant City Skyline Silhouettes
    ctx.fillStyle = '#170E28';
    ctx.fillRect(20, 240, 50, 140);
    ctx.fillRect(65, 200, 40, 180);
    ctx.fillRect(100, 260, 60, 120);
    ctx.fillRect(160, 220, 50, 160);
    ctx.fillRect(230, 250, 45, 130);
    ctx.fillRect(275, 210, 55, 170);
    ctx.fillRect(330, 240, 40, 140);
    ctx.fillRect(370, 220, 60, 160);

    // Windows on distant buildings
    ctx.fillStyle = '#FBBF24';
    ctx.globalAlpha = 0.5;
    for (let bx = 30; bx < 420; bx += 30) {
      for (let by = 240; by < 360; by += 20) {
        if ((bx + by) % 5 === 0) {
          ctx.fillRect(bx, by, 6, 8);
        }
      }
    }
    ctx.globalAlpha = 1.0;

    // Hanging Festive Lights & Bunting (Desi Celebration Flags)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 110);
    ctx.quadraticCurveTo(240, 150, 480, 110);
    ctx.stroke();

    const flagColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];
    for (let i = 0; i < 18; i++) {
      const t = (i + 0.5) / 18;
      const fx = 480 * t;
      const fy = 110 + 40 * Math.sin(t * Math.PI);
      ctx.fillStyle = flagColors[i % flagColors.length];
      ctx.beginPath();
      ctx.moveTo(fx - 8, fy);
      ctx.lineTo(fx + 8, fy);
      ctx.lineTo(fx, fy + 14);
      ctx.closePath();
      ctx.fill();
    }

    // Street Stalls (Left: Gupta Vada Pav; Right: Super Mart)
    // Left: Vada Pav Stall
    ctx.fillStyle = '#4A1D24';
    ctx.fillRect(10, 280, 130, 110);
    // Striped Awning
    const awningW = 140 / 7;
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#DC2626' : '#FEF08A';
      ctx.beginPath();
      ctx.moveTo(5 + i * awningW, 260);
      ctx.lineTo(5 + (i + 1) * awningW, 260);
      ctx.lineTo(5 + (i + 1) * awningW, 280);
      ctx.lineTo(5 + i * awningW, 280);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('GUPTA VADA PAV', 18, 305);
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '9px sans-serif';
    ctx.fillText('HOT & SPICY • ₹15', 24, 325);

    // Right: Super Mart Storefront
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(340, 270, 130, 120);
    // Blue Awning
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#0284C7' : '#FFFFFF';
      ctx.fillRect(335 + i * (140 / 6), 255, 140 / 6, 18);
    }
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('MEGA MART', 365, 295);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px sans-serif';
    ctx.fillText('SECURITY CHECK', 362, 312);

    // Center Street Lamp
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(240, 390);
    ctx.lineTo(240, 220);
    ctx.lineTo(255, 210);
    ctx.stroke();
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(255, 218, 8, 0, Math.PI * 2);
    ctx.fill();
    // Lamp Glow
    const glow = ctx.createRadialGradient(255, 218, 2, 255, 218, 35);
    glow.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
    glow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(255, 218, 35, 0, Math.PI * 2);
    ctx.fill();

    // Arena Fighting Floor (Ground at y = 390 to 450)
    const floorGrad = ctx.createLinearGradient(0, 390, 0, 720);
    floorGrad.addColorStop(0, '#1E1B4B');
    floorGrad.addColorStop(0.3, '#17143A');
    floorGrad.addColorStop(1, '#0C0A1F');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, 390, 480, 330);

    // Glowing Arena Border Line
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, 388, 480, 4);
    ctx.fillStyle = '#EC4899';
    ctx.fillRect(0, 392, 480, 2);

    // Cobblestone pavement lines
    ctx.strokeStyle = '#312E81';
    ctx.lineWidth = 1;
    for (let py = 410; py < 480; py += 15) {
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(480, py);
      ctx.stroke();
    }

    this.scene.textures.addCanvas('fighter_arena_bg', canvas);
  }

  // -------------------------------------------------------------
  // COMMON COMIC IMPACT EFFECTS & POPUP BUBBLES
  // -------------------------------------------------------------
  private generateCommonFX(): void {
    // 1. Comic Hit Starburst
    if (!this.scene.textures.exists('fx_hitburst')) {
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(40, 40);

      // Red Outer Star
      ctx.fillStyle = '#DC2626';
      this.drawStar(ctx, 0, 0, 12, 38, 18);
      ctx.fill();

      // Yellow Inner Star
      ctx.fillStyle = '#FACC15';
      this.drawStar(ctx, 0, 0, 12, 28, 12);
      ctx.fill();

      // White Center Spark
      ctx.fillStyle = '#FFFFFF';
      this.drawStar(ctx, 0, 0, 8, 14, 6);
      ctx.fill();

      this.scene.textures.addCanvas('fx_hitburst', canvas);
    }

    // 2. Comic Word Badges (POW!, DHISHOOM!, BAM!, OYE!, TOO LATE!, etc.)
    const comicWords = [
      { key: 'comic_pow', text: 'POW!', bg: '#EA580C', border: '#FEF08A' },
      { key: 'comic_dhishoom', text: 'DHISHOOM!', bg: '#DC2626', border: '#FDE047' },
      { key: 'comic_bam', text: 'BAM!', bg: '#7C3AED', border: '#C4B5FD' },
      { key: 'comic_oye', text: 'OYE!', bg: '#D97706', border: '#FEF3C7' },
      { key: 'comic_late', text: 'TOO LATE!', bg: '#EA580C', border: '#FDE047' },
      { key: 'comic_pookie', text: 'POOKIE POWER!', bg: '#EC4899', border: '#FDF2F8' },
      { key: 'comic_denied', text: 'ENTRY DENIED!', bg: '#1E40AF', border: '#93C5FD' },
      { key: 'comic_spicy', text: 'FULL SPICY!', bg: '#B91C1C', border: '#FDE047' },
    ];

    comicWords.forEach(cw => {
      if (!this.scene.textures.exists(cw.key)) {
        const canvas = document.createElement('canvas');
        canvas.width = 140;
        canvas.height = 48;
        const ctx = canvas.getContext('2d')!;

        ctx.translate(70, 24);
        ctx.rotate(-0.08);

        // Comic speech/impact shape
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(-62, -18, 124, 36, 10);
        ctx.fill();

        ctx.fillStyle = cw.bg;
        ctx.beginPath();
        ctx.roundRect(-60, -16, 120, 32, 8);
        ctx.fill();

        ctx.strokeStyle = cw.border;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 15px Impact, Arial Black, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cw.text, 0, 1);

        this.scene.textures.addCanvas(cw.key, canvas);
      }
    });

    // 3. Heart particle (Pookie)
    if (!this.scene.textures.exists('fx_heart')) {
      const canvas = document.createElement('canvas');
      canvas.width = 24;
      canvas.height = 24;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.moveTo(12, 20);
      ctx.bezierCurveTo(4, 14, 0, 8, 4, 3);
      ctx.bezierCurveTo(8, -1, 12, 4, 12, 4);
      ctx.bezierCurveTo(12, 4, 16, -1, 20, 3);
      ctx.bezierCurveTo(24, 8, 20, 14, 12, 20);
      ctx.fill();
      this.scene.textures.addCanvas('fx_heart', canvas);
    }

    // 4. Clock particle (Jaldi)
    if (!this.scene.textures.exists('fx_clock')) {
      const canvas = document.createElement('canvas');
      canvas.width = 28;
      canvas.height = 28;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(14, 14, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(14, 14, 10, 0, Math.PI * 2);
      ctx.fill();

      // Clock hands
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, 14);
      ctx.lineTo(14, 7);
      ctx.moveTo(14, 14);
      ctx.lineTo(19, 14);
      ctx.stroke();
      this.scene.textures.addCanvas('fx_clock', canvas);
    }

    // 5. Energy Security Barrier (Mega Mart Guard)
    if (!this.scene.textures.exists('fx_barrier')) {
      const canvas = document.createElement('canvas');
      canvas.width = 30;
      canvas.height = 110;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createLinearGradient(0, 0, 30, 0);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
      grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.4)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 30, 110);

      // Warning stripes
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 3;
      for (let y = -20; y < 130; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(30, y + 20);
        ctx.stroke();
      }
      this.scene.textures.addCanvas('fx_barrier', canvas);
    }
  }

  // -------------------------------------------------------------
  // PROJECTILES: Chutney & Vada Pav
  // -------------------------------------------------------------
  private generateProjectiles(): void {
    // 1. Chutney Projectile (Vadapav Warrior Special)
    if (!this.scene.textures.exists('proj_chutney')) {
      const canvas = document.createElement('canvas');
      canvas.width = 44;
      canvas.height = 44;
      const ctx = canvas.getContext('2d')!;

      // Spicy Green & Red Chutney Bowl/Splash
      const grad = ctx.createRadialGradient(22, 22, 4, 22, 22, 18);
      grad.addColorStop(0, '#DC2626');
      grad.addColorStop(0.6, '#15803D');
      grad.addColorStop(1, '#166534');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(22, 22, 16, 0, Math.PI * 2);
      ctx.fill();

      // Splatter drops
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(6, 14, 4, 0, Math.PI * 2);
      ctx.arc(36, 10, 5, 0, Math.PI * 2);
      ctx.arc(38, 30, 4, 0, Math.PI * 2);
      ctx.fill();

      this.scene.textures.addCanvas('proj_chutney', canvas);
    }

    // 2. Vada Pav Projectile (Vadapav Warrior Ultimate)
    if (!this.scene.textures.exists('proj_vadapav')) {
      const canvas = document.createElement('canvas');
      canvas.width = 48;
      canvas.height = 44;
      const ctx = canvas.getContext('2d')!;

      // Pav Bun (Top)
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(24, 16, 20, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Golden fried Vada (Middle)
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.ellipse(24, 23, 16, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spicy Red Chutney layer
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(12, 20, 24, 3);

      // Green Chili on top
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.moveTo(22, 8);
      ctx.quadraticCurveTo(34, 4, 38, 8);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#15803D';
      ctx.stroke();

      // Pav Bun (Bottom)
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.ellipse(24, 30, 19, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      this.scene.textures.addCanvas('proj_vadapav', canvas);
    }
  }

  // -------------------------------------------------------------
  // HELPER: Cartoon Character Generator (Canvas)
  // -------------------------------------------------------------
  private createCharacterCanvas(
    fighter: FighterId,
    pose: 'idle' | 'walk' | 'punch' | 'kick' | 'block' | 'hit' | 'special' | 'ultimate' | 'ko'
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 110;
    canvas.height = 140;
    const ctx = canvas.getContext('2d')!;

    // Common Dimensions
    const cx = 55;
    const groundY = 130;

    // Draw Character based on fighter ID and pose
    switch (fighter) {
      case 'jaldi':
        this.renderJaldi(ctx, cx, groundY, pose);
        break;
      case 'pookie':
        this.renderPookie(ctx, cx, groundY, pose);
        break;
      case 'guard':
        this.renderGuard(ctx, cx, groundY, pose);
        break;
      case 'vadapav':
        this.renderVadapav(ctx, cx, groundY, pose);
        break;
    }

    return canvas;
  }

  // -------------------------------------------------------------
  // CHARACTER 1: JALDI THE LATE (Orange Jacket, Watch, Messy Hair)
  // -------------------------------------------------------------
  private renderJaldi(ctx: CanvasRenderingContext2D, cx: number, gy: number, pose: string): void {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, gy - 2, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    const isHit = pose === 'hit';
    const isKO = pose === 'ko';
    const isPunch = pose === 'punch';
    const isKick = pose === 'kick';
    const isBlock = pose === 'block';
    const isSpecial = pose === 'special';
    const isWalk = pose === 'walk';

    const lean = isSpecial ? 16 : isPunch ? 10 : isHit ? -12 : isKO ? -25 : 0;
    const bodyX = cx + lean;
    const bodyY = gy - (isKO ? 25 : 55);

    // 1. Legs / Shoes
    ctx.fillStyle = '#1F2937'; // Dark track pants
    if (isKick) {
      // Plant leg
      ctx.fillRect(bodyX - 10, bodyY + 15, 8, 38);
      // High Kick leg
      ctx.save();
      ctx.translate(bodyX + 5, bodyY + 15);
      ctx.rotate(-0.8);
      ctx.fillRect(0, -6, 45, 10);
      ctx.fillStyle = '#F59E0B'; // Sneaker
      ctx.fillRect(40, -8, 14, 12);
      ctx.restore();
    } else if (isWalk) {
      ctx.fillRect(bodyX - 12, bodyY + 15, 8, 35);
      ctx.fillRect(bodyX + 4, bodyY + 10, 8, 40);
    } else {
      ctx.fillRect(bodyX - 12, bodyY + 15, 8, 38);
      ctx.fillRect(bodyX + 4, bodyY + 15, 8, 38);
    }
    // Sneakers
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(bodyX - 16, gy - 6, 14, 7);
    if (!isKick) ctx.fillRect(bodyX + 2, gy - 6, 14, 7);

    // 2. Torso: Bright Orange Sports Track Jacket
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.roundRect(bodyX - 16, bodyY - 18, 32, 36, 6);
    ctx.fill();
    // White sport stripe down middle
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bodyX - 2, bodyY - 18, 4, 36);

    // 3. Head & Expressive Face
    const headY = bodyY - 32;
    // Neck
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(bodyX - 5, bodyY - 22, 10, 8);
    // Head oval
    ctx.fillStyle = '#FCD34D'; // Indian cartoon skin tone
    ctx.beginPath();
    ctx.arc(bodyX, headY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Spiky Messy Hair
    ctx.fillStyle = '#18181B';
    ctx.beginPath();
    ctx.moveTo(bodyX - 16, headY - 4);
    ctx.lineTo(bodyX - 20, headY - 16);
    ctx.lineTo(bodyX - 10, headY - 12);
    ctx.lineTo(bodyX - 6, headY - 24);
    ctx.lineTo(bodyX + 2, headY - 14);
    ctx.lineTo(bodyX + 10, headY - 26);
    ctx.lineTo(bodyX + 14, headY - 12);
    ctx.lineTo(bodyX + 20, headY - 16);
    ctx.lineTo(bodyX + 16, headY + 2);
    ctx.closePath();
    ctx.fill();

    // Cartoon Face Details
    ctx.fillStyle = '#000000';
    if (isHit || isKO) {
      // X X eyes
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('X', bodyX - 7, headY - 2);
      ctx.fillText('X', bodyX + 2, headY - 2);
      // Open screaming mouth
      ctx.fillStyle = '#991B1B';
      ctx.beginPath();
      ctx.arc(bodyX, headY + 7, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Expressive wide cartoon eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bodyX - 5, headY - 2, 4.5, 0, Math.PI * 2);
      ctx.arc(bodyX + 5, headY - 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(bodyX - 4, headY - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(bodyX + 6, headY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Anxious / Confident mouth
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bodyX, headY + 6, 4, 0, Math.PI);
      ctx.stroke();
    }

    // 4. Arms & Huge Wristwatch
    ctx.fillStyle = '#EA580C';
    if (isPunch) {
      // Rear arm
      ctx.fillRect(bodyX - 20, bodyY - 10, 10, 10);
      // Extended punching arm
      ctx.fillRect(bodyX + 8, bodyY - 14, 38, 10);
      // Fist
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(bodyX + 46, bodyY - 9, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (isBlock) {
      // Arms crossed defensively
      ctx.fillRect(bodyX - 4, bodyY - 14, 18, 10);
      ctx.fillRect(bodyX + 4, bodyY - 18, 10, 18);
    } else {
      // Left arm with watch
      ctx.fillRect(bodyX - 20, bodyY - 12, 10, 22);
      // Giant glowing golden wristwatch on wrist
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(bodyX - 23, bodyY + 3, 16, 6);
      ctx.fillStyle = '#38BDF8'; // Glowing watch face
      ctx.beginPath();
      ctx.arc(bodyX - 15, bodyY + 6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Right arm
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(bodyX + 12, bodyY - 12, 10, 22);
    }

    // Speed trails if Late Entry Special
    if (isSpecial) {
      ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.fillRect(bodyX - 35, bodyY - 15, 18, 30);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.fillRect(bodyX - 55, bodyY - 10, 15, 20);
    }
  }

  // -------------------------------------------------------------
  // CHARACTER 2: POOKIE DON (Purple Suit, Shades, Gold Chain)
  // -------------------------------------------------------------
  private renderPookie(ctx: CanvasRenderingContext2D, cx: number, gy: number, pose: string): void {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, gy - 2, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    const isHit = pose === 'hit';
    const isKO = pose === 'ko';
    const isPunch = pose === 'punch';
    const isKick = pose === 'kick';
    const isSpecial = pose === 'special';
    const isWalk = pose === 'walk';

    const bodyX = cx + (isPunch ? 8 : isHit ? -12 : 0);
    const bodyY = gy - (isKO ? 25 : 55);

    // 1. Legs: Purple Tailored Pants
    ctx.fillStyle = '#581C87';
    if (isKick) {
      ctx.fillRect(bodyX - 10, bodyY + 15, 9, 38);
      // Spinning Dance Kick leg
      ctx.save();
      ctx.translate(bodyX + 5, bodyY + 15);
      ctx.rotate(-0.9);
      ctx.fillRect(0, -6, 42, 10);
      ctx.fillStyle = '#FFFFFF'; // White Italian loafers
      ctx.fillRect(38, -8, 14, 11);
      ctx.restore();
    } else if (isWalk) {
      ctx.fillRect(bodyX - 12, bodyY + 15, 9, 36);
      ctx.fillRect(bodyX + 4, bodyY + 15, 9, 38);
    } else {
      ctx.fillRect(bodyX - 12, bodyY + 15, 9, 38);
      ctx.fillRect(bodyX + 4, bodyY + 15, 9, 38);
    }
    // White Shiny Loafers
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bodyX - 16, gy - 6, 14, 7);
    if (!isKick) ctx.fillRect(bodyX + 2, gy - 6, 14, 7);

    // 2. Torso: Stylish Royal Purple Jacket with Pink Lapels
    ctx.fillStyle = '#7E22CE';
    ctx.beginPath();
    ctx.roundRect(bodyX - 16, bodyY - 18, 32, 36, 6);
    ctx.fill();

    // Pink Satin Lapel / Inner Shirt
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    ctx.moveTo(bodyX - 6, bodyY - 18);
    ctx.lineTo(bodyX, bodyY - 2);
    ctx.lineTo(bodyX + 6, bodyY - 18);
    ctx.closePath();
    ctx.fill();

    // Thick Chunky Gangster Gold Chain!
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bodyX, bodyY - 8, 9, 0, Math.PI);
    ctx.stroke();

    // 3. Head & Cute Face
    const headY = bodyY - 32;
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(bodyX, headY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Slick Pompadour Hair
    ctx.fillStyle = '#1E1B4B';
    ctx.beginPath();
    ctx.arc(bodyX, headY - 8, 15, Math.PI, Math.PI * 2);
    ctx.lineTo(bodyX + 16, headY);
    ctx.lineTo(bodyX - 16, headY);
    ctx.closePath();
    ctx.fill();

    // Oversized Gangster Sunglasses (Iconic USP)
    if (!isHit && !isKO) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(bodyX - 13, headY - 4, 12, 9, 2);
      ctx.roundRect(bodyX + 1, headY - 4, 12, 9, 2);
      ctx.fill();
      // White glare across glasses
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(bodyX - 11, headY - 3, 4, 2);
      ctx.fillRect(bodyX + 3, headY - 3, 4, 2);
    } else {
      // Fallen glasses or X eyes
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('X', bodyX - 7, headY);
      ctx.fillText('X', bodyX + 2, headY);
    }

    // Cute Cheek Blush (The "Pookie" side)
    ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.beginPath();
    ctx.arc(bodyX - 9, headY + 6, 4, 0, Math.PI * 2);
    ctx.arc(bodyX + 9, headY + 6, 4, 0, Math.PI * 2);
    ctx.fill();

    // Smirking Don Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bodyX + 2, headY + 6, 4, 0.2, Math.PI * 0.8);
    ctx.stroke();

    // 4. Arms
    ctx.fillStyle = '#7E22CE';
    if (isPunch) {
      ctx.fillRect(bodyX - 18, bodyY - 10, 10, 12);
      ctx.fillRect(bodyX + 6, bodyY - 14, 38, 10);
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(bodyX + 44, bodyY - 9, 7, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(bodyX - 18, bodyY - 12, 10, 22);
      ctx.fillRect(bodyX + 10, bodyY - 12, 10, 22);
    }

    // Sparkles if Pookie Shuffle Special
    if (isSpecial) {
      ctx.fillStyle = '#EC4899';
      ctx.font = '12px sans-serif';
      ctx.fillText('♥', bodyX + 24, bodyY - 20);
      ctx.fillText('♥', bodyX - 28, bodyY - 10);
      ctx.fillStyle = '#FACC15';
      ctx.fillText('♪', bodyX + 28, bodyY + 10);
    }
  }

  // -------------------------------------------------------------
  // CHARACTER 3: MEGA MART GUARD (Khaki/Navy, Cap, Whistle, Moustache)
  // -------------------------------------------------------------
  private renderGuard(ctx: CanvasRenderingContext2D, cx: number, gy: number, pose: string): void {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, gy - 2, 32, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const isHit = pose === 'hit';
    const isKO = pose === 'ko';
    const isPunch = pose === 'punch';
    const isKick = pose === 'kick';
    const isBlock = pose === 'block';
    const isSpecial = pose === 'special';

    const bodyX = cx + (isPunch ? 6 : isHit ? -10 : 0);
    const bodyY = gy - (isKO ? 25 : 58);

    // 1. Sturdy Legs: Navy Security Trousers
    ctx.fillStyle = '#0F172A';
    if (isKick) {
      ctx.fillRect(bodyX - 12, bodyY + 16, 11, 40);
      // Heavy Security Kick
      ctx.save();
      ctx.translate(bodyX + 5, bodyY + 16);
      ctx.rotate(-0.75);
      ctx.fillRect(0, -7, 44, 12);
      ctx.fillStyle = '#000000'; // Sturdy Police Boot
      ctx.fillRect(40, -9, 15, 14);
      ctx.restore();
    } else {
      ctx.fillRect(bodyX - 13, bodyY + 16, 11, 40);
      ctx.fillRect(bodyX + 4, bodyY + 16, 11, 40);
    }
    // Black Leather Boots
    ctx.fillStyle = '#000000';
    ctx.fillRect(bodyX - 17, gy - 7, 16, 8);
    if (!isKick) ctx.fillRect(bodyX + 2, gy - 7, 16, 8);

    // 2. Broad Uniform Torso: Deep Navy Security Guard Shirt
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.roundRect(bodyX - 20, bodyY - 20, 40, 38, 5);
    ctx.fill();

    // Security Badge (Gold on chest)
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(bodyX - 10, bodyY - 14);
    ctx.lineTo(bodyX - 4, bodyY - 14);
    ctx.lineTo(bodyX - 7, bodyY - 7);
    ctx.closePath();
    ctx.fill();

    // Utility Belt with Baton
    ctx.fillStyle = '#111827';
    ctx.fillRect(bodyX - 20, bodyY + 14, 40, 6);
    ctx.fillStyle = '#4B5563'; // Baton
    ctx.fillRect(bodyX + 14, bodyY + 4, 5, 22);

    // 3. Strong Head with Thick Desi Moustache
    const headY = bodyY - 34;
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(bodyX, headY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Thick Iconic Moustache
    ctx.fillStyle = '#18181B';
    ctx.beginPath();
    ctx.moveTo(bodyX - 11, headY + 5);
    ctx.quadraticCurveTo(bodyX, headY - 1, bodyX + 11, headY + 5);
    ctx.quadraticCurveTo(bodyX, headY + 9, bodyX - 11, headY + 5);
    ctx.fill();

    // Whistle in Mouth
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(bodyX - 1, headY + 6, 8, 4);
    ctx.fillStyle = '#D97706'; // Whistle lanyard string
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bodyX - 1, headY + 7);
    ctx.lineTo(bodyX - 12, bodyY - 14);
    ctx.stroke();

    // Serious Eyes / Eyebrows
    ctx.fillStyle = '#18181B';
    // Angled strict eyebrows
    ctx.fillRect(bodyX - 9, headY - 6, 7, 2.5);
    ctx.fillRect(bodyX + 2, headY - 6, 7, 2.5);

    if (!isHit && !isKO) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(bodyX - 5, headY - 1, 2, 0, Math.PI * 2);
      ctx.arc(bodyX + 5, headY - 1, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('X', bodyX - 7, headY);
      ctx.fillText('X', bodyX + 2, headY);
    }

    // Peaked Security Cap (Dark Blue with Gold Ribbon)
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(bodyX, headY - 10, 16, Math.PI, Math.PI * 2);
    ctx.fill();
    // Cap visor
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(bodyX - 16, headY - 12, 32, 5);
    // Gold Emblem
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(bodyX, headY - 14, 4, 0, Math.PI * 2);
    ctx.fill();

    // 4. Arms
    ctx.fillStyle = '#1E3A8A';
    if (isPunch) {
      ctx.fillRect(bodyX - 22, bodyY - 12, 12, 12);
      ctx.fillRect(bodyX + 8, bodyY - 16, 40, 12);
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(bodyX + 48, bodyY - 10, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (isBlock || isSpecial) {
      // Raised Palm / Stop Hand (Entry Denied pose)
      ctx.fillRect(bodyX + 4, bodyY - 24, 28, 12);
      ctx.fillStyle = '#FCD34D'; // Open palm
      ctx.fillRect(bodyX + 28, bodyY - 32, 8, 20);
    } else {
      ctx.fillRect(bodyX - 22, bodyY - 14, 12, 24);
      ctx.fillRect(bodyX + 12, bodyY - 14, 12, 24);
    }
  }

  // -------------------------------------------------------------
  // CHARACTER 4: VADAPAV WARRIOR (Apron, Headband, Spatula, Muscles)
  // -------------------------------------------------------------
  private renderVadapav(ctx: CanvasRenderingContext2D, cx: number, gy: number, pose: string): void {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, gy - 2, 32, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const isHit = pose === 'hit';
    const isKO = pose === 'ko';
    const isPunch = pose === 'punch';
    const isKick = pose === 'kick';
    const isSpecial = pose === 'special';

    const bodyX = cx + (isPunch ? 8 : isHit ? -12 : 0);
    const bodyY = gy - (isKO ? 25 : 56);

    // 1. Legs: Rolled-up Street Trouser
    ctx.fillStyle = '#374151';
    if (isKick) {
      ctx.fillRect(bodyX - 12, bodyY + 16, 11, 40);
      // Rolling Food Kick
      ctx.save();
      ctx.translate(bodyX + 5, bodyY + 16);
      ctx.rotate(-0.85);
      ctx.fillRect(0, -7, 44, 12);
      ctx.fillStyle = '#92400E'; // Kolhapuri Chappals
      ctx.fillRect(40, -9, 14, 12);
      ctx.restore();
    } else {
      ctx.fillRect(bodyX - 13, bodyY + 16, 11, 40);
      ctx.fillRect(bodyX + 4, bodyY + 16, 11, 40);
    }
    // Kolhapuri Leather Chappals
    ctx.fillStyle = '#92400E';
    ctx.fillRect(bodyX - 17, gy - 6, 16, 7);
    if (!isKick) ctx.fillRect(bodyX + 2, gy - 6, 16, 7);

    // 2. Torso: Red Kurta Shirt with White Vendor Apron
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.roundRect(bodyX - 18, bodyY - 20, 36, 38, 5);
    ctx.fill();

    // White Kitchen Apron
    ctx.fillStyle = '#F3F4F6';
    ctx.beginPath();
    ctx.roundRect(bodyX - 12, bodyY - 14, 24, 30, 3);
    ctx.fill();
    // Apron Halter Strap
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bodyX - 8, bodyY - 14);
    ctx.lineTo(bodyX, bodyY - 22);
    ctx.lineTo(bodyX + 8, bodyY - 14);
    ctx.stroke();

    // 3. Head & Fierce Headband
    const headY = bodyY - 33;
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(bodyX, headY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Red Fighting Headband
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(bodyX - 16, headY - 10, 32, 6);
    // Headband ribbon tails floating in wind
    ctx.beginPath();
    ctx.moveTo(bodyX - 16, headY - 8);
    ctx.lineTo(bodyX - 26, headY - 4);
    ctx.lineTo(bodyX - 24, headY - 12);
    ctx.closePath();
    ctx.fill();

    // Determined street warrior eyes & stubble beard
    ctx.fillStyle = '#18181B';
    if (!isHit && !isKO) {
      // Focused eyes
      ctx.fillRect(bodyX - 7, headY - 3, 5, 3);
      ctx.fillRect(bodyX + 2, headY - 3, 5, 3);
    } else {
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('X', bodyX - 7, headY);
      ctx.fillText('X', bodyX + 2, headY);
    }

    // Light 5 o'clock shadow
    ctx.fillStyle = 'rgba(24, 24, 27, 0.25)';
    ctx.beginPath();
    ctx.arc(bodyX, headY + 6, 8, 0, Math.PI);
    ctx.fill();

    // 4. Muscular Arms & Steel Cooking Spatula Prop!
    ctx.fillStyle = '#DC2626';
    if (isPunch) {
      // Rear arm
      ctx.fillRect(bodyX - 22, bodyY - 12, 12, 12);
      // Extended Spatula Punch Arm
      ctx.fillRect(bodyX + 6, bodyY - 15, 36, 12);
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(bodyX + 42, bodyY - 9, 8, 0, Math.PI * 2);
      ctx.fill();

      // Steel Spatula in Hand!
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(bodyX + 44, bodyY - 12, 22, 6); // Handle
      ctx.fillRect(bodyX + 64, bodyY - 18, 14, 18); // Flat blade
    } else if (isSpecial) {
      // Chutney Throw Wind-up
      ctx.fillRect(bodyX - 16, bodyY - 24, 12, 24);
      ctx.fillRect(bodyX + 8, bodyY - 20, 16, 20);
      // Bowl of Chutney in hand
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.arc(bodyX + 24, bodyY - 18, 8, 0, Math.PI);
      ctx.fill();
    } else {
      // Resting arms with spatula in hand
      ctx.fillRect(bodyX - 22, bodyY - 14, 12, 24);
      ctx.fillRect(bodyX + 12, bodyY - 14, 12, 24);

      // Steel Spatula
      ctx.fillStyle = '#9CA3AF';
      ctx.fillRect(bodyX + 18, bodyY - 6, 4, 22);
      ctx.fillRect(bodyX + 14, bodyY + 16, 12, 10);
    }
  }

  // -------------------------------------------------------------
  // GENERATE SPRITES FOR ALL 4 FIGHTERS IN ALL POSES
  // -------------------------------------------------------------
  private generateJaldiTextures(): void {
    const poses: ('idle' | 'walk' | 'punch' | 'kick' | 'block' | 'hit' | 'special' | 'ultimate' | 'ko')[] = [
      'idle', 'walk', 'punch', 'kick', 'block', 'hit', 'special', 'ultimate', 'ko'
    ];
    poses.forEach(pose => {
      const key = `fighter_jaldi_${pose}`;
      if (!this.scene.textures.exists(key)) {
        const c = this.createCharacterCanvas('jaldi', pose);
        this.scene.textures.addCanvas(key, c);
      }
    });
  }

  private generatePookieTextures(): void {
    const poses: ('idle' | 'walk' | 'punch' | 'kick' | 'block' | 'hit' | 'special' | 'ultimate' | 'ko')[] = [
      'idle', 'walk', 'punch', 'kick', 'block', 'hit', 'special', 'ultimate', 'ko'
    ];
    poses.forEach(pose => {
      const key = `fighter_pookie_${pose}`;
      if (!this.scene.textures.exists(key)) {
        const c = this.createCharacterCanvas('pookie', pose);
        this.scene.textures.addCanvas(key, c);
      }
    });
  }

  private generateGuardTextures(): void {
    const poses: ('idle' | 'walk' | 'punch' | 'kick' | 'block' | 'hit' | 'special' | 'ultimate' | 'ko')[] = [
      'idle', 'walk', 'punch', 'kick', 'block', 'hit', 'special', 'ultimate', 'ko'
    ];
    poses.forEach(pose => {
      const key = `fighter_guard_${pose}`;
      if (!this.scene.textures.exists(key)) {
        const c = this.createCharacterCanvas('guard', pose);
        this.scene.textures.addCanvas(key, c);
      }
    });
  }

  private generateVadapavTextures(): void {
    const poses: ('idle' | 'walk' | 'punch' | 'kick' | 'block' | 'hit' | 'special' | 'ultimate' | 'ko')[] = [
      'idle', 'walk', 'punch', 'kick', 'block', 'hit', 'special', 'ultimate', 'ko'
    ];
    poses.forEach(pose => {
      const key = `fighter_vadapav_${pose}`;
      if (!this.scene.textures.exists(key)) {
        const c = this.createCharacterCanvas('vadapav', pose);
        this.scene.textures.addCanvas(key, c);
      }
    });
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }
}
