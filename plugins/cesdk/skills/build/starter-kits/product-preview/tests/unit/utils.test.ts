// @vitest-environment jsdom
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { CLEAR_IMAGE } from '../../src/imgly/mockup';
import { DEFAULT_MAX_PLACEHOLDERS } from '../../src/constants';
import {
  buildPlaceholders,
  downloadMockup,
  getDefaultProductKey,
  getDesignSceneUrl,
  getMockupSceneUrl,
  getPlaceholderName
} from '../../src/app/utils';

/** The two calls `buildPlaceholders` makes, over a fixed page list. */
function fakeEngine(pages: number[]) {
  const exported: { id: number; options: Record<string, unknown> }[] = [];
  return {
    exported,
    engine: {
      block: {
        findByKind: () => pages,
        export: (id: number, options: Record<string, unknown>) => {
          exported.push({ id, options });
          return Promise.resolve(new Blob([`page-${id}`]));
        }
      }
    } as unknown as CreativeEngine
  };
}

describe('PP-U1 getPlaceholderName', () => {
  it('is one-based', () => {
    expect(getPlaceholderName(0)).toBe('Image 1');
    expect(getPlaceholderName(9)).toBe('Image 10');
  });
});

describe('PP-U2 scene URL helpers', () => {
  it('resolves a product scene against the deployment base', () => {
    expect(getDesignSceneUrl('poster')).toBe(
      new URL('poster.scene', window.location.href).href
    );
    expect(getMockupSceneUrl('poster')).toBe(
      new URL('poster-mockup.scene', window.location.href).href
    );
  });

  it('throws for an unknown product key', () => {
    expect(() => getDesignSceneUrl('x')).toThrow('Unknown product key: x');
    expect(() => getMockupSceneUrl('x')).toThrow('Unknown product key: x');
  });

  it('names the first catalogue entry as the default', () => {
    // The App starts on `postcard` instead; nothing calls this helper.
    expect(getDefaultProductKey()).toBe('businesscard');
  });
});

describe('PP-U3 downloadMockup filename', () => {
  it('slugifies the product label', () => {
    const click = vi.fn();
    const anchor = document.createElement('a');
    anchor.click = click;
    vi.spyOn(document, 'createElement').mockReturnValueOnce(anchor);

    downloadMockup('blob:mockup', 'businesscard');

    expect(anchor.download).toBe('business-card-mockup.jpg');
    expect(anchor.href).toBe('blob:mockup');
    expect(click).toHaveBeenCalledTimes(1);
    vi.restoreAllMocks();
  });

  it('slugifies a two-word label', () => {
    const anchor = document.createElement('a');
    anchor.click = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValueOnce(anchor);

    downloadMockup('blob:mockup', 'socialmedia');

    expect(anchor.download).toBe('social-media-mockup.jpg');
    vi.restoreAllMocks();
  });
});

describe('PP-U4 buildPlaceholders', () => {
  const size = { width: 512, height: 512 };

  it('exports one image per page and clears the rest', async () => {
    const { engine, exported } = fakeEngine([1, 2, 3]);

    const placeholders = await buildPlaceholders(
      engine,
      DEFAULT_MAX_PLACEHOLDERS,
      size
    );

    expect(Object.keys(placeholders)).toHaveLength(DEFAULT_MAX_PLACEHOLDERS);
    ['Image 1', 'Image 2', 'Image 3'].forEach((name) =>
      expect(placeholders[name]).toBeInstanceOf(Blob)
    );
    for (let i = 4; i <= DEFAULT_MAX_PLACEHOLDERS; i++) {
      expect(placeholders[`Image ${i}`]).toBe(CLEAR_IMAGE);
    }
    exported.forEach(({ options }) =>
      expect(options).toEqual({
        mimeType: 'image/png',
        targetWidth: 512,
        targetHeight: 512
      })
    );
  });

  it('clears every slot when the design has no page', async () => {
    const { engine } = fakeEngine([]);

    const placeholders = await buildPlaceholders(
      engine,
      DEFAULT_MAX_PLACEHOLDERS,
      size
    );

    expect(Object.values(placeholders)).toEqual(
      Array(DEFAULT_MAX_PLACEHOLDERS).fill(CLEAR_IMAGE)
    );
  });

  it('writes no clear entry when the design fills every slot', async () => {
    const { engine } = fakeEngine([1, 2, 3, 4]);

    const placeholders = await buildPlaceholders(engine, 3, size);

    expect(Object.keys(placeholders)).toEqual([
      'Image 1',
      'Image 2',
      'Image 3',
      'Image 4'
    ]);
    expect(Object.values(placeholders)).not.toContain(CLEAR_IMAGE);
  });
});
