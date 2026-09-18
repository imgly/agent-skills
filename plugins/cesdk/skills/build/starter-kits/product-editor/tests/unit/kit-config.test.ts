import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';

type DockEntry = { key: string; entries: string[] };

describe('PE-U5 setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('enables features exactly once and disables none', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
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
    // 'ly.img.layerList.thumbnails', /* Thumbnail on every row */
    'ly.img.layerList.visibility',
    'ly.img.navigation.bar',
    'ly.img.navigation.undoRedo',
    'ly.img.text.edit',
    'ly.img.text.typeface',
    'ly.img.crop.size',
    'ly.img.dock',
    'ly.img.library.panel',
    'ly.img.inspector.bar',
    'ly.img.inspector.toggle'
  ])('enables %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('enables exactly the features the kit lists', () => {
    expect(enabled).toEqual([
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
      'ly.img.navigation.documentSettings',
      'ly.img.navigation.undoRedo',
      'ly.img.navigation.zoom',
      'ly.img.notifications.redo',
      'ly.img.notifications.undo',
      'ly.img.opacity',
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

  it('leaves page and video features off, since a page is a print area here', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.page'))).toEqual([]);
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });
});

describe('PE-U5 setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it.each(['saveScene', 'exportDesign', 'importScene', 'exportScene'])(
    'registers %s',
    (action) => {
      expect(registered).toContain(action);
    }
  );
});

describe('PE-U5 setupSettings', () => {
  const spy = createApiSpy<CreativeEngine>();
  setupSettings(spy.api);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it.each([
    ['doubleClickToCropEnabled', true],
    ['doubleClickSelectionMode', 'Hierarchical'],
    ['page/dimOutOfPageAreas', false],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['page/title/show', false],
    ['page/title/separator', '-'],
    ['colorPicker/colorMode', 'Any']
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });
});

describe('PE-U5 setupNavigationBar', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupNavigationBar(spy.api);
  const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    string[]
  ];

  it('holds undo/redo, the title and zoom only', () => {
    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    expect(order).toEqual([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.title.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar'
    ]);
  });

  it('offers no actions dropdown and no export entry', () => {
    expect(order).not.toContain('ly.img.actions.navigationBar');
    expect(order.filter((id) => id.includes('export'))).toEqual([]);
  });
});

describe('PE-U5 setupCanvas', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupCanvas(spy.api);
  const canvasBar = spy
    .callsTo('ui.setComponentOrder')
    .find(({ args }) => (args[0] as { in: string }).in === 'ly.img.canvas.bar');

  it('puts the area selector in the bottom canvas bar', () => {
    expect(canvasBar?.args[0]).toEqual({
      in: 'ly.img.canvas.bar',
      at: 'bottom'
    });
    expect(canvasBar?.args[1]).toEqual([
      'ly.img.spacer',
      'product-area-select',
      'ly.img.spacer'
    ]);
  });
});

describe('PE-U5 setupComponents', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupComponents(spy.api);

  it('registers the area selector', () => {
    expect(
      spy.callsTo('ui.registerComponent').map(({ args }) => args[0])
    ).toEqual(['product-area-select']);
  });
});

describe('PE-U5 setupDock', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupDock(spy.api);
  const order = spy.lastArgsOf('ui.setComponentOrder')?.[1] as DockEntry[];

  it('shows the six libraries in order, with labels', () => {
    expect(order.map((entry) => entry.key)).toEqual([
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
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });

  it('repeats each library of the combined Elements entry as its own entry', () => {
    // Known issue 6 of the test plan: Image, Text, Shapes and Stickers each
    // appear twice in the dock.
    const elements = order[0].entries;
    const standalone = order.slice(2).flatMap((entry) => entry.entries);
    elements.forEach((entry) => expect(standalone).toContain(entry));
  });
});

describe('PE-U5 setupPanels', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupPanels(spy.api);
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

  it('docks the inspector right and the asset library left', () => {
    expect(positions.get('//ly.img.panel/inspector')).toBe('right');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(floating.get('//ly.img.panel/inspector')).toBe(false);
    expect(floating.get('//ly.img.panel/assetLibrary')).toBe(false);
  });
});
