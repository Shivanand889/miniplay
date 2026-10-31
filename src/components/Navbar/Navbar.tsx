import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGameProgress } from '../../contexts/GameProgressContext';
import { AchievementsModal } from '../AchievementsModal/AchievementsModal';
import { SkinShopModal } from '../SkinShopModal/SkinShopModal';
import {
  Gamepad2,
  Flame,
  LayoutGrid,
  Trophy,
  Volume2,
  VolumeX,
  Search,
  Menu,
  X,
  Coins,
  Palette,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { streak, coins, soundMuted, toggleSound } = useGameProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [skinShopOpen, setSkinShopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-dark-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary shadow-glow-primary transition-transform duration-200 group-hover:scale-105">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Mini<span className="text-secondary">Play</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-text-muted -mt-1 hidden sm:block">
                Arcade
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') && location.search === ''
                  ? 'bg-dark-card text-white font-semibold'
                  : 'text-text-muted hover:text-white hover:bg-dark-surface'
              }`}
            >
              Home
            </Link>
            <Link
              to="/games"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/games') && location.search !== '?filter=popular'
                  ? 'bg-dark-card text-white font-semibold'
                  : 'text-text-muted hover:text-white hover:bg-dark-surface'
              }`}
            >
              Games
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/categories')
                  ? 'bg-dark-card text-white font-semibold'
                  : 'text-text-muted hover:text-white hover:bg-dark-surface'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/games?filter=popular"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.search === '?filter=popular'
                  ? 'bg-dark-card text-rose-400 font-semibold'
                  : 'text-text-muted hover:text-rose-400 hover:bg-dark-surface'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Popular</span>
            </Link>
          </nav>

          {/* Action Tools & User Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input or Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search games..."
                    autoFocus
                    className="w-36 sm:w-48 rounded-xl bg-dark-card border border-dark-border px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearchInput(false)}
                    className="absolute right-2 text-text-subtle hover:text-text-main p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-dark-card transition-colors"
                  aria-label="Open search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Streak Badge */}
            <div
              className="flex items-center gap-1.5 rounded-xl bg-dark-card px-2.5 py-1.5 border border-dark-border text-xs font-bold text-amber-400"
              title={`Daily Streak: ${streak.currentStreak} day(s)`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{streak.currentStreak}d</span>
            </div>

            {/* Coin Balance & Skin Garage Button */}
            <button
              onClick={() => setSkinShopOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-dark-card hover:bg-dark-hover px-2.5 py-1.5 border border-dark-border text-xs font-bold text-amber-400 transition-colors"
              title="Open Skin Garage"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{coins.toLocaleString()}</span>
              <Palette className="w-3.5 h-3.5 text-text-muted ml-0.5" />
            </button>

            {/* Achievements Modal Launcher */}
            <button
              onClick={() => setAchievementsOpen(true)}
              className="p-2 rounded-xl text-text-muted hover:text-amber-400 hover:bg-dark-card transition-colors"
              title="View Achievements"
              aria-label="Achievements"
            >
              <Trophy className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-dark-card transition-colors"
              title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label={soundMuted ? 'Unmute' : 'Mute'}
            >
              {soundMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-dark-card transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-dark-border bg-dark-surface/95 px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl">
            <form onSubmit={handleSearchSubmit} className="mb-4 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search arcade games..."
                  className="w-full rounded-xl bg-dark-card border border-dark-border px-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary pl-10"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-text-subtle" />
              </div>
            </form>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-main hover:bg-dark-card"
            >
              <Gamepad2 className="w-4 h-4 text-primary" />
              <span>Home</span>
            </Link>
            <Link
              to="/games"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-main hover:bg-dark-card"
            >
              <LayoutGrid className="w-4 h-4 text-secondary" />
              <span>All Games</span>
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-main hover:bg-dark-card"
            >
              <LayoutGrid className="w-4 h-4 text-amber-400" />
              <span>Game Categories</span>
            </Link>
            <Link
              to="/games?filter=popular"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-main hover:bg-dark-card"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Popular Games</span>
            </Link>

            <div className="pt-3 border-t border-dark-border flex items-center justify-between px-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSkinShopOpen(true);
                }}
                className="flex items-center gap-2 text-xs font-bold text-amber-400"
              >
                <Palette className="w-4 h-4" />
                <span>Skin Garage ({coins.toLocaleString()} Coins)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAchievementsOpen(true);
                }}
                className="flex items-center gap-2 text-xs font-bold text-secondary-light"
              >
                <Trophy className="w-4 h-4" />
                <span>Achievements</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
      />
      <SkinShopModal
        isOpen={skinShopOpen}
        onClose={() => setSkinShopOpen(false)}
      />
    </>
  );
};
