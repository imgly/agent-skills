import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const cutoutLibrary = vi.fn((options: unknown) => ({
  name: '@imgly/plugin-cutout-library-web',
  version: '0.0.0-test',
  initialize: () => {},
  options
}));

vi.mock('@imgly/plugin-cutout-library-web', () => ({
  default: (options: unknown) => cutoutLibrary(options)
}));

import { initCutoutLinesEditor } from '../../src/imgly';
import { setupCutoutLibraryPlugin } from '../../src/imgly/plugins/cutout-library';

const EXISTING_DOCK = [
  { id: 'ly.img.separator', key: 'ly.img.separator' },
  { id: 'ly.img.assetLibrary.dock', key: 'ly.img.elements' }
];

function editorWithDock() {
  const added: unknown[] = [];
  let order: unknown[] = EXISTING_DOCK;
  const cesdk = {
    addPlugin: (plugin: unknown) => {
      added.push(plugin);
      return Promise.resolve();
    },
    engine: { editor: { setRole: vi.fn() } },
    ui: {
      setTheme: vi.fn(),
      getAssetLibraryEntry: vi.fn(() => ({ icon: '@imgly/Cutout' })),
      getComponentOrder: vi.fn(() => order),
      setComponentOrder: vi.fn((_target: unknown, next: unknown[]) => {
        order = next;
      })
    }
  };
  return {
    cesdk: cesdk as unknown as CreativeEditorSDK,
    added,
    read: () => order
  };
}

describe('CL-U1 and CL-U2 setupCutoutLibraryPlugin', () => {
  let fixture: ReturnType<typeof editorWithDock>;

  beforeEach(async () => {
    cutoutLibrary.mockClear();
    fixture = editorWithDock();
    await setupCutoutLibraryPlugin(fixture.cesdk);
  });

  it('puts the Create Cutout button in the canvas menu', () => {
    expect(cutoutLibrary).toHaveBeenCalledTimes(1);
    const options = cutoutLibrary.mock.calls[0][0] as {
      ui: { locations: string[] };
      createCutoutFromBlocks: unknown;
      assetBaseUri?: string;
    };
    expect(options.ui).toEqual({ locations: ['canvasMenu'] });
    // No assetBaseUri, so the plugin's staticimgly.com default applies.
    expect(options.assetBaseUri).toBeUndefined();
  });

  it('reuses the block shape instead of tracing its alpha', () => {
    const { createCutoutFromBlocks } = cutoutLibrary.mock.calls[0][0] as {
      createCutoutFromBlocks: (ids: number[], engine: unknown) => unknown;
    };
    const createCutout = vi.fn();
    createCutoutFromBlocks([7, 8], {
      block: { createCutoutFromBlocks: createCutout }
    });

    expect(createCutout).toHaveBeenCalledWith([7, 8], 0, 2, true);
  });

  it('prepends a Cutout dock entry and keeps the rest of the order', () => {
    expect(fixture.cesdk.ui.getAssetLibraryEntry).toHaveBeenCalledWith(
      'ly.img.cutout.entry'
    );
    expect(fixture.read()).toEqual([
      {
        id: 'ly.img.assetLibrary.dock',
        label: 'Cutout',
        key: 'ly.img.assetLibrary.dock',
        icon: '@imgly/Cutout',
        entries: ['ly.img.cutout.entry']
      },
      ...EXISTING_DOCK
    ]);
  });
});

describe('CL-U3 initCutoutLinesEditor', () => {
  const fixture = editorWithDock();

  it('adds the configuration first and the cutout library last', async () => {
    await initCutoutLinesEditor(fixture.cesdk);

    expect((fixture.added[0] as object).constructor.name).toBe(
      'DesignEditorConfig'
    );
    // The configuration, fourteen asset sources, then the cutout library.
    expect(fixture.added).toHaveLength(16);
    expect((fixture.added.at(-1) as { name: string }).name).toBe(
      '@imgly/plugin-cutout-library-web'
    );
  });

  it('sets the Creator role and the light theme', () => {
    expect(fixture.cesdk.engine.editor.setRole).toHaveBeenCalledWith('Creator');
    expect(fixture.cesdk.ui.setTheme).toHaveBeenCalledWith('light');
  });

  it('requests every asset source before it waits for any of them', async () => {
    const requested: string[] = [];
    const pending: Array<() => void> = [];
    const gated = editorWithDock();
    (gated.cesdk as unknown as { addPlugin: unknown }).addPlugin = (plugin: {
      name: string;
    }) => {
      requested.push(plugin.name);
      return new Promise<void>((resolve) => pending.push(resolve));
    };
    const settle = () => pending.splice(0).forEach((resolve) => resolve());

    const init = initCutoutLinesEditor(gated.cesdk);

    await vi.waitFor(() => expect(requested).toEqual(['cesdk-design-editor']));

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(15));
    expect(requested).not.toContain('@imgly/plugin-cutout-library-web');

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(16));
    settle();
    await init;
    expect(requested.at(-1)).toBe('@imgly/plugin-cutout-library-web');
  });

  it('installs no premium templates, as the kit ships without templates', () => {
    const names = fixture.added.map(
      (plugin) => (plugin as object).constructor.name
    );
    expect(names).not.toContain('PremiumTemplatesAssetSource');
  });
});
