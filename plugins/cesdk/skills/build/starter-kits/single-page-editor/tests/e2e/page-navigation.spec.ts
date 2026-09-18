import { expect, test } from '@imgly/kit-test-harness';
import { CanvasBar, currentPage, pageIds } from './page-select';

test.describe('Page navigation', () => {
  test('SPE-04 previous and next move one page', async ({ kit }) => {
    const canvasBar = new CanvasBar(kit.page);
    const pages = await pageIds(kit.page, kit.editor);

    await expect(canvasBar.previousPage).toBeDisabled();

    await canvasBar.nextPage.click();
    await expect(canvasBar.pageSelect).toHaveText('Page 2 / 4');
    expect(await currentPage(kit.page, kit.editor)).toBe(pages[1]);
    await expect(canvasBar.previousPage).toBeEnabled();

    await canvasBar.previousPage.click();
    await expect(canvasBar.pageSelect).toHaveText('Page 1 / 4');
    expect(await currentPage(kit.page, kit.editor)).toBe(pages[0]);

    for (let step = 0; step < 3; step += 1) {
      await canvasBar.nextPage.click();
    }
    await expect(canvasBar.pageSelect).toHaveText('Page 4 / 4');
    await expect(canvasBar.nextPage).toBeDisabled();
  });

  test('SPE-05 a page can be picked from the dropdown', async ({ kit }) => {
    const canvasBar = new CanvasBar(kit.page);
    const pages = await pageIds(kit.page, kit.editor);

    const menu = await canvasBar.openPageMenu();
    await expect(menu.getByRole('button')).toHaveText([
      'Page 1',
      'Page 2',
      'Page 3',
      'Page 4'
    ]);
    await menu.getByRole('button', { name: 'Page 3', exact: true }).click();

    await expect(canvasBar.pageSelect).toHaveText('Page 3 / 4');
    expect(await currentPage(kit.page, kit.editor)).toBe(pages[2]);

    const visible = await kit.page.evaluate((cesdk) => {
      const { block, scene } = cesdk.engine;
      return scene.getPages().map((id: number) => block.isVisible(id));
    }, kit.editor);
    expect(visible).toEqual([false, false, true, false]);
  });

  test('SPE-06 a page can be added', async ({ kit }) => {
    const canvasBar = new CanvasBar(kit.page);

    await canvasBar.addPage.click();
    await expect(canvasBar.pageSelect).toHaveText('Page 5 / 5');

    const menu = await canvasBar.openPageMenu();
    await expect(menu.getByRole('button')).toHaveCount(5);

    const pages = await pageIds(kit.page, kit.editor);
    expect(pages).toHaveLength(5);
    expect(await currentPage(kit.page, kit.editor)).toBe(pages[4]);
  });
});
