import React from 'react';
import { SEOHead } from '../../components/SEO/SEOHead';
import { FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="Terms and Conditions"
        description="MiniPlay Terms of Service and user agreement for playing free online arcade games."
        canonicalUrl="https://www.playhere.space/terms"
      />

      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-text-muted mt-2">
          Last Updated: October 2025
        </p>
      </div>

      <div className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 space-y-6 text-sm text-text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or playing games on <strong>MiniPlay</strong>, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you disagree with any part of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Free Access &amp; Entertainment Use</h2>
          <p>
            All browser games provided on MiniPlay are provided for personal, non-commercial entertainment purposes only. The platform is offered free of charge without warranty of continuous uninterrupted availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Intellectual Property Rights</h2>
          <p>
            The website design, proprietary game code, procedural graphics, logos, and custom sound synthesizer scripts are the property of MiniPlay and its developers. You may not decompile, reverse engineer, or redistribute our game binaries for commercial re-sale without express written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-text-subtle">
            <li>Attempt to tamper with, hack, or inject malicious scripts into our HTML5 game canvas code.</li>
            <li>Use automated bots or scrapers to artificially manipulate local scores or ad impressions.</li>
            <li>Circumvent or tamper with advertisement display containers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
          <p>
            In no event shall MiniPlay or its operators be liable for any damages (including loss of data, high-score records, or interruption of play) arising from the use or inability to use our games.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Modifications to Terms</h2>
          <p>
            MiniPlay reserves the right to revise these Terms and Conditions at any time without prior notice. Your continued use of the website following any changes constitutes acceptance of those changes.
          </p>
        </section>
      </div>
    </div>
  );
};
