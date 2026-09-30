import { vi } from 'vitest';

// `src/index.ts` publishes the editor on `window`. Nothing else here needs a
// DOM, so a bare global is enough.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const create = vi.fn();
const initAdvancedVideoEditor = vi.fn(async () => undefined);
const reportDemoPhase = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({ default: { create } }));
vi.mock('../../src/imgly', () => ({ initAdvancedVideoEditor }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));

const editor = {
  load: vi.fn(async () => undefined)
};

const SCENE = '/assets/templates/lunar-video-default/scene.scene';

describe('AVE-U6 src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    create.mockReset();
    initAdvancedVideoEditor.mockClear();
    editor.load.mockClear();
    reportDemoPhase.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (globalThis.window as { cesdk?: unknown }).cesdk;
  });

  it("falls back to the kit's own URL when no base URL is configured", async () => {
    create.mockResolvedValue(editor);

    const entry = await import('../../src/index');

    expect(entry.DEMO_ASSETS_BASE_URL).toBe(
      new URL(import.meta.env.BASE_URL, window.location.href).href.replace(
        /\/$/,
        ''
      )
    );
  });

  it('loads the scene from the configured base URL', async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', 'https://example.test/data');
    create.mockResolvedValue(editor);

    const entry = await import('../../src/index');
    await vi.waitFor(() => expect(editor.load).toHaveBeenCalledTimes(1));

    expect(entry.DEMO_ASSETS_BASE_URL).toBe('https://example.test/data');
    const [container, config] = create.mock.calls[0] as [
      string,
      { userId: string }
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-advanced-video-editor-user');
    expect(initAdvancedVideoEditor).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      `https://example.test/data${SCENE}`
    );
    expect((globalThis.window as { cesdk?: unknown }).cesdk).toBe(editor);
    expect(reportDemoPhase.mock.calls).toEqual([['created'], ['ready']]);
  });

  it('reports a failed start-up instead of leaving an unhandled rejection', async () => {
    const failure = new Error('no license');
    create.mockRejectedValue(failure);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await import('../../src/index');
    await vi.waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to initialize CE.SDK:',
        failure
      )
    );

    expect(initAdvancedVideoEditor).not.toHaveBeenCalled();
    expect(reportDemoPhase.mock.calls).toEqual([['failed']]);
    consoleError.mockRestore();
  });
});
