import { vi } from 'vitest';

// `src/index.ts` publishes the editor on `window`.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const create = vi.fn();
const initVectorizerEditor = vi.fn(async () => undefined);
const reportDemoPhase = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({ default: { create } }));
vi.mock('../../src/imgly', () => ({ initVectorizerEditor }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));

const block = {
  findByKind: vi.fn(() => [7] as number[]),
  select: vi.fn()
};
const editor = {
  load: vi.fn(async () => undefined),
  engine: { block }
};

describe('V-U11 src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    create.mockReset();
    initVectorizerEditor.mockClear();
    editor.load.mockClear();
    reportDemoPhase.mockClear();
    block.findByKind.mockReset();
    block.findByKind.mockReturnValue([7]);
    block.select.mockClear();
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

  it('loads the archive from the configured base URL and selects the image', async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', 'https://example.test/data');
    create.mockResolvedValue(editor);

    const entry = await import('../../src/index');
    await vi.waitFor(() => expect(block.select).toHaveBeenCalledTimes(1));

    expect(entry.DEMO_ASSETS_BASE_URL).toBe('https://example.test/data');
    const [container, config] = create.mock.calls[0] as [
      string,
      { userId: string }
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-vectorizer-editor-user');
    expect(initVectorizerEditor).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      'https://example.test/data/assets/scene/scene.scene'
    );
    expect(block.findByKind).toHaveBeenCalledWith('image');
    expect(block.select).toHaveBeenCalledWith(7);
    expect((globalThis.window as { cesdk?: unknown }).cesdk).toBe(editor);
    expect(reportDemoPhase.mock.calls).toEqual([['created'], ['ready']]);
  });

  it('selects nothing when the scene carries no image', async () => {
    create.mockResolvedValue(editor);
    block.findByKind.mockReturnValue([]);

    await import('../../src/index');
    await vi.waitFor(() => expect(block.findByKind).toHaveBeenCalledTimes(1));

    expect(block.select).not.toHaveBeenCalled();
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

    expect(initVectorizerEditor).not.toHaveBeenCalled();
    expect(reportDemoPhase.mock.calls).toEqual([['failed']]);
    consoleError.mockRestore();
  });
});
