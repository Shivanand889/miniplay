import { GameDefinition } from '../types';

export const GAMES: GameDefinition[] = [
  {
    id: 'traffic-racer',
    slug: 'traffic-racer',
    name: 'Traffic Racer',
    tagline: 'Dodge heavy highway traffic at blistering speeds',
    description: 'Traffic Racer is a fast-paced free mini game online where you maneuver a high-performance sports car through dense multi-lane highway traffic. Dodge trucks, buses, and speeding sedans at breakneck speed while collecting coins and executing close overtakes for high-score bonuses. It runs smoothly at 60 FPS in any desktop or mobile browser with zero downloads, no installations, and no sign-up required.',
    category: 'Racing',
    tags: ['Mini Games', 'Free Games', 'Online Games', 'Racing', 'Arcade Games', 'Browser Games', 'No Download Games', 'Reflex'],
    thumbnail: '/images/games/traffic-racer.svg',
    featured: true,
    popular: true,
    rating: 4.9,
    playsCount: 14250,
    releaseDate: '2025-01-10',
    controls: {
      desktop: [
        'Arrow Left / A: Steer Left across highway lanes',
        'Arrow Right / D: Steer Right across highway lanes',
        'Arrow Up / W: Nitro Acceleration boost',
        'Arrow Down / S: Apply Brakes to avoid collisions',
        'Spacebar / P: Pause game session',
      ],
      mobile: [
        'Tap Left / Right half of screen to steer car',
        'Touch and drag your car across lanes smoothly',
        'On-screen pause and sound toggle buttons',
      ],
    },
    rules: [
      'Avoid colliding with any traffic vehicles; a single impact causes an instant crash.',
      'Passing vehicles at high speed awards close-overtake bonus points.',
      'Collect gold coins scattered across the road lanes to unlock new sports car skins.',
      'Speed gradually increases over time as you travel deeper down the highway.',
    ],
    tips: [
      'Anticipate traffic flow: look 2-3 car lengths ahead rather than focusing solely on your vehicle.',
      'Switch lanes early when you see a slower truck occupying your line.',
      'Use the center dividing lines as quick passing corridors.',
      'High risk yields high rewards: close overtakes rapidly boost your score multiplier!',
    ],
    faqs: [
      {
        question: 'How do you play Traffic Racer online with no download?',
        answer: 'You can play Traffic Racer instantly in your web browser by navigating to MiniPlay on PC, Mac, iPhone, or Android. Click "Start Racing" to begin immediately with no app store downloads, installations, or registration required.'
      },
      {
        question: 'How do you unlock new racing cars and paint skins?',
        answer: 'Earn gold coins by collecting them on the highway lanes and scoring close overtakes. Once you collect 100, 300, or 500 coins, open the Car Garage menu on the game screen to unlock and equip custom paint jobs like Neon Sapphire and Cyber Gold.'
      },
      {
        question: 'What is the best strategy to get a high score in Traffic Racer?',
        answer: 'Focus on staying near the center lanes where you have two escape routes. Look ahead to anticipate lane blockages, feather your brakes before tight gaps, and perform close overtakes at top speed to trigger big combo score multipliers.'
      }
    ],
    skins: [
      { id: 'classic_red', name: 'Inferno Red', cost: 0, unlocked: true, color: '#EF4444', secondaryColor: '#B91C1C', description: 'Standard high-performance sports racer.' },
      { id: 'neon_sapphire', name: 'Neon Sapphire', cost: 100, unlocked: false, color: '#38BDF8', secondaryColor: '#0284C7', description: 'Electrified aerodynamic street machine.' },
      { id: 'cyber_gold', name: 'Cyber Gold', cost: 300, unlocked: false, color: '#F59E0B', secondaryColor: '#D97706', description: 'Luxury 24k gold-plated championship supercar.' },
      { id: 'midnight_phantom', name: 'Midnight Phantom', cost: 500, unlocked: false, color: '#A855F7', secondaryColor: '#7E22CE', description: 'Stealth-grade carbon fiber speed demon.' },
    ],
  },
  {
    id: 'neon-jump',
    slug: 'neon-jump',
    name: 'Neon Jump',
    tagline: 'Bounce through neon skies and reach the stars',
    description: 'Neon Jump is an endless vertical platform jumping game designed for quick, addictive browser play. Guide your cheerful neon character upward across static, horizontally moving, and fragile platforms while grabbing golden super springs for massive altitude boosts. Enjoy smooth physics and screen-wrapping mechanics on any phone or desktop without installing apps or creating accounts.',
    category: 'Arcade',
    tags: ['Mini Games', 'Arcade Games', 'Free Online Games', 'Platformer', 'Vertical', 'Jumping', 'Casual Games', 'No Download Games'],
    thumbnail: '/images/games/neon-jump.svg',
    featured: false,
    popular: true,
    rating: 4.8,
    playsCount: 11890,
    releaseDate: '2025-01-15',
    controls: {
      desktop: [
        'Arrow Left / A: Move Left',
        'Arrow Right / D: Move Right',
        'Character auto-bounces upon landing on any platform',
        'Screen wrap: exit the left edge to reappear on the right edge',
      ],
      mobile: [
        'Touch and drag left or right across the screen',
        'Dedicated on-screen left and right touch steering buttons',
      ],
    },
    rules: [
      'Land on platforms to bounce higher into the sky.',
      'Static cyan platforms are solid, stable, and permanent.',
      'Moving purple platforms oscillate horizontally—time your leap carefully.',
      'Orange disappearing platforms shatter after a single bounce.',
      'Collect golden power springs for massive rocket jumps!',
      'Falling below the bottom of the camera view ends the game.',
    ],
    tips: [
      'Take advantage of screen wrapping: exiting through the left border teleports you to the right border.',
      'Prioritize landing on solid platforms over risky moving ones unless a spring is present.',
      'Springs give you invulnerable super-boost momentum; aim for them whenever they spawn.',
    ],
    faqs: [
      {
        question: 'Is Neon Jump a free browser game with no download?',
        answer: 'Yes, Neon Jump is 100% free to play directly in your web browser. There are no downloads, zero waiting, and no account setup required. It loads in seconds on mobile Safari, Chrome, Edge, and Firefox.'
      },
      {
        question: 'How do you climb higher in Neon Jump without falling?',
        answer: 'Master the screen-wrapping mechanic to teleport between screen edges, time your landings on the center of moving platforms, and prioritize grabbing golden springs which launch you dozens of meters upward safely.'
      },
      {
        question: 'Do platforms disappear or move as you get higher?',
        answer: 'Yes. As your altitude climbs past 100 meters, moving purple platforms and single-use fragile orange platforms appear more frequently, challenging your timing and spatial awareness.'
      }
    ],
    skins: [
      { id: 'cyan_glow', name: 'Cyan Glow', cost: 0, unlocked: true, color: '#06B6D4', secondaryColor: '#0891B2', description: 'Classic glowing cyan cyber bouncer.' },
      { id: 'plasma_violet', name: 'Plasma Violet', cost: 100, unlocked: false, color: '#C084FC', secondaryColor: '#9333EA', description: 'Radiates mystical energetic violet particles.' },
      { id: 'solar_flare', name: 'Solar Flare', cost: 300, unlocked: false, color: '#FB923C', secondaryColor: '#EA580C', description: 'Infused with intense sunburst yellow and orange light.' },
      { id: 'matrix_emerald', name: 'Matrix Emerald', cost: 500, unlocked: false, color: '#34D399', secondaryColor: '#059669', description: 'Retro digital matrix hacker aesthetic.' },
    ],
  },
  {
    id: 'endless-runner',
    slug: 'endless-runner',
    name: 'Endless Runner',
    tagline: 'Sprint, slide, and leap across high-voltage tracks',
    description: 'Endless Runner is an exhilarating 3-lane parkour mini game online that tests your split-second reflexes. Sprint across futuristic tracks, jump over electrified barriers, slide under overhead laser gates, and collect coin magnets and shields to survive as long as possible. Jump in instantly from any phone or PC browser with no sign-ups or downloads needed.',
    category: 'Endless Runner',
    tags: ['Mini Games', 'Free Online Games', 'Runner', 'Parkour', 'Action Games', 'Browser Games', 'Quick Games', 'No Sign Up'],
    thumbnail: '/images/games/endless-runner.svg',
    featured: false,
    popular: true,
    rating: 4.85,
    playsCount: 13420,
    releaseDate: '2025-01-20',
    controls: {
      desktop: [
        'Arrow Left / A: Switch to Left Lane',
        'Arrow Right / D: Switch to Right Lane',
        'Arrow Up / W / Spacebar: Jump over ground obstacles',
        'Arrow Down / S: Slide under overhead barriers',
      ],
      mobile: [
        'Swipe Left: Switch to Left Lane',
        'Swipe Right: Switch to Right Lane',
        'Swipe Up: Jump over obstacles',
        'Swipe Down: Slide under barriers',
      ],
    },
    rules: [
      'Switch between 3 distinct lanes to bypass obstacles.',
      'Jump over low ground barriers and laser trips.',
      'Slide underneath high clearance warning gates.',
      'Pick up Gold Magnets to automatically draw coins from adjacent lanes.',
      'Pick up Force Shields to survive one accidental collision without dying.',
    ],
    tips: [
      'You can switch lanes while mid-air during a jump or while sliding.',
      'Slide immediately after jumping if you need to return quickly to the ground.',
      'Power-up icons glow brightly; prioritize shields when running speed increases.',
    ],
    faqs: [
      {
        question: 'What is Endless Runner and how do I play for free?',
        answer: 'Endless Runner is a free 3-lane browser arcade game where your character runs automatically. You switch lanes, jump over hurdles, and slide under barriers using arrow keys on desktop or swipe gestures on mobile without downloading anything.'
      },
      {
        question: 'How do power-ups work in Endless Runner?',
        answer: 'Collect glowing power-up orbs on the track to activate special abilities: Gold Magnets automatically pull nearby coins into your wallet for 8 seconds, while Force Shields absorb one collision so you can keep running.'
      },
      {
        question: 'Can I play Endless Runner on my mobile phone browser?',
        answer: 'Yes! The game features full responsive touchscreen support. Simply swipe left, right, up, or down on your phone display in Safari or Chrome for seamless one-finger arcade gameplay.'
      }
    ],
    skins: [
      { id: 'cyber_runner', name: 'Cyber Runner', cost: 0, unlocked: true, color: '#38BDF8', secondaryColor: '#6366F1', description: 'Agile street sprinter equipped with kinetic boots.' },
      { id: 'stealth_ninja', name: 'Stealth Ninja', cost: 100, unlocked: false, color: '#10B981', secondaryColor: '#047857', description: 'Shadow warrior with high-precision agility.' },
      { id: 'golden_champion', name: 'Golden Champion', cost: 300, unlocked: false, color: '#FBBF24', secondaryColor: '#D97706', description: 'Gilded athletic suit rewarded for elite endurance.' },
      { id: 'void_phantom', name: 'Void Phantom', cost: 500, unlocked: false, color: '#EC4899', secondaryColor: '#BE185D', description: 'Futuristic holographic particle projection.' },
    ],
  },
  {
    id: 'space-shooter',
    slug: 'space-shooter',
    name: 'Space Shooter',
    tagline: 'Defend the galaxy against relentless alien armadas',
    description: 'Space Shooter is a classic retro-style top-down arcade shoot-em-up playable for free in any browser. Pilot an advanced starship through waves of enemy alien fighters, dodge plasma missiles, grab triple-shot weapon upgrades, and defeat titanic Dreadnought bosses. Enjoy fluid 60 FPS galactic action with instant browser loading and zero downloads on mobile or PC.',
    category: 'Shooting',
    tags: ['Mini Games', 'Arcade Games', 'Shooting Games', 'Space Shooter', 'Retro Games', 'Browser Games', 'No Download Games'],
    thumbnail: '/images/games/space-shooter.svg',
    featured: false,
    popular: true,
    rating: 4.9,
    playsCount: 16100,
    releaseDate: '2025-01-25',
    controls: {
      desktop: [
        'Arrow Keys / WASD: Maneuver spaceship across screen',
        'Spacebar: Fire primary blasters (or hold for auto-fire)',
        'P / Esc: Pause mission',
      ],
      mobile: [
        'Touch & drag ship anywhere on screen for 1:1 maneuvering',
        'Auto-fire active by default on mobile for smooth single-finger play',
      ],
    },
    rules: [
      'Destroy alien fighters before they reach the bottom perimeter.',
      'Dodge enemy plasma bolts and incoming asteroid fragments.',
      'Defeat Wave 5 and Wave 10 to summon colossal Alien Dreadnought Bosses.',
      'Collect Triple-Shot (P), Laser Beam (L), and Shield (S) floating drops.',
      'You have 3 ship hull hit points; repair kits restore 1 health point.',
    ],
    tips: [
      'Stay in the lower third of the display to maintain maximum reaction time against incoming missiles.',
      'Triple-shot clears swarms quickly, while focused lasers destroy heavy dreadnoughts in seconds.',
      'Bosses flash red when sustaining critical structural damage.',
    ],
    faqs: [
      {
        question: 'Is Space Shooter free to play with no sign up?',
        answer: 'Yes! Space Shooter is completely free and requires no account creation, credit cards, or app downloads. Just launch the game page and start blasting alien fighters immediately.'
      },
      {
        question: 'How do weapon upgrades and shields work in Space Shooter?',
        answer: 'Defeated enemy commanders occasionally drop power-up capsules: collect "P" for wide Triple-Shot cannons, "L" for concentrated Laser Beams, and "S" for an energy shield that deflects incoming enemy fire.'
      },
      {
        question: 'How do you beat the boss ships in Space Shooter?',
        answer: 'Bosses appear every 5 waves. Keep your starfighter moving horizontally across the bottom of the screen, avoid the central turret laser, and continuously fire at the glowing core until the boss explodes.'
      }
    ],
    skins: [
      { id: 'star_fighter', name: 'Star Fighter', cost: 0, unlocked: true, color: '#38BDF8', secondaryColor: '#1E40AF', description: 'Standard Federation interceptor class craft.' },
      { id: 'plasma_striker', name: 'Plasma Striker', cost: 100, unlocked: false, color: '#10B981', secondaryColor: '#065F46', description: 'Tuned for hyper-velocity combat maneuvers.' },
      { id: 'crimson_dread', name: 'Crimson Dread', cost: 300, unlocked: false, color: '#EF4444', secondaryColor: '#991B1B', description: 'Heavy armored hull forged in deep space nebulae.' },
      { id: 'void_cruiser', name: 'Void Cruiser', cost: 500, unlocked: false, color: '#8B5CF6', secondaryColor: '#5B21B6', description: 'Dark matter fueled experimental stealth destroyer.' },
    ],
  },
  {
    id: 'fruit-slash',
    slug: 'fruit-slash',
    name: 'Fruit Slash',
    tagline: 'Slice juicy flying fruits and dodge explosive bombs',
    description: 'Fruit Slash is a wildly addictive fruit slicing arcade mini game that brings classic ninja slicing fun to your web browser. Swipe your finger or drag your mouse across flying watermelons, oranges, and strawberries to slice them in half while avoiding dangerous explosive bombs. Chain together rapid multi-fruit combos for massive point multipliers in this fast, free instant-play browser game.',
    category: 'Reflex',
    tags: ['Mini Games', 'Fruit Slash', 'Casual Games', 'Reflex Games', 'Free Online Games', 'Browser Games', 'Games to Play When Bored', 'Instant Play'],
    thumbnail: '/images/games/fruit-slash.svg',
    featured: false,
    popular: true,
    rating: 4.95,
    playsCount: 18900,
    releaseDate: '2025-01-28',
    controls: {
      desktop: [
        'Click and drag mouse rapidly across fruit to slash',
        'Hold Left Mouse Button and create sweeping blade cuts',
      ],
      mobile: [
        'Swipe your finger across screen over flying fruits',
        'Multi-touch supported for slicing multiple fruits simultaneously',
      ],
    },
    rules: [
      'Slice fruits before they drop off the bottom of the screen.',
      'Missing 3 fruits expends your 3 lives and concludes the round.',
      'NEVER slice black explosive skull bombs—detonating a bomb causes instant game over!',
      'Slicing 3 or more fruits in a single swift blade stroke triggers Combo Multipliers (x3, x4, x5)!',
      'Earn extra coins for big combos to unlock custom blades in the Armory.',
    ],
    tips: [
      'Wait for fruits to reach the apex of their trajectory when their movement momentarily slows down.',
      'Slice in diagonal strokes across groups rather than making erratic individual cuts.',
      'Listen for the bomb fuse sizzling audio cue to know when explosives are airborne.',
    ],
    faqs: [
      {
        question: 'How do you play Fruit Slash online for free with no download?',
        answer: 'You can play Fruit Slash for free on MiniPlay directly inside Chrome, Safari, or Edge. Simply click "Enter Dojo" and use your mouse cursor on desktop or your finger on mobile to slice flying fruits across the screen.'
      },
      {
        question: 'How do combo multipliers work in Fruit Slash?',
        answer: 'When you slice 3, 4, or 5 fruits in a single continuous blade swipe within a split second, you trigger Combo Multipliers that award huge bonus points and extra coins for blade upgrades.'
      },
      {
        question: 'What happens if you slice a bomb in Fruit Slash?',
        answer: 'Slicing a black skull bomb causes an immediate explosion and instant game over. However, letting bombs drop off the bottom of the screen without touching them is completely safe and does not cost any lives.'
      }
    ],
    skins: [
      { id: 'steel_katana', name: 'Steel Katana', cost: 0, unlocked: true, color: '#E2E8F0', secondaryColor: '#94A3B8', description: 'Razor-sharp traditional samurai steel blade.' },
      { id: 'plasma_cutter', name: 'Plasma Cutter', cost: 100, unlocked: false, color: '#06B6D4', secondaryColor: '#0284C7', description: 'Cuts through fruit with electrified cyan laser trails.' },
      { id: 'dragon_flame', name: 'Dragon Flame', cost: 300, unlocked: false, color: '#F97316', secondaryColor: '#DC2626', description: 'Leaves scorching fiery particle trails with every swipe.' },
      { id: 'golden_muramasa', name: 'Golden Muramasa', cost: 500, unlocked: false, color: '#FBBF24', secondaryColor: '#B45309', description: 'Legendary gilded blade that radiates sparkling stardust.' },
    ],
  },
  {
    id: 'desi-meme-fighters',
    slug: 'desi-meme-fighters',
    name: 'Desi Meme Fighters',
    tagline: 'Four legends. One arena. Unlimited drama.',
    description: 'Desi Meme Fighters is an action-packed 2D arcade fighting game featuring four hilarious Indian meme-inspired brawlers: Jaldi The Late, Pookie Don, Mega Mart Guard, and Vadapav Warrior. Battle intelligent local AI opponents across best-of-3 rounds, execute comic punches and kicks, and trigger meme-themed special attacks and ultimate moves with full comic DHISHOOM effects. 100% free with zero downloads or installs.',
    category: 'Action',
    tags: ['Mini Games', 'Fighting Games', 'Meme Games', 'Action Games', 'Arcade Games', 'Free Online Games', 'Browser Games', 'No Download Games', 'Funny Games', 'Casual Games'],
    thumbnail: '/images/games/desi-meme-fighters.svg',
    featured: true,
    popular: true,
    rating: 4.96,
    playsCount: 22400,
    releaseDate: '2025-02-01',
    controls: {
      desktop: [
        'A / D: Move Left / Move Right',
        'W: Jump into the air',
        'J: Quick Punch (builds Special and Ultimate meter)',
        'K: Heavy Kick (powerful reach and knockback)',
        'L (Hold): Defensive Block (reduces incoming damage by 80%)',
        'U: Special Move (Late Entry / Pookie Shuffle / Entry Denied / Chutney Blast)',
        'I: Ultimate Move (Full meter cinematic combo finisher)',
      ],
      mobile: [
        'On-screen D-Pad: Left, Right, and Jump buttons',
        'Action Buttons: Dedicated touch targets for Punch, Kick, Block, Special, and Ultimate',
        'Full simultaneous keyboard and touch control support with no page scroll interference',
      ],
    },
    rules: [
      'Matches are structured as Best of 3 rounds; the first fighter to secure two round victories wins the match.',
      'Each round lasts 60 seconds. Reduce your opponent’s health bar to zero to score a K.O. victory.',
      'Landing normal punches and kicks builds Special Energy and charges your Ultimate meter.',
      'Holding Block cushions enemy attacks and prevents hit-stun knockback.',
      'Special moves consume energy and have unique crowd-control properties (projectiles, dashes, alert barriers).',
      'Fill your Ultimate meter to 100% to unleash a cinematic super finisher with massive damage.',
    ],
    tips: [
      'Mix up fast punches with reach kicks to prevent the AI opponent from predicting your attacks.',
      'Use Defensive Block (L) when the AI approaches to absorb their hits, then counter-attack immediately.',
      'Save your Ultimate move (I) for when the opponent is pinned against the arena edge for guaranteed impact.',
      'Each character has different stats: Mega Mart Guard has high defense, Jaldi has unmatched speed, and Vadapav Warrior deals devastating damage.',
    ],
    faqs: [
      {
        question: 'How do you play Desi Meme Fighters online for free with no download?',
        answer: 'You can play Desi Meme Fighters instantly on MiniPlay across Chrome, Safari, Edge, or Firefox. Select your preferred desi meme legend, pick an AI opponent or choose Random, and jump straight into the street arena without any app store downloads or registrations.'
      },
      {
        question: 'Who are the four characters in Desi Meme Fighters?',
        answer: 'The game features four unique Indian meme legends: Jaldi The Late (super-speedster with a ticking watch), Pookie Don (gangster with oversized shades and cute dance steps), Mega Mart Guard (disciplined store guard with a loud whistle and entry barriers), and Vadapav Warrior (street-food master who hurls spicy chutney bombs and fiery vada pavs).'
      },
      {
        question: 'Does the game support touch controls on mobile phones?',
        answer: 'Yes! Desi Meme Fighters features responsive touch buttons for Left, Right, Jump, Punch, Kick, Block, Special, and Ultimate moves, optimized for smooth 60 FPS gameplay on iOS and Android browsers.'
      }
    ],
    skins: [
      { id: 'classic_jaldi', name: 'Original Streetwear', cost: 0, unlocked: true, color: '#EA580C', secondaryColor: '#FBBF24', description: 'Standard high-visibility orange track jacket.' },
      { id: 'royal_pookie', name: 'Royal Pookie Purple', cost: 100, unlocked: false, color: '#7E22CE', secondaryColor: '#EC4899', description: 'Tailored luxury blazer with 24k gold chain.' },
      { id: 'khaki_guard', name: 'Khaki Security Elite', cost: 300, unlocked: false, color: '#1E3A8A', secondaryColor: '#38BDF8', description: 'Regulation tactical uniform with gold officer badge.' },
      { id: 'mumbai_vadapav', name: 'Mumbai Master Chef', cost: 500, unlocked: false, color: '#DC2626', secondaryColor: '#F59E0B', description: 'Battle-hardened vendor apron with flaming spatula.' },
    ],
  },
];

export const CATEGORIES: { name: GameDefinition['category']; icon: string; count: number; description: string }[] = [
  { name: 'Racing', icon: 'Car', count: 1, description: 'High-speed highway overtaking, speedways, and precision steering.' },
  { name: 'Arcade', icon: 'Gamepad2', count: 1, description: 'Classic vertical climbers, bounce challenges, and retro adventures.' },
  { name: 'Endless Runner', icon: 'Footprints', count: 1, description: 'Sprint across continuous hurdles, slide under beams, and dodge traps.' },
  { name: 'Shooting', icon: 'Crosshair', count: 1, description: 'Top-down galactic dogfights, laser upgrades, and dreadnought boss fights.' },
  { name: 'Reflex', icon: 'Zap', count: 1, description: 'Blade slicing, rapid hand-eye coordination, and combo chains.' },
  { name: 'Action', icon: 'Flame', count: 3, description: 'Fast-paced combat, intense evasive maneuvers, and high stakes.' },
  { name: 'Casual', icon: 'Smile', count: 2, description: 'Pick up and play in seconds, no stress, pure addictive joy.' },
];
