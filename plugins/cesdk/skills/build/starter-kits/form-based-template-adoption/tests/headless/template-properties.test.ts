import type { CreativeEngine } from '@cesdk/cesdk-js';
import {
  createTestEngine,
  disposeTestEngine
} from '@imgly/kit-test-harness/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  getAllColors,
  getTemplateImageBlocks,
  getTemplateTextBlocks,
  relocateResourcesToBlobURLs
} from '../../src/imgly/plugins/template-properties';

// The unit tests need a `window`, and the engine reads `window.location.href`
// when it normalises its base URL.
const stubbedWindow = globalThis.window as unknown as { location?: URL };
stubbedWindow.location ??= new URL('http://localhost/');

let engine: CreativeEngine;
let scene: number;
let page: number;

const RED = { r: 1, g: 0, b: 0, a: 1 };
const BLUE = { r: 0, g: 0, b: 1, a: 1 };

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterAll(() => disposeTestEngine());

afterEach(() => {
  engine.block.findAll().forEach((block) => {
    if (engine.block.isValid(block)) {
      engine.block.destroy(block);
    }
  });
});

function newScene(): void {
  scene = engine.scene.create();
  page = engine.block.create('page');
  engine.block.appendChild(scene, page);
}

function addGraphic(fill: 'image' | 'color'): number {
  const graphic = engine.block.create('graphic');
  engine.block.setShape(graphic, engine.block.createShape('rect'));
  engine.block.setFill(graphic, engine.block.createFill(fill));
  engine.block.appendChild(page, graphic);
  return graphic;
}

function addText(text: string): number {
  const block = engine.block.create('text');
  engine.block.replaceText(block, text);
  engine.block.appendChild(page, block);
  return block;
}

describe('FTA-H1 which blocks become image properties', () => {
  it('takes only the image-filled graphics whose fill may be changed', () => {
    newScene();
    const editable = addGraphic('image');
    engine.block.setScopeEnabled(editable, 'fill/change', true);
    const locked = addGraphic('image');
    engine.block.setScopeEnabled(locked, 'fill/change', false);
    addGraphic('color');
    addText('Headline');

    expect(getTemplateImageBlocks(engine)).toEqual([editable]);
  });

  it('returns nothing for a template without images', () => {
    newScene();
    addGraphic('color');

    expect(getTemplateImageBlocks(engine)).toEqual([]);
  });
});

describe('FTA-H2 which blocks become text properties', () => {
  it('takes only the text blocks that may be edited', () => {
    newScene();
    const editable = addText('Headline');
    engine.block.setScopeEnabled(editable, 'text/edit', true);
    const locked = addText('Legal notice');
    engine.block.setScopeEnabled(locked, 'text/edit', false);
    addGraphic('image');

    expect(getTemplateTextBlocks(engine)).toEqual([editable]);
  });
});

describe('FTA-H1/H2 ordering', () => {
  it('returns the blocks nearest the top left corner first', () => {
    newScene();
    const far = addText('Far');
    engine.block.setScopeEnabled(far, 'text/edit', true);
    engine.block.setPositionX(far, 300);
    engine.block.setPositionY(far, 0);
    const near = addText('Near');
    engine.block.setScopeEnabled(near, 'text/edit', true);
    engine.block.setPositionX(near, 0);
    engine.block.setPositionY(near, 0);
    const middle = addText('Middle');
    engine.block.setScopeEnabled(middle, 'text/edit', true);
    engine.block.setPositionX(middle, 100);
    engine.block.setPositionY(middle, 100);

    expect(getTemplateTextBlocks(engine)).toEqual([near, middle, far]);
  });
});

describe('FTA-H3 color grouping', () => {
  it('groups blocks by color, keeps each block opacity and ignores image fills', () => {
    newScene();
    const opaque = addGraphic('color');
    engine.block.setColor(
      engine.block.getFill(opaque),
      'fill/color/value',
      RED
    );
    const translucent = addGraphic('color');
    engine.block.setColor(
      engine.block.getFill(translucent),
      'fill/color/value',
      {
        ...RED,
        a: 0.5
      }
    );
    const stroked = addGraphic('color');
    engine.block.setColor(
      engine.block.getFill(stroked),
      'fill/color/value',
      RED
    );
    engine.block.setStrokeEnabled(stroked, true);
    engine.block.setStrokeColor(stroked, BLUE);
    addGraphic('image');

    const colors = getAllColors(engine);
    const red = colors[JSON.stringify(RED)]!;

    expect(red.map(({ id }) => id)).toEqual([opaque, translucent, stroked]);
    expect(red.map(({ initialOpacity }) => initialOpacity)).toEqual([
      1, 0.5, 1
    ]);
    expect(red.every(({ type }) => type === 'fill')).toBe(true);
    expect(red.every(({ color }) => color.a === 1)).toBe(true);

    const blue = colors[JSON.stringify(BLUE)]!;
    expect(blue).toEqual([
      expect.objectContaining({ id: stroked, type: 'stroke' })
    ]);
  });

  it('takes a text block with one color and skips one with two', () => {
    newScene();
    const single = addText('One color');
    engine.block.setTextColor(single, RED);
    const mixed = addText('Two colors');
    engine.block.setTextColor(mixed, RED, 0, 3);
    engine.block.setTextColor(mixed, BLUE, 4, 10);

    const colors = getAllColors(engine);
    const groups = Object.values(colors).flatMap((group) => group ?? []);

    expect(groups.filter(({ id }) => id === single)).toEqual([
      expect.objectContaining({ id: single, type: 'text' })
    ]);
    expect(groups.filter(({ id }) => id === mixed)).toEqual([]);
  });
});

describe('FTA-H5 relocating transient resources', () => {
  it('moves a buffer that a block references to a blob URL', async () => {
    newScene();
    const buffer = engine.editor.createBuffer();
    engine.editor.setBufferData(buffer, 0, new Uint8Array([1, 2, 3, 4]));
    // Detached: an image fill on the page starts a resource load whose abort
    // on dispose crashes undici.
    const graphic = engine.block.create('graphic');
    engine.block.setFill(graphic, engine.block.createFill('image'));
    const fill = engine.block.getFill(graphic);
    engine.block.setString(fill, 'fill/image/imageFileURI', buffer);
    expect(
      engine.editor.findAllTransientResources().map(({ URL: url }) => url)
    ).toEqual([buffer]);

    relocateResourcesToBlobURLs(engine);

    // A relocated resource is no longer transient, so it drops out of the list.
    expect(engine.editor.findAllTransientResources()).toEqual([]);
    expect(engine.block.getString(fill, 'fill/image/imageFileURI')).toMatch(
      /^blob:/
    );
    // Let the engine finish reading the relocated resource: an in-flight fetch
    // aborted by dispose crashes undici.
    await engine.block.forceLoadResources([graphic]).catch(() => undefined);
  });

  it('leaves the bundled resources alone', () => {
    newScene();
    const before = engine.editor.findAllTransientResources();

    relocateResourcesToBlobURLs(engine);

    expect(engine.editor.findAllTransientResources()).toEqual(before);
  });
});
