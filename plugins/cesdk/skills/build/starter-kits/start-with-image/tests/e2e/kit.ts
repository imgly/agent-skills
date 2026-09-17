import {
  getEditor,
  waitForEditorReady,
  type KitEditor
} from '@imgly/kit-test-harness';
import type { JSHandle, Locator, Page } from '@playwright/test';

export const IMAGES = [
  { alt: 'Mountain landscape', file: 'mountain-1200.jpg', size: [1080, 720] },
  { alt: 'Sea view', file: 'sea-1200.jpg', size: [1080, 1440] },
  { alt: 'Surfer riding a wave', file: 'surf-1200.jpg', size: [1200, 1233] }
];

export function thumbnail(page: Page, index: number): Locator {
  return page
    .getByRole('button')
    .filter({ has: page.getByAltText(IMAGES[index].alt) });
}

/**
 * Choose a picture and wait for the editor it mounts.
 *
 * Choosing another picture bumps the React key, so the editor is replaced
 * rather than reconfigured. Waiting for `window.cesdk` to become a different
 * object keeps a case from reading the outgoing instance, which still has a
 * scene and would satisfy the readiness check.
 */
export async function chooseImage(
  page: Page,
  index: number
): Promise<JSHandle<KitEditor>> {
  const previous = await page.evaluateHandle(() => (window as any).cesdk);
  await thumbnail(page, index).click();
  await page.waitForFunction(
    (before) => {
      const current = (window as any).cesdk;
      return current != null && current !== before;
    },
    previous,
    { timeout: 90 * 1000 }
  );
  await previous.dispose();
  await waitForEditorReady(page);
  return getEditor(page);
}

export function dockEntry(page: Page, label: string): Locator {
  return page.getByRole('button', { name: label, exact: true });
}
