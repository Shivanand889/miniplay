import { UserGameProgress, DailyChallenge } from '../types';
import { GAMES } from '../config/games';

const STORAGE_KEYS = {
  SCORES_PREFIX: 'miniplay_game_',
  TOTAL_COINS: 'miniplay_total_coins',
  STREAK: 'miniplay_daily_streak',
  ACHIEVEMENTS: 'miniplay_achievements',
  DAILY_CHALLENGE_PREFIX: 'miniplay_challenge_',
  SOUND_MUTED: 'miniplay_sound_muted',
};

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string; // YYYY-MM-DD
}

export const StorageService = {
  // Get game progress (high score, plays, coins, skins)
  getGameProgress(gameId: string): UserGameProgress {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.SCORES_PREFIX}${gameId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }

    const gameDef = GAMES.find(g => g.id === gameId);
    const defaultSkin = gameDef?.skins[0]?.id || 'default';

    return {
      highScore: 0,
      totalPlays: 0,
      lastPlayed: '',
      coinsEarned: 0,
      selectedSkin: defaultSkin,
      unlockedSkins: [defaultSkin],
    };
  },

  // Save game progress
  saveGameProgress(gameId: string, progress: UserGameProgress): void {
    try {
      localStorage.setItem(`${STORAGE_KEYS.SCORES_PREFIX}${gameId}`, JSON.stringify(progress));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  },

  // Record a completed game session
  recordScore(gameId: string, score: number, coinsGained: number): { isNewHighScore: boolean; updatedProgress: UserGameProgress } {
    const current = this.getGameProgress(gameId);
    const isNewHighScore = score > current.highScore;

    const updated: UserGameProgress = {
      ...current,
      highScore: Math.max(current.highScore, score),
      totalPlays: current.totalPlays + 1,
      lastPlayed: new Date().toISOString(),
      coinsEarned: current.coinsEarned + coinsGained,
    };

    this.saveGameProgress(gameId, updated);
    if (coinsGained > 0) {
      this.addCoins(coinsGained);
    }

    return { isNewHighScore, updatedProgress: updated };
  },

  // Coin Management
  getTotalCoins(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.TOTAL_COINS);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch {
      return 0;
    }
  },

  addCoins(amount: number): number {
    const current = this.getTotalCoins();
    const next = current + Math.max(0, amount);
    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, next.toString());
    } catch (e) {
      console.warn('Failed to save coins:', e);
    }
    return next;
  },

  deductCoins(amount: number): boolean {
    const current = this.getTotalCoins();
    if (current < amount) return false;
    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, (current - amount).toString());
      return true;
    } catch {
      return false;
    }
  },

  // Unlock Skin
  unlockSkin(gameId: string, skinId: string, cost: number): boolean {
    const progress = this.getGameProgress(gameId);
    if (progress.unlockedSkins.includes(skinId)) return true;

    if (this.deductCoins(cost)) {
      progress.unlockedSkins.push(skinId);
      progress.selectedSkin = skinId;
      this.saveGameProgress(gameId, progress);
      return true;
    }
    return false;
  },

  selectSkin(gameId: string, skinId: string): void {
    const progress = this.getGameProgress(gameId);
    if (progress.unlockedSkins.includes(skinId)) {
      progress.selectedSkin = skinId;
      this.saveGameProgress(gameId, progress);
    }
  },

  // Daily Streak
  getDailyStreak(): DailyStreakData {
    const today = new Date().toISOString().split('T')[0];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (raw) {
        const data: DailyStreakData = JSON.parse(raw);
        if (data.lastVisitDate === today) {
          return data;
        }

        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yDate = yesterday.toISOString().split('T')[0];

        if (data.lastVisitDate === yDate) {
          const updated: DailyStreakData = {
            currentStreak: data.currentStreak + 1,
            longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
            lastVisitDate: today,
          };
          localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
          return updated;
        } else {
          // Streak broken
          const reset: DailyStreakData = {
            currentStreak: 1,
            longestStreak: data.longestStreak,
            lastVisitDate: today,
          };
          localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(reset));
          return reset;
        }
      }
    } catch (e) {
      console.warn('Streak parse error:', e);
    }

    // First visit
    const initial: DailyStreakData = {
      currentStreak: 1,
      longestStreak: 1,
      lastVisitDate: today,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(initial));
    } catch (e) {}
    return initial;
  },

  // Daily Challenge Generation & Storage
  getDailyChallenge(): DailyChallenge {
    const today = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.DAILY_CHALLENGE_PREFIX}${today}`;
    
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    // Generate deterministic challenge based on date
    const dateNum = today.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
    const gameIndex = dateNum % GAMES.length;
    const game = GAMES[gameIndex];

    // Target score targets based on game
    const targetMap: Record<string, number> = {
      'traffic-racer': 500,
      'neon-jump': 400,
      'endless-runner': 450,
      'space-shooter': 600,
      'fruit-slash': 350,
    };

    const targetScore = targetMap[game.id] || 400;

    const challenge: DailyChallenge = {
      date: today,
      gameId: game.id,
      gameSlug: game.slug,
      gameName: game.name,
      targetScore,
      rewardCoins: 150,
      description: `Score at least ${targetScore} points in ${game.name} today!`,
      completed: false,
      userScore: 0,
    };

    try {
      localStorage.setItem(key, JSON.stringify(challenge));
    } catch (e) {}

    return challenge;
  },

  updateDailyChallengeScore(score: number): { completedJustNow: boolean; challenge: DailyChallenge } {
    const challenge = this.getDailyChallenge();
    const hadCompleted = challenge.completed;
    
    challenge.userScore = Math.max(challenge.userScore, score);
    if (!challenge.completed && challenge.userScore >= challenge.targetScore) {
      challenge.completed = true;
      this.addCoins(challenge.rewardCoins);
    }

    const today = new Date().toISOString().split('T')[0];
    try {
      localStorage.setItem(`${STORAGE_KEYS.DAILY_CHALLENGE_PREFIX}${today}`, JSON.stringify(challenge));
    } catch (e) {}

    return {
      completedJustNow: !hadCompleted && challenge.completed,
      challenge,
    };
  },

  // Unlocked Achievements
  getUnlockedAchievements(): Record<string, string> {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return val ? JSON.parse(val) : {};
    } catch {
      return {};
    }
  },

  unlockAchievement(id: string): boolean {
    const existing = this.getUnlockedAchievements();
    if (existing[id]) return false;

    existing[id] = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(existing));
      return true;
    } catch {
      return false;
    }
  },

  // Sound Mute Toggle
  isMuted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
    } catch {
      return false;
    }
  },

  setMuted(muted: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, muted ? 'true' : 'false');
    } catch {}
  },
};
