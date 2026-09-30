import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

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
        pluginName = name;
        constructor(public options?: { include?: string[] }) {}
      }
    ])
  );
});

import {
  initAutomatedResizingAdvancedEditor,
  initAutomatedResizingDesignEditor
} from '../../src/imgly';

interface Stub {
  pluginName?: string;
  name?: string;
  options?: { include?: string[] };
}

async function run(init: (cesdk: CreativeEditorSDK) => Promise<void>) {
  const spy = createApiSpy<CreativeEditorSDK>();
  await init(spy.api);
  return {
    spy,
    plugins: spy.callsTo('addPlugin').map(({ args }) => args[0] as Stub)
  };
}

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

describe('AR-U7 the two editor entry points', () => {
  it.each([
    [
      'design',
      initAutomatedResizingDesignEditor,
      'cesdk-design-editor',
      'light'
    ],
    [
      'advanced',
      initAutomatedResizingAdvancedEditor,
      'cesdk-advanced-editor',
      'dark'
    ]
  ])(
    'the %s editor adds its own configuration first, then sets its theme',
    async (_name, init, configName, theme) => {
      const { spy, plugins } = await run(init);

      expect(plugins[0].name).toBe(configName);
      expect(spy.lastArgsOf('ui.setTheme')).toEqual([theme]);

      const paths = spy.calls.map(({ path }) => path);
      expect(paths.indexOf('addPlugin')).toBeLessThan(
        paths.indexOf('ui.setTheme')
      );
    }
  );

  it.each([
    ['design', initAutomatedResizingDesignEditor],
    ['advanced', initAutomatedResizingAdvancedEditor]
  ])(
    'the %s editor limits uploads and demo assets to images',
    async (_name, init) => {
      const { plugins } = await run(init);
      const optionsOf = (pluginName: string) =>
        plugins.find((plugin) => plugin.pluginName === pluginName)?.options;

      expect(optionsOf('UploadAssetSources')?.include).toEqual([
        'ly.img.image.upload'
      ]);
      expect(optionsOf('DemoAssetSources')?.include).toEqual([
        'ly.img.image.*'
      ]);
    }
  );

  it.each([
    ['design', initAutomatedResizingDesignEditor],
    ['advanced', initAutomatedResizingAdvancedEditor]
  ])(
    'the %s editor registers every asset source at once, not one after another',
    async (_name, init) => {
      const total = (await run(init)).plugins.length;
      const { api, spy, settle } = deferredEditor();
      const done = init(api);

      // The configuration plugin is awaited on its own.
      await vi.waitFor(() => expect(settle).toHaveLength(1));
      settle[0]();

      // Sequential registration would stall here: every remaining source is
      // in flight before any of them settles.
      await vi.waitFor(() => expect(settle).toHaveLength(total));
      expect(spy.callsTo('addPlugin')).toHaveLength(total);

      settle.forEach((resolve) => resolve());
      await done;
    }
  );

  it('gives both editors the same asset sources', async () => {
    const design = await run(initAutomatedResizingDesignEditor);
    const advanced = await run(initAutomatedResizingAdvancedEditor);

    const sources = (plugins: Stub[]) =>
      plugins.slice(1).map((plugin) => plugin.pluginName);
    expect(sources(design.plugins)).toEqual(sources(advanced.plugins));
    expect(sources(design.plugins)).toContain('ImageColorsAssetSource');
  });
});
