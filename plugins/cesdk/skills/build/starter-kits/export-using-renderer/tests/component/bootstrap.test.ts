// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock('@cesdk/cesdk-js', () => ({
  default: { version: '0.0.0-test', create }
}));

// The entry pulls the whole asset-source plugin set through `src/imgly`, and
// each class touches the real editor package at import time.
vi.mock('@cesdk/cesdk-js/plugins', () =>
  Object.fromEntries(
    [
      'BlurAssetSource',
      'CaptionPresetsAssetSource',
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
      'VectorShapeAssetSource'
    ].map((name) => [
      name,
      class Recorded {
        pluginName = name;
      }
    ])
  )
);

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  create.mockReset();
});

describe('RND-U18 the entry point', () => {
  it('creates the editor in the kit container and publishes it for debugging', async () => {
    const cesdk = {
      addPlugin: vi.fn(),
      feature: { set: vi.fn() },
      actions: { register: vi.fn(), run: vi.fn() },
      i18n: { setTranslations: vi.fn() },
      ui: { setComponentOrder: vi.fn() },
      load: vi.fn()
    };
    create.mockResolvedValue(cesdk);

    await import('../../src/index');
    await vi.waitFor(() => expect(cesdk.load).toHaveBeenCalledTimes(1));

    const [container, config] = create.mock.calls[0] as [
      string,
      Record<string, unknown>
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-export-using-renderer-user');
    expect(config).toHaveProperty('license');
    expect((window as unknown as { cesdk: unknown }).cesdk).toBe(cesdk);
    expect(cesdk.load.mock.calls[0][0]).toContain(
      'assets/example-video-motion.scene'
    );
  });

  it('logs a failed start-up instead of leaving an unhandled rejection', async () => {
    const error = new Error('no WebGL');
    create.mockRejectedValue(error);
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/index');
    await vi.waitFor(() =>
      expect(logged).toHaveBeenCalledWith('Failed to initialize CE.SDK:', error)
    );
  });
});
