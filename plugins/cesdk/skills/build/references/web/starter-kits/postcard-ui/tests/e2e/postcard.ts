import { expect, getEditor, waitForEditorReady } from '@imgly/kit-test-harness';
import type { JSHandle, Locator, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';

/**
 * The top bar's undo and redo buttons carry no accessible name (known issue 6),
 * so they are addressed by position: they are the first two buttons on the page.
 */
export const undoButton = (page: Page): Locator =>
  page.getByRole('button').nth(0);
export const redoButton = (page: Page): Locator =>
  page.getByRole('button').nth(1);

/**
 * The swatch row inside an open colour dropdown. The swatches carry no
 * accessible name, so the row is found three levels up from the picker trigger,
 * which is the one control in it that has one.
 */
export const colorRow = (page: Page): Locator =>
  page
    .getByRole('button', { name: 'Pick color' })
    .locator('xpath=ancestor::div[3]');

export const colorSwatch = (page: Page, index: number): Locator =>
  colorRow(page).getByRole('button').nth(index);

/** Pick a template on the Style step and wait for its scene to settle. */
export async function chooseTemplate(
  page: Page,
  name = 'Thank you'
): Promise<JSHandle<KitEditor>> {
  await page.getByRole('button', { name: `Choose ${name} Template` }).click();
  await page.getByRole('button', { name: 'Export' }).waitFor();
  await waitForEditorReady(page);
  return getEditor(page);
}

/** Open the kit on the Style step, pick a template and wait for its scene. */
export async function openTemplate(
  page: Page,
  name = 'Thank you'
): Promise<JSHandle<KitEditor>> {
  await page.goto('./');
  return chooseTemplate(page, name);
}

/**
 * Double-click a block on the canvas until the editor is in text mode. The kit
 * re-zooms after a scene or block change, so the position is re-read each time.
 */
export async function enterTextMode(
  page: Page,
  editor: JSHandle<KitEditor>,
  block: number
): Promise<void> {
  await expect
    .poll(async () => {
      const box = await page.evaluate(
        ({ handle, id }) => {
          const [x, y, width, height] =
            handle.engine.block.getScreenSpaceBoundingBoxXYWH([id]);
          const canvas = handle.engine.element.getBoundingClientRect();
          return { x: canvas.x + x + width / 2, y: canvas.y + y + height / 2 };
        },
        { handle: editor, id: block }
      );
      await page.mouse.dblclick(box.x, box.y);
      return page.evaluate(
        (handle) => handle.engine.editor.getEditMode(),
        editor
      );
    })
    .toBe('Text');
}
