import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Both entry points reach the real editor package, which touches `window` at
// import time. The plugin classes are recorded by name and options instead.
vi.mock('@cesdk/cesdk-js', () => ({
  default: { version: '0.0.0-test' }
}));

vi.mock('@cesdk/cesdk-js/plugins', () =>
  Object.fromEntries(
    [
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
      'TextComponentAssetSource',
      'TypefaceAssetSource',
      'TextAssetSource',
      'VectorShapeAssetSource',
      'UploadAssetSources'
    ].map((name) => [
      name,
      class Recorded {
        pluginName = name;
        options: unknown;
        constructor(options?: unknown) {
          this.options = options;
        }
      }
    ])
  )
);

const { initPlaceholdersAdopterEditor, initPlaceholdersCreatorEditor } =
  await import('../../src/imgly');

interface RecordedPlugin {
  /** Set by the plugin mock below; the kit's own config plugins carry `name`. */
  pluginName?: string;
  name?: string;
  options?: { include?: string[] };
}

async function record(
  init: (cesdk: CreativeEditorSDK) => Promise<void>
): Promise<ReturnType<typeof createApiSpy<CreativeEditorSDK>>> {
  const spy = createApiSpy<CreativeEditorSDK>();
  await init(spy.api);
  return spy;
}

function pluginNames(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>
): string[] {
  return spy.callsTo('addPlugin').map(({ args }) => {
    const plugin = args[0] as RecordedPlugin;
    return plugin.pluginName ?? plugin.name ?? '';
  });
}

describe('PH-U1 the two init functions', () => {
  let creator: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
  let adopter: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;

  beforeEach(async () => {
    creator = await record(initPlaceholdersCreatorEditor);
    adopter = await record(initPlaceholdersAdopterEditor);
  });

  it('picks the config, the theme and the role per role', () => {
    expect(pluginNames(creator)[0]).toBe('cesdk-advanced-editor');
    expect(creator.lastArgsOf('ui.setTheme')).toEqual(['dark']);
    expect(creator.lastArgsOf('engine.editor.setRole')).toEqual(['Creator']);

    expect(pluginNames(adopter)[0]).toBe('cesdk-design-editor');
    expect(adopter.lastArgsOf('ui.setTheme')).toEqual(['light']);
    expect(adopter.lastArgsOf('engine.editor.setRole')).toEqual(['Adopter']);
  });

  it('adds the same asset sources to both roles', () => {
    expect(pluginNames(creator).slice(1)).toEqual(
      pluginNames(adopter).slice(1)
    );
    expect(pluginNames(creator)).toContain('PremiumTemplatesAssetSource');
    expect(pluginNames(creator)).toContain('DemoAssetSources');
  });

  it('requests every asset source before it waits for any of them', async () => {
    const requested: string[] = [];
    const pending: Array<() => void> = [];
    const addPlugin = (plugin: RecordedPlugin) => {
      requested.push(plugin.pluginName ?? plugin.name ?? '');
      return new Promise<void>((resolve) => pending.push(resolve));
    };
    const recorder = createApiSpy<CreativeEditorSDK>();
    const gated = new Proxy(recorder.api as object, {
      get: (target, key) =>
        key === 'addPlugin' ? addPlugin : Reflect.get(target, key)
    }) as CreativeEditorSDK;
    const settle = () => pending.splice(0).forEach((resolve) => resolve());

    const init = initPlaceholdersCreatorEditor(gated);

    await vi.waitFor(() =>
      expect(requested).toEqual(['cesdk-advanced-editor'])
    );

    settle();
    await vi.waitFor(() =>
      expect(requested).toHaveLength(pluginNames(creator).length)
    );
    settle();
    await init;
    expect(requested).toEqual(pluginNames(creator));
  });

  it('includes the same nine page-preset families in both roles', () => {
    const presets = (spy: typeof creator): string[] => {
      const plugin = spy
        .callsTo('addPlugin')
        .map(({ args }) => args[0] as RecordedPlugin)
        .find((entry) => entry.pluginName === 'PagePresetsAssetSource');
      return plugin?.options?.include ?? [];
    };

    expect(presets(creator)).toHaveLength(9);
    expect(presets(adopter)).toEqual(presets(creator));
    expect(presets(creator)).toContain('ly.img.page.presets.instagram.*');
  });
});
