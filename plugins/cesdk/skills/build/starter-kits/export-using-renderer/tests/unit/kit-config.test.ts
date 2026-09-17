import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { beforeAll, describe, expect, it } from 'vitest';

import { initExportUsingRenderer } from '../../src/imgly';

const spy = createApiSpy<CreativeEditorSDK>();

beforeAll(async () => {
  await initExportUsingRenderer(spy.api);
});

function pluginNames(): string[] {
  return spy
    .callsTo('addPlugin')
    .map(({ args }) => (args[0] as { name?: string }).name ?? '')
    .filter(Boolean);
}

function pluginConfig(name: string): Record<string, unknown> | undefined {
  const call = spy
    .callsTo('addPlugin')
    .find(({ args }) => (args[0] as { name?: string }).name === name);
  return (call?.args[0] as { config?: Record<string, unknown> })?.config;
}

describe('RND-U9 initExportUsingRenderer', () => {
  it('adds the video editor configuration first', () => {
    expect(pluginNames()[0]).toBe('cesdk-video-editor');
  });

  it('disables the placeholder and preview features', () => {
    const flags = new Map(
      spy.callsTo('feature.set').map(({ args }) => [args[0] as string, args[1]])
    );
    expect(flags.get('ly.img.placeholder')).toBe(false);
    expect(flags.get('ly.img.preview')).toBe(false);
  });

  it('limits the demo asset sources to video, image and audio', () => {
    expect(pluginConfig('cesdk-demo-asset-sources')?.include).toEqual([
      'ly.img.templates.video.*',
      'ly.img.image.*',
      'ly.img.audio.*',
      'ly.img.video.*'
    ]);
  });

  it('installs the renderer export after every plugin', () => {
    const paths = spy.calls.map(({ path }) => path);
    const lastPlugin = paths.lastIndexOf('addPlugin');
    const navigationBar = paths.indexOf('ui.setComponentOrder');
    expect(navigationBar).toBeGreaterThan(lastPlugin);
    expect(
      spy.callsTo('actions.register').map(({ args }) => args[0])
    ).toContain('exportUsingRenderer');
  });
});
