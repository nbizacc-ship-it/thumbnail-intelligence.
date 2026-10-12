import { describe, it, expect } from 'vitest';
import { generateTextOverlaySvg, getTextOverlayDataUri } from '../netlify/functions/_shared/text-overlay';

describe('Deterministic Text Overlay Generator', () => {
  it('returns empty string when no text requested', () => {
    const svg = generateTextOverlaySvg({ text: '' });
    expect(svg).toBe('');
  });

  it('generates well-formed SVG with exact text at top-left', () => {
    const svg = generateTextOverlaySvg({
      text: 'real agents',
      placement: 'top-left',
    });

    expect(svg).toContain('<svg');
    expect(svg).toContain('REAL AGENTS');
    expect(svg).toContain('class="thumb-pill"');
    expect(svg).toContain('class="thumb-text"');
    expect(svg).toContain('viewBox="0 0 1280 720"');
  });

  it('safely positions bottom-left text away from the YouTube bottom-right timestamp', () => {
    const svg = generateTextOverlaySvg({
      text: 'PROVEN',
      placement: 'bottom-left',
    });

    expect(svg).toContain('PROVEN');
    // x = 60 (left edge), safe from bottom-right (x > 1000)
    expect(svg).toContain('x="60"');
  });

  it('generates valid data URI for image compositing', () => {
    const uri = getTextOverlayDataUri({ text: 'BENCHMARK' });
    expect(uri.startsWith('data:image/svg+xml;base64,')).toBe(true);
  });
});
