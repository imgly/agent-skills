import {
  createTestEngine,
  disposeTestEngine
} from '@imgly/kit-test-harness/node';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import {
  applyToPhotoMiddleware,
  getCurrentPageImageUri
} from '../../src/imgly/plugins/ai-photo-edit';

/** `Middleware` types its options against the plugin's generation context. */
const NO_OPTIONS = {} as never;

const ORIGINAL_URI = 'file:///original.png';
const EDITED_URI = 'file:///edited.png';

/** `engine.update()` is not on the public type but drives the undo system. */
type TickingEngine = CreativeEngine & { update(): void };

let engine: TickingEngine;
let cesdk: CreativeEditorSDK;

/** The middleware only reaches `cesdk.engine`, so the engine is the whole kit. */
function asEditor(creativeEngine: CreativeEngine): CreativeEditorSDK {
  return { engine: creativeEngine } as unknown as CreativeEditorSDK;
}

function newScene(): number {
  engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(engine.scene.get()!, page);
  const fill = engine.block.createFill('image');
  engine.block.setFill(page, fill);
  return page;
}

function pageWithSourceSet(): number {
  const page = newScene();
  engine.block.setSourceSet(
    engine.block.getFill(page),
    'fill/image/sourceSet',
    [{ uri: ORIGINAL_URI, width: 1024, height: 768 }]
  );
  return page;
}

function pageWithFileUri(): number {
  const page = newScene();
  engine.block.setString(
    engine.block.getFill(page),
    'fill/image/imageFileURI',
    ORIGINAL_URI
  );
  return page;
}

function sourceSetOf(page: number) {
  return engine.block.getSourceSet(
    engine.block.getFill(page),
    'fill/image/sourceSet'
  );
}

beforeAll(async () => {
  // The kit's own modules need a `window` at import time, which the vitest
  // config stubs; the node engine reads `window.location` and must not see it.
  delete (globalThis as { window?: unknown }).window;

  engine = (await createTestEngine()) as unknown as TickingEngine;
  cesdk = asEditor(engine);
});

afterAll(() => {
  disposeTestEngine();
});

beforeEach(() => {
  engine.scene.create();
});

describe('AIE-H1 the middleware writes the result into the page fill', () => {
  it('replaces the source-set URI and keeps its pixel size', async () => {
    const page = pageWithSourceSet();
    const middleware = applyToPhotoMiddleware(cesdk);

    await middleware({}, NO_OPTIONS, async () => ({ url: EDITED_URI }));

    expect(sourceSetOf(page)).toEqual([
      { uri: EDITED_URI, width: 1024, height: 768 }
    ]);
  });

  it('adds an undo step, so the original photo comes back', async () => {
    const page = pageWithSourceSet();
    // The undo system records a change only once the engine has ticked.
    engine.update();
    engine.editor.addUndoStep();
    engine.update();

    await applyToPhotoMiddleware(cesdk)({}, NO_OPTIONS, async () => ({
      url: EDITED_URI
    }));
    engine.update();

    expect(engine.editor.canUndo()).toBe(true);
    engine.editor.undo();
    engine.update();
    expect(sourceSetOf(page)[0].uri).toBe(ORIGINAL_URI);
  });

  it('leaves the page ready when the generation finishes', async () => {
    const page = pageWithSourceSet();
    await applyToPhotoMiddleware(cesdk)({}, NO_OPTIONS, async () => ({
      url: EDITED_URI
    }));
    expect(engine.block.getState(page).type).toBe('Ready');
  });

  it('marks the page pending while the generation runs', async () => {
    const page = pageWithSourceSet();
    let stateDuringGeneration = '';

    await applyToPhotoMiddleware(cesdk)({}, NO_OPTIONS, async () => {
      stateDuringGeneration = engine.block.getState(page).type;
      return { url: EDITED_URI };
    });

    expect(stateDuringGeneration).toBe('Pending');
  });
});

describe('AIE-H2 a scene built from an image has no source set', () => {
  it('writes a new entry sized to the page', async () => {
    const page = pageWithFileUri();
    expect(sourceSetOf(page)).toEqual([]);

    await applyToPhotoMiddleware(cesdk)({}, NO_OPTIONS, async () => ({
      url: EDITED_URI
    }));

    expect(sourceSetOf(page)).toEqual([
      { uri: EDITED_URI, width: 800, height: 600 }
    ]);
  });
});

describe('AIE-H3 failure and non-image results', () => {
  it('propagates the rejection but leaves the page ready', async () => {
    const page = pageWithSourceSet();
    const failure = new Error('gateway refused');

    await expect(
      applyToPhotoMiddleware(cesdk)({}, NO_OPTIONS, async () => {
        throw failure;
      })
    ).rejects.toBe(failure);

    expect(engine.block.getState(page).type).toBe('Ready');
    expect(sourceSetOf(page)[0].uri).toBe(ORIGINAL_URI);
  });

  it('leaves the fill untouched when the result carries no url', async () => {
    const page = pageWithSourceSet();
    await applyToPhotoMiddleware(cesdk)({}, NO_OPTIONS, async () => ({
      text: 'a streamed answer'
    }));
    expect(sourceSetOf(page)[0].uri).toBe(ORIGINAL_URI);
  });

  it('forwards to next and touches nothing when there is no page', async () => {
    const next = vi.fn(async () => ({ url: EDITED_URI }));
    const input = { prompt: 'brighter' };
    await expect(
      applyToPhotoMiddleware(cesdk)(input, NO_OPTIONS, next)
    ).resolves.toEqual({ url: EDITED_URI });
    expect(next).toHaveBeenCalledWith(input, NO_OPTIONS);
  });
});

describe('AIE-H3 getCurrentPageImageUri', () => {
  it('prefers the source-set URI', () => {
    pageWithSourceSet();
    expect(getCurrentPageImageUri(cesdk)).toBe(ORIGINAL_URI);
  });

  it('falls back to the imageFileURI a created-from-image scene carries', () => {
    pageWithFileUri();
    expect(getCurrentPageImageUri(cesdk)).toBe(ORIGINAL_URI);
  });

  it('is undefined for a page whose image fill is empty', () => {
    newScene();
    expect(getCurrentPageImageUri(cesdk)).toBeUndefined();
  });

  it('is undefined rather than throwing when there is no page', () => {
    expect(getCurrentPageImageUri(cesdk)).toBeUndefined();
  });
});
