import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupTranslations } from '../../src/imgly/config/i18n';
import { usAnsiCatalog } from '../../src/imgly/config/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { VideoEditorConfig } from '../../src/imgly/config/plugin';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupUI } from '../../src/imgly/config/ui';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupInspectorBar } from '../../src/imgly/config/ui/inspectorBar';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

type OrderTarget = { in: string; at?: string; when?: { editMode?: string } };

function run<T>(setup: (api: T) => void) {
  const spy = createApiSpy<T>();
  setup(spy.api);
  return spy;
}

function barFor(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>,
  slot: string,
  editMode?: string
): unknown[] {
  const match = spy
    .callsTo('ui.setComponentOrder')
    .map(({ args }) => args as [OrderTarget, unknown[]])
    .find(
      ([target]) => target.in === slot && target.when?.editMode === editMode
    );
  if (match == null) {
    throw new Error(`No component order for ${slot} (editMode ${editMode})`);
  }
  return match[1];
}

describe('H5-U8 setupFeatures', () => {
  const spy = run<CreativeEditorSDK>(setupFeatures);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('enables exactly the video ad features this kit needs', () => {
    expect(enabled).toEqual([
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
    ]);
  });

  it('offers no export button of its own, so the panel owns the export', () => {
    expect(enabled.filter((id) => id.includes('export'))).toEqual([]);
  });
});

describe('H5-U9 setupPanels and setupUI', () => {
  it('docks the inspector and the asset library on the left', () => {
    const spy = run<CreativeEditorSDK>(setupPanels);
    const positions = new Map(
      spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
  });

  it('positions the panels before it orders any component', () => {
    const paths = run<CreativeEditorSDK>(setupUI).calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('orders every bar the kit owns, timeline included', () => {
    const slots = new Set(
      run<CreativeEditorSDK>(setupUI)
        .callsTo('ui.setComponentOrder')
        .map(({ args }) => (args[0] as OrderTarget).in)
    );
    expect([...slots].sort()).toEqual([
      'ly.img.canvas.bar',
      'ly.img.canvas.menu',
      'ly.img.dock',
      'ly.img.inspector.bar',
      'ly.img.navigation.bar',
      'ly.img.video.timeline.controls.bar'
    ]);
  });
});

describe('H5-U10 setupDock', () => {
  const spy = run<CreativeEditorSDK>(setupDock);
  const entries = barFor(spy, 'ly.img.dock') as { key: string }[];

  it('shows large labelled icons', () => {
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });

  it('leads with the combined elements entry and then uploads', () => {
    expect(entries.map(({ key }) => key)).toEqual([
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker'
    ]);
  });
});

describe('H5-U11 setupCanvas, setupInspectorBar and setupNavigationBar', () => {
  const canvas = run<CreativeEditorSDK>(setupCanvas);
  const inspector = run<CreativeEditorSDK>(setupInspectorBar);

  it('keeps the add-page button in a bottom canvas bar', () => {
    const [target, order] = canvas
      .callsTo('ui.setComponentOrder')
      .map(({ args }) => args as [OrderTarget, unknown[]])
      .find(([slot]) => slot.in === 'ly.img.canvas.bar') as [
      OrderTarget,
      unknown[]
    ];
    expect(target.at).toBe('bottom');
    expect(order).toContain('ly.img.page.add.canvasBar');
  });

  it('offers duplicate, delete and text formatting in the canvas menus', () => {
    expect(barFor(canvas, 'ly.img.canvas.menu', 'Transform')).toContain(
      'ly.img.delete.canvasMenu'
    );
    expect(barFor(canvas, 'ly.img.canvas.menu', 'Text')).toContain(
      'ly.img.text.bold.canvasMenu'
    );
    expect(barFor(canvas, 'ly.img.canvas.menu', 'Vector')).toEqual([]);
  });

  it('offers the animation controls in the Transform bar', () => {
    const entries = barFor(inspector, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContain('ly.img.animations.inspectorBar');
    expect(entries).toContain('ly.img.trim.inspectorBar');
  });

  it('replaces the inspector bar with the mode controls while trimming', () => {
    expect(barFor(inspector, 'ly.img.inspector.bar', 'Trim')).toEqual([
      'ly.img.trimControls.inspectorBar'
    ]);
    expect(barFor(inspector, 'ly.img.inspector.bar', 'Crop')).toEqual([
      'ly.img.cropControls.inspectorBar'
    ]);
    expect(barFor(inspector, 'ly.img.inspector.bar', 'Vector')).toContain(
      'ly.img.vectorEdit.done.inspectorBar'
    );
  });

  it('carries no export entry in the navigation bar', () => {
    const entries = barFor(
      run<CreativeEditorSDK>(setupNavigationBar),
      'ly.img.navigation.bar'
    );
    expect(entries).toEqual([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.preview.navigationBar'
    ]);
  });
});

describe('H5-U12 setupVideoTimeline, setupSettings and the empty setups', () => {
  it('keeps split, playback and zoom in the timeline controls', () => {
    const entries = barFor(
      run<CreativeEditorSDK>(setupVideoTimeline),
      'ly.img.video.timeline.controls.bar'
    );
    expect(entries).toContain('ly.img.video.timeline.split');
    expect(entries).toContain('ly.img.video.timeline.playPause');
    expect(entries).toContain('ly.img.video.timeline.zoom');
  });

  it('shows every timeline track and hides the page title', () => {
    const settings = new Map(
      run<CreativeEngine>(setupSettings)
        .callsTo('editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('timeline/trackVisibility')).toBe('all');
    expect(settings.get('page/title/show')).toBe(false);
    expect(settings.get('doubleClickToCropEnabled')).toBe(true);
  });

  it('registers no custom component and overrides no translation', () => {
    expect(run<CreativeEditorSDK>(setupComponents).calls).toEqual([]);
    expect(run<CreativeEditorSDK>(setupTranslations).calls).toEqual([]);
  });

  it('installs the US ANSI shortcut catalog unchanged', () => {
    const spy = run<CreativeEditorSDK>(setupKeyboardShortcuts);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBe(usAnsiCatalog);
  });
});

describe('H5-U13 setupActions', () => {
  const spy = run<CreativeEditorSDK>(setupActions);
  const [name, handler] = spy.lastArgsOf('actions.register') as [
    string,
    (options?: unknown) => Promise<void>
  ];

  it('overrides exactly one action, exportDesign', () => {
    expect(spy.callsTo('actions.register')).toHaveLength(1);
    expect(name).toBe('exportDesign');
  });

  it('exports at automatic video bitrate and downloads the first blob', async () => {
    await handler();
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      videoBitrate: 'Auto'
    });
    expect(spy.callsTo('utils.downloadFile')).toHaveLength(1);
  });

  it('lets the caller override the bitrate', async () => {
    await handler({ videoBitrate: 4_000_000, mimeType: 'video/mp4' });
    expect(spy.lastArgsOf('utils.export')?.[0]).toEqual({
      videoBitrate: 4_000_000,
      mimeType: 'video/mp4'
    });
  });
});

describe('H5-U14 VideoEditorConfig', () => {
  it('is named for the kit and carries the SDK version', () => {
    const plugin = new VideoEditorConfig();
    expect(plugin.name).toBe('cesdk-video-editor');
    expect(plugin.version).toBe('test');
  });

  it('resets the editor, configures it and blocks unsupported video decoding', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new VideoEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as EditorPluginContext);

    expect(cesdk.calls.slice(0, 2).map(({ path }) => path)).toEqual([
      'resetEditor',
      'setEditorCompatibilityVersion'
    ]);
    expect(cesdk.callsTo('setEditorCompatibilityVersion')).toHaveLength(1);
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
    expect(cesdk.callsTo('feature.enable')).toHaveLength(1);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
    expect(cesdk.lastArgsOf('actions.run')).toEqual([
      'editor.checkBrowserSupport',
      { videoDecode: 'block', videoEncode: 'warn' }
    ]);
  });

  it('does nothing without an editor, so the engine-only host stays untouched', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new VideoEditorConfig().initialize({
      engine: engine.api
    } as EditorPluginContext);
    expect(engine.calls).toEqual([]);
  });
});
