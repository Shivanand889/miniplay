import React from 'react';
import { Link } from 'react-router-dom';
import { GameDefinition } from '../../types';
import { Play, Star, Flame, Trophy } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface GameCardProps {
  game: GameDefinition;
  priority?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const progress = StorageService.getGameProgress(game.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card">
      {/* Thumbnail Area with Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-bg">
        <img
          src={game.thumbnail}
          alt={`${game.name} arcade game preview screenshot`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent opacity-80" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-dark-bg/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-secondary-light border border-secondary/30">
            {game.category}
          </span>
          {game.popular && (
            <span className="flex items-center gap-1 rounded-md bg-rose-500/90 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
              <Flame className="w-3 h-3" />
              <span>Trending</span>
            </span>
          )}
          {game.featured && (
            <span className="rounded-md bg-amber-500/90 px-2 py-1 text-[11px] font-bold text-black shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* High Score Pill (if user has played) */}
        {progress.highScore > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-dark-bg/90 backdrop-blur-md px-2 py-1 text-[11px] font-bold text-amber-400 border border-amber-500/30">
            <Trophy className="w-3 h-3" />
            <span>Best: {progress.highScore.toLocaleString()}</span>
          </div>
        )}

        {/* Hover Quick Play Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <Link
            to={`/games/${game.slug}`}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-glow-primary transition-transform duration-200 hover:scale-105"
            aria-label={`Play ${game.name}`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Now</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-text-main group-hover:text-primary-light transition-colors">
              <Link to={`/games/${game.slug}`}>{game.name}</Link>
            </h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{game.rating}</span>
            </div>
          </div>

          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Bottom Metadata & Play Link */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-dark-border/60">
          <div className="text-[11px] text-text-subtle">
            {game.playsCount.toLocaleString()} plays
          </div>
          <Link
            to={`/games/${game.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-secondary-light hover:text-white transition-colors"
          >
            <span>Play Game</span>
            <Play className="w-3 h-3 fill-current" />
          </Link>
        </div>
      </div>
    </div>
  );
};
