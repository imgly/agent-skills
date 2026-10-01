import { vi } from 'vitest';

// The configuration plugin reads `CreativeEditorSDK.version`, and importing the
// real package touches `window` and `CSS` at module scope.
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { DesignEditorConfig } from '../../src/imgly/config/plugin';
import { setupVideoTimeline } from '../../src/imgly/config/ui/videoTimeline';

describe('PGS-U7 DesignEditorConfig', () => {
  const cesdk = createApiSpy<CreativeEditorSDK>();
  const engine = createApiSpy<CreativeEngine>();
  const plugin = new DesignEditorConfig();

  it('is named and versioned', () => {
    expect(plugin.name).toEqual(expect.any(String));
    expect(plugin.version).toBe('test');
  });

  it('resets the editor and applies features, UI, actions, shortcuts and settings', async () => {
    await plugin.initialize({
      cesdk: cesdk.api,
      engine: engine.api
    } as unknown as EditorPluginContext);

    expect(cesdk.callsTo('resetEditor')).toHaveLength(1);
    expect(cesdk.calls[1]).toEqual({
      path: 'setEditorCompatibilityVersion',
      args: ['test']
    });
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

describe('PGS-U8 setupVideoTimeline', () => {
  it('leaves the timeline at its defaults', () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    setupVideoTimeline(spy.api);

    expect(spy.calls).toEqual([]);
  });
});
