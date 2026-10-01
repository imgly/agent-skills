import type { Kit } from '@imgly/kit-test-harness';
import type { Page } from '@playwright/test';

/** A 1x1 PNG, small enough to inline and real enough for `new Image()`. */
export const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

/** The current page of the photobook. */
export async function currentPage(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) => handle.engine.scene.getCurrentPage(),
    kit.editor
  );
}

export async function pageCount(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) => handle.engine.scene.getPages().length,
    kit.editor
  );
}

export async function pageOrder(kit: Kit): Promise<number[]> {
  return kit.page.evaluate(
    (handle) => handle.engine.scene.getPages(),
    kit.editor
  );
}

export async function pageChildCount(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) =>
      handle.engine.block.getChildren(handle.engine.scene.getCurrentPage())
        .length,
    kit.editor
  );
}

export async function canUndo(kit: Kit): Promise<boolean> {
  return kit.page.evaluate(
    (handle) => handle.engine.editor.canUndo(),
    kit.editor
  );
}

/** Every descendant of the current page, the way the kit's helpers walk it. */
export async function pageTree(
  kit: Kit
): Promise<
  { id: number; name: string; uri: string | null; font: string | null }[]
> {
  return kit.page.evaluate((handle) => {
    const walk = (block: number): number[] => {
      const children = handle.engine.block.getChildren(block);
      return [...children, ...children.flatMap(walk)];
    };
    return walk(handle.engine.scene.getCurrentPage()).map((id: number) => {
      let uri: string | null = null;
      let font: string | null = null;
      try {
        uri = handle.engine.block.getString(
          handle.engine.block.getFill(id),
          'fill/image/imageFileURI'
        );
      } catch {
        uri = null;
      }
      try {
        font = handle.engine.block.getString(id, 'text/fontFileUri');
      } catch {
        font = null;
      }
      return { id, name: handle.engine.block.getName(id), uri, font };
    });
  }, kit.editor);
}

/** Select the first text block on the page, the way a tap on the canvas would. */
export async function selectFirstText(kit: Kit): Promise<number> {
  return kit.page.evaluate((handle) => {
    const walk = (block: number): number[] => {
      const children = handle.engine.block.getChildren(block);
      return [...children, ...children.flatMap(walk)];
    };
    const text = walk(handle.engine.scene.getCurrentPage()).find(
      (block: number) => handle.engine.block.getType(block).includes('text')
    );
    if (text == null) {
      throw new Error('The page holds no text block.');
    }
    handle.engine.block
      .findAllSelected()
      .forEach((selected: number) =>
        handle.engine.block.setSelected(selected, false)
      );
    handle.engine.block.setSelected(text, true);
    return text;
  }, kit.editor);
}

/** The image blocks of the current page, in tree order. */
export async function pageImages(kit: Kit): Promise<number[]> {
  return kit.page.evaluate((handle) => {
    const walk = (block: number): number[] => {
      const children = handle.engine.block.getChildren(block);
      return [...children, ...children.flatMap(walk)];
    };
    return walk(handle.engine.scene.getCurrentPage()).filter(
      (block: number) => handle.engine.block.getKind(block) === 'image'
    );
  }, kit.editor);
}

export async function selectBlock(kit: Kit, block: number): Promise<void> {
  await kit.page.evaluate(
    ({ handle, id }) => {
      handle.engine.block
        .findAllSelected()
        .forEach((selected: number) =>
          handle.engine.block.setSelected(selected, false)
        );
      handle.engine.block.setSelected(id, true);
    },
    { handle: kit.editor, id: block }
  );
}

export async function imageState(
  kit: Kit,
  block: number
): Promise<{
  uri: string;
  placeholder: boolean;
  overlay: boolean;
  cropScale: number;
}> {
  return kit.page.evaluate(
    ({ handle, id }) => ({
      uri: handle.engine.block.getString(
        handle.engine.block.getFill(id),
        'fill/image/imageFileURI'
      ),
      placeholder: handle.engine.block.isPlaceholderEnabled(id),
      overlay: handle.engine.block.isPlaceholderControlsOverlayEnabled(id),
      cropScale: handle.engine.block.getCropScaleRatio(id)
    }),
    { handle: kit.editor, id: block }
  );
}

export async function uploadFiles(
  page: Page,
  files: { name: string; mimeType: string; buffer: Buffer }[]
): Promise<void> {
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Upload' }).click();
  await (await chooser).setFiles(files);
}
