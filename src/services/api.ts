import {
  ResearchResult,
  DirectorOutput,
  GenerateOutput,
  EvaluationResult,
  SystemHealth,
  CreativeBrief,
} from '../types';

const API_BASE = '/.netlify/functions';

export class ApiService {
  private accessCode?: string;
  private demoMode: boolean = false;

  constructor(accessCode?: string, demoMode: boolean = false) {
    this.accessCode = accessCode;
    this.demoMode = demoMode;
  }

  setAccessCode(code?: string) {
    this.accessCode = code;
  }

  setDemoMode(enabled: boolean) {
    this.demoMode = enabled;
  }

  isDemoMode(): boolean {
    return this.demoMode;
  }

  async checkHealth(): Promise<SystemHealth> {
    try {
      const resp = await fetch(`${API_BASE}/health`);
      if (!resp.ok) {
        throw new Error(`Health check returned HTTP ${resp.status}`);
      }
      return await resp.json();
    } catch (err: any) {
      return {
        status: 'offline',
        system: 'AI Thumbnail Intelligence System',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        configured: {
          gemini: false,
          cloudflare: false,
          youtube: false,
          accessCodeProtection: false,
        },
        models: {
          director: 'gemini-2.5-flash',
          evaluator: 'gemini-2.5-flash',
          imageGenerator: '@cf/black-forest-labs/flux-1-schnell',
        },
      };
    }
  }

  async runResearch(params: {
    topic: string;
    channelUrl?: string;
    competitorUrls?: string[];
    targetAudience?: string;
  }): Promise<ResearchResult> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 1200));
      return getDemoResearch(params.topic, params.targetAudience);
    }

    const resp = await fetch(`${API_BASE}/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, accessCode: this.accessCode }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.message || err.error || `HTTP ${resp.status}`);
    }

    return await resp.json();
  }

  async runDirector(params: {
    videoTitle: string;
    videoDescription?: string;
    targetAudience?: string;
    channelName?: string;
    brandColors?: string;
    visualsToAvoid?: string;
    preferredTone?: string;
    exactThumbnailText?: string;
    researchResult?: ResearchResult;
  }): Promise<DirectorOutput> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 1500));
      return getDemoDirector(params.videoTitle, params.exactThumbnailText);
    }

    const resp = await fetch(`${API_BASE}/director`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, accessCode: this.accessCode }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.message || err.error || `HTTP ${resp.status}`);
    }

    return await resp.json();
  }

  async runGenerate(params: {
    creativeBrief: CreativeBrief;
    previousAttempts?: any[];
  }): Promise<GenerateOutput> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 1800));
      return getDemoGenerate(params.creativeBrief);
    }

    const resp = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, accessCode: this.accessCode }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.message || err.error || `HTTP ${resp.status}`);
    }

    return await resp.json();
  }

  async runEvaluate(params: {
    imageBase64: string;
    creativeBrief: CreativeBrief;
    videoInfo: {
      title: string;
      description?: string;
      targetAudience?: string;
      exactText?: string;
    };
  }): Promise<EvaluationResult> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 1400));
      return getDemoEvaluate(params.videoInfo.title);
    }

    const resp = await fetch(`${API_BASE}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, accessCode: this.accessCode }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.message || err.error || `HTTP ${resp.status}`);
    }

    return await resp.json();
  }

  async runRevise(params: {
    evaluationResult: EvaluationResult;
    creativeBrief: CreativeBrief;
    attemptNumber: number;
    maxAttempts?: number;
  }): Promise<any> {
    if (this.demoMode) {
      await new Promise((r) => setTimeout(r, 1200));
      return {
        status: 'revised',
        revisedBrief: {
          ...params.creativeBrief,
          compositionAndFraming:
            params.creativeBrief.compositionAndFraming +
            ' (Revised: widened left safe zone, enhanced contrast on focal object)',
          lightingInstructions: 'Increased directional rim light by 25% to maximize foreground separation.',
        },
        targetedCorrections: [
          'Increased separation between main focal object and background texture.',
          'Cleared unobstructed safe area on the left for exact text overlay.',
        ],
        nextAttemptNumber: params.attemptNumber + 1,
        message: `Revision attempt ${params.attemptNumber + 1} prepared with targeted defect corrections.`,
      };
    }

    const resp = await fetch(`${API_BASE}/revise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, accessCode: this.accessCode }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.message || err.error || `HTTP ${resp.status}`);
    }

    return await resp.json();
  }
}

// Deterministic SVG generator for demo preview image (16:9 1024x576)
function generateDemoThumbnailSvg(title: string, color: string = '#1E293B'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576" viewBox="0 0 1024 576">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="60%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0284C7" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#EF4444" stop-opacity="0.2" />
      </linearGradient>
    </defs>
    <rect width="1024" height="576" fill="url(#bg)" />
    <circle cx="720" cy="288" r="210" fill="url(#glow)" filter="blur(20px)" />
    <circle cx="720" cy="288" r="160" fill="#3B82F6" stroke="#93C5FD" stroke-width="8" opacity="0.9" />
    <polygon points="720,160 820,360 620,360" fill="#F8FAFC" opacity="0.85" />
    <rect x="60" y="40" width="380" height="496" rx="20" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    <text x="80" y="90" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#38BDF8">AI THUMBNAIL DEMO PREVIEW</text>
    <text x="80" y="130" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">${title.slice(0, 24)}</text>
    <text x="80" y="180" font-family="system-ui, sans-serif" font-size="16" fill="#94A3B8">High Subject-Background Contrast</text>
    <text x="80" y="210" font-family="system-ui, sans-serif" font-size="16" fill="#94A3B8">Reserved Left Zone for Overlay</text>
    <text x="80" y="500" font-family="system-ui, sans-serif" font-size="14" fill="#64748B">[DEMO MODE CANDIDATE]</text>
  </svg>`;
  return btoa(svg);
}

function getDemoResearch(topic: string, targetAudience?: string): ResearchResult {
  return {
    mode: 'manual_research',
    topic,
    competitors: [
      {
        id: 'comp-1',
        title: `How Top Creators Dominate ${topic}`,
        channelTitle: 'Tech Creator Lab',
        publishedAt: '2026-09-15T12:00:00Z',
        viewCount: 425000,
        thumbnailUrl: '',
        category: 'relevant',
        selectionRationale: 'High public view proxy in exact topical niche.',
      },
      {
        id: 'comp-2',
        title: `The Truth About ${topic} (Nobody Tells You)`,
        channelTitle: 'Insight Breakdown',
        publishedAt: '2026-08-20T10:00:00Z',
        viewCount: 280000,
        thumbnailUrl: '',
        category: 'relevant',
        selectionRationale: 'Close topical match with curiosity hook.',
      },
      {
        id: 'comp-3',
        title: `${topic}: 3 Mistakes Everyone Makes`,
        channelTitle: 'Studio Guide',
        publishedAt: '2026-10-01T14:00:00Z',
        viewCount: 154000,
        thumbnailUrl: '',
        category: 'high_performing',
        selectionRationale: 'Recent upload exhibiting rapid early view growth proxy.',
      },
    ],
    patterns: [
      {
        name: 'Single Decisive Focal Subject',
        description: 'Primary subject occupies 40-50% of the frame with high tonal isolation.',
        frequency: 'dominant',
        effectivenessAnalysis: 'Maximizes mobile browse readability at 120px scale.',
      },
      {
        name: 'Curiosity Tension without Clickbait',
        description: 'Visual question mark or before-and-after contrast.',
        frequency: 'common',
        effectivenessAnalysis: 'Builds qualified interest aligned with actual video content.',
      },
    ],
    recommendations: [
      'Maintain strong subject-to-backdrop separation using directional rim lighting.',
      'Leave unobstructed negative space on the left side for exact text rendering.',
      'Never fabricate extreme claims not present in the video.',
    ],
    limitations: [
      'Demo Mode: Simulated public competitor reference data.',
      'Public view counts are imperfect proxies for private CTR.',
    ],
    observedFacts: [
      `3 reference competitor thumbnails analyzed for topic "${topic}".`,
      'Dominant composition relies on left-third negative space.',
    ],
    calculatedMetrics: ['Average public view proxy: 286,333 views across references.'],
    interpretations: [
      `Audience (${targetAudience || 'Core Enthusiasts'}) responds to concrete evidence over exaggerated expressions.`,
    ],
    hypotheses: [
      'A clean, high-contrast composition will outperform cluttered multi-object competitors.',
    ],
    message: 'Demo mode active. Showing simulated evidence-based competitive research.',
  };
}

function getDemoDirector(videoTitle: string, exactText?: string): DirectorOutput {
  return {
    promiseStatement: `Deliver genuine, verifiable insight on "${videoTitle}" with high visual clarity and zero deception.`,
    audienceModel:
      'Curious, discerning viewers seeking practical clarity without sensationalized hype or false promises.',
    concepts: [
      {
        id: 'concept-1',
        conceptName: 'Decisive Artifact Isolation',
        viewerPromise: 'Showcases the core breakthrough device under dramatic directional desk lighting.',
        visualMetaphorOrEvent: 'A single decisive object illuminated while surrounding clutter fades into deep shadow.',
        firstReadElement: 'High-contrast focal subject in the right third of the frame.',
        supportingContext: 'Subtle blueprint and warm workbench atmosphere.',
        whyItFitsAudience: 'Speaks directly to technical credibility and focused problem-solving.',
        evidenceSupportingChoice:
          'Observed competitor pattern where single-object thumbnails outperformed cluttered scenes by 30% in public view proxy.',
        keyRisks: ['May feel too understated if lighting contrast is insufficient.'],
        uncertainty: 'Real audience reaction requires YouTube Test & Compare validation.',
        textPlacement: exactText ? 'top-left' : 'none',
        textOverlay: exactText || '',
      },
      {
        id: 'concept-2',
        conceptName: 'The Real Contrast (Before vs After)',
        viewerPromise: 'Shows the stark, tangible transformation delivered by following the video.',
        visualMetaphorOrEvent: 'A split-screen or dual-lighting contrast between old chaos and refined clarity.',
        firstReadElement: 'The vivid division line separating problem and solution.',
        supportingContext: 'Grounded physical setting with realistic materials.',
        whyItFitsAudience: 'Immediate visual proof of the transformation promise.',
        evidenceSupportingChoice:
          'Problem/result contrast is an established category convention that drives qualified click intention.',
        keyRisks: ['Can look cluttered if both sides contain too many elements.'],
        uncertainty: 'Balancing two halves at small mobile viewports can reduce legibility.',
        textPlacement: exactText ? 'center-left' : 'none',
        textOverlay: exactText || '',
      },
      {
        id: 'concept-3',
        conceptName: 'The Surprising Scale Discrepancy',
        viewerPromise: 'Demonstrates an unexpected physical scale or metric difference.',
        visualMetaphorOrEvent: 'Unexpected juxtaposition of two related items demonstrating the central claim.',
        firstReadElement: 'The scale discrepancy between foreground and background.',
        supportingContext: 'Clean studio background with subtle cool ambient fill.',
        whyItFitsAudience: 'Sparks goal-directed curiosity without sensationalism.',
        evidenceSupportingChoice: 'Creates visual cognitive dissonance anchored in real video content.',
        keyRisks: ['Requires precise perspective rendering.'],
        uncertainty: 'Diffusion models sometimes struggle with consistent object geometry.',
        textPlacement: exactText ? 'top-left' : 'none',
        textOverlay: exactText || '',
      },
    ],
    selectedConceptId: 'concept-1',
    selectionRationale:
      'Concept 1 ("Decisive Artifact Isolation") maximizes rapid mobile comprehension, perfectly fits the creator tone, and leaves clean negative space for exact text overlay.',
    tradeOffs:
      'Sacrifices the dynamic dual-state comparison of Concept 2 in exchange for cleaner focal hierarchy and superior small-screen legibility.',
    creativeBrief: {
      conceptId: 'concept-1',
      conceptName: 'Decisive Artifact Isolation',
      videoPromiseAndAudience: `Clear, compelling insight on "${videoTitle}" for discerning viewers.`,
      mainVisualIdea: 'Single decisive subject under crisp directional illumination.',
      primarySubjectAndAction:
        'A sleek, weathered metal device sitting prominently in the right-center foreground with glowing status indicators.',
      secondaryObjectsAndSetting:
        'A dark, minimal wooden workbench in the background with subtle technical instruments out of focus.',
      compositionAndFraming:
        'Subject placed in the right third; camera at a 25-degree low angle; clean negative space preserved on the entire left third.',
      scaleAndViewpoint: 'Close-up macro shot with shallow depth of field (f/2.8).',
      negativeSpaceAndSafeTextArea: 'Left 40% of the canvas reserved completely clean with dark gradient backdrop.',
      visualMediumAndStyle: 'Crisp editorial product photography with grounded, realistic textures and natural shadows.',
      lightingInstructions:
        'Strong warm key light from top-right with cool cyan rim light separating the subject from the dark background.',
      materialAndTexture: 'Matte anodized aluminum, micro-scratches, frosted glass lens, warm wood grain.',
      colorPalette: ['#0F172A', '#0284C7', '#F59E0B', '#F8FAFC'],
      exactOnImageWording: exactText || '',
      textPlacement: exactText ? 'top-left' : 'none',
      textStyle: 'Bold condensed sans-serif, high contrast white with dark backing pill.',
      textDoNotAppear: ['misspelled words', 'random UI badges', 'watermarks'],
      referenceRole: 'Preserve realistic proportions and avoid generic AI plastic smoothness.',
      referencePreserveFeatures: 'Sharp mechanical edges and natural material reflections.',
      truthConstraints: [
        'Do not show fictional magical glowing effects not present in the video.',
        'Do not fabricate unreal prizes or misleading outcomes.',
      ],
      aspectRatio: '16:9',
      resolutionTarget: '1280x720',
      knownProviderLimitations: [
        'Image diffusion models cannot reliably spell custom text; exact text rendered via deterministic overlay.',
      ],
    },
    creativeHypotheses: [
      {
        hypothesis: 'Tonal contrast between subject and background directs visual attention within 200ms.',
        confidence: 'high',
        falsifier: 'Eyetracking or mobile preview testing showing eye wandering to background elements.',
      },
      {
        hypothesis: 'Restrained composition conveys premium authority compared to oversaturated competitor thumbnails.',
        confidence: 'medium',
        falsifier: 'Audience testing showing preference for contextual multi-subject framing.',
      },
    ],
    assumptionsAndUnresolvedConstraints: [
      'Assumed video focuses on practical craftsmanship rather than celebrity reactions.',
      'Exact text placement verified safe from YouTube bottom-right duration chip.',
    ],
    versionIdentifiers: {
      constitution: 'AI_DIRECTOR_CONSTITUTION_v1_1',
      model: 'gemini-2.5-flash (Demo Mode Simulation)',
    },
  };
}

function getDemoGenerate(brief: CreativeBrief): GenerateOutput {
  const base64 = generateDemoThumbnailSvg(brief.mainVisualIdea || 'Thumbnail Candidate');
  return {
    imageBase64: base64,
    imageMimeType: 'image/svg+xml',
    promptUsed:
      'A sleek weathered metal device sitting prominently in the right-center foreground with glowing status indicators. Environment: dark minimal wooden workbench. Lighting: strong warm key light from top-right. Composition reserve: Left 40% clean negative space. Style: crisp editorial photography.',
    width: 1024,
    height: 576,
    aspectRatio: '16:9',
    modelIdentifier: '@cf/black-forest-labs/flux-1-schnell (Demo Mode)',
    overlayApplied: Boolean(brief.exactOnImageWording),
    overlayText: brief.exactOnImageWording || undefined,
  };
}

function getDemoEvaluate(title: string): EvaluationResult {
  return {
    rubricVersion: '1.0.0',
    gateStatus: 'PASS',
    gates: {
      G1: { status: 'PASS', reason: 'Image represents the video promise without fabricating false claims.' },
      G2: { status: 'PASS', reason: 'Focal subject is directly relevant to stated topic.' },
      G3: { status: 'PASS', reason: 'Exact text overlay correctly spelled and placed in safe zone.' },
      G4: { status: 'PASS', reason: 'No unverified brand claims or identity alteration.' },
      G5: { status: 'PASS', reason: 'Valid 16:9 format at proper resolution.' },
      G6: { status: 'PASS', reason: 'Distinctive visual angle; does not duplicate competitor composition.' },
      G7: { status: 'PASS', reason: 'No platform compliance or safety issues detected.' },
    },
    dimensionScores: [
      { id: 'D1', name: 'Truthfulness and video-promise alignment', score: 5, maxScore: 5, rationale: 'Accurately communicates core content without sensationalizing.' },
      { id: 'D2', name: 'Immediate comprehension and focal hierarchy', score: 4, maxScore: 5, rationale: 'Clear first-read focal subject in right third.' },
      { id: 'D3', name: 'Audience and niche fit', score: 4, maxScore: 5, rationale: 'Matches expectations of discerning viewers.' },
      { id: 'D4', name: 'Small-size legibility and text correctness', score: 5, maxScore: 5, rationale: 'High contrast text pill clearly readable at 120px.' },
      { id: 'D5', name: 'Distinctiveness and competitive differentiation', score: 4, maxScore: 5, rationale: 'Stands out against noisy, crowded competitor thumbnails.' },
      { id: 'D6', name: 'Composition and visual clarity', score: 4, maxScore: 5, rationale: 'Strong balance and clear negative space.' },
      { id: 'D7', name: 'Relevant curiosity and emotional appeal', score: 4, maxScore: 5, rationale: 'Creates genuine intrigue without cheap trickery.' },
      { id: 'D8', name: 'Brand and reference fidelity', score: 4, maxScore: 5, rationale: 'Respects tone guidelines.' },
      { id: 'D9', name: 'Technical rendering quality', score: 4, maxScore: 5, rationale: 'Clean edges and natural lighting interaction.' },
      { id: 'D10', name: 'Adherence to the approved creative brief', score: 5, maxScore: 5, rationale: 'Follows brief layout, lighting, and safe text specifications.' },
    ],
    weightedScore: 86.8,
    decision: 'ELIGIBLE',
    confidence: 'High',
    confidenceExplanation: 'Multi-point inspection confirms brief fidelity and legibility.',
    findings: [
      {
        severity: 'Minor',
        location: 'Bottom edge',
        observation: 'Slight shadow falloff near the lower edge could have slightly higher fill.',
        baseline: 'Visual clarity and lighting instructions',
        impact: 'Does not impair comprehension; minor aesthetic polish item.',
        correction: 'Increase ambient fill light by 10% in secondary pass if desired.',
      },
    ],
    revisionBrief: 'Candidate passes all hard gates and achieves 86.8/100. Eligible for human review.',
    humanReviewRequired: false,
    limitations: [
      'Demo Mode evaluation result.',
      'Rubric measures brief compliance and design quality; actual audience CTR requires YouTube Test & Compare.',
    ],
    qualitativeSummary:
      'Candidate successfully implements "Decisive Artifact Isolation" concept. High contrast, immediate mobile readability, truthful promise alignment, and zero deceptive claims.',
    initialVisualRead: 'An intriguing, high-tech device under crisp directional light with clean text on the left.',
    fidelityFindings: 'Faithfully implements the approved creative brief specifications.',
  };
}
