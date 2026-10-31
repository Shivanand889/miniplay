export interface GameBridgeCallbacks {
  onScoreUpdate: (score: number) => void;
  onCoinCollected: (totalCoinsThisRun: number) => void;
  onGameOver: (finalScore: number, coinsEarned: number) => void;
  onGameStarted?: () => void;
  onGamePaused?: () => void;
  onGameResumed?: () => void;
}

export interface GameSkinConfig {
  id: string;
  primaryColor: string;
  secondaryColor: string;
}
