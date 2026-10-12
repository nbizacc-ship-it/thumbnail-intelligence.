# AI Thumbnail Intelligence System

> **Empirical, research-driven creative direction, generation, adversarial evaluation, and iterative refinement for YouTube thumbnails.**

[![Built with React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![Netlify Functions](https://img.shields.io/badge/Netlify-Serverless-00C7B7.svg)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 1. System Overview

The **AI Thumbnail Intelligence System** is an end-to-end platform that automates high-performance YouTube thumbnail production through **strict separation of authority**. 

Rather than relying on naive single-prompt image generation or generic clickbait templates, the system orchestrates four specialized roles:
1. **Research Analyst:** Collects competitive visual benchmarks via the YouTube Data API.
2. **AI Director:** Reasons through audience psychology, visual perception mechanisms, and channel identity to produce 3 distinct conceptual angles and a rigorous Creative Brief ([AI Director Constitution v1.1](./docs/constitutions/AI_DIRECTOR_CONSTITUTION_v1_1.md)).
3. **Image Generator:** Translates creative briefs into technical prompts for `flux-1-schnell` on Cloudflare Workers AI ([Image Generator Constitution v1.0](./docs/constitutions/IMAGE_GENERATOR_CONSTITUTION_v1_0.md)).
4. **Adversarial Evaluator:** Audits rendered pixels against 7 binary Hard Gates and 10 weighted dimensions on an anchor 0–5 scale ([Evaluator Constitution v1.0](./docs/constitutions/EVALUATOR_CONSTITUTION_v1_0.md) & [Master Evaluation Rubric v1.0](./docs/rubric/EVALUATION_RUBRIC_v1_0.md)).

---

## 2. Request Flow Architecture

```
[1. User Input & Topic Spec]
              │
              ▼
[2. Competitor Intelligence & Benchmarking] (YouTube Data API v3)
              │
              ▼
[3. Strategic Direction & Tri-Concept Generation] (Gemini 3.8 Flash)
              │
              ▼
[4. Precision 16:9 Diffusion Synthesis] (Cloudflare Workers AI flux-1-schnell)
              │
              ▼
[5. Multimodal Adversarial Audit & Gate Checks] (Gemini Vision)
              │
              ▼
[6. Rubric Scoring (0-100) & Revision Routing]
              ├── Score < 85 ──► Automated Prompt Revision Loop
              └── Score >= 85 ─► Approved for Vector Overlay & 1280x720 Export
```

---

## 3. Key Features

- **Constitution-Governed Agents:** System behavior is bound by explicit Markdown constitutions ensuring ethical alignment, zero data fabrication, and anti-hallucination protocols.
- **Hidden Rubric Architecture:** The Evaluator model produces qualitative defect reports without knowing mathematical weights, preventing evaluation gaming.
- **Micro-Canvas Legibility Testing:** Automatic simulation of mobile device feed sizes (160×90 down to 120×67) with luminance contrast checks.
- **Timestamp Protection Guard:** Preserves the bottom-right quadrant to prevent YouTube's video duration badge from obstructing key visual subjects.
- **Dynamic Typography & Vector Layering:** Pure image synthesis is kept 100% text-free; high-contrast titles and badges are applied via interactive client canvas overlays.
- **Demo Mode:** Built-in offline mock mode allowing full UI walkthrough and test runs without burning live API quotas.

---

## 4. Prerequisites

- **Node.js:** `v20.x` or later
- **npm:** `v10.x` or later
- **API Keys:**
  - Google Gemini API Key ([Get Key](https://aistudio.google.com/))
  - Cloudflare Account ID & Workers AI API Token ([Cloudflare Dash](https://dash.cloudflare.com/))
  - YouTube Data API v3 Key ([Google Cloud](https://console.cloud.google.com/))

For step-by-step API setup instructions, see [docs/API_SETUP.md](./docs/API_SETUP.md).

---

## 5. Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/thumbnail-intelligence.git
cd thumbnail-intelligence
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Populate `.env` with your credentials:
```env
GEMINI_API_KEY=AIzaSy...
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
YOUTUBE_API_KEY=AIzaSy...
APP_ACCESS_CODE=optional_secret_code
```

### 3. Launch Development Server
To launch both Vite frontend and Netlify serverless functions emulation:
```bash
npx netlify dev
```
Open [http://localhost:8888](http://localhost:8888) in your browser.

---

## 6. Project Structure

```
thumbnail-intelligence/
├── docs/
│   ├── constitutions/
│   │   ├── AI_DIRECTOR_CONSTITUTION_v1_1.md     # Strategic direction principles
│   │   ├── IMAGE_GENERATOR_CONSTITUTION_v1_0.md # Prompt crafting rules
│   │   └── EVALUATOR_CONSTITUTION_v1_0.md       # Adversarial inspection rules
│   ├── rubric/
│   │   └── EVALUATION_RUBRIC_v1_0.md            # 7 gates & 10 weighted dimensions
│   ├── ARCHITECTURE.md                          # Full system design & contracts
│   ├── API_SETUP.md                             # Step-by-step key acquisition
│   ├── DEPLOYMENT.md                            # Production deployment to Netlify
│   └── TROUBLESHOOTING.md                       # Diagnostic and remediation guide
├── netlify/
│   └── functions/
│       ├── _shared/                             # Backend shared modules
│       │   ├── config.ts                        # Env var reader & access code validation
│       │   ├── schemas.ts                       # Data contracts & TypeScript types
│       │   ├── gemini-client.ts                 # Google GenAI SDK wrapper
│       │   ├── cloudflare-client.ts             # Cloudflare Workers AI REST client
│       │   ├── youtube-client.ts                # YouTube Data API v3 client
│       │   ├── constitutions.ts                 # Constitution text loader
│       │   ├── rubric.ts                        # Scoring engine (server-only)
│       │   ├── prompt-compiler.ts               # Creative brief → image prompt
│       │   ├── text-overlay.ts                  # SVG text overlay generator
│       │   └── logger.ts                        # Structured logging (redacts secrets)
│       ├── health.ts                            # Provider readiness check
│       ├── research.ts                          # YouTube competitor intelligence
│       ├── director.ts                          # Gemini strategic director
│       ├── generate.ts                          # Cloudflare flux-1-schnell synthesis
│       ├── evaluate.ts                          # Gemini multimodal evaluation
│       └── revise.ts                            # Rubric scoring & revision logic
├── src/
│   ├── components/                              # Modular UI widgets (8 components)
│   │   ├── Header.tsx                           # Status bar, demo toggle, access code
│   │   ├── IntakeForm.tsx                       # Project intake with all spec fields
│   │   ├── ResearchView.tsx                     # Competitive research display
│   │   ├── DirectorView.tsx                     # 3-concept display & selection
│   │   ├── GenerationView.tsx                   # Thumbnail preview & text overlay
│   │   ├── EvaluationView.tsx                   # Rubric report & revision controller
│   │   ├── FinalReviewView.tsx                  # Export & audit report download
│   │   └── CanvasRenderer.tsx                   # 1280×720 canvas compositing
│   ├── services/
│   │   └── api.ts                               # API service + demo mode simulator
│   ├── types.ts                                 # Client-side type definitions
│   ├── App.tsx                                  # 6-stage workflow orchestrator
│   ├── main.tsx                                 # React root
│   └── index.css                                # Dark-theme styling
├── tests/                                       # 5 test suites, 21 tests
├── netlify.toml                                 # Netlify build & functions config
├── package.json
└── README.md
```

---

## 7. Demo / Offline Mode

When live API keys are not supplied or when local development offline mode is toggled, the application activates **Demo Mode**:
- Generates realistic synthetic competitor thumbnail grids.
- Simulates Gemini Director concept generation with real case studies.
- Provides sample high-resolution 16:9 renders for evaluation.
- Fully exercises the 10-dimensional rubric calculation and canvas typography overlay tools.

---

## 8. n8n Headless Automation Integration

The system exposes clean REST endpoints via `/.netlify/functions/*` enabling low-code orchestration with n8n:
- **Trigger:** Webhook on video upload or CMS status change.
- **Pipeline:** Automated execution of research -> director -> generate -> evaluate.
- **Notification:** Automatic delivery of eligible thumbnail candidates directly to Slack or Discord.

---

## 9. Important Disclaimers & Ethics

> [!IMPORTANT]
> **What This System Does NOT Claim:**
> 1. **No CTR Guarantees:** Click-Through Rate is a function of algorithmic impression distribution, viewer session history, competing uploads, and topical demand. This system guarantees high visual clarity and communicative alignment, never numerical CTR multipliers.
> 2. **Zero Toxic Clickbait:** The system explicitly forbids deceptive visual framing that promises outcomes absent from the video. Misleading thumbnails harm channel watch time and audience trust.

---

## 10. License

Released under the [MIT License](./LICENSE). Copyright © 2026 AI Thumbnail Intelligence System Contributors.
