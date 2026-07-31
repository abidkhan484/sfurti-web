# Task 01 — Project Setup, Tooling & Pre-commit Hooks

## Status: DONE

## Objective
Bootstrap the Sfurti landing page repository with Next.js App Router, configure the complete developer-experience toolchain (TypeScript strict mode, ESLint flat config, Prettier, Husky + lint-staged), and verify a clean first deploy to Vercel.

---

## Context
- **Project:** স্ফূর্তি (Sfurti) — cognitive-development toy brand landing page for Bangladeshi parents
- **Purpose of this task:** Every subsequent task depends on a correctly configured project scaffold. Get this right before touching any feature code.
- **Primary audience:** Bangladeshi parents on mobile — default locale is `bn` (Bangla)
- **Spec reference:** `docs/spec.md` §2 (Tech stack), §12 (Build order steps 1–3)

---

## Deliverables

1. `package.json` with all dev dependencies listed below
2. `tsconfig.json` in strict mode
3. `eslint.config.mjs` (flat config)
4. `.prettierrc` and `.prettierignore`
5. `.husky/pre-commit` hook
6. `lint-staged` config in `package.json`
7. `next.config.ts` with `next-intl` plugin wired
8. `middleware.ts` for `next-intl` locale routing
9. `/content/en/` and `/content/bn/` directory stubs with empty JSON files
10. `i18n/routing.ts` and `i18n/request.ts` configuration
11. Clean `npm run build` with zero errors
12. Project linked to Vercel (manual step — documented below)

---

## Tech Stack

| Tool | Version / Notes |
|---|---|
| Node.js | >= 20 LTS |
| Next.js | 15.x (App Router) |
| React | 19.x |
| TypeScript | 5.x, `strict: true` |
| Tailwind CSS | 4.x |
| next-intl | 3.x |
| ESLint | 9.x (flat config) |
| Prettier | 3.x |
| Husky | 9.x |
| lint-staged | 15.x |
| Playwright | 1.x (dev dep — used by QA agent in task-08) |

---

## Step-by-step Instructions

### Step 1 — Scaffold Next.js project

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --eslint \
  --no-git
```

> Run inside the project root. The `--no-git` flag is used because the repo is already initialised.

Verify the scaffold produces:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `tailwind.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`

---

### Step 2 — Enforce TypeScript strict mode

Open `tsconfig.json` and ensure the following flags are present under `"compilerOptions"`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

`noUncheckedIndexedAccess` is especially important when reading JSON content files.

---

### Step 3 — Configure ESLint (flat config)

Replace the default `eslint.config.mjs` content with:

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true }
      ],
    },
  },
];

export default eslintConfig;
```

---

### Step 4 — Configure Prettier

Create `.prettierrc` at project root:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Create `.prettierignore` at project root:

```
node_modules/
.next/
out/
dist/
public/
content/
*.json
```

Install prettier plugin:
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

Add scripts to `package.json`:
```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

---

### Step 5 — Install and configure Husky + lint-staged

```bash
npm install -D husky lint-staged
npx husky init
```

This creates `.husky/pre-commit`. Replace its content with:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Add `lint-staged` configuration to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix",
      "bash -c 'tsc --noEmit'"
    ],
    "*.{js,mjs,cjs}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{css,json,md}": [
      "prettier --write"
    ]
  }
}
```

**Hook order:** Prettier formats first → ESLint auto-fixes → TypeScript type-check runs last (read-only, no auto-fix). If `tsc --noEmit` fails, the commit is blocked.

> Note: `tsc --noEmit` runs on the full project even when only staged files changed — this is intentional because a change in one file can break types in another.

Verify the hook works:
```bash
git add .
git commit -m "chore: initial project scaffold"
```

The commit should succeed only after Prettier, ESLint, and TypeScript all pass.

---

### Step 6 — Install and configure next-intl

```bash
npm install next-intl
```

Create `i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bn", "en"],
  defaultLocale: "bn",
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/contact": "/contact",
  },
});
```

Create `i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "bn" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../content/${locale}/home.json`)).default,
  };
});
```

Create `middleware.ts` at project root:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
```

Update `next.config.ts` to use the `next-intl` plugin:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

---

### Step 7 — Create content directory stubs

Create the following directory structure with empty JSON stub files:

```
content/
  en/
    home.json     -> {}
    about.json    -> {}
    contact.json  -> {}
  bn/
    home.json     -> {}
    about.json    -> {}
    contact.json  -> {}
```

These files will be filled in as part of task-06 (i18n content). Creating them now allows `next-intl` to import them without crashing during development.

---

### Step 8 — Install Playwright (QA dependency)

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Create `playwright.config.ts` at project root:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Mobile Chrome (375px)",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

Create the test directory:
```bash
mkdir -p tests
```

---

### Step 9 — Verify build

```bash
npm run format:check   # Prettier passes
npm run lint           # ESLint passes
npm run typecheck      # tsc --noEmit passes
npm run build          # Next.js production build passes
```

All four commands must exit with code `0` before this task is considered complete.

---

### Step 10 — Link to Vercel (manual step)

> This step requires a Vercel account. It is a one-time human action.

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import the GitHub repository containing this project
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `/` (project root)
5. Environment variables: none yet (will be added in task-05)
6. Click **Deploy**

After linking, every push to `main` auto-deploys. Preview deploys are created for every other branch automatically.

---

## Acceptance Criteria

- [ ] `npm run dev` serves the app at `http://localhost:3000` without errors
- [ ] Visiting `http://localhost:3000` redirects to `http://localhost:3000/bn`
- [ ] `npm run build` exits with code `0`
- [ ] `npm run lint` exits with code `0`
- [ ] `npm run typecheck` exits with code `0`
- [ ] `git commit` triggers the pre-commit hook (Prettier → ESLint → tsc)
- [ ] A deliberate type error blocks the commit
- [ ] `/content/bn/home.json` and `/content/en/home.json` exist (even if `{}`)
- [ ] Vercel project is linked and a first deploy is live (manual step)

---

## Files Created / Modified

```
next.config.ts          (modified)
tsconfig.json           (modified)
eslint.config.mjs       (modified)
.prettierrc             (created)
.prettierignore         (created)
middleware.ts           (created)
i18n/routing.ts         (created)
i18n/request.ts         (created)
playwright.config.ts    (created)
tests/                  (created, empty)
content/en/home.json    (created, stub)
content/en/about.json   (created, stub)
content/en/contact.json (created, stub)
content/bn/home.json    (created, stub)
content/bn/about.json   (created, stub)
content/bn/contact.json (created, stub)
.husky/pre-commit       (created)
package.json            (modified: scripts, lint-staged)
```
