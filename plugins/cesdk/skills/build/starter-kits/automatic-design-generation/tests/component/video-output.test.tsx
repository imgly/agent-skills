// @vitest-environment jsdom
import { act, render, renderHook } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import type CreativeEngine from '@cesdk/engine';

import type { GeneratedAsset } from '../../src/imgly';
import type { Podcast } from '../../src/app/api/transformer';
import { Preview } from '../../src/app/Preview/Preview';
import { useGenerationWorkflow } from '../../src/app/hooks/useGenerationWorkflow';

const ASSET: GeneratedAsset = {
  id: -1,
  label: 'Preview',
  src: 'blob:asset/1',
  isLoading: false
} as GeneratedAsset;

// ADG-C17
describe('the preview of a generated asset', () => {
  it('plays a muted looping clip for video output', () => {
    const { container } = render(
      <Preview previewAsset={ASSET} outputType="video" />
    );
    const video = container.querySelector('video')!;

    expect(video.getAttribute('src')).toBe('blob:asset/1');
    expect(video.autoplay).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.muted).toBe(true);
    expect(container.querySelector('img')).toBeNull();
  });

  it('shows a labelled still for image output', () => {
    const { container } = render(
      <Preview previewAsset={ASSET} outputType="image" />
    );

    expect(container.querySelector('img')?.getAttribute('alt')).toBe('Preview');
    expect(container.querySelector('video')).toBeNull();
  });

  it.each(['video', 'image'] as const)(
    'leaves the %s source empty until the asset has one',
    (outputType) => {
      const { container } = render(
        <Preview
          previewAsset={{ ...ASSET, src: null } as GeneratedAsset}
          outputType={outputType}
        />
      );

      expect(
        container
          .querySelector(outputType === 'video' ? 'video' : 'img')
          ?.getAttribute('src')
      ).toBe('');
    }
  );

  it('shows neither while the asset renders', () => {
    const { container } = render(
      <Preview
        previewAsset={{ ...ASSET, isLoading: true }}
        outputType="video"
      />
    );

    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });
});

const PODCAST = { id: '1', title: 'A podcast' } as unknown as Podcast;

function renderWorkflow(engine: CreativeEngine | null) {
  const setOutputType = vi.fn();
  const generateAssets = vi.fn();
  const { result } = renderHook(() =>
    useGenerationWorkflow({
      engine,
      isReady: engine != null,
      currentPodcast: PODCAST,
      backgroundColor: '#9933FF',
      message: 'Listen now',
      outputType: 'image',
      selectedSizeIndexes: [0, 2],
      setMessage: vi.fn(),
      setBackgroundColor: vi.fn(),
      setOutputType,
      toggleSize: vi.fn(),
      handlePodcastSelect: vi.fn(async () => '#9933FF'),
      generateAssets,
      generateSingleAsset: vi.fn(),
      removeAsset: vi.fn(),
      finalAssets: []
    } as unknown as Parameters<typeof useGenerationWorkflow>[0])
  );

  return { result, setOutputType, generateAssets };
}

// ADG-C18
describe('switching the output type', () => {
  it('regenerates every selected size in the new type', () => {
    const engine = {} as CreativeEngine;
    const { result, setOutputType, generateAssets } = renderWorkflow(engine);

    act(() => result.current.onTypeChange('video'));

    expect(setOutputType).toHaveBeenCalledWith('video');
    expect(generateAssets).toHaveBeenCalledWith(engine, {
      podcast: PODCAST,
      backgroundColor: '#9933FF',
      message: 'Listen now',
      outputType: 'video',
      sizes: [0, 2]
    });
  });

  it('records the type but generates nothing before the engine is up', () => {
    const { result, setOutputType, generateAssets } = renderWorkflow(null);

    act(() => result.current.onTypeChange('video'));

    expect(setOutputType).toHaveBeenCalledWith('video');
    expect(generateAssets).not.toHaveBeenCalled();
  });
});
