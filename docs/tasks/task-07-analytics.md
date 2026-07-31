# Task 07 — Vercel Analytics

## Status: DONE

## Objective
Add Vercel Analytics to the project and configure passive event tracking for lead form submissions and survey completions. Ensure the free tier (2,500 events/month) is sufficient for the validation window.

---

## Context
- **Spec reference:** `docs/spec.md` §2 (Analytics), §4 (passive data collection)
- **Tool:** Vercel Analytics (free tier — 2,500 events/month, sufficient for validation)
- **Dependencies:** task-01 (scaffold), task-04 (form submissions — events fired from these)
- **GA4 is explicitly out of scope for v1** — the spec notes it can be added later without migration. Do not add GA4.
- **Passive tracking only** — no popups, consent banners (for v1 validation), or user-visible tracking UI.

---

## Deliverables

1. `@vercel/analytics` installed
2. `<Analytics />` component added to root layout
3. Custom events fired on:
   - Hero lead capture form submission (success)
   - Secondary CTA form submission (success)
   - Survey submission (success)
   - Survey soft phone prompt submission (success)
4. Speed Insights added (`@vercel/speed-insights`)

---

## Installation

```bash
npm install @vercel/analytics @vercel/speed-insights
```

---

## Implementation Instructions

### 1. Add Analytics to root layout

Update `src/app/[locale]/layout.tsx` (or root `src/app/layout.tsx` if it exists):

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Inside the returned JSX, before closing </body>:
<Analytics />
<SpeedInsights />
```

`<Analytics />` automatically captures page views. No configuration needed for that.

---

### 2. Custom event tracking

Use the `track()` function from `@vercel/analytics` to fire custom events at key moments.

Import in form components:
```ts
import { track } from "@vercel/analytics";
```

#### Hero form success
In `src/components/sections/Hero.tsx`, after a successful `/api/lead` response:
```ts
track("lead_captured", {
  source: "hero",
  device: device,
});
```

#### Secondary CTA success
In `src/components/sections/SecondaryCTA.tsx`:
```ts
track("lead_captured", {
  source: "secondary_cta",
  device: device,
});
```

#### Survey submission success
In `src/components/sections/Survey.tsx`, after a successful `/api/survey` response:
```ts
track("survey_submitted", {
  childAgeRange: formData.childAgeRange,
  screenTimeConcern: formData.screenTimeConcern,
  wouldTry: formData.wouldTry,
  priceExpectation: formData.priceExpectation,
  hasOpenFeedback: !!formData.openFeedback,
  device: device,
});
```

#### Survey soft phone prompt success
```ts
track("lead_captured", {
  source: "survey_soft_prompt",
  device: device,
});
```

---

### 3. Event naming conventions

| Event name | When fired | Properties |
|---|---|---|
| `lead_captured` | Successful phone form submission | `source`, `device` |
| `survey_submitted` | Successful survey form submission | `childAgeRange`, `screenTimeConcern`, `wouldTry`, `priceExpectation`, `hasOpenFeedback`, `device` |

Keep property names consistent. Do not send PII (no phone numbers, no free-text answers in events).

---

### 4. Vercel Analytics dashboard setup

> This is a manual step requiring access to the Vercel dashboard.

1. Go to vercel.com → your project → Analytics tab
2. Click "Enable Analytics"
3. Vercel automatically wires up the `<Analytics />` component once deployed

Custom events appear under the "Events" tab in Vercel Analytics after the first deployment.

---

## Acceptance Criteria

- [ ] `npm run build` passes after adding analytics packages
- [ ] `<Analytics />` component is present in the layout — page views tracked automatically
- [ ] `<SpeedInsights />` component is present in the layout
- [ ] `track("lead_captured", ...)` fires on successful hero form submission (verify in browser console with `window.__va_debug = true`)
- [ ] `track("lead_captured", ...)` fires on successful secondary CTA submission
- [ ] `track("survey_submitted", ...)` fires on successful survey submission
- [ ] `track("lead_captured", { source: "survey_soft_prompt" })` fires on soft prompt submission
- [ ] No phone numbers or open-text feedback sent in event properties
- [ ] After first Vercel deployment, events appear in Vercel Analytics dashboard

---

## Files Created / Modified

```
src/app/[locale]/layout.tsx              (modified: Analytics + SpeedInsights)
src/components/sections/Hero.tsx         (modified: track() call on success)
src/components/sections/SecondaryCTA.tsx (modified: track() call on success)
src/components/sections/Survey.tsx       (modified: track() calls on success)
package.json                             (modified: @vercel/analytics + @vercel/speed-insights)
```
