import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions as setupAdvancedActions } from '../../src/imgly/config/advanced-design-editor/actions';
import { setupFeatures as setupAdvancedFeatures } from '../../src/imgly/config/advanced-design-editor/features';
import { setupNavigationBar as setupAdvancedNavigationBar } from '../../src/imgly/config/advanced-design-editor/ui/navigationBar';
import { setupActions as setupDesignActions } from '../../src/imgly/config/design-editor/actions';
import { setupFeatures as setupDesignFeatures } from '../../src/imgly/config/design-editor/features';
import { setupNavigationBar as setupDesignNavigationBar } from '../../src/imgly/config/design-editor/ui/navigationBar';
import { setupTranslations as setupAdvancedTranslations } from '../../src/imgly/config/advanced-design-editor/i18n';
import { setupTranslations as setupDesignTranslations } from '../../src/imgly/config/design-editor/i18n';
import { setupKeyboardShortcuts as setupAdvancedShortcuts } from '../../src/imgly/config/advanced-design-editor/keyboard/keyboard';
import { setupKeyboardShortcuts as setupDesignShortcuts } from '../../src/imgly/config/design-editor/keyboard/keyboard';
import { setupSettings as setupAdvancedSettings } from '../../src/imgly/config/advanced-design-editor/settings';
import { setupSettings as setupDesignSettings } from '../../src/imgly/config/design-editor/settings';
import { setupUI as setupAdvancedUI } from '../../src/imgly/config/advanced-design-editor/ui';
import { setupUI as setupDesignUI } from '../../src/imgly/config/design-editor/ui';
import { setupVideoTimeline as setupAdvancedVideoTimeline } from '../../src/imgly/config/advanced-design-editor/ui/videoTimeline';
import { setupVideoTimeline as setupDesignVideoTimeline } from '../../src/imgly/config/design-editor/ui/videoTimeline';

type Setup = (cesdk: CreativeEditorSDK) => void;

function record(setup: Setup) {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  return spy;
}

function featuresOf(setup: Setup): string[] {
  const spy = record(setup);
  expect(spy.callsTo('feature.enable')).toHaveLength(1);
  expect(spy.callsTo('feature.disable')).toHaveLength(0);
  return spy.lastArgsOf('feature.enable')?.[0] as string[];
}

function actionIdsOf(setup: Setup): string[] {
  return record(setup)
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);
}

/** Flatten the navigation bar order, including the actions dropdown children. */
function navigationOrderOf(setup: Setup): string[] {
  const spy = record(setup);
  const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    (string | { id: string; children?: string[] })[]
  ];
  expect(target).toEqual({ in: 'ly.img.navigation.bar' });
  return order.flatMap((entry) =>
    typeof entry === 'string' ? [entry] : [entry.id, ...(entry.children ?? [])]
  );
}

describe('MIG-U3 features', () => {
  const design = featuresOf(setupDesignFeatures);
  const advanced = featuresOf(setupAdvancedFeatures);

  it('the design editor enables exactly the features the catalog editor needs', () => {
    expect(design).toEqual([
      'ly.img.adjustment',
      'ly.img.blendMode',
      'ly.img.blur',
      'ly.img.canvas.bar',
      'ly.img.canvas.menu',
      'ly.img.combine.exclude',
      'ly.img.combine.intersect',
      'ly.img.combine.subtract',
      'ly.img.combine.union',
      'ly.img.crop.fillAlignment',
      'ly.img.crop.fillMode',
      'ly.img.crop.flip',
      'ly.img.crop.panel.autoOpen',
      'ly.img.crop.position',
      'ly.img.crop.rotation',
      'ly.img.crop.scale',
      'ly.img.crop.size',
      'ly.img.cutout',
      'ly.img.delete',
      'ly.img.dock',
      'ly.img.duplicate',
      'ly.img.effect',
      'ly.img.fill.color.library',
      'ly.img.fill.color.picker.gradient',
      'ly.img.fill.color.picker.opacity',
      'ly.img.fill.image',
      'ly.img.filter',
      'ly.img.group.create',
      'ly.img.group.enter',
      'ly.img.group.select',
      'ly.img.group.ungroup',
      'ly.img.inspector.bar',
      'ly.img.inspector.toggle',
      'ly.img.keyboard.shortcuts',
      'ly.img.layerList.canvasFollow',
      'ly.img.layerList.layers',
      'ly.img.layerList.lock',
      'ly.img.layerList.menu',
      'ly.img.layerList.pages',
      'ly.img.layerList.panel',
      'ly.img.layerList.rename',
      'ly.img.layerList.reorder',
      // 'ly.img.layerList.thumbnails', /* Thumbnail on every row */
      'ly.img.layerList.visibility',
      'ly.img.library.panel',
      'ly.img.navigation.actions',
      'ly.img.navigation.back',
      'ly.img.navigation.bar',
      'ly.img.navigation.close',
      'ly.img.navigation.documentSettings',
      'ly.img.navigation.undoRedo',
      'ly.img.navigation.zoom',
      'ly.img.notifications.redo',
      'ly.img.notifications.undo',
      'ly.img.opacity',
      'ly.img.page.add',
      'ly.img.page.bleedMargin',
      'ly.img.page.clipContent',
      'ly.img.page.move',
      'ly.img.page.resize',
      'ly.img.page.settings',
      'ly.img.position.align',
      'ly.img.position.arrange',
      'ly.img.position.distribute',
      'ly.img.replace.audio',
      'ly.img.replace.fill',
      'ly.img.replace.shape',
      'ly.img.scene.layout.free',
      'ly.img.scene.layout.horizontal',
      'ly.img.scene.layout.spacing',
      'ly.img.scene.layout.vertical',
      'ly.img.shadow.blur',
      'ly.img.shadow.color.library',
      'ly.img.shadow.color.picker.opacity',
      'ly.img.shadow.offset',
      'ly.img.shape.options.cornerRadius',
      'ly.img.shape.options.innerDiameter',
      'ly.img.shape.options.lineWidth',
      'ly.img.shape.options.points',
      'ly.img.shape.options.sides',
      'ly.img.stroke.cap',
      'ly.img.stroke.color.library',
      'ly.img.stroke.color.picker.opacity',
      'ly.img.stroke.cornerGeometry',
      'ly.img.stroke.dash',
      'ly.img.stroke.position',
      'ly.img.stroke.style',
      'ly.img.stroke.width',
      'ly.img.text.advanced',
      'ly.img.text.alignment',
      'ly.img.text.background.library',
      'ly.img.text.background.picker.opacity',
      'ly.img.text.decoration',
      'ly.img.text.edit',
      'ly.img.text.fontSize',
      'ly.img.text.fontStyle',
      'ly.img.text.list.ordered',
      'ly.img.text.list.unordered',
      'ly.img.text.path.curve',
      'ly.img.text.path.direction',
      'ly.img.text.path.edit',
      'ly.img.text.path.offset',
      'ly.img.text.path.position',
      'ly.img.text.styles',
      'ly.img.text.typeface',
      'ly.img.transform.flip',
      'ly.img.transform.position',
      'ly.img.transform.rotation',
      'ly.img.transform.size',
      'ly.img.trim'
    ]);
  });

  it('the advanced editor enables exactly the creator features', () => {
    expect(advanced).toEqual([
      'ly.img.adjustment',
      'ly.img.blendMode',
      'ly.img.blur',
      'ly.img.canvas.bar',
      'ly.img.canvas.menu',
      'ly.img.combine.exclude',
      'ly.img.combine.intersect',
      'ly.img.combine.subtract',
      'ly.img.combine.union',
      'ly.img.crop.fillAlignment',
      'ly.img.crop.fillMode',
      'ly.img.crop.flip',
      'ly.img.crop.panel.autoOpen',
      'ly.img.crop.position',
      'ly.img.crop.rotation',
      'ly.img.crop.scale',
      'ly.img.crop.size',
      'ly.img.cutout',
      'ly.img.delete',
      'ly.img.dock',
      'ly.img.duplicate',
      'ly.img.effect',
      'ly.img.fill.color.library',
      'ly.img.fill.color.picker.gradient',
      'ly.img.fill.color.picker.opacity',
      'ly.img.fill.image',
      'ly.img.filter',
      'ly.img.group.create',
      'ly.img.group.enter',
      'ly.img.group.select',
      'ly.img.group.ungroup',
      'ly.img.inspector.bar',
      'ly.img.inspector.toggle',
      'ly.img.keyboard.shortcuts',
      'ly.img.layerList.canvasFollow',
      'ly.img.layerList.layers',
      'ly.img.layerList.lock',
      'ly.img.layerList.menu',
      'ly.img.layerList.pages',
      'ly.img.layerList.panel',
      'ly.img.layerList.rename',
      'ly.img.layerList.reorder',
      'ly.img.layerList.visibility',
      'ly.img.library.panel',
      'ly.img.navigation.actions',
      'ly.img.navigation.back',
      'ly.img.navigation.bar',
      'ly.img.navigation.close',
      'ly.img.navigation.undoRedo',
      'ly.img.navigation.zoom',
      'ly.img.notifications.redo',
      'ly.img.notifications.undo',
      'ly.img.opacity',
      'ly.img.page.add',
      'ly.img.page.bleedMargin',
      'ly.img.page.clipContent',
      'ly.img.page.move',
      'ly.img.page.resize',
      'ly.img.page.settings',
      'ly.img.placeholder.appearance.adjustments',
      'ly.img.placeholder.appearance.blur',
      'ly.img.placeholder.appearance.effect',
      'ly.img.placeholder.appearance.filter',
      'ly.img.placeholder.appearance.shadow',
      'ly.img.placeholder.arrange.flip',
      'ly.img.placeholder.arrange.move',
      'ly.img.placeholder.arrange.resize',
      'ly.img.placeholder.arrange.rotate',
      'ly.img.placeholder.fill.actAsPlaceholder',
      'ly.img.placeholder.fill.change',
      'ly.img.placeholder.fill.changeType',
      'ly.img.placeholder.fill.crop',
      'ly.img.placeholder.general.blendMode',
      'ly.img.placeholder.general.delete',
      'ly.img.placeholder.general.duplicate',
      'ly.img.placeholder.general.opacity',
      'ly.img.placeholder.shape.change',
      'ly.img.placeholder.stroke.change',
      'ly.img.placeholder.text.actAsPlaceholder',
      'ly.img.placeholder.text.character',
      'ly.img.placeholder.text.edit',
      'ly.img.position.align',
      'ly.img.position.arrange',
      'ly.img.position.distribute',
      'ly.img.replace.audio',
      'ly.img.replace.fill',
      'ly.img.replace.shape',
      'ly.img.rulers',
      'ly.img.scene.layout.free',
      'ly.img.scene.layout.horizontal',
      'ly.img.scene.layout.spacing',
      'ly.img.scene.layout.vertical',
      'ly.img.shadow.blur',
      'ly.img.shadow.color.library',
      'ly.img.shadow.color.picker.opacity',
      'ly.img.shadow.offset',
      'ly.img.shape.edit',
      'ly.img.shape.options.cornerRadius',
      'ly.img.shape.options.innerDiameter',
      'ly.img.shape.options.lineWidth',
      'ly.img.shape.options.points',
      'ly.img.shape.options.sides',
      'ly.img.stroke.cap',
      'ly.img.stroke.color.library',
      'ly.img.stroke.color.picker.opacity',
      'ly.img.stroke.cornerGeometry',
      'ly.img.stroke.dash',
      'ly.img.stroke.position',
      'ly.img.stroke.style',
      'ly.img.stroke.width',
      'ly.img.text.advanced',
      'ly.img.text.alignment',
      'ly.img.text.background.library',
      'ly.img.text.background.picker.opacity',
      'ly.img.text.decoration',
      'ly.img.text.edit',
      'ly.img.text.fontSize',
      'ly.img.text.fontStyle',
      'ly.img.text.list.ordered',
      'ly.img.text.list.unordered',
      'ly.img.text.path.curve',
      'ly.img.text.path.direction',
      'ly.img.text.path.edit',
      'ly.img.text.path.offset',
      'ly.img.text.path.position',
      'ly.img.text.styles',
      'ly.img.text.typeface',
      'ly.img.transform.flip',
      'ly.img.transform.position',
      'ly.img.transform.rotation',
      'ly.img.transform.size',
      'ly.img.trim',
      'ly.img.vectorEdit.addMode',
      'ly.img.vectorEdit.bendMode',
      'ly.img.vectorEdit.deleteMode',
      'ly.img.vectorEdit.done',
      'ly.img.vectorEdit.mirrorMode',
      'ly.img.vectorEdit.moveMode'
    ]);
  });

  it.each([
    'ly.img.shape.edit',
    'ly.img.vectorEdit',
    'ly.img.placeholder',
    'ly.img.rulers'
  ])('only the advanced editor enables %s', (prefix) => {
    const hasPrefix = (feature: string) => feature.startsWith(prefix);
    expect(advanced.some(hasPrefix)).toBe(true);
    expect(design.some(hasPrefix)).toBe(false);
  });

  it('leaves video off in both, as this is a design kit', () => {
    expect(design.filter((f) => f.startsWith('ly.img.video'))).toEqual([]);
    expect(advanced.filter((f) => f.startsWith('ly.img.video'))).toEqual([]);
  });
});

describe('MIG-U3 actions', () => {
  it.each([
    ['design', setupDesignActions],
    ['advanced', setupAdvancedActions]
  ])('the %s editor registers the documented actions', (_name, setup) => {
    expect(actionIdsOf(setup as Setup).sort()).toEqual([
      'exportDesign',
      'exportScene',
      'importScene',
      'saveScene',
      'uploadFile'
    ]);
  });

  it('registers each action exactly once', () => {
    const ids = actionIdsOf(setupDesignActions);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('MIG-U3 navigation bar', () => {
  const design = navigationOrderOf(setupDesignNavigationBar);
  const advanced = navigationOrderOf(setupAdvancedNavigationBar);

  it.each([
    'ly.img.documentSettings.navigationBar',
    'ly.img.undoRedo.navigationBar',
    'ly.img.title.navigationBar',
    'ly.img.zoom.navigationBar',
    'ly.img.actions.navigationBar',
    'ly.img.saveScene.navigationBar'
  ])('both bars carry %s', (id) => {
    expect(design).toContain(id);
    expect(advanced).toContain(id);
  });

  it('offers image export from the design editor only', () => {
    expect(design).toContain('ly.img.exportImage.navigationBar');
    expect(advanced).not.toContain('ly.img.exportImage.navigationBar');
  });

  it('leaves the back button to the app, which inserts it on open', () => {
    expect(design).not.toContain('ly.img.back.navigationBar');
    expect(advanced).not.toContain('ly.img.back.navigationBar');
  });
});

// MIG-U4
describe('MIG-U4 engine settings', () => {
  function settingsOf(setup: (engine: CreativeEngine) => void) {
    const spy = createApiSpy<CreativeEngine>();
    setup(spy.api);
    return new Map(
      spy
        .callsTo('editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
  }

  const design = settingsOf(setupDesignSettings);
  const advanced = settingsOf(setupAdvancedSettings);

  it.each([
    ['doubleClickToCropEnabled', true],
    ['doubleClickSelectionMode', 'Hierarchical'],
    ['page/allowCropInteraction', true],
    ['page/dimOutOfPageAreas', true],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['page/title/show', true],
    ['page/title/separator', '-'],
    ['colorPicker/colorMode', 'Any']
  ])('both editors set %s to %s', (key, value) => {
    expect(design.get(key as string)).toBe(value);
    expect(advanced.get(key as string)).toBe(value);
  });

  it('lets a page title be renamed in the design editor only', () => {
    expect(design.get('page/title/canEdit')).toBe(true);
    expect(advanced.has('page/title/canEdit')).toBe(false);
  });

  it('shows the placeholder overlay and button in both', () => {
    for (const settings of [design, advanced]) {
      expect(settings.get('placeholderControls/showOverlay')).toBe(true);
      expect(settings.get('placeholderControls/showButton')).toBe(true);
    }
  });
});

// MIG-U5
describe('MIG-U5 UI setup', () => {
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
      ),
      panelPositions: spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => args as [string, string])
    };
  }

  const design = uiOf(setupDesignUI);
  const advanced = uiOf(setupAdvancedUI);

  it('puts the canvas bar at the bottom in both editors', () => {
    for (const ui of [design, advanced]) {
      expect(
        ui.orders.get('{"in":"ly.img.canvas.bar","at":"bottom"}')
      ).toContain('ly.img.page.add.canvasBar');
    }
  });

  it('gives the inspector bar its own Crop-mode order', () => {
    for (const ui of [design, advanced]) {
      expect(
        ui.orders.get(
          '{"in":"ly.img.inspector.bar","when":{"editMode":"Crop"}}'
        )
      ).toEqual(['ly.img.cropControls.inspectorBar']);
    }
  });

  it('moves the inspector to the right for Creator mode only', () => {
    expect(design.panelPositions).toEqual([
      ['//ly.img.panel/inspector', 'left'],
      ['//ly.img.panel/assetLibrary', 'left']
    ]);
    expect(advanced.panelPositions.at(-1)).toEqual([
      '//ly.img.panel/inspector',
      'right'
    ]);
  });

  it('offers the whole element library in the Creator dock and templates first', () => {
    const dock = advanced.orders.get('{"in":"ly.img.dock"}') ?? [];
    const keys = dock.map((entry) =>
      typeof entry === 'string' ? entry : entry.key
    );

    expect(keys[0]).toBe('ly.img.templates');
    expect(keys).toContain('ly.img.elements');
  });

  it('leaves the Creator view style alone', () => {
    expect(
      advanced.spy.callsTo('ui.setView').map(({ args }) => args[0])
    ).toEqual([]);
  });
});

// MIG-U7
describe('MIG-U7 translations and shortcuts', () => {
  it.each([
    ['design', setupDesignTranslations],
    ['advanced', setupAdvancedTranslations]
  ])('the %s editor overrides no label', (_name, setup) => {
    expect(record(setup as Setup).callsTo('i18n.setTranslations')).toEqual([]);
  });

  it.each([
    ['design', setupDesignShortcuts],
    ['advanced', setupAdvancedShortcuts]
  ])('the %s editor installs the US ANSI catalog', (_name, setup) => {
    const [catalog] = record(setup as Setup).lastArgsOf('shortcuts.set') ?? [];

    expect(Array.isArray(catalog)).toBe(true);
    expect((catalog as unknown[]).length).toBeGreaterThan(0);
  });
});

// MIG-U8
describe('MIG-U8 action handlers', () => {
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

  it.each([
    ['design', setupDesignActions],
    ['advanced', setupAdvancedActions]
  ])('the %s editor saves a scene as a text file', async (_name, setup) => {
    const { spy, handlers } = handlersOf(setup as Setup);

    await handlers.get('saveScene')?.();

    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it.each([
    ['design', setupDesignActions],
    ['advanced', setupAdvancedActions]
  ])(
    'the %s editor exports with the options it is given',
    async (_name, setup) => {
      const { spy, handlers } = handlersOf(setup as Setup);

      await handlers.get('exportDesign')?.({ mimeType: 'image/png' } as never);

      expect(spy.lastArgsOf('utils.export')).toEqual([
        { mimeType: 'image/png' }
      ]);
      expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
    }
  );

  it.each([
    ['design', setupDesignActions],
    ['advanced', setupAdvancedActions]
  ])(
    'the %s editor writes an archive only when asked for one',
    async (_name, setup) => {
      const { spy, handlers } = handlersOf(setup as Setup);

      await handlers.get('exportScene')?.({} as never);
      expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
        'text/plain;charset=UTF-8'
      );
      expect(spy.callsTo('engine.scene.saveToArchive')).toHaveLength(0);

      await handlers.get('exportScene')?.({ format: 'archive' } as never);
      expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe('application/zip');
      expect(spy.callsTo('engine.scene.saveToArchive')).toHaveLength(1);
    }
  );

  it.each([
    ['design', setupDesignActions],
    ['advanced', setupAdvancedActions]
  ])(
    'the %s editor passes an upload straight through with its context',
    (_name, setup) => {
      const { spy, handlers } = handlersOf(setup as Setup);
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
    }
  );

  it.each([
    ['design', setupDesignActions],
    ['advanced', setupAdvancedActions]
  ])(
    'the %s editor loads one picked file and then fits the first page',
    async (_name, setup) => {
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
      (setup as Setup)(cesdk as unknown as CreativeEditorSDK);

      await handlers.get('importScene')?.();

      expect(loaded).toEqual([blobURL]);
      expect(ran).toEqual([['zoom.toPage', { page: 'first' }]]);
    }
  );
});

// MIG-U10
describe('MIG-U10 video timeline', () => {
  it.each([
    ['design', setupDesignVideoTimeline],
    ['advanced', setupAdvancedVideoTimeline]
  ])(
    'the %s editor ships the timeline helper unwired, as this is a design kit',
    (_name, setup) => {
      expect(record(setup as Setup).calls).toEqual([]);
    }
  );
});
