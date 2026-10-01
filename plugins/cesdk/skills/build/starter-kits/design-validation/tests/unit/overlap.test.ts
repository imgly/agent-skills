import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { getOutsideBlocks, getProtrudingBlocks } from '../../src/imgly/utils';

type Box = { x: number; y: number; width: number; height: number };

/**
 * The smallest engine the overlap maths needs: one page and a set of blocks
 * with fixed bounding boxes. Keeps the geometry cases off the real engine.
 */
function engineWith(boxes: Record<number, Box>, page: number): CreativeEngine {
  const blocks = Object.keys(boxes).map(Number);
  return {
    block: {
      findByType: (type: string) =>
        type === 'page' ? [page] : type === 'graphic' ? blocks : [],
      getParent: (id: number) => (id === page ? null : page),
      getKind: (id: number) => (id === page ? 'page' : 'image'),
      getGlobalBoundingBoxX: (id: number) => boxes[id].x,
      getGlobalBoundingBoxY: (id: number) => boxes[id].y,
      getGlobalBoundingBoxWidth: (id: number) => boxes[id].width,
      getGlobalBoundingBoxHeight: (id: number) => boxes[id].height
    }
  } as unknown as CreativeEngine;
}

const PAGE = 1;
const page: Box = { x: 0, y: 0, width: 100, height: 100 };

describe('DV-U1 overlap maths', () => {
  it('reports a block with no overlap as outside and not as protruding', () => {
    const engine = engineWith(
      { [PAGE]: page, 2: { x: 500, y: 500, width: 10, height: 10 } },
      PAGE
    );

    expect(getOutsideBlocks(engine)).toEqual([2]);
    expect(getProtrudingBlocks(engine)).toEqual([]);
  });

  it('reports a block half over the edge as protruding and not as outside', () => {
    const engine = engineWith(
      { [PAGE]: page, 2: { x: -50, y: 0, width: 100, height: 100 } },
      PAGE
    );

    expect(getProtrudingBlocks(engine)).toEqual([2]);
    expect(getOutsideBlocks(engine)).toEqual([]);
  });

  it('reports neither for a block that covers the page exactly', () => {
    const engine = engineWith({ [PAGE]: page, 2: { ...page } }, PAGE);

    expect(getProtrudingBlocks(engine)).toEqual([]);
    expect(getOutsideBlocks(engine)).toEqual([]);
  });

  it('uses a 99 % threshold, so 98 % inside still protrudes', () => {
    const engine = engineWith(
      {
        [PAGE]: page,
        2: { x: -2, y: 0, width: 100, height: 100 },
        3: { x: -0.5, y: 0, width: 100, height: 100 }
      },
      PAGE
    );

    expect(getProtrudingBlocks(engine)).toEqual([2]);
  });

  it('never reports a zero-area block, which would divide by zero', () => {
    const engine = engineWith(
      { [PAGE]: page, 2: { x: 10, y: 10, width: 0, height: 0 } },
      PAGE
    );

    // The overlap of a zero-area block is defined as 0, which reads as outside.
    expect(getProtrudingBlocks(engine)).toEqual([]);
    expect(getOutsideBlocks(engine)).toEqual([2]);
  });

  it('returns nothing when the design has no page', () => {
    const engine = {
      block: {
        findByType: () => [],
        getParent: () => null,
        getKind: () => 'image'
      }
    } as unknown as CreativeEngine;

    expect(getProtrudingBlocks(engine)).toEqual([]);
    expect(getOutsideBlocks(engine)).toEqual([]);
  });
});
