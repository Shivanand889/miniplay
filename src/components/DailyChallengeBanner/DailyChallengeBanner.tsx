import React from 'react';
import { useGameProgress } from '../../contexts/GameProgressContext';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Coins, CheckCircle2, ArrowRight } from 'lucide-react';

export const DailyChallengeBanner: React.FC = () => {
  const { dailyChallenge } = useGameProgress();

  const progressPercent = Math.min(
    100,
    Math.round((dailyChallenge.userScore / dailyChallenge.targetScore) * 100)
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-dark-surface via-dark-card to-dark-surface p-6 shadow-xl">
      {/* Background Subtle Accent Light */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary to-indigo-700 text-white shadow-glow-primary shrink-0">
            {dailyChallenge.completed ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-300" />
            ) : (
              <Calendar className="w-7 h-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-secondary-light">
                Today's Daily Challenge
              </span>
              <span className="text-xs text-text-subtle">• {dailyChallenge.date}</span>
              {dailyChallenge.completed && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Completed!
                </span>
              )}
            </div>

            <h3 className="text-lg md:text-xl font-bold text-text-main">
              {dailyChallenge.description}
            </h3>

            {/* Target & Score Tracker */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>
                  Target: <strong className="text-text-main">{dailyChallenge.targetScore} PTS</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-text-muted">
                <span>
                  Your Best Today: <strong className="text-secondary">{dailyChallenge.userScore} PTS</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Coins className="w-4 h-4" />
                <span>+{dailyChallenge.rewardCoins} Arcade Coins</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full max-w-md h-2 rounded-full bg-dark-bg overflow-hidden border border-dark-border">
              <div
                className={`h-full transition-all duration-500 ${
                  dailyChallenge.completed
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-primary to-secondary'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="shrink-0 self-stretch sm:self-auto flex sm:flex-col justify-end">
          <Link
            to={`/games/${dailyChallenge.gameSlug}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 text-sm transition-all shadow-glow-primary hover:scale-[1.02]"
          >
            <span>{dailyChallenge.completed ? 'Play Again' : 'Accept Challenge'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
