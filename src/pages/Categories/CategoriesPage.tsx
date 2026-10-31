import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, GAMES } from '../../config/games';
import { GameCard } from '../../components/GameCard/GameCard';
import { SEOHead } from '../../components/SEO/SEOHead';
import { AdSlot } from '../../components/AdSlot/AdSlot';
import { ADSENSE_CONFIG } from '../../config/adsense';
import { LayoutGrid, ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEOHead
        title="Arcade Game Categories & Genres"
        description="Explore free online arcade game categories on MiniPlay. Browse Racing, Endless Runners, Arcade Classics, Top-Down Space Shooters, Reflex and Casual games."
        canonicalUrl="https://miniplay.shivanandgarg1234.workers.dev/categories"
      />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary-light text-xs font-bold mb-2">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Curated Genres</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Game Categories
        </h1>
        <p className="text-sm text-text-muted mt-1 max-w-2xl">
          Browse through our tailored arcade genre categories. Each category features fast, 60 FPS HTML5 browser games with zero downloads.
        </p>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <a
            key={cat.name}
            href={`#${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group rounded-2xl border border-dark-border bg-dark-card p-5 transition-all hover:border-primary/50 hover:bg-dark-hover"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-dark-bg text-primary-light border border-dark-border">
                {cat.count} {cat.count === 1 ? 'Game' : 'Games'}
              </span>
              <ArrowRight className="w-4 h-4 text-text-subtle transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-primary-light transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-text-muted mt-1 line-clamp-2">
              {cat.description}
            </p>
          </a>
        ))}
      </div>

      <AdSlot
        adSlotId={ADSENSE_CONFIG.slots.homeMidSection}
        adFormat="horizontal"
        label="Sponsored Arcade Partner"
      />

      {/* Sections for Each Category */}
      <div className="space-y-16">
        {CATEGORIES.map(cat => {
          const categoryGames = GAMES.filter(
            g => g.category === cat.name || g.tags.includes(cat.name)
          );

          if (categoryGames.length === 0) return null;

          return (
            <section
              key={cat.name}
              id={cat.name.toLowerCase().replace(/\s+/g, '-')}
              className="scroll-mt-24 pt-4 border-t border-dark-border/60"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    {cat.name} Games
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {cat.description}
                  </p>
                </div>

                <Link
                  to={`/games?category=${encodeURIComponent(cat.name)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-white transition-colors"
                >
                  <span>View in Game List</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
