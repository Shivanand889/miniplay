import React from 'react';
import { SEOHead } from '../../components/SEO/SEOHead';
import { Shield, Lock, Eye, Database, Info } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="Privacy Policy"
        description="MiniPlay's Privacy Policy. Learn how we handle cookies, Google AdSense advertisements, Google Analytics, LocalStorage, and user privacy."
        canonicalUrl="https://miniplay.shivanandgarg1234.workers.dev//privacy-policy"
      />

      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary-light text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>User Privacy &amp; Data Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-text-muted mt-2">
          Last Updated: October 2025 • Effective immediately for all visitors
        </p>
      </div>

      <div className="rounded-2xl border border-dark-border bg-dark-card/60 p-6 space-y-6 text-sm text-text-muted leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-secondary" />
            <span>1. Introduction</span>
          </h2>
          <p>
            Welcome to <strong>MiniPlay</strong> ("we", "our", or "us"). MiniPlay provides free online arcade games directly in web browsers without mandatory user registration, accounts, or application downloads. We respect your personal privacy and are committed to transparent data practices.
          </p>
          <p className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border text-xs text-text-subtle">
            <strong>Website Owner Note:</strong> Please replace placeholder information marked in brackets (such as <code>[contact@yourdomain.com]</code>) with your verified operational email address before commercial launch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <span>2. Information We Do NOT Collect</span>
          </h2>
          <p>
            MiniPlay does not require users to create an account, register, or provide real names, postal addresses, phone numbers, or credit card details. You can play every game completely anonymously without login credentials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>3. Browser LocalStorage Usage</span>
          </h2>
          <p>
            To provide features like personal high-score tracking, daily challenge completion, daily visit streaks, and unlocking cosmetic vehicle skins, MiniPlay utilizes your browser's local storage facility (<code>localStorage</code>).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-subtle">
            <li>High scores and game play counts</li>
            <li>Arcade coin balances and unlocked cosmetic skin choices</li>
            <li>Daily challenge progress timestamps</li>
            <li>Sound mute/unmute preferences</li>
          </ul>
          <p className="text-xs">
            This data is stored purely on your local device and is never uploaded to an external database. You may clear this data at any time by clearing your browser cache.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-400" />
            <span>4. Third-Party Advertising (Google AdSense)</span>
          </h2>
          <p>
            MiniPlay is supported by advertising revenue, including Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-text-subtle">
            <li>
              Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                Google Ads Settings
              </a>{' '}
              or by visiting{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Analytics (Google Analytics 4)</h2>
          <p>
            When enabled, we may use Google Analytics to measure aggregate website traffic patterns, such as which games are most popular and average gameplay duration. IP addresses are anonymized. Google Analytics uses cookies to evaluate usage without identifying individual visitors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Children's Privacy (COPPA Compliance)</h2>
          <p>
            MiniPlay does not knowingly collect personally identifiable information from children under the age of 13. If you believe your child has provided personal information to us, please contact us immediately and we will promptly remove such records.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">7. Contacting Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, our data practices, or cookie disclosures, please contact the site administrator at:
          </p>
          <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-text-main font-mono">
            Email: [support@miniplay.pages.dev] or via our Contact Page.
          </div>
        </section>
      </div>
    </div>
  );
};
