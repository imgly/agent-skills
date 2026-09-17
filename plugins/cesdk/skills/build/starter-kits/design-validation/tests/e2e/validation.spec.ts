import { expect, test } from '@imgly/kit-test-harness';
import { commit, ValidationSidebar } from './validation-sidebar';

test.describe('Design validation', () => {
  test('DV-01 the shipped design is checked on load', async ({ kit }) => {
    const sidebar = new ValidationSidebar(kit.page);

    await expect(sidebar.header).toBeVisible();
    await expect(sidebar.count).toHaveText('3 results');
    await expect(sidebar.selectButtons).toHaveCount(3);
    await expect(sidebar.row('Low resolution')).toHaveCount(1);
    await expect(sidebar.row('Text partially hidden')).toHaveCount(0);
    // The block that sits fully above the page is outside it, not merely
    // protruding: the checks run once the engine has laid the scene out.
    await expect(sidebar.row('Outside of page')).toHaveCount(1);
    await expect(sidebar.row('Protrudes from page')).toHaveCount(1);
    await expect(
      sidebar.row('Low resolution').getByText('Image')
    ).toBeVisible();
  });

  test('DV-02 a block moved off the page', async ({ kit }) => {
    const sidebar = new ValidationSidebar(kit.page);

    await sidebar.selectButtonFor('Protrudes from page').click();
    const selected = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );
    expect(selected).toHaveLength(1);

    await kit.page.evaluate(
      ([handle, block]) => {
        const { engine } = handle;
        engine.block.setPositionX(block as number, 5000);
        engine.block.setPositionY(block as number, 5000);
      },
      [kit.editor, selected[0]] as const
    );
    await commit(kit.page, kit.editor);

    // The moved block joins the one that already sits off the page, so both
    // are now Outside of page and nothing protrudes.
    await expect(sidebar.row('Outside of page')).toHaveCount(2);
    await expect(sidebar.row('Protrudes from page')).toHaveCount(0);
    await expect(sidebar.count).toHaveText('3 results');
  });

  test('DV-03 a protruding block moved fully inside', async ({ kit }) => {
    const sidebar = new ValidationSidebar(kit.page);

    await sidebar.selectButtonFor('Protrudes from page').click();
    const [block] = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );

    await kit.page.evaluate(
      ([handle, id]) => {
        const { engine } = handle;
        const page = engine.scene.getPages()[0];
        engine.block.setWidth(id as number, 10);
        engine.block.setHeight(id as number, 10);
        engine.block.setPositionX(
          id as number,
          engine.block.getPositionX(page) + 1
        );
        engine.block.setPositionY(
          id as number,
          engine.block.getPositionY(page) + 1
        );
      },
      [kit.editor, block] as const
    );
    await commit(kit.page, kit.editor);

    // The other block sits fully above the page, so it stays Outside of page.
    await expect(sidebar.row('Protrudes from page')).toHaveCount(0);
    await expect(sidebar.row('Outside of page')).toHaveCount(1);
    await expect(sidebar.count).toHaveText('2 results');
  });

  test('DV-04 a low-resolution image scaled down', async ({ kit }) => {
    const sidebar = new ValidationSidebar(kit.page);

    await sidebar.selectButtonFor('Low resolution').click();
    const [image] = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );

    await kit.page.evaluate(
      ([handle, id]) => {
        const { engine } = handle;
        engine.block.setWidth(
          id as number,
          engine.block.getWidth(id as number) / 8
        );
        engine.block.setHeight(
          id as number,
          engine.block.getHeight(id as number) / 8
        );
      },
      [kit.editor, image] as const
    );
    await commit(kit.page, kit.editor);

    await expect(sidebar.row('Low resolution')).toHaveCount(0);
  });

  test('DV-05 new problems appear without a refresh', async ({ kit }) => {
    const sidebar = new ValidationSidebar(kit.page);
    await expect(sidebar.count).toHaveText('3 results');

    await kit.page.evaluate((handle) => {
      const { engine } = handle;
      const page = engine.scene.getPages()[0];
      const [text] = engine.block
        .getChildren(page)
        .filter(
          (id: number) => engine.block.getType(id) === '//ly.img.ubq/text'
        );

      const cover = engine.block.create('graphic');
      engine.block.setShape(cover, engine.block.createShape('rect'));
      engine.block.setFill(cover, engine.block.createFill('color'));
      engine.block.setPositionX(
        cover,
        engine.block.getGlobalBoundingBoxX(text) + 2
      );
      engine.block.setPositionY(
        cover,
        engine.block.getGlobalBoundingBoxY(text) + 2
      );
      engine.block.setWidth(
        cover,
        engine.block.getGlobalBoundingBoxWidth(text) / 2
      );
      engine.block.setHeight(
        cover,
        engine.block.getGlobalBoundingBoxHeight(text) / 2
      );
      engine.block.appendChild(page, cover);
    }, kit.editor);
    await commit(kit.page, kit.editor);

    await expect(sidebar.row('Text partially hidden')).toHaveCount(1);
    await expect(sidebar.count).toHaveText('4 results');
  });

  test('DV-06 a clean design', async ({ kit }) => {
    const sidebar = new ValidationSidebar(kit.page);
    await expect(sidebar.count).toHaveText('3 results');

    await kit.page.evaluate((handle) => {
      const { engine } = handle;
      const page = engine.scene.getPages()[0];
      for (const id of engine.block.getChildren(page)) {
        engine.block.destroy(id);
      }
    }, kit.editor);
    await commit(kit.page, kit.editor);

    await expect(sidebar.count).toHaveText('0 results');
    await expect(sidebar.emptyText).toBeVisible();
    await expect(
      kit.page.getByText('Move elements around to see a different result.')
    ).toBeVisible();
  });
});
