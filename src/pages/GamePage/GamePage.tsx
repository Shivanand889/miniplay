import React, { Suspense, lazy, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { GAMES } from '../../config/games';
import { SEOHead } from '../../components/SEO/SEOHead';
import { AdSlot } from '../../components/AdSlot/AdSlot';
import { ADSENSE_CONFIG } from '../../config/adsense';
import { GameCard } from '../../components/GameCard/GameCard';
import {
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
  Zap,
  CheckCircle2,
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
const DesiMemeFightersGame = lazy(() =>
  import('../../games/desi-meme-fighters/DesiMemeFightersGame').then(m => ({ default: m.DesiMemeFightersGame }))
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

  // Multi-schema Structured Data (JSON-LD) for VideoGame, Breadcrumbs & FAQPage
  const structuredData = [
    {
      '@type': 'VideoGame',
      '@id': `https://www.playhere.space/games/${game.slug}#game`,
      name: game.name,
      description: game.description,
      genre: [game.category, ...game.tags],
      playMode: 'SinglePlayer',
      applicationCategory: 'BrowserGame',
      gamePlatform: ['Web Browser', 'Mobile Browser', 'Desktop'],
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
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `https://www.playhere.space/games/${game.slug}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.playhere.space/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Games',
          item: 'https://www.playhere.space/games',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: game.category,
          item: `https://www.playhere.space/games?category=${encodeURIComponent(game.category)}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: game.name,
          item: `https://www.playhere.space/games/${game.slug}`,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `https://www.playhere.space/games/${game.slug}#faq`,
      mainEntity: game.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

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
      case 'desi-meme-fighters':
        return <DesiMemeFightersGame />;
      default:
        return null;
    }
  };

  const pageTitle = game.id === 'desi-meme-fighters'
    ? 'Desi Meme Fighters – Funny Indian Arcade Fighting Game | MiniPlay'
    : `Play ${game.name} Online - Free Arcade Mini Game`;

  const pageDescription = game.id === 'desi-meme-fighters'
    ? 'Choose your favourite desi meme fighter, battle hilarious AI opponents and unleash unique special attacks in this free online arcade fighting game. Play instantly on MiniPlay.'
    : game.description;

  return (
    <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`${game.name}, play ${game.name} online, free mini games, free online games, browser games, no download games, arcade games, ${game.tags.join(', ')}`}
        canonicalUrl={`https://www.playhere.space/games/${game.slug}`}
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
      <section aria-label="Game Canvas and Player Stats" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Game Canvas Column */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <header className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Play {game.name} Online
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-dark-card border border-dark-border text-xs font-semibold text-secondary">
                {game.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-xs font-semibold text-text-main transition-colors"
                aria-label={`Share ${game.name} High Score`}
              >
                <Share2 className="w-3.5 h-3.5 text-secondary" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {userProgress.highScore > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Best: {userProgress.highScore.toLocaleString()}</span>
                </div>
              )}
            </div>
          </header>

          {/* Quick AEO Answer Banner (Clear Direct Definition for Search Overviews) */}
          <div className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-dark-card/50 border border-dark-border/70 flex items-center gap-2.5 text-xs text-text-muted">
            <Zap className="w-4 h-4 text-secondary shrink-0" />
            <span>
              <strong>Instant Play:</strong> Free browser mini game • Zero downloads • No sign-up required • Play on phone or desktop.
            </span>
          </div>

          {/* Phaser Canvas Container */}
          <div className="w-full flex justify-center">
            <Suspense
              fallback={
                <div className="w-full max-w-[480px] aspect-[480/720] rounded-2xl border-2 border-dark-border bg-dark-card flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <span className="text-xs text-text-muted">Loading {game.name}...</span>
                </div>
              }
            >
              {renderGameComponent()}
            </Suspense>
          </div>

          {/* Below-Canvas Ad Placement */}
          <div className="w-full mt-4">
            <AdSlot
              adSlotId={ADSENSE_CONFIG.slots.gamePageBelowCanvas}
              adFormat="horizontal"
              label="Sponsored Arcade Content"
            />
          </div>
        </div>

        {/* Sidebar Info & Ad Column */}
        <aside aria-label="Game Info and Sponsor" className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-dark-border bg-dark-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {game.name} Overview
            </h2>

            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-xs text-text-muted">Player Rating</span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{game.rating} / 5.0</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-xs text-text-muted">Global Plays</span>
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

            <div className="pt-2 text-[11px] text-text-subtle space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Free • No In-App Purchases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Runs in Chrome, Safari, Edge, Firefox</span>
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
        </aside>
      </section>

      {/* Written Original Content Section (Optimized for SEO, Featured Snippets & AI Overviews) */}
      <section aria-label="Game Guide, Rules, and FAQs" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-8 space-y-10">
          {/* 1. Introduction */}
          <div className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-3">
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
          </div>

          {/* 2. Controls Guide */}
          <div className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-secondary font-bold text-sm uppercase tracking-wide">
              <Keyboard className="w-4 h-4" />
              <span>How to Play</span>
            </div>
            <h2 className="text-lg font-bold text-white">Controls for Desktop Keyboard and Mobile Touch</h2>

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
                  Mobile Phone Touch Gestures
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
          </div>

          {/* 3. Rules & Mechanics */}
          <div className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4" />
              <span>Rules of the Game</span>
            </div>
            <h2 className="text-lg font-bold text-white">Objective and Survival Rules</h2>
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
          </div>

          {/* 4. Tips & Strategies */}
          <div className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm uppercase tracking-wide">
              <Lightbulb className="w-4 h-4" />
              <span>Pro Strategies</span>
            </div>
            <h2 className="text-lg font-bold text-white">Tips to Beat Your High Score</h2>
            <ul className="space-y-2 text-xs sm:text-sm text-text-muted leading-relaxed">
              {game.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">★</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Below Instructions Ad Placement (Compliant placement) */}
          <AdSlot
            adSlotId={ADSENSE_CONFIG.slots.gamePageBelowInstructions}
            adFormat="horizontal"
            label="Recommended Sponsor"
          />

          {/* 5. Frequently Asked Questions (FAQ Accordion for Featured Snippets) */}
          <section aria-label="Frequently Asked Questions" className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-primary-light font-bold text-sm uppercase tracking-wide">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-lg font-bold text-white">Everything You Need to Know About {game.name}</h2>

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
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-dark-border/40 pt-3">
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
        <aside aria-label="Related Arcade Games" className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-white">More Free Mini Games to Play</h2>
          <div className="space-y-4">
            {relatedGames.map(relGame => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </aside>
      </section>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        gameName={game.name}
        gameSlug={game.slug}
        score={userProgress.highScore}
      />
    </article>
  );
};
