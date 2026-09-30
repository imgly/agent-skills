import { describe, expect, it } from 'vitest';

import { RESTAURANTS } from '../../src/app/restaurant-catalog';
import { TEMPLATES } from '../../src/app/template-catalog';
import SCENES from '../../src/app/scenes.json';

const HEX = /^#[0-9a-f]{6}$/i;

describe('MIG-U2 RESTAURANTS', () => {
  it('ships the three demo restaurants in catalog order', () => {
    expect(RESTAURANTS.map((restaurant) => restaurant.name)).toEqual([
      'Bean there Bean good',
      'Scoop there it is',
      'BUN intended'
    ]);
  });

  it.each([
    ['rating', [1, 5, 3]],
    ['price', ['$$', '$', '$$$']],
    ['reviewCount', [281, 114, 65]]
  ])('carries the documented %s values', (field, expected) => {
    expect(RESTAURANTS.map((r) => r[field as 'price'])).toEqual(expected);
  });

  it('gives every restaurant two six-digit brand colours', () => {
    for (const restaurant of RESTAURANTS) {
      expect(restaurant.primaryColor).toMatch(HEX);
      expect(restaurant.secondaryColor).toMatch(HEX);
      expect(restaurant.primaryColor).not.toBe(restaurant.secondaryColor);
    }
  });

  it('gives every restaurant a photo, a logo and a card image', () => {
    for (const restaurant of RESTAURANTS) {
      for (const path of [
        restaurant.photoPath,
        restaurant.logoPath,
        restaurant.cardPath
      ]) {
        expect(path).toMatch(/\/images\/[a-z-]+\.png$/);
      }
    }
  });

  it('resolves every image against one demo asset base', () => {
    const bases = new Set(
      RESTAURANTS.map((r) => r.photoPath.replace(/\/images\/.*$/, ''))
    );
    expect(bases.size).toBe(1);
  });
});

describe('MIG-U2 TEMPLATES', () => {
  it('ships Square, Portrait and Landscape', () => {
    expect(Object.keys(TEMPLATES)).toEqual(['Square', 'Portrait', 'Landscape']);
  });

  it.each([
    ['Square', 'square', 240, 240],
    ['Portrait', 'portrait', 200, 280],
    ['Landscape', 'landscape', 280, 200]
  ])('describes %s', (key, sceneKey, width, height) => {
    const template = TEMPLATES[key as string];
    expect(template).toMatchObject({
      label: key,
      sceneKey,
      width,
      height,
      outputFormat: 'image/png'
    });
  });

  it('points every sceneKey at a scene the kit ships', () => {
    for (const template of Object.values(TEMPLATES)) {
      expect(Object.keys(SCENES)).toContain(template.sceneKey);
      expect(
        (SCENES as Record<string, string>)[template.sceneKey].length
      ).toBeGreaterThan(0);
    }
  });

  it('gives every template its own preview image', () => {
    const previews = Object.values(TEMPLATES).map((t) => t.previewImagePath);
    expect(new Set(previews).size).toBe(previews.length);
  });
});
