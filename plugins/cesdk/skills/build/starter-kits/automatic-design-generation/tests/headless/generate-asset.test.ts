import {
  createTestEngine,
  disposeTestEngine,
  readPngSize
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createAssetOptions,
  createPreviewOptions,
  type Podcast
} from '../../src/app/api/transformer';
import { DEFAULT_MESSAGE } from '../../src/app/constants';
// The kit's `src/imgly` barrel also exports the editor configuration, which
// pulls in browser-only plugins, so the engine module is imported directly.
import { generateAsset } from '../../src/imgly/generation';

/** The kit's own `public/` assets, addressed the way a Node caller would. */
const resolve = (path: string) =>
  pathToFileURL(new URL(`../../public${path}`, import.meta.url).pathname).href;

const IMAGE_TEMPLATE = resolve('/static-instagram-post-template.scene');

const PODCAST: Podcast = {
  artistName: 'Team Coco',
  // A real local file, so the export resolves the fill instead of hanging.
  artworkUrl600: resolve('/placeholder-search-result.png'),
  collectionId: 1438054347,
  collectionName: 'Conan O’Brien Needs A Friend',
  collectionViewUrl: 'https://example.test/podcast'
};

let engine: CreativeEngine;

async function pngOf(src: string | null): Promise<Uint8Array> {
  expect(src).not.toBeNull();
  const response = await fetch(src as string);
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Record the options the kit passes to `engine.block.export`. The kit owns
 * which options it sends; the engine owns what they produce.
 */
async function exportOptionsOf(
  run: () => Promise<unknown>
): Promise<Record<string, unknown>[]> {
  const options: Record<string, unknown>[] = [];
  // Reached through an index type so the spy does not name the deprecated
  // two-argument overload the kit does not use.
  const block = engine.block as unknown as Record<
    string,
    (...args: unknown[]) => unknown
  >;
  const original = block.export;
  block.export = function spied(this: unknown, ...args: unknown[]) {
    options.push({ ...(args[1] as Record<string, unknown>) });
    return original.apply(this, args);
  };
  try {
    await run();
  } finally {
    block.export = original;
  }
  return options;
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

describe('generateAsset', () => {
  it('ADG-H1 produces a PNG asset and passes the size on to the export', async () => {
    let asset!: Awaited<ReturnType<typeof generateAsset>>;
    const options = await exportOptionsOf(async () => {
      asset = await generateAsset(engine, {
        templateUrl: IMAGE_TEMPLATE,
        fill: () => {},
        outputType: 'image',
        width: 320,
        height: 200,
        id: 7,
        label: 'Instagram Post'
      });
    });

    expect(options).toEqual([
      { mimeType: 'image/png', targetWidth: 320, targetHeight: 200 }
    ]);
    expect(asset).toMatchObject({
      id: 7,
      label: 'Instagram Post',
      isLoading: false,
      width: 320,
      height: 200,
      type: 'image'
    });
    expect((await pngOf(asset.src)).length).toBeGreaterThan(0);
    expect(
      await engine.scene.loadFromString(asset.sceneString as string)
    ).toBeGreaterThan(0);
  });

  it('ADG-H1 renders the Instagram Story preset at its full size', async () => {
    const asset = await generateAsset(
      engine,
      createAssetOptions(0, 'image', null, '#9933FF', DEFAULT_MESSAGE, resolve)
    );

    expect(readPngSize(await pngOf(asset.src))).toEqual({
      width: 1080,
      height: 1920
    });
  });

  it('ADG-H2 runs the fill against the loaded page before exporting', async () => {
    const seen: { engine: unknown; page: number }[] = [];

    const asset = await generateAsset(engine, {
      templateUrl: IMAGE_TEMPLATE,
      fill: (filled, page) => {
        seen.push({ engine: filled, page });
        filled.block.setColor(page, 'fill/solid/color', {
          r: 1,
          g: 0,
          b: 0,
          a: 1
        });
      },
      outputType: 'image',
      width: 64,
      height: 64
    });

    expect(seen).toHaveLength(1);
    expect(seen[0].engine).toBe(engine);
    expect(seen[0].page).toBe(engine.block.findByKind('page')[0]);

    // The colour the fill set survived into the exported scene.
    await engine.scene.loadFromString(asset.sceneString as string);
    const [page] = engine.block.findByKind('page');
    expect(engine.block.getColor(page, 'fill/solid/color')).toEqual({
      r: 1,
      g: 0,
      b: 0,
      a: 1
    });
  });

  it('ADG-H3 skips the scene string when saveSceneString is false', async () => {
    const asset = await generateAsset(engine, {
      templateUrl: IMAGE_TEMPLATE,
      fill: () => {},
      outputType: 'image',
      width: 64,
      height: 64,
      saveSceneString: false
    });

    expect(asset.sceneString).toBeNull();
    expect(asset.src).not.toBeNull();
  });

  it('ADG-H3 exports the same image whether or not it zooms to the page', async () => {
    const options = {
      templateUrl: IMAGE_TEMPLATE,
      fill: () => {},
      width: 128,
      height: 128
    };
    const zoomed = await generateAsset(engine, {
      ...options,
      outputType: 'image',
      zoomToPage: true
    });
    const plain = await generateAsset(engine, {
      ...options,
      outputType: 'image'
    });

    expect(readPngSize(await pngOf(zoomed.src))).toEqual({
      width: 128,
      height: 128
    });
    expect(readPngSize(await pngOf(plain.src))).toEqual(
      readPngSize(await pngOf(zoomed.src))
    );
  });

  it('ADG-H7 carries the variables the fill set, so an editor can restore them', async () => {
    const asset = await generateAsset(engine, {
      templateUrl: IMAGE_TEMPLATE,
      fill: (filled) => {
        filled.variable.setString('Message', 'Hello');
        filled.variable.setString('PodcastName', 'Some Podcast');
      },
      outputType: 'image',
      width: 64,
      height: 64
    });

    // The engine seeds its own defaults, so the snapshot is a superset.
    expect(asset.variables).toMatchObject({
      Message: 'Hello',
      PodcastName: 'Some Podcast'
    });
    // The scene string is why they have to be carried separately.
    expect(asset.sceneString).not.toContain('Some Podcast');
  });

  it('ADG-H8 asks for an MP4 with a bounded bitrate when the output is video', async () => {
    // The encode itself is the engine's; intercepting it keeps the case to
    // what the kit decides, and off a minute-long export.
    const block = engine.block as unknown as Record<
      string,
      (...args: unknown[]) => unknown
    >;
    const original = block.exportVideo;
    const options: Record<string, unknown>[] = [];
    block.exportVideo = async (...args: unknown[]) => {
      options.push({ ...(args[1] as Record<string, unknown>) });
      return new Blob([new Uint8Array([0, 0, 0, 1])], { type: 'video/mp4' });
    };

    try {
      const asset = await generateAsset(engine, {
        templateUrl: IMAGE_TEMPLATE,
        fill: () => {},
        outputType: 'video',
        width: 320,
        height: 200,
        id: 9,
        label: 'Instagram Reel'
      });

      expect(options).toEqual([
        {
          mimeType: 'video/mp4',
          videoBitrate: 'Auto',
          targetWidth: 320,
          targetHeight: 200
        }
      ]);
      expect(asset).toMatchObject({ type: 'video', id: 9 });
      expect(asset.src).toMatch(/^blob:/);
    } finally {
      block.exportVideo = original;
    }
  });

  it('ADG-H6 rejects a template that does not exist', async () => {
    await expect(
      generateAsset(engine, {
        templateUrl: resolve('/does-not-exist.scene'),
        fill: () => {},
        outputType: 'image',
        width: 64,
        height: 64
      })
    ).rejects.toThrow();

    // The engine is not left half-loaded: the next generation still works.
    const asset = await generateAsset(engine, {
      templateUrl: IMAGE_TEMPLATE,
      fill: () => {},
      outputType: 'image',
      width: 64,
      height: 64
    });
    expect(asset.src).not.toBeNull();
  });
});

describe('the podcast fill', () => {
  async function generateWith(
    backgroundColor: string,
    message = DEFAULT_MESSAGE
  ) {
    return generateAsset(
      engine,
      createAssetOptions(1, 'image', PODCAST, backgroundColor, message, resolve)
    );
  }

  it('ADG-H4 writes the background, artwork, variables and text colours', async () => {
    const asset = await generateWith('#9933FF');
    await engine.scene.loadFromString(asset.sceneString as string);

    const [page] = engine.block.findByKind('page');
    // The engine stores colour channels as float32, so compare to that precision.
    const background = engine.block.getColor(page, 'fill/solid/color') as {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    expect(background.r).toBeCloseTo(0x99 / 255, 6);
    expect(background.g).toBeCloseTo(0x33 / 255, 6);
    expect(background.b).toBeCloseTo(0xff / 255, 6);
    expect(background.a).toBe(1);

    for (const cover of engine.block.findByName('PodcastCover')) {
      expect(
        engine.block.getString(
          engine.block.getFill(cover),
          'fill/image/imageFileURI'
        )
      ).toBe(PODCAST.artworkUrl600);
    }

    expect(engine.variable.getString('Message')).toBe(DEFAULT_MESSAGE);
    expect(engine.variable.getString('PodcastName')).toBe(
      PODCAST.collectionName
    );

    const [text] = engine.block.findByName('Message & Name');
    expect(engine.block.getTextColors(text)).toEqual([
      { r: 1, g: 1, b: 1, a: 0.75 },
      { r: 1, g: 1, b: 1, a: 1 }
    ]);
  });

  it.each([
    ['#9933FF', 'white'],
    ['#FFD333', 'black']
  ])(
    'ADG-H4 picks the %s badge for a %s background',
    async (backgroundColor, badge) => {
      const asset = await generateWith(backgroundColor);
      await engine.scene.loadFromString(asset.sceneString as string);

      const [badgeBlock] = engine.block.findByName('PodcastBadge');
      expect(
        engine.block.getString(
          engine.block.getFill(badgeBlock),
          'fill/image/imageFileURI'
        )
      ).toBe(resolve(`/podcast-badge-${badge}.png`));
    }
  );

  it('ADG-H5 falls back to the default message when the field is cleared', async () => {
    const asset = await generateWith('#9933FF', '');
    await engine.scene.loadFromString(asset.sceneString as string);

    expect(engine.variable.getString('Message')).toBe(DEFAULT_MESSAGE);
  });

  it('ADG-H4 keeps a message the user typed', async () => {
    const asset = await generateWith('#9933FF', 'Fresh episode out now');
    await engine.scene.loadFromString(asset.sceneString as string);

    expect(engine.variable.getString('Message')).toBe('Fresh episode out now');
  });

  it('ADG-H4 previews the Instagram Post template at the preview size', async () => {
    const asset = await generateAsset(
      engine,
      createPreviewOptions(
        'image',
        PODCAST,
        '#9933FF',
        DEFAULT_MESSAGE,
        resolve
      )
    );

    expect(asset).toMatchObject({
      id: -1,
      label: 'Preview',
      sceneString: null
    });
    expect(readPngSize(await pngOf(asset.src))).toEqual({
      width: 800,
      height: 800
    });
  });
});
