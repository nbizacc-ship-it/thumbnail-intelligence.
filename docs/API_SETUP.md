# API Setup & Credentials Configuration Guide

**Document Version:** 1.0.0  
**Effective Date:** October 2026  
**Target Environment:** Local Development & Netlify Production Deployment

---

## 1. Overview of Required Services

The AI Thumbnail Intelligence System integrates with three external APIs and one optional access control gate:

| Service | Environment Variable | Purpose | Pricing / Tier |
| :--- | :--- | :--- | :--- |
| **Google Gemini API** | `GEMINI_API_KEY` | Strategic Direction (Director) & Multimodal Audit (Evaluator) | Free tier available / Pay-as-you-go |
| **Cloudflare Workers AI** | `CLOUDFLARE_ACCOUNT_ID`<br>`CLOUDFLARE_API_TOKEN` | High-speed 16:9 Image Generation (`flux-1-schnell`) | Generous free allocation daily |
| **YouTube Data API v3** | `YOUTUBE_API_KEY` | Real-time competitor thumbnail research & metadata | 10,000 free quota units / day |
| **App Security Gate** | `APP_ACCESS_CODE` | *(Optional)* Protects UI and API endpoints during staging / beta | Free (Self-configured) |

---

## 2. Google Gemini API Setup

The Gemini API powers both the **AI Director** (text-based strategic reasoning) and the **Evaluator** (multimodal computer vision inspection).

### Step-by-Step Setup:
1. Navigate to Google AI Studio at [https://aistudio.google.com/](https://aistudio.google.com/) or [https://ai.google.dev/](https://ai.google.dev/).
2. Sign in with your Google account.
3. Click on **"Get API key"** in the left navigation sidebar.
4. Click **"Create API key"** (select an existing Google Cloud project or create a new one).
5. Copy the generated key string (format: `AIzaSy...`).
6. Store this value in your `.env` file as:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

### Recommended Supported Models:
- `gemini-2.5-flash`: Ultra-fast inference with high quality for prompt generation and standard evaluation.
- `gemini-2.5-pro`: Recommended for complex strategic analysis and deep competitive brief generation.

---

## 3. Cloudflare Workers AI Setup

Cloudflare Workers AI runs the state-of-the-art Black Forest Labs `flux-1-schnell` image synthesis model serverlessly with zero cold-start GPU overhead.

### Step 1: Obtain Cloudflare Account ID
1. Log in to the Cloudflare Dashboard at [https://dash.cloudflare.com/](https://dash.cloudflare.com/).
2. If you don't have an account, create a free Cloudflare account.
3. In the right sidebar on your dashboard home page, locate **Account ID**.
4. Copy your 32-character hexadecimal Account ID.
5. Store in `.env`:
   ```env
   CLOUDFLARE_ACCOUNT_ID=your_32_char_account_id_here
   ```

### Step 2: Generate Cloudflare API Token
1. Go to **My Profile** > **API Tokens** (or navigate directly to [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)).
2. Click **"Create Token"**.
3. Scroll down and click **"Create Custom Token"**.
4. Configure the token permissions:
   - **Token Name:** `Thumbnail-Intelligence-Workers-AI`
   - **Permissions:** 
     - Under **Account**, select **Workers AI** and set permission to **Edit** (or **Read** if Edit is not available).
   - **Account Resources:** Include > Specific account > Select your Cloudflare Account.
5. Click **"Continue to summary"** and then **"Create Token"**.
6. Copy the displayed API token immediately.
7. Store in `.env`:
   ```env
   CLOUDFLARE_API_TOKEN=your_generated_cloudflare_token
   ```

### Target Model:
- `@cf/black-forest-labs/flux-1-schnell` (1-step to 4-step ultra-fast diffusion model).

---

## 4. YouTube Data API v3 Setup

The YouTube Data API provides real-time access to competitor video metadata, titles, channel subscriber counts, and high-resolution thumbnail URLs.

### Step-by-Step Setup:
1. Navigate to the Google Cloud Console at [https://console.cloud.google.com/](https://console.cloud.google.com/).
2. Create a new Google Cloud Project (e.g., `youtube-thumbnail-intelligence`).
3. In the search bar at the top, search for **"YouTube Data API v3"** and select it.
4. Click **"Enable"**.
5. Once enabled, navigate to **APIs & Services** > **Credentials**.
6. Click **"+ CREATE CREDENTIALS"** at the top and select **"API key"**.
7. *(Recommended)* Click **"Edit API key"**:
   - Set **API restrictions** to "Restrict key".
   - Select **YouTube Data API v3** only.
8. Copy the API key and store in `.env`:
   ```env
   YOUTUBE_API_KEY=AIzaSy...
   ```

### Quota Limits:
- Google provides a free default quota of **10,000 units per day**.
- A standard video search query consumes ~100 units. This allows approximately 100 deep competitive intelligence sweeps per day under the free tier.

---

## 5. APP_ACCESS_CODE Setup (Optional Security)

To protect your deployed Netlify instance against unauthorized access and API quota consumption:

1. Choose a secure secret passkey (e.g., `SuperSecretCreativePass2026!`).
2. Add to `.env`:
   ```env
   APP_ACCESS_CODE=SuperSecretCreativePass2026!
   ```
3. When configured, users must enter this passcode in the application header or initial welcome prompt to unlock synthesis and research functions. If left empty or omitted, access control is disabled.

---

## 6. Complete Environment Variable Template

Copy the following into your `.env` file at the root of the project:

```env
# -------------------------------------------------------------
# AI Thumbnail Intelligence System - Environment Configuration
# -------------------------------------------------------------

# Google Gemini API (Required for Director and Evaluator)
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudflare Workers AI (Required for Flux-1-Schnell image synthesis)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here

# YouTube Data API v3 (Required for competitor research)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Optional Application Gate Code
APP_ACCESS_CODE=
```
