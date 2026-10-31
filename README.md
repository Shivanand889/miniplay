# MiniPlay – Addictive Online Arcade Gaming Platform

> **"Play More. Beat Your Best."**  
> Free online arcade games. No downloads. No logins. Just instant 60 FPS play.

MiniPlay is a production-ready, high-performance HTML5 browser arcade platform built with **React**, **TypeScript**, **Tailwind CSS**, and **Phaser 3**. It is specifically architected for instant mobile & desktop gameplay, high-score competition, Google AdSense monetization, and deployment to **Cloudflare Pages**.

---

## 🎮 Five Fully Playable Core Arcade Games

MiniPlay features five genuine, addictive arcade games built with dedicated Phaser 3 scenes, original procedural vector art, and zero-latency Web Audio API sound synthesis:

### 1. 🏎️ Traffic Racer (Highway Speed Arcade)
- **Slug**: `/games/traffic-racer`
- **Gameplay**: Endless 4-lane highway overtaking. Weave through sedans, slow trucks, and speedy sports cars.
- **Controls**:
  - Desktop: `Arrow Left / A` & `Arrow Right / D` to steer; `Arrow Up / W` for Nitro boost; `Arrow Down / S` to brake.
  - Mobile: On-screen Left/Right touch paddles + Nitro trigger button.
- **Mechanics**: Progressive speed, close-overtake bonus points (`+25 CLOSE!`), gold coin pickups, crash physics, unlockable vehicle skins (Inferno Red, Neon Sapphire, Cyber Gold, Midnight Phantom).

### 2. 🦘 Neon Jump (Infinite Vertical Climber)
- **Slug**: `/games/neon-jump`
- **Gameplay**: Endless vertical platform jumping. Time leaps across ascending platforms while climbing towards the stars.
- **Controls**:
  - Desktop: `Left / Right Arrows` or `A / D` (character automatically bounces on platform contact). Features screen wrap-around (exit left to appear on the right).
  - Mobile: On-screen steering controls or drag.
- **Mechanics**: Static platforms, oscillating moving platforms, fragile disappearing platforms, golden super-spring rocket power-ups (`-920 Y velocity`), height meter tracking.

### 3. 🏃 Endless Runner (Cyber Track Parkour)
- **Slug**: `/games/endless-runner`
- **Gameplay**: Fast-paced 3-lane cyberpunk track sprint.
- **Controls**:
  - Desktop: `Left / Right` to switch lanes, `Up / W / Space` to jump, `Down / S` to slide.
  - Mobile: On-screen lane switcher buttons, Jump, and Slide buttons.
- **Mechanics**: Low hurdles (must jump), overhead security beams (must slide under), solid barriers (must switch lanes), coin magnets (draws coins across lanes for 8s), blue force shields (absorbs 1 collision).

### 4. 🚀 Space Shooter (Galactic Armada Defender)
- **Slug**: `/games/space-shooter`
- **Gameplay**: Top-down arcade space dogfight. Survive enemy waves and defeat epic boss encounters.
- **Controls**:
  - Desktop: `WASD` / `Arrow Keys` to maneuver, `Spacebar` to fire blasters.
  - Mobile: Drag ship across screen with automatic continuous firing enabled.
- **Mechanics**: Scout interceptors, heavy laser gunships, 3 ship hull HP hearts, triple blaster upgrades, dreadnought boss battles with multi-shot bullet spreads.

### 5. 🍉 Fruit Slash (Juicy Dojo Slicer)
- **Slug**: `/games/fruit-slash`
- **Gameplay**: Slice airborne flying fruits with swift blade swipes while avoiding deadly explosive skull bombs.
- **Controls**:
  - Desktop: Mouse click and rapid drag across fruits.
  - Mobile: Touch and swipe gesture slicing.
- **Mechanics**: Watermelons, oranges, and strawberries with juice splatters and splitting halves; 3-strike missed fruit counter; combo multipliers (`COMBO 3X! +30 PTS`, `COMBO 5X!`) for multi-fruit slices; blade skins (Steel Katana, Plasma Cutter, Dragon Flame, Golden Muramasa).

---

## ⚡ Technology Stack & Architecture

- **Frontend Framework**: React 18
- **Language**: TypeScript 5 (Strict Mode)
- **Game Engine**: Phaser 3 (Physics Arcade, Particles, Canvas Rendering)
- **Styling**: Tailwind CSS (Custom Dark Theme: `#0B0F19`, `#111827`, `#182234`, `#6366F1`, `#38BDF8`)
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API Procedural Synthesizer (Zero network audio downloads, zero missing asset errors, 100% offline & mobile resilient)
- **Routing**: React Router DOM 6 (Client-side SPA with `_redirects` fallback)
- **State & Storage**: React Context API + Browser `LocalStorage`
- **Build Tool**: Vite 6 (Modular manual chunks: Phaser engine, Vendor, and independent lazy-loaded game chunks)

---

## 📈 Retention & Engagement Systems

1. **Local High Scores**: Every game saves personal best scores in `localStorage`.
2. **Daily Challenge**: Date-synchronized challenge objective (e.g. *"Score at least 500 in Traffic Racer today"*) rewarding bonus coins.
3. **Daily Streak Tracking**: Automatically tracks consecutive daily visits with flame counter (`🔥 3d`).
4. **Cosmetic Skin Garage**: Players spend in-game coins earned from gameplay to unlock custom cars, character glows, spaceships, and blade trails.
5. **Score Sharing**: Integrated Web Share API with clipboard copy fallback (*"I scored 2,450 in Traffic Racer on MiniPlay. Can you beat me?"*).
6. **Achievements Engine**: 12 custom achievements with celebratory confetti and arcade coin payouts.

---

## 💰 Google AdSense Monetization Setup

Monetization is configured cleanly in `src/config/adsense.ts` and encapsulated in the reusable `AdSlot` component:

### Ad Placements
1. **Homepage Top Banner** (`homeHeroBanner`)
2. **Between Homepage Game Sections** (`homeMidSection`)
3. **Game Listing Page** (`gameListTop`)
4. **Desktop Sidebar** (`gamePageDesktopSidebar`)
5. **Below Game Canvas** (`gamePageBelowCanvas`)
6. **Below Instructions** (`gamePageBelowInstructions`)
7. **Footer Banner** (`footerBanner`)

### Strict AdSense Compliance Rules Built-In
- Ads are **never** placed inside Phaser canvas elements.
- Ads are **never** placed over touch controls or keyboard areas.
- Generous padding and clear labels prevent accidental clicks.
- Ads are disabled by default until real credentials are supplied.

### Activating AdSense
1. Open `src/config/adsense.ts`.
2. Set `enabled: true`.
3. Replace `publisherId: 'ca-pub-0000000000000000'` with your approved Google AdSense publisher ID.
4. Replace slot IDs with the slots generated in your Google AdSense console.
5. Edit `public/ads.txt` and replace the placeholder line:
   ```txt
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```

---

## 📊 Google Analytics 4 (GA4) Integration

To enable optional analytics tracking:
1. Set the environment variable in your `.env` or Cloudflare Pages dashboard:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
2. The platform automatically tracks:
   - `page_view`
   - `game_opened`
   - `game_started`
   - `game_completed` (score + duration)
   - `game_replayed`
   - `game_shared`
   - `category_selected`

---

## 🔍 SEO & Organic Traffic Features

- **Unique Page Titles & Descriptions** for all games and categories.
- **Semantic HTML5** (`<main>`, `<header>`, `<footer>`, `<aside>`, `<nav>`, `<section>`).
- **Open Graph & Twitter Cards** metadata.
- **JSON-LD Structured Data** (`Schema.org` `WebSite` and `VideoGame` schemas).
- **`public/sitemap.xml`** pre-indexed with priority tags.
- **`public/robots.txt`** directing crawlers to the sitemap.
- **Original Content**: Every game page includes in-depth gameplay guides, controls, rules, strategies, FAQs, and related titles.

---

## 🚀 Deployment Guide: Cloudflare Pages

MiniPlay is optimized for 100% free static hosting on Cloudflare Pages.

### Method 1: Git Integration (Recommended)
1. Push this repository to **GitHub** or **GitLab**.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. Click **Create Application** > **Pages** > **Connect to Git**.
4. Select the `miniplay` repository.
5. In the build settings, configure:
   - **Framework preset**: `Vite` (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js Version**: `18+` or `20+`
6. Click **Save and Deploy**.

### SPA Routing & Direct URLs
The repository includes `public/_redirects` containing:
```
/* /index.html 200
```
This guarantees that refreshing direct game URLs like `/games/traffic-racer` or navigating to `/categories` works seamlessly without 404 errors.

### Custom Domain & HTTPS
1. In the Cloudflare Pages project dashboard, go to the **Custom Domains** tab.
2. Click **Set up a domain** and enter your domain name (e.g., `miniplay.com`).
3. Cloudflare automatically generates SSL/TLS certificates and forces HTTPS.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server with hot reload
npm run dev

# 3. Build for production (TypeScript check + Vite bundle)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📄 License
This project is open-source and free to deploy under the MIT License.
Procedural game engines, sound synthesizers, and vector assets crafted for MiniPlay.
