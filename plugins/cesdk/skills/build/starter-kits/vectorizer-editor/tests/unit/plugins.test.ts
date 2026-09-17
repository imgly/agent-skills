import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

const vectorizer = vi.fn((options: unknown) => ({
  name: '@imgly/plugin-vectorizer-web',
  version: '0.0.0-test',
  initialize: () => {},
  options
}));

vi.mock('@imgly/plugin-vectorizer-web', () => ({
  default: (options: unknown) => vectorizer(options)
}));

import { initVectorizerEditor } from '../../src/imgly';
import { setupVectorizerPlugin } from '../../src/imgly/plugins/vectorizer';

describe('V-U1 setupVectorizerPlugin', () => {
  it('puts the Vectorize button in the canvas menu', async () => {
    const added: unknown[] = [];
    const cesdk = {
      addPlugin: (plugin: unknown) => {
        added.push(plugin);
        return Promise.resolve();
      }
    } as unknown as CreativeEditorSDK;

    await setupVectorizerPlugin(cesdk);

    expect(added).toHaveLength(1);
    // The plugin's type is `Location | Location[]`, so the bare string is
    // legal; pinned here so a later change to an array is deliberate.
    expect(vectorizer).toHaveBeenLastCalledWith({
      ui: { locations: 'canvasMenu' }
    });
  });
});

describe('V-U3 initVectorizerEditor', () => {
  const added: unknown[] = [];
  const cesdk = {
    addPlugin: (plugin: unknown) => {
      added.push(plugin);
      return Promise.resolve();
    },
    engine: { editor: { setRole: vi.fn() } },
    ui: { setTheme: vi.fn() }
  } as unknown as CreativeEditorSDK;

  it('adds the configuration first and the vectorizer last', async () => {
    await initVectorizerEditor(cesdk);

    expect((added[0] as object).constructor.name).toBe('DesignEditorConfig');
    // The configuration, fifteen asset sources, then the vectorizer.
    expect(added).toHaveLength(17);
    expect((added.at(-1) as { name: string }).name).toBe(
      '@imgly/plugin-vectorizer-web'
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
      ui: { setTheme: vi.fn() }
    } as unknown as CreativeEditorSDK;

    const done = initVectorizerEditor(deferred);
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
    expect(cesdk.engine.editor.setRole).toHaveBeenCalledWith('Creator');
    expect(cesdk.ui.setTheme).toHaveBeenCalledWith('light');
  });
});
