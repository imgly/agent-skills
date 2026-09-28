import {
  createTestEngine,
  disposeTestEngine
} from '@imgly/kit-test-harness/node';
import type { AssetResult, CreativeEngine } from '@cesdk/cesdk-js';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { applyLayoutToPage } from '../../src/imgly/plugins/layouts/applyLayout';

const LAYOUT_URI = 'https://layouts.test/template-0.scene';

let engine: CreativeEngine;

interface Slots {
  texts: string[];
  images: string[];
}

/** A page whose blocks sit on separate rows, so the visual sort is stable. */
function buildPage(slots: Slots): number {
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 800);

  let y = 0;
  for (const value of slots.texts) {
    const text = engine.block.create('text');
    engine.block.setString(text, 'text/text', value);
    engine.block.setPositionX(text, 0);
    engine.block.setPositionY(text, y);
    engine.block.appendChild(page, text);
    y += 100;
  }
  for (const uri of slots.images) {
    const graphic = engine.block.create('graphic');
    engine.block.setShape(graphic, engine.block.createShape('rect'));
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', uri);
    engine.block.setFill(graphic, fill);
    engine.block.setKind(graphic, 'image');
    engine.block.setPositionX(graphic, 0);
    engine.block.setPositionY(graphic, y);
    engine.block.appendChild(page, graphic);
    y += 100;
  }
  return page;
}

/** The current scene, with one page holding the given content. */
function useScene(slots: Slots): number {
  const scene = engine.scene.create();
  const page = buildPage(slots);
  engine.block.appendChild(scene, page);
  return page;
}

/** A saved layout page, served to the kit through the stubbed `fetch`. */
async function layoutScene(slots: Slots): Promise<string> {
  const page = buildPage(slots);
  const serialized = await engine.block.saveToString([page]);
  engine.block.destroy(page);
  return serialized;
}

function serve(scene: string): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ text: async () => scene }))
  );
}

const asset = { id: 'layout-0', meta: { uri: LAYOUT_URI } } as AssetResult;

function textsAndImages(page: number): { texts: string[]; images: string[] } {
  const children = engine.block.getChildren(page);
  return {
    texts: children
      .filter((child) => engine.block.getType(child).includes('text'))
      .map((child) => engine.block.getString(child, 'text/text')),
    images: children
      .filter((child) => engine.block.getKind(child) === 'image')
      .map((child) =>
        engine.block.getString(
          engine.block.getFill(child),
          'fill/image/imageFileURI'
        )
      )
  };
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterAll(() => disposeTestEngine());

afterEach(() => {
  vi.unstubAllGlobals();
  engine.editor.setGlobalScope('lifecycle/destroy', 'Allow');
});

describe('LAY-H1 content is carried over', () => {
  it('copies both texts and both image URIs onto the layout blocks', async () => {
    const page = useScene({
      texts: ['headline', 'body'],
      images: ['https://images.test/a.png', 'https://images.test/b.png']
    });
    serve(
      await layoutScene({
        texts: ['slot text 1', 'slot text 2'],
        images: [
          'https://images.test/slot-1.png',
          'https://images.test/slot-2.png'
        ]
      })
    );

    const result = await applyLayoutToPage(engine, asset, true);

    expect(result).toBe(page);
    expect(textsAndImages(page)).toEqual({
      texts: ['headline', 'body'],
      images: ['https://images.test/a.png', 'https://images.test/b.png']
    });
  });
});

describe('LAY-H2 slot count mismatch', () => {
  it('fills as many slots as the layout has when the page has more', async () => {
    const page = useScene({
      texts: [],
      images: [
        'https://images.test/a.png',
        'https://images.test/b.png',
        'https://images.test/c.png'
      ]
    });
    serve(
      await layoutScene({
        texts: [],
        images: ['https://images.test/slot-1.png']
      })
    );

    await applyLayoutToPage(engine, asset, true);

    expect(textsAndImages(page).images).toEqual(['https://images.test/a.png']);
  });

  it('leaves the extra layout slots untouched when the page has fewer', async () => {
    const page = useScene({ texts: [], images: ['https://images.test/a.png'] });
    serve(
      await layoutScene({
        texts: [],
        images: [
          'https://images.test/slot-1.png',
          'https://images.test/slot-2.png',
          'https://images.test/slot-3.png'
        ]
      })
    );

    await applyLayoutToPage(engine, asset, true);

    expect(textsAndImages(page).images).toEqual([
      'https://images.test/a.png',
      'https://images.test/slot-2.png',
      'https://images.test/slot-3.png'
    ]);
  });
});

describe('LAY-H3 no leftover blocks and the scope is restored', () => {
  it('destroys the duplicated page and the loaded layout page', async () => {
    const page = useScene({
      texts: ['headline'],
      images: ['https://images.test/a.png']
    });
    serve(
      await layoutScene({
        texts: ['slot text'],
        images: ['https://images.test/slot-1.png']
      })
    );
    const scopeBefore = engine.editor.getGlobalScope('lifecycle/destroy');

    await applyLayoutToPage(engine, asset, true);

    expect(engine.editor.getGlobalScope('lifecycle/destroy')).toBe(scopeBefore);
    expect(engine.scene.getPages()).toEqual([page]);
    expect(engine.block.getChildren(page)).toHaveLength(2);
  });
});

describe('LAY-H4 the layout scene fails to load', () => {
  it('restores the destroy scope when the fetch rejects', async () => {
    useScene({ texts: ['headline'], images: [] });
    engine.editor.setGlobalScope('lifecycle/destroy', 'Deny');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      })
    );

    await expect(applyLayoutToPage(engine, asset, true)).rejects.toThrow();

    expect(engine.editor.getGlobalScope('lifecycle/destroy')).toBe('Deny');
  });

  it('restores the destroy scope when the body is not a scene', async () => {
    useScene({ texts: ['headline'], images: [] });
    engine.editor.setGlobalScope('lifecycle/destroy', 'Deny');
    serve('this is not a scene');

    await expect(applyLayoutToPage(engine, asset, true)).rejects.toThrow();

    expect(engine.editor.getGlobalScope('lifecycle/destroy')).toBe('Deny');
  });

  it('rejects a scene with no page', async () => {
    engine.scene.create();
    serve(await layoutScene({ texts: [], images: [] }));

    await expect(applyLayoutToPage(engine, asset, true)).rejects.toThrow(
      'No current page found'
    );
  });

  it('rejects a layout scene that holds no block', async () => {
    useScene({ texts: ['headline'], images: [] });
    serve(await engine.block.saveToString([]));

    await expect(applyLayoutToPage(engine, asset, true)).rejects.toThrow(
      'The layout scene holds no page'
    );

    expect(engine.scene.getPages()).toHaveLength(1);
  });

  it('leaves no duplicated page behind when the copy step fails', async () => {
    useScene({ texts: ['headline'], images: [] });
    serve(await layoutScene({ texts: ['slot text'], images: [] }));
    const insertChild = vi
      .spyOn(engine.block, 'insertChild')
      .mockImplementation(() => {
        throw new Error('insert failed');
      });

    await expect(applyLayoutToPage(engine, asset, true)).rejects.toThrow(
      'insert failed'
    );

    expect(engine.scene.getPages()).toHaveLength(1);
    insertChild.mockRestore();
  });
});

describe('LAY-H5 addUndoStep', () => {
  it('adds one undo step by default and none when it is switched off', async () => {
    useScene({ texts: ['headline'], images: [] });
    const layout = await layoutScene({ texts: ['slot text'], images: [] });
    const addUndoStep = vi.spyOn(engine.editor, 'addUndoStep');

    serve(layout);
    await applyLayoutToPage(engine, asset, true);
    expect(addUndoStep).toHaveBeenCalledTimes(1);

    addUndoStep.mockClear();
    serve(layout);
    await applyLayoutToPage(engine, asset, false);
    expect(addUndoStep).not.toHaveBeenCalled();

    addUndoStep.mockRestore();
  });
});

describe('LAY-H6 placeholder behaviour', () => {
  it('copies the placeholder state of an image slot', async () => {
    const page = useScene({ texts: [], images: ['https://images.test/a.png'] });
    const [fromImage] = engine.block.getChildren(page);
    engine.block.setPlaceholderBehaviorEnabled(
      engine.block.getFill(fromImage),
      true
    );
    serve(
      await layoutScene({
        texts: [],
        images: ['https://images.test/slot-1.png']
      })
    );

    await applyLayoutToPage(engine, asset, true);

    const [toImage] = engine.block.getChildren(page);
    expect(
      engine.block.isPlaceholderBehaviorEnabled(engine.block.getFill(toImage))
    ).toBe(true);
  });
});

describe('LAY-H7 the font of a text slot cannot be read', () => {
  it('still copies the text onto the layout slot', async () => {
    const page = useScene({ texts: ['headline'], images: [] });
    serve(await layoutScene({ texts: ['slot text'], images: [] }));
    const getTypeface = vi
      .spyOn(engine.block, 'getTypeface')
      .mockImplementation(() => {
        throw new Error('no typeface');
      });

    await applyLayoutToPage(engine, asset, true);

    expect(textsAndImages(page).texts).toEqual(['headline']);
    getTypeface.mockRestore();
  });
});
