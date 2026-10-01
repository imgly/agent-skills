// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@imgly/kit-test-harness/component';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type CreativeEditorSDK from '@cesdk/cesdk-js';

const mocks = vi.hoisted(() => ({
  renderMockup: vi.fn()
}));

vi.mock('../../src/imgly', () => ({
  renderMockup: mocks.renderMockup,
  disposeMockupRenderer: vi.fn(),
  init3dProductPreviewEditor: vi.fn(async () => undefined),
  CLEAR_IMAGE: 'ly.img.mockup/clear'
}));

import { DEFAULT_RENDER_DEBOUNCE_MS } from '../../src/constants';
import { useMockupRenderer } from '../../src/app/hooks/useMockupRenderer';

const config = { license: 'test' };
let revoked: string[] = [];
let historyListener: (() => void) | undefined;
const unsubscribe = vi.fn();

function fakeCesdk() {
  return {
    engine: {
      block: {
        findByKind: () => [1],
        export: async () => new Blob(['png'], { type: 'image/png' })
      },
      editor: {
        onHistoryUpdatedWithKind: vi.fn((listener: () => void) => {
          historyListener = listener;
          return unsubscribe;
        })
      }
    }
  } as unknown as CreativeEditorSDK;
}

/** Render the hook over a design engine that is already there, or over none. */
function setup(cesdk: CreativeEditorSDK | null = fakeCesdk()) {
  const designEngineRef = createRef<CreativeEditorSDK | null>() as {
    current: CreativeEditorSDK | null;
  };
  designEngineRef.current = cesdk;
  const view = renderHook(() =>
    useMockupRenderer({
      designEngineRef:
        designEngineRef as React.RefObject<CreativeEditorSDK | null>,
      config
    })
  );
  return { ...view, designEngineRef };
}

beforeEach(() => {
  revoked = [];
  historyListener = undefined;
  unsubscribe.mockClear();
  let created = 0;
  URL.createObjectURL = vi.fn(() => `blob:${++created}`) as never;
  URL.revokeObjectURL = vi.fn((url: string) => {
    revoked.push(url);
  }) as never;
  mocks.renderMockup.mockReset();
  mocks.renderMockup.mockResolvedValue({
    mockupUrl: 'blob:mockup',
    sceneString: '<rendered/>',
    blobUrls: ['blob:mockup']
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('PP-C3 rendering a product', () => {
  it('renders from the product scene URL and publishes the result', async () => {
    const { result } = setup();

    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    expect(mocks.renderMockup).toHaveBeenCalledWith(
      config,
      expect.stringContaining('postcard-mockup.scene'),
      expect.objectContaining({ 'Image 1': expect.any(Blob) })
    );
    expect(result.current.mockupImageUrl).toBe('blob:mockup');
    expect(result.current.mockupSceneString).toBe('<rendered/>');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.renderError).toBeNull();
  });

  it('renders from the scene string once the mockup has been edited', async () => {
    const { result } = setup();

    await act(async () => {
      await result.current.updateMockupScene('<edited/>', 'postcard');
    });

    expect(mocks.renderMockup).toHaveBeenCalledWith(
      config,
      { sceneString: '<edited/>' },
      expect.anything()
    );
  });

  it('goes back to the product scene URL after a reset', async () => {
    const { result } = setup();
    await act(async () => {
      await result.current.updateMockupScene('<edited/>', 'postcard');
    });

    act(() => result.current.resetMockupScene());
    await act(async () => {
      await result.current.renderMockupForProduct('poster');
    });

    expect(mocks.renderMockup).toHaveBeenLastCalledWith(
      config,
      expect.stringContaining('poster-mockup.scene'),
      expect.anything()
    );
  });

  it('reports a failed render and releases nothing it did not create', async () => {
    mocks.renderMockup.mockRejectedValueOnce(new Error('export failed'));
    const { result } = setup();

    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    expect(result.current.renderError).toBe('export failed');
    expect(result.current.mockupImageUrl).toBeNull();
  });

  it('reports a rejection that is not an Error by its string form', async () => {
    mocks.renderMockup.mockRejectedValueOnce('engine gone');
    const { result } = setup();

    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    expect(result.current.renderError).toBe('engine gone');
  });

  it('releases the URLs of the previous render when the next one lands', async () => {
    const { result } = setup();
    mocks.renderMockup.mockResolvedValueOnce({
      mockupUrl: 'blob:first',
      sceneString: '<a/>',
      blobUrls: ['blob:first']
    });
    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });
    await act(async () => {
      await result.current.renderMockupForProduct('poster');
    });

    expect(revoked).toContain('blob:first');
  });

  it('does nothing while the design editor is not there yet', async () => {
    const { result } = setup(null);

    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    expect(mocks.renderMockup).not.toHaveBeenCalled();
  });
});

describe('PP-C4 renders that overlap', () => {
  it('queues the second request and runs it once the first one is done', async () => {
    vi.useFakeTimers();
    let release: (value: unknown) => void = () => {};
    mocks.renderMockup.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = resolve;
        })
    );
    const { result } = setup();

    let first: Promise<void>;
    await act(async () => {
      first = result.current.renderMockupForProduct('postcard');
    });
    await act(async () => {
      await result.current.renderMockupForProduct('poster');
    });
    expect(mocks.renderMockup).toHaveBeenCalledTimes(1);

    await act(async () => {
      release({
        mockupUrl: 'blob:first',
        sceneString: '<a/>',
        blobUrls: ['blob:first']
      });
      await first;
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEFAULT_RENDER_DEBOUNCE_MS);
    });

    expect(mocks.renderMockup).toHaveBeenCalledTimes(2);
  });
});

describe('PP-C5 auto-refresh on a design change', () => {
  it('subscribes only once the engine reports it is ready', async () => {
    const { result } = setup();
    expect(historyListener).toBeUndefined();

    act(() => result.current.setEngineReady());

    await waitFor(() => expect(historyListener).toBeTypeOf('function'));
    expect(result.current.isEngineReady).toBe(true);
  });

  it('does not subscribe while the design editor is not there yet', async () => {
    const { result } = setup(null);
    act(() => result.current.setEngineReady());
    expect(historyListener).toBeUndefined();
  });

  it('debounces a design change into one render', async () => {
    vi.useFakeTimers();
    const { result } = setup();
    await act(async () => result.current.setEngineReady());
    expect(historyListener).toBeTypeOf('function');
    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    act(() => {
      historyListener?.();
      historyListener?.();
    });
    expect(mocks.renderMockup).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEFAULT_RENDER_DEBOUNCE_MS);
    });
    expect(mocks.renderMockup).toHaveBeenCalledTimes(2);
    expect(result.current.renderError).toBeNull();
  });

  it('queues a design change that arrives while a render is in flight', async () => {
    vi.useFakeTimers();
    const { result } = setup();
    await act(async () => result.current.setEngineReady());
    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    let release: (value: unknown) => void = () => {};
    mocks.renderMockup.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = resolve;
        })
    );
    let second: Promise<void>;
    await act(async () => {
      second = result.current.renderMockupForProduct('postcard');
    });
    act(() => historyListener?.());
    expect(mocks.renderMockup).toHaveBeenCalledTimes(2);

    await act(async () => {
      release({
        mockupUrl: 'blob:second',
        sceneString: '<a/>',
        blobUrls: ['blob:second']
      });
      await second;
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEFAULT_RENDER_DEBOUNCE_MS);
    });
    expect(mocks.renderMockup).toHaveBeenCalledTimes(3);
  });

  it('drops a queued render when the design editor goes away first', async () => {
    vi.useFakeTimers();
    const { result, designEngineRef } = setup();
    await act(async () => result.current.setEngineReady());
    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    act(() => historyListener?.());
    designEngineRef.current = null;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(DEFAULT_RENDER_DEBOUNCE_MS);
    });

    expect(mocks.renderMockup).toHaveBeenCalledTimes(1);
  });

  it('drops the subscription and the pending timer on unmount', async () => {
    const { result, unmount } = setup();
    act(() => result.current.setEngineReady());
    await waitFor(() => expect(historyListener).toBeTypeOf('function'));

    await act(async () => {
      await result.current.renderMockupForProduct('postcard');
    });

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(revoked).toContain('blob:mockup');
  });
});
