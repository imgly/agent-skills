import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';

const RESIZE_PANEL = '//ly.img.panel/inspector/pageResize';

interface Kit {
  page: Page;
  editor: JSHandle<{ engine: any }>;
}

async function pageSize(kit: Kit): Promise<{ width: number; height: number }> {
  return kit.page.evaluate((handle) => {
    const page = handle.engine.scene.getCurrentPage();
    return {
      width: handle.engine.block.getWidth(page),
      height: handle.engine.block.getHeight(page)
    };
  }, kit.editor);
}

test.describe('Page sizes', () => {
  test('PGS-04 page size presets are listed', async ({ kit }) => {
    const panel = editorPanel(kit.page, RESIZE_PANEL);

    await expect(
      panel.getByRole('heading', { name: 'Instagram' })
    ).toBeVisible();
    await expect(
      panel.getByRole('heading', { name: 'ISO Standard Print', exact: true })
    ).toBeVisible();
    const preset = panel
      .getByRole('button', { name: 'Square Post (1:1)', exact: true })
      .first();
    await preset.scrollIntoViewIfNeeded();
    await expect(preset).toBeVisible();
    await expect(preset.getByRole('img')).toBeVisible();
  });

  test('PGS-05 select a preset', async ({ kit }) => {
    const before = await pageSize(kit);
    expect(before.width).not.toBe(before.height);

    const panel = editorPanel(kit.page, RESIZE_PANEL);
    await panel
      .getByRole('button', { name: 'Square Post (1:1)', exact: true })
      .first()
      .click();

    await expect
      .poll(async () => {
        const { width, height } = await pageSize(kit);
        return width === height;
      })
      .toBe(true);
    const after = await pageSize(kit);
    expect(after.height).not.toBe(before.height);
    expect(after.width).toBe(after.height);
  });

  test('PGS-06 type a width and a height', async ({ kit }) => {
    const panel = editorPanel(kit.page, RESIZE_PANEL);
    const width = panel.getByRole('spinbutton', { name: 'Width in Pixel' });
    const height = panel.getByRole('spinbutton', { name: 'Height in Pixel' });

    await panel.getByRole('button', { name: 'Lock proportions' }).click();
    await width.fill('640');
    await width.press('Enter');
    await height.fill('480');
    await height.press('Enter');
    await panel.getByRole('button', { name: 'Apply' }).click();

    await expect.poll(() => pageSize(kit)).toEqual({ width: 640, height: 480 });
  });
});
