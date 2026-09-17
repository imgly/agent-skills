import { describe, expect, it } from 'vitest';

import { getPagesFromRange } from '../../src/imgly/plugins/export-print-ready-pdf';

// PRP-U1: the parser on a 2-page scene.
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

  it('returns no pages for a range beyond the page count', () => {
    expect(getPagesFromRange(PAGES, '3')).toEqual([]);
  });

  it.each(['a', '1-', ',1', '1--2', '1,', '-1'])('rejects %s', (range) => {
    expect(() => getPagesFromRange(PAGES, range)).toThrow('Invalid page range');
  });

  it('accepts one space, which the single-character strip removes', () => {
    expect(getPagesFromRange(PAGES, '1, 2')).toEqual(PAGES);
  });

  it('accepts a range with more than one space', () => {
    const three = [100, 200, 300];
    expect(getPagesFromRange(three, '1, 2, 3')).toEqual(three);
  });
});
