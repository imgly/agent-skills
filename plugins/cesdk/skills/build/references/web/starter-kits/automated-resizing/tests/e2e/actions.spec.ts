import { download, expect, test } from '@imgly/kit-test-harness';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { ResizingKit, firstText, setFirstText } from './kit';

const TEMPLATE_2 = resolve(
  __dirname,
  '../../../../../packages/cesdk-web-examples-data/data/starterkit-automated-resizing/example-2.scene'
);

/** Write a downloaded file to disk so the editor's file picker can take it. */
function toDisk(name: string, bytes: Buffer): string {
  const path = join(mkdtempSync(join(tmpdir(), 'ar-actions-')), name);
  writeFileSync(path, bytes);
  return path;
}

test.describe('Template editor actions', () => {
  test('AR-08 export and import a scene', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    const editor = await kit.openTemplateEditor();
    await setFirstText(page, editor, 'EXPORTED');

    await kit.editorActionsDropdown.click();
    const menu = page.getByRole('menu');
    // The advanced config's dropdown carries the scene export and the import
    // only; Save is hoisted out as the primary button next to it.
    await expect(menu.getByRole('button')).toHaveText([
      'Export Design',
      'Import'
    ]);

    const [sceneFile] = await download(page, () =>
      menu.getByRole('button', { name: 'Export Design' }).click()
    );
    // "Export Design" downloads the scene, not an image: known issue 9.
    expect(sceneFile.buffer.subarray(0, 3).toString('utf8')).toBe('UBQ');

    // Import the scene that was just exported.
    await setFirstText(page, editor, 'REPLACED BEFORE IMPORT');
    const scenePath = toDisk('template.scene', sceneFile.buffer);
    await kit.editorActionsDropdown.click();
    const chooser = page.waitForEvent('filechooser');
    await page
      .getByRole('menu')
      .getByRole('button', { name: 'Import' })
      .click();
    await (await chooser).setFiles(scenePath);

    await expect
      .poll(() => firstText(page, editor), { timeout: 60_000 })
      .toBe('EXPORTED');

    // Import an archive of the same scene.
    const archive: Buffer = Buffer.from(
      await page.evaluate(async (handle) => {
        const blob = await handle.engine.scene.saveToArchive();
        return [...new Uint8Array(await blob.arrayBuffer())];
      }, editor)
    );
    expect(archive.subarray(0, 2).toString('utf8')).toBe('PK');

    await setFirstText(page, editor, 'REPLACED BEFORE ARCHIVE');
    const archivePath = toDisk('template.zip', archive);
    await kit.editorActionsDropdown.click();
    const archiveChooser = page.waitForEvent('filechooser');
    await page
      .getByRole('menu')
      .getByRole('button', { name: 'Import' })
      .click();
    await (await archiveChooser).setFiles(archivePath);

    await expect
      .poll(() => firstText(page, editor), { timeout: 60_000 })
      .toBe('EXPORTED');

    await editor.dispose();
  });

  test('AR-08b an imported scene is edited on the canvas', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    const editor = await kit.openTemplateEditor();
    const before = await firstText(page, editor);

    await kit.editorActionsDropdown.click();
    const chooser = page.waitForEvent('filechooser');
    await page
      .getByRole('menu')
      .getByRole('button', { name: 'Import' })
      .click();
    await (await chooser).setFiles(TEMPLATE_2);
    await expect
      .poll(() => firstText(page, editor), { timeout: 60_000 })
      .not.toBe(before);

    expect(
      await page.evaluate((handle) => handle.engine.editor.getRole(), editor)
    ).toBe('Creator');

    const text = await page.evaluate(
      (handle) => handle.engine.block.findByType('text')[0],
      editor
    );
    const centre = () =>
      page.evaluate(
        ({ handle, id }) => {
          const [x, y, width, height] =
            handle.engine.block.getScreenSpaceBoundingBoxXYWH([id]);
          const canvas = handle.engine.element.getBoundingClientRect();
          return { x: canvas.x + x + width / 2, y: canvas.y + y + height / 2 };
        },
        { handle: editor, id: text }
      );

    await expect
      .poll(async () => {
        const { x, y } = await centre();
        await page.mouse.dblclick(x, y);
        return page.evaluate(
          (handle) => handle.engine.editor.getEditMode(),
          editor
        );
      })
      .toBe('Text');
    expect(
      await page.evaluate(
        ({ handle, id }) => handle.engine.block.isSelected(id),
        { handle: editor, id: text }
      )
    ).toBe(true);

    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type('CANVAS EDIT', { delay: 40 });
    await expect.poll(() => firstText(page, editor)).toBe('CANVAS EDIT');

    await editor.dispose();
  });
});
