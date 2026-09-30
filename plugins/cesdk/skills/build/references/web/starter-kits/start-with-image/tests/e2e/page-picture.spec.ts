import { expect, test } from '@imgly/kit-test-harness';
import { chooseImage, dockEntry } from './kit';

test.describe('The page picture', () => {
  test('SWI-11 no inspector and no sticker drag replaces the page picture', async ({
    page
  }) => {
    await page.goto('./');
    const editor = await chooseImage(page, 0);
    const picture = () =>
      page.evaluate(({ engine }) => {
        const [first] = engine.scene.getPages();
        return engine.block.getString(
          engine.block.getFill(first),
          'fill/image/imageFileURI'
        );
      }, editor);
    const stickers = () =>
      page.evaluate(({ engine }) => {
        const [first] = engine.scene.getPages();
        return engine.block
          .getChildren(first)
          .filter((child: number) => engine.block.getKind(child) === 'sticker');
      }, editor);
    const before = await picture();

    // The kit selects the page on start and leaves the inspector off, so even
    // an opened inspector panel renders no control for the page.
    const inspector = await page.evaluate(({ engine, cesdk }) => {
      cesdk.ui.openPanel('//ly.img.panel/inspector');
      return {
        selection: engine.block
          .findAllSelected()
          .map((id: number) => engine.block.getType(id)),
        enabled: cesdk.feature.isEnabled('ly.img.inspector', { engine })
      };
    }, editor);
    expect(inspector).toEqual({
      selection: ['//ly.img.ubq/page'],
      enabled: false
    });
    await expect(page.getByRole('button', { name: /replace/i })).toHaveCount(0);

    // Drag a sticker from the library onto the picture.
    await dockEntry(page, 'Stickers').click();
    const card = page.getByRole('button', { name: 'Vomiting' }).first();
    const target = await page.evaluate(({ engine }) => {
      const canvas = engine.element.getBoundingClientRect();
      return {
        x: canvas.x + canvas.width * 0.7,
        y: canvas.y + canvas.height * 0.7
      };
    }, editor);
    await card.hover();
    await page.mouse.down();
    await page.mouse.move(target.x, target.y, { steps: 20 });
    await page.mouse.up();
    await expect.poll(async () => (await stickers()).length).toBe(1);
    expect(await picture()).toBe(before);

    // Press and hold the sticker, the way a fill swap starts, and drop it on
    // the picture.
    const [sticker] = await stickers();
    const { from, to, holdMs } = await page.evaluate(
      ({ handle, id }) => {
        const engine = handle.engine;
        const [x, y, width, height] =
          engine.block.getScreenSpaceBoundingBoxXYWH([id]);
        const canvas = engine.element.getBoundingClientRect();
        return {
          from: { x: canvas.x + x + width / 2, y: canvas.y + y + height / 2 },
          to: {
            x: canvas.x + canvas.width * 0.2,
            y: canvas.y + canvas.height * 0.2
          },
          holdMs: engine.editor.getSettingFloat(
            'dragToSwapFills/longPressDurationMs'
          )
        };
      },
      { handle: editor, id: sticker }
    );
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    // The long press is the gesture itself.
    await page.waitForTimeout(holdMs + 300);
    await page.mouse.move(to.x, to.y, { steps: 25 });
    await page.mouse.up();

    await expect.poll(stickers).toEqual([sticker]);
    expect(await picture()).toBe(before);
  });
});
