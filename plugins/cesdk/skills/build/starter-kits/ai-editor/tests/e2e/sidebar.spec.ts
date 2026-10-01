import { expect, test } from './fixtures';
import {
  applyChanges,
  capabilityGroup,
  expandCapability,
  providerCheckbox,
  switchMode,
  toggleProvider,
  type EditorMode
} from './modes';

const GROUPS: Record<EditorMode, string[]> = {
  Design: ['Text to Text', 'Text to Image', 'Image to Image'],
  Video: [
    'Text to Text',
    'Text to Image',
    'Image to Image',
    'Text to Video',
    'Image to Video',
    'Text to Speech'
  ],
  Photo: ['Image to Image']
};

test.describe('The AI Models sidebar', () => {
  test('AIE-07 the panel sits right of the editor', async ({ kit }) => {
    for (const mode of ['Design', 'Video', 'Photo'] as EditorMode[]) {
      if (mode !== 'Design') {
        const editor = await switchMode(kit.page, mode);
        await editor.dispose();
      }
      await expect(kit.page.getByText('AI Models')).toBeVisible();

      // The editor has no accessible container of its own; it is the only
      // element on the page that hosts a shadow root.
      const layout = await kit.page.evaluate(() => {
        const host = Array.from(document.querySelectorAll('*')).find(
          (element) => element.shadowRoot != null
        )!;
        const panel = Array.from(document.querySelectorAll('div')).find(
          (element) => element.textContent?.trim() === 'AI Models'
        )!;
        return {
          editorRight: host.getBoundingClientRect().right,
          panelLeft: panel.getBoundingClientRect().left
        };
      });

      expect(
        layout.panelLeft,
        `${mode}: the sidebar starts right of the editor`
      ).toBeGreaterThanOrEqual(layout.editorRight);
    }
  });

  test('AIE-08 each mode lists its own model groups', async ({ kit }) => {
    for (const mode of ['Design', 'Video', 'Photo'] as EditorMode[]) {
      if (mode !== 'Design') {
        const editor = await switchMode(kit.page, mode);
        await editor.dispose();
      }
      for (const group of GROUPS[mode]) {
        await expect(
          capabilityGroup(kit.page, group),
          `${mode} offers ${group}`
        ).toBeVisible();
      }
      // `CURATED_MODELS.text2sound` is empty, so the capability never
      // reaches the sidebar, not even in Video mode.
      await expect(capabilityGroup(kit.page, 'Text to Sound')).toHaveCount(0);
    }
  });

  test('AIE-09 groups start collapsed and toggle', async ({ kit }) => {
    const image = capabilityGroup(kit.page, 'Image to Image');
    const text = capabilityGroup(kit.page, 'Text to Image');

    await expect(image).toHaveAttribute('aria-expanded', 'false');
    await expect(text).toHaveAttribute('aria-expanded', 'false');

    await image.click();
    await expect(image).toHaveAttribute('aria-expanded', 'true');
    await expect(text).toHaveAttribute('aria-expanded', 'false');
    await expect(providerCheckbox(kit.page, 'Flux 2 Edit')).toHaveCount(1);

    await image.click();
    await expect(image).toHaveAttribute('aria-expanded', 'false');
    await expect(providerCheckbox(kit.page, 'Flux 2 Edit')).toHaveCount(0);
  });

  test('AIE-10 a selection is local until Apply Changes', async ({ kit }) => {
    const apply = kit.page.getByRole('button', { name: 'Apply Changes' });
    await expect(apply).toBeDisabled();

    await expandCapability(kit.page, 'Image to Image');
    await expect(capabilityGroup(kit.page, 'Image to Image')).toContainText(
      '1/2'
    );

    await toggleProvider(kit.page, 'Second Edit');
    await expect(apply).toBeEnabled();
    await expect(capabilityGroup(kit.page, 'Image to Image')).toContainText(
      '2/2'
    );

    await toggleProvider(kit.page, 'Second Edit');
    await expect(apply).toBeDisabled();

    await toggleProvider(kit.page, 'Second Edit');
    const editor = await applyChanges(kit.page);
    await expect(apply).toBeDisabled();
    await editor.dispose();
  });

  test('AIE-11 deselecting every model removes the AI entry points', async ({
    kit
  }) => {
    const photo = await switchMode(kit.page, 'Photo');
    await photo.dispose();
    await expect(
      kit.page.getByRole('button', { name: 'AI Edit' })
    ).toBeVisible();

    await expandCapability(kit.page, 'Image to Image');
    await toggleProvider(kit.page, 'Flux 2 Edit');
    const editor = await applyChanges(kit.page);

    // `AiPhotoEditConfig.initialize` returns before it registers anything
    // when no image2image provider is selected.
    await expect(kit.page.getByRole('button', { name: 'AI Edit' })).toHaveCount(
      0
    );
    await expect(kit.page.getByRole('button', { name: 'Crop' })).toBeVisible();
    await editor.dispose();
  });
});
