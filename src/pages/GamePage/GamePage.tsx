import React, { Suspense, lazy, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { GAMES } from '../../config/games';
import { SEOHead } from '../../components/SEO/SEOHead';
import { AdSlot } from '../../components/AdSlot/AdSlot';
import { ADSENSE_CONFIG } from '../../config/adsense';
import { GameCard } from '../../components/GameCard/GameCard';
import {
  Gamepad2,
  ChevronRight,
  Star,
  Flame,
  HelpCircle,
  BookOpen,
  Keyboard,
  ShieldAlert,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Share2,
  Trophy,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { ShareModal } from '../../components/ShareModal/ShareModal';

// Lazy-load individual games for peak performance and modularity
const TrafficRacerGame = lazy(() =>
  import('../../games/traffic-racer/TrafficRacerGame').then(m => ({ default: m.TrafficRacerGame }))
);
const NeonJumpGame = lazy(() =>
  import('../../games/neon-jump/NeonJumpGame').then(m => ({ default: m.NeonJumpGame }))
);
const EndlessRunnerGame = lazy(() =>
  import('../../games/endless-runner/EndlessRunnerGame').then(m => ({ default: m.EndlessRunnerGame }))
);
const SpaceShooterGame = lazy(() =>
  import('../../games/space-shooter/SpaceShooterGame').then(m => ({ default: m.SpaceShooterGame }))
);
const FruitSlashGame = lazy(() =>
  import('../../games/fruit-slash/FruitSlashGame').then(m => ({ default: m.FruitSlashGame }))
);

export const GamePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const game = GAMES.find(g => g.slug === slug);

  if (!game) {
    return <Navigate to="/games" replace />;
  }

  const userProgress = StorageService.getGameProgress(game.id);
  const relatedGames = GAMES.filter(g => g.id !== game.id).slice(0, 3);

  // Structured Data (JSON-LD) for VideoGame schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    genre: [game.category, ...game.tags],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    operatingSystem: 'Any modern browser (Chrome, Safari, Firefox, Edge)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      ratingCount: game.playsCount,
      bestRating: '5',
      worstRating: '1',
    },
  };

  const renderGameComponent = () => {
    switch (game.id) {
      case 'traffic-racer':
        return <TrafficRacerGame />;
      case 'neon-jump':
        return <NeonJumpGame />;
      case 'endless-runner':
        return <EndlessRunnerGame />;
      case 'space-shooter':
        return <SpaceShooterGame />;
      case 'fruit-slash':
        return <FruitSlashGame />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <SEOHead
        title={`Play ${game.name} Free Online`}
        description={game.description}
        canonicalUrl={`https://miniplay.shivanandgarg1234.workers.dev//games/${game.slug}`}
        ogType="game"
        ogImage={game.thumbnail}
        structuredData={structuredData}
      />

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-muted">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-subtle" />
        <Link to="/games" className="hover:text-white transition-colors">
          Games
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-subtle" />
        <Link
          to={`/games?category=${encodeURIComponent(game.category)}`}
          className="hover:text-white transition-colors"
        >
          {game.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-subtle" />
        <span className="text-text-main font-semibold">{game.name}</span>
      </nav>

      {/* Main Game Interface Section (Game Canvas + Desktop Sidebar Ad) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Game Canvas Column */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{game.name}</h1>
              <span className="px-2 py-0.5 rounded-md bg-dark-card border border-dark-border text-xs font-semibold text-secondary">
                {game.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-xs font-semibold text-text-main transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-secondary" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {userProgress.highScore > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Best: {userProgress.highScore.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Lazy Loaded Phaser Game Container */}
          <div className="w-full flex justify-center">
            <Suspense
              fallback={
                <div className="w-full max-w-[480px] aspect-[480/720] rounded-2xl border-2 border-dark-border bg-dark-card flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-text-muted font-medium">
                    Initializing {game.name} Engine...
                  </span>
                </div>
              }
            >
              {renderGameComponent()}
            </Suspense>
          </div>

          {/* Advertisement Below Game Canvas (Compliant: well separated from game canvas) */}
          <div className="w-full mt-6">
            <AdSlot
              adSlotId={ADSENSE_CONFIG.slots.gamePageBelowCanvas}
              adFormat="horizontal"
              label="Sponsored Arcade Content"
            />
          </div>
        </div>

        {/* Desktop Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Game Quick Info Card */}
          <div className="rounded-2xl border border-dark-border bg-dark-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-xs text-text-muted">Player Rating</span>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{game.rating} / 5.0</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-xs text-text-muted">Total Global Sessions</span>
              <span className="text-xs font-bold text-text-main">
                {game.playsCount.toLocaleString()} plays
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-xs text-text-muted">Your Plays</span>
              <span className="text-xs font-bold text-secondary">
                {userProgress.totalPlays} rounds
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-text-muted block mb-2">Game Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {game.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md bg-dark-bg text-[11px] text-text-subtle border border-dark-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Advertisement (Desktop Only Placement) */}
          <div className="hidden lg:block">
            <AdSlot
              adSlotId={ADSENSE_CONFIG.slots.gamePageDesktopSidebar}
              adFormat="rectangle"
              label="Featured Partner"
            />
          </div>
        </div>
      </div>

      {/* Written Original Content Section (For Organic SEO & Players) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-8 space-y-10">
          {/* 1. Introduction */}
          <section className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5 text-primary-light font-bold text-sm uppercase tracking-wide">
              <BookOpen className="w-4 h-4" />
              <span>About {game.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {game.tagline}
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              {game.description}
            </p>
          </section>

          {/* 2. Controls Guide */}
          <section className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-secondary font-bold text-sm uppercase tracking-wide">
              <Keyboard className="w-4 h-4" />
              <span>Game Controls</span>
            </div>
            <h3 className="text-lg font-bold text-white">How to Control Your Character</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-dark-border bg-dark-bg/60 p-4 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Desktop Keyboard &amp; Mouse
                </span>
                <ul className="space-y-1.5 text-xs text-text-muted">
                  {game.controls.desktop.map((ctrl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">•</span>
                      <span>{ctrl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-dark-border bg-dark-bg/60 p-4 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Mobile Touch Gestures
                </span>
                <ul className="space-y-1.5 text-xs text-text-muted">
                  {game.controls.mobile.map((ctrl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-secondary font-bold">•</span>
                      <span>{ctrl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Rules & Mechanics */}
          <section className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4" />
              <span>Core Rules &amp; Objective</span>
            </div>
            <h3 className="text-lg font-bold text-white">Rules of Engagement</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-text-muted leading-relaxed">
              {game.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-dark-bg border border-dark-border text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Tips & Strategies */}
          <section className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm uppercase tracking-wide">
              <Lightbulb className="w-4 h-4" />
              <span>Pro Tips &amp; Strategies</span>
            </div>
            <h3 className="text-lg font-bold text-white">How to Achieve High Scores</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-text-muted leading-relaxed">
              {game.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">★</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Below Instructions Ad Placement (Compliant placement) */}
          <AdSlot
            adSlotId={ADSENSE_CONFIG.slots.gamePageBelowInstructions}
            adFormat="horizontal"
            label="Recommended Sponsor"
          />

          {/* 5. Frequently Asked Questions (FAQ Accordion) */}
          <section className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-primary-light font-bold text-sm uppercase tracking-wide">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-lg font-bold text-white">Got Questions About {game.name}?</h3>

            <div className="space-y-3 pt-2">
              {game.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-dark-border bg-dark-bg/60 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-white hover:text-primary-light transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-text-muted leading-relaxed border-t border-dark-border/40 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Related Games Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-lg font-bold text-white">More Arcade Games to Play</h3>
          <div className="space-y-4">
            {relatedGames.map(relGame => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        gameName={game.name}
        gameSlug={game.slug}
        score={userProgress.highScore}
      />
    </div>
  );
};
