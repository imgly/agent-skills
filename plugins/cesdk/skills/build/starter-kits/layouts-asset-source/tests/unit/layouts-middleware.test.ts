import { vi } from 'vitest';

// `layout.ts` imports `@cesdk/cesdk-js` for its version, and that package reads
// `window` at module scope.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { AssetResult } from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it } from 'vitest';

const applyLayoutToPage = vi.hoisted(() => vi.fn(async () => 42));

vi.mock('../../src/imgly/plugins/layouts/applyLayout', () => ({
  applyLayoutToPage
}));

import { LayoutsAssetSourcePlugin } from '../../src/imgly/plugins/layouts/layout';

type Middleware = (
  sourceId: string,
  assetResult: AssetResult,
  apply: (sourceId: string, assetResult: AssetResult) => unknown
) => unknown;

const asset = { id: 'layout-0', meta: {} } as AssetResult;

function fakeEditor() {
  let middleware: Middleware | undefined;
  const unsubscribe = vi.fn();
  const cesdk = {
    i18n: { setTranslations: vi.fn() },
    engine: {
      asset: {
        addLocalAssetSourceFromJSONString: vi.fn(async () => undefined),
        registerApplyMiddleware: vi.fn((fn: Middleware) => {
          middleware = fn;
          return unsubscribe;
        })
      }
    },
    ui: {
      addAssetLibraryEntry: vi.fn(),
      getComponentOrder: () => [],
      setComponentOrder: vi.fn()
    }
  };
  return {
    cesdk: cesdk as unknown as CreativeEditorSDK,
    unsubscribe,
    middleware: () => {
      if (middleware == null) {
        throw new Error('The plugin registered no apply middleware.');
      }
      return middleware;
    }
  };
}

describe('LAY-U8 the layout apply middleware', () => {
  beforeEach(() => {
    applyLayoutToPage.mockClear();
  });

  it('does nothing without an editor', async () => {
    const editor = fakeEditor();
    const plugin = new LayoutsAssetSourcePlugin();

    await plugin.initialize({ cesdk: undefined } as never);

    expect(
      (
        editor.cesdk as unknown as {
          engine: {
            asset: { registerApplyMiddleware: { mock: { calls: unknown[] } } };
          };
        }
      ).engine.asset.registerApplyMiddleware.mock.calls
    ).toHaveLength(0);
  });

  it('passes an asset from another source straight through', async () => {
    const editor = fakeEditor();
    const plugin = new LayoutsAssetSourcePlugin();
    await plugin.initialize({ cesdk: editor.cesdk } as never);
    const apply = vi.fn(async () => 'applied');

    const result = await editor.middleware()('ly.img.image', asset, apply);

    expect(apply).toHaveBeenCalledWith('ly.img.image', asset);
    expect(result).toBe('applied');
    expect(applyLayoutToPage).not.toHaveBeenCalled();
  });

  it('applies a layout asset to the current page, with an undo step by default', async () => {
    const editor = fakeEditor();
    const plugin = new LayoutsAssetSourcePlugin();
    await plugin.initialize({ cesdk: editor.cesdk } as never);
    const apply = vi.fn(async () => 'applied');

    const result = await editor.middleware()('ly.img.layouts', asset, apply);

    expect(apply).not.toHaveBeenCalled();
    expect(applyLayoutToPage).toHaveBeenCalledWith(
      (editor.cesdk as unknown as { engine: unknown }).engine,
      asset,
      true
    );
    expect(result).toBe(42);
  });

  it('honours addUndoStep false', async () => {
    const editor = fakeEditor();
    const plugin = new LayoutsAssetSourcePlugin({ addUndoStep: false });
    await plugin.initialize({ cesdk: editor.cesdk } as never);

    await editor.middleware()('ly.img.layouts', asset, vi.fn());

    expect(applyLayoutToPage).toHaveBeenCalledWith(
      expect.anything(),
      asset,
      false
    );
  });

  it('releases the middleware when the plugin is disposed', async () => {
    const editor = fakeEditor();
    const plugin = new LayoutsAssetSourcePlugin();
    await plugin.initialize({ cesdk: editor.cesdk } as never);

    plugin.dispose();

    expect(editor.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
