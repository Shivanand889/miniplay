import React from 'react';
import { useGameProgress } from '../../contexts/GameProgressContext';
import { Trophy, X, Coins } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const { recentAchievement, dismissAchievement } = useGameProgress();

  if (!recentAchievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-soft max-w-sm w-full bg-dark-card border-2 border-primary/80 rounded-xl p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-primary/20 text-primary border border-primary/40 shrink-0">
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-primary-light">
            Achievement Unlocked!
          </div>
          <h4 className="text-sm font-bold text-text-main truncate mt-0.5">
            {recentAchievement.title}
          </h4>
          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
            {recentAchievement.description}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-400">
            <Coins className="w-3.5 h-3.5" />
            <span>+{recentAchievement.rewardCoins} Arcade Coins</span>
          </div>
        </div>
        <button
          onClick={dismissAchievement}
          className="text-text-subtle hover:text-text-main p-1 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
