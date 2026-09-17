import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

vi.mock('@cesdk/cesdk-js/plugins', async () => {
  const { assetSourceStubs } = await import('./plugin-stubs');
  return assetSourceStubs();
});

import { initTranslationInternationalizationEditor } from '../../src/imgly';
import type { AssetSourceStub } from './plugin-stubs';

async function run() {
  const spy = createApiSpy<CreativeEditorSDK>();
  await initTranslationInternationalizationEditor(spy.api);
  const plugins = spy
    .callsTo('addPlugin')
    .map(({ args }) => args[0] as AssetSourceStub);
  return { spy, plugins };
}

describe('initTranslationInternationalizationEditor', () => {
  it('TI-U3 adds the design editor configuration before the asset sources', async () => {
    const { plugins } = await run();

    expect(plugins[0].constructor.name).toBe('DesignEditorConfig');
    expect(plugins.slice(1).map((plugin) => plugin.pluginName)).toEqual([
      'BlurAssetSource',
      'ImageColorsAssetSource',
      'ColorPaletteAssetSource',
      'CropPresetsAssetSource',
      'UploadAssetSources',
      'DemoAssetSources',
      'EffectsAssetSource',
      'FiltersAssetSource',
      'PagePresetsAssetSource',
      'StickerAssetSource',
      'TextAssetSource',
      'TextComponentAssetSource',
      'TypefaceAssetSource',
      'VectorShapeAssetSource',
      'PremiumTemplatesAssetSource'
    ]);
  });

  it('TI-U3 starts the editor in English', async () => {
    const { spy } = await run();

    expect(spy.lastArgsOf('i18n.setLocale')).toEqual(['en']);
  });

  it('TI-U3 adds the asset sources in one concurrent batch', async () => {
    const editor = pausingEditor();

    const done = initTranslationInternationalizationEditor(editor.cesdk);

    await editor.settle();
    expect(editor.added).toEqual(['DesignEditorConfig']);

    await editor.releaseAll();
    expect(editor.added.slice(1)).toEqual([
      'BlurAssetSource',
      'ImageColorsAssetSource',
      'ColorPaletteAssetSource',
      'CropPresetsAssetSource',
      'UploadAssetSources',
      'DemoAssetSources',
      'EffectsAssetSource',
      'FiltersAssetSource',
      'PagePresetsAssetSource',
      'StickerAssetSource',
      'TextAssetSource',
      'TextComponentAssetSource',
      'TypefaceAssetSource',
      'VectorShapeAssetSource',
      'PremiumTemplatesAssetSource'
    ]);

    await editor.releaseAll();
    await done;
  });
});

/**
 * A spy whose `addPlugin` stays pending until the test releases it, so a
 * sequential `await` per plugin and a single `Promise.all` are told apart.
 */
function pausingEditor() {
  const spy = createApiSpy<CreativeEditorSDK>();
  const added: string[] = [];
  let pending: (() => void)[] = [];
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
  const addPlugin = (plugin: { pluginName?: string }) => {
    added.push(plugin.pluginName ?? plugin.constructor.name);
    return new Promise<void>((resolve) => pending.push(resolve));
  };
  return {
    added,
    settle,
    async releaseAll() {
      const releasing = pending;
      pending = [];
      releasing.forEach((resolve) => resolve());
      await settle();
    },
    cesdk: new Proxy(spy.api as object, {
      get: (target, key) =>
        key === 'addPlugin' ? addPlugin : Reflect.get(target, key)
    }) as CreativeEditorSDK
  };
}
