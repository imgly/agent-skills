// @vitest-environment jsdom
// The plugin modules import `@cesdk/cesdk-js` for its version, and the editor
// package reads `window` at module scope.
import { describe, expect, it, vi } from 'vitest';

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { AdvancedEditorConfig } from '../../src/imgly/config/advanced-design-editor/plugin';
import { DesignEditorConfig } from '../../src/imgly/config/design-editor/plugin';
import {
  initMultiImageGenerationAdvancedDesignEditor,
  initMultiImageGenerationDesignEditor,
  registerMultiImageGenerationAssetSources
} from '../../src/imgly';

// MIG-U6
describe('MIG-U6 configuration plugins', () => {
  function initialized(plugin: { initialize: (ctx: never) => unknown }) {
    const spy = createApiSpy<CreativeEditorSDK>();
    void plugin.initialize({ cesdk: spy.api, engine: spy.api } as never);
    return spy;
  }

  it('gives the design editor the Adopter role and the light theme', () => {
    const spy = initialized(new DesignEditorConfig());

    expect(spy.lastArgsOf('editor.setRole')).toEqual(['Adopter']);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['light']);
  });

  it('gives the advanced editor the Creator role and the dark theme', () => {
    const spy = initialized(new AdvancedEditorConfig());

    expect(spy.lastArgsOf('editor.setRole')).toEqual(['Creator']);
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['dark']);
  });

  it.each([
    ['design', () => new DesignEditorConfig()],
    ['advanced', () => new AdvancedEditorConfig()]
  ])('the %s plugin resets the editor before it configures it', (_n, make) => {
    const spy = initialized(make());
    const order = spy.calls.map(({ path }) => path);

    expect(order.slice(0, 2)).toEqual([
      'resetEditor',
      'setEditorCompatibilityVersion'
    ]);
    expect(spy.callsTo('setEditorCompatibilityVersion')).toHaveLength(1);
    expect(spy.lastArgsOf('setEditorCompatibilityVersion')).toEqual([
      CreativeEditorSDK.version
    ]);
    for (const path of [
      'feature.enable',
      'ui.setComponentOrder',
      'actions.register',
      'shortcuts.set',
      'editor.setSetting'
    ]) {
      expect(order).toContain(path);
    }
  });

  it('configures nothing when the plugin gets no editor', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    void new DesignEditorConfig().initialize({
      cesdk: undefined,
      engine: spy.api
    } as never);

    expect(spy.calls).toEqual([]);
  });
});

/** An editor whose `addPlugin` only settles when the test says so. */
function deferredEditor() {
  const spy = createApiSpy<CreativeEditorSDK>();
  const settle: Array<() => void> = [];
  const api = new Proxy(spy.api as object, {
    get(target, key, receiver) {
      if (key !== 'addPlugin') {
        return Reflect.get(target, key, receiver);
      }
      return (plugin: unknown) => {
        (target as { addPlugin: (p: unknown) => void }).addPlugin(plugin);
        return new Promise<void>((resolve) => settle.push(resolve));
      };
    }
  }) as CreativeEditorSDK;
  return { api, spy, settle };
}

// MIG-U9
describe('MIG-U9 editor and headless asset sources', () => {
  async function pluginNames(
    init: (target: never) => Promise<void>
  ): Promise<string[]> {
    const spy = createApiSpy<CreativeEditorSDK>();
    await init(spy.api as never);
    return spy
      .callsTo('addPlugin')
      .map(({ args }) => (args[0] as { name: string }).name);
  }

  it.each([
    ['design', initMultiImageGenerationDesignEditor],
    ['advanced', initMultiImageGenerationAdvancedDesignEditor]
  ])('the %s editor adds its configuration first', async (name, init) => {
    const names = await pluginNames(init);

    expect(names[0]).toBe(
      name === 'design' ? 'cesdk-design-editor' : 'cesdk-advanced-editor'
    );
    expect(names).toContain('cesdk-premium-asset-sources');
    expect(new Set(names).size).toBe(names.length);
  });

  it.each([
    ['design', initMultiImageGenerationDesignEditor],
    ['advanced', initMultiImageGenerationAdvancedDesignEditor]
  ])(
    'the %s editor registers every asset source at once, not one after another',
    async (_name, init) => {
      const total = (await pluginNames(init)).length;
      const { api, spy, settle } = deferredEditor();
      const done = init(api as never);

      // The configuration plugin is awaited on its own.
      await vi.waitFor(() => expect(settle).toHaveLength(1));
      settle[0]();

      // Sequential registration would stall here: every remaining source is
      // in flight before any of them settles.
      await vi.waitFor(() => expect(settle).toHaveLength(total));
      expect(spy.callsTo('addPlugin')).toHaveLength(total);

      settle.forEach((resolve) => resolve());
      await done;
    }
  );

  it('gives both editors the same asset sources', async () => {
    const design = await pluginNames(initMultiImageGenerationDesignEditor);
    const advanced = await pluginNames(
      initMultiImageGenerationAdvancedDesignEditor
    );

    expect(design.slice(1)).toEqual(advanced.slice(1));
  });

  it('registers the headless sources without the editor-only ones', async () => {
    const names = await pluginNames(registerMultiImageGenerationAssetSources);

    expect(names).toContain('cesdk-page-presets-asset-source');
    expect(names).toContain('cesdk-demo-asset-sources');
    expect(names).not.toContain('cesdk-premium-asset-sources');
  });
});
