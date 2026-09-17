// @vitest-environment jsdom
// `extractDominantColor` reaches for a canvas, which only exists in a DOM.
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getMainColor, searchPodcasts } from '../../src/app/api/podcast';

afterEach(() => {
  vi.restoreAllMocks();
});

// ADG-U14
describe('searchPodcasts', () => {
  it.each(['', '   '])(
    'asks iTunes for nothing when the query is %j',
    async (query) => {
      expect(await searchPodcasts(query)).toEqual([]);
    }
  );

  it('asks iTunes for four podcasts and hands back its results', async () => {
    const results = [{ collectionId: 1, collectionName: 'Conan' }];
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results }), {
        headers: { 'content-type': 'application/json' }
      })
    );

    expect(await searchPodcasts('conan o brien')).toEqual(results);

    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.searchParams.get('entity')).toBe('podcast');
    expect(url.searchParams.get('limit')).toBe('4');
    expect(url.searchParams.get('term')).toBe('conan o brien');
  });
});

/** jsdom ships no 2d context, so the canvas the colour sampler reaches for is faked. */
function installFakeCanvas(pixel: number[]) {
  const context = {
    imageSmoothingEnabled: false,
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: [...pixel, 255] }))
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as never
  );
  return context;
}

/** Run the handler the sampler assigned to the image it created. */
async function flushImage(event: 'load' | 'error') {
  const image = images[images.length - 1];
  await Promise.resolve();
  if (event === 'load') image.onload?.();
  else image.onerror?.();
}

const images: { onload?: () => void; onerror?: () => void; src?: string }[] =
  [];

class ImageStub {
  crossOrigin = '';

  onload?: () => void;

  onerror?: () => void;

  src = '';

  constructor() {
    images.push(this);
  }
}

globalThis.Image = ImageStub as never;

// ADG-U15
describe('getMainColor', () => {
  it('falls back to the brand purple when the canvas is unavailable', async () => {
    // jsdom has no 2d context, which is the same branch a browser without
    // canvas support takes.
    expect(await getMainColor('https://example.test/art.png')).toBe('#9933FF');
  });

  it('reads the dominant colour out of a one-pixel draw of the artwork', async () => {
    installFakeCanvas([0x33, 0x66, 0x99]);
    const color = getMainColor('https://example.test/art.png');
    await flushImage('load');
    expect(await color).toBe('#336699');
  });

  it('falls back to the brand purple when the artwork cannot be loaded', async () => {
    installFakeCanvas([0, 0, 0]);
    const color = getMainColor('https://example.test/missing.png');
    await flushImage('error');
    expect(await color).toBe('#9933FF');
  });
});
