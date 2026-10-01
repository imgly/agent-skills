import { vi } from 'vitest';

// The barrel pulls the configuration plugin, which imports `@cesdk/cesdk-js`
// for its version, and that package reads `window` at module scope.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { DesignEditorConfig } from '../../src/imgly/config/plugin';
import { initSinglePageEditor } from '../../src/imgly';

describe('SPE-U15 initSinglePageEditor', () => {
  it('adds the configuration plugin before the fifteen asset sources', async () => {
    const added: unknown[] = [];
    const cesdk = {
      addPlugin: (plugin: unknown) => {
        added.push(plugin);
        return Promise.resolve();
      }
    } as unknown as CreativeEditorSDK;

    await initSinglePageEditor(cesdk);

    expect(added[0]).toBeInstanceOf(DesignEditorConfig);
    // The plugin's own `name`; the class names are minified in the built bundle.
    expect(
      added.slice(1).map((plugin) => (plugin as { name: string }).name)
    ).toEqual([
      'cesdk-blur-asset-source',
      'cesdk-image-colors-asset-source',
      'cesdk-color-palette-asset-source',
      'cesdk-crop-presets-asset-source',
      'cesdk-upload-asset-sources',
      'cesdk-demo-asset-sources',
      'cesdk-effects-asset-source',
      'cesdk-filters-asset-source',
      'cesdk-page-presets-asset-source',
      'cesdk-sticker-asset-source',
      'cesdk-text-asset-source',
      'cesdk-text-component-asset-source',
      'cesdk-typeface-asset-source',
      'cesdk-vectorshape-asset-source',
      'cesdk-premium-asset-sources'
    ]);
  });

  it('registers the fifteen asset sources in one concurrent batch', async () => {
    const pending: Array<() => void> = [];
    const addPlugin = vi.fn(
      () => new Promise<void>((resolve) => pending.push(resolve))
    );
    const cesdk = { addPlugin } as unknown as CreativeEditorSDK;

    const done = initSinglePageEditor(cesdk);
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(1));

    pending.shift()!();
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(16));

    while (pending.length > 0) {
      pending.shift()!();
    }
    await done;
  });
});
