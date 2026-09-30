// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/app/App', () => ({ App: () => null }));
vi.mock('react-dom/client', () => ({
  createRoot: () => ({ render: vi.fn(), unmount: vi.fn() })
}));

describe('VCA-U8 the editor configuration', () => {
  it('names the user and turns the archive-scene flag on', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    const { editorConfig } = await import('../../src/index');

    expect(editorConfig.userId).toBe('starterkit-video-captions-user');
    expect(editorConfig.featureFlags).toEqual({ archiveSceneEnabled: true });
  });
});
