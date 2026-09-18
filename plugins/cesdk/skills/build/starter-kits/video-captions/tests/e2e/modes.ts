import {
  getEditor,
  waitForEditorReady,
  type KitEditor
} from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';

/** The demo options, in the order the kit renders them. */
export const MODES = [
  'AI Auto Captions',
  'Blank Video Editor',
  'Caption Import',
  'Pre-captioned Video'
] as const;

export const CAPTION_PANEL = '//ly.img.panel/inspector/caption';

/** Open one demo option and wait for the editor it mounts. */
export async function openMode(
  page: Page,
  mode: (typeof MODES)[number]
): Promise<JSHandle<KitEditor>> {
  // The kit mounts a fresh editor per mode; a stale global would let
  // `waitForEditorReady` return against the instance that is being disposed.
  await page.evaluate(() => {
    delete (window as unknown as { cesdk?: unknown }).cesdk;
  });
  await page
    .getByRole('button', { name: 'Open Editor' })
    .nth(MODES.indexOf(mode))
    .click();
  await waitForEditorReady(page);
  return getEditor(page);
}
