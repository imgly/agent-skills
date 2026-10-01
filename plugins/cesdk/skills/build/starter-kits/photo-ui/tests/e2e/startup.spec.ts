import { expect, test } from '@imgly/kit-test-harness';

import { pageFillURI } from './photo-ui';

test('PH-01 the editor loads with the landscape photo', async ({ kit }) => {
  const scene = await kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    return {
      pages: handle.engine.scene.getPages().length,
      designUnit: handle.engine.block.getEnum(
        handle.engine.scene.get(),
        'scene/designUnit'
      ),
      width: handle.engine.block.getWidth(page),
      height: handle.engine.block.getHeight(page)
    };
  }, kit.editor);

  expect(scene.pages).toBe(1);
  expect(scene.designUnit).toBe('Pixel');
  // The page is sized to the photo, so it is wider than it is tall.
  expect(scene.width).toBeGreaterThan(scene.height);

  expect(await pageFillURI(kit)).toMatch(/mountains\.jpg$/);

  for (const name of ['Image 0', 'Image 1', 'Image 2']) {
    await expect(kit.page.getByRole('button', { name })).toBeVisible();
  }
  await expect(
    kit.page.getByRole('heading', { name: 'Select Image' })
  ).toBeVisible();
  for (const name of ['Crop', 'Adjust', 'Filter', 'Export Image']) {
    await expect(
      kit.page.getByRole('button', { name, exact: true })
    ).toBeVisible();
  }
});
