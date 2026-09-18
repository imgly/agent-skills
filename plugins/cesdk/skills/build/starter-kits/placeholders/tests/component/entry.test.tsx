// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/app/App', () => ({ default: () => null }));

const render = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: () => ({ render, unmount: vi.fn() })
}));

beforeEach(() => {
  vi.resetModules();
  render.mockClear();
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PLC-C3 the entry point', () => {
  it('names the user and takes the license and base URL from the environment', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    const { editorConfig, SCENE_URL } = await import('../../src/index');

    expect(editorConfig.userId).toBe('starterkit-placeholders-user');
    expect(editorConfig.license).toBe(import.meta.env.VITE_CESDK_LICENSE);
    expect(editorConfig.baseURL).toBe(
      import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL
    );
    expect(SCENE_URL).toContain('example.scene');
  });

  it('mounts the app once the root container is there', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import('../../src/index');

    expect(render).toHaveBeenCalledTimes(1);
  });

  it('fails loudly when the page has no root container', async () => {
    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
    expect(render).not.toHaveBeenCalled();
  });
});
