import { editorPanel } from '@imgly/kit-test-harness';
import type { KitEditor } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';

export const QR_METADATA_KEY = '@imgly/plugin-qr-code-web';

export interface QrBlock {
  id: number;
  url: string;
  type: string;
}

/** Every block that carries the QR plugin's metadata, with that metadata parsed. */
export async function qrBlocks(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<QrBlock[]> {
  return page.evaluate((handle) => {
    const engine = handle.engine;
    return engine.block
      .findAll()
      .filter((id: number) =>
        engine.block.findAllMetadata(id).includes('@imgly/plugin-qr-code-web')
      )
      .map((id: number) => ({
        id,
        ...JSON.parse(engine.block.getMetadata(id, '@imgly/plugin-qr-code-web'))
      }));
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

/** The builder's TextInput commits on Enter, not on every keystroke. */
export async function typeUrl(
  page: Page,
  panelId: string,
  url: string
): Promise<void> {
  const input = editorPanel(page, panelId).getByRole('textbox');
  await input.click();
  await input.fill('');
  await input.pressSequentially(url);
  await input.press('Enter');
}
