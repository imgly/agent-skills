import { vi } from 'vitest';

// The configuration plugin imports `@cesdk/cesdk-js` for its version, and that
// package reads `window` at module scope.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { DesignEditorConfig } from '../../src/imgly/config/plugin';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

describe('SPE-U11 DesignEditorConfig', () => {
  const cesdk = createApiSpy<CreativeEditorSDK>();
  const engine = createApiSpy<CreativeEngine>();
  const plugin = new DesignEditorConfig();

  it('is named and versioned', () => {
    expect(plugin.name).toEqual(expect.any(String));
    expect(plugin.version).toEqual(expect.any(String));
  });

  it('resets the editor and applies features, UI, actions, shortcuts and settings', async () => {
    await plugin.initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as unknown as EditorPluginContext);

    expect(cesdk.callsTo('resetEditor')).toHaveLength(1);
    expect(cesdk.callsTo('actions.register').length).toBeGreaterThan(0);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(cesdk.callsTo('ui.setComponentOrder').length).toBeGreaterThan(0);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
  });

  it('declares the CE.SDK generation right after the reset', () => {
    expect(cesdk.calls.map(({ path }) => path).slice(0, 2)).toEqual([
      'resetEditor',
      'setEditorCompatibilityVersion'
    ]);
    expect(cesdk.callsTo('setEditorCompatibilityVersion')).toHaveLength(1);
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual([
      CreativeEditorSDK.version
    ]);
  });

  it('configures nothing when the plugin runs without an editor', async () => {
    const headless = createApiSpy<CreativeEngine>();

    await plugin.initialize({
      cesdk: undefined,
      engine: headless.api
    } as unknown as EditorPluginContext);

    expect(headless.calls).toEqual([]);
  });
});

describe('SPE-U12 setupVideoTimeline', () => {
  it('leaves the timeline at its defaults', () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    setupVideoTimeline(spy.api);

    expect(spy.calls).toEqual([]);
  });
});
