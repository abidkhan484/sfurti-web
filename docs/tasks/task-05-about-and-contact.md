# Task 05 — About Us & Contact Pages

## Status: DONE

## Objective
Build the About Us and Contact pages. Both pages share the sticky header from task-02. Content is fully driven by locale JSON files — no hardcoded strings. These are static pages; no backend calls required.

---

## Context
- **Spec reference:** `docs/spec.md` §6 (About Us page), §7 (Contact page)
- **Routes:**
  - About: `src/app/[locale]/about/page.tsx` → `/bn/about` and `/en/about`
  - Contact: `src/app/[locale]/contact/page.tsx` → `/bn/contact` and `/en/contact`
- **Dependencies:** task-01 (scaffold + next-intl routing), task-02 (header)
- **These pages are v1 stubs** — enough to look intentional and build trust. They are not full marketing pages.

---

## Deliverables

1. `src/app/[locale]/about/page.tsx`
2. `src/app/[locale]/contact/page.tsx`
3. `src/components/pages/AboutPage.tsx`
4. `src/components/pages/ContactPage.tsx`
5. `content/bn/about.json` (filled — native Bangla)
6. `content/en/about.json` (filled — native English)
7. `content/bn/contact.json` (filled)
8. `content/en/contact.json` (filled)

---

## About Us Page

### Sections (from spec §6)

1. **Brand origin** — why Sfurti exists; the screen-time problem framing
2. **Mission statement** — "effortful, hands-on cognition" in parent-friendly language; not jargon
3. **Founder/team context** — brief, human paragraph. Builds trust with a Bangladeshi parent audience. Example: "আমরা বাংলাদেশের একটি ছোট দল..."
4. **Product philosophy** — wooden toys as the entry point; the expansion vision (hands-on cognition → critical thinking)

### Design
- Background: Warm Cream (`bg-bg`)
- Section dividers: subtle horizontal rule with `border-primary/20`
- Mission statement: visually highlighted — large quote-style `text-2xl font-medium text-primary` in a callout block with left border accent
- Founder section: plain prose, no photo placeholder needed (avoids empty boxes)
- All illustrations: placeholder blocks (`bg-primary/10 rounded-xl`) — final illustrations are swapped in post-design

### Content keys (`content/bn/about.json`):

```json
{
  "meta": {
    "title": "আমাদের সম্পর্কে — স্ফূর্তি",
    "description": "স্ফূর্তি কেন তৈরি হলো এবং আমাদের মিশন কী"
  },
  "hero": {
    "headline": "স্ফূর্তি কেন?",
    "subheadline": "..."
  },
  "origin": {
    "headline": "কীভাবে শুরু",
    "body": "..."
  },
  "mission": {
    "headline": "আমাদের লক্ষ্য",
    "statement": "..."
  },
  "team": {
    "headline": "আমরা কারা",
    "body": "..."
  },
  "philosophy": {
    "headline": "আমাদের পণ্য দর্শন",
    "body": "..."
  }
}
```

English version (`content/en/about.json`) mirrors the same structure with native English copy — NOT a translation of Bangla.

---

## Contact Page

### Sections (from spec §7 — v1 stub)

1. **Brief message** — "We're still building — follow us to stay updated" (in native Bangla + English)
2. **Social links** — Facebook and Instagram (placeholder links)
3. **WhatsApp/phone contact** — display a phone number if the founder is comfortable making it public; otherwise omit and note it's optional
4. **Back to Home link** — subtle link at bottom

### Design
- Background: Warm Cream (`bg-bg`)
- Social links styled as prominent buttons: `border border-primary rounded-xl px-6 py-4` with icon + label
- Facebook icon: use Lucide `Facebook` icon or a simple SVG placeholder
- Instagram icon: use Lucide `Instagram` icon or a simple SVG placeholder
- WhatsApp: `Phone` icon from Lucide

### Content keys (`content/bn/contact.json`):

```json
{
  "meta": {
    "title": "যোগাযোগ — স্ফূর্তি",
    "description": "স্ফূর্তির সাথে যোগাযোগ করুন"
  },
  "headline": "যোগাযোগ করুন",
  "body": "আমরা এখনও তৈরি হচ্ছি — আপডেটের জন্য আমাদের ফলো করুন।",
  "social": {
    "facebook": {
      "label": "Facebook",
      "href": "#"
    },
    "instagram": {
      "label": "Instagram",
      "href": "#"
    }
  },
  "phone": {
    "label": "WhatsApp / ফোন",
    "number": ""
  },
  "back_link": "হোমে ফিরুন"
}
```

> `phone.number` is left empty for now. The founder fills this in before launch if comfortable.

---

## SEO — Metadata for each page

Use Next.js App Router `generateMetadata` to set page-specific `<title>` and `<meta name="description">` from the locale content JSON.

Example for About page:
```ts
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}
```

Apply the same pattern to the Contact page.

---

## Acceptance Criteria

- [ ] `/bn/about` and `/en/about` render without errors
- [ ] `/bn/contact` and `/en/contact` render without errors
- [ ] About page has all 4 sections with content (no empty blocks)
- [ ] Contact page social links render with icons (even if `href="#"` placeholder)
- [ ] Language toggle on both pages switches between `/bn/...` and `/en/...` correctly
- [ ] `<title>` and `<meta name="description">` are page-specific (not the default Next.js title)
- [ ] No hardcoded strings in JSX — all text from locale JSON
- [ ] All content in `content/bn/` files is written natively in Bangla (not machine-translated)
- [ ] `npm run build` passes with zero TypeScript errors

---

## Files Created / Modified

```
src/app/[locale]/about/page.tsx         (created)
src/app/[locale]/contact/page.tsx       (created)
src/components/pages/AboutPage.tsx      (created)
src/components/pages/ContactPage.tsx    (created)
content/bn/about.json                   (filled)
content/en/about.json                   (filled)
content/bn/contact.json                 (filled)
content/en/contact.json                 (filled)
```
