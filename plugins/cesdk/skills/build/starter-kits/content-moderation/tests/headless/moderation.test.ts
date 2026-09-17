import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { fileURLToPath } from 'node:url';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import { checkImageContent } from '../../src/app/moderation';
import { getImageUrl, selectBlocks } from '../../src/app/utils';

const SCENE = fileURLToPath(
  new URL('../../public/assets/example.scene', import.meta.url)
);

const MODERATION_HOST = 'europe-west3-img-ly.cloudfunctions.net';

const CLEAN = { weapon: 0, alcohol: 0, drugs: 0, nudity: { safe: 1 } };

let engine: CreativeEngine;
let originalFetch: typeof fetch;
/** Moderation requests the stub answered, in call order. */
let moderationRequests: string[];

/**
 * Answer moderation requests from `answer` and let every other request — the
 * scene's own images and fonts — reach the real network.
 */
function stubModeration(answer: (url: string) => unknown): void {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (!url.includes(MODERATION_HOST)) {
      return originalFetch(input as RequestInfo, init);
    }
    moderationRequests.push(url);
    const imageUrl = new URL(url).searchParams.get('url') ?? '';
    return new Response(JSON.stringify(answer(imageUrl)));
  }) as typeof fetch;
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
  originalFetch = globalThis.fetch;
});

afterAll(() => {
  disposeTestEngine();
});

beforeEach(async () => {
  moderationRequests = [];
  await loadScene(engine as unknown as TestEngine, SCENE);
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('CM-H1 image collection', () => {
  it('asks the service once per image block and never for text or shapes', async () => {
    stubModeration(() => CLEAN);

    const results = await checkImageContent(engine);
    const imageBlocks = engine.block.findByKind('image');

    expect(imageBlocks.length).toBeGreaterThan(0);
    expect(moderationRequests).toHaveLength(imageBlocks.length);
    expect(results).toHaveLength(imageBlocks.length * 4);

    const urls = imageBlocks.map((id) => getImageUrl(engine, id));
    for (const url of urls) {
      expect(
        moderationRequests.some((request) =>
          request.includes(encodeURIComponent(url as string))
        )
      ).toBe(true);
    }
  });
});

describe('CM-H2 four categories per image', () => {
  it('carries the block identity into every category result', async () => {
    stubModeration(() => ({
      weapon: 0.9,
      alcohol: 0.1,
      drugs: 0.5,
      nudity: { safe: 0.2 }
    }));

    const results = await checkImageContent(engine);
    const [block] = engine.block.findByKind('image');
    const forBlock = results.filter((result) => result.blockId === block);

    expect(forBlock.map((result) => result.name)).toEqual([
      'Weapons',
      'Alcohol',
      'Drugs',
      'Nudity'
    ]);
    // 1 - 0.2 = 0.8, and the failed threshold is strictly above 0.8.
    expect(forBlock.map((result) => result.state)).toEqual([
      'failed',
      'success',
      'warning',
      'warning'
    ]);
    for (const result of forBlock) {
      expect(result.blockType).toBe(engine.block.getType(block));
      expect(result.blockName).toBe(engine.block.getName(block));
      expect(result.url).toBe(getImageUrl(engine, block));
    }
  });
});

describe('CM-H3 getImageUrl', () => {
  it('prefers the direct URI, falls back to the source set, else null', () => {
    const [block] = engine.block.findByKind('image');
    const fill = engine.block.getFill(block);
    const sourceSet = [
      { uri: 'https://example.test/small.png', width: 100, height: 100 },
      { uri: 'https://example.test/large.png', width: 200, height: 200 }
    ];

    engine.block.setSourceSet(fill, 'fill/image/sourceSet', sourceSet);
    engine.block.setString(
      fill,
      'fill/image/imageFileURI',
      'https://example.test/direct.png'
    );
    expect(getImageUrl(engine, block)).toBe('https://example.test/direct.png');

    // The engine returns the source set in its own order; the kit takes the
    // first entry of that order.
    engine.block.setString(fill, 'fill/image/imageFileURI', '');
    expect(getImageUrl(engine, block)).toBe(
      engine.block.getSourceSet(fill, 'fill/image/sourceSet')[0].uri
    );

    engine.block.setSourceSet(fill, 'fill/image/sourceSet', []);
    expect(getImageUrl(engine, block)).toBeNull();
  });

  it('CM-H7 sends no request when no image yields a URL', async () => {
    for (const block of engine.block.findByKind('image')) {
      const fill = engine.block.getFill(block);
      engine.block.setString(fill, 'fill/image/imageFileURI', '');
      engine.block.setSourceSet(fill, 'fill/image/sourceSet', []);
    }
    stubModeration(() => CLEAN);

    expect(await checkImageContent(engine)).toEqual([]);
    expect(moderationRequests).toEqual([]);
  });
});

describe('CM-H4 several images', () => {
  it('answers per URL and keeps each result on its own block', async () => {
    const page = engine.scene.getPages()[0];
    const source = engine.block.findByKind('image')[0];
    const extra = [1, 2].map(() => {
      const copy = engine.block.duplicate(source);
      engine.block.appendChild(page, copy);
      return copy;
    });
    engine.block.setString(
      engine.block.getFill(extra[0]),
      'fill/image/imageFileURI',
      'https://example.test/flagged.png'
    );
    engine.block.setString(
      engine.block.getFill(extra[1]),
      'fill/image/imageFileURI',
      'https://example.test/clean.png'
    );

    stubModeration((url) =>
      url.includes('flagged')
        ? { weapon: 0.95, alcohol: 0, drugs: 0, nudity: { safe: 1 } }
        : CLEAN
    );

    const results = await checkImageContent(engine);
    const blocks = engine.block.findByKind('image');

    expect(moderationRequests).toHaveLength(blocks.length);
    expect(results).toHaveLength(blocks.length * 4);
    expect(
      results
        .filter((result) => result.state === 'failed')
        .map((result) => result.blockId)
    ).toEqual([extra[0]]);
  });
});

describe('CM-H5 selectBlocks', () => {
  it('replaces the selection, and an empty list clears it', () => {
    const blocks = engine.block.findByKind('image');
    engine.block.setSelected(blocks[0], true);

    selectBlocks(engine, [blocks[blocks.length - 1]]);
    expect(engine.block.findAllSelected()).toEqual([blocks[blocks.length - 1]]);

    selectBlocks(engine, []);
    expect(engine.block.findAllSelected()).toEqual([]);
  });
});

describe('CM-H6 a malformed response', () => {
  it('rejects instead of reporting a clean design', async () => {
    stubModeration(() => ({}));

    await expect(checkImageContent(engine)).rejects.toThrow(
      /returned no ".*" score/
    );
  });
});
