import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions as setupDesignActions } from '../../src/imgly/config/design/actions';
import { setupTranslations as setupDesignTranslations } from '../../src/imgly/config/design/i18n';
import { setupKeyboardShortcuts as setupDesignShortcuts } from '../../src/imgly/config/design/keyboard/keyboard';
import { setupSettings as setupDesignSettings } from '../../src/imgly/config/design/settings';
import { setupUI as setupDesignUI } from '../../src/imgly/config/design/ui';
import { setupVideoTimeline as setupDesignVideoTimeline } from '../../src/imgly/config/design/ui/videoTimeline';
import { setupActions as setupVideoActions } from '../../src/imgly/config/video/actions';
import { setupTranslations as setupVideoTranslations } from '../../src/imgly/config/video/i18n';
import { setupKeyboardShortcuts as setupVideoShortcuts } from '../../src/imgly/config/video/keyboard/keyboard';
import { setupSettings as setupVideoSettings } from '../../src/imgly/config/video/settings';
import { setupUI as setupVideoUI } from '../../src/imgly/config/video/ui';

type Setup = (cesdk: CreativeEditorSDK) => void;

function record(setup: Setup) {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  return spy;
}

function settingsOf(setup: (engine: CreativeEngine) => void) {
  const spy = createApiSpy<CreativeEngine>();
  setup(spy.api);
  return new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );
}

// ADG-U8
describe('ADG-U8 engine settings', () => {
  const design = settingsOf(setupDesignSettings);
  const video = settingsOf(setupVideoSettings);

  it.each([
    ['doubleClickToCropEnabled', true],
    ['doubleClickSelectionMode', 'Hierarchical'],
    ['page/allowCropInteraction', true],
    ['page/dimOutOfPageAreas', true],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['placeholderControls/showOverlay', true],
    ['placeholderControls/showButton', true]
  ])('both editors set %s to %s', (key, value) => {
    expect(design.get(key as string)).toBe(value);
    expect(video.get(key as string)).toBe(value);
  });

  it('shows the page title in the design editor and hides it in the video one', () => {
    expect(design.get('page/title/show')).toBe(true);
    expect(video.get('page/title/show')).toBe(false);
  });

  it('restricts the video colour picker to RGB and leaves the design one open', () => {
    expect(design.get('colorPicker/colorMode')).toBe('Any');
    expect(video.get('colorPicker/colorMode')).toBe('RGB');
  });

  it('shows every track in the video editor only', () => {
    expect(video.get('timeline/trackVisibility')).toBe('all');
    expect(design.has('timeline/trackVisibility')).toBe(false);
  });
});

// ADG-U9
describe('ADG-U9 UI setup', () => {
  function uiOf(setup: Setup) {
    const spy = record(setup);
    return {
      spy,
      orders: new Map(
        spy
          .callsTo('ui.setComponentOrder')
          .map(({ args }) => [
            JSON.stringify(args[0]),
            args[1] as (string | { id: string; key?: string })[]
          ])
      )
    };
  }

  const design = uiOf(setupDesignUI);
  const video = uiOf(setupVideoUI);

  it('docks the inspector and the asset library on the left in both editors', () => {
    for (const ui of [design, video]) {
      expect(
        ui.spy.callsTo('ui.setPanelPosition').map(({ args }) => args)
      ).toEqual([
        ['//ly.img.panel/inspector', 'left'],
        ['//ly.img.panel/assetLibrary', 'left']
      ]);
      expect(ui.spy.callsTo('ui.setPanelFloating')).toHaveLength(2);
    }
  });

  it('gives the inspector bar a Crop-mode order of its own', () => {
    for (const ui of [design, video]) {
      expect(
        ui.orders.get(
          '{"in":"ly.img.inspector.bar","when":{"editMode":"Crop"}}'
        )
      ).toEqual(['ly.img.cropControls.inspectorBar']);
    }
  });

  it('puts the canvas bar at the bottom of both editors', () => {
    for (const ui of [design, video]) {
      expect(
        ui.orders.get('{"in":"ly.img.canvas.bar","at":"bottom"}')
      ).toContain('ly.img.spacer');
    }
  });

  it('leaves the timeline out of the design editor', () => {
    expect(
      [...design.orders.keys()].some((key) => key.includes('timeline'))
    ).toBe(false);
  });
});

// ADG-U10
describe('ADG-U10 translations, shortcuts and the unwired timeline', () => {
  it.each([
    ['design', setupDesignTranslations],
    ['video', setupVideoTranslations]
  ])('the %s editor overrides no label', (_name, setup) => {
    expect(record(setup as Setup).callsTo('i18n.setTranslations')).toEqual([]);
  });

  it.each([
    ['design', setupDesignShortcuts],
    ['video', setupVideoShortcuts]
  ])('the %s editor installs the US ANSI catalog', (_name, setup) => {
    const [catalog] = record(setup as Setup).lastArgsOf('shortcuts.set') ?? [];

    expect(Array.isArray(catalog)).toBe(true);
    expect((catalog as unknown[]).length).toBeGreaterThan(0);
  });

  it('ships the design editor timeline helper unwired', () => {
    expect(record(setupDesignVideoTimeline).calls).toEqual([]);
  });
});

// ADG-U11
describe('ADG-U11 action handlers', () => {
  function handlersOf(setup: Setup) {
    const spy = record(setup);
    return {
      spy,
      handlers: new Map(
        spy
          .callsTo('actions.register')
          .map(({ args }) => [
            args[0] as string,
            args[1] as (...params: never[]) => unknown
          ])
      )
    };
  }

  it('exports a design with the options it is given', async () => {
    const { spy, handlers } = handlersOf(setupDesignActions);

    await handlers.get('exportDesign')?.({ mimeType: 'image/png' } as never);

    expect(spy.lastArgsOf('utils.export')).toEqual([{ mimeType: 'image/png' }]);
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });

  it('defaults the video bitrate and lets the caller override it', async () => {
    const { spy, handlers } = handlersOf(setupVideoActions);

    await handlers.get('exportDesign')?.({ mimeType: 'video/mp4' } as never);
    expect(spy.lastArgsOf('utils.export')).toEqual([
      { videoBitrate: 'Auto', mimeType: 'video/mp4' }
    ]);

    await handlers.get('exportDesign')?.({ videoBitrate: 8_000_000 } as never);
    expect(spy.lastArgsOf('utils.export')).toEqual([
      { videoBitrate: 8_000_000 }
    ]);
  });

  it('saves a design scene as a text file', async () => {
    const { spy, handlers } = handlersOf(setupDesignActions);

    await handlers.get('saveScene')?.();

    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('writes an archive only when the scene export asks for one', async () => {
    const { spy, handlers } = handlersOf(setupDesignActions);

    await handlers.get('exportScene')?.({} as never);
    expect(spy.callsTo('engine.scene.saveToArchive')).toHaveLength(0);

    await handlers.get('exportScene')?.({ format: 'archive' } as never);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe('application/zip');
  });

  it('passes an upload straight through with its context', () => {
    const { spy, handlers } = handlersOf(setupDesignActions);
    const file = { name: 'photo.png' };

    handlers.get('uploadFile')?.(
      file as never,
      undefined as never,
      {
        kind: 'image'
      } as never
    );

    expect(spy.lastArgsOf('utils.localUpload')).toEqual([
      file,
      { kind: 'image' }
    ]);
  });

  it('loads one picked file and then fits the first page', async () => {
    // `importScene` revokes the object URL it was handed, so this double
    // answers `loadFile` with a real one rather than a recording proxy.
    const blobURL = URL.createObjectURL(new Blob(['scene']));
    const loaded: string[] = [];
    const ran: [string, unknown][] = [];
    const handlers = new Map<string, (...args: never[]) => unknown>();
    const cesdk = {
      actions: {
        register: (id: string, handler: (...args: never[]) => unknown) => {
          handlers.set(id, handler);
        },
        run: async (id: string, options: unknown) => {
          ran.push([id, options]);
        }
      },
      utils: {
        loadFile: async () => blobURL,
        downloadFile: async () => undefined,
        export: async () => ({ blobs: [], options: {} }),
        localUpload: async () => ''
      },
      engine: {
        scene: {
          load: async (url: string) => {
            loaded.push(url);
          },
          saveToString: async () => '',
          saveToArchive: async () => new Blob([])
        }
      }
    };
    setupDesignActions(cesdk as unknown as CreativeEditorSDK);

    await handlers.get('importScene')?.();

    expect(loaded).toEqual([blobURL]);
    expect(ran).toEqual([['zoom.toPage', { page: 'first' }]]);
  });
});
