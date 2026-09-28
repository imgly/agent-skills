import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { ImageSize, MeasureImage } from '../../src/imgly/types';
import {
  getImageBlockQuality,
  getOutsideBlocks,
  getPartiallyHiddenTexts
} from '../../src/imgly/utils';
import {
  validateLowResolution,
  validateOutsideBlocks,
  validatePartiallyHiddenTexts,
  validateProtrudingBlocks
} from '../../src/imgly/validation';

const SCENE = fileURLToPath(
  new URL('../../public/assets/example.scene', import.meta.url)
);

let engine: CreativeEngine;

/** Reads the real resolution of the image behind a URL, outside a browser. */
const measureWithSharp: MeasureImage = async (url) => {
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
  const { width, height } = await sharp(bytes).metadata();
  if (width == null || height == null) {
    throw new Error(`Could not measure ${url}.`);
  }
  return { width, height };
};

/** Answers every image with the same size, so the quality ratio is arithmetic. */
function measureAs(size: ImageSize): MeasureImage {
  return async () => size;
}

function newScene(pageWidth = 100, pageHeight = 100): number {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, pageWidth);
  engine.block.setHeight(page, pageHeight);
  engine.block.appendChild(scene, page);
  return page;
}

function addRect(
  page: number,
  x: number,
  y: number,
  width: number,
  height: number
): number {
  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('rect'));
  engine.block.setFill(block, engine.block.createFill('color'));
  engine.block.setPositionX(block, x);
  engine.block.setPositionY(block, y);
  engine.block.setWidth(block, width);
  engine.block.setHeight(block, height);
  engine.block.appendChild(page, block);
  return block;
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

describe('DV-H1 the shipped scene (Qase 1437)', () => {
  beforeEach(async () => {
    await loadScene(engine as unknown as TestEngine, SCENE);
  });

  it('finds the same three problems every time it runs', async () => {
    const run = async () => [
      ...validateOutsideBlocks(engine).map((r) => [
        'outside',
        r.blockId,
        r.state
      ]),
      ...validateProtrudingBlocks(engine).map((r) => [
        'protruding',
        r.blockId,
        r.state
      ]),
      ...validatePartiallyHiddenTexts(engine).map((r) => [
        'hidden',
        r.blockId,
        r.state
      ]),
      ...(await validateLowResolution(engine, measureWithSharp))
        .filter((r) => r.state !== 'success')
        .map((r) => ['lowResolution', r.blockId, r.state])
    ];

    // Bounding boxes are only final once every image and font has loaded;
    // before that one block reads as protruding that is in fact fully off the
    // page. The sidebar waits the same way before its first pass.
    await engine.block.forceLoadResources([engine.scene.get()!]);

    const first = await run();
    expect(first).toEqual([
      ['outside', expect.any(Number), 'failed'],
      ['protruding', expect.any(Number), 'warning'],
      ['lowResolution', expect.any(Number), 'warning']
    ]);
    expect(await run()).toEqual(first);
  });
});

describe('the four checks on a built scene', () => {
  let page: number;

  beforeEach(() => {
    page = newScene();
  });

  it('DV-H2 reports only the block entirely off the page (Qase 1439)', () => {
    addRect(page, 10, 10, 20, 20);
    addRect(page, -10, 10, 20, 20);
    const outside = addRect(page, 500, 500, 20, 20);

    const results = validateOutsideBlocks(engine);

    expect(results).toHaveLength(1);
    expect(results[0].blockId).toBe(outside);
    expect(results[0].state).toBe('failed');
    expect(results[0].blockType).toBe(engine.block.getKind(outside));
  });

  it('DV-H3 reports only the block straddling the edge (Qase 1442)', () => {
    addRect(page, 10, 10, 20, 20);
    const straddling = addRect(page, -10, 10, 20, 20);
    addRect(page, 500, 500, 20, 20);

    const results = validateProtrudingBlocks(engine);

    expect(results.map((result) => result.blockId)).toEqual([straddling]);
    expect(results[0].state).toBe('warning');
  });

  it('DV-H3 leaves a block covering the whole page alone but reports one at 98 %', () => {
    const covering = addRect(page, 0, 0, 100, 100);
    expect(validateProtrudingBlocks(engine)).toEqual([]);

    engine.block.setPositionX(covering, -2);
    expect(
      validateProtrudingBlocks(engine).map((result) => result.blockId)
    ).toEqual([covering]);
  });

  it('DV-H8 returns nothing for an empty page and never throws', async () => {
    expect(validateOutsideBlocks(engine)).toEqual([]);
    expect(validateProtrudingBlocks(engine)).toEqual([]);
    expect(validatePartiallyHiddenTexts(engine)).toEqual([]);
    expect(
      await validateLowResolution(engine, measureAs({ width: 1, height: 1 }))
    ).toEqual([]);
  });
});

describe('DV-H4 partially hidden text', () => {
  let text: number;
  let page: number;

  // A programmatically created text block has no typeface and cannot be
  // intersected, so these cases build on the shipped scene's own text.
  beforeEach(async () => {
    await loadScene(engine as unknown as TestEngine, SCENE);
    page = engine.scene.getPages()[0];
    [text] = engine.block
      .getChildren(page)
      .filter((id) => engine.block.getType(id) === '//ly.img.ubq/text');
    expect(text).toBeDefined();
    // Intersecting a text block needs its font, and each case reloads the
    // scene, so the font is not warm from an earlier one.
    await engine.block.forceLoadResources([text]);
  });

  function coverText(): number {
    const cover = addRect(
      page,
      engine.block.getGlobalBoundingBoxX(text) + 2,
      engine.block.getGlobalBoundingBoxY(text) + 2,
      engine.block.getGlobalBoundingBoxWidth(text) / 2,
      engine.block.getGlobalBoundingBoxHeight(text) / 2
    );
    return cover;
  }

  it('reports the text for an overlapping block above it', () => {
    coverText();

    const results = validatePartiallyHiddenTexts(engine);

    expect(results.map((result) => result.blockId)).toEqual([text]);
    expect(results[0].state).toBe('warning');
    expect(results[0].blockType).toBe(engine.block.getKind(text));
  });

  it('reports nothing for a block beside the text', () => {
    addRect(page, 5000, 5000, 20, 20);

    expect(validatePartiallyHiddenTexts(engine)).toEqual([]);
  });

  it('ignores a group above the text', () => {
    engine.block.group([coverText()]);

    expect(validatePartiallyHiddenTexts(engine)).toEqual([]);
  });

  it('DV-H5 leaves the scene exactly as it found it', () => {
    coverText();
    const before = engine.block.findAll();

    validatePartiallyHiddenTexts(engine);

    expect(engine.block.findAll()).toEqual(before);
    expect(engine.block.findAllSelected()).toEqual([]);
  });
});

describe('DV-H6 image quality (Qase 1443)', () => {
  let image: number;

  beforeEach(() => {
    const page = newScene();
    image = engine.block.create('graphic');
    engine.block.setShape(image, engine.block.createShape('rect'));
    engine.block.setFill(image, engine.block.createFill('image'));
    engine.block.setKind(image, 'image');
    engine.block.setString(
      engine.block.getFill(image),
      'fill/image/imageFileURI',
      'https://example.test/photo.png'
    );
    engine.block.setPositionX(image, 0);
    engine.block.setPositionY(image, 0);
    engine.block.setWidth(image, 100);
    engine.block.setHeight(image, 100);
    engine.block.appendChild(page, image);
  });

  it.each([
    [50, 0.5, 'failed'],
    [85, 0.85, 'warning'],
    [120, 1.2, 'success']
  ])(
    'a %s px source over a 100 px frame is quality %s and reads as %s',
    async (source, quality, state) => {
      const measure = measureAs({ width: source, height: source });

      expect(await getImageBlockQuality(engine, image, measure)).toBeCloseTo(
        quality,
        5
      );
      const [result] = await validateLowResolution(engine, measure);
      expect(result.state).toBe(state);
    }
  );

  it('DV-H7 reports quality 1 when the image cannot be measured (known issue 6)', async () => {
    const failing: MeasureImage = async () => {
      throw new Error('unreachable');
    };
    expect(await getImageBlockQuality(engine, image, failing)).toBe(1);

    engine.block.setString(
      engine.block.getFill(image),
      'fill/image/imageFileURI',
      ''
    );
    expect(
      await getImageBlockQuality(
        engine,
        image,
        measureAs({ width: 1, height: 1 })
      )
    ).toBe(1);
  });
});

describe('DV-H9 design units and crop scale', () => {
  let image: number;

  beforeEach(() => {
    const page = newScene();
    image = engine.block.create('graphic');
    engine.block.setShape(image, engine.block.createShape('rect'));
    engine.block.setFill(image, engine.block.createFill('image'));
    engine.block.setKind(image, 'image');
    engine.block.setString(
      engine.block.getFill(image),
      'fill/image/imageFileURI',
      'https://example.test/photo.png'
    );
    engine.block.setWidth(image, 100);
    engine.block.setHeight(image, 100);
    engine.block.appendChild(page, image);
  });

  it.each([
    ['Millimeter', (100 * 300) / 25.4],
    ['Inch', 100 * 300]
  ])('measures a %s frame in pixels', async (unit, framePixels) => {
    const scene = engine.scene.get()!;
    engine.block.setEnum(scene, 'scene/designUnit', unit);
    engine.block.setFloat(scene, 'scene/dpi', 300);
    // The engine converts the existing dimensions, so restate them in the new
    // unit before measuring.
    engine.block.setWidth(image, 100);
    engine.block.setHeight(image, 100);

    const quality = await getImageBlockQuality(
      engine,
      image,
      measureAs({ width: framePixels, height: framePixels })
    );

    expect(quality).toBeCloseTo(1, 3);
  });

  it('falls back to a crop scale of 1 when the block reports none', async () => {
    engine.block.setCropScaleY(image, 0);

    const quality = await getImageBlockQuality(
      engine,
      image,
      measureAs({ width: 100, height: 100 })
    );

    expect(quality).toBeCloseTo(1, 5);
  });
});

describe('DV-H10 a scene without a page', () => {
  beforeEach(() => {
    const scene = engine.scene.create();
    const text = engine.block.create('text');
    engine.block.setString(text, 'text/text', 'loose');
    engine.block.appendChild(scene, text);
  });

  it('reports no hidden text, and the loose text as outside the page', () => {
    expect(getPartiallyHiddenTexts(engine)).toEqual([]);
    expect(getOutsideBlocks(engine)).toHaveLength(1);
  });
});
