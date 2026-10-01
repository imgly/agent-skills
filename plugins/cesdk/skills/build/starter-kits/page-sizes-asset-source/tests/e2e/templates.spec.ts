import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';

const PANEL = '//ly.img.panel/assetLibrary';
const RESIZE_PANEL = '//ly.img.panel/inspector/pageResize';

interface Kit {
  page: Page;
  editor: JSHandle<{ engine: any; cesdk: any }>;
}

async function currentPage(kit: Kit): Promise<{
  width: number;
  height: number;
  children: number;
}> {
  return kit.page.evaluate((handle) => {
    const page = handle.engine.scene.getCurrentPage();
    return {
      width: handle.engine.block.getWidth(page),
      height: handle.engine.block.getHeight(page),
      children: handle.engine.block.getChildren(page).length
    };
  }, kit.editor);
}

async function applyTemplate(kit: Kit, name: string): Promise<void> {
  await kit.page.getByRole('button', { name: 'Templates' }).click();
  await editorPanel(kit.page, PANEL)
    .getByRole('button', { name, exact: true })
    .click();
  // The editor asks before discarding the current design.
  const confirm = kit.page.getByRole('button', {
    name: 'Yes, discard changes'
  });
  if (await confirm.isVisible()) {
    await confirm.click();
  }
}

test.describe('Templates', () => {
  test('PGS-07 apply the Blank template', async ({ kit }) => {
    const before = await currentPage(kit);
    expect(before.children).toBeGreaterThan(0);

    await applyTemplate(kit, 'Blank Document');

    await expect.poll(async () => (await currentPage(kit)).children).toBe(0);
    // Applying a template replaces the content, not the page size.
    const after = await currentPage(kit);
    expect([after.width, after.height]).toEqual([before.width, before.height]);
  });

  test('PGS-08 apply a design template', async ({ kit }) => {
    const before = await currentPage(kit);

    await applyTemplate(kit, 'Postcard Tropical');

    await expect
      .poll(async () => (await currentPage(kit)).children)
      .not.toBe(before.children);
    expect((await currentPage(kit)).children).toBeGreaterThan(0);

    // The resize panel still shows the current page size, never a stale one.
    const panel = editorPanel(kit.page, RESIZE_PANEL);
    if (!(await panel.isVisible())) {
      await kit.page.getByRole('button', { name: 'Page Sizes' }).click();
    }
    await expect(panel).toBeVisible();
    const { width } = await currentPage(kit);
    await expect(
      panel.getByRole('spinbutton', { name: 'Width in Pixel' })
    ).toHaveValue(String(Math.round(width)));
  });
});
