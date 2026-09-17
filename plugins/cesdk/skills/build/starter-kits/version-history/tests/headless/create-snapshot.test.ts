import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createSnapshot } from '../../src/imgly/history';

const SNAPSHOT_SCENES = [1, 2, 3].map((index) =>
  fileURLToPath(
    new URL(
      `../../public/assets/snapshots/${index}/scene.scene`,
      import.meta.url
    )
  )
);

const THUMBNAIL_WIDTH = 168;
/** The seeded scenes are 4:5 pages, so a 168 px wide thumbnail is 210 px tall. */
const THUMBNAIL_HEIGHT = 210;

let engine: CreativeEngine;
/** `createSnapshot` takes a `CreativeEditorSDK` but reads only `.engine`. */
let asEditor: CreativeEditorSDK;

async function bytesOf(url: string): Promise<Uint8Array> {
  return new Uint8Array(await (await fetch(url)).arrayBuffer());
}

function jpegSize(bytes: Uint8Array): { width: number; height: number } {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error('The thumbnail is not a JPEG.');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset < bytes.length) {
    if (view.getUint8(offset) !== 0xff) {
      throw new Error('Malformed JPEG marker.');
    }
    const marker = view.getUint8(offset + 1);
    const length = view.getUint16(offset + 2);
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    ) {
      return {
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7)
      };
    }
    offset += 2 + length;
  }
  throw new Error('No JPEG frame header found.');
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
  asEditor = { engine } as unknown as CreativeEditorSDK;
});

afterAll(() => {
  disposeTestEngine();
});

describe('VH-H1 the seeded scenes (Qase 2108)', () => {
  it('loads all three and they differ from each other', async () => {
    const strings: string[] = [];
    for (const scene of SNAPSHOT_SCENES) {
      const loaded = await loadScene(engine as unknown as TestEngine, scene);
      expect(engine.block.isValid(loaded)).toBe(true);
      expect(engine.scene.getPages()).toHaveLength(1);
      strings.push(await engine.scene.saveToString());
    }

    expect(new Set(strings).size).toBe(3);
  });
});

describe('VH-H2 createSnapshot (Qase 2093)', () => {
  it('returns a 168 px wide JPEG thumbnail and the scene string it was given', async () => {
    await loadScene(engine as unknown as TestEngine, SNAPSHOT_SCENES[0]);
    const sceneString = await engine.scene.saveToString();

    const { thumbnailUrl, sceneUrl } = await createSnapshot(
      asEditor,
      sceneString
    );

    // The kit asks for 168 x 168; the export keeps the scene's aspect ratio and
    // only the width lands on the requested value.
    const size = jpegSize(await bytesOf(thumbnailUrl));
    expect(size.width).toBe(THUMBNAIL_WIDTH);
    expect(size.height).toBe(THUMBNAIL_HEIGHT);
    expect(await (await fetch(sceneUrl)).text()).toBe(sceneString);
  });

  it('VH-H3 rejects when no scene is loaded', async () => {
    const empty = { engine: { scene: { get: () => null } } };
    await expect(
      createSnapshot(empty as unknown as CreativeEditorSDK, '')
    ).rejects.toThrow('No scene available');
  });
});

describe('VH-H4 a snapshot round-trip (Qase 2123)', () => {
  it('carries an edit back into the editor and changes the thumbnail', async () => {
    await loadScene(engine as unknown as TestEngine, SNAPSHOT_SCENES[0]);
    const before = await createSnapshot(
      asEditor,
      await engine.scene.saveToString()
    );

    const page = engine.scene.getPages()[0];
    engine.block.setFill(page, engine.block.createFill('color'));
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 1,
      g: 0,
      b: 0,
      a: 1
    });
    const edited = await engine.scene.saveToString();
    const after = await createSnapshot(asEditor, edited);

    expect(await (await fetch(after.sceneUrl)).text()).toBe(edited);

    // VH-H5: the thumbnail follows the design.
    const beforeThumbnail = await bytesOf(before.thumbnailUrl);
    const afterThumbnail = await bytesOf(after.thumbnailUrl);
    expect(
      Buffer.from(afterThumbnail).equals(Buffer.from(beforeThumbnail))
    ).toBe(false);
    expect(jpegSize(afterThumbnail)).toEqual({
      width: THUMBNAIL_WIDTH,
      height: THUMBNAIL_HEIGHT
    });

    await loadScene(engine as unknown as TestEngine, SNAPSHOT_SCENES[1]);
    await engine.scene.loadFromString(
      await (await fetch(after.sceneUrl)).text()
    );
    const reloadedPage = engine.scene.getPages()[0];
    expect(
      engine.block.getColor(
        engine.block.getFill(reloadedPage),
        'fill/color/value'
      )
    ).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });
});
