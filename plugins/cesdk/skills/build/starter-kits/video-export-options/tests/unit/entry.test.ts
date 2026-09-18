import { vi } from 'vitest';

// `src/index.ts` publishes the editor on `window`.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const create = vi.fn();
const initVideoExportOptionsEditor = vi.fn(async () => undefined);
const reportDemoPhase = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({ default: { create } }));
vi.mock('../../src/imgly', () => ({ initVideoExportOptionsEditor }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({ reportDemoPhase }));

function phases(): string[] {
  return reportDemoPhase.mock.calls.map(([phase]) => phase as string);
}

const editor = {
  load: vi.fn(async () => undefined),
  ui: { openPanel: vi.fn() }
};

describe('VEO-U16 src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    create.mockReset();
    initVideoExportOptionsEditor.mockClear();
    editor.load.mockClear();
    editor.ui.openPanel.mockClear();
    reportDemoPhase.mockClear();
  });

  afterEach(() => {
    delete (globalThis.window as { cesdk?: unknown }).cesdk;
  });

  it('loads the demo scene and opens the export panel', async () => {
    create.mockResolvedValue(editor);

    await import('../../src/index');
    await vi.waitFor(() =>
      expect(editor.ui.openPanel).toHaveBeenCalledTimes(1)
    );

    const [container, config] = create.mock.calls[0] as [
      string,
      { userId: string }
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-video-export-options-user');
    expect(initVideoExportOptionsEditor).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      expect.stringContaining('/assets/example-video-motion.scene')
    );
    expect(editor.ui.openPanel).toHaveBeenCalledWith(
      '//ly.img.panel/video-export'
    );
    expect((globalThis.window as { cesdk?: unknown }).cesdk).toBe(editor);
  });

  it('reports the demo phases around the editor it built', async () => {
    create.mockResolvedValue(editor);

    await import('../../src/index');
    await vi.waitFor(() => expect(phases()).toEqual(['created', 'ready']));
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

    expect(initVideoExportOptionsEditor).not.toHaveBeenCalled();
    expect(phases()).toEqual(['failed']);
    consoleError.mockRestore();
  });
});
