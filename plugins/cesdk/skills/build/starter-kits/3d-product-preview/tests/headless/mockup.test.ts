import {
  cesdkTestLicense,
  createTestEngine,
  disposeTestEngine,
  repoRoot,
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

/** The kit ships no `public/`, so its assets live in the examples-data package. */
const DEMO_ASSETS = pathToFileURL(
  join(
    repoRoot,
    'packages',
    'cesdk-web-examples-data',
    'data',
    'starterkit-3d-product-preview'
  )
).href;

const TEXTURE_SCENE = `${DEMO_ASSETS}/t-shirt/textures/Material_baseColor.scene`;
const FIXTURE = `${DEMO_ASSETS}/1x1-ffffffff.png`;

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
    getCropScaleX(block: number): number;
    getCropTranslationX(block: number): number;
    isFillEnabled(block: number): boolean;
  };
}

async function inspect(sceneString: string): Promise<InspectEngine> {
  const engine = (await createTestEngine()) as unknown as InspectEngine;
  await engine.scene.loadFromString(sceneString);
  return engine;
}

afterAll(() => {
  disposeMockupRenderer();
  disposeTestEngine();
});

describe('P3D-H1 named placeholders are replaced and their crop is reset', () => {
  it('writes the source and leaves an identity crop behind', async () => {
    const result = await renderMockup(config, TEXTURE_SCENE, {
      'Image 1': FIXTURE
    });

    expect(result.sceneString.length).toBeGreaterThan(0);
    expect(result.mockupUrl.startsWith('blob:')).toBe(true);

    const engine = await inspect(result.sceneString);
    const blocks = engine.block.findByName('Image 1');
    expect(blocks.length).toBeGreaterThan(0);
    blocks.forEach((block) => {
      expect(
        engine.block.getString(
          engine.block.getFill(block),
          'fill/image/imageFileURI'
        )
      ).toBe(FIXTURE);
      // This copy of `renderMockup` calls `resetCrop`; the product-preview one
      // does not.
      expect(engine.block.getCropTranslationX(block)).toBeCloseTo(0, 5);
    });
  });
});

describe('P3D-H2 the export defaults to PNG', () => {
  it('answers with PNG by default and JPEG when asked', async () => {
    const png = await renderMockup(config, TEXTURE_SCENE, {
      'Image 1': FIXTURE
    });
    const jpeg = await renderMockup(
      config,
      TEXTURE_SCENE,
      { 'Image 1': FIXTURE },
      { exportMimeType: 'image/jpeg' }
    );

    const types = await Promise.all(
      [png, jpeg].map((result) =>
        fetch(result.mockupUrl)
          .then((response) => response.blob())
          .then((blob) => blob.type)
      )
    );
    // PNG matters because the blob becomes a glTF base-colour texture.
    expect(types).toEqual(['image/png', 'image/jpeg']);
  });
});

describe('P3D-H3 clearing a slot', () => {
  it('is a no-op for a name the texture scene does not carry', async () => {
    const placeholders: Record<string, string> = { 'Image 1': FIXTURE };
    for (let i = 2; i <= 10; i++) {
      placeholders[`Image ${i}`] = CLEAR_IMAGE;
    }

    const result = await renderMockup(config, TEXTURE_SCENE, placeholders);

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
  });

  it('switches the fill off when it reaches a real slot', async () => {
    const result = await renderMockup(config, TEXTURE_SCENE, {
      'Image 1': CLEAR_IMAGE
    });

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
    const engine = await inspect(result.sceneString);
    const blocks = engine.block.findByName('Image 1');
    expect(blocks.length).toBeGreaterThan(0);
    blocks.forEach((block) =>
      expect(engine.block.isFillEnabled(block)).toBe(false)
    );
  });
});

describe('P3D-H4 a name with no match is a no-op', () => {
  it('still exports', async () => {
    const result = await renderMockup(config, TEXTURE_SCENE, {
      'Image 99': FIXTURE
    });

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
  });
});

describe('P3D-H5 the returned scene string round-trips', () => {
  it('starts the second render from the first result', async () => {
    const first = await renderMockup(config, TEXTURE_SCENE, {
      'Image 1': FIXTURE
    });

    const second = await renderMockup(
      config,
      { sceneString: first.sceneString },
      {}
    );

    const engine = await inspect(second.sceneString);
    engine.block.findByName('Image 1').forEach((block) => {
      expect(
        engine.block.getString(
          engine.block.getFill(block),
          'fill/image/imageFileURI'
        )
      ).toBe(FIXTURE);
    });
  });

  it('supplies a slot a previous render cleared', async () => {
    const cleared = await renderMockup(config, TEXTURE_SCENE, {
      'Image 1': CLEAR_IMAGE
    });

    const supplied = await renderMockup(
      config,
      { sceneString: cleared.sceneString },
      { 'Image 1': FIXTURE }
    );

    const engine = await inspect(supplied.sceneString);
    const blocks = engine.block.findByName('Image 1');
    expect(blocks.length).toBeGreaterThan(0);
    blocks.forEach((block) => {
      expect(engine.block.isFillEnabled(block)).toBe(true);
      expect(
        engine.block.getString(
          engine.block.getFill(block),
          'fill/image/imageFileURI'
        )
      ).toBe(FIXTURE);
    });
  });
});

describe('P3D-H6 engine reuse and disposal', () => {
  it('reuses one engine and recreates it after a dispose', async () => {
    await renderMockup(config, TEXTURE_SCENE, { 'Image 1': FIXTURE });
    await renderMockup(config, TEXTURE_SCENE, { 'Image 1': FIXTURE });

    disposeMockupRenderer();

    const afterDispose = await renderMockup(config, TEXTURE_SCENE, {
      'Image 1': FIXTURE
    });
    expect(afterDispose.mockupUrl.startsWith('blob:')).toBe(true);
  });

  it('ignores a config handed to a later call (test plan issue 1)', async () => {
    await renderMockup(config, TEXTURE_SCENE, { 'Image 1': FIXTURE });

    const result = await renderMockup(
      { license: 'not-a-licence', baseURL: 'https://example.invalid/' },
      TEXTURE_SCENE,
      { 'Image 1': FIXTURE }
    );

    expect(result.mockupUrl.startsWith('blob:')).toBe(true);
  });
});

describe('P3D-H7 a scene that does not load', () => {
  it('rejects instead of exporting an empty blob', async () => {
    await expect(
      renderMockup(config, { sceneString: '' }, { 'Image 1': FIXTURE })
    ).rejects.toThrow();
  });
});

describe('P3D-H6 a placeholder handed over as a Blob', () => {
  it('is written to the slot as an object URL that the result hands back', async () => {
    const bytes = await readFile(fileURLToPath(FIXTURE));
    const blob = new Blob([bytes], { type: 'image/png' });

    const result = await renderMockup(config, TEXTURE_SCENE, {
      'Image 1': blob
    });

    const written = result.blobUrls.filter((url) => url.startsWith('blob:'));
    expect(written.length).toBeGreaterThan(1);

    const engine = await inspect(result.sceneString);
    const [block] = engine.block.findByName('Image 1');
    expect(
      engine.block.getString(
        engine.block.getFill(block),
        'fill/image/imageFileURI'
      )
    ).toBe(written[0]);
  });
});
