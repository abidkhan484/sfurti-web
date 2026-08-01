# Google Analytics 4 (GA4) and Facebook (Meta) Pixel Manual Setup & Deployment Guide

This guide walks you step-by-step through setting up Google Analytics 4 (GA4) and Meta (Facebook) Pixel for the `sfurti-landing` application locally and deploying it on Vercel.

---

## Table of Contents
1. [Obtaining Your Tracking IDs](#1-obtaining-your-tracking-ids)
   - [Google Analytics 4 Measurement ID](#google-analytics-4-measurement-id)
   - [Meta (Facebook) Pixel ID](#meta-facebook-pixel-id)
2. [Local Setup (.env.local)](#2-local-setup-envlocal)
3. [Deploying on Vercel](#3-deploying-on-vercel)
4. [Verifying Installation](#4-verifying-installation)
5. [Tracking Custom Events in Code](#5-tracking-custom-events-in-code)

---

## 1. Obtaining Your Tracking IDs

### Google Analytics 4 Measurement ID
1. Go to [Google Analytics Console](https://analytics.google.com/).
2. Select or create your Account and Property for **Sfurti**.
3. In the left sidebar, click **Admin** (gear icon) -> **Data Streams**.
4. Choose **Web** stream (or create one for `https://sfurtibd.com` or your domain).
5. Copy the **Measurement ID** (it starts with `G-`, e.g., `G-ABC123XYZ4`).

### Meta (Facebook) Pixel ID
1. Go to [Meta Events Manager](https://m.facebook.com/events_manager2).
2. Select your Business Account.
3. Click **Data Sources** -> **Connect Data Sources** -> Select **Web** -> Click **Connect**.
4. Enter your Dataset / Pixel name (e.g. `Sfurti Web Pixel`).
5. Once created, navigate to **Settings** under your Data Source.
6. Copy the **Dataset ID / Pixel ID** (a string of numbers like `1234567890123456`).

---

## 2. Local Setup (.env.local)

1. Open (or create) `.env.local` in your project root directory:
   ```bash
   cp .env.example .env.local
   ```
2. Set your environment variables:
   ```env
   # Google Analytics 4 Measurement ID
   NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

   # Meta (Facebook) Pixel ID
   NEXT_PUBLIC_FB_PIXEL_ID="1234567890123456"
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```

> **Note:** If `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_FB_PIXEL_ID` is left empty or omitted, the tracking scripts will gracefully skip execution without throwing errors.

---

## 3. Deploying on Vercel

To enable analytics on your live Vercel deployment:

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select the **sfurti-landing** project.
3. Go to **Settings** -> **Environment Variables**.
4. Add the two environment variables:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (Your live GA4 Measurement ID)
   - **Target Environments:** Production, Preview, Development (select all or Production as needed)

   - **Key:** `NEXT_PUBLIC_FB_PIXEL_ID`
   - **Value:** `1234567890123456` (Your live Meta Pixel ID)
   - **Target Environments:** Production, Preview, Development

5. Click **Save**.
6. **Redeploy Project:** Trigger a new deployment (or push a commit to your main branch) so Next.js embeds the `NEXT_PUBLIC_` environment variables into the client bundle.

---

## 4. Verifying Installation

### Checking GA4
- Install the **[Google Tag Assistant Companion](https://tagassistant.google.com/)** Chrome extension.
- Visit your website.
- Open Google Tag Assistant or check **Google Analytics Realtime Report** (`Analytics Console -> Reports -> Realtime`) to confirm incoming user visits.

### Checking Meta Pixel
- Install the **[Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgflkkoebbingfjlbliegagfbcmflhh)** Chrome extension.
- Visit your website.
- Click the Meta Pixel Helper icon in your Chrome toolbar. It should display a green badge showing `PageView` event fired successfully with your Pixel ID.

---

## 5. Tracking Custom Events in Code

You can track custom interactions (e.g. form submissions, button clicks, lead conversions) using the helper functions located in `@/lib/analytics`.

### Example Usage in a Client Component:

```tsx
'use client';

import { trackEvent, trackGAEvent, trackFBPixelEvent } from '@/lib/analytics';

export default function ContactForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ... Submit form logic ...

    // Option 1: Send to BOTH GA4 and Meta Pixel at once
    trackEvent('contact_form_submitted', {
      category: 'Contact',
      label: 'Homepage Form',
    });

    // Option 2: Send specific Meta Pixel standard event (e.g. 'Lead')
    trackFBPixelEvent('Lead', { content_name: 'Contact Page Inquiry' });

    // Option 3: Send specific GA4 custom event
    trackGAEvent('generate_lead', {
      method: 'Contact Form',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit Inquiry</button>
    </form>
  );
}
```
