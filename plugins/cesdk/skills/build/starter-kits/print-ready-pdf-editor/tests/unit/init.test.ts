import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

// `@cesdk/cesdk-js` and its plugin bundle read `window` at import time, so the
// kit's entry module cannot be loaded in Node without these stand-ins.
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

vi.mock('@cesdk/cesdk-js/plugins', () => {
  const names = [
    'BlurAssetSource',
    'ColorPaletteAssetSource',
    'CropPresetsAssetSource',
    'DemoAssetSources',
    'EffectsAssetSource',
    'FiltersAssetSource',
    'ImageColorsAssetSource',
    'PagePresetsAssetSource',
    'PremiumTemplatesAssetSource',
    'StickerAssetSource',
    'TextAssetSource',
    'TextComponentAssetSource',
    'TypefaceAssetSource',
    'UploadAssetSources',
    'VectorShapeAssetSource'
  ];
  return Object.fromEntries(
    names.map((name) => [
      name,
      class {
        readonly source = name;
        constructor(public options?: { include?: string[] }) {}
      }
    ])
  );
});

import { initPrintReadyPdfEditor } from '../../src/imgly';

/** An editor whose `addPlugin` only settles when the test says so. */
function deferredEditor() {
  const spy = createApiSpy<CreativeEditorSDK>();
  const settle: Array<() => void> = [];
  const api = new Proxy(spy.api as object, {
    get(target, key, receiver) {
      if (key !== 'addPlugin') {
        return Reflect.get(target, key, receiver);
      }
      return (plugin: unknown) => {
        (target as { addPlugin: (p: unknown) => void }).addPlugin(plugin);
        return new Promise<void>((resolve) => settle.push(resolve));
      };
    }
  }) as CreativeEditorSDK;
  return { api, spy, settle };
}

describe('PRP-U21 initPrintReadyPdfEditor', () => {
  async function run() {
    const spy = createApiSpy<CreativeEditorSDK>();
    await initPrintReadyPdfEditor(spy.api);
    return spy;
  }

  it('adds the kit configuration first, then the asset sources', async () => {
    const plugins = (await run())
      .callsTo('addPlugin')
      .map(({ args }) => args[0] as { name?: string; source?: string });

    expect(plugins.slice(0, 2).map(({ name }) => name)).toEqual([
      'cesdk-design-editor',
      'ly.img.export-print-ready-pdf'
    ]);
    expect(plugins.slice(2).map(({ source }) => source)).toContain(
      'ImageColorsAssetSource'
    );
  });

  it('limits uploads and demo assets to images', async () => {
    const plugins = (await run())
      .callsTo('addPlugin')
      .map(
        ({ args }) =>
          args[0] as { source?: string; options?: { include?: string[] } }
      );
    const optionsOf = (source: string) =>
      plugins.find((plugin) => plugin.source === source)?.options;

    expect(optionsOf('UploadAssetSources')?.include).toEqual([
      'ly.img.image.upload'
    ]);
    expect(optionsOf('DemoAssetSources')?.include).toEqual(['ly.img.image.*']);
  });

  it('registers every asset source at once, not one after another', async () => {
    const total = (await run()).callsTo('addPlugin').length;
    const { api, spy, settle } = deferredEditor();
    const done = initPrintReadyPdfEditor(api);

    // The kit's own plugins are awaited one at a time.
    for (let index = 0; index < 2; index += 1) {
      await vi.waitFor(() => expect(settle).toHaveLength(index + 1));
      settle[index]();
    }

    // Sequential registration would stall here: every remaining source is in
    // flight before any of them settles.
    await vi.waitFor(() => expect(settle).toHaveLength(total));
    expect(spy.callsTo('addPlugin')).toHaveLength(total);

    settle.forEach((resolve) => resolve());
    await done;
  });
});
