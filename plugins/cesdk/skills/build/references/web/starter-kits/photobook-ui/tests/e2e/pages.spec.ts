import { expect, test } from '@imgly/kit-test-harness';

import { currentPage, pageCount, pageOrder } from './photobook';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

test('PB-16 the trash button deletes the added page', async ({ kit }) => {
  const initial = await pageOrder(kit);

  await kit.page.getByRole('button', { name: 'Add Page' }).click();

  // Adding a page fetches and loads a template, so the click resolves long
  // before the page exists.
  await expect.poll(() => pageCount(kit)).toBe(initial.length + 1);
  const added = (await pageOrder(kit)).at(-1)!;
  await expect.poll(() => currentPage(kit)).toBe(added);
  const before = initial.length + 1;
  const previous = initial.at(-1);

  await kit.page.getByRole('button', { name: 'Delete page' }).click();

  await expect.poll(() => pageCount(kit)).toBe(before - 1);
  expect(await pageOrder(kit)).not.toContain(added);
  // The kit moves to the previous page before destroying the current one.
  expect(await currentPage(kit)).toBe(previous);

  // The button is conditional on the page count, not on the added page: the
  // scene's own pages allow `lifecycle/destroy` too.
  const scopes = await kit.page.evaluate(
    (handle) =>
      handle.engine.scene
        .getPages()
        .map((page: number) =>
          handle.engine.block.isScopeEnabled(page, 'lifecycle/destroy')
        ),
    kit.editor
  );
  expect(scopes.every(Boolean)).toBe(true);
});

test('PB-17 the up button moves a page towards the front', async ({ kit }) => {
  const order = await pageOrder(kit);
  const page2 = kit.page.getByRole('button', { name: 'Page 2' });
  // The rail reflows when a preview finishes rendering, which moves the
  // button under the pointer.
  await expect(page2.locator('img')).toBeVisible();
  await page2.click();
  await expect.poll(() => currentPage(kit)).toBe(order[1]);

  await kit.page.getByRole('button', { name: 'Move page up' }).click();

  await expect
    .poll(() => pageOrder(kit))
    .toEqual([order[1], order[0], ...order.slice(2)]);

  // Known issue 3: on the first page the button is a silent no-op, not disabled.
  await expect(
    kit.page.getByRole('button', { name: 'Move page up' })
  ).toBeEnabled();
  await kit.page.getByRole('button', { name: 'Move page up' }).click();
  await expect
    .poll(() => pageOrder(kit))
    .toEqual([order[1], order[0], ...order.slice(2)]);
});

test('PB-18 the down button moves a page towards the back', async ({ kit }) => {
  const order = await pageOrder(kit);
  await expect.poll(() => currentPage(kit)).toBe(order[0]);

  await kit.page.getByRole('button', { name: 'Move page down' }).click();

  await expect
    .poll(() => pageOrder(kit))
    .toEqual([order[1], order[0], ...order.slice(2)]);
});
