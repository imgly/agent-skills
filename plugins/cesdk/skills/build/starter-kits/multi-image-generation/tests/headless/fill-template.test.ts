import type { CreativeEngine } from '@cesdk/cesdk-js';
import { resolveObjectURL } from 'node:buffer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { fillTemplate } from '../../src/imgly/generation';
import { exportSceneAsImage } from '../../src/imgly/utils';
import SCENES from '../../src/app/scenes.json';
import { createKitEngine, disposeKitEngine, testRestaurant } from './fixtures';

let engine: CreativeEngine;

function fillURI(blockName: string): string {
  const [block] = engine.block.findByName(blockName);
  return engine.block.getString(
    engine.block.getFill(block),
    'fill/image/imageFileURI'
  );
}

function ratingVisibility(): boolean[] {
  return [1, 2, 3, 4, 5].map((star) => {
    const [block] = engine.block.findByName(`Rating${star}`);
    return engine.block.isVisible(block);
  });
}

beforeAll(async () => {
  engine = await createKitEngine();
}, 180_000);

afterAll(disposeKitEngine);

describe('MIG-H1 fillTemplate fills a scene', () => {
  const restaurant = testRestaurant();

  beforeAll(async () => {
    await fillTemplate(engine, SCENES, 'square', restaurant);
  });

  it('sets the three template variables', () => {
    expect(engine.variable.getString('Name')).toBe('Bean there Bean good');
    expect(engine.variable.getString('$$')).toBe('$$');
    expect(engine.variable.getString('Count')).toBe('281');
  });

  it('points the photo and the logo at the restaurant images', () => {
    expect(fillURI('RestaurantPhoto')).toBe(restaurant.photoPath);
    expect(fillURI('RestaurantLogo')).toBe(restaurant.logoPath);
  });

  it('resets the crop and covers the frame for both images', () => {
    for (const name of ['RestaurantPhoto', 'RestaurantLogo']) {
      const [block] = engine.block.findByName(name);
      expect(engine.block.getContentFillMode(block)).toBe('Cover');
      expect(engine.block.getCropScaleX(block)).toBe(1);
      expect(engine.block.getCropScaleY(block)).toBe(1);
    }
  });

  it('paints the white text with the secondary brand colour', () => {
    const [name] = engine.block.findByName('RestaurantName');
    const [color] = engine.block.getTextColors(name) as {
      r: number;
      g: number;
      b: number;
    }[];
    expect(color.r).toBeCloseTo(241 / 255, 5);
    expect(color.g).toBeCloseTo(225 / 255, 5);
    expect(color.b).toBeCloseTo(199 / 255, 5);
  });

  // The end-to-end proof that the variables reached the picture. The engine
  // owns variable substitution; core gap 1 in the plan tracks its own test.
  it('exports a non-empty image of the filled scene', async () => {
    const src = await exportSceneAsImage(engine, 'image/png');
    const blob = resolveObjectURL(src as string);
    expect(blob?.type).toBe('image/png');
    expect(blob!.size).toBeGreaterThan(1000);
  });

  it('fills every template the kit ships', async () => {
    for (const sceneKey of ['square', 'portrait', 'landscape']) {
      await fillTemplate(engine, SCENES, sceneKey, restaurant);
      expect(engine.variable.getString('Name')).toBe(restaurant.name);
      expect(fillURI('RestaurantPhoto')).toBe(restaurant.photoPath);
    }
  });
});

describe('MIG-H2 rating stars', () => {
  it.each([
    [1, [true, false, false, false, false]],
    [5, [true, true, true, true, true]],
    [3, [true, true, true, false, false]],
    [0, [false, false, false, false, false]]
  ])('shows the first %s stars', async (rating, expected) => {
    await fillTemplate(
      engine,
      SCENES,
      'square',
      testRestaurant({ rating: rating as number })
    );
    expect(ratingVisibility()).toEqual(expected);
  });

  it('rejects a rating outside 0 to 5 (known issue 5)', async () => {
    await expect(
      fillTemplate(engine, SCENES, 'square', testRestaurant({ rating: 7 }))
    ).rejects.toThrow();
  });
});

describe('MIG-H3 an unknown scene key', () => {
  it('rejects by name and loads no scene', async () => {
    await fillTemplate(engine, SCENES, 'square', testRestaurant());
    const before = await engine.scene.saveToString();

    await expect(
      fillTemplate(engine, SCENES, 'nope', testRestaurant())
    ).rejects.toThrow('Scene not found: nope');

    expect(await engine.scene.saveToString()).toBe(before);
  });
});
