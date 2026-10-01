import type { CreativeEngine, RGBAColor } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import {
  getAllColors,
  readCurrentColor,
  waitUntilLoaded
} from '../../src/imgly/plugins/template-properties';

const rgba = (r: number, g: number, b: number, a = 1): RGBAColor =>
  ({ r, g, b, a }) as RGBAColor;

interface FakeBlock {
  id: number;
  text?: boolean;
  fill?: unknown;
  stroke?: unknown;
  textColors?: unknown[];
}

const FILL_OFFSET = 1000;

/** Only the calls the colour traversals make, so a missing one fails loudly. */
function colorEngine(blocks: FakeBlock[]): CreativeEngine {
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const blockOfFill = (fill: number) => byId.get(fill - FILL_OFFSET);
  return {
    block: {
      findAll: () => blocks.map(({ id }) => id),
      getFill: (id: number) => id + FILL_OFFSET,
      isValid: (fill: number) => blockOfFill(fill)?.fill != null,
      getType: (id: number) =>
        id >= FILL_OFFSET
          ? '//ly.img.ubq/fill/color'
          : byId.get(id)?.text === true
            ? '//ly.img.ubq/text'
            : '//ly.img.ubq/graphic',
      supportsFill: (id: number) => byId.get(id)?.fill != null,
      isFillEnabled: () => true,
      getColor: (fill: number) => blockOfFill(fill)?.fill,
      supportsStroke: (id: number) => byId.get(id)?.stroke != null,
      isStrokeEnabled: (id: number) => byId.get(id)?.stroke != null,
      getStrokeColor: (id: number) => byId.get(id)?.stroke,
      getTextColors: (id: number) => byId.get(id)?.textColors ?? []
    }
  } as unknown as CreativeEngine;
}

describe('FTA-U14 readCurrentColor', () => {
  it('reads a fill colour through the block fill and drops its opacity', () => {
    const engine = colorEngine([{ id: 1, fill: rgba(1, 0, 0, 0.5) }]);

    expect(
      readCurrentColor(engine, { id: 1, color: rgba(0, 0, 0), type: 'fill' })
    ).toEqual(rgba(1, 0, 0, 1));
  });

  it('reads a stroke colour from the block itself', () => {
    const engine = colorEngine([{ id: 2, stroke: rgba(0, 1, 0, 0.25) }]);

    expect(
      readCurrentColor(engine, { id: 2, color: rgba(0, 0, 0), type: 'stroke' })
    ).toEqual(rgba(0, 1, 0, 1));
  });

  it('reads the first text colour of a text block', () => {
    const engine = colorEngine([
      { id: 3, text: true, textColors: [rgba(0, 0, 1, 0.75), rgba(1, 1, 1)] }
    ]);

    expect(
      readCurrentColor(engine, { id: 3, color: rgba(0, 0, 0), type: 'text' })
    ).toEqual(rgba(0, 0, 1, 1));
  });

  it('keeps the colour it was given when the engine answers with a spot colour', () => {
    const engine = colorEngine([{ id: 4, fill: { name: 'Pantone 123' } }]);
    const fallback = rgba(0.5, 0.5, 0.5);

    expect(
      readCurrentColor(engine, { id: 4, color: fallback, type: 'fill' })
    ).toBe(fallback);
  });
});

describe('FTA-U15 getAllColors', () => {
  it('groups blocks that share a colour and remembers each block opacity', () => {
    const engine = colorEngine([
      { id: 1, fill: rgba(1, 0, 0, 0.4) },
      { id: 2, fill: rgba(1, 0, 0, 0.9) }
    ]);

    const groups = Object.values(getAllColors(engine));
    expect(groups).toHaveLength(1);
    expect(
      groups[0]?.map(({ id, initialOpacity }) => [id, initialOpacity])
    ).toEqual([
      [1, 0.4],
      [2, 0.9]
    ]);
  });

  it('keeps fill, stroke and text sources of the same colour in one group', () => {
    const engine = colorEngine([
      { id: 1, fill: rgba(0, 0, 1) },
      { id: 2, stroke: rgba(0, 0, 1) },
      { id: 3, text: true, textColors: [rgba(0, 0, 1)] }
    ]);

    const groups = Object.values(getAllColors(engine));
    expect(groups).toHaveLength(1);
    expect(groups[0]?.map(({ type }) => type).sort()).toEqual([
      'fill',
      'stroke',
      'text'
    ]);
  });

  it('skips a fill, a stroke and a text colour the engine reports as non-RGBA', () => {
    const engine = colorEngine([
      { id: 1, fill: { name: 'Pantone 123' } },
      { id: 2, stroke: { name: 'Pantone 123' } },
      { id: 3, text: true, textColors: [{ name: 'Pantone 123' }] }
    ]);

    expect(getAllColors(engine)).toEqual({});
  });

  it('skips a text block whose runs do not share one colour', () => {
    const engine = colorEngine([
      { id: 3, text: true, textColors: [rgba(1, 0, 0), rgba(0, 1, 0)] }
    ]);

    expect(getAllColors(engine)).toEqual({});
  });

  it('never reads a text block as a fill source', () => {
    const engine = colorEngine([
      { id: 3, text: true, fill: rgba(1, 0, 0), textColors: [rgba(1, 0, 0)] }
    ]);

    expect(
      Object.values(getAllColors(engine))[0]?.map(({ type }) => type)
    ).toEqual(['text']);
  });
});

describe('FTA-U16 waitUntilLoaded', () => {
  it('forces the whole scene to load before the panel reads it', async () => {
    const forceLoadResources = vi.fn().mockResolvedValue(undefined);
    const engine = {
      block: { forceLoadResources },
      scene: { get: () => 42 }
    } as unknown as CreativeEngine;

    await waitUntilLoaded(engine);

    expect(forceLoadResources).toHaveBeenCalledWith([42]);
  });
});
