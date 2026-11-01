export type FighterId = 'jaldi' | 'pookie' | 'guard' | 'vadapav';

export type GameScreen = 
  | 'landing'
  | 'select-fighter'
  | 'select-opponent'
  | 'versus'
  | 'fighting'
  | 'match-result';

export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export interface FighterStats {
  health: number;  // Max health (e.g. 900 to 1100)
  attack: number;  // Attack power scale (65 to 90)
  defence: number; // Damage reduction scale (45 to 85)
  speed: number;   // Movement and attack speed (55 to 95)
}

export interface SpecialMoveInfo {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  energyCost: number; // 35-50%
  comicText: string;
  cooldownMs: number;
}

export interface UltimateMoveInfo {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  cinematicLine: string;
  comicText: string;
}

export interface FighterDefinition {
  id: FighterId;
  name: string;
  title: string;
  tagline: string;
  concept: string;
  appearance: string;
  personality: string;
  avatarColor: string;
  accentColor: string;
  bannerGradient: string;
  stats: FighterStats;
  specialMove: SpecialMoveInfo;
  ultimateMove: UltimateMoveInfo;
  memeQuotes: string[];
  victoryQuote: string;
  defeatQuote: string;
}

export interface MatchRoundResult {
  roundNumber: number;
  winner: 'player' | 'opponent' | 'draw';
  playerHealthRemaining: number;
  opponentHealthRemaining: number;
  timeRemaining: number;
}

export interface MatchSummary {
  playerFighter: FighterDefinition;
  opponentFighter: FighterDefinition;
  difficulty: DifficultyLevel;
  playerRoundWins: number;
  opponentRoundWins: number;
  isPlayerWinner: boolean;
  totalDamageDealt: number;
  totalDamageTaken: number;
  specialMovesUsed: number;
  ultimateMovesUsed: number;
  finalScore: number;
  bestScore: number;
  rounds: MatchRoundResult[];
}

export type FighterActionState =
  | 'idle'
  | 'walk'
  | 'jump'
  | 'punch'
  | 'kick'
  | 'block'
  | 'special'
  | 'ultimate'
  | 'hit'
  | 'stunned'
  | 'knockdown'
  | 'victory'
  | 'defeat';

export interface CombatHitEvent {
  attacker: 'player' | 'opponent';
  defender: 'player' | 'opponent';
  attackType: 'punch' | 'kick' | 'special' | 'ultimate';
  damage: number;
  isBlocked: boolean;
  isCritical: boolean;
  hitX: number;
  hitY: number;
  comicText?: string;
}
