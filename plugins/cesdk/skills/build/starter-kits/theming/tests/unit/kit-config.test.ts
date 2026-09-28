import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { COLOR_PRESETS, THEME_COLORS } from '../../src/app/theme-colors';
import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';

interface DockEntry {
  id: string;
  key: string;
  entries?: string[];
}

function orderIn(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>,
  container: string
): unknown[] {
  const call = spy
    .callsTo('ui.setComponentOrder')
    .find(({ args }) => (args[0] as { in: string }).in === container);
  if (call == null) {
    throw new Error(`No component order was set for ${container}.`);
  }
  return call.args[1] as unknown[];
}

/**
 * Every feature `src/imgly/config/features.ts` enables, in the order the kit
 * lists them. A kit names each feature explicitly, so the whole list is pinned
 * here rather than a sample of it.
 */
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
];

describe('THEME_COLORS and COLOR_PRESETS', () => {
  it('TH-U6 offers a light and a dark theme with the four colours', () => {
    expect(Object.keys(THEME_COLORS)).toEqual(['light', 'dark']);
    for (const theme of Object.values(THEME_COLORS)) {
      expect(Object.keys(theme)).toEqual([
        'surfaceColor',
        'canvasColor',
        'activeColor',
        'accentColor'
      ]);
    }
  });

  it('TH-U6 offers five valid hex presets per colour type', () => {
    expect(Object.keys(COLOR_PRESETS)).toEqual([
      'surface',
      'canvas',
      'active',
      'accent'
    ]);
    for (const presets of Object.values(COLOR_PRESETS)) {
      expect(presets).toHaveLength(5);
      for (const color of presets) {
        expect(color).toMatch(/^#[0-9A-F]{6}$/);
      }
    }
  });
});

describe('setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('TH-U10 registers the five actions the kit ships', () => {
    expect(registered).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });
});

describe('setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('TH-U7 enables features exactly once', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
  });

  it('TH-U7 enables exactly the features the kit lists', () => {
    expect(enabled).toEqual(ENABLED_FEATURES);
  });

  it.each([
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
    'ly.img.navigation.bar',
    'ly.img.text.edit',
    'ly.img.crop.size',
    'ly.img.page.resize',
    'ly.img.dock',
    'ly.img.library.panel',
    'ly.img.inspector.bar'
  ])('TH-U7 enables %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('TH-U7 leaves the video features off, as this is a design kit', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });
});

describe('setupSettings', () => {
  const spy = createApiSpy<CreativeEngine>();
  setupSettings(spy.api);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it.each([
    ['page/title/show', true],
    ['colorPicker/colorMode', 'Any'],
    ['doubleClickToCropEnabled', true],
    ['page/dimOutOfPageAreas', true],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false]
  ])('TH-U7 sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });
});

describe('setupDock', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupDock(spy.api);
  const entries = orderIn(spy, 'ly.img.dock') as DockEntry[];

  it('TH-U8 lists the seven libraries with the separator after Templates', () => {
    expect(entries.map((entry) => entry.key)).toEqual([
      'ly.img.templates',
      'ly.img.separator',
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.spacer',
      'ly.img.separator.layers',
      'ly.img.layerList'
    ]);
  });

  it('TH-U8 shows labels and large icons', () => {
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });
});

describe('setupNavigationBar', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupNavigationBar(spy.api);
  const order = orderIn(spy, 'ly.img.navigation.bar');

  it('TH-U8 ends with an actions dropdown holding Export image and Export PDF', () => {
    expect(order.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });
});

describe('setupCanvas', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupCanvas(spy.api);
  const bar = spy
    .callsTo('ui.setComponentOrder')
    .find(
      ({ args }) => (args[0] as { in: string; at?: string }).at === 'bottom'
    );

  it('TH-U8 puts the canvas bar at the bottom without a page-select entry', () => {
    expect(bar?.args[1]).toEqual([
      'ly.img.settings.canvasBar',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);
  });
});

describe('setupPanels', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupPanels(spy.api);

  it('TH-U8 docks the inspector and the asset library on the left', () => {
    const positions = new Map(
      spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    const floating = new Map(
      spy
        .callsTo('ui.setPanelFloating')
        .map(({ args }) => [args[0] as string, args[1]])
    );

    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(floating.get('//ly.img.panel/inspector')).toBe(false);
    expect(floating.get('//ly.img.panel/assetLibrary')).toBe(false);
  });
});
