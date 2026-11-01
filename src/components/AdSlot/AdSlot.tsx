import React, { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG } from '../../config/adsense';

interface AdSlotProps {
  adSlotId?: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  adSlotId = ADSENSE_CONFIG.slots.homeHeroBanner,
  adFormat = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isEnabled = ADSENSE_CONFIG.enabled;
  const isTestMode = ADSENSE_CONFIG.testMode;
  const isRealSlot = Boolean(
    adSlotId &&
    !adSlotId.startsWith('00000000') &&
    adSlotId.length >= 8 &&
    /^\d+$/.test(adSlotId)
  );

  useEffect(() => {
    if (isEnabled && isRealSlot && adRef.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.warn('AdSense push error:', err);
      }
    }
  }, [isEnabled, isRealSlot]);

  // If test mode is enabled, show the clean development placeholder
  if (isTestMode) {
    return (
      <aside
        aria-label={label}
        className={`ad-placeholder my-4 mx-auto w-full max-w-5xl rounded-lg border border-dashed border-dark-border bg-dark-surface/40 p-3 text-center transition-opacity hover:border-dark-hover ${className}`}
      >
        <div className="flex items-center justify-between text-[11px] text-text-subtle mb-1 px-2">
          <span className="uppercase tracking-wider font-medium">{label}</span>
          <span className="bg-dark-card px-2 py-0.5 rounded text-[10px] text-text-muted">
            Slot: {adSlotId} ({adFormat})
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-4 text-xs text-text-muted/60">
          <span className="font-semibold text-text-muted">AdSense Reserved Placement Area</span>
          <span className="text-[11px] mt-0.5 text-text-subtle">
            Ads are inactive. Official Google AdSense scripts will render here upon configuration.
          </span>
        </div>
      </aside>
    );
  }

  // If ads are not enabled or slot is not a real registered ad unit, render nothing.
  // Google Auto Ads from index.html will handle placements seamlessly without throwing broken ad errors.
  if (!isEnabled || !isRealSlot) {
    return null;
  }

  // Active production AdSense tag with a verified real slot ID
  return (
    <aside aria-label={label} className={`ad-container my-4 text-center overflow-hidden ${className}`}>
      <div className="text-[10px] uppercase tracking-wider text-text-subtle mb-1">{label}</div>
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CONFIG.publisherId}
          data-ad-slot={adSlotId}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </aside>
  );
};
