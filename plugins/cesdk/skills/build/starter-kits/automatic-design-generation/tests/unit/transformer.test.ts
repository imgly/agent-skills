import { describe, expect, it } from 'vitest';

import {
  createAssetOptions,
  createPreviewOptions,
  PREVIEW_SIZE,
  SIZES
} from '../../src/app/api/transformer';
import { DEFAULT_MESSAGE } from '../../src/app/constants';
import { DEMO_ASSETS_BASE_URL } from '../../src/imgly/demo-assets';
import { createFakeEngine, FAKE_BLOCKS, fakeFillOf } from './fake-engine';

const PAGE = 1;
const resolve = (path: string) => `test:${path}`;

describe('SIZES', () => {
  it('ships the three documented sizes in order', () => {
    expect(SIZES).toEqual([
      { label: 'Instagram Story', width: 1080, height: 1920 },
      { label: 'Instagram Post', width: 1080, height: 1080 },
      { label: 'Facebook / X Post', width: 1300, height: 740 }
    ]);
  });
});

describe('createAssetOptions', () => {
  it.each([
    [0, 'static-instagram-story-template.scene', 1080, 1920],
    [1, 'static-instagram-post-template.scene', 1080, 1080],
    [2, 'static-facebook-x-post-template.scene', 1300, 740]
  ])('ADG-U1 maps size %i to %s for an image', (index, file, width, height) => {
    const options = createAssetOptions(
      index as number,
      'image',
      null,
      '#9933FF',
      DEFAULT_MESSAGE,
      resolve
    );

    expect(options.templateUrl).toBe(`test:/${file}`);
    expect(options.width).toBe(width);
    expect(options.height).toBe(height);
    expect(options.id).toBe(index);
    expect(options.label).toBe(SIZES[index as number].label);
    expect(options.outputType).toBe('image');
    expect(options.saveSceneString).toBe(true);
  });

  it.each([
    [0, 'video-instagram-story-template.scene'],
    [1, 'video-instagram-post-template.scene'],
    [2, 'video-facebook-x-post-template.scene']
  ])('ADG-U1 maps size %i to %s for a video', (index, file) => {
    const options = createAssetOptions(
      index as number,
      'video',
      null,
      '#9933FF',
      DEFAULT_MESSAGE,
      resolve
    );

    expect(options.templateUrl).toBe(`test:/${file}`);
    expect(options.outputType).toBe('video');
  });
});

describe('createPreviewOptions', () => {
  it('resolves the template against the demo assets base by default', () => {
    const options = createPreviewOptions(
      'image',
      null,
      '#9933FF',
      DEFAULT_MESSAGE
    );

    expect(options.templateUrl.startsWith(`${DEMO_ASSETS_BASE_URL}/`)).toBe(
      true
    );
  });

  it('ADG-U1 always previews with the Instagram Post template', () => {
    const options = createPreviewOptions(
      'image',
      null,
      '#9933FF',
      DEFAULT_MESSAGE,
      resolve
    );

    expect(options).toMatchObject({
      templateUrl: 'test:/static-instagram-post-template.scene',
      id: -1,
      label: 'Preview',
      width: PREVIEW_SIZE,
      height: PREVIEW_SIZE,
      zoomToPage: true,
      saveSceneString: false
    });
    expect(PREVIEW_SIZE).toBe(800);
  });

  it('ADG-U1 previews the video template for a video', () => {
    expect(
      createPreviewOptions('video', null, '#9933FF', DEFAULT_MESSAGE, resolve)
        .templateUrl
    ).toBe('test:/video-instagram-post-template.scene');
  });
});

// ADG-U2 — colour conversion and the theme rule, reached through the fill.
function runFill(backgroundColor: string, message = DEFAULT_MESSAGE) {
  const fake = createFakeEngine();
  createAssetOptions(0, 'image', null, backgroundColor, message, resolve).fill(
    fake.engine,
    PAGE
  );
  return fake;
}

function backgroundOf(backgroundColor: string) {
  const [block, property, rgba] =
    runFill(backgroundColor).lastArgsOf('block.setColor')!;
  expect(block).toBe(PAGE);
  expect(property).toBe('fill/solid/color');
  return rgba as { r: number; g: number; b: number; a: number };
}

describe('the background colour', () => {
  it.each(['#9933FF', '9933FF'])(
    'ADG-U2 converts %s to 0-to-1 channels',
    (hex) => {
      expect(backgroundOf(hex)).toEqual({
        r: 0x99 / 255,
        g: 0x33 / 255,
        b: 0xff / 255,
        a: 1
      });
    }
  );

  it('ADG-U2 expands the three-digit short form', () => {
    expect(backgroundOf('#93F')).toEqual(backgroundOf('#9933FF'));
  });
});

describe('the theme', () => {
  const badgeOf = (hex: string) =>
    runFill(hex)
      .callsTo('block.setString')
      .find(({ args }) => args[0] === fakeFillOf(FAKE_BLOCKS.PodcastBadge[0]))!
      .args[2];

  const textColorsOf = (hex: string) =>
    runFill(hex)
      .callsTo('block.setTextColor')
      .map(({ args }) => args[1]);

  it.each([
    ['#FFFFFF', 'black'],
    // 0.3813 luminance, just above the 0.38 threshold.
    ['#A6A6A6', 'black']
  ])('ADG-U2 gives %s the light theme', (hex, badge) => {
    expect(badgeOf(hex)).toBe(`test:/podcast-badge-${badge}.png`);
    expect(textColorsOf(hex)).toEqual([
      { r: 0, g: 0, b: 0, a: 0.75 },
      { r: 0, g: 0, b: 0, a: 1 }
    ]);
  });

  it.each([
    ['#000000', 'white'],
    // 0.3763 luminance, just below the threshold — the boundary is exclusive.
    ['#A5A5A5', 'white'],
    ['#9933FF', 'white']
  ])('ADG-U2 gives %s the dark theme', (hex, badge) => {
    expect(badgeOf(hex)).toBe(`test:/podcast-badge-${badge}.png`);
    expect(textColorsOf(hex)).toEqual([
      { r: 1, g: 1, b: 1, a: 0.75 },
      { r: 1, g: 1, b: 1, a: 1 }
    ]);
  });
});

describe('the fill', () => {
  const podcast = {
    artistName: 'Team Coco',
    artworkUrl600: 'https://example.test/artwork.jpg',
    collectionId: 1438054347,
    collectionName: 'Conan O’Brien Needs A Friend',
    collectionViewUrl: 'https://example.test/podcast'
  };

  it('ADG-U2 writes the artwork into every PodcastCover block', () => {
    const fake = createFakeEngine();
    createAssetOptions(
      0,
      'image',
      podcast,
      '#9933FF',
      DEFAULT_MESSAGE,
      resolve
    ).fill(fake.engine, PAGE);

    const covers = fake
      .callsTo('block.setString')
      .filter(({ args }) =>
        FAKE_BLOCKS.PodcastCover.map(fakeFillOf).includes(args[0] as number)
      );

    expect(covers).toHaveLength(FAKE_BLOCKS.PodcastCover.length);
    for (const { args } of covers) {
      expect(args[1]).toBe('fill/image/imageFileURI');
      expect(args[2]).toBe(podcast.artworkUrl600);
    }
  });

  it('ADG-U2 sets the two text variables', () => {
    const fake = createFakeEngine();
    createAssetOptions(
      0,
      'image',
      podcast,
      '#9933FF',
      'Fresh episode',
      resolve
    ).fill(fake.engine, PAGE);

    expect(fake.callsTo('variable.setString').map(({ args }) => args)).toEqual([
      ['Message', 'Fresh episode'],
      ['PodcastName', podcast.collectionName]
    ]);
  });

  it('ADG-U2 leaves PodcastName empty with no podcast selected', () => {
    expect(runFill('#9933FF').lastArgsOf('variable.setString')).toEqual([
      'PodcastName',
      ''
    ]);
  });

  it.each(['', undefined as unknown as string])(
    'ADG-U2 falls back to the default message for %o',
    (message) => {
      expect(
        runFill('#9933FF', message).callsTo('variable.setString')[0].args
      ).toEqual(['Message', DEFAULT_MESSAGE]);
    }
  );
});
