import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  init: vi.fn(),
  fromFile: vi.fn(),
  addGfontsAssetLibrary: vi.fn(),
  createPdfEmbeddedImporter: vi.fn((parser: unknown) => ({
    format: 'PDF',
    parser
  }))
}));

vi.mock('@cesdk/engine', () => ({ default: { init: mocks.init } }));

vi.mock('@imgly/idml-importer', () => ({
  IDMLParser: { fromFile: mocks.fromFile },
  addGfontsAssetLibrary: mocks.addGfontsAssetLibrary,
  createPdfEmbeddedImporter: mocks.createPdfEmbeddedImporter
}));

vi.mock('@imgly/pdf-importer', () => ({ PDFParser: class FakePDFParser {} }));

import { importIdmlFile } from '../../src/imgly/plugins/idml-importer';

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

describe('IDML-U3 importIdmlFile passes the kit options on', () => {
  it('sends the license and the base URL to the engine', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await importIdmlFile(new Blob(['bytes']), 'design.idml', {
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

    await importIdmlFile(new Blob(['bytes']), 'design.idml');

    expect(mocks.init).toHaveBeenCalledWith({ baseURL: LOCAL_ASSETS });
  });

  it('hands the parser the file itself, an XML parser and the embedded PDF importer', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());
    const file = new Blob(['<idml/>']);

    await importIdmlFile(file, 'design.idml');

    expect(mocks.addGfontsAssetLibrary).toHaveBeenCalledWith(engine);
    const [passedEngine, passedFile, xmlParser, options] =
      mocks.fromFile.mock.calls[0];
    expect(passedEngine).toBe(engine);
    // The IDML parser reads the archive itself, so it takes the Blob, not bytes.
    expect(passedFile).toBe(file);
    const parseFromString = vi.fn(() => 'parsed');
    vi.stubGlobal(
      'DOMParser',
      class {
        parseFromString = parseFromString;
      }
    );
    expect(
      (xmlParser as (xml: string) => unknown)('<Root><Spread /></Root>')
    ).toBe('parsed');
    expect(parseFromString).toHaveBeenCalledWith(
      '<Root><Spread /></Root>',
      'text/xml'
    );
    expect(mocks.createPdfEmbeddedImporter).toHaveBeenCalledTimes(1);
    expect(
      (options as { embeddedImporters: { format: string }[] }).embeddedImporters
    ).toEqual([{ format: 'PDF', parser: expect.anything() }]);
  });

  it('exports the first page at 1000 x 1000 by default', async () => {
    const engine = fakeEngine([7, 8]);
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await importIdmlFile(new Blob(['bytes']), 'design.idml');

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

    await importIdmlFile(new Blob(['bytes']), 'design.idml', {
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

    const result = await importIdmlFile(new Blob(['bytes']), 'design.idml');

    expect(result.fileName).toBe('design.idml');
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

    const result = await importIdmlFile(new Blob(['bytes']), 'design.idml');

    expect(result.messages).toEqual([]);
  });
});

describe('IDML-U4 importIdmlFile failure paths', () => {
  it('propagates a parser failure and still disposes the engine', async () => {
    const engine = fakeEngine();
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockRejectedValue(new Error('broken idml'));

    await expect(
      importIdmlFile(new Blob(['bytes']), 'design.idml')
    ).rejects.toThrow('broken idml');
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('fails with a readable message when the file yields no page', async () => {
    const engine = fakeEngine([]);
    mocks.init.mockResolvedValue(engine);
    mocks.fromFile.mockResolvedValue(fakeParser());

    await expect(
      importIdmlFile(new Blob(['bytes']), 'design.idml')
    ).rejects.toThrow('No pages found in IDML file');
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('does not dispose an engine that never started', async () => {
    mocks.init.mockRejectedValue(new Error('no license'));

    await expect(
      importIdmlFile(new Blob(['bytes']), 'design.idml')
    ).rejects.toThrow('no license');
    expect(mocks.fromFile).not.toHaveBeenCalled();
  });
});
