import { describe, it, expect } from 'vitest';
import { compileImagePrompt } from '../netlify/functions/_shared/prompt-compiler';
import { CreativeBrief } from '../netlify/functions/_shared/schemas';

describe('Prompt Compiler (Image Generator Constitution v1.0)', () => {
  const sampleBrief: CreativeBrief = {
    conceptId: 'concept-1',
    conceptName: 'Artifact Isolation',
    videoPromiseAndAudience: 'Testing high-performance databases',
    mainVisualIdea: 'Single decisive server motherboard glowing under directional light',
    primarySubjectAndAction: 'High-end rack server motherboard in the right foreground',
    secondaryObjectsAndSetting: 'Dim server room background with cable racks',
    compositionAndFraming: 'Right-third placement with low 20-degree camera angle',
    scaleAndViewpoint: 'Macro close-up with shallow depth of field',
    negativeSpaceAndSafeTextArea: 'Left 45% unobstructed dark area',
    visualMediumAndStyle: 'Crisp editorial tech photography',
    lightingInstructions: 'Cool blue key light with amber rim light',
    materialAndTexture: 'Matte black PCB and gold-plated connectors',
    colorPalette: ['#0F172A', '#38BDF8', '#F59E0B'],
    exactOnImageWording: '1M QPS',
    textPlacement: 'top-left',
    textStyle: 'Impact bold white',
    textDoNotAppear: ['random labels', 'distorted text'],
    truthConstraints: ['No fake speed gauges'],
    aspectRatio: '16:9',
    resolutionTarget: '1280x720',
    knownProviderLimitations: [],
  };

  it('compiles specific visual details from brief', () => {
    const prompt = compileImagePrompt(sampleBrief);
    expect(prompt).toContain('High-end rack server motherboard');
    expect(prompt).toContain('Cool blue key light');
    expect(prompt).toContain('Right-third placement');
    expect(prompt).toContain('Left 45% unobstructed dark area');
  });

  it('ENFORCES CONSTITUTIONAL RULE: Does NOT bake exact text into generative prompt', () => {
    const prompt = compileImagePrompt(sampleBrief);
    // Exact text "1M QPS" must NOT appear in the image generation prompt
    expect(prompt).not.toContain('1M QPS');
    expect(prompt).toContain('no text labels');
  });

  it('integrates targeted defect corrections during revision cycle', () => {
    const corrections = [
      'Increase tonal separation between motherboard and dark cables',
      'Ensure left quadrant remains completely free of stray components',
    ];

    const prompt = compileImagePrompt(sampleBrief, corrections);
    expect(prompt).toContain('Correction adjustments:');
    expect(prompt).toContain('Increase tonal separation');
  });

  it('keeps prompt bounded within manageable character limits for Flux Schnell', () => {
    const prompt = compileImagePrompt(sampleBrief);
    expect(prompt.length).toBeLessThanOrEqual(1000);
  });
});
