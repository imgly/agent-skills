import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const create = vi.fn();
const initBackgroundRemovalEditor = vi.fn(async () => undefined);
const reportDemoPhase = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({ default: { create } }));
vi.mock('../../src/imgly', () => ({ initBackgroundRemovalEditor }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({ reportDemoPhase }));

const editor = { load: vi.fn(async () => undefined) };

describe('BGR-U11 src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    create.mockReset();
    initBackgroundRemovalEditor.mockClear();
    editor.load.mockClear();
    reportDemoPhase.mockClear();
  });

  afterEach(() => {
    delete (globalThis.window as { cesdk?: unknown }).cesdk;
  });

  it('configures the editor and loads the demo scene', async () => {
    create.mockResolvedValue(editor as unknown as CreativeEditorSDK);

    await import('../../src/index');
    await vi.waitFor(() => expect(editor.load).toHaveBeenCalledTimes(1));

    const [container, config] = create.mock.calls[0] as [
      string,
      { userId: string }
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-background-removal-editor-user');
    expect(initBackgroundRemovalEditor).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      expect.stringContaining('/assets/scene.scene')
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

    expect(initBackgroundRemovalEditor).not.toHaveBeenCalled();
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['failed']);
    consoleError.mockRestore();
  });
});
