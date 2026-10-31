import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Shield, Heart } from 'lucide-react';
import { AdSlot } from '../AdSlot/AdSlot';
import { ADSENSE_CONFIG } from '../../config/adsense';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-dark-border bg-dark-surface/60 pt-12 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Footer Ad Placement (Compliant placement) */}
        <div className="mb-12">
          <AdSlot
            adSlotId={ADSENSE_CONFIG.slots.footerBanner}
            adFormat="horizontal"
            label="Partner Sponsor"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-dark-border">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Mini<span className="text-secondary">Play</span>
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              Play More. Beat Your Best. Free online mini games and browser arcade games. Play instantly on mobile or desktop with zero downloads and no sign-ups.
            </p>
          </div>

          {/* Quick Play */}
          <div>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">
              Top Arcade Games
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link to="/games/traffic-racer" className="hover:text-primary-light transition-colors">
                  Traffic Racer (Highway Dodging)
                </Link>
              </li>
              <li>
                <Link to="/games/neon-jump" className="hover:text-primary-light transition-colors">
                  Neon Jump (Infinite Climber)
                </Link>
              </li>
              <li>
                <Link to="/games/endless-runner" className="hover:text-primary-light transition-colors">
                  Endless Runner (Cyber Sprint)
                </Link>
              </li>
              <li>
                <Link to="/games/space-shooter" className="hover:text-primary-light transition-colors">
                  Space Shooter (Alien Armada)
                </Link>
              </li>
              <li>
                <Link to="/games/fruit-slash" className="hover:text-primary-light transition-colors">
                  Fruit Slash (Juicy Combos)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">
              Browse Categories
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link to="/categories#racing" className="hover:text-secondary transition-colors">
                  Racing & Highway
                </Link>
              </li>
              <li>
                <Link to="/categories#arcade" className="hover:text-secondary transition-colors">
                  Arcade & Retro
                </Link>
              </li>
              <li>
                <Link to="/categories#endless-runner" className="hover:text-secondary transition-colors">
                  Endless Running
                </Link>
              </li>
              <li>
                <Link to="/categories#shooting" className="hover:text-secondary transition-colors">
                  Shooting & Combat
                </Link>
              </li>
              <li>
                <Link to="/categories#reflex" className="hover:text-secondary transition-colors">
                  Reflex & Casual
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About MiniPlay
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy & Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer & Ad Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" />
            <span>&copy; {currentYear} MiniPlay Arcade Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Play free mini games &amp; browser arcade games instantly • 60 FPS Canvas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
