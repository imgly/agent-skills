import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupTranslations } from '../../src/imgly/config/i18n';
import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { VideoEditorConfig } from '../../src/imgly/config/plugin';
import { setupUI } from '../../src/imgly/config/ui';
import { setupComponents } from '../../src/imgly/config/ui/components';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

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

describe('VCA-U10 setupUI', () => {
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

  it('places the panels before any bar, so the bars lay out against them', () => {
    const paths = spy.calls.map(({ path }) => path);
    expect(paths.indexOf('ui.setPanelPosition')).toBeLessThan(
      paths.indexOf('ui.setComponentOrder')
    );
  });

  it('offers the caption control in the transform inspector bar', () => {
    const transform = orders.find(
      ([target]) =>
        target.in === 'ly.img.inspector.bar' &&
        (target as { when?: { editMode?: string } }).when?.editMode ===
          'Transform'
    );
    expect(transform?.[1]).toContain('ly.img.video.caption.inspectorBar');
  });

  it('gives the trim and crop edit modes their own inspector bars', () => {
    const modes = orders
      .filter(([target]) => target.in === 'ly.img.inspector.bar')
      .map(
        ([target]) =>
          (target as { when?: { editMode?: string } }).when?.editMode
      );
    expect(modes).toContain('Trim');
    expect(modes).toContain('Crop');
  });

  it('puts the canvas bar at the bottom', () => {
    const canvasBar = orders.find(
      ([target]) => target.in === 'ly.img.canvas.bar'
    );
    expect(canvasBar?.[0]).toMatchObject({ at: 'bottom' });
  });

  it('offers split and loop in the video timeline controls', () => {
    const timeline = orderFor(orders, 'ly.img.video.timeline.controls.bar');
    expect(timeline).toContain('ly.img.video.timeline.split');
    expect(timeline).toContain('ly.img.video.timeline.loop');
  });

  it('lists the video asset libraries in the dock', () => {
    const keys = (orderFor(orders, 'ly.img.dock') as { key?: string }[]).map(
      (entry) => entry.key
    );
    expect(keys).toContain('ly.img.video');
    expect(keys).toContain('ly.img.audio');
    expect(keys).toContain('ly.img.upload');
  });

  it('registers no custom component, so every slot is a built-in', () => {
    const componentsOnly = createApiSpy<CreativeEditorSDK>();
    setupComponents(componentsOnly.api);
    expect(componentsOnly.calls).toEqual([]);
  });
});

describe('VCA-U11 setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy.callsTo('actions.register');

  it('overrides only the video export action', () => {
    expect(registered.map(({ args }) => args[0])).toEqual(['exportDesign']);
  });

  it('exports with a bounded default bitrate the caller can override', async () => {
    const handler = registered[0].args[1] as (
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

describe('VCA-U12 setupKeyboardShortcuts and setupTranslations', () => {
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

describe('VCA-U13 VideoEditorConfig.initialize', () => {
  it('resets the editor before it configures anything', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    const engine = createApiSpy<CreativeEngine>();
    await new VideoEditorConfig().initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as never);

    const paths = cesdk.calls.map(({ path }) => path);
    expect(paths[0]).toBe('resetEditor');
    expect(paths[1]).toBe('setEditorCompatibilityVersion');
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
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
