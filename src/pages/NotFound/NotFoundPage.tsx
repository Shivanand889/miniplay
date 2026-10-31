import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEO/SEOHead';
import { Gamepad2, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
      <SEOHead
        title="404 - Page Not Found"
        description="The arcade page or game you are looking for does not exist on MiniPlay."
      />

      <div className="w-20 h-20 rounded-3xl bg-primary/20 text-primary border border-primary/40 mx-auto flex items-center justify-center shadow-glow-primary">
        <Gamepad2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-light">
          Error 404 • Level Not Found
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          Game Over, Player!
        </h1>
        <p className="text-sm text-text-muted max-w-md mx-auto">
          The requested URL does not match any current arcade zone or game page on MiniPlay.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3 text-sm font-bold text-white shadow-glow-primary transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/games"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border px-6 py-3 text-sm font-semibold text-text-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Games</span>
        </Link>
      </div>
    </div>
  );
};
