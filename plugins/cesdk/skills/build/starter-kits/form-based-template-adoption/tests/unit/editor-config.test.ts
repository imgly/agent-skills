import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupTranslations } from '../../src/imgly/config/i18n';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { DesignEditorConfig } from '../../src/imgly/config/plugin';
import { setupSettings } from '../../src/imgly/config/settings';
import * as ui from '../../src/imgly/config/ui';
import { setupUI } from '../../src/imgly/config/ui';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: '0.0.0-test' } }));

type ComponentOrder = [{ in: string; at?: string }, unknown[]];

function ordersOf(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>
): ComponentOrder[] {
  return spy.callsTo('ui.setComponentOrder').map(({ args }) => args as never);
}

function orderFor(orders: ComponentOrder[], slot: string): unknown[] {
  const match = orders.find(([target]) => target.in === slot);
  if (match == null) {
    throw new Error(`No component order was set for ${slot}`);
  }
  return match[1];
}

describe('FTA-U9 setupFeatures', () => {
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
    'ly.img.text.typeface'
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

  it('leaves the video features off, as this is a design kit', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });
});

describe('FTA-U10 setupSettings', () => {
  const spy = createApiSpy<CreativeEngine>();
  setupSettings(spy.api);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('shows the placeholder overlay and button, which the form drives', () => {
    expect(settings.get('placeholderControls/showOverlay')).toBe(true);
    expect(settings.get('placeholderControls/showButton')).toBe(true);
  });

  it.each([
    ['doubleClickToCropEnabled', true],
    ['doubleClickSelectionMode', 'Hierarchical'],
    ['page/dimOutOfPageAreas', true],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['page/title/show', true],
    ['colorPicker/colorMode', 'Any']
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key)).toBe(value);
  });
});

describe('FTA-U11 setupUI', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupUI(spy.api);
  const orders = ordersOf(spy);

  it('docks the inspector and the asset library on the left, not floating', () => {
    const positions = new Map(
      spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(
      spy.callsTo('ui.setPanelFloating').map(({ args }) => args[1])
    ).toEqual([false, false]);
  });

  it('places the panels before any bar, so the bars lay out against them', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('keeps the preview button in the navigation bar', () => {
    expect(orderFor(orders, 'ly.img.navigation.bar')).toContain(
      'ly.img.preview.navigationBar'
    );
  });

  it('puts the canvas bar at the bottom', () => {
    expect(
      orders.find(([target]) => target.in === 'ly.img.canvas.bar')?.[0]
    ).toMatchObject({ at: 'bottom' });
  });

  it('gives the transform, text and vector edit modes their own canvas menu', () => {
    const modes = orders
      .filter(([target]) => target.in === 'ly.img.canvas.menu')
      .map(
        ([target]) =>
          (target as { when?: { editMode?: string } }).when?.editMode
      );
    expect(modes).toEqual(
      expect.arrayContaining(['Transform', 'Text', 'Vector'])
    );
  });

  it('lists the design asset libraries in the dock', () => {
    const keys = (orderFor(orders, 'ly.img.dock') as { key?: string }[]).map(
      (entry) => entry.key
    );
    expect(keys).toContain('ly.img.templates');
    expect(keys).toContain('ly.img.text');
    expect(keys).toContain('ly.img.upload');
  });

  it('ends the transform inspector bar with the inspector toggle', () => {
    const transform = orders.find(
      ([target]) =>
        target.in === 'ly.img.inspector.bar' &&
        (target as { when?: { editMode?: string } }).when?.editMode ===
          'Transform'
    );
    expect(transform?.[1].at(-1)).toBe('ly.img.inspectorToggle.inspectorBar');
  });

  it('registers no custom component, so every slot is a built-in', () => {
    const componentsOnly = createApiSpy<CreativeEditorSDK>();
    setupComponents(componentsOnly.api);
    expect(componentsOnly.calls).toEqual([]);
  });

  it('configures no video timeline, as this is a design kit', () => {
    const timelineOnly = createApiSpy<CreativeEditorSDK>();
    setupVideoTimeline(timelineOnly.api);
    expect(timelineOnly.calls).toEqual([]);
    expect(Object.keys(ui)).not.toContain('setupVideoTimeline');
  });
});

describe('FTA-U12 setupKeyboardShortcuts and setupTranslations', () => {
  it('installs one shortcut catalog', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupKeyboardShortcuts(spy.api);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBeTruthy();
  });

  it('adds no translation of its own, so every label is a CE.SDK default', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupTranslations(spy.api);
    expect(spy.calls).toEqual([]);
  });
});

describe('FTA-U13 DesignEditorConfig.initialize', () => {
  it('resets the editor before it configures anything', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new DesignEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as never);

    const paths = cesdk.calls.map(({ path }) => path);
    expect(paths[0]).toBe('resetEditor');
    expect(paths[1]).toBe('setEditorCompatibilityVersion');
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual([
      '0.0.0-test'
    ]);
    expect(paths).toContain('feature.enable');
    expect(paths).toContain('ui.setComponentOrder');
    expect(paths).toContain('actions.register');
    expect(paths).toContain('shortcuts.set');
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('does nothing without a cesdk instance', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new DesignEditorConfig().initialize({
      cesdk: undefined,
      engine: engine.api
    } as never);
    expect(engine.calls).toEqual([]);
  });
});

describe('FTA-U26 the actions the kit registers', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
  let handlers: Map<string, (...args: never[]) => unknown>;

  beforeEach(() => {
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    spy = createApiSpy<CreativeEditorSDK>();
    setupActions(spy.api);
    handlers = new Map(
      spy
        .callsTo('actions.register')
        .map(({ args }) => [
          args[0] as string,
          args[1] as (...rest: never[]) => unknown
        ])
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers save, export, import and upload', () => {
    expect([...handlers.keys()].sort()).toEqual([
      'exportDesign',
      'exportScene',
      'importScene',
      'saveScene',
      'uploadFile'
    ]);
  });

  it('saves the scene as plain text', async () => {
    await handlers.get('saveScene')!();
    expect(spy.callsTo('engine.scene.saveToString')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('passes the caller export options straight through', async () => {
    await handlers.get('exportDesign')!({
      mimeType: 'application/pdf'
    } as never);
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'application/pdf'
    });
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });

  it('offers one picker for scenes and archives, then zooms to the first page', async () => {
    await handlers.get('importScene')!();
    expect(spy.lastArgsOf('utils.loadFile')?.[0]).toEqual({
      accept: '.imgly,.scene,.zip',
      returnType: 'objectURL'
    });
    expect(spy.callsTo('engine.scene.load')).toHaveLength(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(spy.lastArgsOf('actions.run')).toEqual([
      'zoom.toPage',
      { page: 'first' }
    ]);
  });

  it('exports an archive as a zip and a scene as text', async () => {
    await handlers.get('exportScene')!({ format: 'archive' } as never);
    expect(spy.callsTo('engine.scene.saveToArchive')).toHaveLength(1);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe('application/zip');

    await handlers.get('exportScene')!({} as never);
    expect(spy.lastArgsOf('utils.downloadFile')?.[1]).toBe(
      'text/plain;charset=UTF-8'
    );
  });

  it('uploads through the SDK local upload helper', () => {
    handlers.get('uploadFile')!(
      'file' as never,
      undefined as never,
      'context' as never
    );
    expect(spy.lastArgsOf('utils.localUpload')).toEqual(['file', 'context']);
  });
});
