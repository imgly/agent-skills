import { vi } from 'vitest';

// The configuration plugin imports `@cesdk/cesdk-js` for its version. The real
// package probes the DOM at module scope, so the version is all it gets here.
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { ProductEditorConfig } from '../../src/imgly/config/plugin';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

describe('PE-U8 ProductEditorConfig', () => {
  const cesdk = createApiSpy<CreativeEditorSDK>();
  const engine = createApiSpy<CreativeEngine>();
  const plugin = new ProductEditorConfig();

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
    expect(cesdk.calls[1].path).toBe('setEditorCompatibilityVersion');
    expect(cesdk.lastArgsOf('setEditorCompatibilityVersion')).toEqual(['test']);
    expect(cesdk.callsTo('actions.register').length).toBeGreaterThan(0);
    expect(cesdk.callsTo('shortcuts.set')).toHaveLength(1);
    expect(cesdk.callsTo('ui.setComponentOrder').length).toBeGreaterThan(0);
    expect(engine.callsTo('editor.setSetting').length).toBeGreaterThan(0);
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

describe('PE-U9 setupVideoTimeline', () => {
  it('leaves the timeline at its defaults', () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    setupVideoTimeline(spy.api);

    expect(spy.calls).toEqual([]);
  });
});
