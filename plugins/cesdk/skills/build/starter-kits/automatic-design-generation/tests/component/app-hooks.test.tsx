// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  engine: undefined as unknown,
  init: vi.fn(),
  supportsVideoExport: vi.fn(async () => true),
  searchPodcasts: vi.fn(),
  getMainColor: vi.fn(async () => '#336699')
}));

vi.mock('@cesdk/engine', () => ({
  default: { init: mocks.init },
  supportsVideoExport: mocks.supportsVideoExport
}));

vi.mock('../../src/app/api/podcast', () => ({
  searchPodcasts: mocks.searchPodcasts,
  getMainColor: mocks.getMainColor
}));

import { useEngine } from '../../src/app/hooks/useEngine';
import { usePodcastSearch } from '../../src/app/hooks/usePodcastSearch';

const config = { license: 'test' };

beforeEach(() => {
  mocks.init.mockReset();
  mocks.supportsVideoExport.mockReset();
  mocks.supportsVideoExport.mockResolvedValue(true);
  mocks.searchPodcasts.mockReset();
  mocks.searchPodcasts.mockResolvedValue([]);
});

afterEach(() => {
  vi.useRealTimers();
  delete (window as { engine?: unknown }).engine;
});

// ADG-C13
describe('useEngine', () => {
  it('reports the engine ready and publishes the debug handle', async () => {
    const engine = { dispose: vi.fn() };
    mocks.init.mockResolvedValue(engine);

    const { result } = renderHook(() => useEngine(config));
    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(mocks.init).toHaveBeenCalledWith(config);
    expect(result.current.engine).toBe(engine);
    expect(result.current.videoSupported).toBe(true);
    expect((window as { engine?: unknown }).engine).toBe(engine);
  });

  it('reports a browser that cannot export video', async () => {
    mocks.supportsVideoExport.mockResolvedValue(false);
    mocks.init.mockResolvedValue({ dispose: vi.fn() });

    const { result } = renderHook(() => useEngine(config));
    await waitFor(() => expect(result.current.videoSupported).toBe(false));
  });

  it('disposes the engine it created on unmount', async () => {
    const engine = { dispose: vi.fn() };
    mocks.init.mockResolvedValue(engine);

    const { result, unmount } = renderHook(() => useEngine(config));
    await waitFor(() => expect(result.current.isReady).toBe(true));

    unmount();
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });

  it('disposes an engine that arrives after the unmount', async () => {
    const engine = { dispose: vi.fn() };
    let release: (value: unknown) => void = () => {};
    mocks.init.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      })
    );

    const { unmount } = renderHook(() => useEngine(config));
    await waitFor(() => expect(mocks.init).toHaveBeenCalled());
    unmount();

    await act(async () => release(engine));
    expect(engine.dispose).toHaveBeenCalledTimes(1);
    expect((window as { engine?: unknown }).engine).toBeUndefined();
  });
});

// ADG-C14
describe('usePodcastSearch', () => {
  const podcast = {
    collectionId: 1,
    collectionName: 'Conan',
    artworkUrl600: 'https://example.test/art.png'
  } as never;

  it('debounces the query and publishes the results', async () => {
    vi.useFakeTimers();
    mocks.searchPodcasts.mockResolvedValue([podcast]);
    const { result } = renderHook(() => usePodcastSearch());

    act(() => result.current.handleSearchChange('con'));
    act(() => result.current.handleSearchChange('conan'));
    expect(result.current.searchQuery).toBe('conan');
    expect(result.current.isSearching).toBe(true);
    expect(mocks.searchPodcasts).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(mocks.searchPodcasts).toHaveBeenCalledExactlyOnceWith('conan');
    expect(result.current.searchResults).toEqual([podcast]);
    expect(result.current.isSearching).toBe(false);
  });

  it('reports a failed search and stops the spinner', async () => {
    vi.useFakeTimers();
    mocks.searchPodcasts.mockRejectedValue(new Error('iTunes is down'));
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => usePodcastSearch());

    act(() => result.current.handleSearchChange('conan'));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(error).toHaveBeenCalledWith(
      'Failed to fetch podcasts',
      expect.any(Error)
    );
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    error.mockRestore();
  });

  it('remembers the chosen podcast and answers with its artwork colour', async () => {
    const { result } = renderHook(() => usePodcastSearch());

    let color: string | undefined;
    await act(async () => {
      color = await result.current.handlePodcastSelect(podcast);
    });

    expect(color).toBe('#336699');
    expect(mocks.getMainColor).toHaveBeenCalledWith(
      'https://example.test/art.png'
    );
    expect(result.current.currentPodcast).toBe(podcast);
  });
});
