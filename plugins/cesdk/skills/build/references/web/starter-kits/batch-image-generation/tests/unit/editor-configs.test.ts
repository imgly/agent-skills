import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// `@cesdk/cesdk-js` and its plugin bundle read `window` at import time, so the
// kit's entry module cannot be loaded in Node without these stand-ins.
vi.mock('@cesdk/cesdk-js', () => ({
  default: { version: '0.0.0-test' }
}));

vi.mock('@cesdk/cesdk-js/plugins', () => {
  const names = [
    'BlurAssetSource',
    'ImageColorsAssetSource',
    'ColorPaletteAssetSource',
    'CropPresetsAssetSource',
    'DemoAssetSources',
    'EffectsAssetSource',
    'FiltersAssetSource',
    'PagePresetsAssetSource',
    'PremiumTemplatesAssetSource',
    'StickerAssetSource',
    'TextAssetSource',
    'TextComponentAssetSource',
    'TypefaceAssetSource',
    'UploadAssetSources',
    'VectorShapeAssetSource'
  ];
  return Object.fromEntries(
    names.map((name) => [
      name,
      class {
        readonly source = name;
      }
    ])
  );
});

const {
  initBatchImageGenerationInstanceEditor,
  initBatchImageGenerationTemplateEditor
} = await import('../../src/imgly');

const { setupActions: setupAdvancedActions } =
  await import('../../src/imgly/config/advanced-editor/actions');
const { setupFeatures: setupAdvancedFeatures } =
  await import('../../src/imgly/config/advanced-editor/features');
const { setupNavigationBar: setupAdvancedNavigationBar } =
  await import('../../src/imgly/config/advanced-editor/ui/navigationBar');
const { setupActions: setupDesignActions } =
  await import('../../src/imgly/config/design-editor/actions');
const { setupFeatures: setupDesignFeatures } =
  await import('../../src/imgly/config/design-editor/features');
const { setupNavigationBar: setupDesignNavigationBar } =
  await import('../../src/imgly/config/design-editor/ui/navigationBar');

const ACTION_IDS = [
  'saveScene',
  'exportDesign',
  'exportScene',
  'importScene',
  'uploadFile'
];

function addedSources(spy: ReturnType<typeof createApiSpy>): string[] {
  return spy
    .callsTo('addPlugin')
    .map(({ args }) => (args[0] as { source?: string }).source)
    .filter((source): source is string => source != null);
}

/** An editor whose `addPlugin` only settles when the test says so. */
function deferredEditor() {
  const spy = createApiSpy<CreativeEditorSDK>();
  const settle: Array<() => void> = [];
  const api = new Proxy(spy.api as object, {
    get(target, key, receiver) {
      if (key !== 'addPlugin') {
        return Reflect.get(target, key, receiver);
      }
      return (plugin: unknown) => {
        (target as { addPlugin: (p: unknown) => void }).addPlugin(plugin);
        return new Promise<void>((resolve) => settle.push(resolve));
      };
    }
  }) as CreativeEditorSDK;
  return { api, spy, settle };
}

// BIG-U3: the two editor entry points and the config modules behind them.
describe.each([
  ['template', initBatchImageGenerationTemplateEditor],
  ['card', initBatchImageGenerationInstanceEditor]
])('the %s editor entry point', (_name, init) => {
  it('registers every asset source at once, not one after another', async () => {
    const sequential = createApiSpy<CreativeEditorSDK>();
    await init(sequential.api);
    const total = sequential.callsTo('addPlugin').length;

    const { api, spy, settle } = deferredEditor();
    const done = init(api);

    // The configuration plugin is awaited on its own.
    await vi.waitFor(() => expect(settle).toHaveLength(1));
    settle[0]();

    // Sequential registration would stall here: every remaining source is in
    // flight before any of them settles.
    await vi.waitFor(() => expect(settle).toHaveLength(total));
    expect(spy.callsTo('addPlugin')).toHaveLength(total);

    settle.forEach((resolve) => resolve());
    await done;
  });
});

describe('initBatchImageGenerationTemplateEditor', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;

  beforeEach(async () => {
    spy = createApiSpy<CreativeEditorSDK>();
    await initBatchImageGenerationTemplateEditor(spy.api);
  });

  it('puts the editor in the Creator role and the dark theme', () => {
    expect(spy.lastArgsOf('engine.editor.setRole')).toEqual(['Creator']);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['dark']);
  });

  it('adds the advanced editor configuration plugin first', () => {
    const [first] = spy.callsTo('addPlugin');
    expect((first.args[0] as { name: string }).name).toBe(
      'cesdk-advanced-editor'
    );
  });

  it.each([
    'CropPresetsAssetSource',
    'EffectsAssetSource',
    'FiltersAssetSource',
    'BlurAssetSource',
    'PagePresetsAssetSource',
    'TextComponentAssetSource'
  ])('adds the %s the card editor omits', (source) => {
    expect(addedSources(spy)).toContain(source);
  });
});

describe('initBatchImageGenerationInstanceEditor', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;

  beforeEach(async () => {
    spy = createApiSpy<CreativeEditorSDK>();
    await initBatchImageGenerationInstanceEditor(spy.api);
  });

  it('puts the editor in the Adopter role and leaves the theme alone', () => {
    expect(spy.lastArgsOf('engine.editor.setRole')).toEqual(['Adopter']);
    expect(spy.callsTo('ui.setTheme')).toHaveLength(0);
  });

  it('adds the design editor configuration plugin first', () => {
    const [first] = spy.callsTo('addPlugin');
    expect((first.args[0] as { name: string }).name).toBe(
      'cesdk-design-editor'
    );
  });

  it.each([
    'CropPresetsAssetSource',
    'EffectsAssetSource',
    'FiltersAssetSource',
    'BlurAssetSource',
    'PagePresetsAssetSource',
    'TextComponentAssetSource'
  ])('omits the %s', (source) => {
    expect(addedSources(spy)).not.toContain(source);
  });

  it.each([
    'ImageColorsAssetSource',
    'ColorPaletteAssetSource',
    'TypefaceAssetSource',
    'TextAssetSource',
    'VectorShapeAssetSource',
    'StickerAssetSource',
    'UploadAssetSources',
    'DemoAssetSources',
    'PremiumTemplatesAssetSource'
  ])('shares the %s with the template editor', (source) => {
    expect(addedSources(spy)).toContain(source);
  });
});

describe.each([
  ['advanced', setupAdvancedActions, setupAdvancedNavigationBar],
  ['design', setupDesignActions, setupDesignNavigationBar]
])('the %s config', (_name, setupActions, setupNavigationBar) => {
  it.each(ACTION_IDS)('registers the %s action', (id) => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupActions(spy.api);

    expect(
      spy.callsTo('actions.register').map(({ args }) => args[0])
    ).toContain(id);
  });

  it('offers Save Scene and Export Image under the Actions dropdown', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupNavigationBar(spy.api);
    const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
      { in: string },
      (string | { id: string; children: string[] })[]
    ];

    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    expect(order).toContainEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar'
      ]
    });
  });
});

describe('the two feature lists', () => {
  function enabled(setup: (cesdk: CreativeEditorSDK) => void): string[] {
    const spy = createApiSpy<CreativeEditorSDK>();
    setup(spy.api);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
    return spy.lastArgsOf('feature.enable')?.[0] as string[];
  }

  it('the template editor enables exactly the creator features', () => {
    expect(enabled(setupAdvancedFeatures)).toEqual([
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
      'ly.img.dragAndDrop.asset',
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

  it('the card editor enables exactly the adopter features', () => {
    expect(enabled(setupDesignFeatures)).toEqual([
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
      'ly.img.dragAndDrop.asset',
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

  // The placeholder features read inverted: they govern what an Adopter may
  // touch, and only the Creator editor enables them.
  it.each([
    'ly.img.vectorEdit',
    'ly.img.shape.edit',
    'ly.img.rulers',
    'ly.img.placeholder'
  ])('only the template editor enables %s', (prefix) => {
    const hasPrefix = (id: string) => id.startsWith(prefix);
    expect(enabled(setupAdvancedFeatures).some(hasPrefix)).toBe(true);
    expect(enabled(setupDesignFeatures).some(hasPrefix)).toBe(false);
  });
});
