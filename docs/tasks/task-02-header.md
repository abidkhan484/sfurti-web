# Task 02 — Sticky Header Component

## Status: DONE

## Objective
Build the sticky navigation header that appears on all three pages (Home, About, Contact). The header must include the brand wordmark, page navigation links, a language toggle (বাংলা / EN), and a "Notify Me" CTA button that appears after the hero section scrolls out of view.

---

## Context
- **Spec reference:** `docs/spec.md` §3 (Site architecture — sticky header)
- **All pages share this header.** It is a global layout component rendered in `src/app/[locale]/layout.tsx`.
- **Default locale:** `bn` (Bangla) — the language toggle switches between `/bn/...` and `/en/...` URL prefixes.
- **Mobile-first:** Start at 375px viewport. Desktop is a secondary enhancement.
- **Content:** All visible strings (nav labels, CTA text) must come from the content JSON — no hardcoded text in JSX.
- **Dependency:** task-01 must be complete (project scaffold + next-intl routing).

---

## Deliverables

1. `src/app/[locale]/layout.tsx` — root locale layout with Header + children
2. `src/components/layout/Header.tsx` — sticky header component
3. `src/components/layout/LanguageToggle.tsx` — bn/en switcher
4. `src/components/layout/NavLinks.tsx` — navigation links
5. `src/components/layout/NotifyMeCTA.tsx` — scroll-aware CTA button in header
6. Content keys wired to header section of locale JSON files

---

## Design Requirements

### Brand palette (from spec §9)
```
Primary:     Forest Green  #2D6A4F
Accent:      Amber/Honey   #E8A838
Background:  Warm Cream    #FAF3E0
Text:        Deep Charcoal #1A1A2E
CTA:         Terracotta    #C96A3D
```

Define these as CSS custom properties in `src/app/globals.css`:
```css
:root {
  --color-primary:    #2D6A4F;
  --color-accent:     #E8A838;
  --color-bg:         #FAF3E0;
  --color-text:       #1A1A2E;
  --color-cta:        #C96A3D;
}
```

Then extend Tailwind config to use them:
```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary:    "var(--color-primary)",
      accent:     "var(--color-accent)",
      bg:         "var(--color-bg)",
      "text-main":"var(--color-text)",
      cta:        "var(--color-cta)",
    },
  },
},
```

### Header visual spec
- **Height:** 64px on mobile, 72px on desktop
- **Background:** Warm Cream (`#FAF3E0`) with `backdrop-blur` when scrolled (adds `bg-opacity-90`)
- **Border:** 1px solid at bottom, subtle — `border-primary/20`
- **Position:** `sticky top-0 z-50`
- **Shadow:** Appears on scroll — `shadow-sm`
- **Layout (mobile):** Wordmark left | Hamburger menu right
- **Layout (desktop ≥ 768px):** Wordmark left | Nav links center | Language toggle + CTA right

### Wordmark
- Text: **স্ফূর্তি** in Bangla script, rendered in a serif or display font (use Google Fonts — Hind Siliguri or Noto Serif Bengali)
- Color: Forest Green `#2D6A4F`
- Font size: `text-2xl` on mobile, `text-3xl` on desktop
- Link: always href to `/${locale}` (home page in current locale)

### Navigation links
- Links: Home · About · Contact
- Content keys:
  - `nav.home`, `nav.about`, `nav.contact`
- Active link gets underline + primary color treatment
- On mobile: collapsed behind hamburger icon, slides down as a dropdown on tap

### Language toggle
- Two buttons: **বাংলা** | **EN**
- Active locale is bold/underlined; inactive is muted
- Switching locale navigates to the same page path in the other locale using `next-intl`'s `Link` component with `locale` prop
- Example: on `/bn/about`, clicking EN navigates to `/en/about`

### "Notify Me" CTA in header
- Button appears only after the hero section exits the viewport (use `IntersectionObserver` on the hero section)
- Label: `header.cta` content key — default: "লঞ্চের আগে জানতে চাই" (bn) / "Notify Me" (en)
- Button style: Terracotta background (`#C96A3D`), white text, rounded, `px-4 py-2`
- Clicking scrolls to / focuses the hero CTA form (use `document.getElementById("hero-cta-form").scrollIntoView()`)
- Entrance animation: slide down + fade in with a CSS transition (`translate-y` + `opacity`)
- Hidden on mobile in collapsed nav header — only visible on desktop

---

## File Structure

```
src/
  app/
    [locale]/
      layout.tsx          (root locale layout)
  components/
    layout/
      Header.tsx
      NavLinks.tsx
      LanguageToggle.tsx
      NotifyMeCTA.tsx
      MobileMenu.tsx      (hamburger + dropdown)
```

---

## Implementation Instructions

### 1. Create the locale layout

`src/app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "bn" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-bg text-text-main font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 2. Header component

`src/components/layout/Header.tsx`:

The Header is a client component (`"use client"`) because it needs:
- `useState` for mobile menu open/close
- `useScrollPosition` (or `IntersectionObserver`) for showing/hiding the CTA button

Props:
```ts
type HeaderProps = {
  locale: string;
};
```

Behaviour:
- On mount, set up an `IntersectionObserver` targeting `#hero-section`
- When `#hero-section` exits viewport, set `showCTA = true`; when it re-enters, set `showCTA = false`
- `isScrolled` state: `true` when `window.scrollY > 10` — enables backdrop blur + shadow
- Render `<NavLinks>`, `<LanguageToggle>`, conditionally `<NotifyMeCTA>`
- On mobile: render hamburger icon (Heroicons or Lucide) that toggles `<MobileMenu>`

### 3. NavLinks component

Content keys to add to `content/bn/home.json` and `content/en/home.json` under a `nav` key:

```json
{
  "nav": {
    "home": "হোম",
    "about": "আমাদের সম্পর্কে",
    "contact": "যোগাযোগ"
  }
}
```
English:
```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}
```

Use `next-intl`'s `Link` component (not `next/link`) for locale-aware routing.

Use `usePathname()` + `useParams()` from `next-intl/navigation` to detect the active route.

### 4. LanguageToggle component

```tsx
"use client";
import { useRouter, usePathname } from "next-intl/navigation";
import { useParams } from "next/navigation";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const switchLocale = (newLocale: "bn" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => switchLocale("bn")}
        className={currentLocale === "bn" ? "font-bold underline text-primary" : "text-text-main/60"}
      >
        বাংলা
      </button>
      <span className="text-text-main/30">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={currentLocale === "en" ? "font-bold underline text-primary" : "text-text-main/60"}
      >
        EN
      </button>
    </div>
  );
}
```

### 5. NotifyMeCTA component

- Button scrolls to `#hero-cta-form` using `document.getElementById("hero-cta-form")?.scrollIntoView({ behavior: "smooth" })`
- Animated entrance: use Tailwind transition classes — `transition-all duration-300`
- When `showCTA` is false: `opacity-0 -translate-y-2 pointer-events-none`
- When `showCTA` is true: `opacity-100 translate-y-0`

Content key: `header.cta`

Add to `content/bn/home.json`:
```json
{
  "header": {
    "cta": "লঞ্চের আগে জানতে চাই"
  }
}
```
English:
```json
{
  "header": {
    "cta": "Notify Me"
  }
}
```

---

## Content Keys Required

Add these to both `content/bn/home.json` and `content/en/home.json`:

```json
{
  "nav": {
    "home": "...",
    "about": "...",
    "contact": "..."
  },
  "header": {
    "cta": "..."
  }
}
```

---

## Acceptance Criteria

- [ ] Header is sticky (`position: sticky; top: 0; z-index: 50`) on all three pages
- [ ] Wordmark links to `/${locale}` home page
- [ ] All three nav links are present and route correctly
- [ ] Active route link is visually highlighted
- [ ] Language toggle switches between `/bn/` and `/en/` preserving the current page path
- [ ] "Notify Me" CTA button is NOT visible while hero is in viewport
- [ ] "Notify Me" CTA button IS visible after scrolling past hero, with a smooth entrance animation
- [ ] Clicking "Notify Me" scrolls to the hero CTA form
- [ ] On mobile (375px), nav links are hidden behind a hamburger menu
- [ ] Hamburger menu opens/closes correctly with tap
- [ ] On mobile, "Notify Me" CTA is hidden (desktop only)
- [ ] `npm run build` passes with no TypeScript errors
- [ ] No hardcoded strings in JSX — all text comes from content JSON

---

## Files Created / Modified

```
src/app/[locale]/layout.tsx           (created)
src/components/layout/Header.tsx      (created)
src/components/layout/NavLinks.tsx    (created)
src/components/layout/LanguageToggle.tsx (created)
src/components/layout/NotifyMeCTA.tsx (created)
src/components/layout/MobileMenu.tsx  (created)
src/app/globals.css                   (modified: CSS variables)
tailwind.config.ts                    (modified: color tokens)
content/bn/home.json                  (modified: nav + header keys)
content/en/home.json                  (modified: nav + header keys)
```
