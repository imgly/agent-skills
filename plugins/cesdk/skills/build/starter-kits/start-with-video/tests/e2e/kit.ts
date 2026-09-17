import {
  getEditor,
  waitForEditorReady,
  type KitEditor
} from '@imgly/kit-test-harness';
import type { JSHandle, Locator, Page } from '@playwright/test';

export const VIDEOS = [
  {
    alt: 'A Young Man Squeezing An Orange',
    file: 'pexels-koolshooters-6975806.mp4'
  },
  {
    alt: 'Person Decorating Dessert With Kiwi',
    file: 'pexels-nicola-barts-7930811.mp4'
  },
  {
    alt: 'Close Up Video Of An Opened Pomegranate',
    file: 'pexels-tima-miroshnichenko-7033913.mp4'
  }
];

export function thumbnail(page: Page, index: number): Locator {
  return page.getByRole('button', { name: VIDEOS[index].alt });
}

/**
 * Choose a video and wait for the editor it mounts.
 *
 * Choosing another video bumps the React key, so the editor is replaced rather
 * than reconfigured. Waiting for `window.cesdk` to become a different object
 * keeps a case from reading the outgoing instance, which still has a scene and
 * would satisfy the readiness check.
 */
export async function chooseVideo(
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
