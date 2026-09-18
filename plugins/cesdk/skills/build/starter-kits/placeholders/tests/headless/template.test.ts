import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const SCENE = fileURLToPath(
  new URL('../../public/example.scene', import.meta.url)
);

const IMAGE_BLOCKS = ['Image 1', 'Image 2', 'Image 3'];

/** The scopes the Creator and Adopter roles differ on. */
const SCOPES = [
  'layer/move',
  'layer/resize',
  'layer/rotate',
  'fill/change',
  'lifecycle/duplicate',
  'lifecycle/destroy',
  'editor/select'
] as const;

let engine: CreativeEngine;

function page(): number {
  return engine.scene.getPages()[0];
}

function byName(name: string): number {
  const found = engine.block
    .getChildren(page())
    .find((id) => engine.block.getName(id) === name);
  if (found == null) {
    throw new Error(`The template has no block named ${name}.`);
  }
  return found;
}

function allowedScopes(block: number): string[] {
  return SCOPES.filter((scope) => engine.block.isAllowedByScope(block, scope));
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

beforeEach(async () => {
  await loadScene(engine as unknown as TestEngine, SCENE);
  engine.editor.setRole('Creator');
});

describe('PH-H1 the shipped template', () => {
  it('has one page named Background holding the three images, a shape and a text', () => {
    expect(engine.scene.getPages()).toHaveLength(1);
    expect(engine.block.getName(page())).toBe('Background');

    const children = engine.block.getChildren(page());
    expect(children.map((id) => engine.block.getName(id))).toEqual([
      'Image 1',
      '',
      '',
      'Image 2',
      'Image 3'
    ]);
    expect(children.map((id) => engine.block.getKind(id))).toEqual([
      'image',
      'shape',
      'text',
      'image',
      'image'
    ]);
  });
});

describe('PH-H2 the placeholder configuration (Qase 4685)', () => {
  it('marks every block on the page, the page included', () => {
    expect(engine.block.isPlaceholderEnabled(page())).toBe(true);
    for (const id of engine.block.getChildren(page())) {
      expect(engine.block.isPlaceholderEnabled(id)).toBe(true);
    }
  });
});

describe('PH-H3 the two roles on the shipped template (Qase 4684, 4685)', () => {
  it('lets the Adopter select a placeholder but not a plain block', () => {
    const placeholder = byName('Image 1');
    const plain = byName('Image 2');
    engine.block.setPlaceholderEnabled(plain, false);

    const creatorScopes = allowedScopes(placeholder);
    expect(allowedScopes(plain)).toEqual(creatorScopes);
    expect(creatorScopes).toContain('layer/move');

    engine.editor.setRole('Adopter');

    expect(allowedScopes(placeholder)).toEqual([
      'fill/change',
      'editor/select'
    ]);
    expect(allowedScopes(plain)).toEqual(['fill/change']);
  });
});

describe('PH-H4 the snapshot the role switch uses', () => {
  it('keeps the placeholder flags through save and load', async () => {
    const saved = await engine.scene.saveToString();
    await engine.scene.loadFromString(saved);

    for (const name of IMAGE_BLOCKS) {
      expect(engine.block.isPlaceholderEnabled(byName(name))).toBe(true);
    }
  });

  it('PH-H5 carries a changed flag through the round-trip (Qase 4686)', async () => {
    engine.block.setPlaceholderEnabled(byName('Image 1'), false);

    const saved = await engine.scene.saveToString();
    await engine.scene.loadFromString(saved);

    expect(engine.block.isPlaceholderEnabled(byName('Image 1'))).toBe(false);
    expect(engine.block.isPlaceholderEnabled(byName('Image 2'))).toBe(true);
    expect(engine.block.isPlaceholderEnabled(byName('Image 3'))).toBe(true);
  });
});
