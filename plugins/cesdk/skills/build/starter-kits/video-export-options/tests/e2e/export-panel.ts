import { editorPanel } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

export type Resolution =
  | 'High Definition (HD)'
  | 'Full HD (FHD)'
  | 'Quad HD (2K)'
  | 'Ultra HD (4K)'
  | 'Custom';

export type Fps = '24 FPS' | '30 FPS' | '60 FPS' | '120 FPS';

/**
 * The kit's export panel.
 *
 * Role locators throughout, except the builder Selects and NumberInputs: their
 * accessible name is their current value, so there is no stable role+name
 * locator for them, and the panel's own Export Video button carries the same
 * label as the one the kit puts in the navigation bar.
 */
export class ExportPanel {
  constructor(private readonly page: Page) {}

  get root(): Locator {
    return editorPanel(this.page, '//ly.img.panel/video-export');
  }

  get title(): Locator {
    return this.root.getByRole('heading', { name: 'Export Video' });
  }

  get formatNote(): Locator {
    return this.root.getByText('Videos are exported as MP4 with H.264 Codec', {
      exact: true
    });
  }

  get exportButton(): Locator {
    return this.root.locator(
      '[data-cy="PanelBuilder-Button-export-video-button"]'
    );
  }

  get navigationBarExportButton(): Locator {
    return this.page.locator(
      '[name="NavigationBarBuilder-Button-export-video-button"]'
    );
  }

  get fpsSelect(): Locator {
    return this.root.locator('[data-cy="PanelBuilder-Select-fps-select"]');
  }

  get resolutionSelect(): Locator {
    return this.root.locator(
      '[data-cy="PanelBuilder-Select-resolution-select"]'
    );
  }

  get customHeight(): Locator {
    return this.root.locator(
      '[name="PanelBuilder-NumberInput-custom-resolution-height"]'
    );
  }

  get customWidth(): Locator {
    return this.root.locator(
      '[name="PanelBuilder-NumberInput-custom-resolution-width"]'
    );
  }

  /** The editor's "Export complete" dialog, which covers the panel until it is closed. */
  get exportDialog(): Locator {
    return this.page.getByRole('alertdialog');
  }

  async closeExportDialog(): Promise<void> {
    await this.exportDialog.getByRole('button', { name: 'Close' }).click();
    await this.exportDialog.waitFor({ state: 'hidden' });
  }

  errorMessage(text: string): Locator {
    return this.root.getByText(text, { exact: true });
  }

  async isOpen(): Promise<boolean> {
    return this.page.evaluate(() =>
      (
        window as unknown as {
          cesdk: { ui: { isPanelOpen(id: string): boolean } };
        }
      ).cesdk.ui.isPanelOpen('//ly.img.panel/video-export')
    );
  }

  async listResolutions(): Promise<string[]> {
    await this.resolutionSelect.click();
    // `allInnerTexts` does not auto-wait, so it reads `[]` when the listbox has
    // not rendered yet.
    await this.page.getByRole('option').first().waitFor();
    const options = await this.page.getByRole('option').allInnerTexts();
    await this.page.keyboard.press('Escape');
    return options.map((option) => option.trim());
  }

  async setResolution(resolution: Resolution): Promise<void> {
    await this.resolutionSelect.click();
    await this.page
      .getByRole('option', { name: resolution, exact: true })
      .click();
  }

  async setFps(fps: Fps): Promise<void> {
    await this.fpsSelect.click();
    await this.page.getByRole('option', { name: fps, exact: true }).click();
  }

  /** Set a number input and commit the value, which the builder clamps to its range. */
  async setNumber(input: Locator, value: number): Promise<void> {
    await input.fill(String(value));
    await input.press('Enter');
  }
}
