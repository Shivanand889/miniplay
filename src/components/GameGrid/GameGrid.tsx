import React from 'react';
import { GameDefinition } from '../../types';
import { GameCard } from '../GameCard/GameCard';

interface GameGridProps {
  games: GameDefinition[];
  columns?: 2 | 3 | 4;
}

export const GameGrid: React.FC<GameGridProps> = ({ games, columns = 3 }) => {
  const colClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-dark-border bg-dark-card/40 py-16 text-center">
        <p className="text-text-muted text-sm">No games found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${colClass}`}>
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};
