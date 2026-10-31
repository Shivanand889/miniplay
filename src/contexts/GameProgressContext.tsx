import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService, DailyStreakData } from '../services/storage';
import { DailyChallenge, Achievement } from '../types';
import { ACHIEVEMENTS } from '../config/achievements';
import { soundFx } from '../games/common/SoundFx';
import confetti from 'canvas-confetti';

interface GameProgressContextType {
  coins: number;
  streak: DailyStreakData;
  dailyChallenge: DailyChallenge;
  unlockedAchievements: Record<string, string>;
  soundMuted: boolean;
  recentAchievement: Achievement | null;
  toggleSound: () => boolean;
  recordGameSession: (gameId: string, score: number, coins: number) => { isHighScore: boolean; coinsAdded: number };
  unlockSkin: (gameId: string, skinId: string, cost: number) => boolean;
  selectSkin: (gameId: string, skinId: string) => void;
  dismissAchievement: () => void;
  refreshState: () => void;
}

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

export const GameProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<number>(StorageService.getTotalCoins());
  const [streak, setStreak] = useState<DailyStreakData>(StorageService.getDailyStreak());
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(StorageService.getDailyChallenge());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, string>>(
    StorageService.getUnlockedAchievements()
  );
  const [soundMuted, setSoundMuted] = useState<boolean>(StorageService.isMuted());
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  const refreshState = useCallback(() => {
    setCoins(StorageService.getTotalCoins());
    setStreak(StorageService.getDailyStreak());
    setDailyChallenge(StorageService.getDailyChallenge());
    setUnlockedAchievements(StorageService.getUnlockedAchievements());
    setSoundMuted(StorageService.isMuted());
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const toggleSound = useCallback(() => {
    const next = soundFx.toggleMute();
    setSoundMuted(next);
    return next;
  }, []);

  const triggerAchievement = useCallback((achievementId: string) => {
    const success = StorageService.unlockAchievement(achievementId);
    if (success) {
      const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (ach) {
        StorageService.addCoins(ach.rewardCoins);
        setRecentAchievement(ach);
        soundFx.playPowerup();
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch (e) {}
      }
      refreshState();
    }
  }, [refreshState]);

  const recordGameSession = useCallback((gameId: string, score: number, coinsEarned: number) => {
    const res = StorageService.recordScore(gameId, score, coinsEarned);
    
    // Check general achievements
    triggerAchievement('first_game');
    if (score >= 100) triggerAchievement('score_100');
    if (score >= 1000) triggerAchievement('score_master');
    if (res.isNewHighScore && res.updatedProgress.totalPlays > 1) {
      triggerAchievement('high_score_breaker');
    }
    if (res.updatedProgress.totalPlays >= 10) {
      triggerAchievement('ten_games');
    }

    // Specific game achievements
    if (gameId === 'traffic-racer' && score >= 300) {
      triggerAchievement('traffic_dodger');
    } else if (gameId === 'neon-jump' && score >= 500) {
      triggerAchievement('sky_high');
    } else if (gameId === 'endless-runner' && score >= 400) {
      triggerAchievement('lane_switcher');
    } else if (gameId === 'space-shooter' && score >= 500) {
      triggerAchievement('cosmic_ace');
    } else if (gameId === 'fruit-slash' && score >= 350) {
      triggerAchievement('fruit_ninja_slasher');
    }

    // Check daily challenge
    const challengeRes = StorageService.updateDailyChallengeScore(score);
    if (challengeRes.completedJustNow) {
      triggerAchievement('daily_champion');
    }

    refreshState();

    return {
      isHighScore: res.isNewHighScore,
      coinsAdded: coinsEarned,
    };
  }, [refreshState, triggerAchievement]);

  const unlockSkin = useCallback((gameId: string, skinId: string, cost: number) => {
    const ok = StorageService.unlockSkin(gameId, skinId, cost);
    if (ok) {
      triggerAchievement('skin_collector');
      refreshState();
    }
    return ok;
  }, [refreshState, triggerAchievement]);

  const selectSkin = useCallback((gameId: string, skinId: string) => {
    StorageService.selectSkin(gameId, skinId);
    refreshState();
  }, [refreshState]);

  const dismissAchievement = useCallback(() => {
    setRecentAchievement(null);
  }, []);

  return (
    <GameProgressContext.Provider
      value={{
        coins,
        streak,
        dailyChallenge,
        unlockedAchievements,
        soundMuted,
        recentAchievement,
        toggleSound,
        recordGameSession,
        unlockSkin,
        selectSkin,
        dismissAchievement,
        refreshState,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
};

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error('useGameProgress must be used within a GameProgressProvider');
  }
  return context;
};
