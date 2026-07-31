# স্ফূর্তি (Sfurti) — Cognitive Toy Brand Landing Page

[![CI](https://github.com/sfurti/sfurti-landing/actions/workflows/ci.yml/badge.svg)](https://github.com/sfurti/sfurti-landing/actions/workflows/ci.yml)

**স্ফূর্তি (Sfurti)** is a cognitive-development toy brand landing page designed for Bangladeshi parents. The site exists to **validate market demand and collect parent feedback** through hands-on cognitive play alternatives before sourcing or launching products.

---

## 🎯 Business Mission

- **Problem:** Fight passive, screen-based attention in children.
- **Solution:** Physical, hands-on wooden cognitive toys that build patience, spatial awareness, and logical thinking.
- **Validation Goal:** Capture 50 parent signups / survey completions within 2 weeks of launch.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 App Router |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **i18n** | `next-intl` (URL-based: `/bn/`, `/en/` — default `bn`) |
| **Database & ORM** | Supabase (PostgreSQL) via Prisma ORM |
| **Analytics** | Vercel Analytics + Vercel Speed Insights |
| **Testing** | Playwright (Mobile & Desktop E2E) |
| **CI/CD** | GitHub Actions → Vercel Production Deploy |

---

## 📂 Repository Structure

```
sfurti-landing/
├── .github/
│   └── workflows/
│       ├── ci.yml            # Lint, typecheck, and Playwright QA workflow
│       └── deploy.yml        # Vercel production deploy workflow
├── content/
│   ├── bn/                   # Native Bangla copy (source of truth)
│   │   ├── home.json
│   │   ├── about.json
│   │   └── contact.json
│   └── en/                   # Native English copy
│       ├── home.json
│       ├── about.json
│       └── contact.json
├── docs/
│   ├── spec.md               # Full technical specification
│   ├── business-goal.md      # Business mission & brand guidelines
│   └── tasks/                # Detailed implementation tasks (01-08)
├── i18n/                     # next-intl routing & request configuration
├── prisma/
│   └── schema.prisma         # Lead and SurveyResponse data models
├── src/
│   ├── app/
│   │   ├── [locale]/         # Locale-aware pages (/bn, /en, /bn/about, etc.)
│   │   └── api/              # API route handlers (/api/lead, /api/survey)
│   ├── components/
│   │   ├── layout/           # Sticky Header, NavLinks, LanguageToggle, MobileMenu
│   │   ├── pages/            # About & Contact page layouts
│   │   └── sections/         # Home page single-scroll sections
│   ├── hooks/                # useUTM and useDevice analytics hooks
│   └── lib/                  # Prisma client singleton
├── tests/
│   └── home.spec.ts          # Playwright test suite
└── vercel.json               # Vercel deployment configuration
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Supabase connection pooler URL (for Prisma in production/runtime)
DATABASE_URL="postgresql://postgres:password@localhost:5432/sfurti?pgbouncer=true"

# Supabase direct connection URL (for migrations)
DIRECT_URL="postgresql://postgres:password@localhost:5432/sfurti"
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20 LTS
- npm >= 10

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The middleware automatically redirects to `/bn` (Bangla locale).

---

## 🧪 Verification & Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts local dev server at `http://localhost:3000` |
| `npm run build` | Generates Prisma client and builds Next.js production bundle |
| `npm run typecheck` | Runs TypeScript strict type-check (`tsc --noEmit`) |
| `npm run lint` | Runs Next.js / ESLint rules |
| `npm run format` | Auto-formats code with Prettier |
| `npm run format:check` | Verifies code formatting with Prettier |
| `npx playwright test` | Runs Playwright E2E tests |

---

## 🌐 Localization & Copy Updates

All text is configuration-driven — **no hardcoded text in JSX components**.

To update text for any section:
1. Edit `content/bn/{page}.json` for Bangla copy.
2. Edit `content/en/{page}.json` for English copy.
3. Commit and push to `main` — Vercel will automatically re-deploy.

---

## 📜 License

Private repository © Sfurti. All rights reserved.
