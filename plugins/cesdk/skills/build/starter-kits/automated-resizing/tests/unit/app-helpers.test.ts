import { describe, expect, it, vi } from 'vitest';

import { DEFAULT_SIZES } from '../../src/imgly/sizes';
import {
  downloadFromUrl,
  getPlatformIconFilename,
  getSizeById,
  getSizesByPlatform
} from '../../src/app/utils';

// AR-U2: the app-layer size lookup and platform icon helpers.
describe('getSizesByPlatform', () => {
  it('returns the two Instagram presets', () => {
    expect(
      getSizesByPlatform(['instagram'], DEFAULT_SIZES).map((size) => size.id)
    ).toEqual(['ig-story', 'ig-post-4-5']);
  });

  it('returns nothing for an empty platform list', () => {
    expect(getSizesByPlatform([], DEFAULT_SIZES)).toEqual([]);
  });

  it('keeps the preset order when several platforms match', () => {
    expect(
      getSizesByPlatform(['facebook', 'x'], DEFAULT_SIZES).map(
        (size) => size.id
      )
    ).toEqual(['x-post', 'facebook-post']);
  });

  it('returns nothing for a platform no preset uses', () => {
    expect(getSizesByPlatform(['youtube'], DEFAULT_SIZES)).toEqual([]);
  });
});

describe('getSizeById', () => {
  it('finds a preset by its id', () => {
    expect(getSizeById('x-post', DEFAULT_SIZES)?.label).toBe(
      'X (Twitter) Post'
    );
  });

  it('returns undefined for an unknown id', () => {
    expect(getSizeById('nope', DEFAULT_SIZES)).toBeUndefined();
  });
});

describe('getPlatformIconFilename', () => {
  it.each([
    ['instagram', 'instagram.svg'],
    ['x', 'x.svg'],
    ['facebook', 'facebook.svg'],
    ['linkedin', 'linkedin.svg'],
    ['youtube', 'youtube.svg'],
    ['custom', 'custom.svg']
  ] as const)('maps %s to %s', (platform, filename) => {
    expect(getPlatformIconFilename(platform)).toBe(filename);
  });

  it('falls back to the custom icon for an unknown platform', () => {
    expect(getPlatformIconFilename('mastodon' as never)).toBe('custom.svg');
  });
});

// AR-U4: the download helper the variant footer calls.
describe('downloadFromUrl', () => {
  it('clicks a temporary hidden anchor and removes it again', () => {
    const link = {
      href: '',
      download: '',
      style: {} as Record<string, string>
    };
    const click = vi.fn();
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    vi.stubGlobal('document', {
      createElement: () => Object.assign(link, { click }),
      body: { appendChild, removeChild }
    });

    downloadFromUrl('blob:variant/1', 'ig-story.png');

    expect(link.href).toBe('blob:variant/1');
    expect(link.download).toBe('ig-story.png');
    expect(link.style.display).toBe('none');
    expect(click).toHaveBeenCalledTimes(1);
    expect(appendChild).toHaveBeenCalledWith(link);
    expect(removeChild).toHaveBeenCalledWith(link);
    vi.unstubAllGlobals();
  });
});
