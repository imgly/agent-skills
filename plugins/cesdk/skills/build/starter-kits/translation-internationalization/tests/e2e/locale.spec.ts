import { expect, test } from './fixtures';
import { LocaleSwitcher } from './locale-switcher';

test.describe('Locale switching', () => {
  test('TI-04 German', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);

    await kit.page.evaluate(() => {
      (window as any).__editorBeforeSwitch = (window as any).cesdk;
    });

    await switcher.localeButton('German').click();

    await expect
      .poll(() =>
        kit.page.evaluate(({ cesdk }) => cesdk.i18n.getLocale(), kit.editor)
      )
      .toBe('de');
    expect(await switcher.isActive(switcher.localeButton('German'))).toBe(true);
    await expect(switcher.imagesDockEntry('Bilder')).toBeVisible();
    await expect(switcher.imagesDockEntry('Images')).toHaveCount(0);

    expect(
      await kit.page.evaluate(
        () => (window as any).__editorBeforeSwitch === (window as any).cesdk
      )
    ).toBe(true);
  });

  test('TI-05 back to English', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);

    await switcher.localeButton('German').click();
    await expect(switcher.imagesDockEntry('Bilder')).toBeVisible();

    await switcher.localeButton('English').click();

    await expect
      .poll(() =>
        kit.page.evaluate(({ cesdk }) => cesdk.i18n.getLocale(), kit.editor)
      )
      .toBe('en');
    expect(await switcher.isActive(switcher.localeButton('English'))).toBe(
      true
    );
    await expect(switcher.imagesDockEntry('Images')).toBeVisible();
  });

  test('TI-06 switching keeps the document', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);

    const before = await kit.page.evaluate(({ engine }) => {
      const [page] = engine.scene.getPages();
      const block = engine.block.create('graphic');
      engine.block.appendChild(page, block);
      engine.block.setSelected(block, true);
      return { block, blocks: engine.block.findAll().length };
    }, kit.editor);

    await switcher.localeButton('German').click();
    await expect
      .poll(() =>
        kit.page.evaluate(({ cesdk }) => cesdk.i18n.getLocale(), kit.editor)
      )
      .toBe('de');

    const after = await kit.page.evaluate(
      ({ engine }) => ({
        blocks: engine.block.findAll().length,
        selected: engine.block.findAllSelected()
      }),
      kit.editor
    );

    expect(after.blocks).toBe(before.blocks);
    expect(after.selected).toEqual([before.block]);
  });
});
