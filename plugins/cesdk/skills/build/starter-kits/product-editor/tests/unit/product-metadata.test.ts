import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { PRODUCT_SAMPLES } from '../../src/app/product-catalog';
import {
  readProductFromMetadata,
  storeProductMetadata
} from '../../src/app/utils/product';

/** The two engine calls the metadata helpers make, over an in-memory store. */
function fakeEngine(scene: number | null) {
  const metadata = new Map<string, string>();
  return {
    metadata,
    engine: {
      scene: { get: () => scene },
      block: {
        setMetadata: (_block: number, key: string, value: string) =>
          metadata.set(key, value),
        getMetadata: (_block: number, key: string) => metadata.get(key)
      }
    } as unknown as CreativeEngine
  };
}

describe('PE-U6 product metadata round trip', () => {
  const product = PRODUCT_SAMPLES[0];
  const color = product.colors.find((c) => c.isDefault)!;

  it('reads back the product it stored', () => {
    const { engine, metadata } = fakeEngine(1);

    storeProductMetadata(engine, product, color);

    expect(readProductFromMetadata(engine)).toEqual(product);
    expect(JSON.parse(metadata.get('color')!)).toEqual(color);
  });

  it('is a no-op without a scene', () => {
    const { engine, metadata } = fakeEngine(null);

    storeProductMetadata(engine, product, color);

    expect(metadata.size).toBe(0);
    expect(readProductFromMetadata(engine)).toBeNull();
  });

  it('returns null when the scene carries no product', () => {
    const { engine } = fakeEngine(1);

    expect(readProductFromMetadata(engine)).toBeNull();
  });
});
