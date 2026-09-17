import { vi } from 'vitest';

// `src/index.ts` publishes the editor on `window`.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const create = vi.fn();
const initPageSizesAssetSource = vi.fn(async () => undefined);
const reportDemoPhase = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({ default: { create } }));
vi.mock('../../src/imgly', () => ({ initPageSizesAssetSource }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));

const editor = {
  load: vi.fn(async () => undefined),
  ui: { openPanel: vi.fn() }
};

describe('PGS-U9 src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    create.mockReset();
    initPageSizesAssetSource.mockClear();
    editor.load.mockClear();
    reportDemoPhase.mockClear();
    editor.ui.openPanel.mockClear();
  });

  afterEach(() => {
    delete (globalThis.window as { cesdk?: unknown }).cesdk;
  });

  it('loads the demo scene and opens the page resize panel', async () => {
    create.mockResolvedValue(editor);

    await import('../../src/index');
    await vi.waitFor(() => expect(editor.load).toHaveBeenCalledTimes(1));

    const [container, config] = create.mock.calls[0] as [
      string,
      { userId: string }
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-page-sizes-asset-source-user');
    expect(initPageSizesAssetSource).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      'http://localhost/assets/page-sizes.scene'
    );
    expect(editor.ui.openPanel).toHaveBeenCalledWith(
      '//ly.img.panel/inspector/pageResize'
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

    expect(initPageSizesAssetSource).not.toHaveBeenCalled();
    expect(reportDemoPhase.mock.calls).toEqual([['failed']]);
    consoleError.mockRestore();
  });
});
