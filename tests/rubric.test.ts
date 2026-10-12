import { describe, it, expect } from 'vitest';
import {
  calculateWeightedScore,
  determineGateOutcome,
  getOverallDecision,
  sanitizeEvaluationForClient,
  RUBRIC_DIMENSIONS,
  HARD_GATES_DEF,
} from '../netlify/functions/_shared/rubric';
import { DimensionScore, HardGateDetail, EvaluationFinding, EvaluationResult } from '../netlify/functions/_shared/schemas';

describe('Evaluation Rubric v1.0 Specifications', () => {
  it('has exactly 10 dimensions totaling 100 points', () => {
    expect(RUBRIC_DIMENSIONS).toHaveLength(10);
    const totalWeight = RUBRIC_DIMENSIONS.reduce((sum, d) => sum + d.weight, 0);
    expect(totalWeight).toBe(100);
  });

  it('has all 7 hard gates G1 to G7 defined', () => {
    expect(HARD_GATES_DEF).toHaveLength(7);
    const gateIds = HARD_GATES_DEF.map((g) => g.id);
    expect(gateIds).toEqual(['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']);
  });

  it('calculates weighted score accurately for perfect 5/5 score', () => {
    const perfectScores: DimensionScore[] = RUBRIC_DIMENSIONS.map((d) => ({
      id: d.id,
      name: d.name,
      score: 5,
      maxScore: 5,
      rationale: 'Perfect execution',
    }));

    const score = calculateWeightedScore(perfectScores);
    expect(score).toBe(100);
  });

  it('calculates weighted score accurately for mixed realistic scores', () => {
    // D1 (18): 4/5 -> 14.4
    // D2 (15): 4/5 -> 12.0
    // D3 (13): 4/5 -> 10.4
    // D4 (12): 5/5 -> 12.0
    // D5 (10): 3/5 -> 6.0
    // D6 (10): 4/5 -> 8.0
    // D7 (8):  4/5 -> 6.4
    // D8 (6):  4/5 -> 4.8
    // D9 (5):  4/5 -> 4.0
    // D10 (3): 5/5 -> 3.0
    // Total = 14.4 + 12 + 10.4 + 12 + 6 + 8 + 6.4 + 4.8 + 4 + 3 = 81.0
    const scores: DimensionScore[] = [
      { id: 'D1', name: 'D1', score: 4, maxScore: 5, rationale: '' },
      { id: 'D2', name: 'D2', score: 4, maxScore: 5, rationale: '' },
      { id: 'D3', name: 'D3', score: 4, maxScore: 5, rationale: '' },
      { id: 'D4', name: 'D4', score: 5, maxScore: 5, rationale: '' },
      { id: 'D5', name: 'D5', score: 3, maxScore: 5, rationale: '' },
      { id: 'D6', name: 'D6', score: 4, maxScore: 5, rationale: '' },
      { id: 'D7', name: 'D7', score: 4, maxScore: 5, rationale: '' },
      { id: 'D8', name: 'D8', score: 4, maxScore: 5, rationale: '' },
      { id: 'D9', name: 'D9', score: 4, maxScore: 5, rationale: '' },
      { id: 'D10', name: 'D10', score: 5, maxScore: 5, rationale: '' },
    ];

    const total = calculateWeightedScore(scores);
    expect(total).toBe(81.0);
  });

  it('determines gate outcomes correctly (PASS vs FAIL vs UNCERTAIN)', () => {
    const allPass: Record<string, HardGateDetail> = {
      G1: { status: 'PASS', reason: 'Truthful' },
      G2: { status: 'PASS', reason: 'Relevant' },
      G3: { status: 'PASS', reason: 'Correct text' },
      G4: { status: 'PASS', reason: 'Brand intact' },
      G5: { status: 'PASS', reason: 'Valid file' },
      G6: { status: 'PASS', reason: 'Original' },
      G7: { status: 'PASS', reason: 'Safe' },
    };
    expect(determineGateOutcome(allPass)).toBe('PASS');

    const deceptiveFail: Record<string, HardGateDetail> = {
      ...allPass,
      G1: { status: 'FAIL', reason: 'Deceptive promise' },
    };
    expect(determineGateOutcome(deceptiveFail)).toBe('REJECT');

    const uncertainGate: Record<string, HardGateDetail> = {
      ...allPass,
      G4: { status: 'UNCERTAIN', reason: 'Cannot verify product fidelity' },
    };
    expect(determineGateOutcome(uncertainGate)).toBe('HUMAN_REVIEW');
  });

  it('ENFORCES HARD GATE OVERRIDE: High score NEVER conceals a hard gate failure', () => {
    // 95 out of 100 numeric score, but G1 (Truth and promise) fails!
    const gateOutcome = 'REJECT';
    const findings: EvaluationFinding[] = [
      {
        severity: 'Critical',
        observation: 'Fabricated million dollar check in image',
        baseline: 'G1 Truth and promise',
        impact: 'Deceptive to audience',
        correction: 'Remove fabricated check',
      },
    ];

    const decision = getOverallDecision(95, gateOutcome, findings);
    expect(decision).toBe('REJECT');
  });

  it('assigns decision bands correctly according to Section 8 of Rubric v1.0', () => {
    const noFindings: EvaluationFinding[] = [];
    const minorFindings: EvaluationFinding[] = [
      {
        severity: 'Minor',
        observation: 'Slight shadow edge',
        baseline: 'Craft',
        impact: 'Negligible',
        correction: 'Smooth shadow',
      },
    ];

    // 85-100: Eligible for human review if no critical/major issues
    expect(getOverallDecision(88, 'PASS', noFindings)).toBe('ELIGIBLE');
    expect(getOverallDecision(88, 'PASS', minorFindings)).toBe('ELIGIBLE');

    // 70-84: Targeted revision recommended
    expect(getOverallDecision(76, 'PASS', noFindings)).toBe('REVISE');

    // 50-69: Substantial revision recommended
    expect(getOverallDecision(58, 'PASS', noFindings)).toBe('REVISE');

    // 0-49: Reject
    expect(getOverallDecision(42, 'PASS', noFindings)).toBe('REJECT');
  });

  it('SANITIZATION SAFEGUARD: strips secret weights from client response', () => {
    const rawEval: EvaluationResult = {
      rubricVersion: '1.0.0',
      gateStatus: 'PASS',
      gates: {},
      dimensionScores: [
        { id: 'D1', name: 'Truthfulness', weight: 18, score: 5, maxScore: 5, rationale: 'Truthful' },
        { id: 'D2', name: 'Comprehension', weight: 15, score: 4, maxScore: 5, rationale: 'Clear' },
      ],
      weightedScore: 90,
      decision: 'ELIGIBLE',
      confidence: 'High',
      confidenceExplanation: '',
      findings: [],
      revisionBrief: '',
      humanReviewRequired: false,
      limitations: [],
      qualitativeSummary: '',
    };

    const sanitized = sanitizeEvaluationForClient(rawEval);
    for (const dim of sanitized.dimensionScores) {
      expect(dim.weight).toBeUndefined();
    }
  });
});
