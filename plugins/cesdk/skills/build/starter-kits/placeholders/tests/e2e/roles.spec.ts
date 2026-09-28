import {
  actionsMenu,
  download,
  expect,
  pdfPageCount,
  pngSize,
  test
} from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';
import { blockNames, RoleSwitcher } from './roles';

const PROBED_SCOPES = [
  'editor/select',
  'layer/move',
  'fill/change',
  'lifecycle/destroy'
];

/** Add a shape to the page and return its block id. */
async function addShape(
  page: Page,
  editor: JSHandle<KitEditor>,
  name: string
): Promise<number> {
  return page.evaluate(
    ([handle, blockName]) => {
      const { block, scene } = (handle as KitEditor).engine;
      const shape = block.create('graphic');
      block.setShape(shape, block.createShape('rect'));
      block.setFill(shape, block.createFill('color'));
      block.setName(shape, blockName as string);
      block.setPositionX(shape, 100);
      block.setPositionY(shape, 100);
      block.setWidth(shape, 200);
      block.setHeight(shape, 200);
      block.appendChild(scene.getPages()[0], shape);
      return shape as number;
    },
    [editor, name] as const
  );
}

async function scopes(
  page: Page,
  editor: JSHandle<KitEditor>,
  name: string,
  probed: string[]
): Promise<string[]> {
  return page.evaluate(
    ([handle, blockName, list]) => {
      const { block, scene } = (handle as KitEditor).engine;
      const target = block
        .getChildren(scene.getPages()[0])
        .find((id: number) => block.getName(id) === blockName);
      return (list as string[]).filter((scope) =>
        block.isAllowedByScope(target, scope)
      );
    },
    [editor, name, probed] as const
  );
}

function theme(page: Page, editor: JSHandle<KitEditor>): Promise<string> {
  return page.evaluate((handle) => handle.cesdk.ui.getTheme(), editor);
}

test.describe('Roles and placeholders', () => {
  test('PH-01 the kit starts in Creator', async ({ kit }) => {
    const switcher = new RoleSwitcher(kit.page);

    await expect(switcher.button('Creator')).toBeVisible();
    await expect(switcher.button('Adopter')).toBeVisible();
    // The selected role is a CSS-module class only (known issue 4).
    await expect(switcher.button('Creator')).toHaveClass(/active/);
    await expect(switcher.button('Adopter')).not.toHaveClass(/active/);

    expect(
      await kit.page.evaluate(
        (handle) => handle.engine.editor.getRole(),
        kit.editor
      )
    ).toBe('Creator');
    expect(await theme(kit.page, kit.editor)).toBe('dark');

    await expect(
      kit.page.getByRole('button', { name: 'Undo', exact: true })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Export Images', exact: true })
    ).toBeVisible();
    await expect(actionsMenu(kit.page)).toBeVisible();
  });

  test('PH-02 an element with no placeholder', async ({ kit }) => {
    const switcher = new RoleSwitcher(kit.page);
    await addShape(kit.page, kit.editor, 'Plain shape');

    const adopter = await switcher.switchTo('Adopter');

    expect(await blockNames(kit.page, adopter)).toContain('Plain shape');
    expect(
      await scopes(kit.page, adopter, 'Plain shape', PROBED_SCOPES)
    ).toEqual([]);
  });

  test('PH-03 an element marked as a placeholder', async ({ kit }) => {
    const switcher = new RoleSwitcher(kit.page);
    const shape = await addShape(kit.page, kit.editor, 'Placeholder shape');
    await kit.page.evaluate(
      ([handle, id]) =>
        (handle as KitEditor).engine.block.setPlaceholderEnabled(
          id as number,
          true
        ),
      [kit.editor, shape] as const
    );

    const adopter = await switcher.switchTo('Adopter');

    expect(
      await scopes(kit.page, adopter, 'Placeholder shape', PROBED_SCOPES)
    ).toEqual(['editor/select']);

    await kit.page.evaluate((handle) => {
      const { block, scene } = handle.engine;
      block
        .findAllSelected()
        .forEach((id: number) => block.setSelected(id, false));
      const target = block
        .getChildren(scene.getPages()[0])
        .find((id: number) => block.getName(id) === 'Placeholder shape');
      block.setSelected(target, true);
    }, adopter);
    expect(
      await kit.page.evaluate(
        (handle) => handle.engine.block.findAllSelected().length,
        adopter
      )
    ).toBe(1);
    expect(
      await kit.page.evaluate(
        (handle) =>
          handle.engine.block.getName(handle.engine.block.findAllSelected()[0]),
        adopter
      )
    ).toBe('Placeholder shape');
  });

  test('PH-04 changing a placeholder scope', async ({ kit }) => {
    const switcher = new RoleSwitcher(kit.page);
    const shape = await addShape(kit.page, kit.editor, 'Scoped shape');
    await kit.page.evaluate(
      ([handle, id]) =>
        (handle as KitEditor).engine.block.setPlaceholderEnabled(
          id as number,
          true
        ),
      [kit.editor, shape] as const
    );

    const adopter = await switcher.switchTo('Adopter');
    const before = await scopes(
      kit.page,
      adopter,
      'Scoped shape',
      PROBED_SCOPES
    );

    const creator = await switcher.switchTo('Creator');
    await kit.page.evaluate((handle) => {
      const { block, scene } = handle.engine;
      const target = block
        .getChildren(scene.getPages()[0])
        .find((id: number) => block.getName(id) === 'Scoped shape');
      block.setScopeEnabled(target, 'layer/move', true);
    }, creator);

    const again = await switcher.switchTo('Adopter');
    const after = await scopes(kit.page, again, 'Scoped shape', PROBED_SCOPES);

    expect(before).not.toContain('layer/move');
    expect(after).toContain('layer/move');
    expect(after).not.toContain('lifecycle/destroy');
  });

  test('PH-05 the role switch keeps the design', async ({ kit }) => {
    const switcher = new RoleSwitcher(kit.page);
    await addShape(kit.page, kit.editor, 'Survives the switch');

    const adopter = await switcher.switchTo('Adopter');
    expect(await blockNames(kit.page, adopter)).toContain(
      'Survives the switch'
    );
    expect(await theme(kit.page, adopter)).toBe('light');
    await expect(switcher.button('Adopter')).toHaveClass(/active/);

    const creator = await switcher.switchTo('Creator');
    expect(await blockNames(kit.page, creator)).toContain(
      'Survives the switch'
    );
    expect(await theme(kit.page, creator)).toBe('dark');
  });

  test('PH-06a export an image from Adopter', async ({ kit }) => {
    const switcher = new RoleSwitcher(kit.page);
    const adopter = await switcher.switchTo('Adopter');

    const pageAspect = await kit.page.evaluate((handle) => {
      const page = handle.engine.scene.getPages()[0];
      return (
        handle.engine.block.getWidth(page) / handle.engine.block.getHeight(page)
      );
    }, adopter);

    const [png] = await download(kit.page, () =>
      kit.page
        .getByRole('button', { name: 'Export Images', exact: true })
        .click()
    );

    expect(png.name).toMatch(/\.png$/);
    // The navigation bar entry runs `exportDesign`, which sends no target
    // size, so the page's own pixel size decides.
    const size = pngSize(png.buffer);
    expect(size.width / size.height).toBeCloseTo(pageAspect, 2);
  });

  test('PH-06b export a PDF from Adopter', async ({ kit }) => {
    const switcher = new RoleSwitcher(kit.page);
    await switcher.switchTo('Adopter');

    await actionsMenu(kit.page).click();
    const menuButtons = kit.page.getByRole('menu').getByRole('button');
    await expect(menuButtons).toHaveText(['Export PDF']);

    const [pdf] = await download(kit.page, () => menuButtons.first().click());

    expect(pdf.name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(pdf.buffer)).toBe(1);
  });
});
