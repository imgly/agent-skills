import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeAll, describe, expect, it, vi } from 'vitest';

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
        readonly pluginName = name;
        constructor(readonly options?: { include?: string[] }) {}
      }
    ])
  );
});

import { AdvancedEditorConfig } from '../../src/imgly/config/plugin';
import { initPsdTemplateImportEditor } from '../../src/imgly';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

/** The features the kit's `setupFeatures` enables, in the order it lists them. */
const ENABLED_FEATURES = [
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
];

interface AddedPlugin {
  pluginName?: string;
  options?: { include?: string[] };
}

describe('PSD-U8 initPsdTemplateImportEditor', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  let added: AddedPlugin[] = [];

  beforeAll(async () => {
    await initPsdTemplateImportEditor(spy.api);
    added = spy.callsTo('addPlugin').map(({ args }) => args[0] as AddedPlugin);
  });

  it('adds the kit configuration plugin first', () => {
    expect(added[0]).toBeInstanceOf(AdvancedEditorConfig);
  });

  it('adds every asset source the kit offers, and nothing else', () => {
    expect(added.slice(1).map((plugin) => plugin.pluginName)).toEqual([
      'BlurAssetSource',
      'ImageColorsAssetSource',
      'ColorPaletteAssetSource',
      'CropPresetsAssetSource',
      'UploadAssetSources',
      'DemoAssetSources',
      'EffectsAssetSource',
      'FiltersAssetSource',
      'PagePresetsAssetSource',
      'StickerAssetSource',
      'TextAssetSource',
      'TextComponentAssetSource',
      'TypefaceAssetSource',
      'VectorShapeAssetSource',
      'PremiumTemplatesAssetSource'
    ]);
  });

  it.each([
    ['UploadAssetSources', ['ly.img.image.upload']],
    ['DemoAssetSources', ['ly.img.image.*']],
    ['PremiumTemplatesAssetSource', ['ly.img.templates.premium.*']]
  ])('limits %s to the image sources the kit needs', (name, include) => {
    const plugin = added.find((entry) => entry.pluginName === name);
    expect(plugin?.options).toEqual({ include });
  });

  it('leaves the other asset sources unrestricted', () => {
    const restricted = added
      .filter((plugin) => plugin.options != null)
      .map((plugin) => plugin.pluginName);
    expect(restricted).toEqual([
      'UploadAssetSources',
      'DemoAssetSources',
      'PremiumTemplatesAssetSource'
    ]);
  });

  it('registers every asset source in one concurrent batch', async () => {
    const settle: Array<() => void> = [];
    const addPlugin = vi.fn(
      () => new Promise<void>((resolve) => settle.push(resolve))
    );
    const cesdk = { addPlugin } as unknown as CreativeEditorSDK;

    const configured = initPsdTemplateImportEditor(cesdk);
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(1));

    settle.shift()!();
    await vi.waitFor(() =>
      expect(addPlugin).toHaveBeenCalledTimes(added.length)
    );

    while (settle.length > 0) {
      settle.shift()!();
    }
    await configured;
  });

  it('adds no video or audio asset source, as this kit imports still designs', () => {
    const names = added.map((plugin) => plugin.pluginName ?? '');
    expect(names.filter((name) => /Video|Audio/.test(name))).toEqual([]);
  });
});

describe('the kit configuration plugin', () => {
  const spy = createApiSpy<Parameters<AdvancedEditorConfig['initialize']>[0]>();

  beforeAll(async () => {
    await new AdvancedEditorConfig().initialize(spy.api);
  });

  it('starts from a clean editor in the advanced view', () => {
    expect(spy.callsTo('cesdk.resetEditor')).toHaveLength(1);
    expect(spy.lastArgsOf('cesdk.ui.setView')).toEqual(['advanced']);
  });

  it('enables exactly the features the kit lists, in one call', () => {
    expect(spy.callsTo('cesdk.feature.enable')).toHaveLength(1);
    expect(spy.callsTo('cesdk.feature.disable')).toHaveLength(0);
    const enabled = spy.lastArgsOf('cesdk.feature.enable')?.[0] as string[];
    expect(enabled).toEqual(ENABLED_FEATURES);
  });

  it('leaves the video features off, as this kit imports still designs', () => {
    const enabled = spy.lastArgsOf('cesdk.feature.enable')?.[0] as string[];
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });

  it('declares the CE.SDK generation right after the reset', () => {
    expect(spy.calls.map(({ path }) => path).slice(0, 2)).toEqual([
      'cesdk.resetEditor',
      'cesdk.setEditorCompatibilityVersion'
    ]);
    expect(spy.callsTo('cesdk.setEditorCompatibilityVersion')).toHaveLength(1);
    expect(spy.lastArgsOf('cesdk.setEditorCompatibilityVersion')).toEqual([
      CreativeEditorSDK.version
    ]);
  });

  it('registers the actions the navigation bar reaches', () => {
    const registered = spy
      .callsTo('cesdk.actions.register')
      .map(({ args }) => args[0] as string);
    expect(registered).toEqual(expect.arrayContaining(['exportDesign']));
  });

  it('puts the export dropdown at the end of the navigation bar', () => {
    const navigationBar = spy
      .callsTo('cesdk.ui.setComponentOrder')
      .find(
        ({ args }) =>
          (args[0] as { in?: string })?.in === 'ly.img.navigation.bar'
      );
    const entries = navigationBar?.args[1] as (
      | string
      | { id: string; children: string[] }
    )[];
    expect(entries.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });

  it('writes the kit engine settings and the keyboard catalogue', () => {
    expect(spy.callsTo('engine.editor.setSetting').length).toBeGreaterThan(0);
    expect(spy.callsTo('cesdk.shortcuts.set')).toHaveLength(1);
  });
});

describe('PSD-U15 the video timeline the kit ships is inert', () => {
  it('configures nothing, as this kit imports still designs', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupVideoTimeline(spy.api);
    expect(spy.calls).toEqual([]);
  });
});
