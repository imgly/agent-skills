import { vi } from 'vitest';

// `@cesdk/cesdk-js` reads `window` at module scope, and the config plugin pulls
// it in. Nothing the kit decides needs a DOM, so a bare global is enough.
vi.hoisted(() => {
  const global = globalThis as any;
  global.window ??= globalThis;
  global.window.location ??= new URL('http://localhost/');
});

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { ViewerConfig } from '@cesdk/core-configs-web/viewer-editor';
import { describe, expect, it } from 'vitest';

import * as kit from '../../src/imgly';

describe('DV-U1 initDesignViewer', () => {
  it('adds the viewer configuration and nothing else', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    await kit.initDesignViewer(spy.api);

    expect(spy.callsTo('addPlugin')).toHaveLength(1);
    expect(spy.lastArgsOf('addPlugin')?.[0]).toBeInstanceOf(ViewerConfig);
  });

  it('sets no theme and no locale, so the editor keeps its defaults', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    await kit.initDesignViewer(spy.api);

    expect(spy.callsTo('setTheme')).toEqual([]);
    expect(spy.callsTo('setLocale')).toEqual([]);
  });
});

describe('DV-U2 the kit module', () => {
  it('re-exports ViewerConfig, so an integrator can add it without initDesignViewer', () => {
    expect(kit.ViewerConfig).toBe(ViewerConfig);
  });
});
