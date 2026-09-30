import { afterEach, describe, expect, it, vi } from 'vitest';

import { measureImageInBrowser } from '../../src/imgly/utils';

let created = 0;

/** The parts of `HTMLImageElement` the kit uses, driven by the test. */
class FakeImage {
  naturalWidth = 0;
  naturalHeight = 0;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor() {
    created += 1;
  }

  set src(url: string) {
    queueMicrotask(() => {
      if (url.includes('broken')) {
        this.onerror?.();
        return;
      }
      this.naturalWidth = 1200;
      this.naturalHeight = 800;
      this.onload?.();
    });
  }
}

vi.stubGlobal('Image', FakeImage);

afterEach(() => {
  created = 0;
});

describe('DV-U7 measureImageInBrowser', () => {
  it('reports the natural size of the loaded image', async () => {
    await expect(
      measureImageInBrowser('https://images.test/photo.png')
    ).resolves.toEqual({ width: 1200, height: 800 });
    expect(created).toBe(1);
  });

  it('answers a second call for the same URL from its cache', async () => {
    const url = 'https://images.test/cached.png';

    await measureImageInBrowser(url);
    created = 0;
    await expect(measureImageInBrowser(url)).resolves.toEqual({
      width: 1200,
      height: 800
    });

    expect(created).toBe(0);
  });

  it('rejects when the image cannot be loaded', async () => {
    await expect(
      measureImageInBrowser('https://images.test/broken.png')
    ).rejects.toThrow('Could not load https://images.test/broken.png.');
  });
});
