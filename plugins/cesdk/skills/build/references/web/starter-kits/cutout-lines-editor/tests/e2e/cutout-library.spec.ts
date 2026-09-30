import { expect, test } from '@imgly/kit-test-harness';
import type { KitEditor } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import { cutoutBlocks, select, waitForCutoutSource } from './cutouts';

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function openCutoutPanel(page: Page) {
  await page
    .getByRole('region', { name: 'Left Dock' })
    .getByRole('button', { name: 'Cutout', exact: true })
    .click();
  return page.getByRole('complementary', { name: 'Cutout' });
}

/** The one cutout added since `before`, once it exists. */
async function addedCutout(
  page: Page,
  editor: JSHandle<KitEditor>,
  before: number[]
): Promise<number> {
  await expect
    .poll(async () => (await cutoutBlocks(page, editor)).length)
    .toBe(before.length + 1);
  return (await cutoutBlocks(page, editor)).find((id) => !before.includes(id))!;
}

async function describeCutout(
  page: Page,
  editor: JSHandle<KitEditor>,
  id: number
) {
  return page.evaluate(
    ({ handle, block }) => {
      const engine = handle.engine;
      return {
        path: engine.block.getString(block, 'cutout/path') as string,
        width: engine.block.getWidth(block) as number,
        height: engine.block.getHeight(block) as number,
        selected: engine.block.findAllSelected() as number[]
      };
    },
    { handle: editor, block: id }
  );
}

const bounds = (page: Page, editor: JSHandle<KitEditor>, id: number) =>
  page.evaluate(
    ({ handle, block }): Bounds => {
      const engine = handle.engine;
      return {
        x: engine.block.getGlobalBoundingBoxX(block),
        y: engine.block.getGlobalBoundingBoxY(block),
        width: engine.block.getGlobalBoundingBoxWidth(block),
        height: engine.block.getGlobalBoundingBoxHeight(block)
      };
    },
    { handle: editor, block: id }
  );

test.describe('The Cutout library', () => {
  test('CL-08 Cutout Rectangle adds a square cutout and Cutout Circle a round one', async ({
    kit
  }) => {
    await waitForCutoutSource(kit.page, kit.editor);

    for (const [asset, round] of [
      ['Cutout Rectangle', false],
      ['Cutout Circle', true]
    ] as const) {
      const before = await cutoutBlocks(kit.page, kit.editor);
      const panel = await openCutoutPanel(kit.page);
      await panel.getByRole('button', { name: asset, exact: true }).click();

      const id = await addedCutout(kit.page, kit.editor, before);
      const cutout = await describeCutout(kit.page, kit.editor, id);
      expect(cutout.selected, asset).toEqual([id]);
      expect(cutout.width, asset).toBeCloseTo(cutout.height, 3);
      // A rectangle path is straight lines only; a circle needs curves.
      expect(/[CcAaQqSs]/.test(cutout.path), `${asset}: ${cutout.path}`).toBe(
        round
      );
    }
  });

  test('CL-09 Generate from Selection adds one cutout around two selected blocks', async ({
    kit
  }) => {
    await waitForCutoutSource(kit.page, kit.editor);
    const shapes = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [page] = engine.scene.getPages();
      const onPage = (id: number) => {
        let parent = engine.block.getParent(id);
        while (parent != null && parent !== page) {
          parent = engine.block.getParent(parent);
        }
        return parent === page;
      };
      // A zero-height line has no area to cut around.
      const hasArea = (id: number) =>
        engine.block.getGlobalBoundingBoxWidth(id) > 5 &&
        engine.block.getGlobalBoundingBoxHeight(id) > 5;
      return engine.block
        .findByKind('shape')
        .filter((id: number) => onPage(id) && hasArea(id))
        .slice(0, 2);
    }, kit.editor);
    expect(shapes).toHaveLength(2);
    const boxes = await Promise.all(
      shapes.map((id) => bounds(kit.page, kit.editor, id))
    );

    const before = await cutoutBlocks(kit.page, kit.editor);
    await select(kit.page, kit.editor, shapes);
    const panel = await openCutoutPanel(kit.page);
    await panel
      .getByRole('button', { name: 'Generate from Selection', exact: true })
      .click();

    const id = await addedCutout(kit.page, kit.editor, before);
    const cutout = await describeCutout(kit.page, kit.editor, id);
    expect(cutout.selected).toEqual([id]);

    const around = await bounds(kit.page, kit.editor, id);
    const tolerance = 1;
    for (const box of boxes) {
      expect(around.x).toBeLessThanOrEqual(box.x + tolerance);
      expect(around.y).toBeLessThanOrEqual(box.y + tolerance);
      expect(around.x + around.width).toBeGreaterThanOrEqual(
        box.x + box.width - tolerance
      );
      expect(around.y + around.height).toBeGreaterThanOrEqual(
        box.y + box.height - tolerance
      );
    }
  });
});
