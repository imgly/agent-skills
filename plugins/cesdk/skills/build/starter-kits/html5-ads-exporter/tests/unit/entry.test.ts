import { vi } from 'vitest';

// `src/index.ts` reads `window` at module scope and publishes the editor on it.
vi.hoisted(() => {
  const global = globalThis as { window?: unknown };
  global.window ??= globalThis;
  (global.window as { location?: unknown }).location ??= new URL(
    'http://localhost/'
  );
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const create = vi.fn();
const initHtml5ExporterEditor = vi.fn(async () => undefined);
const reportDemoPhase = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({ default: { create } }));
vi.mock('../../src/imgly', () => ({ initHtml5ExporterEditor }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));

const editor = { load: vi.fn(async () => undefined) };

describe('H5-U16 src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    create.mockReset();
    initHtml5ExporterEditor.mockClear();
    editor.load.mockClear();
    reportDemoPhase.mockClear();
  });

  afterEach(() => {
    delete (globalThis.window as { cesdk?: unknown }).cesdk;
  });

  it('creates the editor and loads the banner archive from the published demo assets', async () => {
    create.mockResolvedValue(editor);

    const module = await import('../../src/index');
    await vi.waitFor(() => expect(editor.load).toHaveBeenCalledTimes(1));

    const [container, config] = create.mock.calls[0] as [
      string,
      { userId: string }
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-html5-ads-exporter-user');
    expect(initHtml5ExporterEditor).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      `${module.DEMO_ASSETS_BASE_URL}/assets/html5-banner.zip`
    );
    expect((globalThis.window as { cesdk?: unknown }).cesdk).toBe(editor);
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['created', 'ready']);
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

    expect(initHtml5ExporterEditor).not.toHaveBeenCalled();
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['failed']);
    consoleError.mockRestore();
  });
});
