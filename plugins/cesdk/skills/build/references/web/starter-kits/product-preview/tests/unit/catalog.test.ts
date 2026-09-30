import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { PRODUCTS } from '../../src/constants';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

describe('PP-U5 catalogue invariants', () => {
  it('offers five products in catalogue order', () => {
    expect(Object.keys(PRODUCTS)).toEqual([
      'businesscard',
      'poster',
      'socialmedia',
      'postcard',
      'apparel'
    ]);
    expect(Object.values(PRODUCTS).map((product) => product.label)).toEqual([
      'Business Card',
      'Poster',
      'Social Media',
      'Post Card',
      'Apparel'
    ]);
  });

  it.each(Object.entries(PRODUCTS))(
    '%s ships both of its scene files',
    (_key, product) => {
      expect(existsSync(`${publicDir}${product.scenePath}`)).toBe(true);
      expect(existsSync(`${publicDir}${product.mockupScenePath}`)).toBe(true);
    }
  );
});
