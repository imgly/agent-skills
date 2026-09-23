// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { GeneratedAsset } from '../../src/imgly';
import { downloadAsset } from '../../src/app/utils/download';

function asset(overrides: Partial<GeneratedAsset> = {}): GeneratedAsset {
  return {
    id: 0,
    label: 'Instagram Story',
    src: 'blob:asset/1',
    type: 'image',
    isLoading: false,
    ...overrides
  } as GeneratedAsset;
}

/** Records the anchor the download builds, in place of a real navigation. */
function captureAnchor() {
  const anchor = document.createElement('a');
  const click = vi.spyOn(anchor, 'click').mockImplementation(() => {});
  vi.spyOn(document, 'createElement').mockReturnValue(anchor);
  return { anchor, click };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ADG-U18
describe('downloadAsset', () => {
  it('names an image file after its label', () => {
    const { anchor, click } = captureAnchor();

    downloadAsset(asset());

    expect(anchor.download).toBe('instagram-story.png');
    expect(anchor.href).toBe('blob:asset/1');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('gives a video the mp4 extension', () => {
    const { anchor } = captureAnchor();

    downloadAsset(asset({ type: 'video' }));

    expect(anchor.download).toBe('instagram-story.mp4');
  });

  it('downloads nothing while the asset has no file yet', () => {
    const { click } = captureAnchor();

    downloadAsset(asset({ src: null }));

    expect(click).not.toHaveBeenCalled();
  });
});
