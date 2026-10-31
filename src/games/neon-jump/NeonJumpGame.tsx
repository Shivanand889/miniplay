import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { NeonJumpScene } from './scenes/NeonJumpScene';
import { useGameProgress } from '../../contexts/GameProgressContext';
import { StorageService } from '../../services/storage';
import { GAMES } from '../../config/games';
import { ShareModal } from '../../components/ShareModal/ShareModal';
import { SkinShopModal } from '../../components/SkinShopModal/SkinShopModal';
import {
  Play,
  RotateCcw,
  Pause,
  Share2,
  Trophy,
  Coins,
  ChevronLeft,
  ChevronRight,
  Palette,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { analytics } from '../../services/analytics';

export const NeonJumpGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<NeonJumpScene | null>(null);

  const { recordGameSession, soundMuted, toggleSound } = useGameProgress();
  const gameDef = GAMES.find(g => g.id === 'neon-jump')!;
  const userProgress = StorageService.getGameProgress(gameDef.id);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover'>('ready');
  const [currentScore, setCurrentScore] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSkinShopOpen, setIsSkinShopOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const currentSkin = gameDef.skins.find(s => s.id === userProgress.selectedSkin) || gameDef.skins[0];

    const scene = new NeonJumpScene(
      {
        onScoreUpdate: score => setCurrentScore(score),
        onCoinCollected: c => setSessionCoins(c),
        onGameOver: (score, coins) => {
          setFinalScore(score);
          const result = recordGameSession(gameDef.id, score, coins);
          setIsNewHigh(result.isHighScore);
          setGameState('gameover');
          analytics.trackGameCompleted(gameDef.id, score);
        },
      },
      {
        id: currentSkin.id,
        primaryColor: currentSkin.color,
        secondaryColor: currentSkin.secondaryColor || '#FFFFFF',
      }
    );

    sceneRef.current = scene;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 480,
      height: 720,
      transparent: false,
      backgroundColor: '#0F172A',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 1100 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [scene],
    };

    const phaserGame = new Phaser.Game(config);
    gameRef.current = phaserGame;

    analytics.trackGameOpened(gameDef.id, gameDef.name);

    return () => {
      phaserGame.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, [userProgress.selectedSkin]);

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentScore(0);
    setSessionCoins(0);
    sceneRef.current?.startGame();
    analytics.trackGameStarted(gameDef.id, gameDef.name);
  };

  const handlePause = () => {
    if (gameState === 'playing') {
      sceneRef.current?.pauseGame();
      setGameState('paused');
    }
  };

  const handleResume = () => {
    if (gameState === 'paused') {
      sceneRef.current?.resumeGame();
      setGameState('playing');
    }
  };

  const handleRestart = () => {
    setGameState('playing');
    setCurrentScore(0);
    setSessionCoins(0);
    sceneRef.current?.resumeGame();
    sceneRef.current?.restartGame();
    analytics.trackGameReplayed(gameDef.id);
  };

  const setTouchDir = (dir: number) => {
    if (sceneRef.current) {
      sceneRef.current.touchDirection = dir;
    }
  };

  return (
    <div className="relative w-full max-w-[480px] mx-auto aspect-[480/720] rounded-2xl overflow-hidden border-2 border-dark-border bg-dark-bg shadow-2xl select-none">
      <div ref={containerRef} className="w-full h-full" />

      {/* Live HUD */}
      {gameState === 'playing' && (
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-dark-bg/80 backdrop-blur-md border border-dark-border text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>{currentScore.toLocaleString()}</span>
              <span className="text-[10px] text-text-subtle">M</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-dark-bg/80 backdrop-blur-md border border-dark-border text-xs font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>{sessionCoins}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-dark-bg/80 backdrop-blur-md border border-dark-border text-text-muted hover:text-white"
              aria-label="Toggle sound"
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={handlePause}
              className="p-2 rounded-xl bg-dark-bg/80 backdrop-blur-md border border-dark-border text-text-muted hover:text-white"
              aria-label="Pause game"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Touch Steering Buttons */}
      {gameState === 'playing' && (
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto z-20 md:hidden">
          <button
            onTouchStart={() => setTouchDir(-1)}
            onTouchEnd={() => setTouchDir(0)}
            onMouseDown={() => setTouchDir(-1)}
            onMouseUp={() => setTouchDir(0)}
            className="w-16 h-16 rounded-2xl bg-dark-card/90 active:bg-primary border border-dark-border flex items-center justify-center text-white backdrop-blur-md shadow-lg"
            aria-label="Move Left"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onTouchStart={() => setTouchDir(1)}
            onTouchEnd={() => setTouchDir(0)}
            onMouseDown={() => setTouchDir(1)}
            onMouseUp={() => setTouchDir(0)}
            className="w-16 h-16 rounded-2xl bg-dark-card/90 active:bg-primary border border-dark-border flex items-center justify-center text-white backdrop-blur-md shadow-lg"
            aria-label="Move Right"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Start Screen */}
      {gameState === 'ready' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-dark-bg/95 backdrop-blur-sm text-center">
          <div className="mt-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
              <span>Vertical Jump Challenge</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Neon <span className="text-secondary">Jump</span>
            </h1>
            <p className="text-xs text-text-muted mt-2 max-w-xs mx-auto">
              Bounce endlessly through the neon atmosphere. Time your jumps on moving platforms, grab super springs, and avoid falling!
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3">
            {userProgress.highScore > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-xs">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Personal Best:</span>
                </span>
                <span className="font-extrabold text-amber-400">
                  {userProgress.highScore.toLocaleString()} M
                </span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-dark-card/60 border border-dark-border text-left text-xs space-y-1.5 text-text-muted">
              <div className="font-semibold text-text-main text-[11px] uppercase tracking-wider">
                How to Play:
              </div>
              <div>• Character auto-bounces on platform contact</div>
              <div>• Left / Right: Steer (A/D or Arrows)</div>
              <div>• Exit left to wrap around to right side</div>
              <div>• Hit gold springs for massive altitude boost</div>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-2 mb-4">
            <button
              onClick={handleStartGame}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base flex items-center justify-center gap-2 shadow-glow-primary transition-all hover:scale-102"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Climbing</span>
            </button>

            <button
              onClick={() => setIsSkinShopOpen(true)}
              className="w-full py-2.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-text-main text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Jumper Skins Garage</span>
            </button>
          </div>
        </div>
      )}

      {/* Paused */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-md text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Game Paused</h2>
          <p className="text-xs text-text-muted mb-6">Rest your fingers before the next leap.</p>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={handleResume}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-primary transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Jump</span>
            </button>

            <button
              onClick={handleRestart}
              className="w-full py-2.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-text-main text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Jump</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-black/90 backdrop-blur-md text-center animate-fadeIn">
          <div className="mt-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <span>Fell to Earth!</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Game Over</h2>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <div className="rounded-2xl border border-primary/30 bg-dark-card/90 p-5 shadow-xl">
              <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                Max Height Climbed
              </span>
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary mt-1">
                {finalScore.toLocaleString()} M
              </div>

              {isNewHigh && (
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>NEW PERSONAL BEST!</span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-around text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Coins className="w-4 h-4" />
                  <span>+{sessionCoins} Coins</span>
                </div>
                <div className="text-text-muted">
                  Best: <strong className="text-white">{Math.max(userProgress.highScore, finalScore).toLocaleString()} M</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-2 mb-4">
            <button
              onClick={handleRestart}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-primary transition-all hover:scale-102"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="w-full py-2.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-text-main text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-secondary" />
              <span>Share High Score</span>
            </button>
          </div>
        </div>
      )}

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        gameName="Neon Jump"
        gameSlug="neon-jump"
        score={finalScore}
      />

      <SkinShopModal
        isOpen={isSkinShopOpen}
        onClose={() => setIsSkinShopOpen(false)}
        defaultGameId="neon-jump"
      />
    </div>
  );
};
