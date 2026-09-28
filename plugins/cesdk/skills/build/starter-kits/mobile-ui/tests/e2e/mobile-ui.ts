import type { Kit } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

/** A 1x1 PNG, small enough to inline and real enough for `new Image()`. */
export const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

export const topBar = {
  size: (page: Page): Locator =>
    page.getByRole('button', { name: 'Canvas size' }),
  undo: (page: Page): Locator => page.getByRole('button', { name: 'Undo' }),
  redo: (page: Page): Locator => page.getByRole('button', { name: 'Redo' }),
  download: (page: Page): Locator => page.getByTitle('download')
};

/** The four entries of the add bar, which is shown when nothing is selected. */
export function addButton(page: Page, name: string): Locator {
  return page.getByRole('button', { name, exact: true });
}

/** Open one of the add panels and wait for its collapse control. */
export async function openAddPanel(page: Page, name: string): Promise<void> {
  await addButton(page, name).click();
  await page.getByRole('button', { name: 'Collapse' }).waitFor();
}

export async function uploadFiles(
  page: Page,
  files: { name: string; mimeType: string; buffer: Buffer }[]
): Promise<void> {
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Upload' }).click();
  await (await chooser).setFiles(files);
}

/** The single page of the kit's scene. */
export async function pageBlock(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) => handle.engine.scene.getPages()[0],
    kit.editor
  );
}

export async function pageSize(
  kit: Kit
): Promise<{ width: number; height: number }> {
  return kit.page.evaluate((handle) => {
    const [page] = handle.engine.scene.getPages();
    return {
      width: Math.round(handle.engine.block.getWidth(page)),
      height: Math.round(handle.engine.block.getHeight(page))
    };
  }, kit.editor);
}

/** The kinds of the blocks on the page, so a test can see what was added. */
export async function pageChildKinds(kit: Kit): Promise<string[]> {
  return kit.page.evaluate((handle) => {
    const [page] = handle.engine.scene.getPages();
    return handle.engine.block
      .getChildren(page)
      .map((child: number) => handle.engine.block.getKind(child));
  }, kit.editor);
}

/** Select a block by kind, the way a tap on the canvas would. */
export async function selectKind(kit: Kit, kind: string): Promise<number> {
  return kit.page.evaluate(
    ({ handle, wanted }) => {
      const [page] = handle.engine.scene.getPages();
      const block = handle.engine.block
        .getChildren(page)
        .find((child: number) => handle.engine.block.getKind(child) === wanted);
      if (block == null) {
        throw new Error(`The page holds no ${wanted} block.`);
      }
      handle.engine.block
        .findAllSelected()
        .forEach((selected: number) =>
          handle.engine.block.setSelected(selected, false)
        );
      handle.engine.block.setSelected(block, true);
      return block;
    },
    { handle: kit.editor, wanted: kind }
  );
}

/** The block the kit last selected, whatever added it. */
export async function selectedBlock(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) => handle.engine.block.findAllSelected()[0],
    kit.editor
  );
}

export async function fillUri(kit: Kit, block: number): Promise<string> {
  return kit.page.evaluate(
    ({ handle, id }) =>
      handle.engine.block.getString(
        handle.engine.block.getFill(id),
        'fill/image/imageFileURI'
      ),
    { handle: kit.editor, id: block }
  );
}
