import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import {
  DEMO_ASSETS_BASE_URL,
  VIDEO_CATALOG
} from '../../src/app/video-catalog';
import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';

function orderIn(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>,
  container: string
): unknown[] {
  const call = spy
    .callsTo('ui.setComponentOrder')
    .find(({ args }) => (args[0] as { in: string }).in === container);
  if (call == null) {
    throw new Error(`No component order was set for ${container}.`);
  }
  return call.args[1] as unknown[];
}

describe('VIDEO_CATALOG', () => {
  it('SWV-U1 holds three demo videos with a thumbnail and an attribution', () => {
    expect(VIDEO_CATALOG).toHaveLength(3);

    for (const video of VIDEO_CATALOG) {
      expect(video.full.startsWith(`${DEMO_ASSETS_BASE_URL}/`)).toBe(true);
      expect(video.full).toMatch(/\.mp4$/);
      expect(video.thumbUri.startsWith(`${DEMO_ASSETS_BASE_URL}/`)).toBe(true);
      expect(video.thumbUri).toMatch(/\.png$/);
      expect(video.alt).not.toBe('');
      expect(video.author.name).not.toBe('');
      expect(video.author.url).toMatch(/^https:\/\/www\.pexels\.com\//);
    }
  });

  it("SWV-U1 falls back to the kit's own URL", () => {
    expect(DEMO_ASSETS_BASE_URL).toBe(
      import.meta.env.VITE_DEMO_ASSETS_BASE_URL ??
        (typeof location === 'undefined'
          ? import.meta.env.BASE_URL
          : new URL(import.meta.env.BASE_URL, location.href).href
        ).replace(/\/$/, '')
    );
  });
});

describe('setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('SWV-U4 enables features exactly once', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
  });

  it.each([
    'ly.img.video.timeline.clips',
    'ly.img.video.caption',
    'ly.img.volume',
    'ly.img.playbackSpeed',
    'ly.img.animations',
    'ly.img.transitions',
    'ly.img.trim'
  ])('SWV-U4 enables %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('SWV-U4 names every feature on its own, enabling no umbrella group', () => {
    const umbrellas = enabled.filter((feature) =>
      enabled.some((other) => other.startsWith(`${feature}.`))
    );
    expect(umbrellas).toEqual([]);
  });
});

describe('setupSettings', () => {
  const spy = createApiSpy<CreativeEngine>();
  setupSettings(spy.api);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it.each([
    ['timeline/trackVisibility', 'all'],
    ['colorPicker/colorMode', 'RGB'],
    ['page/title/show', false],
    ['doubleClickToCropEnabled', true]
  ])('SWV-U5 sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });
});

describe('setupDock, setupNavigationBar and setupCanvas', () => {
  it('SWV-U6 lists the nine libraries with the separator after Templates', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupDock(spy.api);

    expect(
      (orderIn(spy, 'ly.img.dock') as { key: string }[]).map(
        (entry) => entry.key
      )
    ).toEqual([
      'ly.img.templates',
      'ly.img.separator',
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.video',
      'ly.img.audio',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker'
    ]);
  });

  it('SWV-U6 shows labels and large icons', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupDock(spy.api);
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );

    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });

  it('SWV-U6 ends the navigation bar with a video-only actions entry', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupNavigationBar(spy.api);

    expect(orderIn(spy, 'ly.img.navigation.bar').at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportVideo.navigationBar']
    });
  });

  it('SWV-U6 puts the canvas bar at the bottom without a page-select entry', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupCanvas(spy.api);
    const bar = spy
      .callsTo('ui.setComponentOrder')
      .find(
        ({ args }) => (args[0] as { in: string; at?: string }).at === 'bottom'
      );

    expect(bar?.args[1]).toEqual([
      'ly.img.settings.canvasBar',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);
  });
});

describe('setupActions', () => {
  function exportAction() {
    const calls: { name: string; args: unknown[] }[] = [];
    const cesdk = {
      actions: {
        register: (name: string, handler: unknown) => {
          calls.push({ name, args: [handler] });
        }
      },
      utils: {
        export: async (options: Record<string, unknown>) => {
          calls.push({ name: 'export', args: [options] });
          return { blobs: ['blob'], options: { mimeType: options.mimeType } };
        },
        downloadFile: async (blob: unknown, mimeType: string) => {
          calls.push({ name: 'downloadFile', args: [blob, mimeType] });
        }
      }
    };
    setupActions(cesdk as never);
    const registered = calls.find((call) => call.name === 'exportDesign');
    calls.length = 0;
    return {
      calls,
      run: registered?.args[0] as (
        options: Record<string, unknown>
      ) => Promise<void>
    };
  }

  it('SWV-U7 adds the automatic bitrate and downloads the result', async () => {
    const { calls, run } = exportAction();

    await run({ mimeType: 'video/mp4' });

    expect(calls).toEqual([
      {
        name: 'export',
        args: [{ videoBitrate: 'Auto', mimeType: 'video/mp4' }]
      },
      { name: 'downloadFile', args: ['blob', 'video/mp4'] }
    ]);
  });

  it('SWV-U7 lets the caller override the bitrate', async () => {
    const { calls, run } = exportAction();

    await run({ mimeType: 'video/mp4', videoBitrate: 8_000_000 });

    expect(calls[0].args[0]).toEqual({
      videoBitrate: 8_000_000,
      mimeType: 'video/mp4'
    });
  });
});
