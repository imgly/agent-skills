import { expect, test } from '@imgly/kit-test-harness';

import { ResizingKit, firstText, setFirstText } from './kit';

test.describe('Template editor', () => {
  test('AR-03 Edit opens the advanced editor', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    const editor = await kit.openTemplateEditor();

    expect(
      await page.evaluate((handle) => handle.cesdk.ui.getTheme(), editor)
    ).toBe('dark');

    await expect(kit.editorCloseButton).toBeVisible();
    await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Redo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zoom In' })).toBeVisible();
    await expect(kit.editorSaveButton).toBeVisible();
    await expect(kit.editorActionsDropdown).toBeVisible();

    // The advanced config leaves `ly.img.navigation.documentSettings` off, so
    // the navigation bar has no document settings button.
    await expect(
      page.getByRole('button', { name: 'Document Settings' })
    ).toHaveCount(0);

    await editor.dispose();
  });

  test('AR-06 save or discard a template edit', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    const editor = await kit.openTemplateEditor();
    const original = await firstText(page, editor);
    await setFirstText(page, editor, 'SAVED TEMPLATE');
    await editor.dispose();

    await kit.editorSaveButton.click();
    await kit.editorCloseButton.waitFor({ state: 'detached' });

    await kit.generate();
    const variantEditor = await kit.openVariantEditor(0);
    expect(await firstText(page, variantEditor)).toBe('SAVED TEMPLATE');
    await variantEditor.dispose();
    await kit.closeEditorWithoutSaving();

    // Second round: edit, then close without saving.
    const discarded = await kit.openTemplateEditor();
    expect(await firstText(page, discarded)).toBe('SAVED TEMPLATE');
    await setFirstText(page, discarded, 'DISCARDED');
    await discarded.dispose();
    await kit.closeEditorWithoutSaving();

    await kit.generate();
    const afterDiscard = await kit.openVariantEditor(0);
    expect(await firstText(page, afterDiscard)).toBe('SAVED TEMPLATE');
    expect(await firstText(page, afterDiscard)).not.toBe(original);
    await afterDiscard.dispose();
  });
});
