import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_MESSAGE,
  ITUNES_SEARCH_API,
  PRESET_COLORS
} from '../../src/app/constants';

const CUSTOMIZATION_PANEL = readFileSync(
  fileURLToPath(
    new URL(
      '../../src/app/CustomizationPanel/CustomizationPanel.tsx',
      import.meta.url
    )
  ),
  'utf8'
);

// ADG-U3 — the shipped defaults.
describe('PRESET_COLORS', () => {
  it('offers eight unique six-digit hex colours', () => {
    expect(PRESET_COLORS).toHaveLength(8);
    expect(new Set(PRESET_COLORS).size).toBe(8);
    for (const color of PRESET_COLORS) {
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it('includes the default background colour', () => {
    expect(PRESET_COLORS).toContain(DEFAULT_BACKGROUND_COLOR);
  });
});

describe('DEFAULT_MESSAGE', () => {
  it('matches the Message input placeholder the panel renders', () => {
    const placeholder = CUSTOMIZATION_PANEL.match(/placeholder="([^"]+)"/)?.[1];

    expect(placeholder).toBe(DEFAULT_MESSAGE);
  });
});

describe('ITUNES_SEARCH_API', () => {
  it('points at the public iTunes search endpoint', () => {
    expect(ITUNES_SEARCH_API).toBe('https://itunes.apple.com/search');
  });
});
