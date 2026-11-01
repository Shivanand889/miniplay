import React from 'react';
import { FighterId } from '../types';

interface FighterAvatarProps {
  fighterId: FighterId;
  size?: number | string;
  className?: string;
  showBorder?: boolean;
}

export const FighterAvatar: React.FC<FighterAvatarProps> = ({
  fighterId,
  size = 48,
  className = '',
  showBorder = true,
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  const renderAvatarGraphic = () => {
    switch (fighterId) {
      // -------------------------------------------------------------
      // JALDI THE LATE: Spiky hair, orange track jacket, wristwatch
      // -------------------------------------------------------------
      case 'jaldi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="jaldiBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#C2410C" />
                <stop offset="100%" stop-color="#7C2D12" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="20" fill="url(#jaldiBg)" />
            {/* Speed trail accents */}
            <path d="M10 25 L35 25" stroke="#FDE047" stroke-width="3" stroke-linecap="round" opacity="0.6" />
            <path d="M5 45 L25 45" stroke="#FDE047" stroke-width="2" stroke-linecap="round" opacity="0.4" />
            
            {/* Torso / Orange Track Jacket */}
            <path d="M22 100 L26 68 Q50 62 74 68 L78 100 Z" fill="#EA580C" />
            <path d="M47 64 L47 100 L53 100 L53 64 Z" fill="#FFFFFF" />
            {/* Collar */}
            <path d="M38 66 L50 78 L62 66 Z" fill="#C2410C" />

            {/* Arms & Wristwatch */}
            <path d="M22 75 Q12 85 24 95" stroke="#EA580C" stroke-width="9" stroke-linecap="round" fill="none" />
            {/* Gold Watch */}
            <rect x="12" y="80" width="10" height="12" rx="2" fill="#F59E0B" />
            <circle cx="17" cy="86" r="4.5" fill="#38BDF8" />
            <line x1="17" y1="86" x2="17" y2="83" stroke="#FFFFFF" stroke-width="1.2" />

            {/* Head & Neck */}
            <rect x="44" y="52" width="12" height="14" fill="#FCD34D" />
            <circle cx="50" cy="42" r="21" fill="#FCD34D" />

            {/* Spiky Anime/Cartoon Messy Hair */}
            <path
              d="M26 38 Q22 18 36 22 Q34 10 48 16 Q52 6 62 14 Q74 8 72 24 Q82 22 76 38 Q82 46 76 52 L26 52 Q20 44 26 38 Z"
              fill="#18181B"
            />

            {/* Cartoon Eyes (Wide & Energetic) */}
            <circle cx="43" cy="42" r="5.5" fill="#FFFFFF" />
            <circle cx="57" cy="42" r="5.5" fill="#FFFFFF" />
            <circle cx="44.5" cy="42" r="3" fill="#000000" />
            <circle cx="58.5" cy="42" r="3" fill="#000000" />
            <circle cx="46" cy="40.5" r="1.2" fill="#FFFFFF" />
            <circle cx="60" cy="40.5" r="1.2" fill="#FFFFFF" />

            {/* Impatient Smile */}
            <path d="M44 52 Q50 58 56 52" stroke="#18181B" stroke-width="2.2" stroke-linecap="round" fill="none" />
            {/* Expressive Eyebrows */}
            <path d="M38 34 Q44 31 48 35" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path d="M54 35 Q58 31 64 34" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" fill="none" />
          </svg>
        );

      // -------------------------------------------------------------
      // POOKIE DON: Sunglasses, gold chain, purple jacket, pompadour
      // -------------------------------------------------------------
      case 'pookie':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="pookieBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6B21A8" />
                <stop offset="100%" stop-color="#3B0764" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="20" fill="url(#pookieBg)" />
            {/* Cute Sparkles / Hearts */}
            <text x="14" y="26" fill="#F472B6" font-size="12">♥</text>
            <text x="78" y="32" fill="#FDE047" font-size="10">✦</text>

            {/* Torso: Royal Purple Blazer with Pink Lapels */}
            <path d="M20 100 L25 66 Q50 60 75 66 L80 100 Z" fill="#7E22CE" />
            {/* Pink Inner Shirt */}
            <path d="M42 64 L50 84 L58 64 Z" fill="#EC4899" />
            {/* Thick Gold Gangster Chain */}
            <path d="M36 68 Q50 88 64 68" stroke="#FACC15" stroke-width="4.5" fill="none" stroke-linecap="round" />
            <circle cx="50" cy="80" r="4.5" fill="#EAB308" />

            {/* Head & Neck */}
            <rect x="44" y="50" width="12" height="15" fill="#FCD34D" />
            <circle cx="50" cy="40" r="21" fill="#FCD34D" />

            {/* Slick Pompadour Hair */}
            <path
              d="M26 36 C22 18 36 12 50 12 C64 12 78 18 74 36 C76 44 74 48 70 50 L30 50 C26 48 24 44 26 36 Z"
              fill="#1E1B4B"
            />
            <path d="M36 20 C46 14 54 14 64 20" stroke="#312E81" stroke-width="3" fill="none" />

            {/* Oversized Cool Gangster Sunglasses */}
            <rect x="30" y="34" width="18" height="13" rx="3" fill="#000000" />
            <rect x="52" y="34" width="18" height="13" rx="3" fill="#000000" />
            <rect x="46" y="37" width="8" height="3.5" fill="#000000" />
            {/* Sunglasses Glare */}
            <line x1="33" y1="36" x2="41" y2="36" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
            <line x1="55" y1="36" x2="63" y2="36" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />

            {/* Pookie Cute Cheek Blush */}
            <circle cx="34" cy="50" r="5" fill="#F472B6" opacity="0.6" />
            <circle cx="66" cy="50" r="5" fill="#F472B6" opacity="0.6" />

            {/* Smirking Don Mouth */}
            <path d="M46 54 Q53 60 58 54" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" fill="none" />
          </svg>
        );

      // -------------------------------------------------------------
      // MEGA MART GUARD: Officer cap, whistle, moustache, navy uniform
      // -------------------------------------------------------------
      case 'guard':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="guardBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1E3A8A" />
                <stop offset="100%" stop-color="#0F172A" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="20" fill="url(#guardBg)" />

            {/* Torso: Security Uniform */}
            <path d="M18 100 L24 66 Q50 60 76 66 L82 100 Z" fill="#1E40AF" />
            {/* Gold Security Badge on Pocket */}
            <path d="M30 74 L38 74 L34 83 Z" fill="#F59E0B" />
            {/* Epaulettes */}
            <rect x="20" y="66" width="12" height="4" fill="#F59E0B" />
            <rect x="68" y="66" width="12" height="4" fill="#F59E0B" />

            {/* Head & Neck */}
            <rect x="43" y="50" width="14" height="15" fill="#FCD34D" />
            <circle cx="50" cy="40" r="21" fill="#FCD34D" />

            {/* Peaked Security Officer Cap */}
            <path d="M26 30 C26 14 74 14 74 30 Z" fill="#1E3A8A" />
            <rect x="22" y="28" width="56" height="6" rx="2" fill="#0F172A" />
            {/* Gold Crest */}
            <circle cx="50" cy="22" r="5" fill="#F59E0B" />
            <circle cx="50" cy="22" r="2.5" fill="#FEF08A" />

            {/* Strict Eyebrows */}
            <line x1="37" y1="35" x2="46" y2="38" stroke="#18181B" stroke-width="3" stroke-linecap="round" />
            <line x1="63" y1="35" x2="54" y2="38" stroke="#18181B" stroke-width="3" stroke-linecap="round" />

            {/* Eyes */}
            <circle cx="42" cy="40" r="2.5" fill="#000000" />
            <circle cx="58" cy="40" r="2.5" fill="#000000" />

            {/* Thick Iconic Desi Moustache */}
            <path
              d="M34 49 C38 46 47 48 50 51 C53 48 62 46 66 49 C64 56 54 55 50 53 C46 55 36 56 34 49 Z"
              fill="#18181B"
            />

            {/* Whistle in mouth with lanyard */}
            <rect x="52" y="51" width="12" height="5" rx="1.5" fill="#E5E7EB" />
            <circle cx="64" cy="53.5" r="3.5" fill="#9CA3AF" />
            <path d="M52 53 Q34 62 30 72" stroke="#EA580C" stroke-width="2" fill="none" />
          </svg>
        );

      // -------------------------------------------------------------
      // VADAPAV WARRIOR: Headband, apron, spatula, muscular attitude
      // -------------------------------------------------------------
      case 'vadapav':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="vadapavBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#991B1B" />
                <stop offset="100%" stop-color="#450A0A" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="20" fill="url(#vadapavBg)" />

            {/* Torso: Red Kurta Shirt with White Apron */}
            <path d="M18 100 L24 66 Q50 60 76 66 L82 100 Z" fill="#DC2626" />
            {/* White Kitchen Apron */}
            <path d="M32 72 L68 72 L64 100 L36 100 Z" fill="#F3F4F6" />
            <path d="M38 72 L44 64 L56 64 L62 72" stroke="#D1D5DB" stroke-width="2.5" fill="none" />

            {/* Steel Spatula in Hand (Left/Upper) */}
            <rect x="14" y="55" width="4" height="28" fill="#9CA3AF" transform="rotate(-20 14 55)" />
            <rect x="5" y="44" width="14" height="16" rx="2" fill="#E5E7EB" transform="rotate(-20 5 44)" />
            <line x1="8" y1="50" x2="16" y2="50" stroke="#9CA3AF" stroke-width="1.5" transform="rotate(-20 8 50)" />

            {/* Head & Neck */}
            <rect x="43" y="50" width="14" height="15" fill="#FCD34D" />
            <circle cx="50" cy="40" r="21" fill="#FCD34D" />

            {/* Short Dark Hair */}
            <path d="M28 36 C26 20 74 20 72 36 Z" fill="#18181B" />

            {/* Red Battle Headband with Ribbon Tail */}
            <rect x="27" y="27" width="46" height="8" rx="2" fill="#EF4444" />
            {/* Headband Floating Tail */}
            <path d="M28 31 L14 26 L16 38 Z" fill="#DC2626" />

            {/* Determined Eyes */}
            <line x1="38" y1="37" x2="47" y2="39" stroke="#18181B" stroke-width="3" stroke-linecap="round" />
            <line x1="62" y1="37" x2="53" y2="39" stroke="#18181B" stroke-width="3" stroke-linecap="round" />
            <circle cx="43" cy="42" r="2.8" fill="#000000" />
            <circle cx="57" cy="42" r="2.8" fill="#000000" />

            {/* Stubble Beard */}
            <path d="M42 51 Q50 56 58 51" stroke="#78350F" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
            {/* Gritted Teeth / Determined Expression */}
            <rect x="45" y="49" width="10" height="4" rx="1.5" fill="#FFFFFF" stroke="#18181B" stroke-width="1.5" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className={`relative shrink-0 rounded-2xl overflow-hidden transition-transform ${
        showBorder ? 'border-2 border-white/20 shadow-md' : ''
      } ${className}`}
    >
      {renderAvatarGraphic()}
    </div>
  );
};
