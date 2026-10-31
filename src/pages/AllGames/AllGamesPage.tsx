import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GAMES, CATEGORIES } from '../../config/games';
import { GameGrid } from '../../components/GameGrid/GameGrid';
import { AdSlot } from '../../components/AdSlot/AdSlot';
import { ADSENSE_CONFIG } from '../../config/adsense';
import { SEOHead } from '../../components/SEO/SEOHead';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export const AllGamesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialFilter = searchParams.get('filter') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'plays' | 'title'>('popular');

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = game.name.toLowerCase().includes(q);
        const matchesTag = game.tags.some(t => t.toLowerCase().includes(q));
        const matchesDesc = game.description.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && game.category !== selectedCategory) {
        return false;
      }

      // Popular filter query param
      if (initialFilter === 'popular' && !game.popular) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'plays') return b.playsCount - a.playsCount;
      if (sortBy === 'title') return a.name.localeCompare(b.name);
      return b.playsCount - a.playsCount; // Default popular
    });
  }, [searchQuery, selectedCategory, initialFilter, sortBy]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="All Free Mini Games Online | Play Instant Browser Games"
        description="Browse our full collection of free mini games online with zero downloads. Play highway racing, fruit slicing, vertical climbers, endless runners, and space arcade games instantly on phone or PC."
        keywords="all mini games, free mini games online, free online games, browser games, no download games, casual games, arcade games, instant play games"
        canonicalUrl="https://www.playhere.space/games"
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          All Arcade Games
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Explore all {GAMES.length} instant arcade games. Pick a category or search your favorite genre.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-dark-border bg-dark-surface">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by game name, tag, or keyword..."
            className="w-full rounded-xl bg-dark-card border border-dark-border px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary pl-10"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-subtle" />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <ArrowUpDown className="w-4 h-4 text-text-muted" />
          <span className="text-xs text-text-muted font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="rounded-xl bg-dark-card border border-dark-border px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="plays">Total Plays</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategorySelect('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'All'
              ? 'bg-primary text-white shadow-glow-primary'
              : 'bg-dark-card text-text-muted hover:text-white border border-dark-border'
          }`}
        >
          All Games ({GAMES.length})
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => handleCategorySelect(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.name
                ? 'bg-primary text-white shadow-glow-primary'
                : 'bg-dark-card text-text-muted hover:text-white border border-dark-border'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Ad Placement on Game Listing */}
      <AdSlot
        adSlotId={ADSENSE_CONFIG.slots.gameListTop}
        adFormat="horizontal"
        label="Sponsored Arcade Listing"
      />

      {/* Results Count & Grid */}
      <div>
        <div className="text-xs text-text-muted mb-4 font-medium">
          Showing {filteredGames.length} of {GAMES.length} games
        </div>

        <GameGrid games={filteredGames} columns={3} />
      </div>
    </div>
  );
};
