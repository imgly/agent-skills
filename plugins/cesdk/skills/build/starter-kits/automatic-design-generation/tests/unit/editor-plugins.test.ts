// @vitest-environment jsdom
// The plugin modules import `@cesdk/cesdk-js` for its version, and the editor
// package reads `window` at module scope.
import { describe, expect, it, vi } from 'vitest';

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { DesignEditorConfig } from '../../src/imgly/config/design/plugin';
import { VideoEditorConfig } from '../../src/imgly/config/video/plugin';
import {
  initDesignGenerationDesignEditor,
  initDesignGenerationVideoEditor
} from '../../src/imgly';

async function initialized(plugin: {
  initialize: (ctx: never) => unknown;
}): Promise<ReturnType<typeof createApiSpy<CreativeEditorSDK>>> {
  const spy = createApiSpy<CreativeEditorSDK>();
  await plugin.initialize({ cesdk: spy.api, engine: spy.api } as never);
  return spy;
}

async function pluginNames(
  init: (target: never) => Promise<void>
): Promise<string[]> {
  const spy = createApiSpy<CreativeEditorSDK>();
  await init(spy.api as never);
  return spy
    .callsTo('addPlugin')
    .map(({ args }) => (args[0] as { name: string }).name);
}

// ADG-U12
describe('ADG-U12 configuration plugins', () => {
  it.each([
    ['design', () => new DesignEditorConfig()],
    ['video', () => new VideoEditorConfig()]
  ])(
    'the %s plugin resets the editor before it configures it',
    async (_name, make) => {
      const spy = await initialized(make());
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
    }
  );

  it('checks the browser codecs in the video editor only', async () => {
    const design = await initialized(new DesignEditorConfig());
    const video = await initialized(new VideoEditorConfig());

    expect(design.callsTo('actions.run')).toEqual([]);
    expect(video.lastArgsOf('actions.run')).toEqual([
      'editor.checkBrowserSupport',
      { videoDecode: 'block', videoEncode: 'warn' }
    ]);
  });

  it.each([
    ['design', () => new DesignEditorConfig()],
    ['video', () => new VideoEditorConfig()]
  ])(
    'the %s plugin configures nothing without an editor',
    async (_name, make) => {
      const spy = createApiSpy<CreativeEditorSDK>();
      await make().initialize({ cesdk: undefined, engine: spy.api } as never);

      expect(spy.calls).toEqual([]);
    }
  );
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

// ADG-U13
describe('ADG-U13 editor asset sources', () => {
  it('adds the design configuration first, then its asset sources', async () => {
    const names = await pluginNames(initDesignGenerationDesignEditor);

    expect(names[0]).toBe('cesdk-design-editor');
    expect(new Set(names).size).toBe(names.length);
  });

  it.each([
    ['design', initDesignGenerationDesignEditor],
    ['video', initDesignGenerationVideoEditor]
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

  it('adds the video configuration first, and the caption presets with it', async () => {
    const names = await pluginNames(initDesignGenerationVideoEditor);

    expect(names[0]).toBe('cesdk-video-editor');
    expect(names).toContain('cesdk-caption-presets-asset-source');
  });

  it('gives only the video editor the caption and audio sources', async () => {
    const design = await pluginNames(initDesignGenerationDesignEditor);

    expect(design).not.toContain('cesdk-caption-presets-asset-source');
  });
});
