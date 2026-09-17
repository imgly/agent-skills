import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  exportUsingRenderer,
  getRendererURL,
  setupRendererExport
} from '../../src/imgly/renderer';

const RENDERER_URL = '/__renderer';

interface NotificationUpdate {
  id: string;
  options: Record<string, unknown>;
}

/**
 * The `cesdk` surface `exportUsingRenderer` and `setupRendererExport` reach.
 * A recording double, so a test can read the notification sequence back.
 */
function createCesdkDouble() {
  const updates: NotificationUpdate[] = [];
  const shown: Record<string, unknown>[] = [];
  const dismissed: string[] = [];
  const downloads: { data: unknown; mimeType: string }[] = [];
  const actions = new Map<string, () => Promise<void>>();
  const componentOrders: { target: unknown; order: unknown[] }[] = [];
  const translations: Record<string, unknown>[] = [];
  let notificationCounter = 0;

  const cesdk = {
    ui: {
      showNotification: (options: Record<string, unknown>) => {
        shown.push(options);
        notificationCounter += 1;
        return `notification-${notificationCounter}`;
      },
      updateNotification: (id: string, options: Record<string, unknown>) => {
        updates.push({ id, options });
      },
      dismissNotification: (id: string) => {
        dismissed.push(id);
      },
      setComponentOrder: (target: unknown, order: unknown[]) => {
        componentOrders.push({ target, order });
      }
    },
    utils: {
      downloadFile: (data: unknown, mimeType: string) => {
        downloads.push({ data, mimeType });
      }
    },
    actions: {
      register: (name: string, run: () => Promise<void>) => {
        actions.set(name, run);
      },
      run: (name: string) => actions.get(name)!()
    },
    i18n: {
      setTranslations: (value: Record<string, unknown>) => {
        translations.push(value);
      }
    },
    engine: {
      scene: {
        saveToArchive: vi.fn(async () => new Blob(['archive']))
      }
    }
  };

  return {
    cesdk: cesdk as unknown as CreativeEditorSDK,
    updates,
    shown,
    dismissed,
    downloads,
    actions,
    componentOrders,
    translations,
    saveToArchive: cesdk.engine.scene.saveToArchive
  };
}

interface ProgressInit {
  loaded: number;
  total: number;
  lengthComputable: boolean;
}

/** A hand-driven `XMLHttpRequest`, so the whole request sequence is a unit test. */
class FakeXhr {
  static instances: FakeXhr[] = [];
  static DONE = 4;

  readyState = 0;
  status = 0;
  statusText = '';
  response: unknown = null;
  responseType = '';
  method = '';
  url = '';
  sent: unknown = null;
  headers: Record<string, string> = {};

  upload = new EventTarget();
  #self = new EventTarget();

  constructor() {
    FakeXhr.instances.push(this);
  }

  addEventListener(type: string, listener: EventListener) {
    this.#self.addEventListener(type, listener);
  }

  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  send(body: unknown) {
    this.sent = body;
  }

  getResponseHeader(name: string): string | null {
    return this.headers[name.toLowerCase()] ?? null;
  }

  emitUploadProgress(init: ProgressInit) {
    this.upload.dispatchEvent(Object.assign(new Event('progress'), init));
  }

  emitUploadLoadEnd() {
    this.upload.dispatchEvent(new Event('loadend'));
  }

  emitDownloadProgress(init: ProgressInit) {
    this.#self.dispatchEvent(Object.assign(new Event('progress'), init));
  }

  finish(status: number, statusText = '', response: unknown = null) {
    this.readyState = FakeXhr.DONE;
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.#self.dispatchEvent(new Event('loadend'));
  }

  fail() {
    this.#self.dispatchEvent(new Event('error'));
  }
}

function lastXhr(): FakeXhr {
  const xhr = FakeXhr.instances.at(-1);
  if (xhr == null) {
    throw new Error('No XMLHttpRequest was created.');
  }
  return xhr;
}

function messages(updates: NotificationUpdate[]): string[] {
  return updates.map((update) => update.options.message as string);
}

beforeEach(() => {
  FakeXhr.instances = [];
  vi.stubGlobal('XMLHttpRequest', FakeXhr);
  vi.stubEnv('VITE_RENDERER_PROXY_URL', RENDERER_URL);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('RND-U1 getRendererURL', () => {
  it('returns the configured proxy URL', () => {
    expect(getRendererURL()).toBe(RENDERER_URL);
  });

  it('returns nothing when the variable is unset', () => {
    vi.stubEnv('VITE_RENDERER_PROXY_URL', '');
    expect(getRendererURL()).toBeFalsy();
  });

  it('sends no request when the Renderer URL is unset', async () => {
    vi.stubEnv('VITE_RENDERER_PROXY_URL', '');
    const { cesdk } = createCesdkDouble();

    await expect(
      exportUsingRenderer(new Blob(['a']), cesdk, 'n1')
    ).rejects.toThrow('VITE_RENDERER_PROXY_URL is not set');
    expect(FakeXhr.instances).toEqual([]);
  });
});

describe('RND-U2 request shape', () => {
  it('posts the archive as the single scene part', async () => {
    const { cesdk } = createCesdkDouble();
    const archive = new Blob(['archive-bytes']);

    const pending = exportUsingRenderer(archive, cesdk, 'n1');
    const xhr = lastXhr();

    expect(xhr.method).toBe('POST');
    expect(xhr.url).toBe(RENDERER_URL);
    expect(xhr.responseType).toBe('blob');
    const body = xhr.sent as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect([...body.keys()]).toEqual(['scene']);
    expect(await (body.get('scene') as Blob).text()).toBe('archive-bytes');

    xhr.finish(200, 'OK', new Blob(['video']));
    await pending;
  });
});

describe('RND-U3 notification sequence', () => {
  it('reports upload, render and download progress on the given notification', async () => {
    const { cesdk, updates } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n7');
    const xhr = lastXhr();
    xhr.emitUploadProgress({ loaded: 40, total: 100, lengthComputable: true });
    xhr.emitUploadProgress({ loaded: 100, total: 100, lengthComputable: true });
    xhr.emitUploadLoadEnd();
    xhr.emitDownloadProgress({
      loaded: 60,
      total: 100,
      lengthComputable: true
    });
    xhr.finish(200, 'OK', new Blob(['video']));
    await pending;

    expect(messages(updates).slice(0, 4)).toEqual([
      'Uploading the archive...',
      'Uploading the archive... (40% complete)',
      'Rendering on the server...',
      'Downloading the export... (60% complete)'
    ]);
    expect(updates.every((update) => update.id === 'n7')).toBe(true);
    updates.slice(0, 4).forEach((update) => {
      expect(update.options.type).toBe('loading');
      expect(update.options.duration).toBe('infinite');
    });
  });

  it('reports nothing for a progress event that is not length-computable', async () => {
    const { cesdk, updates } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    const xhr = lastXhr();
    xhr.emitUploadProgress({ loaded: 40, total: 0, lengthComputable: false });
    xhr.emitDownloadProgress({ loaded: 40, total: 0, lengthComputable: false });
    xhr.finish(200, 'OK', new Blob(['video']));
    await pending;

    expect(messages(updates)).toHaveLength(2);
  });
});

describe('RND-U4 completion', () => {
  it('turns the notification into a success and downloads the response', async () => {
    const { cesdk, updates, downloads } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    const xhr = lastXhr();
    const body = new Blob(['video']);
    xhr.headers['content-type'] = 'video/webm';
    xhr.finish(200, 'OK', body);
    await pending;

    const success = updates.at(-1)!;
    expect(success.options.type).toBe('success');
    expect(success.options.message).toMatch(
      /^Export downloaded, server render took [\d.]+ seconds$/
    );
    expect(downloads).toEqual([{ data: body, mimeType: 'video/webm' }]);
  });

  it('falls back to video/mp4 when the response carries no content type', async () => {
    const { cesdk, downloads } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    lastXhr().finish(200, 'OK', new Blob(['video']));
    await pending;

    expect(downloads[0].mimeType).toBe('video/mp4');
  });
});

describe('RND-U5 failure', () => {
  it('rejects with the status text and downloads nothing', async () => {
    const { cesdk, updates, downloads } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    lastXhr().finish(500, 'Internal Server Error');

    await expect(pending).rejects.toThrow('Internal Server Error');
    expect(downloads).toEqual([]);
    expect(updates.some((update) => update.options.type === 'success')).toBe(
      false
    );
  });

  it('rejects with "Export failed" when the server sends no status text', async () => {
    const { cesdk } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    lastXhr().finish(503, '');

    await expect(pending).rejects.toThrow('Export failed');
  });

  it('rejects on a network error', async () => {
    const { cesdk, downloads } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    lastXhr().fail();

    await expect(pending).rejects.toBeDefined();
    expect(downloads).toEqual([]);
  });
});

describe('RND-U6 render time', () => {
  it('measures the time between the end of the upload and the first byte of the response', async () => {
    vi.useFakeTimers();
    const { cesdk, updates } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    const xhr = lastXhr();
    vi.advanceTimersByTime(500);
    xhr.emitUploadLoadEnd();
    vi.advanceTimersByTime(2500);
    xhr.emitDownloadProgress({ loaded: 1, total: 2, lengthComputable: true });
    vi.advanceTimersByTime(1000);
    xhr.finish(200, 'OK', new Blob(['video']));
    await pending;

    expect(updates.at(-1)!.options.message).toBe(
      'Export downloaded, server render took 2.5 seconds'
    );
  });

  it('reports 0 when the response arrives before the upload reports its end', async () => {
    vi.useFakeTimers();
    const { cesdk, updates } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    const xhr = lastXhr();
    vi.advanceTimersByTime(500);
    xhr.emitDownloadProgress({ loaded: 1, total: 2, lengthComputable: true });
    vi.advanceTimersByTime(300);
    xhr.emitUploadLoadEnd();
    xhr.finish(200, 'OK', new Blob(['video']));
    await pending;

    expect(updates.at(-1)!.options.message).toBe(
      'Export downloaded, server render took 0 seconds'
    );
  });

  it('never reports a negative time when no progress event arrives', async () => {
    vi.useFakeTimers();
    const { cesdk, updates } = createCesdkDouble();

    const pending = exportUsingRenderer(new Blob(['a']), cesdk, 'n1');
    vi.advanceTimersByTime(3000);
    lastXhr().finish(200, 'OK', new Blob(['video']));
    await pending;

    expect(updates.at(-1)!.options.message).toBe(
      'Export downloaded, server render took 0 seconds'
    );
  });
});

describe('RND-U7 action registration and navigation bar', () => {
  const { cesdk, actions, componentOrders, translations } = createCesdkDouble();
  setupRendererExport(cesdk);

  it('registers the renderer export action and its label', () => {
    expect([...actions.keys()]).toEqual(['exportUsingRenderer']);
    expect(translations).toEqual([
      {
        en: { 'actions.export.using.renderer': 'Export using CE.SDK Renderer' }
      }
    ]);
  });

  it('puts the renderer action and the scene actions in the actions group', () => {
    const { target, order } = componentOrders.at(-1)!;
    expect(target).toEqual({ in: 'ly.img.navigation.bar' });

    const group = order.find(
      (entry): entry is { id: string; children: unknown[] } =>
        typeof entry === 'object' &&
        entry !== null &&
        (entry as { id?: string }).id === 'ly.img.actions.navigationBar'
    )!;
    const children = group.children.map((child) =>
      typeof child === 'string' ? child : (child as { key: string }).key
    );
    expect(children).toEqual([
      'export-using-renderer',
      'ly.img.importScene.navigationBar',
      'ly.img.exportScene.navigationBar',
      'ly.img.exportArchive.navigationBar'
    ]);
  });

  it('offers no video export anywhere in the navigation bar', () => {
    const { order } = componentOrders.at(-1)!;
    expect(JSON.stringify(order)).not.toContain('exportVideo');
  });
});

describe('RND-U8 the action handles its own failures', () => {
  it('dismisses the progress notification and shows an error when archiving fails', async () => {
    const double = createCesdkDouble();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    double.saveToArchive.mockRejectedValueOnce(new Error('no archive'));
    setupRendererExport(double.cesdk);

    await double.actions.get('exportUsingRenderer')!();

    expect(double.dismissed).toEqual(['notification-1']);
    expect(double.shown.at(-1)).toEqual({
      message: 'Export failed: no archive',
      type: 'error'
    });
    expect(consoleError).toHaveBeenCalledOnce();
    consoleError.mockRestore();
  });

  it('names a rejection that is not an Error', async () => {
    const double = createCesdkDouble();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    double.saveToArchive.mockRejectedValueOnce('nope');
    setupRendererExport(double.cesdk);

    await double.actions.get('exportUsingRenderer')!();

    expect(double.shown.at(-1)).toEqual({
      message: 'Export failed: nope',
      type: 'error'
    });
    consoleError.mockRestore();
  });

  it('does the same when the renderer request fails', async () => {
    const double = createCesdkDouble();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    setupRendererExport(double.cesdk);

    const pending = double.actions.get('exportUsingRenderer')!();
    await vi.waitFor(() => expect(FakeXhr.instances).toHaveLength(1));
    lastXhr().finish(500, 'boom');
    await pending;

    expect(double.dismissed).toEqual(['notification-1']);
    expect(double.shown.at(-1)).toEqual({
      message: 'Export failed: boom',
      type: 'error'
    });
    expect(double.downloads).toEqual([]);
    consoleError.mockRestore();
  });

  it('starts with an infinite loading notification', async () => {
    const double = createCesdkDouble();
    setupRendererExport(double.cesdk);

    const pending = double.actions.get('exportUsingRenderer')!();
    await vi.waitFor(() => expect(FakeXhr.instances).toHaveLength(1));
    lastXhr().finish(200, 'OK', new Blob(['video']));
    await pending;

    expect(double.shown[0]).toEqual({
      message: 'Archiving...',
      duration: 'infinite',
      type: 'loading'
    });
  });
});
