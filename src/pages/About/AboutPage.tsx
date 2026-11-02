import React from 'react';
import { SEOHead } from '../../components/SEO/SEOHead';
import { Gamepad2, Zap, Heart, Trophy, Users, Shield } from 'lucide-react';

const ABOUT_STRUCTURED_DATA = [
  {
    '@type': 'Organization',
    '@id': 'https://www.playhere.space/#organization',
    name: 'MiniPlay Arcade',
    alternateName: 'MiniPlay',
    url: 'https://www.playhere.space/',
    description:
      'MiniPlay is a free online browser arcade gaming platform. It provides instant-play HTML5 mini games — zero downloads, zero registrations — built on React, TypeScript, and Phaser 3.',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.playhere.space/logo.png',
      width: 1024,
      height: 1024,
    },
    image: 'https://www.playhere.space/og-image.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@playhere.space',
    },
    sameAs: [],
  },
  {
    '@type': 'WebPage',
    '@id': 'https://www.playhere.space/about#webpage',
    url: 'https://www.playhere.space/about',
    name: 'About MiniPlay — Free Online Arcade Games, No Download',
    description:
      'Learn about MiniPlay: who built it, why it was built, the technology stack (React + Phaser 3), and our mission to deliver instant 60 FPS arcade gaming with zero downloads or sign-ups.',
    inLanguage: 'en-US',
    isPartOf: { '@id': 'https://www.playhere.space/#website' },
    about: { '@id': 'https://www.playhere.space/#organization' },
    dateModified: '2026-11-02',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead
        title="About MiniPlay — Free Online Arcade Games, No Download"
        description="MiniPlay is a free online arcade gaming platform built on React and Phaser 3. Six instant-play browser mini games — no downloads, no accounts, no paywalls. Learn who built it and why."
        canonicalUrl="https://www.playhere.space/about"
        structuredData={ABOUT_STRUCTURED_DATA}
      />

      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary-light text-xs font-semibold mb-3">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          About MiniPlay
        </h1>
        {/* Direct-answer block: self-contained for AI/GEO citability */}
        <p className="text-base text-text-muted mt-2">
          <strong>MiniPlay</strong> is a free online arcade gaming platform at <a href="https://www.playhere.space" className="text-secondary hover:underline">playhere.space</a>. It offers six instant-play browser mini games — Traffic Racer, Fruit Slash, Neon Jump, Endless Runner, Space Shooter, and Desi Meme Fighters — with no downloads, no account registration, and no paywalls. Games run at 60 FPS on any modern desktop or mobile browser using React, TypeScript, and Phaser 3.
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
          <p className="text-xs text-text-muted leading-relaxed">
            MiniPlay (<code>playhere.space</code>) is developed and maintained by an independent arcade game studio dedicated to high-quality, lightweight web gaming. We design all game mechanics, procedural graphics, and user interfaces to bring accessible, instant entertainment to players worldwide.
          </p>
          <div className="pt-2 text-xs">
            <span className="text-text-main font-semibold">Inquiries &amp; Support: </span>
            <a href="mailto:contact@playhere.space" className="text-secondary hover:underline font-mono">
              contact@playhere.space
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
