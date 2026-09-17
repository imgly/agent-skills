import { expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';
import { ModerationSidebar, stubModeration } from './sidebar';

/** The scene decides how many images the check reports on. */
function imageBlocks(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<number[]> {
  return page.evaluate(
    (handle) => handle.engine.block.findByKind('image'),
    editor
  );
}

const CLEAN = { weapon: 0.1, alcohol: 0.1, drugs: 0.1, nudity: { safe: 1 } };
const FLAGGED = {
  weapon: 0.9,
  alcohol: 0.1,
  drugs: 0.5,
  nudity: { safe: 0.95 }
};

test.describe('Content moderation', () => {
  test('CM-01 default state', async ({ kit }) => {
    const sidebar = new ModerationSidebar(kit.page);
    let requests = 0;
    await kit.page.route('**/sightengineApiProxy*', (route) => {
      requests += 1;
      return route.fulfill({ status: 200, body: '{}' });
    });

    await expect(sidebar.validateButton).toBeEnabled();
    await expect(sidebar.validateButton).toHaveText('Validate Content');
    await expect(sidebar.count).toHaveText('0 results');
    await expect(sidebar.emptyText).toHaveText(
      'No check has been performed yet.'
    );
    expect(requests).toBe(0);
  });

  test('CM-02 validate with findings', async ({ kit }) => {
    const sidebar = new ModerationSidebar(kit.page);
    await stubModeration(kit.page, FLAGGED);

    const images = await imageBlocks(kit.page, kit.editor);

    await sidebar.validateButton.click();

    // Weapons is failed and Drugs is a warning, for every image in the scene.
    await expect(sidebar.count).toHaveText(`${images.length * 2} results`);
    await expect(sidebar.row('Weapons')).toHaveCount(images.length);
    await expect(sidebar.row('Drugs')).toHaveCount(images.length);
    await expect(sidebar.row('Alcohol')).toHaveCount(0);
    await expect(sidebar.row('Nudity')).toHaveCount(0);
    await expect(sidebar.validateButton).toHaveText('Validate Content');
  });

  test('CM-03 category tooltips', async ({ kit }) => {
    const sidebar = new ModerationSidebar(kit.page);
    await stubModeration(kit.page, FLAGGED);
    await sidebar.validateButton.click();
    await expect(sidebar.count).not.toHaveText('0 results');

    const weapons = kit.page.getByText(
      'Handguns, rifles, machine guns, threatening knives...'
    );
    const drugs = kit.page.getByText(
      'Cannabis, syringes, glass pipes, bongs, pills...'
    );

    await sidebar.infoIcon('Weapons').hover();
    await expect(weapons).toBeVisible();

    await sidebar.validateButton.hover();
    await expect(weapons).toBeHidden();

    await sidebar.infoIcon('Drugs').hover();
    await expect(drugs).toBeVisible();
    await expect(weapons).toBeHidden();
  });

  test('CM-04 select a flagged block', async ({ kit }) => {
    const sidebar = new ModerationSidebar(kit.page);
    await stubModeration(kit.page, FLAGGED);
    const images = await imageBlocks(kit.page, kit.editor);
    await sidebar.validateButton.click();
    await expect(sidebar.count).toHaveText(`${images.length * 2} results`);

    const selected = () =>
      kit.page.evaluate(
        (handle) => handle.engine.block.findAllSelected(),
        kit.editor
      );

    // The rows are grouped per image: the first two both describe image one.
    await sidebar.selectButtons.first().click();
    expect(await selected()).toEqual([images[0]]);

    await sidebar.selectButtons.nth(2).click();
    expect(await selected()).toEqual([images[1]]);
  });

  test('CM-05 a clean design', async ({ kit }) => {
    const sidebar = new ModerationSidebar(kit.page);
    await stubModeration(kit.page, CLEAN);

    await sidebar.validateButton.click();

    await expect(sidebar.count).toHaveText('0 results');
    await expect(sidebar.emptyText).toContainText(
      'No content violations found.'
    );
  });

  test.describe('CM-06 a failing service', () => {
    // The stubbed 500 is the test's own doing, so its network line is allowed
    // here and nowhere else.
    test.use({
      consoleErrorAllowlist: [
        /responded with a status of 500 .*sightengineApiProxy/
      ]
    });

    test('CM-06 keeps the previous results and does not break', async ({
      kit
    }) => {
      const sidebar = new ModerationSidebar(kit.page);
      await stubModeration(kit.page, FLAGGED);
      const images = await imageBlocks(kit.page, kit.editor);
      await sidebar.validateButton.click();
      const found = `${images.length * 2} results`;
      await expect(sidebar.count).toHaveText(found);

      await kit.page.unrouteAll();
      await stubModeration(kit.page, 500);
      await sidebar.validateButton.click();

      await expect(sidebar.error).toHaveText(
        'The moderation check failed. Try again.'
      );
      await expect(sidebar.validateButton).toHaveText('Validate Content');
      await expect(sidebar.count).toHaveText(found);
    });
  });
});
