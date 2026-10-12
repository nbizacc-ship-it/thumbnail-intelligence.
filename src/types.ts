export interface CompetitorVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelId?: string;
  publishedAt: string;
  viewCount?: number;
  likeCount?: number;
  thumbnailUrl: string;
  category?: 'relevant' | 'high_performing';
  selectionRationale?: string;
}

export interface VisualPattern {
  name: string;
  description: string;
  frequency: 'dominant' | 'common' | 'rare';
  effectivenessAnalysis: string;
  examples?: string[];
}

export interface ResearchResult {
  mode: 'youtube_api' | 'manual_research';
  topic: string;
  competitors: CompetitorVideo[];
  patterns: VisualPattern[];
  recommendations: string[];
  limitations: string[];
  observedFacts: string[];
  calculatedMetrics: string[];
  interpretations: string[];
  hypotheses: string[];
  message?: string;
}

export interface ThumbnailConcept {
  id: string;
  conceptName: string;
  viewerPromise: string;
  visualMetaphorOrEvent: string;
  firstReadElement: string;
  supportingContext: string;
  whyItFitsAudience: string;
  evidenceSupportingChoice: string;
  keyRisks: string[];
  uncertainty: string;
  textPlacement?: string;
  textOverlay?: string;
}

export interface CreativeBrief {
  conceptId: string;
  conceptName: string;
  videoPromiseAndAudience: string;
  mainVisualIdea: string;
  primarySubjectAndAction: string;
  secondaryObjectsAndSetting: string;
  compositionAndFraming: string;
  scaleAndViewpoint: string;
  negativeSpaceAndSafeTextArea: string;
  visualMediumAndStyle: string;
  lightingInstructions: string;
  materialAndTexture: string;
  colorPalette: string[];
  exactOnImageWording?: string;
  textPlacement?: string;
  textStyle?: string;
  textDoNotAppear?: string[];
  referenceRole?: string;
  referencePreserveFeatures?: string;
  truthConstraints: string[];
  aspectRatio: string;
  resolutionTarget: string;
  knownProviderLimitations: string[];
}

export interface DirectorOutput {
  promiseStatement: string;
  audienceModel: string;
  concepts: ThumbnailConcept[];
  selectedConceptId: string;
  selectionRationale: string;
  tradeOffs: string;
  creativeBrief: CreativeBrief;
  creativeHypotheses: Array<{
    hypothesis: string;
    confidence: 'high' | 'medium' | 'low';
    falsifier: string;
  }>;
  assumptionsAndUnresolvedConstraints: string[];
  versionIdentifiers: {
    constitution: string;
    model: string;
  };
}

export interface GenerateOutput {
  imageBase64: string;
  imageMimeType: string;
  promptUsed: string;
  width: number;
  height: number;
  aspectRatio: string;
  modelIdentifier: string;
  overlayApplied?: boolean;
  overlayText?: string;
}

export type HardGateStatus = 'PASS' | 'FAIL' | 'UNCERTAIN';
export type GateOutcome = 'PASS' | 'REVISE' | 'REJECT' | 'HUMAN_REVIEW';
export type DecisionBand = 'ELIGIBLE' | 'REVISE' | 'REJECT' | 'HUMAN_REVIEW';

export interface HardGateDetail {
  status: HardGateStatus;
  reason: string;
}

export interface DimensionScore {
  id: string;
  name: string;
  score: number; // 0-5
  maxScore: number; // 5
  rationale: string;
}

export interface EvaluationFinding {
  severity: 'Critical' | 'Major' | 'Moderate' | 'Minor';
  location?: string;
  observation: string;
  baseline: string;
  impact: string;
  correction: string;
}

export interface EvaluationResult {
  rubricVersion: string;
  gateStatus: GateOutcome;
  gates: Record<string, HardGateDetail>;
  dimensionScores: DimensionScore[];
  weightedScore: number;
  decision: DecisionBand;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceExplanation: string;
  findings: EvaluationFinding[];
  revisionBrief: string;
  humanReviewRequired: boolean;
  limitations: string[];
  qualitativeSummary: string;
  initialVisualRead?: string;
  fidelityFindings?: string;
}

export interface SystemHealth {
  status: string;
  system: string;
  version: string;
  timestamp: string;
  configured: {
    gemini: boolean;
    cloudflare: boolean;
    youtube: boolean;
    accessCodeProtection: boolean;
  };
  models: {
    director: string;
    evaluator: string;
    imageGenerator: string;
  };
}
