import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import {
  getImageBlockQuality,
  getPartiallyHiddenTexts
} from '../../src/imgly/utils';

const TEXT = 1;
const GRAPHIC = 2;

/**
 * The engine reports "the two shapes do not overlap" as a catalog error, which
 * is the only failure `getPartiallyHiddenTexts` swallows. A real engine cannot
 * be made to fail `combine` any other way, so the intersection call is faked.
 */
function engineWithCombineError(error: unknown): CreativeEngine {
  return {
    block: {
      findByType: (type: string) =>
        type === 'text' ? [TEXT] : type === 'page' ? [9] : [],
      getChildren: () => [TEXT, GRAPHIC],
      getType: () => '//ly.img.ubq/graphic',
      getGlobalBoundingBoxX: () => 0,
      getGlobalBoundingBoxY: () => 0,
      getGlobalBoundingBoxWidth: () => 10,
      getGlobalBoundingBoxHeight: () => 10,
      duplicate: (id: number) => id + 100,
      getRotation: () => 0,
      setRotation: vi.fn(),
      combine: () => {
        throw error;
      },
      isValid: () => true,
      destroy: vi.fn()
    }
  } as unknown as CreativeEngine;
}

describe('DV-U9 getPartiallyHiddenTexts', () => {
  it('treats the engine’s empty-shape error as "no intersection"', () => {
    const engine = engineWithCombineError({
      code: 'BLOCK.RESULT_EMPTY_SHAPE'
    });

    expect(getPartiallyHiddenTexts(engine)).toEqual([]);
  });

  it('rethrows any other engine failure', () => {
    const failure = { code: 'BLOCK.SOMETHING_ELSE' };
    const engine = engineWithCombineError(failure);

    expect(() => getPartiallyHiddenTexts(engine)).toThrow();
  });
});

describe('DV-U10 getImageBlockQuality', () => {
  it('reports full quality when the engine holds no scene', async () => {
    const measureImage = vi.fn();
    const engine = {
      block: {
        getFrameWidth: () => 100,
        getFrameHeight: () => 100
      },
      scene: { get: () => null }
    } as unknown as CreativeEngine;

    await expect(getImageBlockQuality(engine, 1, measureImage)).resolves.toBe(
      1
    );
    expect(measureImage).not.toHaveBeenCalled();
  });
});
