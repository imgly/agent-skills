import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

vi.mock('@cesdk/cesdk-js/plugins', async () => {
  const { assetSourceStubs } = await import('./plugin-stubs');
  return assetSourceStubs();
});

import { initThemingEditor } from '../../src/imgly';
import type { AssetSourceStub } from './plugin-stubs';

async function run() {
  const spy = createApiSpy<CreativeEditorSDK>();
  await initThemingEditor(spy.api);
  const plugins = spy
    .callsTo('addPlugin')
    .map(({ args }) => args[0] as AssetSourceStub);
  return { spy, plugins };
}

describe('initThemingEditor', () => {
  it('TH-U9 adds the design editor configuration before the asset sources', async () => {
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

  it('TH-U9 limits the upload, demo and template sources to images', async () => {
    const { plugins } = await run();
    const options = (name: string) =>
      plugins.find((plugin) => plugin.pluginName === name)?.options;

    expect(options('UploadAssetSources')).toEqual({
      include: ['ly.img.image.upload']
    });
    expect(options('DemoAssetSources')).toEqual({
      include: ['ly.img.image.*']
    });
    expect(options('PremiumTemplatesAssetSource')).toEqual({
      include: ['ly.img.templates.premium.*']
    });
  });

  it('TH-U9 sets the creator role and the dark theme at normal scale', async () => {
    const { spy } = await run();

    expect(spy.lastArgsOf('engine.editor.setRole')).toEqual(['Creator']);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['dark']);
    expect(spy.lastArgsOf('ui.setScale')).toEqual(['normal']);
  });

  it('TH-U9 adds the asset sources in one concurrent batch', async () => {
    const editor = pausingEditor();

    const done = initThemingEditor(editor.cesdk);

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
