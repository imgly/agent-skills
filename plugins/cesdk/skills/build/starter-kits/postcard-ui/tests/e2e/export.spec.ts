import {
  download,
  expect,
  exportCalls,
  pdfPageCount,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';
import { openTemplate } from './postcard';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

const sceneState = (page: Page, editor: JSHandle<KitEditor>) =>
  page.evaluate((handle) => {
    const engine = handle.engine;
    return {
      scene: engine.scene.get(),
      dpi: engine.block.getFloat(engine.scene.get(), 'scene/dpi'),
      visible: engine.scene
        .getPages()
        .map((id: number) => engine.block.isVisible(id))
    };
  }, editor);

test('PC-31 export from the Design page', async ({ page }) => {
  const editor = await openTemplate(page);
  await spyExport(page);

  const files = await download(page, async () => {
    await page.getByRole('button', { name: 'Export' }).click();
  });

  const calls = await exportCalls(page);
  const after = await sceneState(page, editor);
  expect(calls).toHaveLength(1);
  expect(calls[0].block).toBe(after.scene);
  expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });

  expect(files).toHaveLength(1);
  // The kit passes no extension; the browser derives it from the blob type.
  expect(files[0].name).toBe('my-postcard.pdf');
  expect(await pdfPageCount(files[0].buffer)).toBe(2);

  expect(after.dpi).toBe(300);
  expect(after.visible).toEqual([true, false]);
});

test('PC-32 export from the Write page', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Write' }).click();
  await expect(page.getByRole('button', { name: 'Size' })).toBeVisible();
  await spyExport(page);

  const files = await download(page, async () => {
    await page.getByRole('button', { name: 'Export' }).click();
  });

  expect(await pdfPageCount(files[0].buffer)).toBe(2);
  const after = await sceneState(page, editor);
  expect(after.dpi).toBe(300);
  // Only the back page is visible again.
  expect(after.visible).toEqual([false, true]);
});
