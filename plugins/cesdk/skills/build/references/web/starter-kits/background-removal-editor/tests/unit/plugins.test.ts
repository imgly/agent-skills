import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

const backgroundRemoval = vi.fn((options: unknown) => ({
  name: '@imgly/plugin-background-removal-web',
  version: '0.0.0-test',
  initialize: () => {},
  options
}));

vi.mock('@imgly/plugin-background-removal-web', () => ({
  default: (options: unknown) => backgroundRemoval(options)
}));

import { initBackgroundRemovalEditor } from '../../src/imgly';

describe('BGR-U1 initBackgroundRemovalEditor', () => {
  const added: unknown[] = [];
  const cesdk = {
    addPlugin: (plugin: unknown) => {
      added.push(plugin);
      return Promise.resolve();
    },
    engine: { editor: { setRole: vi.fn() } },
    ui: { setTheme: vi.fn() }
  } as unknown as CreativeEditorSDK;

  it('adds the configuration first and background removal last', async () => {
    await initBackgroundRemovalEditor(cesdk);

    const names = added.map(
      (plugin) => (plugin as { name: string }).constructor.name
    );
    expect(names[0]).toBe('DesignEditorConfig');
    // The configuration, fifteen asset sources, then background removal.
    expect(added).toHaveLength(17);
    expect((added.at(-1) as { name: string }).name).toBe(
      '@imgly/plugin-background-removal-web'
    );
  });

  it('sets the Creator role and the light theme', () => {
    expect(cesdk.engine.editor.setRole).toHaveBeenCalledWith('Creator');
    expect(cesdk.ui.setTheme).toHaveBeenCalledWith('light');
  });

  it('puts the background-removal button in the canvas menu', () => {
    expect(backgroundRemoval).toHaveBeenCalledTimes(1);
    expect(backgroundRemoval).toHaveBeenCalledWith({
      ui: { locations: ['canvasMenu'] },
      provider: { type: '@imgly/background-removal' }
    });
  });
});

describe('BGR-U1 asset-source registration', () => {
  it('requests every asset source before it waits for any of them', async () => {
    const requested: string[] = [];
    const pending: Array<() => void> = [];
    const gated = {
      addPlugin: (plugin: { name: string }) => {
        requested.push(plugin.name);
        return new Promise<void>((resolve) => pending.push(resolve));
      },
      engine: { editor: { setRole: vi.fn() } },
      ui: { setTheme: vi.fn() }
    } as unknown as CreativeEditorSDK;
    const settle = () => pending.splice(0).forEach((resolve) => resolve());

    const init = initBackgroundRemovalEditor(gated);

    await vi.waitFor(() => expect(requested).toEqual(['cesdk-design-editor']));

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(16));
    expect(requested).not.toContain('@imgly/plugin-background-removal-web');

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(17));
    settle();
    await init;
    expect(requested.at(-1)).toBe('@imgly/plugin-background-removal-web');
  });
});
