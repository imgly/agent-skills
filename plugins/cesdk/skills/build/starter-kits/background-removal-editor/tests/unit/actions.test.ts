import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';

type Handler = (...args: never[]) => unknown;

function registerActions() {
  const handlers = new Map<string, Handler>();
  const cesdk = {
    actions: {
      register: (id: string, handler: Handler) => {
        handlers.set(id, handler);
      },
      run: vi.fn(async () => undefined)
    },
    engine: {
      scene: {
        saveToString: vi.fn(async () => '{"scene":"json"}'),
        saveToArchive: vi.fn(async () => new Blob(['archive'])),
        load: vi.fn(async () => undefined)
      }
    },
    utils: {
      export: vi.fn(async () => ({
        blobs: [new Blob(['png'])],
        options: { mimeType: 'image/png' }
      })),
      downloadFile: vi.fn(async () => undefined),
      loadFile: vi.fn(async () => 'blob:kit-test'),
      localUpload: vi.fn(async () => 'blob:upload')
    }
  };
  setupActions(cesdk as unknown as CreativeEditorSDK);
  const run = (id: string, ...args: never[]) => {
    const handler = handlers.get(id);
    if (handler == null) {
      throw new Error(`The kit registered no ${id} action.`);
    }
    return handler(...args);
  };
  return { cesdk, run };
}

describe('BGR-U8 the actions the kit registers', () => {
  it('saveScene downloads the scene as text', async () => {
    const { cesdk, run } = registerActions();

    await run('saveScene');

    expect(cesdk.engine.scene.saveToString).toHaveBeenCalledTimes(1);
    expect(cesdk.utils.downloadFile).toHaveBeenCalledWith(
      '{"scene":"json"}',
      'text/plain;charset=UTF-8'
    );
  });

  it('importScene accepts the three scene formats and revokes the blob URL', async () => {
    const { cesdk, run } = registerActions();
    const revoke = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    await run('importScene');

    expect(cesdk.utils.loadFile).toHaveBeenCalledWith({
      accept: '.imgly,.scene,.zip',
      returnType: 'objectURL'
    });
    expect(cesdk.engine.scene.load).toHaveBeenCalledWith('blob:kit-test');
    expect(revoke).toHaveBeenCalledWith('blob:kit-test');
    expect(cesdk.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      page: 'first'
    });
    revoke.mockRestore();
  });

  it('importScene revokes the blob URL even when the scene fails to load', async () => {
    const { cesdk, run } = registerActions();
    const revoke = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});
    cesdk.engine.scene.load.mockRejectedValueOnce(new Error('broken scene'));

    await expect(run('importScene')).rejects.toThrow('broken scene');

    expect(revoke).toHaveBeenCalledWith('blob:kit-test');
    expect(cesdk.actions.run).not.toHaveBeenCalled();
    revoke.mockRestore();
  });

  it('exportScene writes a JSON scene by default', async () => {
    const { cesdk, run } = registerActions();

    await run('exportScene', ...([{}] as never[]));

    expect(cesdk.engine.scene.saveToString).toHaveBeenCalledTimes(1);
    expect(cesdk.engine.scene.saveToArchive).not.toHaveBeenCalled();
    expect(cesdk.utils.downloadFile).toHaveBeenCalledWith(
      '{"scene":"json"}',
      'text/plain;charset=UTF-8'
    );
  });

  it('exportScene writes a zip archive when asked for one', async () => {
    const { cesdk, run } = registerActions();

    await run('exportScene', ...([{ format: 'archive' }] as never[]));

    expect(cesdk.engine.scene.saveToArchive).toHaveBeenCalledTimes(1);
    expect(cesdk.engine.scene.saveToString).not.toHaveBeenCalled();
    expect(cesdk.utils.downloadFile).toHaveBeenCalledWith(
      expect.any(Blob),
      'application/zip'
    );
  });

  it('uploadFile hands the file to the local upload helper', async () => {
    const { cesdk, run } = registerActions();
    const file = new File(['bytes'], 'photo.png', { type: 'image/png' });

    const url = await run(
      'uploadFile',
      ...([file, undefined, 'image'] as never[])
    );

    expect(cesdk.utils.localUpload).toHaveBeenCalledWith(file, 'image');
    expect(url).toBe('blob:upload');
  });
});
