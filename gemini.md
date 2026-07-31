# স্ফূর্তি (Sfurti) — Project AI Guide

This file is the onboarding document for any AI agent or model working on this project. Read it fully before touching any code.

---

## Project Overview

**স্ফূর্তি (Sfurti)** is a cognitive-development toy brand landing page for Bangladeshi parents. The site exists to **validate demand and collect parent feedback** before sourcing or launching products. It is not a sales page.

- **Business mission:** Fight passive screen-based attention in children through physical, hands-on play — starting with wooden toys that build patience and logical thinking.
- **Success target:** 50 phone number signups within 2 weeks of launch via organic Facebook/Instagram traffic.
- **Full spec:** `docs/spec.md`
- **Business mission reference:** `docs/business-goal.md`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (URL-based: `/bn/`, `/en/`) |
| Database | Supabase (Postgres, free tier) via Prisma |
| Hosting | Vercel (free Hobby tier) |
| Analytics | Vercel Analytics |
| Testing | Playwright |
| CI/CD | GitHub Actions → Vercel |

**Default locale:** `bn` (Bangla). The buyer is a Bangladeshi parent.

---

## Repository Structure

```
sfurti-landing/
├── .gemini/
│   ├── agents/
│   │   ├── coder.md          ← Feature implementation agent
│   │   ├── committer.md      ← Git commit agent
│   │   └── qa.md             ← QA audit agent
│   ├── commands/
│   │   ├── task.toml         ← /task: print + dispatch next task
│   │   ├── commit.toml       ← /commit: run committer agent
│   │   ├── qa.toml           ← /qa: run QA audit
│   │   └── doc.toml          ← /doc: sync task status + open-items
│   └── settings.json
├── .github/
│   └── workflows/
│       ├── ci.yml            ← Lint + typecheck + Playwright
│       └── deploy.yml        ← Deploy to Vercel on main
├── content/
│   ├── bn/                   ← Bangla content JSON (source of truth for copy)
│   │   ├── home.json
│   │   ├── about.json
│   │   └── contact.json
│   └── en/                   ← English content JSON
│       ├── home.json
│       ├── about.json
│       └── contact.json
├── docs/
│   ├── spec.md               ← Full site specification
│   ├── business-goal.md      ← Business mission reference
│   └── tasks/
│       ├── task-01-project-setup.md
│       ├── task-02-header.md
│       ├── task-03-home-page-sections.md
│       ├── task-04-survey-and-api.md
│       ├── task-05-about-and-contact.md
│       ├── task-06-i18n-content.md
│       ├── task-07-analytics.md
│       └── task-08-deployment.md
├── i18n/
│   ├── routing.ts            ← next-intl locale routing config
│   └── request.ts            ← next-intl server request config
├── prisma/
│   └── schema.prisma         ← Prisma data model (Lead, SurveyResponse)
├── src/
│   ├── app/
│   │   ├── [locale]/         ← Locale-aware page routes
│   │   │   ├── layout.tsx    ← Locale root layout (Header + NextIntlClientProvider)
│   │   │   ├── page.tsx      ← Home page
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── lead/route.ts     ← POST: phone capture
│   │       └── survey/route.ts   ← POST: survey submission
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── NavLinks.tsx
│   │   │   ├── LanguageToggle.tsx
│   │   │   ├── NotifyMeCTA.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── sections/         ← Home page section components
│   │   │   ├── Hero.tsx
│   │   │   ├── Problem.tsx
│   │   │   ├── Thesis.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Survey.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── SecondaryCTA.tsx
│   │   │   └── Footer.tsx
│   │   └── pages/            ← About + Contact page components
│   │       ├── AboutPage.tsx
│   │       └── ContactPage.tsx
│   ├── hooks/
│   │   ├── useUTM.ts         ← Reads UTM params from URL
│   │   └── useDevice.ts      ← Detects mobile/desktop
│   └── lib/
│       └── prisma.ts         ← Prisma client singleton
├── tests/
│   └── home.spec.ts          ← Playwright tests
├── middleware.ts             ← next-intl locale routing middleware
├── playwright.config.ts
├── gemini.md                 ← This file
└── .env.example              ← Environment variable template
```

---

## Agent Roles

### `coder.md`
Implements features from task files. Follows TypeScript strict mode, mobile-first design, and the no-hardcoded-strings rule. Does not commit — hands off to `committer.md`.

### `committer.md`
Verifies lint + typecheck pass, writes Conventional Commits messages, and executes git commits.

### `qa.md`
Runs Playwright tests and audits mobile layout, i18n coverage, accessibility, copy quality, and form behaviour. Reports findings without fixing them.

---

## Security & Guardrails

- **Command Approval**: `run_command` is untrusted in `.gemini/settings.json`. Agents must request explicit user approval before executing any terminal commands.
- **Workspace Rules**: Detailed guardrails for safe command execution and destructive action prohibitions are maintained in [.agents/AGENTS.md](file:///infinity/codes/own/sfurti-landing/.agents/AGENTS.md).

---

## Commands

| Command | What it does |
|---|---|
| `/task` | Reads `docs/tasks/`, finds the next TODO task, and optionally dispatches it |
| `/commit` | Runs the committer agent to write + execute a conventional commit |
| `/qa` | Runs the QA agent for a full site audit |
| `/doc` | Syncs task Status lines and the open-items checklist in spec.md |

---

## Workflow Modes

### Single-agent mode (default)
Use this when running tasks one at a time:
1. Run `/task` to get the next TODO task
2. Implement it as the `coder` agent
3. Run `/commit` when done
4. Run `/qa` after major milestones
5. Run `/doc` to sync documentation

### Parallel subagent mode (for fast full-project builds)
Use this when you want to dispatch multiple tasks simultaneously (e.g. with the `/goal` command for an overnight run):

**Prerequisite:** task-01 must be `DONE` before any other task starts.

**Dispatch order:**
1. Run task-01 (project setup) first — sequentially
2. Once task-01 is `DONE`, dispatch tasks 02–07 as parallel subagents:
   - Each subagent receives: the `coder.md` agent instructions + the full content of one task file
   - Tasks 02–07 are designed to be independent once task-01 is complete
3. Once all tasks 02–07 are `DONE`, run task-08 (deployment) sequentially
4. Run `/qa` after task-08

**Important for parallel dispatch:**
- Each subagent should check out its own working copy or work on separate files — there should be no overlapping file writes between parallel tasks (the task files are designed to avoid this)
- The master orchestrator tracks completion via the `## Status:` line in each task file
- If a subagent encounters a BLOCKER (e.g. missing environment variable), it updates its task status to `BLOCKED` and reports to the master orchestrator

---

## Pre-commit Hook

Every `git commit` automatically runs:
1. **Prettier** — formats staged files
2. **ESLint** — lints and auto-fixes staged TypeScript/JS files
3. **`tsc --noEmit`** — type-checks the full project

If any step fails, the commit is blocked. Fix the errors before retrying.

This is configured via **Husky + lint-staged** (see task-01 for setup details).

---

## Content File Conventions

All user-visible strings live in `content/{locale}/{page}.json`. Components import content via `next-intl`'s `useTranslations()` hook.

**Rule:** No hardcoded strings in JSX. Ever.

**How to update copy:**
1. Edit the relevant JSON file in `content/bn/` or `content/en/`
2. Make the same change in both locale files
3. Redeploy (push to `main` triggers auto-deploy)
4. No code changes needed

**Key structure:**
- `content/{locale}/home.json` — all Home page text: `nav`, `header`, `hero`, `problem`, `thesis`, `products`, `survey`, `faq`, `secondary_cta`, `footer`
- `content/{locale}/about.json` — About page: `meta`, `hero`, `origin`, `mission`, `team`, `philosophy`
- `content/{locale}/contact.json` — Contact page: `meta`, `headline`, `body`, `social`, `phone`, `back_link`

---

## Brand Constraints (Non-negotiable)

1. **No Phase 2 content anywhere.** Nothing is sourced yet. No roadmap, no "coming soon" product categories beyond Phase 1.
2. **No pricing, no buy/checkout language.**
3. **No shaming.** Problem framing is positive — "a challenge every parent recognizes," not a failure.
4. **Mobile-first.** Every layout decision starts at 375px.
5. **Bilingual done natively.** Bangla and English copy are separate native drafts, not translations of each other.

---

## Environment Variables

```
DATABASE_URL   → Supabase transaction-mode connection string (for Prisma in production)
DIRECT_URL     → Supabase direct connection string (for migrations)
```

Copy `.env.example` to `.env.local` (git-ignored) and fill in values from the Supabase dashboard.

**Never commit `.env.local`.** It is in `.gitignore`.

---

## Key IDs (required for cross-component wiring)

| ID | Element | Why it's needed |
|---|---|---|
| `hero-section` | Hero `<section>` div | Header's IntersectionObserver targets this to show/hide "Notify Me" CTA |
| `hero-cta-form` | Hero `<form>` | Header's "Notify Me" button scrolls to this |
| `survey-section` | Survey `<section>` | Playwright tests target this |

Do not remove these IDs.

---

## Supabase Free Tier Warning

> Supabase free projects **pause after 1 week of inactivity**. During the 2-week validation launch window, this shouldn't be an issue if traffic is steady. Monitor the project dashboard if traffic drops between campaigns and manually restore if needed.

---

## Open Items (pre-launch)

Track these in `docs/spec.md` §11. Run `/doc` to sync status.

- [ ] Register domain for Sfurti
- [ ] Finalize wordmark (forest green primary + amber accent)
- [ ] Commission illustrations from nephew — brief: child mid-task (building/solving), warm comic style, cream background
- [ ] Write native Bangla copy for all sections (do not machine-translate)
- [ ] Create Supabase project + get connection pooler URL
- [ ] Create Facebook + Instagram pages (or get handles to link in footer/contact)
- [ ] Confirm 50-signups-in-2-weeks launch target before going live
