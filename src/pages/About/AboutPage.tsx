import React from 'react';
import { SEOHead } from '../../components/SEO/SEOHead';
import { Gamepad2, Zap, Heart, Trophy, Users, Shield } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead
        title="About Us"
        description="Learn about MiniPlay's mission to deliver instant, high-octane 60 FPS arcade gaming in the browser without downloads or sign-ups."
        canonicalUrl="https://miniplay.shivanandgarg1234.workers.dev//about"
      />

      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary-light text-xs font-semibold mb-3">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          About MiniPlay
        </h1>
        <p className="text-base text-text-muted mt-2">
          "Play More. Beat Your Best." Free online arcade games. No downloads. Just play.
        </p>
      </div>

      <div className="space-y-8 text-sm text-text-muted leading-relaxed">
        <section className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white">Why We Built MiniPlay</h2>
          <p>
            Modern online gaming has become bogged down by mandatory account registrations, heavy downloads, invasive popups, and bloated 2GB updates just to play a quick 3-minute casual game.
          </p>
          <p>
            We created <strong>MiniPlay</strong> to bring back the pure, golden age of arcade gaming. When you visit MiniPlay, you are directly in the action. We build real, genuinely playable, addictive arcade games that run at a smooth 60 frames per second right inside modern desktop and mobile browsers.
          </p>
        </section>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-dark-border bg-dark-card/40 p-6 space-y-2">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="font-bold text-white text-base">Instant Startup</h3>
            <p className="text-xs text-text-muted">
              Built on React, TypeScript, and Phaser 3 with procedural vector textures and Web Audio synthesis for instantaneous loading.
            </p>
          </div>

          <div className="rounded-2xl border border-dark-border bg-dark-card/40 p-6 space-y-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-base">Daily Challenges</h3>
            <p className="text-xs text-text-muted">
              Compete against yourself with daily challenge objectives, track consecutive daily visit streaks, and unlock cosmetic car and blade skins.
            </p>
          </div>

          <div className="rounded-2xl border border-dark-border bg-dark-card/40 p-6 space-y-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Privacy &amp; Safety</h3>
            <p className="text-xs text-text-muted">
              No invasive tracking. We store your high scores and unlocked skins securely inside your browser's LocalStorage.
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-dark-border bg-dark-card/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">Site Operator &amp; Contact</h2>
          <p className="text-xs">
            MiniPlay is maintained by an independent arcade game development enthusiast team. For inquiries, business opportunities, or game feedback, reach out via our contact page.
          </p>
        </section>
      </div>
    </div>
  );
};
