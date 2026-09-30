// @vitest-environment jsdom
import { act, render, renderHook } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import type CreativeEngine from '@cesdk/engine';

import {
  generateAsset,
  type GenerateAssetOptions,
  type GeneratedAsset
} from '../../src/imgly';
import { GeneratedAssets } from '../../src/app/GeneratedAssets/GeneratedAssets';
import { useAssetGeneration } from '../../src/app/hooks/useAssetGeneration';

vi.mock('../../src/imgly', () => ({
  generateAsset: vi.fn(
    async (
      _engine: CreativeEngine,
      options: GenerateAssetOptions
    ): Promise<GeneratedAsset> => ({
      id: options.id ?? -1,
      label: options.label ?? 'Preview',
      isLoading: false,
      width: options.width,
      height: options.height,
      src: `blob:${options.templateUrl.split('/').pop()}`,
      type: options.outputType,
      sceneString: null,
      variables: {}
    })
  )
}));

// ADG-C19
describe('video output', () => {
  it('renders every selected size from its video template as a playing clip', async () => {
    const { result } = renderHook(() => useAssetGeneration());

    await act(() =>
      result.current.generateAssets({} as CreativeEngine, {
        podcast: null,
        backgroundColor: '#9933FF',
        message: 'Listen now',
        outputType: 'video',
        sizes: [0, 1, 2]
      })
    );

    expect(
      vi
        .mocked(generateAsset)
        .mock.calls.map(([, options]) => [options.label, options.outputType])
    ).toEqual([
      ['Preview', 'video'],
      ['Instagram Story', 'video'],
      ['Instagram Post', 'video'],
      ['Facebook / X Post', 'video']
    ]);

    const { container } = render(
      <GeneratedAssets
        assets={result.current.finalAssets}
        onDownload={vi.fn()}
        onEdit={vi.fn()}
      />
    );
    const clips = Array.from(container.querySelectorAll('video'));

    expect(clips.map((clip) => clip.getAttribute('src'))).toEqual([
      'blob:video-instagram-story-template.scene',
      'blob:video-instagram-post-template.scene',
      'blob:video-facebook-x-post-template.scene'
    ]);
    for (const clip of clips) {
      expect(clip.autoplay).toBe(true);
    }
    expect(container.querySelector('img[alt="Instagram Story"]')).toBeNull();
  });
});
