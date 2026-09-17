import CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { DEFAULT_CROP_PRESETS } from '../../src/app/crop-presets';
import { SAMPLE_IMAGES } from '../../src/app/sample-images';
import { setupActions } from '../../src/imgly/config/actions';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupTranslations } from '../../src/imgly/config/i18n';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupUI } from '../../src/imgly/config/ui';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';
import { PhotoEditorConfig, initForceCropEditor } from '../../src/imgly';
import {
  createEditorMock,
  type DockEntry,
  type EditorMockState
} from './editor-mock';

function findEntry(order: DockEntry[], key: string) {
  const entry = order.find(
    (item) => typeof item !== 'string' && item.key === key
  );
  if (entry == null || typeof entry === 'string') {
    throw new Error(`No dock entry with key ${key}.`);
  }
  return entry;
}

const PRESET = DEFAULT_CROP_PRESETS[0];
const IMAGE = SAMPLE_IMAGES[0];
const PAGE = 42;

async function init(
  overrides: Partial<EditorMockState> = {},
  mode?: 'always' | 'ifNeeded' | 'silent'
) {
  const mock = createEditorMock(overrides);
  await initForceCropEditor(mock.cesdk, { preset: PRESET, image: IMAGE, mode });
  return mock;
}

// FCE-U3
describe('initForceCropEditor', () => {
  it('adds the photo editor configuration first, then the eight asset sources', async () => {
    const { raw } = await init();
    const names = raw.addPlugin.mock.calls.map(
      ([plugin]: [{ name: string }]) => plugin.name
    );

    expect(names[0]).toBe('cesdk-photo-editor');
    expect(names.slice(1)).toEqual([
      'cesdk-blur-asset-source',
      'cesdk-image-colors-asset-source',
      'cesdk-color-palette-asset-source',
      'cesdk-effects-asset-source',
      'cesdk-filters-asset-source',
      'cesdk-text-component-asset-source',
      'cesdk-typeface-asset-source',
      'cesdk-vectorshape-asset-source'
    ]);
  });

  it('issues the asset sources at once instead of one after another', async () => {
    // A timer callback runs after every queued microtask, so the pending
    // `await` chain inside the kit has run by the time this resolves.
    const flushMicrotasks = () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    const mock = createEditorMock();
    const pending: (() => void)[] = [];
    // `addPlugin` resolves only when the test says so, so a sequential
    // registration would stall after the first asset source.
    mock.raw.addPlugin.mockImplementation(
      () => new Promise<void>((resolve) => pending.push(resolve))
    );

    const counts: number[] = [];
    void initForceCropEditor(mock.cesdk, { preset: PRESET, image: IMAGE });
    await flushMicrotasks();
    counts.push(mock.raw.addPlugin.mock.calls.length);

    while (pending.length > 0) {
      pending.splice(0).forEach((resolve) => {
        resolve();
      });
      await flushMicrotasks();
      counts.push(mock.raw.addPlugin.mock.calls.length);
    }

    // The configuration plugin, then the eight asset sources together.
    expect(counts).toEqual([1, 9, 9]);
  });

  it('builds the scene from the chosen image', async () => {
    const { raw } = await init();

    expect(raw.createFromImage).toHaveBeenCalledWith(IMAGE.full);
  });

  it('covers, clips and selects the page and locks its fill and stroke', async () => {
    const { engine } = await init();

    expect(engine.block.setContentFillMode).toHaveBeenCalledWith(PAGE, 'Cover');
    expect(engine.block.setScopeEnabled.mock.calls).toEqual([
      [PAGE, 'fill/change', false],
      [PAGE, 'fill/changeType', false],
      [PAGE, 'stroke/change', false]
    ]);
    expect(engine.editor.setSetting).toHaveBeenCalledWith(
      'page/moveChildrenWhenCroppingFill',
      true
    );
    expect(engine.block.setClipped).toHaveBeenCalledWith(PAGE, true);
    expect(engine.block.select).toHaveBeenCalledWith(PAGE);
  });

  it('registers the chosen preset as the only page preset and force-crops with it', async () => {
    const { engine, ui } = await init();

    expect(engine.asset.addLocalSource).toHaveBeenCalledWith(
      'ly.img.page.presets'
    );
    expect(engine.asset.addAssetToSource).toHaveBeenCalledTimes(1);
    expect(engine.asset.addAssetToSource).toHaveBeenCalledWith(
      'ly.img.page.presets',
      PRESET
    );
    expect(ui.applyForceCrop).toHaveBeenCalledWith(PAGE, {
      mode: 'always',
      presetId: PRESET.id,
      sourceId: 'ly.img.page.presets'
    });
  });

  it.each(['always', 'ifNeeded', 'silent'] as const)(
    'passes the %s mode through unchanged',
    async (mode) => {
      const { ui } = await init({}, mode);

      expect(ui.applyForceCrop.mock.calls[0][1]).toMatchObject({ mode });
    }
  );

  it('returns before touching the asset source when there is no page', async () => {
    const { engine, ui } = await init({ currentPage: null });

    expect(engine.asset.addLocalSource).not.toHaveBeenCalled();
    expect(ui.applyForceCrop).not.toHaveBeenCalled();
  });
});

// FCE-U4
describe('setupDock', () => {
  function dockEntries() {
    const mock = createEditorMock();
    setupDock(mock.cesdk);
    return {
      mock,
      order: mock.ui.setComponentOrder.mock.calls[0][1]
    };
  }

  it('orders a spacer, the four tools and a spacer', () => {
    const { order } = dockEntries();

    expect(
      order.map((entry) => (typeof entry === 'string' ? entry : entry.key))
    ).toEqual([
      'ly.img.spacer',
      'ly.img.crop',
      'ly.img.adjustment',
      'ly.img.filter',
      'ly.img.vector.shape',
      'ly.img.spacer'
    ]);
  });

  it('toggles crop mode from the Crop entry', () => {
    const { mock, order } = dockEntries();
    const crop = findEntry(order, 'ly.img.crop');

    crop.onClick();
    expect(mock.engine.editor.setEditMode).toHaveBeenLastCalledWith('Crop');
    expect(mock.engine.block.select).toHaveBeenCalledWith(42);

    crop.onClick();
    expect(mock.engine.editor.setEditMode).toHaveBeenLastCalledWith(
      'Transform'
    );
  });

  it.each([
    ['ly.img.adjustment', '//ly.img.panel/inspector/adjustments'],
    ['ly.img.filter', '//ly.img.panel/inspector/filters']
  ])('opens and closes the %s panel', (key, panelId) => {
    const { mock, order } = dockEntries();
    const entry = findEntry(order, key);

    entry.onClick();
    expect(mock.ui.closePanel).toHaveBeenCalledWith('*');
    expect(mock.engine.editor.setEditMode).toHaveBeenLastCalledWith(
      'Transform'
    );
    expect(mock.ui.openPanel).toHaveBeenCalledWith(panelId, { floating: true });
    expect(entry.isSelected()).toBe(true);

    entry.onClick();
    expect(mock.ui.closePanel).toHaveBeenLastCalledWith(panelId);
    expect(entry.isSelected()).toBe(false);
  });

  it.each(['ly.img.crop', 'ly.img.adjustment', 'ly.img.filter'])(
    'the %s handler does nothing without a page',
    (key) => {
      const mock = createEditorMock({ currentPage: null });
      setupDock(mock.cesdk);
      const entry = (
        mock.ui.setComponentOrder.mock.calls[0][1] as {
          key?: string;
          onClick: () => void;
        }[]
      ).find((item) => item.key === key)!;

      entry.onClick();

      expect(mock.ui.openPanel).not.toHaveBeenCalled();
      expect(mock.engine.editor.setEditMode).not.toHaveBeenCalled();
    }
  );
});

// FCE-U5
describe('setupFeatures', () => {
  function predicate(id: string, mock = createEditorMock()) {
    setupFeatures(mock.cesdk);
    const call = mock.raw.feature.set.mock.calls.find(
      ([feature]) => feature === id
    )!;
    return { fn: call[1], mock };
  }

  it.each(['ly.img.canvas.menu', 'ly.img.inspector.bar'])(
    'hides %s while a page is selected and shows it otherwise',
    (feature) => {
      const withPage = predicate(feature);
      expect(withPage.fn({ engine: withPage.mock.engine })).toBe(false);

      const withGraphic = predicate(
        feature,
        createEditorMock({ selectedBlockTypes: { 7: '//ly.img.ubq/graphic' } })
      );
      expect(withGraphic.fn({ engine: withGraphic.mock.engine })).toBe(true);
    }
  );

  it('enables exactly the documented list', () => {
    const mock = createEditorMock();
    setupFeatures(mock.cesdk);
    const enabled = mock.raw.feature.enable.mock.calls[0][0] as string[];

    expect(enabled).toEqual([
      'ly.img.adjustment',
      'ly.img.blendMode',
      'ly.img.blur',
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
      'ly.img.page.settings',
      'ly.img.position.align',
      'ly.img.position.arrange',
      'ly.img.position.distribute',
      'ly.img.replace.audio',
      'ly.img.replace.fill',
      'ly.img.replace.shape',
      'ly.img.shadow.blur',
      'ly.img.shadow.color.library',
      'ly.img.shadow.color.picker.opacity',
      'ly.img.shadow.offset',
      'ly.img.shape.options.cornerRadius',
      'ly.img.shape.options.innerDiameter',
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
      'ly.img.text.typeface'
    ]);
  });

  it('sets a predicate only for the two features a page must not offer', () => {
    const mock = createEditorMock();
    setupFeatures(mock.cesdk);

    expect(mock.raw.feature.set.mock.calls.map(([feature]) => feature)).toEqual(
      ['ly.img.canvas.menu', 'ly.img.inspector.bar']
    );
  });
});

describe('setupNavigationBar and setupTranslations', () => {
  it('offers exactly one action, Export Image', () => {
    const mock = createEditorMock();
    setupNavigationBar(mock.cesdk as CreativeEditorSDK);
    const order = mock.ui.setComponentOrder.mock.calls[0][1] as (
      | string
      | { id: string; children: string[] }
    )[];
    const actions = order.find(
      (entry) =>
        typeof entry !== 'string' && entry.id === 'ly.img.actions.navigationBar'
    ) as { children: string[] };

    expect(actions.children).toEqual(['ly.img.exportImage.navigationBar']);
  });

  it('names the three asset libraries', () => {
    const mock = createEditorMock();
    setupTranslations(mock.cesdk);

    expect(mock.raw.i18n.setTranslations).toHaveBeenCalledWith({
      en: {
        'libraries.ly.img.sticker.label': 'Stickers',
        'libraries.ly.img.vector.shape.label': 'Shapes',
        'libraries.ly.img.text.label': 'Text'
      }
    });
  });
});

// FCE-U6
describe('setupSettings', () => {
  const mock = createEditorMock();
  setupSettings(mock.engine as unknown as CreativeEngine);
  const settings = new Map(
    mock.engine.editor.setSetting.mock.calls as [string, unknown][]
  );

  it.each([
    ['doubleClickToCropEnabled', false],
    ['page/allowCropInteraction', true],
    ['page/moveChildrenWhenCroppingFill', true],
    ['page/selectWhenNoBlocksSelected', true],
    ['page/highlightWhenCropping', true],
    ['placeholderControls/showOverlay', true],
    ['placeholderControls/showButton', true]
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });

  it('hides the page title, because the kit shows one image and no page list', () => {
    expect(settings.get('page/title/show')).toBe(false);
  });

  it('leaves the colour picker unrestricted', () => {
    expect(settings.get('colorPicker/colorMode')).toBe('Any');
  });
});

// FCE-U7
describe('setupActions', () => {
  it('overrides exportDesign and registers nothing else', () => {
    const mock = createEditorMock();
    setupActions(mock.cesdk);

    expect(mock.raw.actions.register.mock.calls.map(([id]) => id)).toEqual([
      'exportDesign'
    ]);
  });

  it('exports with the options it was given and downloads the first blob', async () => {
    const mock = createEditorMock();
    setupActions(mock.cesdk);
    const [, handler] = mock.raw.actions.register.mock.calls[0];

    await handler({ mimeType: 'image/png' });

    expect(mock.raw.utils.export).toHaveBeenCalledWith({
      mimeType: 'image/png'
    });
    expect(mock.raw.utils.downloadFile).toHaveBeenCalledWith(
      'blob',
      'image/png'
    );
  });
});

// FCE-U8
describe('setupUI', () => {
  const mock = createEditorMock();
  setupUI(mock.cesdk);
  const orders = new Map(
    mock.ui.setComponentOrder.mock.calls.map(([location, order]) => [
      JSON.stringify(location),
      order as (string | { id: string; children: string[] })[]
    ])
  );

  it('docks the inspector and the asset library on the left, both anchored', () => {
    expect(mock.ui.setPanelPosition.mock.calls).toEqual([
      ['//ly.img.panel/inspector', 'left'],
      ['//ly.img.panel/assetLibrary', 'left']
    ]);
    expect(mock.ui.setPanelFloating.mock.calls).toEqual([
      ['//ly.img.panel/inspector', false],
      ['//ly.img.panel/assetLibrary', false]
    ]);
  });

  it('puts the canvas bar at the bottom with the page controls only', () => {
    expect(orders.get('{"in":"ly.img.canvas.bar","at":"bottom"}')).toEqual([
      'ly.img.settings.canvasBar',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);
  });

  it('gives the inspector bar a Crop-mode order of its own', () => {
    expect(
      orders.get('{"in":"ly.img.inspector.bar","when":{"editMode":"Crop"}}')
    ).toEqual(['ly.img.cropControls.inspectorBar']);
  });

  it('groups the photo effects under one appearance entry in Transform mode', () => {
    const transform = orders.get(
      '{"in":"ly.img.inspector.bar","when":{"editMode":"Transform"}}'
    );
    const appearance = transform?.find(
      (entry) =>
        typeof entry !== 'string' &&
        entry.id === 'ly.img.appearance.inspectorBar'
    ) as { children: string[] };

    expect(appearance.children).toEqual([
      'ly.img.adjustment.inspectorBar',
      'ly.img.filter.inspectorBar',
      'ly.img.effect.inspectorBar',
      'ly.img.blur.inspectorBar'
    ]);
  });

  it('registers no component and no panel of its own', () => {
    expect(mock.raw.i18n.setTranslations).not.toHaveBeenCalled();
    expect(orders.has('{"in":"ly.img.dock"}')).toBe(true);
  });
});

// FCE-U9
describe('setupKeyboardShortcuts', () => {
  it('installs the US ANSI catalog', () => {
    const mock = createEditorMock();
    setupKeyboardShortcuts(mock.cesdk);
    const [catalog] = mock.raw.shortcuts.set.mock.calls[0];

    expect(Array.isArray(catalog)).toBe(true);
    expect(catalog.length).toBeGreaterThan(0);
  });
});

// FCE-U9b
describe('setupVideoTimeline', () => {
  it('ships unwired, as this kit has no video mode', () => {
    const mock = createEditorMock();
    setupVideoTimeline(mock.cesdk);

    expect(mock.ui.setComponentOrder).not.toHaveBeenCalled();
    expect(mock.raw.actions.register).not.toHaveBeenCalled();
  });
});

// FCE-U10
describe('PhotoEditorConfig', () => {
  async function initialize() {
    const mock = createEditorMock();
    await new PhotoEditorConfig().initialize({
      cesdk: mock.cesdk,
      engine: mock.engine
    } as unknown as EditorPluginContext);
    return mock;
  }

  it('resets the editor before it configures anything', async () => {
    const mock = await initialize();

    expect(mock.raw.resetEditor).toHaveBeenCalledTimes(1);
    expect(mock.raw.setEditorCompatibilityVersion.mock.calls).toEqual([
      [CreativeEditorSDK.version]
    ]);
    expect(mock.raw.feature.enable).toHaveBeenCalled();
    expect(mock.ui.setComponentOrder).toHaveBeenCalled();
    expect(mock.raw.actions.register).toHaveBeenCalled();
    expect(mock.raw.shortcuts.set).toHaveBeenCalled();
    expect(mock.raw.i18n.setTranslations).toHaveBeenCalled();
    expect(mock.engine.editor.setSetting).toHaveBeenCalled();
  });

  it('registers one reset handler that runs without a subscription to drop', async () => {
    const mock = await initialize();

    expect(mock.state.resetHandlers).toHaveLength(1);
    expect(() => mock.state.resetHandlers[0]()).not.toThrow();
  });

  it('configures nothing when the plugin gets no editor', async () => {
    const mock = createEditorMock();
    await new PhotoEditorConfig().initialize({
      cesdk: undefined,
      engine: mock.engine
    } as unknown as EditorPluginContext);

    expect(mock.raw.resetEditor).not.toHaveBeenCalled();
    expect(mock.engine.editor.setSetting).not.toHaveBeenCalled();
  });
});

// FCE-U4 (continued): the two entries whose handlers the first block leaves out
describe('setupDock shapes entry and Crop selection', () => {
  const SHAPES_PAYLOAD = {
    payload: {
      entries: ['ly.img.vector.shape'],
      title: 'libraries.ly.img.vector.shape.label'
    }
  };

  function dock(overrides: Partial<EditorMockState> = {}) {
    const mock = createEditorMock(overrides);
    setupDock(mock.cesdk);
    return { mock, order: mock.ui.setComponentOrder.mock.calls[0][1] };
  }

  it('shows Crop as selected while the crop panel is open', () => {
    expect(findEntry(dock().order, 'ly.img.crop').isSelected()).toBe(false);
    expect(
      findEntry(
        dock({ openPanels: ['//ly.img.panel/inspector/crop'] }).order,
        'ly.img.crop'
      ).isSelected()
    ).toBe(true);
  });

  it('opens the shape library with its own payload and closes every other panel', () => {
    const { mock, order } = dock();
    const shapes = findEntry(order, 'ly.img.vector.shape');

    expect(shapes.isSelected()).toBe(false);
    shapes.onClick();

    expect(mock.ui.closePanel).toHaveBeenCalledWith('*');
    expect(mock.ui.openPanel).toHaveBeenCalledWith(
      '//ly.img.panel/assetLibrary',
      SHAPES_PAYLOAD
    );
    expect(shapes.isSelected()).toBe(true);
  });

  it('closes the shape library on a second click', () => {
    const { mock, order } = dock({
      openPanels: ['//ly.img.panel/assetLibrary']
    });
    const shapes = findEntry(order, 'ly.img.vector.shape');

    shapes.onClick();

    expect(mock.ui.closePanel).toHaveBeenLastCalledWith(
      '//ly.img.panel/assetLibrary'
    );
    expect(mock.ui.openPanel).not.toHaveBeenCalled();
  });
});
