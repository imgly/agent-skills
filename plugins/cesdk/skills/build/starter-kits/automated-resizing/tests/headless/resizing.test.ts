import {
  createTestEngine,
  disposeTestEngine,
  readPngSize,
  repoRoot
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { resize } from '../../src/imgly/resizing';
import { DEFAULT_SIZES } from '../../src/imgly/sizes';
import type { VariantBlob } from '../../src/imgly/types';

const LFS_POINTER_PREFIX = 'version https://git-lfs.github.com/spec/v1';
const SHIPPED_TEMPLATE = join(
  repoRoot,
  'packages/cesdk-web-examples-data/data/starterkit-automated-resizing/example-1.scene'
);

let engine: CreativeEngine;
let sourceScene: string;

/**
 * The demo templates live in git-LFS. An unmaterialized pointer stub is a
 * 131-byte text file, which would fail deep inside the engine.
 */
function readTemplate(path: string): string {
  const contents = readFileSync(path, 'utf8');
  if (contents.startsWith(LFS_POINTER_PREFIX)) {
    throw new Error(
      `${path} is an unmaterialized git-LFS pointer. Run: git lfs pull -X '' ` +
        `-I 'packages/cesdk-web-examples-data/data/starterkit-automated-resizing/**'`
    );
  }
  return contents;
}

/** A square scene with one page and one coloured graphic, built in the engine. */
async function createSquareScene(): Promise<string> {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1080);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(scene, page);

  const graphic = engine.block.create('graphic');
  engine.block.setShape(graphic, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    r: 0.2,
    g: 0.4,
    b: 0.9,
    a: 1
  });
  engine.block.setFill(graphic, fill);
  engine.block.setWidth(graphic, 540);
  engine.block.setHeight(graphic, 540);
  engine.block.setPositionX(graphic, 270);
  engine.block.setPositionY(graphic, 270);
  engine.block.appendChild(page, graphic);

  return engine.scene.saveToString();
}

async function pageSizeOf(sceneString: string): Promise<[number, number]> {
  await engine.scene.load(sceneString);
  const [page] = engine.scene.getPages();
  return [
    Math.round(engine.block.getWidth(page)),
    Math.round(engine.block.getHeight(page))
  ];
}

async function bytesOf(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * What the currently loaded scene looks like. A scene string is not
 * byte-stable across a save / load round trip, so the restore assertions
 * compare the structure the caller can observe instead.
 */
function describeLoadedScene(): unknown {
  return engine.scene.getPages().map((page) => ({
    width: Math.round(engine.block.getWidth(page)),
    height: Math.round(engine.block.getHeight(page)),
    children: engine.block
      .getChildren(page)
      .map((child) => engine.block.getType(child))
  }));
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
  sourceScene = await createSquareScene();
}, 180_000);

afterAll(() => {
  disposeTestEngine();
});

beforeEach(async () => {
  await engine.scene.load(sourceScene);
});

describe('resize', () => {
  it('returns one variant per size, in preset order', async () => {
    const variants = await resize({
      engine,
      sizes: DEFAULT_SIZES,
      scene: sourceScene
    });

    expect(variants).toHaveLength(DEFAULT_SIZES.length);
    expect(variants.map((variant) => variant.size.id)).toEqual(
      DEFAULT_SIZES.map((size) => size.id)
    );
    for (const variant of variants) {
      expect(variant.blob.size).toBeGreaterThan(0);
      await expect(engine.scene.load(variant.sceneString)).resolves.toEqual(
        expect.any(Number)
      );
    }
  });

  it('gives each variant the requested page size', async () => {
    const variants = await resize({
      engine,
      sizes: DEFAULT_SIZES,
      scene: sourceScene
    });

    const sizes: [number, number][] = [];
    for (const variant of variants) {
      sizes.push(await pageSizeOf(variant.sceneString));
    }

    expect(sizes).toEqual([
      [1080, 1920],
      [1080, 1350],
      [1200, 675],
      [1200, 630]
    ]);
  });

  it('exports each variant at the requested pixel size', async () => {
    const variants = await resize({
      engine,
      sizes: DEFAULT_SIZES.slice(0, 2),
      scene: sourceScene
    });

    expect(readPngSize(await bytesOf(variants[0].blob))).toEqual({
      width: 1080,
      height: 1920
    });
    expect(readPngSize(await bytesOf(variants[1].blob))).toEqual({
      width: 1080,
      height: 1350
    });
  });

  it('reports progress once per variant, with the variant just produced', async () => {
    const calls: [number, number, string][] = [];

    const variants = await resize({
      engine,
      sizes: DEFAULT_SIZES,
      scene: sourceScene,
      onProgress: (completed, total, variant: VariantBlob) => {
        calls.push([completed, total, variant.size.id]);
      }
    });

    expect(calls).toEqual([
      [1, 4, 'ig-story'],
      [2, 4, 'ig-post-4-5'],
      [3, 4, 'x-post'],
      [4, 4, 'facebook-post']
    ]);
    expect(calls.map(([, , id]) => id)).toEqual(
      variants.map((variant) => variant.size.id)
    );
  });

  // AR-H4
  it('restores the scene that was loaded before the call', async () => {
    const before = describeLoadedScene();

    await resize({ engine, sizes: DEFAULT_SIZES, scene: sourceScene });

    expect(describeLoadedScene()).toEqual(before);
    expect(describeLoadedScene()).toEqual([
      { width: 1080, height: 1080, children: ['//ly.img.ubq/graphic'] }
    ]);
  });

  it('restores the scene even when an export rejects', async () => {
    const before = describeLoadedScene();

    await expect(
      resize({
        engine,
        sizes: DEFAULT_SIZES,
        scene: sourceScene,
        exportOptions: { mimeType: 'image/png', pngCompressionLevel: 99 }
      })
    ).rejects.toThrow();

    expect(describeLoadedScene()).toEqual(before);
  });

  // AR-H5
  it('does nothing for an empty size list', async () => {
    const before = describeLoadedScene();
    let progressCalls = 0;

    const variants = await resize({
      engine,
      sizes: [],
      scene: sourceScene,
      onProgress: () => {
        progressCalls += 1;
      }
    });

    expect(variants).toEqual([]);
    expect(progressCalls).toBe(0);
    expect(describeLoadedScene()).toEqual(before);
  });

  // AR-H6
  it('forwards the export options to every variant', async () => {
    const variants = await resize({
      engine,
      sizes: DEFAULT_SIZES,
      scene: sourceScene,
      exportOptions: { mimeType: 'image/jpeg' }
    });

    expect(variants.map((variant) => variant.blob.type)).toEqual(
      DEFAULT_SIZES.map(() => 'image/jpeg')
    );
  });

  it('exports PNG when no export options are given', async () => {
    const [variant] = await resize({
      engine,
      sizes: DEFAULT_SIZES.slice(0, 1),
      scene: sourceScene
    });

    expect(variant.blob.type).toBe('image/png');
  });

  // AR-H7
  it('resizes the shipped example template', async () => {
    const template = readTemplate(SHIPPED_TEMPLATE);

    const variants = await resize({
      engine,
      sizes: DEFAULT_SIZES,
      scene: template
    });

    expect(variants).toHaveLength(4);
    const sizes: [number, number][] = [];
    for (const variant of variants) {
      expect(variant.blob.size).toBeGreaterThan(0);
      sizes.push(await pageSizeOf(variant.sceneString));
    }
    expect(sizes).toEqual([
      [1080, 1920],
      [1080, 1350],
      [1200, 675],
      [1200, 630]
    ]);
  }, 180_000);
});
