# Deployment & Production Setup Guide

**Document Version:** 1.0.0  
**Effective Date:** October 2026  
**Hosting Target:** Netlify Serverless Architecture  
**Frontend Stack:** React 19 / Vite / TypeScript / TailwindCSS  
**Backend Stack:** Netlify Functions (Node.js 20+ TypeScript runtime)

---

## 1. Prerequisites

Before deploying the AI Thumbnail Intelligence System, ensure your local environment and accounts meet the following criteria:

- **Node.js:** Version `20.x` or later installed (`node -v`).
- **Package Manager:** `npm` (v10+) or `pnpm` (v9+).
- **Git:** Git CLI configured and authorized with GitHub / GitLab.
- **Netlify Account:** Free or Pro account at [https://app.netlify.com/](https://app.netlify.com/).
- **Netlify CLI (Optional for local emulation):** `npm install -g netlify-cli`.
- **API Credentials:** Keys obtained as described in [`docs/API_SETUP.md`](./API_SETUP.md).

---

## 2. Local Development Setup

To run and debug the full stack locally:

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root project directory:
```powershell
cp .env.example .env
```
Populate `.env` with your real keys:
```env
GEMINI_API_KEY=AIzaSy...
CLOUDFLARE_ACCOUNT_ID=8f7e...
CLOUDFLARE_API_TOKEN=vL4...
YOUTUBE_API_KEY=AIzaSy...
APP_ACCESS_CODE=optional_secret
```

### Step 3: Run with Netlify Dev
Using `netlify dev` starts both the Vite client dev server and emulates the Netlify Serverless Functions on a unified port (default: `http://localhost:8888`):
```powershell
npx netlify dev
```
Alternatively, if you only want to test the React UI with mock data:
```powershell
npm run dev
```

---

## 3. Netlify Production Deployment

Deploying to Netlify provides automated CI/CD builds, HTTPS, CDN edge caching, and serverless execution for the pipeline functions.

### Method A: Git-Based Automated Deployment (Recommended)

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket):
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of thumbnail intelligence system"
   git remote add origin https://github.com/your-org/thumbnail-intelligence.git
   git push -u origin main
   ```
2. **Import Project in Netlify:**
   - Go to [https://app.netlify.com/](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
   - Authorize Git provider and select your repository.
3. **Configure Build Settings:**
   - **Base directory:** Leave blank (root).
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
4. **Configure Environment Variables:**
   - Scroll down to the **"Environment variables"** section.
   - Add all 5 variables:
     - `GEMINI_API_KEY`
     - `CLOUDFLARE_ACCOUNT_ID`
     - `CLOUDFLARE_API_TOKEN`
     - `YOUTUBE_API_KEY`
     - `APP_ACCESS_CODE` (optional)
5. **Deploy Site:**
   - Click **"Deploy site"**. Netlify will build the frontend assets and compile the serverless functions.

---

### Method B: Manual CLI Deployment

If you prefer deploying directly from your terminal:
```powershell
# Authenticate CLI
npx netlify login

# Initialize and link site
npx netlify init

# Set production environment variables
npx netlify env:set GEMINI_API_KEY "AIzaSy..."
npx netlify env:set CLOUDFLARE_ACCOUNT_ID "8f7e..."
npx netlify env:set CLOUDFLARE_API_TOKEN "vL4..."
npx netlify env:set YOUTUBE_API_KEY "AIzaSy..."

# Build and deploy to production
npx netlify deploy --build --prod
```

---

## 4. Netlify Configuration Specification (`netlify.toml`)

Verify that the root `netlify.toml` file contains the following build and redirect definitions:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
  external_node_modules = []

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 5. Post-Deployment Verification Checklist

Once the deployment completes and your live Netlify URL is generated (e.g., `https://thumbnail-intel.netlify.app`):

1. **Health Check:** Load the application homepage in a browser and verify no console errors.
2. **Access Code Verification:** If `APP_ACCESS_CODE` is set, test logging in with the secret passcode.
3. **Research Smoke Test:** Run a sample query (e.g., "how to learn rust") to confirm YouTube Data API returns live competitor cards.
4. **Director Synthesis Test:** Generate thumbnail concepts to confirm Gemini API responds with structured JSON briefs.
5. **Image Synthesis Test:** Generate an image to confirm Cloudflare Workers AI produces a valid 16:9 base64 image.
6. **Evaluator Vision Test:** Trigger thumbnail evaluation to confirm Gemini Multimodal processes the image and returns 0–5 dimension scores.
7. **Canvas Export Test:** Download the final composited thumbnail and verify 1280×720 PNG format and file size (< 2MB).
