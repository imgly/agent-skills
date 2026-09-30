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

  test('DV-08 the text above the page is selected and moved onto it', async ({
    kit
  }) => {
    const sidebar = new ValidationSidebar(kit.page);
    await expect(sidebar.row('Outside of page')).toHaveCount(1);

    await sidebar.selectButtonFor('Outside of page').click();
    const selected = await kit.page.evaluate((handle) => {
      const { engine } = handle;
      const page = engine.scene.getPages()[0];
      return engine.block.findAllSelected().map((id: number) => ({
        id,
        type: engine.block.getType(id),
        text: engine.block.getString(id, 'text/text'),
        bottom:
          engine.block.getGlobalBoundingBoxY(id) +
          engine.block.getGlobalBoundingBoxHeight(id),
        pageTop: engine.block.getGlobalBoundingBoxY(page)
      }));
    }, kit.editor);
    expect(selected).toHaveLength(1);
    expect(selected[0].type).toBe('//ly.img.ubq/text');
    expect(selected[0].text).toContain("You can't buy happiness,");
    expect(selected[0].bottom).toBeLessThanOrEqual(selected[0].pageTop);

    await kit.page.evaluate(
      ([handle, id]) => {
        const { engine } = handle;
        const page = engine.scene.getPages()[0];
        engine.block.setPositionX(
          id as number,
          engine.block.getPositionX(page) + 10
        );
        engine.block.setPositionY(
          id as number,
          engine.block.getPositionY(page) + 10
        );
      },
      [kit.editor, selected[0].id] as const
    );
    await commit(kit.page, kit.editor);

    await expect(sidebar.row('Outside of page')).toHaveCount(0);
    await expect(sidebar.count).toHaveText('2 results');
  });

  test('DV-09 the dock offers the libraries to add blocks from', async ({
    kit
  }) => {
    const dock = kit.page.getByRole('region', { name: 'Left Dock' });
    const libraries = {
      Templates: 'ly.img.templates',
      Elements: 'ly.img.elements',
      Uploads: 'ly.img.upload',
      Images: 'ly.img.image',
      Text: 'ly.img.text',
      Shapes: 'ly.img.vector.shape',
      Stickers: 'ly.img.sticker'
    };

    for (const [label, key] of Object.entries(libraries)) {
      await expect(
        dock.getByRole('button', { name: label, exact: true })
      ).toBeVisible();

      const counts = await kit.page.evaluate(
        async ({ handle, dockKey }) => {
          const entry = handle.cesdk.ui
            .getComponentOrder({ in: 'ly.img.dock' })
            .find((item: { key?: string }) => item.key === dockKey) as {
            entries: string[];
          };
          // A library entry may give its sources as a function of the editor.
          const sourcesOf = (ids: unknown): string[] =>
            typeof ids === 'function'
              ? ids({ engine: handle.engine, cesdk: handle.cesdk })
              : ((ids as string[] | undefined) ?? []);
          return Promise.all(
            entry.entries.map(async (id) => {
              const sources = sourcesOf(
                handle.cesdk.ui.getAssetLibraryEntry(id)?.sourceIds
              );
              const totals = await Promise.all(
                sources.map(
                  async (sourceId) =>
                    (
                      await handle.engine.asset.findAssets(sourceId, {
                        page: 0,
                        perPage: 1
                      })
                    ).total
                )
              );
              return { id, total: totals.reduce((sum, n) => sum + n, 0) };
            })
          );
        },
        { handle: kit.editor, dockKey: key }
      );
      // An upload library starts empty until the user uploads.
      const libraryTotals = counts.filter(({ id }) => !id.endsWith('.upload'));
      for (const { id, total } of libraryTotals) {
        expect(total, `${label}: ${id}`).toBeGreaterThan(0);
      }
    }
  });
});
