import { vi } from 'vitest';

// `src/index.ts` publishes the editor on `window`.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const create = vi.fn();
const initQRCodeEditor = vi.fn(async () => undefined);
const reportDemoPhase = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({ default: { create } }));
vi.mock('../../src/imgly', () => ({ initQRCodeEditor }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));

const QR_PLUGIN = '@imgly/plugin-qr-code-web';

const block = {
  findAll: vi.fn(() => [11, 12] as number[]),
  findAllMetadata: vi.fn((id: number) => (id === 12 ? [QR_PLUGIN] : [])),
  select: vi.fn()
};
const editor = {
  load: vi.fn(async () => undefined),
  engine: { block }
};

describe('QR-U11 src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    create.mockReset();
    initQRCodeEditor.mockClear();
    editor.load.mockClear();
    reportDemoPhase.mockClear();
    block.findAll.mockReset();
    block.findAll.mockReturnValue([11, 12]);
    block.findAllMetadata.mockReset();
    block.findAllMetadata.mockImplementation((id: number) =>
      id === 12 ? [QR_PLUGIN] : []
    );
    block.select.mockClear();
  });

  afterEach(() => {
    delete (globalThis.window as { cesdk?: unknown }).cesdk;
  });

  it('loads the demo archive and selects the QR code block', async () => {
    create.mockResolvedValue(editor);

    await import('../../src/index');
    await vi.waitFor(() => expect(block.select).toHaveBeenCalledTimes(1));

    const [container, config] = create.mock.calls[0] as [
      string,
      { userId: string }
    ];
    expect(container).toBe('#cesdk_container');
    expect(config.userId).toBe('starterkit-qr-code-editor-user');
    expect(initQRCodeEditor).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      'http://localhost/assets/scene.archive'
    );
    expect(block.select).toHaveBeenCalledWith(12);
    expect((globalThis.window as { cesdk?: unknown }).cesdk).toBe(editor);
    expect(reportDemoPhase.mock.calls).toEqual([['created'], ['ready']]);
  });

  it('selects nothing when no block carries the QR code metadata', async () => {
    create.mockResolvedValue(editor);
    block.findAllMetadata.mockReturnValue([]);

    await import('../../src/index');
    await vi.waitFor(() => expect(block.findAll).toHaveBeenCalledTimes(1));

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

    expect(initQRCodeEditor).not.toHaveBeenCalled();
    expect(reportDemoPhase.mock.calls).toEqual([['failed']]);
    consoleError.mockRestore();
  });
});
