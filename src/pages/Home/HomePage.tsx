import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GAMES, CATEGORIES } from '../../config/games';
import { GameCard } from '../../components/GameCard/GameCard';
import { DailyChallengeBanner } from '../../components/DailyChallengeBanner/DailyChallengeBanner';
import { AdSlot } from '../../components/AdSlot/AdSlot';
import { ADSENSE_CONFIG } from '../../config/adsense';
import { SEOHead } from '../../components/SEO/SEOHead';
import {
  Play,
  Flame,
  Gamepad2,
  Sparkles,
  Zap,
  Smartphone,
  Trophy,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const HOME_FAQS = [
  {
    question: 'What are some free mini games to play online?',
    answer: 'MiniPlay offers an instant-play arcade library of top free mini games to play online: Traffic Racer (high-speed highway dodging), Fruit Slash (ninja fruit slicing combos), Neon Jump (endless vertical platform bouncer), Endless Runner (fast 3-lane obstacle dodging), and Space Shooter (retro top-down galactic dogfights). Every game runs natively in modern web browsers on phone and desktop.'
  },
  {
    question: 'What are the best free browser games with no download?',
    answer: 'The best free browser games requiring zero downloads are lightweight HTML5 canvas arcade games. On MiniPlay, every game starts in under 2 seconds directly in Google Chrome, Apple Safari, Microsoft Edge, or Mozilla Firefox. You do not need to install APKs, download apps from an app store, or install browser plugins.'
  },
  {
    question: 'What are good free games to play when bored?',
    answer: 'When you are bored and looking for quick entertainment, instant-play casual games like Fruit Slash, Traffic Racer, and Neon Jump are ideal. They require no sign-ups or tutorials, feature immediate one-touch or keyboard controls, last 2-to-3 minutes per round, and let you challenge your personal best high score.'
  },
  {
    question: 'Can I play these fun mini games on my phone browser?',
    answer: 'Yes! All games on MiniPlay are mobile-responsive and built specifically for touchscreens. Whether you are using an iPhone on iOS Safari or an Android phone on Chrome, you can swipe, tap, and drag with fluid 60 FPS performance without downloading any mobile app.'
  },
  {
    question: 'What are the best free arcade games online?',
    answer: 'Top online arcade games focus on reflex-testing gameplay, progressive difficulty curves, high-score competition, and unlockable cosmetic upgrades. Our games feature responsive controls, local score persistence, and daily challenge replay incentives without paywalls or subscriptions.'
  }
];

export const HomePage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const featuredGame = GAMES.find(g => g.featured) || GAMES[0];
  const trendingGames = GAMES.filter(g => g.popular);

  return (
    <div className="space-y-14 sm:space-y-20 pb-12">
      <SEOHead
        title="MiniPlay - Free Mini Games Online | Play Free Browser Games (No Download)"
        description="Play free mini games online instantly on MiniPlay. No downloads, no installs, and no sign-ups. Enjoy top browser arcade games on phone and PC with zero wait."
        keywords="mini games, mini games online, free mini games, online games, free online games, play online games, arcade games, free arcade games, browser games, no download games, no sign up games, instant play games, fun games online, casual games, quick games, mobile browser games, games to play when bored, best free browser games"
        canonicalUrl="https://www.playhere.space/"
      />

      {/* Top Banner Advertisement (Compliant placement above hero fold) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <AdSlot
          adSlotId={ADSENSE_CONFIG.slots.homeHeroBanner}
          adFormat="horizontal"
          label="Sponsored Banner"
        />
      </section>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-dark-border bg-gradient-to-b from-dark-surface via-dark-card to-dark-bg p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Mini Games Online • No Downloads • Instant Play</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Play More. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-secondary to-white">
                  Beat Your Best.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Jump into exciting free browser games instantly with zero downloads, no installations, and no account sign-ups. Challenge yourself, break personal records, unlock custom skins, and enjoy quick casual games on your phone or PC.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={`/games/${featuredGame.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary hover:bg-primary-hover px-8 py-4 text-sm font-extrabold text-white shadow-glow-primary transition-all duration-200 hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Featured Game</span>
                </Link>

                <Link
                  to="/games"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border px-7 py-4 text-sm font-bold text-text-main transition-colors"
                >
                  <span>Explore All Games</span>
                  <ArrowRight className="w-4 h-4 text-text-muted" />
                </Link>
              </div>

              {/* Fast Perks Row */}
              <div className="pt-6 border-t border-dark-border/60 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-lg font-black text-white">60 FPS</div>
                  <div className="text-xs text-text-muted">Smooth Canvas Engine</div>
                </div>
                <div>
                  <div className="text-lg font-black text-amber-400">100% Free</div>
                  <div className="text-xs text-text-muted">No Sign-up Needed</div>
                </div>
                <div>
                  <div className="text-lg font-black text-secondary">Instant Play</div>
                  <div className="text-xs text-text-muted">Mobile &amp; Desktop</div>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Arcade Game Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl border-2 border-primary/40 bg-dark-card p-4 shadow-card hover:border-primary transition-all group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-dark-bg">
                  <img
                    src={featuredGame.thumbnail}
                    alt={`${featuredGame.name} - Free Online Arcade Game`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-500 font-bold text-black text-[11px] shadow-md">
                    Featured Mini Game
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors">
                      {featuredGame.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                      {featuredGame.tagline}
                    </p>
                  </div>

                  <Link
                    to={`/games/${featuredGame.slug}`}
                    className="p-3 rounded-xl bg-primary text-white shadow-glow-primary transition-transform group-hover:scale-110 shrink-0"
                    aria-label={`Play ${featuredGame.name} online for free`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Challenge Interactive Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DailyChallengeBanner />
      </section>

      {/* Trending Games Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Trending Right Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Popular Free Mini Games Online
            </h2>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-white transition-colors"
          >
            <span>View All ({GAMES.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingGames.slice(0, 3).map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Mid-Section Advertisement Placement */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot
          adSlotId={ADSENSE_CONFIG.slots.homeMidSection}
          adFormat="horizontal"
          label="Featured Gaming Sponsor"
        />
      </section>

      {/* Game Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary-light text-xs font-bold mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Discover by Genre</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Free Browser Games by Category
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-2">
            From high-speed highway traffic racing and ninja fruit slicing to endless vertical platform jumping and galactic space battles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/games?category=${encodeURIComponent(cat.name)}`}
              className="group rounded-2xl border border-dark-border bg-dark-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:bg-dark-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-dark-bg text-secondary border border-dark-border">
                  {cat.count} {cat.count === 1 ? 'Game' : 'Games'}
                </span>
                <ArrowRight className="w-4 h-4 text-text-subtle transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-secondary-light transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-text-muted mt-1 line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Today & Remaining Collection */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete Mini Games Collection
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Every arcade game is genuinely playable, mobile touch optimized, and saves scores locally in your browser.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Platform Features / Why MiniPlay */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-3xl border border-dark-border bg-dark-surface/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary-light border border-primary/30 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero Downloads, Instant Play</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Click and play within 2 seconds. No APKs, no app stores, and no account registration required. Your browser is the gaming console.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Mobile Touch Optimized</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Engineered specifically for smooth touch, swipe, and drag controls on iOS Safari and Android Chrome, even on lower-bandwidth mobile data.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Daily Streaks &amp; Skins</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Earn arcade coins through high-score gameplay to unlock custom car paints, starfighters, and samurai blades with local high-score saving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AEO / Answer Engine FAQ Section (Direct answers for Google, Perplexity, ChatGPT) */}
      <section aria-label="Frequently Asked Questions" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-3xl border border-dark-border bg-dark-card/60 p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions About Free Online Mini Games
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Everything you need to know about playing free browser games on MiniPlay with zero downloads or accounts.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {HOME_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-dark-border bg-dark-bg/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-white hover:text-primary-light transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-primary shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-dark-border/40 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
