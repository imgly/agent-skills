import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

import { setupTranslations } from '../../src/imgly/config/i18n';
import { usAnsiCatalog } from '../../src/imgly/config/keyboard/catalogs/us-ansi';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { VideoEditorConfig } from '../../src/imgly/config/plugin';
import { setupUI } from '../../src/imgly/config/ui';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupInspectorBar } from '../../src/imgly/config/ui/inspectorBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

type OrderTarget = { in: string; at?: string; when?: { editMode?: string } };

function run(setup: (cesdk: CreativeEditorSDK) => void) {
  const spy = createApiSpy<CreativeEditorSDK>();
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

describe('SWV-U8 setupPanels', () => {
  const spy = run(setupPanels);

  it('docks the inspector and the asset library on the left', () => {
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

describe('SWV-U9 setupUI', () => {
  const spy = run(setupUI);

  it('positions the panels before it orders any component', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('orders every bar the kit owns', () => {
    const slots = new Set(
      spy
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

describe('SWV-U10 setupInspectorBar', () => {
  const spy = run(setupInspectorBar);

  it('offers the video controls in the Transform bar', () => {
    const entries = barFor(spy, 'ly.img.inspector.bar', 'Transform');
    expect(entries).toContain('ly.img.trim.inspectorBar');
    expect(entries).toContain('ly.img.volume.inspectorBar');
    expect(entries).toContain('ly.img.playbackSpeed.inspectorBar');
    expect(entries).toContain('ly.img.video.caption.inspectorBar');
  });

  it('replaces the bar with the mode controls while trimming or cropping', () => {
    expect(barFor(spy, 'ly.img.inspector.bar', 'Trim')).toEqual([
      'ly.img.trimControls.inspectorBar'
    ]);
    expect(barFor(spy, 'ly.img.inspector.bar', 'Crop')).toEqual([
      'ly.img.cropControls.inspectorBar'
    ]);
  });

  it('offers the vector edit modes in the Vector bar', () => {
    expect(barFor(spy, 'ly.img.inspector.bar', 'Vector')).toContain(
      'ly.img.vectorEdit.done.inspectorBar'
    );
  });
});

describe('SWV-U11 setupVideoTimeline', () => {
  it('keeps split, playback and zoom in the timeline controls', () => {
    const spy = run(setupVideoTimeline);
    expect(barFor(spy, 'ly.img.video.timeline.controls.bar')).toEqual([
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

describe('SWV-U12 setupComponents, setupTranslations and setupKeyboardShortcuts', () => {
  it('registers no custom component and overrides no translation', () => {
    expect(run(setupComponents).calls).toEqual([]);
    expect(run(setupTranslations).calls).toEqual([]);
  });

  it('installs the US ANSI shortcut catalog unchanged', () => {
    const spy = run(setupKeyboardShortcuts);
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(spy.lastArgsOf('shortcuts.set')?.[0]).toBe(usAnsiCatalog);
  });
});

describe('SWV-U13 VideoEditorConfig', () => {
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

    expect(cesdk.calls[0].path).toBe('resetEditor');
    expect(cesdk.calls[1].path).toBe('setEditorCompatibilityVersion');
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
