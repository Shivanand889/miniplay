/**
 * Google AdSense Central Configuration
 * 
 * IMPORTANT:
 * - Advertisements are disabled by default during development and initial deployment.
 * - Replace `publisherId` with your actual AdSense publisher ID (e.g. 'ca-pub-XXXXXXXXXXXXXXXX') once approved.
 * - Fill in actual adSlot IDs created in the Google AdSense dashboard.
 * - AdSense guidelines strictly prohibit ads covering game controls or sitting inside game canvases.
 */

export interface AdSenseConfig {
  enabled: boolean;
  testMode: boolean;
  publisherId: string;
  slots: {
    homeHeroBanner: string;
    homeMidSection: string;
    gameListTop: string;
    gamePageDesktopSidebar: string;
    gamePageBelowCanvas: string;
    gamePageBelowInstructions: string;
    footerBanner: string;
  };
}

export const ADSENSE_CONFIG: AdSenseConfig = {
  // Advertisements remain disabled until real credentials are provided
  enabled: false,
  testMode: true, // Shows non-intrusive preview outlines in dev mode
  publisherId: 'ca-pub-0000000000000000', // Replace with verified AdSense ID
  slots: {
    homeHeroBanner: '0000000001',
    homeMidSection: '0000000002',
    gameListTop: '0000000003',
    gamePageDesktopSidebar: '0000000004',
    gamePageBelowCanvas: '0000000005',
    gamePageBelowInstructions: '0000000006',
    footerBanner: '0000000007',
  },
};
