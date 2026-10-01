import {
  createTestEngine,
  disposeTestEngine
} from '@imgly/kit-test-harness/node';
import type CreativeEngine from '@cesdk/engine';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import ADJUSTMENTS from '../../src/app/AdjustSecondary/Adjustments.json';
import FILTER_MANIFEST from '../../src/app/FilterSecondary/FilterManifest.json';
import { initPhotoEditor } from '../../src/imgly';
import { setupPhotoScene } from '../../src/imgly/photo-scene';

const FILTERS = FILTER_MANIFEST.assets[0].assets;
const PHOTO = 'https://example.invalid/photo.jpg';
const PHOTO_SIZE = { width: 1920, height: 1375 };

let engine: CreativeEngine;

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

describe('PH-H4 initPhotoEditor', () => {
  it('turns the mouse and the page title off and builds the photo scene', async () => {
    await initPhotoEditor(engine, PHOTO, PHOTO_SIZE);

    expect(engine.editor.getSettingBool('mouse/enableScroll')).toBe(false);
    expect(engine.editor.getSettingBool('mouse/enableZoom')).toBe(false);
    expect(engine.editor.getSettingBool('page/title/show')).toBe(false);

    const [page] = engine.block.findByType('page');
    expect(engine.block.getWidth(page)).toBeCloseTo(PHOTO_SIZE.width, 3);
    expect(engine.block.getHeight(page)).toBeCloseTo(PHOTO_SIZE.height, 3);
  });
});

describe('PH-H1 every adjustment key is a real engine property', () => {
  it('resolves and round-trips all 12 keys the kit ships', async () => {
    await setupPhotoScene(engine, PHOTO, PHOTO_SIZE);
    const [page] = engine.block.findByType('page');
    const effect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(page, effect);

    for (const key of Object.keys(ADJUSTMENTS)) {
      const property = `adjustments/${key}`;
      expect(engine.block.getPropertyType(property), key).toBe('Float');
      engine.block.setFloat(effect, property, 0.5);
      expect(engine.block.getFloat(effect, property), key).toBeCloseTo(0.5, 5);
    }
  });

  it('rejects a key the manifest does not have', async () => {
    await setupPhotoScene(engine, PHOTO, PHOTO_SIZE);
    const [page] = engine.block.findByType('page');
    const effect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(page, effect);

    expect(() =>
      engine.block.getFloat(effect, 'adjustments/vibrance')
    ).toThrow();
  });
});

describe('PH-H2 every LUT entry is loadable', () => {
  it('resolves and writes all 61 manifest entries', async () => {
    await setupPhotoScene(engine, PHOTO, PHOTO_SIZE);
    const [page] = engine.block.findByType('page');
    const effect = engine.block.createEffect('lut_filter');
    engine.block.appendEffect(page, effect);

    for (const filter of FILTERS) {
      const uri = engine.editor.defaultURIResolver(
        `ly.img.filter.lut/${filter.lutImage}`
      );
      expect(uri, filter.id).toContain(filter.lutImage);

      engine.block.setString(effect, 'effect/lut_filter/lutFileURI', uri);
      engine.block.setInt(
        effect,
        'effect/lut_filter/horizontalTileCount',
        filter.horizontalTileCount
      );
      engine.block.setInt(
        effect,
        'effect/lut_filter/verticalTileCount',
        filter.verticalTileCount
      );
      expect(
        engine.block.getString(effect, 'effect/lut_filter/lutFileURI'),
        filter.id
      ).toBe(uri);
    }
  });

  it('resolves the thumbnails the filter bar shows', async () => {
    const uri = engine.editor.defaultURIResolver(
      `ly.img.filter/${FILTERS[0].thumbPath}`
    );
    expect(uri).toContain(FILTERS[0].thumbPath);
  });
});

describe('PH-H3 the scene the kit builds', () => {
  it('is one unclipped pixel page carrying the photo as its fill', async () => {
    await setupPhotoScene(engine, PHOTO, PHOTO_SIZE);

    const scene = engine.scene.get()!;
    expect(engine.block.getEnum(scene, 'scene/designUnit')).toBe('Pixel');

    const pages = engine.block.findByType('page');
    expect(pages).toHaveLength(1);
    const [page] = pages;
    expect(engine.block.getWidth(page)).toBe(PHOTO_SIZE.width);
    expect(engine.block.getHeight(page)).toBe(PHOTO_SIZE.height);
    expect(engine.block.getBool(page, 'page/marginEnabled')).toBe(false);
    expect(engine.block.isClipped(page)).toBe(false);

    const fill = engine.block.getFill(page);
    expect(engine.block.getType(fill)).toBe('//ly.img.ubq/fill/image');
    expect(engine.block.getString(fill, 'fill/image/imageFileURI')).toBe(PHOTO);
  });

  it('replaces the scene rather than adding a second page', async () => {
    await setupPhotoScene(engine, PHOTO, PHOTO_SIZE);
    const first = engine.scene.get();

    await setupPhotoScene(engine, PHOTO, { width: 800, height: 600 });

    expect(engine.scene.get()).not.toBe(first);
    expect(engine.block.findByType('page')).toHaveLength(1);
    expect(engine.block.getWidth(engine.block.findByType('page')[0])).toBe(800);
  });

  it('leaves arrangement denied so the photo cannot be dragged off the page', async () => {
    await setupPhotoScene(engine, PHOTO, PHOTO_SIZE);
    expect(engine.editor.getGlobalScope('design/arrange' as never)).toBe(
      'Deny'
    );
  });
});
