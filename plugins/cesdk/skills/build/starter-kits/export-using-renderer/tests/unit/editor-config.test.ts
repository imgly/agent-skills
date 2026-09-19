import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupTranslations } from '../../src/imgly/config/i18n';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { VideoEditorConfig } from '../../src/imgly/config/plugin';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupUI } from '../../src/imgly/config/ui';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupRendererExport } from '../../src/imgly/renderer';

type ComponentOrder = [{ in: string; when?: { editMode?: string } }, unknown[]];

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

// Every id the kit enables, in the order features.ts lists them.
const ENABLED_FEATURES = [
  'ly.img.adjustment',
  'ly.img.animations',
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
  'ly.img.fill.video',
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
  'ly.img.page.clipContent',
  'ly.img.page.resize',
  'ly.img.page.settings',
  'ly.img.playbackSpeed',
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
  'ly.img.transitions',
  'ly.img.trim',
  'ly.img.video.caption',
  'ly.img.video.timeline.addClip',
  'ly.img.video.timeline.audio',
  'ly.img.video.timeline.clip.menu',
  'ly.img.video.timeline.clips',
  'ly.img.video.timeline.controls.background',
  'ly.img.video.timeline.controls.bar',
  'ly.img.video.timeline.controls.loop',
  'ly.img.video.timeline.controls.playback',
  'ly.img.video.timeline.controls.split',
  'ly.img.video.timeline.controls.timelineZoom',
  'ly.img.video.timeline.controls.toggle',
  'ly.img.video.timeline.overlays',
  'ly.img.video.timeline.ruler',
  'ly.img.volume'
];

describe('RND-U11 setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('enables features exactly once and disables none', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
  });

  it('enables exactly the flat feature list', () => {
    expect(enabled).toEqual(ENABLED_FEATURES);
  });

  it.each([
    'ly.img.video.caption',
    'ly.img.video.timeline.clips',
    'ly.img.video.timeline.controls.playback',
    'ly.img.trim',
    'ly.img.volume',
    'ly.img.playbackSpeed',
    'ly.img.animations',
    'ly.img.transitions'
  ])('enables the video feature %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('leaves the placeholder features off, which the renderer export requires', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.placeholder'))).toEqual(
      []
    );
  });
});

describe('RND-U12 setupSettings', () => {
  const spy = createApiSpy<CreativeEngine>();
  setupSettings(spy.api);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it.each([
    ['timeline/trackVisibility', 'all'],
    ['doubleClickToCropEnabled', true],
    ['doubleClickSelectionMode', 'Hierarchical'],
    ['page/allowCropInteraction', true],
    ['page/dimOutOfPageAreas', true],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['page/title/show', false],
    ['colorPicker/colorMode', 'RGB']
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key)).toBe(value);
  });
});

describe('RND-U13 setupUI', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupUI(spy.api);
  const orders = ordersOf(spy);

  it('docks the inspector and the asset library on the left, not floating', () => {
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

  it('puts the panels first, so the later bars lay out against them', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('offers the video timeline controls', () => {
    expect(orderFor(orders, 'ly.img.video.timeline.controls.bar')).toContain(
      'ly.img.video.timeline.split'
    );
  });

  it('keeps the preview button in the navigation bar', () => {
    expect(orderFor(orders, 'ly.img.navigation.bar')).toContain(
      'ly.img.preview.navigationBar'
    );
  });

  it('offers trim, volume and playback speed in the inspector bar', () => {
    const inspectorBar = orderFor(orders, 'ly.img.inspector.bar');
    expect(inspectorBar).toContain('ly.img.trim.inspectorBar');
    expect(inspectorBar).toContain('ly.img.volume.inspectorBar');
    expect(inspectorBar).toContain('ly.img.playbackSpeed.inspectorBar');
  });

  it('shows large dock icons with their labels', () => {
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });

  it('lists the video asset libraries in the dock', () => {
    const keys = (orderFor(orders, 'ly.img.dock') as { key?: string }[]).map(
      (entry) => entry.key
    );
    expect(keys).toContain('ly.img.templates');
    expect(keys).toContain('ly.img.elements');
    expect(keys).toContain('ly.img.upload');
  });

  it('sets the canvas bar at the bottom', () => {
    const canvasBar = orders.find(
      ([target]) => target.in === 'ly.img.canvas.bar'
    );
    expect(canvasBar?.[0]).toMatchObject({ at: 'bottom' });
  });

  it('registers no custom component, so every slot is a built-in', () => {
    const componentsOnly = createApiSpy<CreativeEditorSDK>();
    setupComponents(componentsOnly.api);
    expect(componentsOnly.calls).toEqual([]);
  });
});

describe('RND-U14 setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('overrides only the video export action', () => {
    expect(registered).toEqual(['exportDesign']);
  });

  it('exports with a bounded default bitrate the caller can override', async () => {
    const handler = spy.callsTo('actions.register')[0].args[1] as (
      options: unknown
    ) => Promise<void>;
    await handler({ mimeType: 'video/mp4' });
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      videoBitrate: 'Auto',
      mimeType: 'video/mp4'
    });
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });
});

describe('RND-U15 setupKeyboardShortcuts and setupTranslations', () => {
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

describe('RND-U16 VideoEditorConfig.initialize', () => {
  it('resets the editor before it configures anything', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new VideoEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as never);

    const paths = cesdk.calls.map(({ path }) => path);
    expect(paths[0]).toBe('resetEditor');
    expect(paths).toContain('feature.enable');
    expect(paths).toContain('ui.setComponentOrder');
    expect(paths).toContain('actions.register');
    expect(paths).toContain('shortcuts.set');
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('blocks on missing video decoding and only warns on missing encoding', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new VideoEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as never);

    expect(cesdk.lastArgsOf('actions.run')).toEqual([
      'editor.checkBrowserSupport',
      { videoDecode: 'block', videoEncode: 'warn' }
    ]);
  });

  it('does nothing without a cesdk instance', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new VideoEditorConfig().initialize({
      cesdk: undefined,
      engine: engine.api
    } as never);
    expect(engine.calls).toEqual([]);
  });
});

describe('RND-U17 the navigation bar button runs the renderer action', () => {
  it('wires the export button onto exportUsingRenderer', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupRendererExport(spy.api);

    const actions = orderFor(ordersOf(spy), 'ly.img.navigation.bar').find(
      (entry): entry is { children: unknown[] } =>
        typeof entry === 'object' &&
        entry != null &&
        (entry as { id?: string }).id === 'ly.img.actions.navigationBar'
    );
    const button = actions?.children[0] as {
      key: string;
      label: string;
      onClick: () => void;
    };
    expect(button.key).toBe('export-using-renderer');
    expect(button.label).toBe('actions.export.using.renderer');

    button.onClick();
    expect(spy.lastArgsOf('actions.run')).toEqual(['exportUsingRenderer']);
  });
});
