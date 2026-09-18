import {
  cesdkTestLicense,
  createTestEngine,
  disposeTestEngine,
  resolveNodeEngineEntry
} from '@imgly/kit-test-harness/node';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

import {
  CLEAR_IMAGE,
  disposeMockupRenderer,
  renderMockup
} from '../../src/imgly/mockup';

// The bare `window` the kit's editor imports need makes the engine take its
// browser path, where it reads a `window.location` this process has not got.
delete (globalThis as { window?: unknown }).window;

function publicFile(name: string): string {
  return pathToFileURL(
    fileURLToPath(new URL(`../../public/${name}`, import.meta.url))
  ).href;
}

const MOCKUP_SCENE = publicFile('postcard-mockup.scene');
const FIXTURE = publicFile('1x1-ffffffff.png');

// `renderMockup` forwards only `baseURL`, and the engine resolves its wasm
// core against it, so this points at the Node engine's own asset directory.
const config = {
  license: process.env.CESDK_LICENSE || cesdkTestLicense,
  baseURL: `${
    pathToFileURL(join(dirname(resolveNodeEngineEntry()), 'assets')).href
  }/`
};

interface InspectEngine {
  scene: { loadFromString(scene: string): Promise<number> };
  block: {
    findByName(name: string): number[];
    getFill(block: number): number;
    getString(block: number, property: string): string;
    isFillEnabled(block: number): boolean;
  };
}

/** The `imageFileURI` of every block the given scene names `Image N`. */
async function placeholderUris(
  sceneString: string,
  names: string[]
): Promise<Record<string, string[]>> {
  const engine = (await createTestEngine()) as unknown as InspectEngine;
  await engine.scene.loadFromString(sceneString);
  const uris: Record<string, string[]> = {};
  names.forEach((name) => {
    uris[name] = engine.block
      .findByName(name)
      .map((block) =>
        engine.block.getString(
          engine.block.getFill(block),
          'fill/image/imageFileURI'
        )
      );
  });
  return uris;
}

/** Whether every block the given scene names `name` still has its fill on. */
async function fillEnabled(
  sceneString: string,
  name: string
): Promise<boolean[]> {
  const engine = (await createTestEngine()) as unknown as InspectEngine;
  await engine.scene.loadFromString(sceneString);
  return engine.block
    .findByName(name)
    .map((block) => engine.block.isFillEnabled(block));
}

afterAll(() => {
  disposeMockupRenderer();
  disposeTestEngine();
});

describe('PP-H1 named placeholders are replaced', () => {
  it('writes the source into every matching block', async () => {
    const result = await renderMockup(config, MOCKUP_SCENE, {
      'Image 1': FIXTURE
    });

    expect(result.sceneString.length).toBeGreaterThan(0);
    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
    expect(result.blobUrls).toContain(result.mockupUrl);

    const uris = await placeholderUris(result.sceneString, [
      'Image 1',
      'Image 2'
    ]);
    expect(uris['Image 1']).toEqual([FIXTURE]);
    expect(uris['Image 2'][0]).not.toBe(FIXTURE);
  });

  it('exports a JPEG the browser can show', async () => {
    const result = await renderMockup(config, MOCKUP_SCENE, {
      'Image 1': FIXTURE
    });

    const blob = await fetch(result.mockupUrl).then((response) =>
      response.blob()
    );
    expect(blob.type).toBe('image/jpeg');
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('PP-H2 clearing a slot', () => {
  it('is a no-op for a name the mockup scene does not carry', async () => {
    const placeholders: Record<string, string> = { 'Image 1': FIXTURE };
    for (let i = 3; i <= 10; i++) {
      placeholders[`Image ${i}`] = CLEAR_IMAGE;
    }

    const result = await renderMockup(config, MOCKUP_SCENE, placeholders);

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
  });

  it('switches the fill off when it reaches a real slot', async () => {
    const result = await renderMockup(config, MOCKUP_SCENE, {
      'Image 2': CLEAR_IMAGE
    });

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
    expect(await fillEnabled(result.sceneString, 'Image 2')).toEqual([false]);
  });
});

describe('PP-H3 a name with no match is a no-op', () => {
  it('still exports', async () => {
    const result = await renderMockup(config, MOCKUP_SCENE, {
      'Image 99': FIXTURE
    });

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
  });
});

describe('PP-H4 the returned scene string round-trips', () => {
  it('starts the second render from the first result', async () => {
    const first = await renderMockup(config, MOCKUP_SCENE, {
      'Image 1': FIXTURE
    });

    const second = await renderMockup(
      config,
      { sceneString: first.sceneString },
      { 'Image 2': FIXTURE }
    );

    const uris = await placeholderUris(second.sceneString, [
      'Image 1',
      'Image 2'
    ]);
    expect(uris['Image 1']).toEqual([FIXTURE]);
    expect(uris['Image 2']).toEqual([FIXTURE]);
  });

  it('supplies a slot a previous render cleared', async () => {
    const cleared = await renderMockup(config, MOCKUP_SCENE, {
      'Image 2': CLEAR_IMAGE
    });

    const supplied = await renderMockup(
      config,
      { sceneString: cleared.sceneString },
      { 'Image 2': FIXTURE }
    );

    expect(await fillEnabled(supplied.sceneString, 'Image 2')).toEqual([true]);
    const uris = await placeholderUris(supplied.sceneString, ['Image 2']);
    expect(uris['Image 2']).toEqual([FIXTURE]);
  });
});

describe('PP-H5 export mime type', () => {
  it('defaults to JPEG and honours an explicit PNG', async () => {
    const jpeg = await renderMockup(config, MOCKUP_SCENE, {
      'Image 1': FIXTURE
    });
    const png = await renderMockup(
      config,
      MOCKUP_SCENE,
      { 'Image 1': FIXTURE },
      { exportMimeType: 'image/png' }
    );

    const types = await Promise.all(
      [jpeg, png].map((result) =>
        fetch(result.mockupUrl)
          .then((response) => response.blob())
          .then((blob) => blob.type)
      )
    );
    expect(types).toEqual(['image/jpeg', 'image/png']);
  });
});

describe('PP-H6 engine reuse and disposal', () => {
  it('reuses one engine and recreates it after a dispose', async () => {
    await renderMockup(config, MOCKUP_SCENE, { 'Image 1': FIXTURE });
    await renderMockup(config, MOCKUP_SCENE, { 'Image 1': FIXTURE });

    disposeMockupRenderer();

    const afterDispose = await renderMockup(config, MOCKUP_SCENE, {
      'Image 1': FIXTURE
    });
    expect(afterDispose.mockupUrl.startsWith('blob:')).toBe(true);
  });

  it('ignores a config handed to a later call (test plan issue 1)', async () => {
    await renderMockup(config, MOCKUP_SCENE, { 'Image 1': FIXTURE });

    // A licence and baseURL that could never work still render, because the
    // cached engine was built from the first config.
    const result = await renderMockup(
      { license: 'not-a-licence', baseURL: 'https://example.invalid/' },
      MOCKUP_SCENE,
      { 'Image 1': FIXTURE }
    );

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
  });
});

describe('PP-H7 a scene that does not load', () => {
  it('rejects instead of exporting an empty blob', async () => {
    await expect(
      renderMockup(config, { sceneString: '' }, { 'Image 1': FIXTURE })
    ).rejects.toThrow();
  });
});

describe('PP-H6 a placeholder handed over as a Blob', () => {
  it('is written to the slot as an object URL that the result hands back', async () => {
    const bytes = await readFile(
      fileURLToPath(new URL('../../public/1x1-ffffffff.png', import.meta.url))
    );
    const blob = new Blob([bytes], { type: 'image/png' });

    const result = await renderMockup(config, MOCKUP_SCENE, {
      'Image 1': blob
    });

    const written = result.blobUrls.filter((url) => url.startsWith('blob:'));
    expect(written.length).toBeGreaterThan(1);

    const uris = await placeholderUris(result.sceneString, ['Image 1']);
    expect(uris['Image 1']).toEqual([written[0]]);
  });
});
