import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// `@cesdk/cesdk-js` reads `window` at module scope, and the configuration
// plugin pulls it in. Nothing the kit decides needs a DOM.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

vi.mock('@cesdk/cesdk-js/plugins', () => {
  const names = [
    'BlurAssetSource',
    'ImageColorsAssetSource',
    'ColorPaletteAssetSource',
    'CropPresetsAssetSource',
    'DemoAssetSources',
    'EffectsAssetSource',
    'FiltersAssetSource',
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
        static assetSourceName = name;
        readonly assetSourceName = name;
        constructor(readonly options?: { include?: string[] }) {}
      }
    ])
  );
});

vi.mock('@imgly/plugin-background-removal-web', () => ({
  default: (options: unknown) => ({ name: 'background-removal', options })
}));

import { initDesignEditor } from '../../src/imgly';

const ACTIONS_DROPDOWN = 'ly.img.actions.navigationBar';

interface AddedPlugin {
  assetSourceName?: string;
  options?: { include?: string[] };
  name?: string;
}

describe('initDesignEditor', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
  let added: AddedPlugin[];

  beforeEach(async () => {
    spy = createApiSpy<CreativeEditorSDK>();
    await initDesignEditor(spy.api);
    added = spy.callsTo('addPlugin').map(({ args }) => args[0] as AddedPlugin);
  });

  it('DE-U1 adds the design editor configuration first and background removal last', () => {
    expect(added[0]).toBeInstanceOf(DesignEditorConfig);
    expect(added.at(-1)?.name).toBe('background-removal');
    expect(added).toHaveLength(17);
  });

  it('DE-U1 adds the fifteen documented asset source plugins', () => {
    expect(
      added.map((plugin) => plugin.assetSourceName).filter(Boolean)
    ).toEqual([
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

  it('DE-U1 registers the fifteen asset sources in one concurrent batch', async () => {
    const pending: Array<() => void> = [];
    const addPlugin = vi.fn(
      () => new Promise<void>((resolve) => pending.push(resolve))
    );
    const cesdk = {
      addPlugin,
      ui: { insertOrderComponent: vi.fn() }
    } as unknown as CreativeEditorSDK;

    const done = initDesignEditor(cesdk);
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(1));

    pending.shift()!();
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(16));

    while (pending.length > 0) {
      pending.shift()!();
    }
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(17));
    pending.shift()!();
    await done;
  });

  it('DE-U2 restricts the upload, demo and premium asset sources', () => {
    const includes = (name: string) =>
      added.find((plugin) => plugin.assetSourceName === name)?.options?.include;

    expect(includes('UploadAssetSources')).toEqual(['ly.img.image.upload']);
    expect(includes('DemoAssetSources')).toEqual([
      'ly.img.templates.blank.*',
      'ly.img.templates.presentation.*',
      'ly.img.templates.print.*',
      'ly.img.templates.social.*',
      'ly.img.image.*'
    ]);
    expect(includes('PremiumTemplatesAssetSource')).toEqual([
      'ly.img.templates.premium.*'
    ]);
  });

  it('DE-U2 leaves the other asset sources unconfigured', () => {
    const configured = added
      .filter((plugin) => plugin.options?.include != null)
      .map((plugin) => plugin.assetSourceName);

    expect(configured).toEqual([
      'UploadAssetSources',
      'DemoAssetSources',
      'PremiumTemplatesAssetSource'
    ]);
  });

  it('DE-U3 appends the actions dropdown with its six entries to the navigation bar', () => {
    expect(spy.callsTo('ui.insertOrderComponent')).toHaveLength(1);
    expect(spy.lastArgsOf('ui.insertOrderComponent')).toEqual([
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: ACTIONS_DROPDOWN,
        children: [
          'ly.img.saveScene.navigationBar',
          'ly.img.exportImage.navigationBar',
          'ly.img.exportPDF.navigationBar',
          'ly.img.exportScene.navigationBar',
          'ly.img.exportArchive.navigationBar',
          'ly.img.importScene.navigationBar'
        ]
      }
    ]);
  });

  it('DE-U4 puts background removal in the canvas menu with the local provider', () => {
    expect(added.at(-1)?.options).toEqual({
      ui: { locations: ['canvasMenu'] },
      provider: { type: '@imgly/background-removal' }
    });
  });

  it('sets no theme and no locale, so the editor keeps its defaults', () => {
    expect(spy.callsTo('setTheme')).toEqual([]);
    expect(spy.callsTo('setLocale')).toEqual([]);
  });
});
