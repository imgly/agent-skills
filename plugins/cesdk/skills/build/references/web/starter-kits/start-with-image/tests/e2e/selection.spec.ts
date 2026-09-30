import { expect, test } from '@imgly/kit-test-harness';
import { chooseImage, IMAGES, thumbnail } from './kit';

test.describe('Image selection', () => {
  test('SWI-01 no editor before a picture is chosen', async ({ page }) => {
    await page.goto('./');

    await expect(
      page.getByRole('heading', { name: 'Select Image' })
    ).toBeVisible();
    for (const image of IMAGES) {
      await expect(page.getByAltText(image.alt)).toBeVisible();
    }
    expect(await page.evaluate(() => (window as any).cesdk)).toBeUndefined();
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('SWI-02 the chosen picture fills the page', async ({ page }) => {
    await page.goto('./');
    const editor = await chooseImage(page, 0);

    const scene = await page.evaluate(({ engine }) => {
      const pages = engine.scene.getPages();
      const fill = engine.block.getFill(pages[0]);
      return {
        pageCount: pages.length,
        width: engine.block.getWidth(pages[0]),
        height: engine.block.getHeight(pages[0]),
        fillType: engine.block.getType(fill),
        uri: engine.block.getString(fill, 'fill/image/imageFileURI')
      };
    }, editor);

    expect(scene.pageCount).toBe(1);
    expect([scene.width, scene.height]).toEqual(IMAGES[0].size);
    expect(scene.fillType).toBe('//ly.img.ubq/fill/image');
    expect(scene.uri).toContain(IMAGES[0].file);
  });

  test('SWI-03 choosing another picture replaces the editor', async ({
    page
  }) => {
    await page.goto('./');
    await chooseImage(page, 0);
    const editor = await chooseImage(page, 1);

    const uri = await page.evaluate(({ engine }) => {
      const [firstPage] = engine.scene.getPages();
      return engine.block.getString(
        engine.block.getFill(firstPage),
        'fill/image/imageFileURI'
      );
    }, editor);

    expect(uri).toContain(IMAGES[1].file);
    await expect(thumbnail(page, 1)).toHaveClass(/_active_/);
    await expect(thumbnail(page, 0)).not.toHaveClass(/_active_/);
  });
});
