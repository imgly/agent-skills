import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';

export const CUTOUT_TYPE = '//ly.img.ubq/cutout';

/**
 * The plugin registers its asset source from an unawaited fetch, so the Cutout
 * panel is empty until that lands. See known issue 1 in TEST-PLAN.md.
 */
export async function waitForCutoutSource(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<void> {
  await page.waitForFunction(
    (handle) => handle.engine.asset.findAllSources().includes('ly.img.cutout'),
    editor,
    { timeout: 60 * 1000 }
  );
}

/** The ids of every cutout block in the scene. */
export async function cutoutBlocks(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<number[]> {
  return page.evaluate((handle) => {
    const engine = handle.engine;
    return engine.block
      .findAll()
      .filter(
        (id: number) => engine.block.getType(id) === '//ly.img.ubq/cutout'
      );
  }, editor);
}

/** Replace the selection with `ids`. */
export async function select(
  page: Page,
  editor: JSHandle<KitEditor>,
  ids: number[]
): Promise<void> {
  await page.evaluate(
    ({ handle, list }) => {
      const engine = handle.engine;
      engine.block
        .findAllSelected()
        .forEach((id: number) => engine.block.setSelected(id, false));
      list.forEach((id) => engine.block.setSelected(id, true));
    },
    { handle: editor, list: ids }
  );
}
