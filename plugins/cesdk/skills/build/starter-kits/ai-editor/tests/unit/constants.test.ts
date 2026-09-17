import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('AIE-U13 constants', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('builds both scene URLs from the demo asset base', async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', 'https://assets.example/ai');
    const { DEMO_ASSETS_BASE_URL, SCENE_URLS } =
      await import('../../src/app/constants');

    expect(DEMO_ASSETS_BASE_URL).toBe('https://assets.example/ai');
    expect(SCENE_URLS.Design).toBe(
      'https://assets.example/ai/assets/ai_editor_design_v3/scene.scene'
    );
    expect(SCENE_URLS.Video).toBe(
      'https://assets.example/ai/assets/ai_editor_video/scene.scene'
    );
  });

  it("falls back to the kit's own URL", async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', undefined);
    const { DEMO_ASSETS_BASE_URL } = await import('../../src/app/constants');

    expect(DEMO_ASSETS_BASE_URL).toBe(
      (typeof location === 'undefined'
        ? import.meta.env.BASE_URL
        : new URL(import.meta.env.BASE_URL, location.href).href
      ).replace(/\/$/, '')
    );
  });

  it('points photo mode at an absolute image URL', async () => {
    const { DEFAULT_PHOTO_URL } = await import('../../src/app/constants');
    expect(() => new URL(DEFAULT_PHOTO_URL)).not.toThrow();
  });
});
