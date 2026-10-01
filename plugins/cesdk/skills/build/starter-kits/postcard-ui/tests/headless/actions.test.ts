import type CreativeEngine from '@cesdk/engine';
import type { Font, Typeface } from '@cesdk/engine';
import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  repoRoot,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { setupActions } from '@/imgly/config/actions';
import { BLOCK_NAMES } from '@/imgly/constants';
import { POSTCARD_TEMPLATES } from '@/imgly/postcard-catalog';

const DATA_DIR = join(
  repoRoot,
  'packages/cesdk-web-examples-data/data/starterkit-postcard-ui'
);
const TEMPLATE = join(DATA_DIR, POSTCARD_TEMPLATES.thank_you.scene.slice(1));
const TYPEFACE_SOURCE = pathToFileURL(
  join(repoRoot, 'assets/v8/ly.img.typeface/content.json')
).href;

const KIT_ASSETS_BASE_URL = `${pathToFileURL(join(repoRoot, 'apps/cesdk_web/build/assets')).href}/`;

let raw: TestEngine;
let engine: CreativeEngine;
let typefaces: Typeface[];

beforeAll(async () => {
  // `data/**` is git-LFS and fetch-excluded, so an unfetched template is a
  // pointer file rather than a missing one.
  if (
    !existsSync(TEMPLATE) ||
    readFileSync(TEMPLATE, 'utf8').startsWith('version https://git-lfs')
  ) {
    throw new Error(
      `The postcard templates are not materialised at ${DATA_DIR}. Fetch them with ` +
        `\`git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-postcard-ui/**'\`.`
    );
  }
  // The templates reference the asset library by a root-relative path, so the
  // engine needs the flat pack the browser is served, not the versioned tree.
  raw = await createTestEngine({ baseURL: KIT_ASSETS_BASE_URL });
  engine = raw as unknown as CreativeEngine;
  await engine.asset.addLocalAssetSourceFromJSONURI(TYPEFACE_SOURCE);
  const assets = await engine.asset.findAssets('ly.img.typeface', {
    page: 0,
    perPage: 999
  });
  typefaces = assets.assets
    .map((asset) => asset.payload?.typeface)
    .filter((typeface): typeface is Typeface => typeface != null);
});

afterAll(() => {
  disposeTestEngine();
});

const fontOf = (typeface: Typeface): Font =>
  typeface.fonts.find(
    (font) => font.style === 'normal' && font.weight === 'normal'
  ) ?? typeface.fonts[0];

const named = (name: string): number[] => engine.block.findByName(name);

beforeEach(async () => {
  await loadScene(raw, TEMPLATE);
  setupActions(engine);
});

describe('PC-H1 addText', () => {
  it('PC-H1 creates a centred half-width text block on the given page', async () => {
    const front = engine.scene.getPages()[0];
    const typeface = typefaces[0];

    const block = await engine.actions.run(
      'addText',
      front,
      fontOf(typeface),
      typeface
    );

    expect(engine.block.getType(block)).toBe('//ly.img.ubq/text');
    expect(engine.block.getFloat(block, 'text/fontSize')).toBe(40);
    expect(engine.block.getEnum(block, 'text/horizontalAlignment')).toBe(
      'Center'
    );
    expect(engine.block.getHeightMode(block)).toBe('Auto');
    expect(engine.block.getWidth(block)).toBeCloseTo(
      engine.block.getWidth(front) * 0.5,
      3
    );
    expect(engine.block.getParent(block)).toBe(front);
    expect(engine.block.isSelected(block)).toBe(true);
  });
});

describe('PC-H2 replaceFontOnSelection', () => {
  it('PC-H2 applies the font to every selected text block', async () => {
    const front = engine.scene.getPages()[0];
    const first = await engine.actions.run(
      'addText',
      front,
      fontOf(typefaces[0]),
      typefaces[0]
    );
    const second = await engine.actions.run(
      'addText',
      front,
      fontOf(typefaces[0]),
      typefaces[0]
    );
    engine.block.setSelected(first, true);
    engine.block.setSelected(second, true);

    const target = typefaces.find(
      (typeface) => typeface.name !== typefaces[0].name
    )!;
    engine.actions.run('replaceFontOnSelection', fontOf(target), target);

    expect(engine.block.getTypeface(first).name).toBe(target.name);
    expect(engine.block.getTypeface(second).name).toBe(target.name);
  });
});

describe('PC-H3 setColorByBlockName', () => {
  it('PC-H3 colours every block with that name and forces alpha to 1', () => {
    const accents = named(BLOCK_NAMES.accent);
    expect(accents.length).toBeGreaterThan(1);

    engine.actions.run('setColorByBlockName', BLOCK_NAMES.accent, {
      r: 0.25,
      g: 0.5,
      b: 0.75,
      a: 0.1
    });

    for (const block of accents) {
      const color = engine.block.getColor(block, 'fill/solid/color') as {
        r: number;
        g: number;
        b: number;
        a: number;
      };
      expect(color.r).toBeCloseTo(0.25, 5);
      expect(color.g).toBeCloseTo(0.5, 5);
      expect(color.b).toBeCloseTo(0.75, 5);
      expect(color.a).toBe(1);
      if (engine.block.supportsStroke(block)) {
        const stroke = engine.block.getStrokeColor(block) as { a: number };
        expect(stroke.a).toBe(1);
      }
    }
  });

  it('PC-H3 is a no-op for a name no block carries', () => {
    expect(() =>
      engine.actions.run('setColorByBlockName', 'NoSuchBlock', {
        r: 1,
        g: 0,
        b: 0,
        a: 1
      })
    ).not.toThrow();
  });
});

describe('PC-H4 setTextSizeByBlockName', () => {
  it('PC-H4 sets the font size of every block with that name', () => {
    engine.actions.run('setTextSizeByBlockName', BLOCK_NAMES.greeting, 14);
    for (const block of named(BLOCK_NAMES.greeting)) {
      expect(engine.block.getFloat(block, 'text/fontSize')).toBe(14);
    }
  });
});

describe('PC-H5 setFontByBlockName', () => {
  it('PC-H5 leaves text mode and applies the normal face', () => {
    engine.editor.setEditMode('Text');
    const target = typefaces.find((typeface) =>
      typeface.fonts.some(
        (font) => font.style === 'normal' && font.weight === 'normal'
      )
    )!;

    engine.actions.run('setFontByBlockName', BLOCK_NAMES.greeting, target);

    expect(engine.editor.getEditMode()).toBe('Transform');
    for (const block of named(BLOCK_NAMES.greeting)) {
      expect(engine.block.getTypeface(block).name).toBe(target.name);
      expect(engine.block.getTextFontWeights(block)[0]).toBe('normal');
      expect(engine.block.getTextFontStyles(block)[0]).toBe('normal');
    }
  });
});

describe('PC-H6 exportToPdf', () => {
  it('PC-H6 exports every page and restores dpi and visibility', async () => {
    const [front, back] = engine.scene.getPages();
    const scene = engine.scene.get()!;
    engine.block.setVisible(back, false);

    const blob = await engine.actions.run('exportToPdf', front);

    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(0);
    expect(engine.block.getFloat(scene, 'scene/dpi')).toBe(300);
    expect(engine.block.isVisible(front)).toBe(true);
    expect(engine.block.isVisible(back)).toBe(false);
  });

  it('PC-H6 restores dpi and visibility when the export rejects', async () => {
    const [front, back] = engine.scene.getPages();
    const scene = engine.scene.get()!;
    const blockApi = engine.block as unknown as {
      export: (...args: unknown[]) => Promise<Blob>;
    };
    const original = blockApi.export;
    blockApi.export = () => Promise.reject(new Error('render failed'));

    try {
      await expect(engine.actions.run('exportToPdf', back)).rejects.toThrow(
        'render failed'
      );
    } finally {
      blockApi.export = original;
    }

    expect(engine.block.getFloat(scene, 'scene/dpi')).toBe(300);
    expect(engine.block.isVisible(front)).toBe(false);
    expect(engine.block.isVisible(back)).toBe(true);
  });
});
