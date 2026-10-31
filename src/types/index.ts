export type GameCategory = 
  | 'Racing' 
  | 'Endless Runner' 
  | 'Arcade' 
  | 'Action' 
  | 'Shooting' 
  | 'Reflex' 
  | 'Casual';

export interface GameSkin {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
  color: string;
  secondaryColor?: string;
  icon?: string;
  description: string;
}

export interface GameDefinition {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: GameCategory;
  tags: string[];
  thumbnail: string;
  featured?: boolean;
  popular?: boolean;
  rating: number;
  playsCount: number;
  releaseDate: string;
  controls: {
    desktop: string[];
    mobile: string[];
  };
  rules: string[];
  tips: string[];
  faqs: { question: string; answer: string }[];
  skins: GameSkin[];
}

export interface UserGameProgress {
  highScore: number;
  totalPlays: number;
  lastPlayed: string;
  coinsEarned: number;
  selectedSkin: string;
  unlockedSkins: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rewardCoins: number;
  category: 'general' | 'racer' | 'jumper' | 'runner' | 'shooter' | 'slasher';
}

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  gameId: string;
  gameSlug: string;
  gameName: string;
  targetScore: number;
  rewardCoins: number;
  description: string;
  completed: boolean;
  userScore: number;
}
