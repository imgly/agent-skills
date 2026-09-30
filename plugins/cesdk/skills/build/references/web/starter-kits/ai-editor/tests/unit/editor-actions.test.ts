import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { createApiSpy, type ApiSpy } from '@imgly/kit-test-harness/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupActions as setupDesignActions } from '../../src/imgly/config/design-editor/actions';
import { setupActions as setupPhotoActions } from '../../src/imgly/config/photo-editor/actions';
import { setupActions as setupVideoActions } from '../../src/imgly/config/video-editor/actions';

type Handler = (...args: never[]) => unknown;

function registered(spy: ApiSpy<CreativeEditorSDK>): Map<string, Handler> {
  return new Map(
    spy
      .callsTo('actions.register')
      .map(({ args }) => [args[0] as string, args[1] as Handler])
  );
}

beforeEach(() => {
  // `importScene` hands the engine an object URL and revokes it; jsdom refuses
  // a value that is not a real blob URL.
  vi.stubGlobal('URL', { ...URL, revokeObjectURL: vi.fn() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each([
  ['the photo editor', setupPhotoActions],
  ['the video editor', setupVideoActions]
])('AIE-U17 the actions of %s', (_tree, setupActions) => {
  it('AIE-U17 overrides the export action only', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupActions(spy.api);
    const actions = registered(spy);

    expect([...actions.keys()]).toEqual(['exportDesign']);

    await actions.get('exportDesign')!({ mimeType: 'image/png' } as never);
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });
});

describe('AIE-U18 the actions of the design editor', () => {
  function setup() {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupDesignActions(spy.api);
    return { spy, actions: registered(spy) };
  }

  it('AIE-U18 registers the five actions the kit overrides', () => {
    const { actions } = setup();

    expect([...actions.keys()]).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });

  it('AIE-U18 saves the scene as a plain-text download', async () => {
    const { spy, actions } = setup();

    await actions.get('saveScene')!();

    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('AIE-U18 downloads the first blob the export produces', async () => {
    const { spy, actions } = setup();

    await actions.get('exportDesign')!({ mimeType: 'image/png' } as never);

    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'image/png'
    });
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });

  it('AIE-U18 imports one picker for scenes and archives alike', async () => {
    const { spy, actions } = setup();

    await actions.get('importScene')!();

    expect(spy.lastArgsOf('utils.loadFile')?.[0]).toEqual({
      accept: '.imgly,.scene,.zip',
      returnType: 'objectURL'
    });
    expect(spy.callsTo('engine.scene.load')).toHaveLength(1);
    expect(spy.lastArgsOf('actions.run')).toEqual([
      'zoom.toPage',
      { page: 'first' }
    ]);
  });

  it.each([
    ['scene', 'text/plain;charset=UTF-8', 'engine.scene.saveToString'],
    ['archive', 'application/zip', 'engine.scene.saveToArchive']
  ])(
    'AIE-U18 exports the scene as a %s',
    async (format, mimeType, savePath) => {
      const { spy, actions } = setup();

      await actions.get('exportScene')!({ format } as never);

      expect(spy.callsTo(savePath)).toHaveLength(1);
      expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(mimeType);
    }
  );

  it('AIE-U18 defaults the scene export to the JSON format', async () => {
    const { spy, actions } = setup();

    await actions.get('exportScene')!({} as never);

    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.callsTo('engine.scene.saveToArchive')).toHaveLength(0);
  });

  it('AIE-U18 hands an upload to the local upload helper', () => {
    const { spy, actions } = setup();
    const file = { name: 'photo.png' };
    const context = { uploadSourceId: 'ly.img.image.upload' };

    actions.get('uploadFile')!(
      file as never,
      vi.fn() as never,
      context as never
    );

    expect(spy.lastArgsOf('utils.localUpload')).toEqual([file, context]);
  });
});
