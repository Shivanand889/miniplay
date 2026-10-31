import React, { useState } from 'react';
import { Share2, Copy, Check, X, Twitter, MessageCircle } from 'lucide-react';
import { analytics } from '../../services/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
  gameSlug: string;
  score: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  gameName,
  gameSlug,
  score,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/games/${gameSlug}`;
  const shareText = `I scored ${score.toLocaleString()} points in ${gameName} on MiniPlay! Can you beat my high score? Play free now:`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${gameName} High Score on MiniPlay`,
          text: shareText,
          url: shareUrl,
        });
        analytics.trackGameShared(gameSlug, 'share_api');
        onClose();
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyClipboard();
    }
  };

  const handleCopyClipboard = () => {
    const fullText = `${shareText} ${shareUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      analytics.trackGameShared(gameSlug, 'clipboard');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-dark-border bg-dark-surface p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-subtle hover:text-text-main p-1.5 rounded-lg hover:bg-dark-card transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/30">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main">Share Your Record</h3>
            <p className="text-xs text-text-muted">Challenge friends to beat your high score</p>
          </div>
        </div>

        {/* Score Callout Card */}
        <div className="my-5 rounded-xl border border-primary/30 bg-dark-card/80 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-text-muted font-medium">{gameName} Score</div>
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary mt-1">
            {score.toLocaleString()} PTS
          </div>
          <div className="mt-2 text-xs text-text-subtle italic">"Can you beat me?"</div>
        </div>

        {/* Quick Social Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/40 text-[#1DA1F2] py-2.5 px-3 text-xs font-semibold transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>Share on X</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] py-2.5 px-3 text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Copy Link / Native Share */}
        <div className="flex flex-col gap-2">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-3 px-4 text-sm font-semibold transition-all shadow-glow-primary"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via Device</span>
            </button>
          )}

          <button
            onClick={handleCopyClipboard}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-text-main py-2.5 px-4 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-text-muted" />
                <span>Copy Share Link & Challenge</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
