import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import {
  BlocksToEditableProperties,
  orderBlocksByDistanceToTopLeft,
  relocateResourcesToBlobURLs,
  type EditingOptions
} from '../../src/imgly/plugins/template-properties';

/** Only the block calls the two pure traversals make. */
function engineWithNames(names: Record<number, string>): CreativeEngine {
  return {
    block: { getName: (id: number) => names[id] ?? '' }
  } as unknown as CreativeEngine;
}

function engineWithPositions(
  positions: Record<number, { x: number; y: number }>
): CreativeEngine {
  return {
    block: {
      getPositionX: (id: number) => positions[id].x,
      getPositionY: (id: number) => positions[id].y
    }
  } as unknown as CreativeEngine;
}

describe('FTA-U1 BlocksToEditableProperties', () => {
  it('merges blocks that share a name into one property', () => {
    const engine = engineWithNames({ 1: 'Headline', 2: 'Headline' });

    expect(BlocksToEditableProperties(engine, [1, 2])).toEqual([
      { name: 'Headline', blocks: [1, 2], options: {} }
    ]);
  });

  it('keeps differently named blocks apart, in input order', () => {
    const engine = engineWithNames({ 1: 'Body', 2: 'Headline' });

    expect(
      BlocksToEditableProperties(engine, [1, 2]).map(({ name }) => name)
    ).toEqual(['Body', 'Headline']);
  });

  it('falls back to the block id when a block has no name', () => {
    const engine = engineWithNames({ 7: '' });

    expect(BlocksToEditableProperties(engine, [7])[0].name).toBe('7');
  });

  it('returns nothing for an empty list', () => {
    expect(BlocksToEditableProperties(engineWithNames({}), [])).toEqual([]);
  });

  it('asks the caller for the options of each block', () => {
    const engine = engineWithNames({ 1: 'Body', 2: 'Headline' });
    const options = (block: number) =>
      ({ expanded: block === 1 }) as EditingOptions;

    expect(
      BlocksToEditableProperties(engine, [1, 2], options).map(
        ({ options: value }) => value
      )
    ).toEqual([{ expanded: true }, { expanded: false }]);
  });
});

describe('FTA-U2 orderBlocksByDistanceToTopLeft', () => {
  it('orders blocks by their distance to the top left corner', () => {
    const engine = engineWithPositions({
      1: { x: 300, y: 0 },
      2: { x: 0, y: 0 },
      3: { x: 100, y: 100 }
    });

    expect(orderBlocksByDistanceToTopLeft(engine, [1, 2, 3])).toEqual([
      2, 3, 1
    ]);
  });

  it('keeps the input order of two blocks at the same distance', () => {
    const engine = engineWithPositions({
      1: { x: 0, y: 10 },
      2: { x: 10, y: 0 }
    });

    expect(orderBlocksByDistanceToTopLeft(engine, [1, 2])).toEqual([1, 2]);
  });

  it('returns nothing for an empty list', () => {
    expect(orderBlocksByDistanceToTopLeft(engineWithPositions({}), [])).toEqual(
      []
    );
  });
});

describe('FTA-H5 relocateResourcesToBlobURLs, bundle-skip branch', () => {
  it('leaves the bundled resources where they are and relocates the rest', () => {
    const relocateResource = vi.fn();
    const engine = {
      editor: {
        findAllTransientResources: () => [
          { URL: 'bundle://ly.img.cesdk/fonts/roboto.ttf' },
          { URL: 'buffer://transient-1' }
        ],
        getBufferLength: () => 3,
        getBufferData: () => new Uint8Array([1, 2, 3]),
        relocateResource
      }
    } as unknown as CreativeEngine;
    const createObjectURL = vi.fn(() => 'blob:kit/1');
    vi.stubGlobal('URL', { createObjectURL });

    relocateResourcesToBlobURLs(engine);

    expect(relocateResource).toHaveBeenCalledExactlyOnceWith(
      'buffer://transient-1',
      'blob:kit/1'
    );
    vi.unstubAllGlobals();
  });
});
