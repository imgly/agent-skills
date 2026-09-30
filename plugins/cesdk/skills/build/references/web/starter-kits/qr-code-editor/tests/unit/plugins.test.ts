import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

const qrCode = vi.fn((options: unknown) => ({
  name: '@imgly/plugin-qr-code-web',
  version: '0.0.0-test',
  initialize: () => {},
  options
}));

vi.mock('@imgly/plugin-qr-code-web', () => ({
  default: (options?: unknown) => qrCode(options)
}));

import { initQRCodeEditor } from '../../src/imgly';
import { setupQRCodePlugin } from '../../src/imgly/plugins/qr-code';

const EXISTING_DOCK = [
  { id: 'ly.img.assetLibrary.dock', key: 'ly.img.templates' },
  { id: 'ly.img.assetLibrary.dock', key: 'ly.img.sticker' }
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

describe('QR-U1 setupQRCodePlugin', () => {
  const fixture = editorWithDock();

  it('installs the plugin with its own defaults', async () => {
    await setupQRCodePlugin(fixture.cesdk);

    expect(qrCode).toHaveBeenCalledTimes(1);
    // No configuration, so `createdBlockType` stays `shape` and no As-Shape
    // checkbox is added.
    expect(qrCode).toHaveBeenCalledWith(undefined);
  });

  it('appends the QR dock entry behind a spacer', () => {
    expect(fixture.read()).toEqual([
      ...EXISTING_DOCK,
      'ly.img.spacer',
      'ly.img.generate-qr.dock'
    ]);
  });
});

describe('QR-U2 initQRCodeEditor', () => {
  const fixture = editorWithDock();

  it('adds the configuration first and the QR plugin last', async () => {
    await initQRCodeEditor(fixture.cesdk);

    expect((fixture.added[0] as object).constructor.name).toBe(
      'DesignEditorConfig'
    );
    // The configuration, fifteen asset sources, then the QR plugin.
    expect(fixture.added).toHaveLength(17);
    expect((fixture.added.at(-1) as { name: string }).name).toBe(
      '@imgly/plugin-qr-code-web'
    );
  });

  it('registers the fifteen asset sources in one concurrent batch', async () => {
    const pending: Array<() => void> = [];
    const addPlugin = vi.fn(
      () => new Promise<void>((resolve) => pending.push(resolve))
    );
    const deferred = {
      addPlugin,
      engine: { editor: { setRole: vi.fn() } },
      ui: {
        setTheme: vi.fn(),
        getComponentOrder: vi.fn(() => []),
        setComponentOrder: vi.fn()
      }
    } as unknown as CreativeEditorSDK;

    const done = initQRCodeEditor(deferred);
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

  it('sets the Creator role and the light theme', () => {
    expect(fixture.cesdk.engine.editor.setRole).toHaveBeenCalledWith('Creator');
    expect(fixture.cesdk.ui.setTheme).toHaveBeenCalledWith('light');
  });
});
