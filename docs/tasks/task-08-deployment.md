# Task 08 — Deployment: GitHub Actions CI/CD → Vercel

## Status: DONE

## Objective
Set up a GitHub Actions CI/CD pipeline that automatically deploys the Sfurti landing page to Vercel on every push to `main`. Every other branch gets a preview deployment. The pipeline also runs lint, typecheck, and Playwright QA checks before deploying.

---

## Context
- **Spec reference:** `docs/spec.md` §2 (Deployment: Vercel free tier, auto-deploy from main)
- **Hosting:** Vercel free Hobby tier
- **Trigger:** Push to `main` → production deploy; push to any other branch → preview deploy
- **Pipeline steps:** lint → typecheck → Playwright QA → deploy
- **Dependencies:** All other tasks (01–07) should be complete before deploying to production
- **Environment variables:** Supabase connection URLs must be added to Vercel project settings and GitHub Secrets

---

## Deliverables

1. `.github/workflows/ci.yml` — CI pipeline (lint + typecheck + Playwright)
2. `.github/workflows/deploy.yml` — Deploy pipeline (runs after CI passes on main)
3. `vercel.json` — Vercel project config
4. Secrets configuration documented
5. Manual deployment checklist

---

## Architecture

```
Push to any branch
      │
      ▼
GitHub Actions: CI workflow
  ├── npm run lint
  ├── npm run typecheck
  └── Playwright: mobile viewport QA tests
      │
      ▼ (passes)
GitHub Actions: Deploy workflow
  ├── Branch = main → Vercel Production deploy
  └── Branch ≠ main → Vercel Preview deploy
      │
      ▼
Vercel auto-serves the deployment
```

---

## Step 1 — Vercel project configuration

Create `vercel.json` at project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

---

## Step 2 — Gather required secrets

Before setting up the pipeline, collect these values:

| Secret name | Where to find it |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens → Create token |
| `VERCEL_ORG_ID` | Run `npx vercel link` locally → check `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | Same `.vercel/project.json` → `projectId` |
| `DATABASE_URL` | Supabase dashboard → Settings → Database → Connection string (Transaction mode) |
| `DIRECT_URL` | Supabase dashboard → Settings → Database → Connection string (Direct) |

Add all of these to:
1. **GitHub repository secrets:** Settings → Secrets and variables → Actions → New repository secret
2. **Vercel environment variables:** vercel.com → project → Settings → Environment Variables → add for "Production" environment

> The `DATABASE_URL` and `DIRECT_URL` must be set in both GitHub Secrets (for CI database migrations) AND Vercel project settings (for the deployed app's runtime).

---

## Step 3 — CI workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run Prettier check
        run: npm run format:check

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript typecheck
        run: npm run typecheck

  playwright-qa:
    name: Playwright QA (Mobile)
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      DIRECT_URL: ${{ secrets.DIRECT_URL }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build Next.js app
        run: npm run build

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## Step 4 — Deploy workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]

jobs:
  deploy-production:
    name: Deploy to Production (Vercel)
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build for Vercel
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy to Vercel Production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-preview:
    name: Deploy Preview (Vercel)
    runs-on: ubuntu-latest
    if: github.ref != 'refs/heads/main'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Build for Vercel (preview)
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy Preview
        id: deploy
        run: |
          url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "preview_url=$url" >> $GITHUB_OUTPUT
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Comment preview URL on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Preview deployed: ${{ steps.deploy.outputs.preview_url }}`
            })
```

---

## Step 5 — Playwright QA tests to write

Create `tests/home.spec.ts` with at minimum these tests:

```ts
import { test, expect } from "@playwright/test";

test.describe("Home page — Mobile (375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("redirects / to /bn/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/bn\//);
  });

  test("hero section is visible", async ({ page }) => {
    await page.goto("/bn/");
    await expect(page.locator("#hero-section")).toBeVisible();
  });

  test("hero form is visible", async ({ page }) => {
    await page.goto("/bn/");
    await expect(page.locator("#hero-cta-form")).toBeVisible();
  });

  test("hero form has phone input", async ({ page }) => {
    await page.goto("/bn/");
    await expect(page.locator("#hero-cta-form input[type='tel']")).toBeVisible();
  });

  test("survey section is visible", async ({ page }) => {
    await page.goto("/bn/");
    await page.locator("#survey-section").scrollIntoViewIfNeeded();
    await expect(page.locator("#survey-section")).toBeVisible();
  });

  test("FAQ accordion opens and closes", async ({ page }) => {
    await page.goto("/bn/");
    const firstQuestion = page.locator("[data-faq-item]").first();
    await firstQuestion.scrollIntoViewIfNeeded();
    await firstQuestion.click();
    await expect(page.locator("[data-faq-answer]").first()).toBeVisible();
    await firstQuestion.click();
    await expect(page.locator("[data-faq-answer]").first()).not.toBeVisible();
  });

  test("language toggle switches locale", async ({ page }) => {
    await page.goto("/bn/");
    await page.locator("button[data-locale='en']").click();
    await expect(page).toHaveURL(/\/en\//);
  });

  test("about page renders", async ({ page }) => {
    await page.goto("/bn/about");
    await expect(page).toHaveURL(/\/bn\/about/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("contact page renders", async ({ page }) => {
    await page.goto("/bn/contact");
    await expect(page).toHaveURL(/\/bn\/contact/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
```

> Add `data-faq-item` and `data-faq-answer` attributes to the FAQ component if not already present.
> Add `data-locale` attribute to language toggle buttons.

---

## Step 6 — Pre-launch checklist (manual steps)

Complete these before pushing to `main` for the first production deploy:

### Domain
- [ ] Register the Sfurti domain (see spec §11 open items)
- [ ] Add custom domain in Vercel: project → Settings → Domains → Add
- [ ] Vercel will auto-provision SSL certificate

### Supabase
- [ ] Create Supabase project (free tier)
- [ ] Run `npx prisma db push` against the Supabase DB to create tables
- [ ] Verify `Lead` and `SurveyResponse` tables in Supabase Table Editor
- [ ] Add `DATABASE_URL` and `DIRECT_URL` to Vercel environment variables (production)
- [ ] Note: Supabase free tier pauses after 1 week of inactivity — monitor post-launch

### GitHub Secrets
- [ ] `VERCEL_TOKEN` added
- [ ] `VERCEL_ORG_ID` added
- [ ] `VERCEL_PROJECT_ID` added
- [ ] `DATABASE_URL` added
- [ ] `DIRECT_URL` added

### Content
- [ ] All `"..."` placeholders in content JSON are replaced with real copy (task-06)
- [ ] Native Bangla copy reviewed by a native speaker
- [ ] No shaming language in any copy

### QA
- [ ] `npx playwright test` passes locally
- [ ] Tested on a real mobile device (not just browser DevTools)
- [ ] Language toggle works on all three pages

### Analytics
- [ ] Vercel Analytics enabled in dashboard
- [ ] Test events visible in Vercel Analytics after first deploy

---

## Post-launch Monitoring

Check these daily during the 2-week validation window:

| What to check | Where |
|---|---|
| Lead count | Supabase Table Editor → Lead table |
| Survey responses | Supabase Table Editor → SurveyResponse table |
| Survey answer distribution | Supabase Table Editor → filter/sort SurveyResponse |
| Page views | Vercel Analytics dashboard |
| Custom events | Vercel Analytics → Events tab |
| Supabase project status | supabase.com → project → check it hasn't paused |

**Target:** 50 phone signups within 2 weeks of launch.

---

## Acceptance Criteria

- [ ] `ci.yml` runs on every push — lint, typecheck, Playwright all pass
- [ ] `deploy.yml` deploys to production when CI passes on `main`
- [ ] Preview deployments created for non-main branches
- [ ] PR comments receive preview URL
- [ ] Playwright tests pass in CI environment
- [ ] Production URL (custom domain) serves the site
- [ ] `https://` is enforced (Vercel SSL auto-provisioned)
- [ ] `/bn/` loads and is not a blank page in production
- [ ] Supabase DB is reachable from the Vercel deployment (test with a form submission)
- [ ] Vercel Analytics shows data after first deployment

---

## Files Created / Modified

```
.github/workflows/ci.yml       (created)
.github/workflows/deploy.yml   (created)
vercel.json                    (created)
tests/home.spec.ts             (created)
```
