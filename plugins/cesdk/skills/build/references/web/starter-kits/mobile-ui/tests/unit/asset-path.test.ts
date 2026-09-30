// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { caseAssetPath } from '../../src/imgly/utils';

describe('MB-U11 caseAssetPath', () => {
  it('makes a kit-relative path absolute against the page', () => {
    expect(caseAssetPath('/social-media.scene')).toBe(
      new URL('/social-media.scene', window.location.href).href
    );
  });

  it.each(['http://cdn.test/a.png', 'https://cdn.test/a.png'])(
    'leaves %s alone',
    (url) => {
      expect(caseAssetPath(url)).toBe(url);
    }
  );
});
