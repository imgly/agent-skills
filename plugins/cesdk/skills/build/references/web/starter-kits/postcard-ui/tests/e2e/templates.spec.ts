import { expect, test } from '@imgly/kit-test-harness';
import { POSTCARD_TEMPLATES } from '@/imgly/postcard-catalog';
import { chooseTemplate, openTemplate } from './postcard';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

test('PC-01 the four templates open', async ({ page }) => {
  await page.goto('./');
  const names = Object.values(POSTCARD_TEMPLATES).map(
    (template) => template.name
  );
  expect(names).toEqual([
    'Thank you',
    'Merry Christmas',
    'Bonjour Paris',
    'Wish you were here'
  ]);
  for (const name of names) {
    await expect(
      page.getByRole('button', { name: `Choose ${name} Template` })
    ).toBeVisible();
  }

  for (const name of names) {
    if (name !== names[0]) await page.goto('./');
    const editor = await chooseTemplate(page, name);
    const scene = await page.evaluate((handle) => {
      const engine = handle.engine;
      const pages = engine.scene.getPages();
      return {
        pages: pages.length,
        names: pages.map((id: number) => engine.block.getName(id)),
        visible: pages.map((id: number) => engine.block.isVisible(id))
      };
    }, editor);
    expect(scene.pages).toBe(2);
    expect(scene.names).toEqual(['Background', 'Back']);
    expect(scene.visible).toEqual([true, false]);
    await editor.dispose();
  }
});

test('PC-02 Style is reachable again', async ({ page }) => {
  await page.goto('./');
  // The Style step renders the template grid alone: there is no navigation to
  // disable until a template has been chosen.
  for (const step of ['Design', 'Write']) {
    await expect(page.getByRole('button', { name: step })).toHaveCount(0);
  }

  await chooseTemplate(page);
  await expect(page.getByRole('button', { name: 'Design' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Write' })).toBeEnabled();

  await page.getByRole('button', { name: 'Style' }).click();
  await expect(
    page.getByRole('button', { name: 'Choose Thank you Template' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export' })).toHaveCount(0);
});

test('PC-02b the steps lock while the editor is cropping', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.evaluate((handle) => {
    const engine = handle.engine;
    const image = engine.block
      .getChildren(engine.scene.getPages()[0])
      .find((id: number) => engine.block.getKind(id) === 'image');
    engine.block.setSelected(image, true);
  }, editor);

  // Crop stays disabled while the block is still a placeholder.
  await page.getByRole('button', { name: 'sample asset' }).first().click();
  await expect(page.getByRole('button', { name: 'Crop' })).toBeEnabled();

  await page.getByRole('button', { name: 'Crop' }).click();
  for (const step of ['Style', 'Design', 'Write']) {
    await expect(page.getByRole('button', { name: step })).toBeDisabled();
  }

  await page.getByRole('button', { name: 'Crop' }).click();
  await expect(page.getByRole('button', { name: 'Write' })).toBeEnabled();
});
