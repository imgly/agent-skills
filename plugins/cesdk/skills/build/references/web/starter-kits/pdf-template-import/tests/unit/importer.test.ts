import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  init: vi.fn(),
  fromFile: vi.fn(),
  addGfontsAssetLibrary: vi.fn()
}));

vi.mock('@cesdk/engine', () => ({ default: { init: mocks.init } }));

vi.mock('@imgly/pdf-importer', () => ({
  PDFParser: { fromFile: mocks.fromFile },
  addGfontsAssetLibrary: mocks.addGfontsAssetLibrary
}));

import { importPdfFile } from '../../src/imgly/plugins/pdf-importer';

const LOCAL_ASSETS = 'http://localhost:5199/local/cesdk-js/assets/';
const MESSAGES = [{ code: 'A', type: 'warning', message: 'ho', params: {} }];

function fakeEngine(pages: number[] = [42]) {
  return {
    scene: {
      getPages: vi.fn(() => pages),
      saveToArchive: vi.fn(async () => new Blob(['archive']))
    },
    block: { export: vi.fn(async () => new Blob(['png'])) },
    dispose: vi.fn()
  };
}

function fakeParser(messages = MESSAGES) {
  return {
    parse: vi.fn(async () => ({ logger: { getMessages: () => messages } }))
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('VITE_IMGLY_LOCAL_ASSETS_URL', LOCAL_ASSETS);
});

describe('PDF-U3 importPdfFile passes the kit options on', () => {
  it('sends the license and the base URL to the engine', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await importPdfFile(new Blob(['bytes']), 'design.pdf', {
      license: 'a-license',
      baseURL: 'https://assets.example.com/'
    });

    expect(mocks.init).toHaveBeenCalledWith({
      baseURL: 'https://assets.example.com/',
      license: 'a-license'
    });
  });

  it('falls back to the local asset URL when neither is given', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await importPdfFile(new Blob(['bytes']), 'design.pdf');

    expect(mocks.init).toHaveBeenCalledWith({ baseURL: LOCAL_ASSETS });
  });

  it('hands the parser the engine and the file bytes', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());
    const file = new Blob(['file-bytes']);

    await importPdfFile(file, 'design.pdf');

    expect(mocks.addGfontsAssetLibrary).toHaveBeenCalledWith(engine);
    const [passedEngine, passedBuffer] = mocks.fromFile.mock.calls[0];
    expect(passedEngine).toBe(engine);
    expect(passedBuffer).toBeInstanceOf(ArrayBuffer);
    expect(new TextDecoder().decode(passedBuffer as ArrayBuffer)).toBe(
      'file-bytes'
    );
  });

  it('exports the first page at 1000 x 1000 by default', async () => {
    const engine = fakeEngine([7, 8]);
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await importPdfFile(new Blob(['bytes']), 'design.pdf');

    expect(engine.block.export).toHaveBeenCalledWith(7, {
      mimeType: 'image/png',
      targetWidth: 1000,
      targetHeight: 1000
    });
  });

  it('exports at the requested preview size', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await importPdfFile(new Blob(['bytes']), 'design.pdf', {
      previewWidth: 320,
      previewHeight: 240
    });

    expect(engine.block.export).toHaveBeenCalledWith(42, {
      mimeType: 'image/png',
      targetWidth: 320,
      targetHeight: 240
    });
  });

  it('returns the parser messages, the file name and two object URLs', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    const result = await importPdfFile(new Blob(['bytes']), 'design.pdf');

    expect(result.fileName).toBe('design.pdf');
    expect(result.messages).toEqual(MESSAGES);
    expect(result.imageUrl).toMatch(/^blob:/);
    expect(result.sceneArchiveUrl).toMatch(/^blob:/);
    expect(result.imageUrl).not.toBe(result.sceneArchiveUrl);
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('returns an empty message list when the parser reports no logger', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue({
      parse: vi.fn(async () => ({ logger: undefined }))
    });

    const result = await importPdfFile(new Blob(['bytes']), 'design.pdf');

    expect(result.messages).toEqual([]);
  });
});

describe('PDF-U4 importPdfFile failure paths', () => {
  it('propagates a parser failure and still disposes the engine', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockRejectedValue(new Error('broken pdf'));

    await expect(
      importPdfFile(new Blob(['bytes']), 'design.pdf')
    ).rejects.toThrow('broken pdf');
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('fails with a readable message when the file yields no page', async () => {
    const engine = fakeEngine([]);
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await expect(
      importPdfFile(new Blob(['bytes']), 'design.pdf')
    ).rejects.toThrow('No pages found in PDF file');
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('does not dispose an engine that never started', async () => {
    mocks.init.mockRejectedValue(new Error('no license'));

    await expect(
      importPdfFile(new Blob(['bytes']), 'design.pdf')
    ).rejects.toThrow('no license');
    expect(mocks.fromFile).not.toHaveBeenCalled();
  });
});
