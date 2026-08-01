# Complete Deployment Guide: Vercel & Supabase

This guide provides step-by-step instructions for deploying **Sfurti Landing** to **Vercel** with a **Supabase PostgreSQL** database.

---

## 📋 Prerequisites
1. A [Supabase account](https://supabase.com/).
2. A [Vercel account](https://vercel.com/) linked to your GitHub account (`sfurti-web`).

---

## 🗄️ Step 1: Set Up Supabase Project & Database

1. **Create Project**:
   - Log into [Supabase Dashboard](https://supabase.com/dashboard).
   - Click **New Project**, select your organization, and name your project (e.g., `sfurti-db`).
   - Set a strong database password (save this password safely).
   - Select your region (e.g., `ap-southeast-1` Singapore or closest to Bangladesh users).

2. **Retrieve Connection Strings**:
   - Navigate to **Project Settings** -> **Database**.
   - Under **Connection Strings**:
     - **Transaction Pooler (for production API runtime)**:
       - Select **Transaction** mode (Port `6543`).
       - URI format:
         ```env
         DATABASE_URL="postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
         ```
     - **Direct Connection (for Prisma schema push / migrations)**:
       - Select **Session** / **Direct** mode (Port `5432`).
       - URI format:
         ```env
         DIRECT_URL="postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
         ```

3. **Initialize Database Schema (Prisma Push)**:
   - Locally in your repository (or via terminal), set temporary environment variables pointing to your Supabase instance and push the schema:
     ```bash
     DATABASE_URL="<YOUR_SUPABASE_TRANSACTION_URL>" DIRECT_URL="<YOUR_SUPABASE_DIRECT_URL>" npx prisma db push
     ```
   - Verify tables in Supabase **Table Editor**: `Lead` and `SurveyResponse` should now exist.

---

## 🚀 Step 2: Deploy to Vercel

1. **Import Repository**:
   - Log into [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New...** -> **Project**.
   - Import your GitHub repository: `abidkhan484/sfurti-web` (or `sfurti-landing`).

2. **Configure Project Settings**:
   - **Framework Preset**: Next.js (automatically detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build` (runs `prisma generate && next build`).
   - **Output Directory**: `.next` (default).

3. **Add Environment Variables**:
   In the **Environment Variables** section during deployment (or in **Project Settings -> Environment Variables**):

   | Key | Value | Environment |
   |---|---|---|
   | `DATABASE_URL` | `<Your Supabase Transaction Pooler URL>` | Production, Preview, Development |
   | `DIRECT_URL` | `<Your Supabase Direct Connection URL>` | Production, Preview, Development |

4. **Deploy**:
   - Click **Deploy**. Vercel will build and launch your application.
   - Once complete, Vercel will provide a live `.vercel.app` URL.

---

## 🔄 Step 3: Managing CI & Workflows

- The GitHub Actions `ci.yml` workflow has been safely stored in `deploy/ci.yml`.
- Automatic deployments are handled seamlessly by Vercel on every `git push` to your main branch.
