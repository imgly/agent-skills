import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';

type ActionHandler = (...args: unknown[]) => unknown;

const PNG_BLOB = 'png-blob';

function createEditor() {
  const handlers = new Map<string, ActionHandler>();
  const editor = {
    actions: {
      register: vi.fn((id: string, handler: ActionHandler) => {
        handlers.set(id, handler);
      }),
      run: vi.fn(async () => undefined)
    },
    utils: {
      export: vi.fn(async () => ({
        blobs: [PNG_BLOB],
        options: { mimeType: 'image/png' }
      })),
      downloadFile: vi.fn(async () => undefined),
      loadFile: vi.fn(async () => 'blob:picked'),
      localUpload: vi.fn(async () => 'blob:uploaded')
    },
    engine: {
      scene: {
        saveToString: vi.fn(async () => 'scene-json'),
        saveToArchive: vi.fn(async () => 'archive-zip'),
        load: vi.fn(async () => undefined)
      }
    }
  };
  setupActions(editor as unknown as CreativeEditorSDK);
  return {
    editor,
    run: async (id: string, ...args: unknown[]) => handlers.get(id)!(...args)
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Stubbed so the test can assert the revoke the import action performs.
  URL.revokeObjectURL = vi.fn();
});

describe('IDML-U9 setupActions registers the kit workflow', () => {
  it('registers exactly the actions the kit overrides', () => {
    const { editor } = createEditor();
    expect(editor.actions.register.mock.calls.map(([id]) => id)).toEqual([
      'saveScene',
      'exportDesign',
      'exportScene',
      'importScene',
      'uploadFile'
    ]);
  });

  it('saves the scene as a text file', async () => {
    const { editor, run } = createEditor();
    await run('saveScene');
    expect(editor.engine.scene.saveToString).toHaveBeenCalledTimes(1);
    expect(editor.utils.downloadFile).toHaveBeenCalledWith(
      'scene-json',
      'text/plain;charset=UTF-8'
    );
  });

  it('exports the design with the options it was given', async () => {
    const { editor, run } = createEditor();
    await run('exportDesign', { mimeType: 'image/png', targetWidth: 1080 });
    expect(editor.utils.export).toHaveBeenCalledWith({
      mimeType: 'image/png',
      targetWidth: 1080
    });
  });

  it('downloads the first exported blob under the mime type the export chose', async () => {
    const { editor, run } = createEditor();
    editor.utils.export.mockResolvedValue({
      blobs: [PNG_BLOB, 'second-page'],
      options: { mimeType: 'application/pdf' }
    });
    await run('exportDesign', {});
    expect(editor.utils.downloadFile).toHaveBeenCalledWith(
      PNG_BLOB,
      'application/pdf'
    );
  });

  it('exports the scene as text when no format is asked for', async () => {
    const { editor, run } = createEditor();
    await run('exportScene', {});
    expect(editor.engine.scene.saveToArchive).not.toHaveBeenCalled();
    expect(editor.utils.downloadFile).toHaveBeenCalledWith(
      'scene-json',
      'text/plain;charset=UTF-8'
    );
  });

  it('exports the scene as a zip archive when the archive format is asked for', async () => {
    const { editor, run } = createEditor();
    await run('exportScene', { format: 'archive' });
    expect(editor.engine.scene.saveToString).not.toHaveBeenCalled();
    expect(editor.utils.downloadFile).toHaveBeenCalledWith(
      'archive-zip',
      'application/zip'
    );
  });

  it('opens one picker for every scene format the engine reads', async () => {
    const { editor, run } = createEditor();
    await run('importScene');
    expect(editor.utils.loadFile).toHaveBeenCalledWith({
      accept: '.imgly,.scene,.zip',
      returnType: 'objectURL'
    });
  });

  it('loads the picked scene, releases its object URL and refits the first page', async () => {
    const { editor, run } = createEditor();
    await run('importScene');
    expect(editor.engine.scene.load).toHaveBeenCalledWith('blob:picked');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:picked');
    expect(editor.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      page: 'first'
    });
  });

  it('releases the object URL when the scene fails to load', async () => {
    const { editor, run } = createEditor();
    editor.engine.scene.load.mockRejectedValue(new Error('broken scene'));
    await expect(run('importScene')).rejects.toThrow('broken scene');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:picked');
    expect(editor.actions.run).not.toHaveBeenCalled();
  });

  it('uploads a file locally, keeping it in the browser', async () => {
    const { editor, run } = createEditor();
    const file = new File(['bytes'], 'photo.png');
    const onProgress = vi.fn();
    await run('uploadFile', file, onProgress, 'image');
    expect(editor.utils.localUpload).toHaveBeenCalledWith(file, 'image');
    expect(onProgress).not.toHaveBeenCalled();
  });
});
