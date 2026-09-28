import {
  createTestEngine,
  disposeTestEngine,
  readPngSize
} from '@imgly/kit-test-harness/node';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { batchRender, type BatchItem } from '../../src/imgly/batch-renderer';

const SCENES_JSON = fileURLToPath(
  new URL('../../public/scenes.json', import.meta.url)
);
const PHOTO_URL = `file://${fileURLToPath(
  new URL('../../public/images/photo_imgly_11.png', import.meta.url)
)}`;

const ERAY: BatchItem = {
  variables: { FirstName: 'Eray', LastName: 'Basar', Department: 'Co-Founder' }
};
const OLGA: BatchItem = {
  variables: {
    FirstName: 'Olga',
    LastName: 'Stadnicka',
    Department: 'Quality Assurance'
  }
};

/** The engine surface used here; `@cesdk/node` ships no declarations. */
interface Engine {
  scene: {
    create(): number;
    get(): number | null;
    getPages(): number[];
    loadFromString(serialized: string): Promise<number>;
    saveToString(): Promise<string>;
  };
  block: {
    duplicate(id: number): number;
    findByName(name: string): number[];
    findByType(type: string): number[];
    getFill(id: number): number;
    getString(id: number, property: string): string;
  };
  variable: {
    getString(name: string): string;
    setString(name: string, value: string): void;
    remove(name: string): void;
  };
}

let engine: Engine;
let portraitScene: string;
let twoPageScene: string;

/** The engine every case shares, so `batchRender` does not boot one per call. */
function options(extra: Record<string, unknown> = {}) {
  return { engine: engine as never, ...extra };
}

/** Load a result's scene back into the engine so its contents can be read. */
async function reload(sceneString: string): Promise<void> {
  await engine.scene.loadFromString(sceneString);
}

async function bytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

async function asBase64(blob: Blob): Promise<string> {
  return Buffer.from(await blob.arrayBuffer()).toString('base64');
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as Engine;
  const scenes = JSON.parse(await readFile(SCENES_JSON, 'utf8'));
  portraitScene = scenes.portraitScene;

  await engine.scene.loadFromString(portraitScene);
  const [page] = engine.scene.getPages();
  engine.block.duplicate(page);
  twoPageScene = await engine.scene.saveToString();
});

afterAll(() => {
  disposeTestEngine();
});

describe('batchRender', () => {
  // BIG-H1
  it('returns one result per item, in item order', async () => {
    const results = await batchRender(portraitScene, [ERAY, OLGA], options());

    expect(results).toHaveLength(2);
    for (const result of results) {
      expect(result.blob.size).toBeGreaterThan(0);
      await expect(reload(result.sceneString)).resolves.toBeUndefined();
    }
  });

  // BIG-H2. The variable store is engine state rather than scene state (see
  // "does not travel in the scene string" below), so per-item application is
  // proved against a single-item render of the same item.
  it('applies each item its own variables', async () => {
    const batch = await batchRender(portraitScene, [ERAY, OLGA], options());
    const [erayAlone] = await batchRender(portraitScene, [ERAY], options());
    const [olgaAlone] = await batchRender(portraitScene, [OLGA], options());

    expect(await asBase64(batch[0].blob)).toBe(await asBase64(erayAlone.blob));
    expect(await asBase64(batch[1].blob)).toBe(await asBase64(olgaAlone.blob));
  });

  // The end-to-end proof that the variables reached the picture, standing in
  // for the missing engine coverage of variable substitution on export.
  it('renders a different picture for each item', async () => {
    const [eray, olga] = await batchRender(
      portraitScene,
      [ERAY, OLGA],
      options()
    );

    expect(await asBase64(eray.blob)).not.toBe(await asBase64(olga.blob));
  });

  it('leaves the text blocks holding the variable reference, not the value', async () => {
    const [eray] = await batchRender(portraitScene, [ERAY], options());
    await reload(eray.sceneString);
    const [firstName] = engine.block.findByName('FirstName');

    expect(engine.block.getString(firstName, 'text/text')).toBe(
      '{{FirstName}}'
    );
  });

  it('does not travel the variable values in the scene string', async () => {
    const [eray] = await batchRender(portraitScene, [ERAY], options());
    engine.variable.setString('FirstName', 'Untouched');
    await reload(eray.sceneString);

    expect(engine.variable.getString('FirstName')).toBe('Untouched');
  });

  // BIG-H3
  it('replaces an image fill by block name', async () => {
    const [result] = await batchRender(
      portraitScene,
      [{ ...ERAY, images: { Photo: PHOTO_URL } }],
      options()
    );

    await reload(result.sceneString);
    const [photo] = engine.block.findByName('Photo');
    expect(
      engine.block.getString(
        engine.block.getFill(photo),
        'fill/image/imageFileURI'
      )
    ).toBe(PHOTO_URL);
  });

  it('ignores an image entry naming no block', async () => {
    const [result] = await batchRender(
      portraitScene,
      [{ images: { NoSuchBlock: 'file:///nowhere.png' } }],
      options()
    );

    expect(result.blob.size).toBeGreaterThan(0);
  });

  // BIG-H4
  it.each([
    ['image/jpeg' as const, 'image/jpeg'],
    [undefined, 'image/png']
  ])('honours mimeType %s', async (mimeType, expected) => {
    const [result] = await batchRender(
      portraitScene,
      [ERAY],
      options(mimeType == null ? {} : { mimeType })
    );

    expect(result.blob.type).toBe(expected);
  });

  // BIG-H5
  it('renders nothing for an empty item list, and stays usable after', async () => {
    expect(await batchRender(portraitScene, [], options())).toEqual([]);
    expect(await batchRender(portraitScene, [ERAY], options())).toHaveLength(1);
  });

  // BIG-H6
  it('renders the template unchanged for an item with no data', async () => {
    const [eray, blank] = await batchRender(
      portraitScene,
      [ERAY, {}],
      options()
    );

    expect(await asBase64(blank.blob)).not.toBe(await asBase64(eray.blob));
  });

  it('renders an item the same whether it runs first or second', async () => {
    const firstNameOnly: BatchItem = { variables: { FirstName: 'Eray' } };
    const [alone] = await batchRender(
      portraitScene,
      [firstNameOnly],
      options()
    );
    const [, second] = await batchRender(
      portraitScene,
      [OLGA, firstNameOnly],
      options()
    );

    expect(await asBase64(second.blob)).toBe(await asBase64(alone.blob));
  });

  it('hands a reused engine back with the variables it came with', async () => {
    engine.variable.setString('FirstName', 'Before');

    await batchRender(portraitScene, [ERAY], options());

    expect(engine.variable.getString('FirstName')).toBe('Before');
    engine.variable.remove('FirstName');
  });

  it('renders an item with no data', async () => {
    const [result] = await batchRender(portraitScene, [{}], options());

    expect(result.blob.size).toBeGreaterThan(0);
    expect(result.sceneString.length).toBeGreaterThan(0);
  });

  // BIG-H7
  it('rejects a scene with no page, and stays usable after', async () => {
    engine.scene.create();
    const noPages = await engine.scene.saveToString();

    await expect(batchRender(noPages, [ERAY], options())).rejects.toThrow(
      'No pages found in scene'
    );
    expect(await batchRender(portraitScene, [ERAY], options())).toHaveLength(1);
  });

  // BIG-H8. Pins today's documented behaviour: further pages are dropped and
  // the result says nothing about them.
  it('exports only the first page of a two-page template', async () => {
    await reload(twoPageScene);
    expect(engine.scene.getPages()).toHaveLength(2);

    const results = await batchRender(twoPageScene, [ERAY], options());
    const [onePage] = await batchRender(portraitScene, [ERAY], options());

    expect(results).toHaveLength(1);
    expect(readPngSize(await bytes(results[0].blob))).toEqual(
      readPngSize(await bytes(onePage.blob))
    );
  });
});

describe('the engine batchRender renders with', () => {
  it('is left open when the caller supplies one', async () => {
    await batchRender(portraitScene, [ERAY], options());

    // A disposed engine could not answer this.
    expect(engine.block.findByType('page').length).toBeGreaterThan(0);
  });
});
