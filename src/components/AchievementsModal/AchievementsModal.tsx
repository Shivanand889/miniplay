import React, { useState } from 'react';
import { ACHIEVEMENTS } from '../../config/achievements';
import { useGameProgress } from '../../contexts/GameProgressContext';
import { Trophy, CheckCircle, Lock, X, Coins, Sparkles, Filter } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const { unlockedAchievements, coins } = useGameProgress();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const unlockedCount = Object.keys(unlockedAchievements).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filtered = ACHIEVEMENTS.filter(a => {
    const isUnlocked = !!unlockedAchievements[a.id];
    if (activeFilter === 'unlocked') return isUnlocked;
    if (activeFilter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[85vh] rounded-2xl border border-dark-border bg-dark-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-dark-border bg-dark-bg/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">Arcade Achievements</h2>
              <p className="text-xs text-text-muted">
                Completed {unlockedCount} of {totalCount} ({progressPercent}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-subtle hover:text-text-main hover:bg-dark-card transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Coin Status */}
        <div className="px-5 py-3 bg-dark-card/50 border-b border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-2/3">
            <div className="flex justify-between text-xs text-text-muted mb-1 font-medium">
              <span>Collection Progress</span>
              <span>{unlockedCount}/{totalCount} Unlocked</span>
            </div>
            <div className="w-full h-2 rounded-full bg-dark-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-amber-400 text-xs font-bold">
            <Coins className="w-4 h-4" />
            <span>{coins.toLocaleString()} Coins</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 px-5 py-3 border-b border-dark-border/50 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-dark-card text-text-muted hover:text-text-main'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('unlocked')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              activeFilter === 'unlocked'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-dark-card text-text-muted hover:text-text-main'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setActiveFilter('locked')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              activeFilter === 'locked'
                ? 'bg-dark-border text-text-main'
                : 'bg-dark-card text-text-muted hover:text-text-main'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Achievement List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filtered.map(ach => {
            const isUnlocked = !!unlockedAchievements[ach.id];
            const unlockedDate = unlockedAchievements[ach.id]
              ? new Date(unlockedAchievements[ach.id]).toLocaleDateString()
              : null;

            return (
              <div
                key={ach.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-dark-card/90 border-emerald-500/30 hover:border-emerald-500/50 shadow-sm'
                    : 'bg-dark-card/40 border-dark-border opacity-70'
                }`}
              >
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-dark-surface text-text-subtle border border-dark-border'
                  }`}
                >
                  {isUnlocked ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-text-subtle" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm ${isUnlocked ? 'text-text-main' : 'text-text-muted'}`}>
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                  {unlockedDate && (
                    <div className="text-[10px] text-text-subtle mt-1.5">
                      Unlocked on {unlockedDate}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-dark-bg/80 px-2.5 py-1 rounded-lg border border-dark-border">
                  <Coins className="w-3.5 h-3.5" />
                  <span>+{ach.rewardCoins}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
