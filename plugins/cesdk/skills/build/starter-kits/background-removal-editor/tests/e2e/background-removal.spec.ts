import { expect, kitTestOutputDir, test } from '@imgly/kit-test-harness';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  REMOVAL_TIMEOUT,
  fillURIs,
  removeBackground,
  selectByKind
} from './editor';

// Outside the kit: the dev server watches it and would reload mid-run.
const uploadDir = kitTestOutputDir(resolve(__dirname, '..', '..'), 'uploads');

/** A 2 x 2 pixel image, small enough to inline and real enough to upload. */
const SAMPLES = {
  'sample.png':
    'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFUlEQVR4nGP8//8/AzJgYkAD5AsAAP//DwEBnsFT1AAAAABJRU5ErkJggg==',
  'sample.jpg':
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAACAAIBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=='
};

const BG_REMOVAL = { name: 'BG Removal' };

function writeSample(name: keyof typeof SAMPLES): string {
  mkdirSync(uploadDir, { recursive: true });
  const file = join(uploadDir, name);
  writeFileSync(file, Buffer.from(SAMPLES[name], 'base64'));
  return file;
}

test.describe('Background removal', () => {
  test('BGR-03 the canvas menu offers BG Removal on an image', async ({
    kit
  }) => {
    await selectByKind(kit.page, kit.editor, 'image');
    await expect(kit.page.getByRole('button', BG_REMOVAL)).toBeVisible();

    await selectByKind(kit.page, kit.editor, 'text');
    await expect(kit.page.getByRole('button', BG_REMOVAL)).toBeHidden();
  });

  test('BGR-04 background removal runs on the sample image', async ({
    kit
  }) => {
    test.setTimeout(REMOVAL_TIMEOUT + 60 * 1000);

    const block = await selectByKind(kit.page, kit.editor, 'image');
    const before = await removeBackground(kit.page, kit.editor, block);

    const after = await fillURIs(kit.page, kit.editor, block);
    expect(after).not.toEqual(before);
    expect(after.every((uri) => uri.startsWith('blob:'))).toBe(true);

    const selected = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );
    expect(selected).toEqual([block]);
  });

  test('BGR-05 an uploaded image is offered background removal', async ({
    kit
  }) => {
    for (const name of ['sample.png', 'sample.jpg'] as const) {
      await kit.page
        .getByRole('button', { name: 'Uploads', exact: true })
        .click();

      const chooser = kit.page.waitForEvent('filechooser');
      await kit.page.getByRole('button', { name: 'Add File' }).first().click();
      await (await chooser).setFiles(writeSample(name));

      const uploaded = kit.page
        .getByRole('complementary', { name: 'Uploads' })
        .getByRole('button', { name, exact: true });
      await expect(uploaded).toBeVisible();
      await uploaded.click();

      await expect(kit.page.getByRole('button', BG_REMOVAL)).toBeVisible();
    }

    const sources = await kit.page.evaluate(async (handle) => {
      const assets = await handle.engine.asset.findAssets(
        'ly.img.image.upload',
        { page: 0, perPage: 10 }
      );
      return assets.assets.length;
    }, kit.editor);
    expect(sources).toBe(2);
  });

  test('BGR-06 background removal applies to one image at a time', async ({
    kit
  }) => {
    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [first, second] = engine.block.findByKind('image');
      engine.block.setSelected(first, true);
      engine.block.setSelected(second, true);
    }, kit.editor);

    await expect(kit.page.getByRole('button', BG_REMOVAL)).toBeHidden();
  });

  test('BGR-07 a processed image stays editable', async ({ kit }) => {
    test.setTimeout(REMOVAL_TIMEOUT + 60 * 1000);

    const block = await selectByKind(kit.page, kit.editor, 'image');
    await removeBackground(kit.page, kit.editor, block);

    await expect(
      kit.page.getByRole('button', { name: 'Crop', exact: true })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Position', exact: true })
    ).toBeVisible();

    await kit.page.getByRole('button', { name: 'Style', exact: true }).click();
    for (const label of ['Adjustments', 'Filter', 'Effect', 'Blur']) {
      await expect(
        kit.page.getByRole('button', { name: label, exact: true })
      ).toBeVisible();
    }
    await kit.page.keyboard.press('Escape');

    const other = await selectByKind(kit.page, kit.editor, 'image', 1);
    expect(other).not.toBe(block);
    await expect(kit.page.getByRole('button', BG_REMOVAL)).toBeVisible();
  });

  test('BGR-08 undo and redo a background removal', async ({ kit }) => {
    test.setTimeout(REMOVAL_TIMEOUT + 60 * 1000);

    const block = await selectByKind(kit.page, kit.editor, 'image');
    const before = await removeBackground(kit.page, kit.editor, block);
    const processed = await fillURIs(kit.page, kit.editor, block);

    await kit.page.getByRole('button', { name: 'Undo' }).click();
    await expect
      .poll(() => fillURIs(kit.page, kit.editor, block))
      .toEqual(before);

    await kit.page.getByRole('button', { name: 'Redo' }).click();
    await expect
      .poll(() => fillURIs(kit.page, kit.editor, block))
      .toEqual(processed);
  });
});
