import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

// The kit barrel reaches the editor plugin build, which touches the DOM at
// import time. Only the registration order matters here, so each plugin is a
// class that carries its own name.
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
      'StickerAssetSource',
      'TextAssetSource',
      'TextComponentAssetSource',
      'TypefaceAssetSource',
      'UploadAssetSources',
      'VectorShapeAssetSource'
    ].map((name) => [
      name,
      class Recorded {
        name = name;
      }
    ])
  )
);
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));
vi.mock('../../src/imgly/plugins/product-backdrop', () => ({
  ProductBackdrop: class ProductBackdrop {
    name = 'product-backdrop';
  }
}));

const { initProductEditor } = await import('../../src/imgly');

describe('PE-U5 asset-source registration', () => {
  it('requests every asset source before it waits for any of them', async () => {
    const requested: string[] = [];
    const pending: Array<() => void> = [];
    const addPlugin = (plugin: { name: string }) => {
      requested.push(plugin.name);
      return new Promise<void>((resolve) => pending.push(resolve));
    };
    const recorder = createApiSpy<CreativeEditorSDK>();
    const gated = new Proxy(recorder.api as object, {
      get: (target, key) =>
        key === 'addPlugin' ? addPlugin : Reflect.get(target, key)
    }) as CreativeEditorSDK;
    const settle = () => pending.splice(0).forEach((resolve) => resolve());

    const init = initProductEditor(gated);

    await vi.waitFor(() => expect(requested).toEqual(['cesdk-design-editor']));

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(2));
    expect(requested[1]).toBe('product-backdrop');

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(16));
    settle();
    await init;
    expect(requested).toHaveLength(16);
  });
});
