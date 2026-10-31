import React, { useState } from 'react';
import { GAMES } from '../../config/games';
import { useGameProgress } from '../../contexts/GameProgressContext';
import { StorageService } from '../../services/storage';
import { Sparkles, Coins, Check, Lock, Palette, X } from 'lucide-react';
import { soundFx } from '../../games/common/SoundFx';

interface SkinShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGameId?: string;
}

export const SkinShopModal: React.FC<SkinShopModalProps> = ({
  isOpen,
  onClose,
  defaultGameId = 'traffic-racer',
}) => {
  const { coins, unlockSkin, selectSkin } = useGameProgress();
  const [selectedGameId, setSelectedGameId] = useState(defaultGameId);

  if (!isOpen) return null;

  const currentGame = GAMES.find(g => g.id === selectedGameId) || GAMES[0];
  const progress = StorageService.getGameProgress(currentGame.id);

  const handleUnlock = (skinId: string, cost: number) => {
    if (coins < cost) {
      soundFx.playHit?.();
      return;
    }
    const success = unlockSkin(currentGame.id, skinId, cost);
    if (success) {
      soundFx.playPowerup();
    }
  };

  const handleSelect = (skinId: string) => {
    selectSkin(currentGame.id, skinId);
    soundFx.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[85vh] rounded-2xl border border-dark-border bg-dark-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-dark-border bg-dark-bg/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">Custom Skin Garage</h2>
              <p className="text-xs text-text-muted">
                Unlock cosmetics with coins earned from playing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-subtle hover:text-text-main hover:bg-dark-card transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coin Balance Bar & Game Selector */}
        <div className="px-5 py-3 bg-dark-card/60 border-b border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Game Switcher Tabs */}
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {GAMES.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGameId(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGameId === g.id
                    ? 'bg-primary text-white shadow-glow-primary'
                    : 'bg-dark-surface text-text-muted hover:text-text-main border border-dark-border'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-amber-400 text-xs font-bold">
            <Coins className="w-4 h-4" />
            <span>{coins.toLocaleString()} Coins</span>
          </div>
        </div>

        {/* Skins Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentGame.skins.map(skin => {
            const isUnlocked = progress.unlockedSkins.includes(skin.id);
            const isSelected = progress.selectedSkin === skin.id;
            const canAfford = coins >= skin.cost;

            return (
              <div
                key={skin.id}
                className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-glow-primary'
                    : isUnlocked
                    ? 'border-dark-border bg-dark-card/80 hover:border-dark-hover'
                    : 'border-dark-border/60 bg-dark-card/40 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Visual Color Preview Orb */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl shadow-md border-2 border-white/20 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${skin.color}, ${skin.secondaryColor || skin.color})`,
                        }}
                      >
                        <Sparkles className="w-5 h-5 text-white/90 drop-shadow" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-text-main">{skin.name}</h4>
                        <span className="text-[10px] text-text-muted capitalize">
                          {isUnlocked ? (isSelected ? 'Currently Equipped' : 'Unlocked') : `${skin.cost} Coins`}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-[10px] text-primary-light font-bold">
                        Equipped
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-muted mb-4">{skin.description}</p>
                </div>

                {/* Action Button */}
                <div>
                  {isUnlocked ? (
                    <button
                      onClick={() => handleSelect(skin.id)}
                      disabled={isSelected}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'bg-dark-border text-text-muted cursor-default'
                          : 'bg-dark-hover hover:bg-primary hover:text-white text-text-main'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Equipped</span>
                        </>
                      ) : (
                        <span>Equip Skin</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlock(skin.id, skin.cost)}
                      disabled={!canAfford}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-md cursor-pointer'
                          : 'bg-dark-card border border-dark-border text-text-subtle cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Coins className="w-4 h-4" />
                          <span>Unlock for {skin.cost} Coins</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Need {skin.cost - coins} More Coins</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
