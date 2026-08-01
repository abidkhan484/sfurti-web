"use client";

import GoogleAnalytics from "./GoogleAnalytics";
import FacebookPixel from "./FacebookPixel";

export default function AnalyticsProviders() {
  return (
    <>
      <GoogleAnalytics />
      <FacebookPixel />
    </>
  );
}
