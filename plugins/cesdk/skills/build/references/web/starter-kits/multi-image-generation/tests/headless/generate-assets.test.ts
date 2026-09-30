import type { CreativeEngine } from '@cesdk/cesdk-js';
import { resolveObjectURL } from 'node:buffer';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { generateAssets, renderSceneToImage } from '../../src/imgly/generation';
import type { GeneratedAsset, Template } from '../../src/imgly/types';
import { TEMPLATES } from '../../src/app/template-catalog';
import SCENES from '../../src/app/scenes.json';
import { createKitEngine, disposeKitEngine, testRestaurant } from './fixtures';

const TEMPLATE_LIST = Object.values(TEMPLATES);

let engine: CreativeEngine;

async function collect(templates: Template[]): Promise<GeneratedAsset[]> {
  const seen: { index: number; asset: GeneratedAsset }[] = [];
  await generateAssets(
    engine,
    SCENES,
    templates,
    testRestaurant(),
    (index, asset) => seen.push({ index, asset })
  );
  expect(seen.map((entry) => entry.index)).toEqual(templates.map((_, i) => i));
  return seen.map((entry) => entry.asset);
}

beforeAll(async () => {
  engine = await createKitEngine();
}, 180_000);

afterAll(disposeKitEngine);

describe('MIG-H5 generateAssets', () => {
  let assets: GeneratedAsset[];

  beforeAll(async () => {
    assets = await collect(TEMPLATE_LIST);
  }, 180_000);

  it('reports one asset per template, in template order', () => {
    expect(assets.map((asset) => asset.label)).toEqual([
      'Square',
      'Portrait',
      'Landscape'
    ]);
  });

  it('reports every asset as finished', () => {
    expect(assets.map((asset) => asset.isLoading)).toEqual([
      false,
      false,
      false
    ]);
  });

  it('gives every asset a rendered image', () => {
    for (const asset of assets) {
      const blob = resolveObjectURL(asset.src as string);
      expect(blob?.type).toBe('image/jpeg');
      expect(blob!.size).toBeGreaterThan(1000);
    }
  });

  it('gives every asset a scene string that loads again', async () => {
    for (const asset of assets) {
      await engine.scene.load(asset.sceneString as string);
      expect(engine.scene.get()).not.toBeNull();
      expect(engine.variable.getString('Name')).toBe('Bean there Bean good');
    }
  });
});

describe('MIG-H6 generateAssets survives one failure', () => {
  it('reports the failed template as empty and still finishes the rest', async () => {
    const broken: Template = {
      ...TEMPLATE_LIST[1],
      label: 'Broken',
      sceneKey: 'nope'
    };
    // The failure is only logged today; the plan records surfacing it as open.
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});

    const assets = await collect([TEMPLATE_LIST[0], broken, TEMPLATE_LIST[2]]);

    expect(assets.map((asset) => asset.label)).toEqual([
      'Square',
      'Broken',
      'Landscape'
    ]);
    expect(assets[1]).toEqual({
      isLoading: false,
      src: null,
      sceneString: null,
      label: 'Broken'
    });
    expect(assets[0].src).not.toBeNull();
    expect(assets[2].src).not.toBeNull();
    expect(logged).toHaveBeenCalledTimes(1);

    logged.mockRestore();
  }, 180_000);
});

describe('MIG-H7 renderSceneToImage', () => {
  it('renders a valid scene string to a non-empty image', async () => {
    const src = await renderSceneToImage(engine, SCENES.square, 'image/png');
    const blob = resolveObjectURL(src as string);
    expect(blob?.type).toBe('image/png');
    expect(blob!.size).toBeGreaterThan(1000);
  });

  it('defaults to JPEG', async () => {
    const src = await renderSceneToImage(engine, SCENES.portrait);
    expect(resolveObjectURL(src as string)?.type).toBe('image/jpeg');
  });

  it('returns null for garbage instead of throwing', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await renderSceneToImage(engine, 'not a scene')).toBeNull();
    expect(logged).toHaveBeenCalledTimes(1);
    logged.mockRestore();
  });
});
