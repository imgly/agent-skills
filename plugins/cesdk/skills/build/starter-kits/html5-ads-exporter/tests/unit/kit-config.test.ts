import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('@imgly/html-exporter', () => ({
  exportHtml: vi.fn(),
  injectGsapPlayer: vi.fn()
}));

const spy = createApiSpy<CreativeEditorSDK>();

beforeAll(async () => {
  const { initHtml5ExporterEditor } = await import('../../src/imgly');
  await initHtml5ExporterEditor(spy.api);
});

function plugins(): { name?: string; config?: Record<string, unknown> }[] {
  return spy
    .callsTo('addPlugin')
    .map(({ args }) => args[0] as { name?: string; config?: never });
}

/** An editor whose `addPlugin` only settles when the test says so. */
function deferredEditor() {
  const deferred = createApiSpy<CreativeEditorSDK>();
  const settle: Array<() => void> = [];
  const api = new Proxy(deferred.api as object, {
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
  return { api, spy: deferred, settle };
}

describe('H5-U7 editor configuration', () => {
  it('adds the video editor configuration, then the export panel', () => {
    expect(
      plugins()
        .slice(0, 2)
        .map(({ name }) => name)
    ).toEqual(['cesdk-video-editor', 'html5-export-panel']);
  });

  it('limits the upload source to images', () => {
    const upload = plugins().find(
      ({ name }) => name === 'cesdk-upload-asset-sources'
    );
    expect(upload?.config?.include).toEqual(['ly.img.image.upload']);
  });

  it('offers image, audio and video demo assets', () => {
    const demo = plugins().find(
      ({ name }) => name === 'cesdk-demo-asset-sources'
    );
    expect(demo?.config?.include).toEqual([
      'ly.img.image.*',
      'ly.img.audio.*',
      'ly.img.video.*'
    ]);
  });

  it('registers every asset source at once, not one after another', async () => {
    const total = plugins().length;
    const { initHtml5ExporterEditor } = await import('../../src/imgly');
    const { api, spy: deferred, settle } = deferredEditor();
    const done = initHtml5ExporterEditor(api);

    // The two configuration plugins are awaited one at a time.
    await vi.waitFor(() => expect(settle).toHaveLength(1));
    settle[0]();
    await vi.waitFor(() => expect(settle).toHaveLength(2));
    settle[1]();

    // Sequential registration would stall here: every remaining source is in
    // flight before any of them settles.
    await vi.waitFor(() => expect(settle).toHaveLength(total));
    expect(deferred.callsTo('addPlugin')).toHaveLength(total);

    settle.forEach((resolve) => resolve());
    await done;
  });

  it('offers the premium templates', () => {
    const templates = plugins().find(
      ({ name }) => name === 'cesdk-premium-asset-sources'
    );
    expect(templates?.config?.include).toEqual(['ly.img.templates.premium.*']);
  });
});
