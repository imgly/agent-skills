import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';

/** How long a background-removal run may take, including the model download. */
export const REMOVAL_TIMEOUT = 180 * 1000;

/** The image URIs of a block's fill, from either the single URI or the source set. */
export async function fillURIs(
  page: Page,
  editor: JSHandle<KitEditor>,
  block: number
): Promise<string[]> {
  return page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      const fill = engine.block.getFill(id);
      const single = engine.block.getString(fill, 'fill/image/imageFileURI');
      const set = engine.block
        .getSourceSet(fill, 'fill/image/sourceSet')
        .map((source: { uri: string }) => source.uri);
      return single === '' ? set : [single, ...set];
    },
    { handle: editor, id: block }
  );
}

/** Select the block at `index` of `kind` and return its id. */
export async function selectByKind(
  page: Page,
  editor: JSHandle<KitEditor>,
  kind: string,
  index = 0
): Promise<number> {
  return page.evaluate(
    ({ handle, blockKind, at }) => {
      const engine = handle.engine;
      const block = engine.block.findByKind(blockKind)[at];
      engine.block.findAllSelected().forEach((selected: number) => {
        engine.block.setSelected(selected, false);
      });
      engine.block.select(block);
      return block as number;
    },
    { handle: editor, blockKind: kind, at: index }
  );
}

/** Run background removal on the selected block and wait for its fill to change. */
export async function removeBackground(
  page: Page,
  editor: JSHandle<KitEditor>,
  block: number
): Promise<string[]> {
  const before = await fillURIs(page, editor, block);
  await page.getByRole('button', { name: 'BG Removal' }).click();
  await page.waitForFunction(
    ({ handle, id, previous }) => {
      const engine = handle.engine;
      const fill = engine.block.getFill(id);
      const single = engine.block.getString(fill, 'fill/image/imageFileURI');
      const set = engine.block
        .getSourceSet(fill, 'fill/image/sourceSet')
        .map((source: { uri: string }) => source.uri);
      const current = single === '' ? set : [single, ...set];
      return JSON.stringify(current) !== JSON.stringify(previous);
    },
    { handle: editor, id: block, previous: before },
    { timeout: REMOVAL_TIMEOUT, polling: 1000 }
  );
  return before;
}
