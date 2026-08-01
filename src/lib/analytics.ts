declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
    fbq?: (
      trackType: "track" | "trackCustom" | "init",
      eventName: string,
      parameters?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/**
 * Send custom event to Google Analytics 4
 */
export const trackGAEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};

/**
 * Send custom event to Facebook (Meta) Pixel
 */
export const trackFBPixelEvent = (
  eventName: string,
  params?: Record<string, unknown>,
  isCustom = false
) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (isCustom) {
      window.fbq("trackCustom", eventName, params);
    } else {
      window.fbq("track", eventName, params);
    }
  }
};

/**
 * Unified helper to send tracking events to both GA4 and Meta Pixel
 */
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  trackGAEvent(eventName, params);
  trackFBPixelEvent(eventName, params);
};
