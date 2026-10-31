import { GameDefinition } from '../types';

export const GAMES: GameDefinition[] = [
  {
    id: 'traffic-racer',
    slug: 'traffic-racer',
    name: 'Traffic Racer',
    tagline: 'Dodge heavy highway traffic at blistering speeds',
    description: 'An addictive endless highway racing game where you maneuver through multi-lane traffic at breakneck speeds. Dodge sedans, trucks, and sports cars, collect highway coins, and overtake vehicles closely to maximize your bonus points.',
    category: 'Racing',
    tags: ['Racing', 'Car', 'Endless', 'High Speed', 'Reflex'],
    thumbnail: '/images/games/traffic-racer.svg',
    featured: true,
    popular: true,
    rating: 4.9,
    playsCount: 14250,
    releaseDate: '2025-01-10',
    controls: {
      desktop: [
        'Arrow Left / A: Steer Left',
        'Arrow Right / D: Steer Right',
        'Arrow Up / W: Nitro Acceleration boost',
        'Arrow Down / S: Apply Brakes',
        'Spacebar / P: Pause game',
      ],
      mobile: [
        'Tap Left / Right half of screen to steer',
        'Touch and drag your car across lanes',
        'On-screen pause button',
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
        question: 'How do I unlock new racing cars?',
        answer: 'Collect coins while racing on the highway. Once you reach 100 or 300 coins, visit the Car Garage in the game screen to unlock and equip new visual paint skins.'
      },
      {
        question: 'Does the game get faster forever?',
        answer: 'The speed scales smoothly and caps at an exhilarating terminal velocity, challenging your pure reflexes without becoming impossible.'
      },
      {
        question: 'Can I play Traffic Racer offline?',
        answer: 'Yes! Once loaded in your browser, all game physics, assets, and sound effects run entirely locally without requiring server queries.'
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
    description: 'An endless vertical jumping arcade sensation. Guide your bouncy neon character upward across static, moving, and disappearing platforms. Pick up super springs, avoid sudden drop-offs, and climb as high as humanly possible!',
    category: 'Arcade',
    tags: ['Platformer', 'Vertical', 'Jumping', 'Neon', 'Casual'],
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
        'Characters automatically jump when landing on platforms',
        'Wrap-around screen: move off the left side to appear on the right',
      ],
      mobile: [
        'Touch and drag left or right across screen',
        'Responsive on-screen tilt/touch controls',
      ],
    },
    rules: [
      'Land on platforms to bounce higher into the sky.',
      'Static green/blue platforms are stable and permanent.',
      'Moving platforms oscillate horizontally—time your leap carefully.',
      'Orange disappearing platforms shatter after a single bounce.',
      'Collect golden power springs for massive rocket jumps!',
      'Falling off the bottom of the camera ends the game.',
    ],
    tips: [
      'Take advantage of screen wrapping: exiting through the left border teleports you to the right border.',
      'Prioritize landing on solid platforms over risky moving ones unless a spring is present.',
      'Springs give you invulnerable super-boost momentum; aim for them whenever they spawn.',
    ],
    faqs: [
      {
        question: 'What is the highest possible height in Neon Jump?',
        answer: 'The sky is infinite! Procedural platform generation scales continuously as you climb thousands of meters high.'
      },
      {
        question: 'Do platforms disappear after I jump off them?',
        answer: 'Only glowing orange warning platforms break upon contact. Regular neon platforms remain until scrolled past the bottom.'
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
    description: 'A 3-lane adrenaline-pumping endless running arcade game. Sprint through futuristic cyberpunk tracks, leap over electrified hurdles, slide under security barriers, and grab coin magnets to amass colossal scores.',
    category: 'Endless Runner',
    tags: ['Runner', 'Parkour', 'Fast Paced', 'Cyberpunk', 'Action'],
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
        'Arrow Up / W / Space: Jump over obstacles',
        'Arrow Down / S: Slide under overhead barriers',
      ],
      mobile: [
        'Swipe Left: Move Left',
        'Swipe Right: Move Right',
        'Swipe Up: Jump',
        'Swipe Down: Slide',
        'Optional touch buttons on mobile viewports',
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
        question: 'How long do power-ups last?',
        answer: 'Coin magnets and Force Shields remain active for 8 seconds, clearly indicated by a countdown timer on your HUD.'
      },
      {
        question: 'Does sliding make you invincible?',
        answer: 'Sliding only allows you to pass under overhead beam barriers; ground hurdles still require a clean jump.'
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
    description: 'A classic top-down retro-modern arcade space shooter. Command your starship against waves of alien invaders, collect plasma weapon power-ups, deploy emergency shields, and clash in epic boss encounters!',
    category: 'Shooting',
    tags: ['Space', 'Shoot em up', 'Retro', 'Sci-Fi', 'Boss Battle'],
    thumbnail: '/images/games/space-shooter.svg',
    featured: false,
    popular: true,
    rating: 4.9,
    playsCount: 16100,
    releaseDate: '2025-01-25',
    controls: {
      desktop: [
        'Arrow Keys / WASD: Maneuver spaceship',
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
        question: 'How do boss battles trigger?',
        answer: 'Every 500 points or 5 completed combat waves, a menacing mothership with multiple firing turrets warps into the sector.'
      },
      {
        question: 'Do weapon upgrades wear off?',
        answer: 'Upgrades last 12 seconds or until your ship takes hull damage.'
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
    description: 'An irresistibly addictive arcade slicing spectacle. Rapidly swipe or click-and-drag your blade across juicy flying watermelons, oranges, strawberries, bananas, and pineapples. Chain combo slices together while watching out for dangerous skull bombs!',
    category: 'Reflex',
    tags: ['Fruit', 'Slicing', 'Ninja', 'Combos', 'Reflex', 'Casual'],
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
      'Slicing 3 or more fruits in a single swift blade stroke triggers Combo Multipliers (x2, x3, x5)!',
      'Special Golden Dragonfruit awards +50 instant bonus points.',
    ],
    tips: [
      'Wait for fruits to reach the apex of their trajectory when their movement momentarily slows down.',
      'Slice in diagonal strokes across groups rather than making erratic individual cuts.',
      'Listen for the bomb fuse sizzling audio cue to know when explosives are airborne.',
    ],
    faqs: [
      {
        question: 'How do combos work?',
        answer: 'Slice 3 or more fruits in a single contiguous blade swipe (within 180 milliseconds) to unlock extra combo bonus points and vibrant text celebrations.'
      },
      {
        question: 'Does letting a bomb fall cause damage?',
        answer: 'No! You only lose lives when good fruit drops unsliced. Bombs should always be allowed to harmlessly drop off screen.'
      }
    ],
    skins: [
      { id: 'steel_katana', name: 'Steel Katana', cost: 0, unlocked: true, color: '#E2E8F0', secondaryColor: '#94A3B8', description: 'Razor-sharp traditional samurai steel blade.' },
      { id: 'plasma_cutter', name: 'Plasma Cutter', cost: 100, unlocked: false, color: '#06B6D4', secondaryColor: '#0284C7', description: 'Cuts through fruit with electrified cyan laser trails.' },
      { id: 'dragon_flame', name: 'Dragon Flame', cost: 300, unlocked: false, color: '#F97316', secondaryColor: '#DC2626', description: 'Leaves scorching fiery particle trails with every swipe.' },
      { id: 'golden_muramasa', name: 'Golden Muramasa', cost: 500, unlocked: false, color: '#FBBF24', secondaryColor: '#B45309', description: 'Legendary gilded blade that radiates sparkling stardust.' },
    ],
  },
];

export const CATEGORIES: { name: GameDefinition['category']; icon: string; count: number; description: string }[] = [
  { name: 'Racing', icon: 'Car', count: 1, description: 'High-speed highway overtaking, speedways, and precision steering.' },
  { name: 'Arcade', icon: 'Gamepad2', count: 1, description: 'Classic vertical climbers, bounce challenges, and retro adventures.' },
  { name: 'Endless Runner', icon: 'Footprints', count: 1, description: 'Sprint across continuous hurdles, slide under beams, and dodge traps.' },
  { name: 'Shooting', icon: 'Crosshair', count: 1, description: 'Top-down galactic dogfights, laser upgrades, and dreadnought boss fights.' },
  { name: 'Reflex', icon: 'Zap', count: 1, description: 'Blade slicing, rapid hand-eye coordination, and combo chains.' },
  { name: 'Action', icon: 'Flame', count: 2, description: 'Fast-paced combat, intense evasive maneuvers, and high stakes.' },
  { name: 'Casual', icon: 'Smile', count: 2, description: 'Pick up and play in seconds, no stress, pure addictive joy.' },
];
