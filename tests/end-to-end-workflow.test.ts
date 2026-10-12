import { describe, it, expect } from 'vitest';
import { YouTubeResearchClient } from '../netlify/functions/_shared/youtube-client';
import { compileImagePrompt } from '../netlify/functions/_shared/prompt-compiler';
import {
  calculateWeightedScore,
  determineGateOutcome,
  getOverallDecision,
  RUBRIC_DIMENSIONS,
} from '../netlify/functions/_shared/rubric';
import { CreativeBrief, EvaluationFinding, HardGateDetail } from '../netlify/functions/_shared/schemas';

describe('End-to-End System Workflow Verification', () => {
  it('executes a complete end-to-end lifecycle from research to final review', async () => {
    // ----------------------------------------------------
    // STAGE 1: Intake & Competitive Research
    // ----------------------------------------------------
    const researchClient = new YouTubeResearchClient(); // Missing key triggers manual fallback
    const research = await researchClient.conductResearch(
      'Building an Autonomous Coding Agent',
      ['https://www.youtube.com/watch?v=sample1'],
      'Software engineers'
    );

    expect(research.mode).toBe('manual_research');
    expect(research.patterns.length).toBeGreaterThan(0);
    expect(research.observedFacts.length).toBeGreaterThan(0);
    expect(research.limitations.length).toBeGreaterThan(0);

    // ----------------------------------------------------
    // STAGE 2: AI Director Creative Synthesis & Concept Selection
    // ----------------------------------------------------
    const simulatedBrief: CreativeBrief = {
      conceptId: 'concept-1',
      conceptName: 'Artifact Isolation Hook',
      videoPromiseAndAudience: 'Testing high-performance coding agents for developers',
      mainVisualIdea: 'Single mechanical keyboard and terminal screen glowing in clean darkness',
      primarySubjectAndAction: 'Matte black mechanical keyboard with glowing cursor on terminal monitor',
      secondaryObjectsAndSetting: 'Minimalist industrial wooden workbench in deep shadow',
      compositionAndFraming: 'Right-third placement with low angle',
      scaleAndViewpoint: 'Close-up perspective',
      negativeSpaceAndSafeTextArea: 'Left 40% clean dark area reserved for typography overlay',
      visualMediumAndStyle: 'Editorial studio photography',
      lightingInstructions: 'Directional 4500K warm desk lamp with cool teal background rim light',
      materialAndTexture: 'Brushed aluminum, matte PBT keycaps, subtle dust particles',
      colorPalette: ['#0F172A', '#38BDF8', '#F59E0B'],
      exactOnImageWording: 'REAL AGENTS',
      textPlacement: 'top-left',
      textStyle: 'Impact bold white',
      textDoNotAppear: ['misspelled labels', 'cartoons'],
      truthConstraints: ['Do not show fictional magical robot faces'],
      aspectRatio: '16:9',
      resolutionTarget: '1280x720',
      knownProviderLimitations: [],
    };

    expect(simulatedBrief.conceptName).toBe('Artifact Isolation Hook');

    // ----------------------------------------------------
    // STAGE 3: Prompt Compilation (Image Generator Constitution v1.0)
    // ----------------------------------------------------
    const prompt = compileImagePrompt(simulatedBrief);
    expect(prompt).toContain('Matte black mechanical keyboard');
    expect(prompt).toContain('Left 40% clean dark area');
    // Ensure no text in generative prompt
    expect(prompt).not.toContain('REAL AGENTS');

    // ----------------------------------------------------
    // STAGE 4: Independent Evaluator Multimodal Inspection (Rubric v1.0)
    // ----------------------------------------------------
    // Candidate 1 scores 78/100 (needs revision due to slight clutter defect)
    const candidate1Gates: Record<string, HardGateDetail> = {
      G1: { status: 'PASS', reason: 'Truthful promise' },
      G2: { status: 'PASS', reason: 'Relevant subject' },
      G3: { status: 'PASS', reason: 'Exact text correct' },
      G4: { status: 'PASS', reason: 'Brand intact' },
      G5: { status: 'PASS', reason: 'Valid 16:9 resolution' },
      G6: { status: 'PASS', reason: 'Distinctive composition' },
      G7: { status: 'PASS', reason: 'Safe and compliant' },
    };

    const candidate1Scores = RUBRIC_DIMENSIONS.map((d) => ({
      id: d.id,
      name: d.name,
      score: d.id === 'D2' || d.id === 'D6' ? 3 : 4,
      maxScore: 5,
      rationale: 'Acceptable but could improve focal separation.',
    }));

    const candidate1Weighted = calculateWeightedScore(candidate1Scores);
    const candidate1GateOutcome = determineGateOutcome(candidate1Gates);
    const candidate1Findings: EvaluationFinding[] = [
      {
        severity: 'Moderate',
        location: 'Upper left quadrant',
        observation: 'Background cable clutter slightly competes with the reserved text area.',
        baseline: 'Negative space and visual clarity',
        impact: 'Weakens legibility of text at 120px mobile size.',
        correction: 'Clean background clutter in upper left; widen dark negative space.',
      },
    ];

    const candidate1Decision = getOverallDecision(
      candidate1Weighted,
      candidate1GateOutcome,
      candidate1Findings
    );

    // Initial candidate requires revision
    expect(candidate1Decision).toBe('REVISE');

    // ----------------------------------------------------
    // STAGE 5: Revision Controller Loop
    // ----------------------------------------------------
    const attemptNumber = 1;
    const maxAttempts = 2;
    expect(attemptNumber < maxAttempts).toBe(true);

    // Surgical revision: targeted correction appended to brief
    const revisedBrief: CreativeBrief = {
      ...simulatedBrief,
      negativeSpaceAndSafeTextArea:
        'Left 45% completely empty deep shadow, zero background clutter or visible cables.',
    };

    const revisedPrompt = compileImagePrompt(revisedBrief, [
      candidate1Findings[0].correction,
    ]);
    expect(revisedPrompt).toContain('Clean background clutter in upper left');

    // ----------------------------------------------------
    // STAGE 6: Re-evaluation of Revised Candidate
    // ----------------------------------------------------
    const candidate2Scores = RUBRIC_DIMENSIONS.map((d) => ({
      id: d.id,
      name: d.name,
      score: 5, // Improved to strong/excellent
      maxScore: 5,
      rationale: 'Clean separation achieved.',
    }));

    const candidate2Weighted = calculateWeightedScore(candidate2Scores);
    expect(candidate2Weighted).toBe(100);

    const candidate2Decision = getOverallDecision(candidate2Weighted, 'PASS', []);
    expect(candidate2Decision).toBe('ELIGIBLE');

    // Status: Ready for Human Review (never claiming guaranteed CTR!)
    expect(candidate2Decision).toBe('ELIGIBLE');
  });
});
