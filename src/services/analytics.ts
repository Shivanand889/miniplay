/**
 * Google Analytics 4 (GA4) Service
 * Configured via import.meta.env.VITE_GA_MEASUREMENT_ID
 * Respects user privacy and remains disabled when no measurement ID is configured.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

class AnalyticsService {
  private initialized = false;
  private measurementId: string | null = null;

  constructor() {
    this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || null;
    this.init();
  }

  private init() {
    if (!this.measurementId || this.measurementId === 'G-XXXXXXXXXX') {
      // Analytics disabled in development or until real ID provided
      return;
    }

    try {
      // Inject Google tag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        send_page_view: true,
        anonymize_ip: true,
      });

      this.initialized = true;
    } catch (e) {
      console.warn('Analytics initialization failed:', e);
    }
  }

  public trackPageView(path: string, title?: string) {
    if (!this.initialized || !window.gtag || !this.measurementId) return;
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  public trackGameOpened(gameId: string, gameName: string) {
    this.sendEvent('game_opened', { game_id: gameId, game_name: gameName });
  }

  public trackGameStarted(gameId: string, gameName: string) {
    this.sendEvent('game_started', { game_id: gameId, game_name: gameName });
  }

  public trackGameCompleted(gameId: string, score: number, durationSeconds?: number) {
    this.sendEvent('game_completed', {
      game_id: gameId,
      score,
      duration_seconds: durationSeconds,
    });
  }

  public trackGameReplayed(gameId: string) {
    this.sendEvent('game_replayed', { game_id: gameId });
  }

  public trackScoreAchieved(gameId: string, score: number, isHighScore: boolean) {
    this.sendEvent('score_achieved', {
      game_id: gameId,
      score,
      is_high_score: isHighScore,
    });
  }

  public trackGameShared(gameId: string, method: 'share_api' | 'clipboard') {
    this.sendEvent('game_shared', { game_id: gameId, method });
  }

  public trackCategorySelected(category: string) {
    this.sendEvent('category_selected', { category });
  }

  private sendEvent(eventName: string, params: Record<string, any>) {
    if (this.initialized && window.gtag) {
      window.gtag('event', eventName, params);
    } else {
      // In development mode, log events lightly to debug
      if (import.meta.env.DEV) {
        // console.debug(`[Analytics Event] ${eventName}:`, params);
      }
    }
  }
}

export const analytics = new AnalyticsService();
