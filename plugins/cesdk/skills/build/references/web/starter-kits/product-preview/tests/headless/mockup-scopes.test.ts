import {
  createTestEngine,
  disposeTestEngine
} from '@imgly/kit-test-harness/node';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { PRODUCTS } from '../../src/constants';
import { initProductPreviewSceneEditor } from '../../src/imgly';

// The bare `window` the kit's editor imports need makes the engine take its
// browser path, where it reads a `window.location` this process has not got.
delete (globalThis as { window?: unknown }).window;

interface Engine {
  scene: {
    loadFromString(scene: string): Promise<number>;
    getPages(): number[];
  };
  block: {
    getChildren(id: number): number[];
    getName(id: number): string;
    isAllowedByScope(id: number, scope: string): boolean;
  };
  editor: { getRole(): string };
}

afterAll(() => {
  disposeTestEngine();
});

describe('PP-H8 the mockup editor lets users select and move the mockup blocks', () => {
  it.each(Object.values(PRODUCTS).map((product) => product.mockupScenePath))(
    'every block on the page of %s',
    async (mockupScenePath) => {
      const engine = (await createTestEngine()) as unknown as Engine;
      // The kit's own mockup editor setup, over a real engine; the plugins it
      // installs only register UI and asset sources.
      await initProductPreviewSceneEditor({
        addPlugin: async () => undefined,
        ui: { setTheme: () => undefined },
        engine
      } as unknown as CreativeEditorSDK);
      await engine.scene.loadFromString(
        await readFile(
          fileURLToPath(
            new URL(`../../public/${mockupScenePath}`, import.meta.url)
          ),
          'utf8'
        )
      );

      const [page] = engine.scene.getPages();
      const blocks = engine.block.getChildren(page);

      expect(engine.editor.getRole()).toBe('Adopter');
      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks) {
        const name = engine.block.getName(block);
        expect({
          name,
          select: engine.block.isAllowedByScope(block, 'editor/select'),
          move: engine.block.isAllowedByScope(block, 'layer/move')
        }).toEqual({ name, select: true, move: true });
      }
    }
  );
});
