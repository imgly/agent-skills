import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { usAnsiCatalog } from '../../src/imgly/config/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { VideoEditorConfig } from '../../src/imgly/config/plugin';
import { setupUI } from '../../src/imgly/config/ui';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupInspectorBar } from '../../src/imgly/config/ui/inspectorBar';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

type OrderTarget = { in: string; at?: string; when?: { editMode?: string } };

function run(setup: (cesdk: CreativeEditorSDK) => void) {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  return spy;
}

function orders(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>
): [OrderTarget, unknown[]][] {
  return spy.callsTo('ui.setComponentOrder').map(({ args }) => args as never);
}

function orderFor(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>,
  slot: string,
  editMode?: string
): unknown[] {
  const match = orders(spy).find(
    ([target]) => target.in === slot && target.when?.editMode === editMode
  );
  if (match == null) {
    throw new Error(`No component order for ${slot} (editMode ${editMode})`);
  }
  return match[1];
}

describe('VAN-U10 setupUI', () => {
  const spy = run(setupUI);

  it('positions the panels before it orders any component', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('orders every bar the kit owns', () => {
    const slots = new Set(orders(spy).map(([target]) => target.in));
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

describe('VAN-U11 setupCanvas', () => {
  const spy = run(setupCanvas);

  it('centres the add-page button in the canvas bar at the bottom', () => {
    const [target, entries] = orders(spy).find(
      ([slot]) => slot.in === 'ly.img.canvas.bar'
    ) as [OrderTarget, unknown[]];
    expect(target.at).toBe('bottom');
    expect(entries).toEqual([
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);
  });

  it('offers text editing entries in the Transform canvas menu', () => {
    const entries = orderFor(spy, 'ly.img.canvas.menu', 'Transform');
    expect(entries).toContain('ly.img.text.edit.canvasMenu');
    expect(entries).toContain('ly.img.duplicate.canvasMenu');
    expect(entries).toContain('ly.img.delete.canvasMenu');
  });

  it('offers text formatting in the Text canvas menu and nothing in Vector', () => {
    expect(orderFor(spy, 'ly.img.canvas.menu', 'Text')).toContain(
      'ly.img.text.bold.canvasMenu'
    );
    expect(orderFor(spy, 'ly.img.canvas.menu', 'Vector')).toEqual([]);
  });
});

describe('VAN-U12 setupInspectorBar', () => {
  const spy = run(setupInspectorBar);

  it('carries the animation and transition controls this kit is about', () => {
    const entries = orderFor(spy, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContain('ly.img.animations.inspectorBar');
    expect(entries).toContain('ly.img.transitions.inspectorBar');
  });

  it('groups the appearance controls under one entry', () => {
    const entries = orderFor(spy, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContainEqual({
      id: 'ly.img.appearance.inspectorBar',
      children: [
        'ly.img.adjustment.inspectorBar',
        'ly.img.filter.inspectorBar',
        'ly.img.effect.inspectorBar',
        'ly.img.blur.inspectorBar'
      ]
    });
  });

  it('replaces the bar with the mode controls while trimming or cropping', () => {
    expect(orderFor(spy, 'ly.img.inspector.bar', 'Trim')).toEqual([
      'ly.img.trimControls.inspectorBar'
    ]);
    expect(orderFor(spy, 'ly.img.inspector.bar', 'Crop')).toEqual([
      'ly.img.cropControls.inspectorBar'
    ]);
  });

  it('offers the vector edit modes in the Vector bar', () => {
    expect(orderFor(spy, 'ly.img.inspector.bar', 'Vector')).toContain(
      'ly.img.vectorEdit.done.inspectorBar'
    );
  });
});

describe('VAN-U13 setupVideoTimeline', () => {
  const spy = run(setupVideoTimeline);

  it('keeps split, playback and zoom in the timeline controls', () => {
    const entries = orderFor(spy, 'ly.img.video.timeline.controls.bar');
    expect(entries).toEqual([
      'ly.img.video.timeline.background',
      'ly.img.video.timeline.split',
      'ly.img.spacer',
      'ly.img.video.timeline.playbackInfo',
      'ly.img.video.timeline.playPause',
      'ly.img.video.timeline.loop',
      'ly.img.spacer',
      'ly.img.video.timeline.zoom',
      'ly.img.video.timeline.toggle'
    ]);
  });
});

describe('VAN-U14 setupComponents and setupKeyboardShortcuts', () => {
  it('registers no custom component', () => {
    expect(run(setupComponents).calls).toEqual([]);
  });

  it('installs the US ANSI shortcut catalog unchanged', () => {
    const spy = run(setupKeyboardShortcuts);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBe(usAnsiCatalog);
  });
});

describe('VAN-U15 setupActions', () => {
  const spy = run(setupActions);
  const [name, handler] = spy.lastArgsOf('actions.register') as [
    string,
    (options?: Record<string, unknown>) => Promise<void>
  ];

  it('registers exactly one action, exportDesign', () => {
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

describe('VAN-U16 VideoEditorConfig', () => {
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

    const paths = cesdk.calls.map(({ path }) => path);
    expect(paths[0]).toBe('resetEditor');
    expect(paths[1]).toBe('setEditorCompatibilityVersion');
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
    expect(cesdk.callsTo('feature.enable')).toHaveLength(1);
    expect(cesdk.callsTo('actions.register')).toHaveLength(1);
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
