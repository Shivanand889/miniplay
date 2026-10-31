import React from 'react';
import { SEOHead } from '../../components/SEO/SEOHead';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="Disclaimer & Advertising Disclosure"
        description="MiniPlay legal disclaimer, third-party advertising disclosures, and intellectual property notices."
        canonicalUrl="https://miniplay.shivanandgarg1234.workers.dev//disclaimer"
      />

      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Legal Notices</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Disclaimer
        </h1>
        <p className="text-xs text-text-muted mt-2">
          Last Updated: October 2025
        </p>
      </div>

      <div className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 space-y-6 text-sm text-text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. General Entertainment Disclaimer</h2>
          <p>
            The content, games, and resources available on <strong>MiniPlay</strong> are provided for recreational, leisure, and entertainment purposes only. While we aim for peak performance (60 FPS) and cross-device compatibility, games are provided "as-is" without warranty of any kind.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Google AdSense &amp; Advertising Disclosure</h2>
          <p>
            This website displays advertisements served by third-party advertising networks, primarily Google AdSense. 
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-subtle">
            <li>We do not endorse, guarantee, or verify the products or services advertised in third-party ad units.</li>
            <li>Users click on third-party advertisements at their own discretion.</li>
            <li>MiniPlay strictly prohibits deceptive ad placement and does not place ads inside the playable game canvas or directly over controls.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Non-Affiliation Notice</h2>
          <p>
            All game titles on MiniPlay (including <em>Traffic Racer</em>, <em>Neon Jump</em>, <em>Endless Runner</em>, <em>Space Shooter</em>, and <em>Fruit Slash</em>) are independent, original HTML5 creations developed for this website using Phaser 3 and custom procedural artwork. MiniPlay is not affiliated, sponsored, or associated with any similarly named console or mobile app developers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Local Storage and High Scores</h2>
          <p>
            High scores, streaks, coins, and cosmetic unlocks are stored locally on your device via <code>localStorage</code>. MiniPlay cannot recover score records if you clear your browser history, reset cache, or switch devices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Site Owner Information</h2>
          <p className="text-xs">
            Website Domain: <code>https://miniplay.shivanandgarg1234.workers.dev/</code><br />
            Administrator Contact: <code>[admin@yourdomain.com]</code>
          </p>
        </section>
      </div>
    </div>
  );
};
