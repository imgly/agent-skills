import type { CreativeEngine } from '@cesdk/cesdk-js';
import {
  createTestEngine,
  disposeTestEngine,
  repoRoot
} from '@imgly/kit-test-harness/node';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  PRODUCT_SAMPLES,
  type ProductConfig
} from '../../src/app/product-catalog';
import {
  applyBackdropVariables,
  calculateBlockLayout,
  setupScene,
  type SetupSceneArea
} from '../../src/imgly/plugins/product-scene';
import {
  exportProductAssets,
  setupSceneOptions,
  storeProductMetadata
} from '../../src/app/utils/product';

/**
 * The mockup PNGs mirrored into the examples-data package. Pointing the
 * catalogue's URIs here keeps the run offline.
 */
const LOCAL_ASSETS = pathToFileURL(
  join(
    repoRoot,
    'packages',
    'cesdk-web-examples-data',
    'data',
    'starterkit-t-shirt-designer',
    'assets',
    'products'
  )
).href;

const REMOTE_ASSETS_RE = /^https?:\/\/[^/]+\/.*\/assets\/products/;

const product: ProductConfig = {
  ...PRODUCT_SAMPLES[0],
  areas: PRODUCT_SAMPLES[0].areas.map((area) => ({
    ...area,
    mockup: area.mockup
      ? {
          ...area.mockup,
          images: area.mockup.images?.map((image) => ({
            ...image,
            uri: image.uri.replace(REMOTE_ASSETS_RE, LOCAL_ASSETS)
          }))
        }
      : undefined
  }))
};

function optionsFor(colorId: string) {
  return setupSceneOptions(
    product,
    product.colors.find((color) => color.id === colorId)!
  );
}

function sourceUri(block: number): string {
  const fill = engine.block.getFill(block);
  return engine.block.getSourceSet(fill, 'fill/image/sourceSet')[0].uri;
}

let engine: CreativeEngine;

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

beforeEach(() => {
  const scene = engine.scene.get();
  if (scene != null) {
    engine.block.destroy(scene);
  }
  engine.scene.create('Free');
  // The plugin sets this in `initialize`; the scene builder needs it to swap a
  // page's shape.
  engine.editor.setSetting('page/allowShapeChange', true);
});

describe('TSD-H1 setupScene creates one page per enabled area', () => {
  it('drops the disabled decorations and configures the two pages', () => {
    setupScene(engine, optionsFor('white'));

    const pages = engine.scene.getPages();
    expect(pages.map((page) => engine.block.getName(page))).toEqual([
      'front',
      'back'
    ]);
    expect(engine.scene.getDesignUnit()).toBe('Inch');

    pages.forEach((page) => {
      expect(engine.block.getWidth(page)).toBeCloseTo(20, 5);
      expect(engine.block.getHeight(page)).toBeCloseTo(20, 5);
      expect(engine.block.getStrokeWidth(page)).toBeCloseTo(20 * 0.005, 5);
      expect(engine.block.isStrokeEnabled(page)).toBe(true);
      expect(engine.block.isClipped(page)).toBe(true);
      expect(engine.block.isScopeEnabled(page, 'editor/select')).toBe(false);
      expect(
        engine.block.getColor(engine.block.getFill(page), 'fill/color/value')
      ).toMatchObject({ a: 0 });
    });
  });
});

describe('TSD-H2 backdrop geometry follows the printable area', () => {
  it('sizes the backdrop so the printable area covers the page', () => {
    setupScene(engine, optionsFor('white'));

    const [front] = engine.block.findByName('Backdrop-front');
    expect(engine.block.isVisible(front)).toBe(false);
    expect(engine.block.getKind(front)).toBe('backdrop_image');

    const area = product.areas[0];
    const layout = calculateBlockLayout(area.pageSize.width, {
      images: area.mockup!.images!,
      printableAreaPx: area.mockup!.printableAreaPx
    });
    expect(engine.block.getWidth(front)).toBeCloseTo(layout.width, 4);
    expect(engine.block.getHeight(front)).toBeCloseTo(layout.height, 4);
    expect(engine.block.getPositionX(front)).toBeCloseTo(layout.x, 4);
    expect(engine.block.getPositionY(front)).toBeCloseTo(layout.y, 4);
    expect(sourceUri(front)).toContain('white_front.png');

    const children = engine.block.getChildren(engine.scene.get()!);
    expect(children.slice(0, 2).sort()).toEqual(
      [...engine.block.findByKind('backdrop_image')].sort()
    );
  });
});

describe('TSD-H3 setup destroys pages that are no longer areas', () => {
  it('keeps the decoration pages and removes a hand-added one', () => {
    setupScene(engine, optionsFor('white'));
    const [front] = engine.block.findByName('front');
    const graphic = engine.block.create('graphic');
    engine.block.appendChild(front, graphic);

    const extra = engine.block.create('page');
    engine.block.appendChild(engine.scene.get()!, extra);
    engine.block.setName(extra, 'sleeve');

    setupScene(engine, optionsFor('white'));

    expect(engine.block.isValid(extra)).toBe(false);
    expect(
      engine.scene.getPages().map((page) => engine.block.getName(page))
    ).toEqual(['front', 'back']);
    expect(engine.block.getParent(graphic)).toBe(front);
  });
});

describe('TSD-H4 variables are substituted at setup and by applyVariables', () => {
  it('writes green at setup and swaps it for purple afterwards', () => {
    setupScene(engine, optionsFor('green'));

    const [front] = engine.block.findByName('Backdrop-front');
    const [back] = engine.block.findByName('Backdrop-back');
    expect(sourceUri(front)).toContain('green_front.png');
    expect(sourceUri(back)).toContain('green_back.png');
    expect(sourceUri(front)).not.toContain('{{');

    const [page] = engine.block.findByName('front');
    const config = JSON.parse(
      engine.block.getMetadata(page, 'backdrop_config')
    ) as { images: { uri: string }[] };
    expect(config.images[0].uri).toContain('green_front.png');

    const before = {
      width: engine.block.getWidth(front),
      height: engine.block.getHeight(front),
      x: engine.block.getPositionX(front),
      y: engine.block.getPositionY(front),
      cropScaleX: engine.block.getCropScaleX(front)
    };

    applyBackdropVariables(
      engine,
      { color: 'purple' },
      optionsFor('green').areas as SetupSceneArea[]
    );

    expect(sourceUri(front)).toContain('purple_front.png');
    expect(sourceUri(back)).toContain('purple_back.png');
    expect(engine.block.getWidth(front)).toBeCloseTo(before.width, 5);
    expect(engine.block.getHeight(front)).toBeCloseTo(before.height, 5);
    expect(engine.block.getPositionX(front)).toBeCloseTo(before.x, 5);
    expect(engine.block.getPositionY(front)).toBeCloseTo(before.y, 5);
    expect(engine.block.getCropScaleX(front)).toBeCloseTo(before.cropScaleX, 5);
  });
});

describe('TSD-H5 no page shape is applied', () => {
  it('keeps a rect shape and leaves no orphan behind', () => {
    setupScene(engine, optionsFor('white'));
    const shapesAfterFirstRun = engine.block.findByType(
      '//ly.img.ubq/shape/rect'
    ).length;

    setupScene(engine, optionsFor('white'));

    engine.scene.getPages().forEach((page) => {
      expect(engine.block.getType(engine.block.getShape(page))).toBe(
        '//ly.img.ubq/shape/rect'
      );
    });
    expect(engine.block.findByType('//ly.img.ubq/shape/vector_path')).toEqual(
      []
    );
    expect(engine.block.findByType('//ly.img.ubq/shape/rect').length).toBe(
      shapesAfterFirstRun
    );
  });
});

describe('TSD-H6 the export bundle', () => {
  it('exports one PDF and one 200x200 PNG per page plus the archive', async () => {
    setupScene(engine, optionsFor('white'));
    storeProductMetadata(engine, product, product.colors[0]);

    const { pdfs, thumbnails, archive } = await exportProductAssets(engine);

    expect(Object.keys(pdfs).sort()).toEqual(['back', 'front']);
    Object.values(pdfs).forEach((pdf) =>
      expect(pdf.type).toBe('application/pdf')
    );
    Object.values(thumbnails).forEach((png) =>
      expect(png.type).toBe('image/png')
    );
    expect(archive.size).toBeGreaterThan(0);
    engine.scene
      .getPages()
      .forEach((page) => expect(engine.block.isStrokeEnabled(page)).toBe(true));
  });

  it('restores the page stroke when an export fails', async () => {
    setupScene(engine, optionsFor('white'));
    storeProductMetadata(engine, product, product.colors[0]);
    const pages = engine.scene.getPages();
    const blockApi = engine.block as unknown as {
      export: (block: number, options: { mimeType: string }) => Promise<Blob>;
    };
    const original = blockApi.export.bind(engine.block);
    // Only the page export fails; `saveToArchive` runs before the stroke is
    // disabled and must still succeed.
    blockApi.export = (block, options) =>
      options.mimeType === 'application/pdf'
        ? Promise.reject(new Error('export failed'))
        : original(block, options);

    await expect(exportProductAssets(engine)).rejects.toThrow('export failed');
    blockApi.export = original;

    pages.forEach((page) =>
      expect(engine.block.isStrokeEnabled(page)).toBe(true)
    );
  });
});

describe('TSD-H7 an area that declares a page shape', () => {
  it('replaces the rect shape with the vector path and destroys the old one', () => {
    const base = optionsFor('white');
    const [front] = base.areas;

    setupScene(engine, {
      ...base,
      areas: [
        {
          ...front,
          mockup: {
            ...front.mockup!,
            pageShape: 'M 0 0 L 1 0 L 1 1 L 0 1 Z'
          }
        }
      ]
    });

    const [page] = engine.scene.getPages();
    expect(engine.block.getType(engine.block.getShape(page))).toBe(
      '//ly.img.ubq/shape/vector_path'
    );
    expect(engine.block.findByType('//ly.img.ubq/shape/vector_path')).toEqual([
      engine.block.getShape(page)
    ]);
  });
});
