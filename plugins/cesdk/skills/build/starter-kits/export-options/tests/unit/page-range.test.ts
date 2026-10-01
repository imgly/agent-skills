import { describe, expect, it } from 'vitest';

import {
  getPagesFromRange,
  pageRangeError
} from '../../src/imgly/plugins/export-design-panel';

// EO-U1: page-range parser on a 2-page scene.
const PAGES = [100, 200];

describe('getPagesFromRange', () => {
  it('returns every page for an empty range', () => {
    expect(getPagesFromRange(PAGES, '')).toEqual(PAGES);
  });

  it.each([
    ['1', [100]],
    ['2', [200]],
    ['1-2', [100, 200]],
    ['1,2', [100, 200]],
    ['2,1', [100, 200]],
    ['1-1', [100]]
  ])('maps %s to the matching pages', (range, expected) => {
    expect(getPagesFromRange(PAGES, range as string)).toEqual(expected);
  });

  it.each(['1, 2', ' 1,2 ', '1 - 2'])(
    'accepts whitespace in %s, as the README documents',
    (range) => {
      expect(getPagesFromRange(PAGES, range)).toEqual(PAGES);
    }
  );

  it('accepts the spaced range from the README on a 7-page scene', () => {
    const sevenPages = [1, 2, 3, 4, 5, 6, 7].map((page) => page * 100);

    expect(getPagesFromRange(sevenPages, '1, 3-5, 7')).toEqual([
      100, 300, 400, 500, 700
    ]);
  });

  it('returns no pages for a range beyond the page count', () => {
    expect(getPagesFromRange(PAGES, '3')).toEqual([]);
  });

  it.each(['a', '1-', ',1', '1--2', '1,', '-1'])('rejects %s', (range) => {
    expect(() => getPagesFromRange(PAGES, range)).toThrow('Invalid page range');
  });
});

// EO-U3: the message the panel shows below the page range input.
describe('pageRangeError', () => {
  it.each(['', '1', '1-2', '1,2'])('accepts %s', (range) => {
    expect(pageRangeError(PAGES, range)).toBeUndefined();
  });

  it.each(['a', '1-', ',1'])('reports %s as invalid', (range) => {
    expect(pageRangeError(PAGES, range)).toBe('Invalid page range');
  });

  it.each(['3', '5-9'])('reports %s as out of range', (range) => {
    expect(pageRangeError(PAGES, range)).toBe('No page in that range');
  });
});
