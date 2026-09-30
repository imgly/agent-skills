import chroma from 'chroma-js';
import { describe, expect, it } from 'vitest';

import {
  generateColorAbstractionTokensAccent,
  generateColorAbstractionTokensActive,
  generateColorAbstractionTokensCanvas,
  generateColorAbstractionTokensSurface,
  generateStaticTokens
} from '../../src/imgly/color';

const DARK = '#121A21';
const LIGHT = '#D6DBE1';

function lightness(color: string): number {
  return chroma(color).get('hsl.l');
}

describe('generateColorAbstractionTokensSurface', () => {
  const tokens = generateColorAbstractionTokensSurface(DARK);

  it('returns the twenty documented tokens', () => {
    expect(Object.keys(tokens)).toEqual([
      '--ubq-elevation-1',
      '--ubq-elevation-2',
      '--ubq-elevation-3',
      '--ubq-elevation-1-blur',
      '--ubq-elevation-2-blur',
      '--ubq-elevation-3-blur',
      '--ubq-foreground-default',
      '--ubq-foreground-light',
      '--ubq-foreground-info',
      '--ubq-interactive-default',
      '--ubq-interactive-hover',
      '--ubq-interactive-pressed',
      '--ubq-input-default',
      '--ubq-input-hover',
      '--ubq-border-default',
      '--ubq-stroke-contrast-1',
      '--ubq-stroke-contrast-2',
      '--ubq-focus-outline',
      '--ubq-overlay-default',
      '--ubq-progress'
    ]);
  });

  it('pins the elevations and the focus outline for a dark surface', () => {
    expect(tokens['--ubq-elevation-1']).toBe('hsl(208.7,29.87%,15.1%)');
    expect(tokens['--ubq-elevation-2']).toBe('hsl(208,29.41%,20%)');
    expect(tokens['--ubq-elevation-3']).toBe('hsl(208.42,29.69%,25.1%)');
    expect(tokens['--ubq-elevation-1-blur']).toBe(
      'hsla(208.7,29.87%,15.1%,0.85)'
    );
    expect(tokens['--ubq-focus-outline']).toBe('hsl(208,29.41%,10%)');
  });

  it('raises the elevations above the surface', () => {
    expect(lightness(tokens['--ubq-elevation-3'])).toBeGreaterThan(
      lightness(tokens['--ubq-elevation-1'])
    );
  });

  it('lowers the input colours below the surface', () => {
    const light = generateColorAbstractionTokensSurface(LIGHT);

    expect(lightness(light['--ubq-input-hover'])).toBeLessThan(
      lightness(light['--ubq-input-default'])
    );
  });

  it('clamps the input colours to black when the surface is already dark', () => {
    expect(tokens['--ubq-input-default']).toBe('hsl(0,0%,0%)');
    expect(tokens['--ubq-input-hover']).toBe('hsl(0,0%,0%)');
  });

  it('turns the foreground white on a dark surface and black on a light one', () => {
    expect(tokens['--ubq-foreground-default']).toBe('hsla(0,0%,100%,0.9)');
    expect(
      generateColorAbstractionTokensSurface(LIGHT)['--ubq-foreground-default']
    ).toBe('hsla(0,0%,0%,0.9)');
  });

  it('flips the foreground at the luminance boundary of 0.5', () => {
    const below = chroma('white').luminance(0.49).hex();
    const above = chroma('white').luminance(0.51).hex();

    expect(
      generateColorAbstractionTokensSurface(below)['--ubq-foreground-default']
    ).toBe('hsla(0,0%,100%,0.9)');
    expect(
      generateColorAbstractionTokensSurface(above)['--ubq-foreground-default']
    ).toBe('hsla(0,0%,0%,0.9)');
  });
});

describe('generateColorAbstractionTokensCanvas', () => {
  it('returns the canvas token only, in hsl form', () => {
    expect(generateColorAbstractionTokensCanvas('#242623')).toEqual({
      '--ubq-canvas': 'hsl(100,4.11%,14.31%)'
    });
  });

  it.each(['rgb(36, 38, 35)', 'rebeccapurple'])('accepts %s', (input) => {
    expect(generateColorAbstractionTokensCanvas(input)['--ubq-canvas']).toMatch(
      /^hsl\(/
    );
  });
});

describe('generateColorAbstractionTokensActive', () => {
  const tokens = generateColorAbstractionTokensActive('#5D6266');

  it('returns the six documented tokens', () => {
    expect(Object.keys(tokens)).toEqual([
      '--ubq-foreground-active',
      '--ubq-interactive-active-default',
      '--ubq-interactive-active-hover',
      '--ubq-interactive-active-pressed',
      '--ubq-interactive-selected',
      '--ubq-notice-info'
    ]);
  });

  it('takes the colour as given for the default and the selection', () => {
    expect(tokens['--ubq-interactive-active-default']).toBe(
      'hsl(206.67,4.62%,38.24%)'
    );
    expect(tokens['--ubq-interactive-selected']).toBe(
      tokens['--ubq-interactive-active-default']
    );
  });

  it('lightens on hover and darkens on press', () => {
    expect(lightness(tokens['--ubq-interactive-active-hover'])).toBeGreaterThan(
      lightness(tokens['--ubq-interactive-active-default'])
    );
    expect(lightness(tokens['--ubq-interactive-active-pressed'])).toBeLessThan(
      lightness(tokens['--ubq-interactive-active-default'])
    );
  });
});

describe('generateColorAbstractionTokensAccent', () => {
  const tokens = generateColorAbstractionTokensAccent('#415AD3');

  it('returns the eight documented tokens', () => {
    expect(Object.keys(tokens)).toEqual([
      '--ubq-foreground-accent',
      '--ubq-interactive-accent-default',
      '--ubq-interactive-accent-hover',
      '--ubq-interactive-accent-pressed',
      '--ubq-focus-default',
      '--ubq-notice-warning',
      '--ubq-notice-error',
      '--ubq-notice-success'
    ]);
  });

  it('takes the accent colour as given for the default', () => {
    expect(tokens['--ubq-interactive-accent-default']).toBe(
      'hsl(229.73,62.39%,54.12%)'
    );
  });

  it('keeps each notice colour on its own hue', () => {
    const hue = (color: string) => Math.round(chroma(color).get('hsl.h'));
    expect(hue(tokens['--ubq-notice-warning'])).not.toBe(
      hue(tokens['--ubq-notice-error'])
    );
    expect(hue(tokens['--ubq-notice-success'])).not.toBe(
      hue(tokens['--ubq-notice-error'])
    );
  });

  it('takes chroma and lightness from the accent colour', () => {
    const dark = generateColorAbstractionTokensAccent('#123456');
    const light = generateColorAbstractionTokensAccent('#DDEEFF');
    expect(dark['--ubq-notice-error']).not.toBe(light['--ubq-notice-error']);
    expect(lightness(light['--ubq-notice-error'])).toBeGreaterThan(
      lightness(dark['--ubq-notice-error'])
    );
  });
});

describe('generateStaticTokens', () => {
  it('returns the same eight fixed values on every call', () => {
    const tokens = generateStaticTokens();

    expect(Object.keys(tokens)).toHaveLength(8);
    expect(tokens['--ubq-static-selection-frame']).toBe('hsl(230, 100%, 60%)');
    expect(tokens['--ubq-static-contrast-white']).toBe('hsl(0, 0%, 100%)');
    expect(tokens['--ubq-static-snapping']).toBe('hsl(338, 100%, 50%)');
    expect(tokens).toEqual(generateStaticTokens());
  });
});
