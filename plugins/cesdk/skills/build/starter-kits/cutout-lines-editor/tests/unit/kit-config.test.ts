import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupUI } from '../../src/imgly/config/ui';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';

type DockEntry = { id: string; key: string };

describe('CL-U4 setupDock, setupNavigationBar and setupActions', () => {
  const dockSpy = createApiSpy<CreativeEditorSDK>();
  setupDock(dockSpy.api);
  const dockSettings = new Map(
    dockSpy
      .callsTo('engine.editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );
  const dock = dockSpy.lastArgsOf('ui.setComponentOrder')?.[1] as DockEntry[];

  const navigationSpy = createApiSpy<CreativeEditorSDK>();
  setupNavigationBar(navigationSpy.api);
  const navigation = navigationSpy.lastArgsOf('ui.setComponentOrder')?.[1] as (
    | string
    | { id: string; children: string[] }
  )[];

  const actionsSpy = createApiSpy<CreativeEditorSDK>();
  setupActions(actionsSpy.api);
  const registered = actionsSpy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('shows large dock icons with their labels', () => {
    expect(dockSettings.get('dock/hideLabels')).toBe(false);
    expect(dockSettings.get('dock/iconSize')).toBe('large');
  });

  it('ships no Templates entry, so the cutout plugin can prepend its own', () => {
    expect(dock.map((entry) => entry.key)).toEqual([
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

  it('offers PDF as the only export', () => {
    expect(navigation.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportPDF.navigationBar']
    });
  });

  it('registers the five actions the kit has UI for', () => {
    expect(registered).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });
});

describe('CL-U5 setupFeatures and setupSettings', () => {
  const featureSpy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(featureSpy.api);
  const enabled = featureSpy.lastArgsOf('feature.enable')?.[0] as string[];

  const settingsSpy = createApiSpy<CreativeEngine>();
  setupSettings(settingsSpy.api);
  const settings = new Map(
    settingsSpy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

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
    ]);
  });

  it.each([
    'ly.img.cutout',
    'ly.img.combine.exclude',
    'ly.img.combine.intersect',
    'ly.img.combine.subtract',
    'ly.img.combine.union',
    'ly.img.page.add',
    'ly.img.page.move',
    'ly.img.page.resize'
  ])('enables %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('shows the page title', () => {
    expect(settings.get('page/title/show')).toBe(true);
  });
});

describe('CL-U6 setupUI', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupUI(spy.api);
  const targets = new Set(
    spy
      .callsTo('ui.setComponentOrder')
      .map(({ args }) => (args[0] as { in: string }).in)
  );
  const positions = new Map(
    spy
      .callsTo('ui.setPanelPosition')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('docks the inspector and the asset library on the left', () => {
    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
  });

  it('orders the navigation bar, the dock, the canvas and the inspector bar', () => {
    expect(targets).toContain('ly.img.navigation.bar');
    expect(targets).toContain('ly.img.dock');
    expect(targets).toContain('ly.img.canvas.menu');
    expect(targets).toContain('ly.img.inspector.bar');
  });
});

describe('CL-U7 setupKeyboardShortcuts', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupKeyboardShortcuts(spy.api);
  const catalog = spy.lastArgsOf('shortcuts.set')?.[0] as {
    keys: string;
    run: unknown;
  }[];

  it('sets one US ANSI catalog', () => {
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(catalog.map((shortcut) => shortcut.keys)).toContain('Mod+a');
  });

  it('gives every shortcut a key combination and something to run', () => {
    expect(
      catalog.filter((shortcut) => shortcut.keys === '' || shortcut.run == null)
    ).toEqual([]);
  });
});
