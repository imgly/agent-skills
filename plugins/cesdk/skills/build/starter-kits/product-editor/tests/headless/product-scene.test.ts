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
  type ProductColor,
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
    'starterkit-product-editor',
    'assets',
    'products'
  )
).href;

const REMOTE_ASSETS_RE = /^https?:\/\/[^/]+\/.*\/assets\/products/;

function local(product: ProductConfig): ProductConfig {
  return {
    ...product,
    areas: product.areas.map((area) => ({
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
}

const products = new Map(
  PRODUCT_SAMPLES.map((product) => [product.id, local(product)])
);

function optionsFor(productId: string, colorId = 'white') {
  const product = products.get(productId)!;
  const color =
    product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  return { product, color, options: setupSceneOptions(product, color) };
}

function sourceUri(engine: CreativeEngine, block: number): string {
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
  engine.editor.setSetting('page/allowShapeChange', true);
});

describe('PE-H1 setupScene creates one page per enabled area', () => {
  it('names, sizes, clips and strokes every page', () => {
    const { product, options } = optionsFor('tshirt');
    setupScene(engine, options);

    const pages = engine.scene.getPages();
    expect(pages.map((page) => engine.block.getName(page))).toEqual([
      'front',
      'back'
    ]);
    expect(engine.scene.getDesignUnit()).toBe(product.designUnit);

    pages.forEach((page, index) => {
      const { width, height } = product.areas[index].pageSize;
      expect(engine.block.getWidth(page)).toBeCloseTo(width, 5);
      expect(engine.block.getHeight(page)).toBeCloseTo(height, 5);
      expect(engine.block.isStrokeEnabled(page)).toBe(true);
      expect(engine.block.getStrokeWidth(page)).toBeCloseTo(width * 0.005, 5);
      expect(engine.block.isClipped(page)).toBe(true);
      expect(engine.block.isScopeEnabled(page, 'editor/select')).toBe(false);
      expect(
        engine.block.getColor(engine.block.getFill(page), 'fill/color/value')
      ).toMatchObject({ a: 0 });
    });
  });
});

describe('PE-H2 backdrop geometry follows the printable area', () => {
  it('sizes the backdrop so the printable area covers the page', () => {
    const { product, options } = optionsFor('tshirt');
    setupScene(engine, options);

    const backdrops = engine.block.findByKind('backdrop_image');
    expect(backdrops).toHaveLength(2);

    const [front] = engine.block.findByName('Backdrop-front');
    expect(engine.block.getName(front)).toBe('Backdrop-front');
    expect(engine.block.isVisible(front)).toBe(false);
    const children = engine.block.getChildren(engine.scene.get()!);
    // Every backdrop is inserted at index 0, so the two of them sit in front
    // of the pages in the scene's child list.
    expect(children.slice(0, 2).sort()).toEqual([...backdrops].sort());

    const area = product.areas[0];
    const layout = calculateBlockLayout(area.pageSize.width, {
      images: area.mockup!.images!,
      printableAreaPx: area.mockup!.printableAreaPx
    });
    expect(engine.block.getWidth(front)).toBeCloseTo(layout.width, 4);
    expect(engine.block.getHeight(front)).toBeCloseTo(layout.height, 4);
    expect(engine.block.getPositionX(front)).toBeCloseTo(layout.x, 4);
    expect(engine.block.getPositionY(front)).toBeCloseTo(layout.y, 4);
    expect(sourceUri(engine, front)).toBe(
      area.mockup!.images![0].uri.replace('{{color}}', 'white')
    );
  });
});

describe('PE-H3 page shape follows the area', () => {
  it('clips the arrow sign to its silhouette and resets it for the mug', () => {
    const arrow = optionsFor('arrowsign');
    setupScene(engine, arrow.options);

    const [page] = engine.block.findByName('front');
    const shape = engine.block.getShape(page);
    const area = arrow.product.areas[0];
    expect(engine.block.getType(shape)).toBe('//ly.img.ubq/shape/vector_path');
    expect(engine.block.getString(shape, 'shape/vector_path/path')).toBe(
      area.mockup!.pageShape
    );
    expect(engine.block.getFloat(shape, 'shape/vector_path/width')).toBeCloseTo(
      area.mockup!.printableAreaPx.width,
      4
    );
    expect(
      engine.block.getFloat(shape, 'shape/vector_path/height')
    ).toBeCloseTo(area.mockup!.printableAreaPx.height, 4);

    setupScene(engine, optionsFor('mug').options);

    expect(engine.block.getType(engine.block.getShape(page))).toBe(
      '//ly.img.ubq/shape/rect'
    );
    expect(engine.block.findByType('//ly.img.ubq/shape/vector_path')).toEqual(
      []
    );
  });
});

describe('PE-H4 variables are substituted at setup', () => {
  it('writes the substituted images to the fill and to the page metadata', () => {
    const { product, options } = optionsFor('tshirt', 'black');
    setupScene(engine, options);

    const [front] = engine.block.findByName('Backdrop-front');
    expect(sourceUri(engine, front)).toContain('black_front.png');
    expect(sourceUri(engine, front)).not.toContain('{{');

    const [page] = engine.block.findByName('front');
    const config = JSON.parse(
      engine.block.getMetadata(page, 'backdrop_config')
    ) as {
      images: { uri: string }[];
      printableAreaPx: { width: number };
    };
    expect(config.images[0].uri).toContain('black_front.png');
    expect(config.printableAreaPx).toEqual(
      product.areas[0].mockup!.printableAreaPx
    );
  });
});

describe('PE-H5 re-running setup rebuilds backdrops and reuses pages', () => {
  it('keeps the content and the pages of the previous product', () => {
    setupScene(engine, optionsFor('tshirt').options);
    const [front] = engine.block.findByName('front');
    const graphic = engine.block.create('graphic');
    engine.block.appendChild(front, graphic);

    setupScene(engine, optionsFor('mug').options);

    expect(engine.block.getParent(graphic)).toBe(front);
    expect(engine.block.findByKind('backdrop_image')).toHaveLength(1);
    // The sibling t-shirt kit destroys a page that is no longer an area; this
    // kit keeps it, so content survives a switch back (test plan issue 2).
    expect(engine.block.findByName('back')).toHaveLength(1);
  });
});

describe('PE-H6 applyBackdropVariables swaps the backdrop image only', () => {
  it('leaves geometry and crop untouched', () => {
    const { product, options } = optionsFor('tshirt');
    setupScene(engine, options);
    const [front] = engine.block.findByName('Backdrop-front');
    const before = {
      width: engine.block.getWidth(front),
      height: engine.block.getHeight(front),
      x: engine.block.getPositionX(front),
      y: engine.block.getPositionY(front),
      cropScaleX: engine.block.getCropScaleX(front)
    };

    applyBackdropVariables(
      engine,
      { color: 'red' },
      setupSceneOptions(product, product.colors[0]).areas as SetupSceneArea[]
    );

    expect(sourceUri(engine, front)).toContain('red_front.png');
    expect(engine.block.getWidth(front)).toBeCloseTo(before.width, 5);
    expect(engine.block.getHeight(front)).toBeCloseTo(before.height, 5);
    expect(engine.block.getPositionX(front)).toBeCloseTo(before.x, 5);
    expect(engine.block.getPositionY(front)).toBeCloseTo(before.y, 5);
    expect(engine.block.getCropScaleX(front)).toBeCloseTo(before.cropScaleX, 5);
  });

  it('skips an area with no mockup and an area whose backdrop is gone', () => {
    setupScene(engine, optionsFor('tshirt').options);
    engine.block.destroy(engine.block.findByName('Backdrop-back')[0]);

    expect(() =>
      applyBackdropVariables(engine, { color: 'red' }, [
        { id: 'front', pageSize: { width: 1, height: 1 } },
        { id: 'back', pageSize: { width: 1, height: 1 } } as SetupSceneArea
      ])
    ).not.toThrow();
  });
});

describe('PE-H7 the export bundle', () => {
  async function tshirtSceneWithStalePage(color: ProductColor) {
    const product = products.get('tshirt')!;
    setupScene(engine, setupSceneOptions(product, color));
    storeProductMetadata(engine, product, color);
    // A page left behind by a one-area product the user selected earlier.
    const stale = engine.block.create('page');
    engine.block.appendChild(engine.scene.get()!, stale);
    engine.block.setName(stale, 'sleeve');
    return { product, stale };
  }

  it('exports one PDF and one 200x200 PNG per enabled area', async () => {
    const product = products.get('tshirt')!;
    await tshirtSceneWithStalePage(product.colors[0]);

    const { pdfs, thumbnails, archive } = await exportProductAssets(engine);

    expect(Object.keys(pdfs).sort()).toEqual(['back', 'front']);
    expect(Object.keys(thumbnails).sort()).toEqual(['back', 'front']);
    Object.values(pdfs).forEach((pdf) =>
      expect(pdf.type).toBe('application/pdf')
    );
    Object.values(thumbnails).forEach((png) =>
      expect(png.type).toBe('image/png')
    );
    expect(archive.size).toBeGreaterThan(0);
  });

  it('skips a page that is not an enabled area and restores the stroke', async () => {
    const product = products.get('tshirt')!;
    const { stale } = await tshirtSceneWithStalePage(product.colors[0]);

    const { pdfs } = await exportProductAssets(engine);

    expect(Object.keys(pdfs)).not.toContain('sleeve');
    engine.scene
      .getPages()
      .filter((page) => page !== stale)
      .forEach((page) => expect(engine.block.isStrokeEnabled(page)).toBe(true));
  });

  it('restores the page stroke when an export fails', async () => {
    const product = products.get('tshirt')!;
    await tshirtSceneWithStalePage(product.colors[0]);
    const areaPages = engine.block
      .findByType('page')
      .filter((page) => ['front', 'back'].includes(engine.block.getName(page)));
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

    areaPages.forEach((page) =>
      expect(engine.block.isStrokeEnabled(page)).toBe(true)
    );
  });
});

describe('PE-H8 setupScene without a scene, a mockup or variables', () => {
  const areas: SetupSceneArea[] = [
    { id: 'plain', pageSize: { width: 100, height: 100 } }
  ];

  it('takes an empty image list when the mockup declares none', () => {
    setupScene(engine, {
      areas: [
        {
          id: 'bare',
          pageSize: { width: 100, height: 100 },
          mockup: { printableAreaPx: { x: 0, y: 0, width: 10, height: 10 } }
        }
      ],
      designUnit: 'Pixel',
      variables: { color: 'white' }
    });
    setupScene(engine, {
      areas: [
        {
          id: 'bare',
          pageSize: { width: 100, height: 100 },
          mockup: { printableAreaPx: { x: 0, y: 0, width: 10, height: 10 } }
        }
      ],
      designUnit: 'Pixel'
    });

    expect(engine.block.findByName('bare')).toHaveLength(1);
  });

  it('creates the scene it needs and skips an area with no mockup', () => {
    setupScene(engine, { areas, designUnit: 'Pixel' });

    expect(engine.scene.get()).not.toBeNull();
    expect(engine.block.findByName('plain')).toHaveLength(1);
    expect(engine.block.findByName('Backdrop-plain')).toEqual([]);
  });

  it('takes the mockup images unchanged when no variables are given', () => {
    const { options } = optionsFor('tshirt');

    setupScene(engine, {
      areas: options.areas,
      designUnit: options.designUnit
    });

    const [backdrop] = engine.block.findByName('Backdrop-front');
    expect(sourceUri(engine, backdrop)).toContain('{{color}}');
  });

  it('leaves an area alone when it has no backdrop block', () => {
    const { options } = optionsFor('tshirt');
    setupScene(engine, options);
    engine.block
      .findByName('Backdrop-front')
      .forEach((block) => engine.block.destroy(block));

    expect(() =>
      applyBackdropVariables(engine, { color: 'black' }, options.areas)
    ).not.toThrow();
  });
});
