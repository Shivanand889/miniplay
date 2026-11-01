import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { DesiFightersScene } from './scenes/DesiFightersScene';
import { FIGHTERS, FIGHTER_LIST } from './config/fighters';
import { FighterDefinition, FighterId, GameScreen, DifficultyLevel, MatchRoundResult } from './types';
import { StorageService } from '../../services/storage';
import { fighterAudio } from './audio/FighterAudio';
import { FighterAvatar } from './components/FighterAvatar';
import {
  Swords,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Users,
  Shield,
  Zap,
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  X,
  Info,
  CheckCircle2,
} from 'lucide-react';

const STATS_STORAGE_KEY = 'miniplay_desi_meme_fighters_stats';

interface LocalFighterStats {
  wins: number;
  losses: number;
  bestScore: number;
  characterWins: Record<FighterId, number>;
}

export const DesiMemeFightersGame: React.FC = () => {
  // Screens
  const [screen, setScreen] = useState<GameScreen>('landing');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [selectedPlayerId, setSelectedPlayerId] = useState<FighterId>('jaldi');
  const [selectedOpponentId, setSelectedOpponentId] = useState<FighterId>('vadapav');

  // Modals on Landing Screen
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(StorageService.isMuted());

  // In-Game Live HUD States
  const [playerHp, setPlayerHp] = useState(1000);
  const [playerMaxHp, setPlayerMaxHp] = useState(1000);
  const [oppHp, setOppHp] = useState(1000);
  const [oppMaxHp, setOppMaxHp] = useState(1000);

  const [playerSpecial, setPlayerSpecial] = useState(0);
  const [playerUlt, setPlayerUlt] = useState(0);
  const [oppSpecial, setOppSpecial] = useState(0);
  const [oppUlt, setOppUlt] = useState(0);

  const [timerSeconds, setTimerSeconds] = useState(60);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [oppWins, setOppWins] = useState(0);

  // Banner announcement
  const [bannerText, setBannerText] = useState<{ title: string; subtitle?: string } | null>(null);

  // Match Results
  const [matchWinner, setMatchWinner] = useState<'player' | 'opponent'>('player');
  const [matchStats, setMatchStats] = useState<any>(null);
  const [savedStats, setSavedStats] = useState<LocalFighterStats>({
    wins: 0,
    losses: 0,
    bestScore: 0,
    characterWins: { jaldi: 0, pookie: 0, guard: 0, vadapav: 0 },
  });

  // Versus Countdown
  const [vsCountdown, setVsCountdown] = useState<number | string>(3);

  // Phaser References
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<DesiFightersScene | null>(null);

  // Load saved stats on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATS_STORAGE_KEY);
      if (raw) {
        setSavedStats(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    StorageService.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const playerFighter = FIGHTERS[selectedPlayerId];
  const oppFighter = FIGHTERS[selectedOpponentId];

  // -------------------------------------------------------------
  // VERSUS SCREEN COUNTDOWN -> START FIGHT
  // -------------------------------------------------------------
  useEffect(() => {
    if (screen !== 'versus') return;

    setVsCountdown(3);
    fighterAudio.playCountdown(false);

    const timer1 = setTimeout(() => {
      setVsCountdown(2);
      fighterAudio.playCountdown(false);
    }, 800);

    const timer2 = setTimeout(() => {
      setVsCountdown(1);
      fighterAudio.playCountdown(false);
    }, 1600);

    const timer3 = setTimeout(() => {
      setVsCountdown('FIGHT!');
      fighterAudio.playCountdown(true);
    }, 2400);

    const timer4 = setTimeout(() => {
      setScreen('fighting');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [screen]);

  // -------------------------------------------------------------
  // PHASER GAME LIFECYCLE (When entering 'fighting' screen)
  // -------------------------------------------------------------
  useEffect(() => {
    if (screen !== 'fighting') {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
      return;
    }

    if (!containerRef.current) return;

    const scene = new DesiFightersScene(
      {
        onHealthUpdate: (pVal, pMax, oVal, oMax) => {
          setPlayerHp(pVal);
          setPlayerMaxHp(pMax);
          setOppHp(oVal);
          setOppMaxHp(oMax);
        },
        onEnergyUpdate: (pSpec, pUlt, oSpec, oUlt) => {
          setPlayerSpecial(pSpec);
          setPlayerUlt(pUlt);
          setOppSpecial(oSpec);
          setOppUlt(oUlt);
        },
        onTimerUpdate: sec => setTimerSeconds(sec),
        onRoundUpdate: (round, pW, oW) => {
          setCurrentRound(round);
          setPlayerWins(pW);
          setOppWins(oW);
        },
        onBannerMessage: (title, subtitle) => {
          setBannerText({ title, subtitle });
          setTimeout(() => {
            setBannerText(null);
          }, 1800);
        },
        onMatchComplete: (winner, roundResults, stats) => {
          setMatchWinner(winner);
          setMatchStats(stats);

          // Save to LocalStorage
          try {
            const isWin = winner === 'player';
            const newBest = Math.max(savedStats.bestScore, stats.finalScore);
            const updated: LocalFighterStats = {
              wins: savedStats.wins + (isWin ? 1 : 0),
              losses: savedStats.losses + (isWin ? 0 : 1),
              bestScore: newBest,
              characterWins: {
                ...savedStats.characterWins,
                [selectedPlayerId]: (savedStats.characterWins[selectedPlayerId] || 0) + (isWin ? 1 : 0),
              },
            };
            localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
            setSavedStats(updated);

            // Record to MiniPlay Central Storage for Coins & High Score
            const earnedCoins = isWin ? 50 : 15;
            StorageService.recordScore('desi-meme-fighters', stats.finalScore, earnedCoins);
          } catch {}

          setScreen('match-result');
        },
      },
      playerFighter,
      oppFighter,
      difficulty
    );

    sceneRef.current = scene;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 480,
      height: 720,
      transparent: false,
      backgroundColor: '#0F0C20',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 900 },
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

    return () => {
      phaserGame.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, [screen, selectedPlayerId, selectedOpponentId, difficulty]);

  // Touch action triggers
  const handleTouchPunch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    sceneRef.current?.handlePlayerPunch();
  };
  const handleTouchKick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    sceneRef.current?.handlePlayerKick();
  };
  const handleTouchSpecial = (e: React.SyntheticEvent) => {
    e.preventDefault();
    sceneRef.current?.handlePlayerSpecial();
  };
  const handleTouchUltimate = (e: React.SyntheticEvent) => {
    e.preventDefault();
    sceneRef.current?.handlePlayerUltimate();
  };
  const handleTouchJump = (e: React.SyntheticEvent) => {
    e.preventDefault();
    sceneRef.current?.triggerPlayerJump();
  };

  return (
    <div className="relative w-full max-w-[480px] mx-auto aspect-[480/720] rounded-2xl overflow-hidden border-2 border-dark-border bg-[#0F0C20] select-none shadow-2xl">
      {/* ------------------------------------------------------------- */}
      {/* SCREEN 1: LANDING SCREEN */}
      {/* ------------------------------------------------------------- */}
      {screen === 'landing' && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 bg-gradient-to-b from-[#180B2E] via-[#2A1045] to-[#0F051D] text-white">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
              <Swords className="w-3.5 h-3.5" />
              <span>ARCADE FIGHTER</span>
            </div>
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-dark-card/80 border border-dark-border hover:bg-dark-card text-text-muted hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Title & Dramatic Roster Showcase */}
          <div className="text-center space-y-3 my-auto">
            <div className="inline-block px-3 py-1 rounded-md bg-red-600/30 border border-red-500 text-red-300 text-xs font-black tracking-widest uppercase">
              DESI MEME UNIVERSE
            </div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 leading-none drop-shadow-md">
              DESI MEME
              <br />
              <span className="text-white">FIGHTERS</span>
            </h1>
            <p className="text-xs text-amber-200/90 font-medium">
              "Four legends. One arena. Unlimited drama."
            </p>

            {/* 4 Character Badges with Real Visual Avatars */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {FIGHTER_LIST.map(f => (
                <div
                  key={f.id}
                  className="p-1.5 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center text-center space-y-1 hover:border-amber-400/40 transition-colors"
                >
                  <FighterAvatar fighterId={f.id} size={48} />
                  <span className="text-[10px] font-bold leading-tight line-clamp-1 text-white/90">{f.name}</span>
                </div>
              ))}
            </div>

            {/* Difficulty Selector */}
            <div className="pt-2">
              <span className="text-[11px] text-text-muted block mb-1.5 font-semibold">AI DIFFICULTY</span>
              <div className="flex justify-center gap-2">
                {(['easy', 'normal', 'hard'] as DifficultyLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      difficulty === lvl
                        ? 'bg-amber-500 text-black shadow-glow-amber'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => {
                fighterAudio.playSpecial();
                setScreen('select-fighter');
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>PLAY NOW</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsHowToPlayOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>HOW TO PLAY</span>
              </button>
              <button
                onClick={() => setIsRosterOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>ROSTER LORE</span>
              </button>
            </div>

            {savedStats.wins + savedStats.losses > 0 && (
              <div className="text-center text-[10px] text-white/50 pt-1">
                Record: {savedStats.wins}W - {savedStats.losses}L • Best Score: {savedStats.bestScore.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 2: CHOOSE YOUR FIGHTER */}
      {/* ------------------------------------------------------------- */}
      {screen === 'select-fighter' && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-5 bg-gradient-to-b from-[#180B2E] via-[#24103E] to-[#0E061B] text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <button
              onClick={() => setScreen('landing')}
              className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h2 className="text-sm font-black tracking-wider uppercase text-amber-400">
              CHOOSE YOUR FIGHTER
            </h2>
            <div className="w-10" />
          </div>

          {/* 4 Fighter Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 my-3">
            {FIGHTER_LIST.map(f => {
              const isSelected = selectedPlayerId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedPlayerId(f.id);
                    // Ensure opponent is not the same fighter
                    if (selectedOpponentId === f.id) {
                      const other = FIGHTER_LIST.find(o => o.id !== f.id);
                      if (other) setSelectedOpponentId(other.id);
                    }
                    fighterAudio.playPunch();
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 shadow-glow-amber scale-[1.02]'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <FighterAvatar fighterId={f.id} size={40} />
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-xs text-white leading-tight truncate">{f.name}</h3>
                      <span className="text-[9px] text-amber-300 font-semibold block truncate">{f.title}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/70 line-clamp-1 italic mb-1.5">"{f.tagline}"</p>

                  {/* Mini Stats */}
                  <div className="space-y-0.5 text-[9px]">
                    <div className="flex justify-between text-white/60">
                      <span>HP: {f.stats.health}</span>
                      <span>SPD: {f.stats.speed}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>ATK: {f.stats.attack}</span>
                      <span>DEF: {f.stats.defence}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Fighter Detailed Preview */}
          <div className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-center gap-3">
            <FighterAvatar fighterId={playerFighter.id} size={50} />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400">{playerFighter.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 font-bold uppercase">
                  {playerFighter.specialMove.name}
                </span>
              </div>
              <p className="text-[10px] text-white/70 line-clamp-1">{playerFighter.concept}</p>
              <div className="text-[9px] text-emerald-300 truncate">
                <strong>Ult:</strong> {playerFighter.ultimateMove.name}
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={() => {
              fighterAudio.playSpecial();
              setScreen('select-opponent');
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>CONFIRM FIGHTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 3: CHOOSE YOUR OPPONENT (Same fighter not allowed) */}
      {/* ------------------------------------------------------------- */}
      {screen === 'select-opponent' && (() => {
        const availableOpponents = FIGHTER_LIST.filter(f => f.id !== selectedPlayerId);
        const currentOpponent = availableOpponents.some(f => f.id === selectedOpponentId)
          ? FIGHTERS[selectedOpponentId]
          : availableOpponents[0];

        return (
          <div className="absolute inset-0 z-30 flex flex-col justify-between p-5 bg-gradient-to-b from-[#180B2E] via-[#24103E] to-[#0E061B] text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <button
                onClick={() => setScreen('select-fighter')}
                className="flex items-center gap-1 text-xs text-white/70 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <h2 className="text-sm font-black tracking-wider uppercase text-red-400">
                CHOOSE OPPONENT (AI)
              </h2>
              <div className="w-10" />
            </div>

            {/* Random Opponent Button */}
            <button
              onClick={() => {
                const rand = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
                setSelectedOpponentId(rand.id);
                fighterAudio.playKick();
              }}
              className="py-2 rounded-xl bg-purple-600/30 border border-purple-500 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-600/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>PICK RANDOM OPPONENT</span>
            </button>

            {/* 3 Available Opponents (Same Fighter Disallowed) */}
            <div className="space-y-2 my-2">
              <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider">
                Select Rival (3 available):
              </span>
              <div className="grid grid-cols-1 gap-2">
                {availableOpponents.map(f => {
                  const isSelected = selectedOpponentId === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedOpponentId(f.id);
                        fighterAudio.playPunch();
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-600/20 shadow-glow-rose scale-[1.01]'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <FighterAvatar fighterId={f.id} size={44} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-xs text-white truncate">{f.name}</h3>
                          <span className="text-[9px] text-red-300 font-semibold">{f.title}</span>
                        </div>
                        <p className="text-[10px] text-white/70 italic truncate">"{f.tagline}"</p>
                        <div className="text-[9px] text-white/50 pt-0.5">
                          HP: {f.stats.health} • ATK: {f.stats.attack} • DEF: {f.stats.defence} • SPD: {f.stats.speed}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matchup Summary Preview */}
            <div className="p-2.5 rounded-xl border border-white/10 bg-black/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FighterAvatar fighterId={playerFighter.id} size={30} showBorder={false} />
                <span className="text-amber-400 font-bold truncate">YOU: {playerFighter.name}</span>
              </div>
              <div className="font-black text-red-400 px-2 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] shrink-0 mx-2">
                VS
              </div>
              <div className="flex items-center gap-2 min-w-0 text-right">
                <span className="text-rose-400 font-bold truncate">AI: {currentOpponent.name}</span>
                <FighterAvatar fighterId={currentOpponent.id} size={30} showBorder={false} />
              </div>
            </div>

            {/* Ready to Fight Button */}
            <button
              onClick={() => {
                if (!availableOpponents.some(f => f.id === selectedOpponentId)) {
                  setSelectedOpponentId(availableOpponents[0].id);
                }
                fighterAudio.playUltimate();
                setScreen('versus');
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:scale-[1.01] active:scale-[0.98]"
            >
              <Swords className="w-5 h-5" />
              <span>ENTER THE ARENA</span>
            </button>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 4: DRAMATIC VERSUS INTRODUCTION */}
      {/* ------------------------------------------------------------- */}
      {screen === 'versus' && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 bg-gradient-to-b from-[#180B2E] via-[#3B0764] to-[#0F051D] text-white">
          <div className="text-center pt-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
              DESI STREET CHAMPIONSHIP
            </span>
          </div>

          {/* Fighter Clash Split View */}
          <div className="space-y-4 my-auto">
            {/* Player Banner */}
            <div className="p-4 rounded-2xl border-2 border-amber-500 bg-amber-500/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">PLAYER</span>
                <h3 className="text-xl font-black text-white">{playerFighter.name}</h3>
                <p className="text-xs text-amber-200/80 italic">"{playerFighter.memeQuotes[0]}"</p>
              </div>
              <FighterAvatar fighterId={playerFighter.id} size={64} />
            </div>

            {/* VS Badge with Countdown */}
            <div className="flex flex-col items-center justify-center my-2">
              <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-amber-400 flex items-center justify-center font-black text-2xl text-white shadow-glow-rose animate-pulse">
                {vsCountdown}
              </div>
            </div>

            {/* Opponent Banner */}
            <div className="p-4 rounded-2xl border-2 border-rose-500 bg-rose-500/10 flex items-center justify-between">
              <FighterAvatar fighterId={oppFighter.id} size={64} />
              <div className="text-right">
                <span className="text-[10px] font-bold text-rose-400 block uppercase tracking-wider">AI OPPONENT</span>
                <h3 className="text-xl font-black text-white">{oppFighter.name}</h3>
                <p className="text-xs text-rose-200/80 italic">"{oppFighter.memeQuotes[0]}"</p>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-white/60 font-semibold pb-2">
            BEST OF 3 ROUNDS • 60 SECONDS EACH
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 5: ACTUAL FIGHTING GAMEPLAY (Phaser Canvas + HUD + Mobile Touch) */}
      {/* ------------------------------------------------------------- */}
      <div ref={containerRef} className="w-full h-full" />

      {/* IN-GAME HUD OVERLAY (Only visible during fighting) */}
      {screen === 'fighting' && (
        <>
          {/* Top Health & Energy Status Bars */}
          <div className="absolute top-0 inset-x-0 z-20 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Player 1 Health & Energy (Cols 1-5) */}
              <div className="col-span-5 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-black text-white">
                  <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                    <FighterAvatar fighterId={playerFighter.id} size={22} showBorder={false} />
                    <span className="truncate">{playerFighter.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2].map(r => (
                      <div
                        key={r}
                        className={`w-2.5 h-2.5 rounded-full border border-amber-400 ${
                          playerWins >= r ? 'bg-amber-400 shadow-glow-amber' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Player Health Bar */}
                <div className="w-full h-3.5 rounded-full bg-dark-bg/90 border border-white/20 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-150"
                    style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }}
                  />
                </div>

                {/* Player Energy Meters (Special & Ultimate) */}
                <div className="grid grid-cols-2 gap-1 text-[9px] font-bold">
                  {/* Special Meter */}
                  <div className="h-1.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-100"
                      style={{ width: `${playerSpecial}%` }}
                    />
                  </div>
                  {/* Ultimate Meter */}
                  <div className="h-1.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-100 ${
                        playerUlt >= 100 ? 'bg-gradient-to-r from-pink-500 to-red-500 animate-pulse' : 'bg-purple-400'
                      }`}
                      style={{ width: `${playerUlt}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Center Round Timer & Indicator (Cols 6-7) */}
              <div className="col-span-2 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-black/80 border-2 border-amber-400 flex items-center justify-center font-black text-sm text-white shadow-md">
                  {timerSeconds}
                </div>
                <span className="text-[9px] font-bold text-amber-300 uppercase block mt-0.5">
                  R{currentRound}
                </span>
              </div>

              {/* Opponent Health & Energy (Cols 8-12) */}
              <div className="col-span-5 space-y-1 text-right">
                <div className="flex items-center justify-between text-[11px] font-black text-white">
                  <div className="flex gap-1">
                    {[1, 2].map(r => (
                      <div
                        key={r}
                        className={`w-2.5 h-2.5 rounded-full border border-rose-400 ${
                          oppWins >= r ? 'bg-rose-500 shadow-glow-rose' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 truncate max-w-[120px] justify-end">
                    <span className="truncate">{oppFighter.name}</span>
                    <FighterAvatar fighterId={oppFighter.id} size={22} showBorder={false} />
                  </div>
                </div>

                {/* Opponent Health Bar */}
                <div className="w-full h-3.5 rounded-full bg-dark-bg/90 border border-white/20 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-l from-red-500 to-rose-400 transition-all duration-150 float-right"
                    style={{ width: `${Math.max(0, (oppHp / oppMaxHp) * 100)}%` }}
                  />
                </div>

                {/* Opponent Energy Meters */}
                <div className="grid grid-cols-2 gap-1 text-[9px] font-bold">
                  <div className="h-1.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-100 float-right"
                      style={{ width: `${oppSpecial}%` }}
                    />
                  </div>
                  <div className="h-1.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                    <div
                      className="h-full bg-purple-400 transition-all duration-100 float-right"
                      style={{ width: `${oppUlt}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Central Dramatic Announcement Banner */}
          {bannerText && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
              <div className="px-6 py-3 rounded-2xl bg-black/85 border-2 border-amber-400 text-center shadow-2xl animate-bounce">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 tracking-wider">
                  {bannerText.title}
                </h2>
                {bannerText.subtitle && (
                  <p className="text-xs text-amber-200 font-bold uppercase mt-1 tracking-widest">
                    {bannerText.subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Responsive Touch Controls for Mobile and Touchscreens */}
          <div className="absolute bottom-2 inset-x-2 z-20 pointer-events-auto touch-none select-none">
            <div className="flex justify-between items-end gap-2">
              {/* D-Pad Controls: Left, Jump, Right */}
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm p-1.5 rounded-2xl border border-white/10">
                <button
                  onTouchStart={e => {
                    e.preventDefault();
                    sceneRef.current?.setMobileMove(-1);
                  }}
                  onTouchEnd={e => {
                    e.preventDefault();
                    sceneRef.current?.setMobileMove(0);
                  }}
                  onMouseDown={() => sceneRef.current?.setMobileMove(-1)}
                  onMouseUp={() => sceneRef.current?.setMobileMove(0)}
                  className="w-12 h-12 rounded-xl bg-white/15 active:bg-amber-500/60 border border-white/20 flex items-center justify-center font-black text-white text-base"
                >
                  ◀
                </button>
                <button
                  onTouchStart={handleTouchJump}
                  onMouseDown={handleTouchJump}
                  className="w-12 h-12 rounded-xl bg-white/15 active:bg-amber-500/60 border border-white/20 flex items-center justify-center font-black text-white text-base"
                >
                  ▲
                </button>
                <button
                  onTouchStart={e => {
                    e.preventDefault();
                    sceneRef.current?.setMobileMove(1);
                  }}
                  onTouchEnd={e => {
                    e.preventDefault();
                    sceneRef.current?.setMobileMove(0);
                  }}
                  onMouseDown={() => sceneRef.current?.setMobileMove(1)}
                  onMouseUp={() => sceneRef.current?.setMobileMove(0)}
                  className="w-12 h-12 rounded-xl bg-white/15 active:bg-amber-500/60 border border-white/20 flex items-center justify-center font-black text-white text-base"
                >
                  ▶
                </button>
              </div>

              {/* Action Buttons: Block, Punch, Kick, Special, Ultimate */}
              <div className="flex flex-col gap-1.5 items-end">
                {/* Top Row: Special & Ultimate */}
                <div className="flex gap-1.5">
                  <button
                    onTouchStart={handleTouchSpecial}
                    onMouseDown={handleTouchSpecial}
                    disabled={playerSpecial < playerFighter.specialMove.energyCost}
                    className={`px-3 h-10 rounded-xl text-xs font-black uppercase flex items-center gap-1 border transition-all ${
                      playerSpecial >= playerFighter.specialMove.energyCost
                        ? 'bg-amber-500 text-black border-amber-300 shadow-glow-amber active:scale-95'
                        : 'bg-white/10 text-white/40 border-white/10'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>SP (U)</span>
                  </button>

                  <button
                    onTouchStart={handleTouchUltimate}
                    onMouseDown={handleTouchUltimate}
                    disabled={playerUlt < 100}
                    className={`px-3 h-10 rounded-xl text-xs font-black uppercase flex items-center gap-1 border transition-all ${
                      playerUlt >= 100
                        ? 'bg-gradient-to-r from-pink-500 to-red-600 text-white border-white animate-pulse shadow-glow-rose active:scale-95'
                        : 'bg-white/10 text-white/40 border-white/10'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>ULT (I)</span>
                  </button>
                </div>

                {/* Bottom Row: Block, Punch, Kick */}
                <div className="flex gap-1.5">
                  <button
                    onTouchStart={e => {
                      e.preventDefault();
                      sceneRef.current?.setMobileBlock(true);
                    }}
                    onTouchEnd={e => {
                      e.preventDefault();
                      sceneRef.current?.setMobileBlock(false);
                    }}
                    onMouseDown={() => sceneRef.current?.setMobileBlock(true)}
                    onMouseUp={() => sceneRef.current?.setMobileBlock(false)}
                    className="w-12 h-12 rounded-xl bg-blue-600/30 active:bg-blue-600 border border-blue-400 text-blue-200 font-bold text-xs flex items-center justify-center"
                  >
                    BLK (L)
                  </button>

                  <button
                    onTouchStart={handleTouchPunch}
                    onMouseDown={handleTouchPunch}
                    className="w-12 h-12 rounded-xl bg-orange-600/40 active:bg-orange-500 border border-orange-400 text-white font-black text-xs flex items-center justify-center shadow-md"
                  >
                    PUN (J)
                  </button>

                  <button
                    onTouchStart={handleTouchKick}
                    onMouseDown={handleTouchKick}
                    className="w-12 h-12 rounded-xl bg-red-600/40 active:bg-red-500 border border-red-400 text-white font-black text-xs flex items-center justify-center shadow-md"
                  >
                    KICK (K)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SCREEN 6: MATCH RESULT (Victory / Defeat) */}
      {/* ------------------------------------------------------------- */}
      {screen === 'match-result' && matchStats && (
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 bg-gradient-to-b from-[#180B2E] via-[#24103E] to-[#0E061B] text-white">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">MATCH CONCLUDED</span>
            <div className="flex justify-center">
              <FighterAvatar fighterId={matchWinner === 'player' ? playerFighter.id : oppFighter.id} size={76} />
            </div>
            <h2
              className={`text-3xl font-black tracking-tight ${
                matchWinner === 'player'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500'
                  : 'text-red-500'
              }`}
            >
              {matchWinner === 'player' ? 'VICTORY!' : 'DEFEAT!'}
            </h2>
            <p className="text-xs text-amber-200/80 italic">
              "{matchWinner === 'player' ? playerFighter.victoryQuote : oppFighter.victoryQuote}"
            </p>
          </div>

          {/* Match Score & Performance Breakdown */}
          <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs text-white/70">Final Match Score</span>
              <span className="text-xl font-black text-amber-400">
                {matchStats.finalScore.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-white/50 block">Rounds Score</span>
                <span className="font-bold text-white">
                  {playerWins} - {oppWins}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">Damage Dealt</span>
                <span className="font-bold text-emerald-400">
                  {matchStats.totalDamageDealt}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">Damage Taken</span>
                <span className="font-bold text-rose-400">
                  {matchStats.totalDamageTaken}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/50 block">Specials Used</span>
                <span className="font-bold text-amber-300">
                  {matchStats.playerSpecialsUsed}
                </span>
              </div>
            </div>

            <div className="pt-1 text-[10px] text-white/50 flex justify-between">
              <span>All-Time Record: {savedStats.wins}W - {savedStats.losses}L</span>
              <span>Best: {savedStats.bestScore.toLocaleString()}</span>
            </div>
          </div>

          {/* Buttons: Rematch, Change Fighter, Main Menu */}
          <div className="space-y-2">
            <button
              onClick={() => {
                fighterAudio.playSpecial();
                setScreen('versus');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REMATCH</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setScreen('select-fighter')}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10"
              >
                CHANGE FIGHTER
              </button>
              <button
                onClick={() => setScreen('landing')}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: HOW TO PLAY */}
      {/* ------------------------------------------------------------- */}
      {isHowToPlayOpen && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm p-5 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 font-black text-amber-400 text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>HOW TO PLAY</span>
            </div>
            <button onClick={() => setIsHowToPlayOpen(false)} className="p-1 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3.5 my-auto text-xs overflow-y-auto max-h-[500px] pr-1">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="font-bold text-amber-300 block">Desktop Keyboard Controls</span>
              <ul className="space-y-1 text-white/80 text-[11px]">
                <li>• <strong>A / D:</strong> Move Left / Right</li>
                <li>• <strong>W:</strong> Jump into the air</li>
                <li>• <strong>J:</strong> Quick Punch (generates energy)</li>
                <li>• <strong>K:</strong> Heavy Kick (high reach &amp; knockback)</li>
                <li>• <strong>L (Hold):</strong> Block incoming attacks (-80% damage)</li>
                <li>• <strong>U:</strong> Special Move (consumes energy)</li>
                <li>• <strong>I:</strong> Ultimate Move (requires 100% Ultimate meter)</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="font-bold text-purple-300 block">Mobile Touch Controls</span>
              <p className="text-[11px] text-white/80">
                Use the ergonomic touch D-Pad on the lower-left for moving and jumping. Tap action buttons on the lower-right for Punch, Kick, Block, Special, and Ultimate moves.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="font-bold text-emerald-300 block">Match Rules</span>
              <p className="text-[11px] text-white/80">
                Best of 3 rounds. Each round is 60 seconds. Deplete your opponent's health to 0 to win the round!
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHowToPlayOpen(false)}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs"
          >
            GOT IT!
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ROSTER & MEME LORE */}
      {/* ------------------------------------------------------------- */}
      {isRosterOpen && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm p-5 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 font-black text-purple-400 text-sm">
              <Users className="w-4 h-4" />
              <span>THE 4 LEGENDS</span>
            </div>
            <button onClick={() => setIsRosterOpen(false)} className="p-1 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2.5 my-auto text-xs overflow-y-auto max-h-[500px] pr-1">
            {FIGHTER_LIST.map(f => (
              <div key={f.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <FighterAvatar fighterId={f.id} size={44} />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-300 text-xs">{f.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">{f.title}</span>
                  </div>
                  <p className="text-[10px] text-white/70 line-clamp-2">{f.concept}</p>
                  <div className="pt-0.5 text-[9px] text-emerald-300 truncate">
                    <strong>Special:</strong> {f.specialMove.name} • <strong>Ult:</strong> {f.ultimateMove.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsRosterOpen(false)}
            className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-black text-xs"
          >
            CLOSE ROSTER
          </button>
        </div>
      )}
    </div>
  );
};
