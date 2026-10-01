// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type CreativeEngine from '@cesdk/engine';
import { act, renderHook, waitFor } from '@imgly/kit-test-harness/component';

const engineInit = vi.hoisted(() => vi.fn());
const resize = vi.hoisted(() => vi.fn());

// The kit's alias points `@cesdk/engine` at the Node engine, whose namespace
// carries exports other modules pull in; answer for all of them.
vi.mock('@cesdk/engine', () => {
  const stub: Record<string | symbol, unknown> = {
    default: { init: engineInit }
  };
  return new Proxy(stub, {
    has: () => true,
    get: (target, key) => (key in target ? target[key] : undefined)
  });
});
vi.mock('../../src/imgly', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resize
}));

import { useEngine, useVariants } from '../../src/app/hooks';
import { DEFAULT_SIZES, DEFAULT_TEMPLATES } from '../../src/app/constants';

// `useEngine` re-runs its effect whenever `config` changes identity, so every
// case hands it the same object the app hands it.
const CONFIG = {};

function engineDouble() {
  return {
    dispose: vi.fn(),
    editor: { setSetting: vi.fn() },
    scene: { load: vi.fn(async () => 1) }
  };
}

beforeEach(() => {
  engineInit.mockReset();
  resize.mockReset();
  vi.stubGlobal('URL', {
    createObjectURL: (blob: Blob) => `blob:${blob.size}`,
    revokeObjectURL: vi.fn()
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AR-C6 useEngine', () => {
  it('boots one engine, hides the page title and loads the first template', async () => {
    const engine = engineDouble();
    engineInit.mockResolvedValue(engine);

    const { result } = renderHook(() => useEngine(CONFIG));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(engine.editor.setSetting).toHaveBeenCalledWith(
      'page/title/show',
      false
    );
    expect(engine.scene.load).toHaveBeenCalledWith(
      DEFAULT_TEMPLATES[0].sceneUrl
    );
    expect(result.current.engine).toBe(engine);
  });

  it('disposes the engine when the component goes away', async () => {
    const engine = engineDouble();
    engineInit.mockResolvedValue(engine);

    const { result, unmount } = renderHook(() => useEngine(CONFIG));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    unmount();

    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('throws away an engine that finished booting after the unmount', async () => {
    const engine = engineDouble();
    let settle: (value: unknown) => void = () => {};
    engineInit.mockReturnValue(
      new Promise((resolve) => {
        settle = resolve;
      })
    );

    const { unmount } = renderHook(() => useEngine(CONFIG));
    unmount();
    await act(async () => {
      settle(engine);
    });

    expect(engine.dispose).toHaveBeenCalledTimes(1);
    expect(engine.scene.load).not.toHaveBeenCalled();
  });
});

describe('AR-C7 useVariants', () => {
  const template = DEFAULT_TEMPLATES[0];
  const engine = {} as CreativeEngine;

  it('starts with one empty variant per size', () => {
    const { result } = renderHook(() => useVariants(engine, true));

    expect(result.current.variants).toHaveLength(DEFAULT_SIZES.length);
    result.current.variants.forEach((variant) => {
      expect(variant.src).toBeNull();
      expect(variant.isLoading).toBe(false);
    });
  });

  it('does nothing while the engine is not ready', async () => {
    const { result } = renderHook(() => useVariants(null, false));

    await act(() => result.current.generate(template));

    expect(resize).not.toHaveBeenCalled();
  });

  it('fetches the scene once and fills each variant as it completes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ text: async () => '{"scene":"fetched"}' }))
    );
    resize.mockImplementation(
      async ({
        onProgress
      }: {
        onProgress: (
          completed: number,
          total: number,
          variant: {
            size: (typeof DEFAULT_SIZES)[number];
            blob: Blob;
            sceneString: string;
          }
        ) => void;
      }) => {
        onProgress(1, DEFAULT_SIZES.length, {
          size: DEFAULT_SIZES[0],
          blob: new Blob(['x']),
          sceneString: '{"variant":1}'
        });
      }
    );

    const { result } = renderHook(() => useVariants(engine, true));
    await act(() => result.current.generate(template));

    expect(vi.mocked(globalThis.fetch).mock.calls[0][0]).toBe(
      template.sceneUrl
    );
    expect(resize.mock.calls[0][0].scene).toBe('{"scene":"fetched"}');
    expect(result.current.variants[0]).toMatchObject({
      src: 'blob:1',
      sceneString: '{"variant":1}',
      isLoading: false
    });
  });

  it('reuses a scene string the template already carries', async () => {
    resize.mockResolvedValue(undefined);
    const { result } = renderHook(() => useVariants(engine, true));

    await act(() =>
      result.current.generate({
        ...template,
        sceneString: '{"scene":"cached"}'
      })
    );

    expect(resize.mock.calls[0][0].scene).toBe('{"scene":"cached"}');
  });

  it('clears the variants again when the resize fails', async () => {
    resize.mockRejectedValue(new Error('resize failed'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { result } = renderHook(() => useVariants(engine, true));

    await act(() =>
      result.current.generate({ ...template, sceneString: '{"scene":1}' })
    );

    expect(consoleError).toHaveBeenCalled();
    result.current.variants.forEach((variant) => {
      expect(variant.src).toBeNull();
      expect(variant.isLoading).toBe(false);
    });
    consoleError.mockRestore();
  });

  it('downloads a variant that has an image and ignores one that has none', () => {
    const { result } = renderHook(() => useVariants(engine, true));
    const anchor = { href: '', download: '', style: {}, click: vi.fn() };
    vi.stubGlobal('document', {
      createElement: () => anchor,
      body: { appendChild: vi.fn(), removeChild: vi.fn() }
    });

    result.current.download(result.current.variants[0]);
    expect(anchor.click).not.toHaveBeenCalled();

    result.current.download({
      ...result.current.variants[0],
      src: 'blob:variant/1'
    });
    expect(anchor.download).toBe(`${DEFAULT_SIZES[0].label}.png`);
    expect(anchor.click).toHaveBeenCalledTimes(1);
  });

  it('replaces one variant after it was edited', () => {
    const { result } = renderHook(() => useVariants(engine, true));

    act(() =>
      result.current.updateVariant(
        DEFAULT_SIZES[1].id,
        '{"edited":1}',
        'blob:edited/1'
      )
    );

    expect(result.current.variants[1]).toMatchObject({
      sceneString: '{"edited":1}',
      src: 'blob:edited/1'
    });
    expect(result.current.variants[0].src).toBeNull();
  });
});
