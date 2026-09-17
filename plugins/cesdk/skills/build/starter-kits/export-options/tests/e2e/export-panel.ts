import { editorPanel } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

export type Format = 'JPEG' | 'PNG' | 'PDF';
export type Quality = 'Low' | 'Medium' | 'High' | 'Very High' | 'Maximum';
export type Resolution = 'Small' | 'Original' | 'Large' | 'Huge' | 'Custom';

/**
 * The kit's export panel.
 *
 * Role locators inside the panel, which itself is located by its shortcut
 * scope. The two builder Selects and the two builder NumberInputs are the
 * exception: their accessible name is their current value, so there is no
 * stable role+name locator for them. Those use the builder's generated
 * `data-cy` / `name` attributes.
 */
export class ExportPanel {
  constructor(private readonly page: Page) {}

  get root(): Locator {
    return editorPanel(this.page, '//ly.img.panel/export');
  }

  get exportButton(): Locator {
    return this.root.getByRole('button', { name: 'Export Design' });
  }

  get navigationBarExportButton(): Locator {
    return this.page.getByRole('button', { name: 'Export', exact: true });
  }

  get formatDescription(): Locator {
    return this.root.locator('p').first();
  }

  get rangeInput(): Locator {
    return this.root.getByRole('textbox');
  }

  get rangeHint(): Locator {
    return this.root.getByText(
      /^(Invalid page range|No page in that range|e\.g\.:)/
    );
  }

  get sizeText(): Locator {
    return this.root.getByText(/^\d+ x \d+ px$/);
  }

  formatButton(format: Format): Locator {
    return this.root.getByRole('button', { name: format, exact: true });
  }

  pagesButton(mode: 'All' | 'Range'): Locator {
    return this.root.getByRole('button', { name: mode, exact: true });
  }

  get qualitySelect(): Locator {
    return this.root.locator('[data-cy="PanelBuilder-Select-quality"]');
  }

  get resolutionSelect(): Locator {
    return this.root.locator('[data-cy="PanelBuilder-Select-resolution"]');
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

  async selectFormat(format: Format): Promise<void> {
    await this.formatButton(format).click();
  }

  async setQuality(quality: Quality): Promise<void> {
    await this.qualitySelect.click();
    await this.page.getByRole('option', { name: quality, exact: true }).click();
  }

  async setResolution(resolution: Resolution): Promise<void> {
    await this.resolutionSelect.click();
    await this.page
      .getByRole('option', { name: resolution, exact: true })
      .click();
  }

  async setPageRange(range: string): Promise<void> {
    await this.pagesButton('Range').click();
    await this.rangeInput.fill(range);
    await this.rangeInput.blur();
  }

  /** Set a number input and commit the value, which the builder clamps to `max`. */
  async setNumber(input: Locator, value: number): Promise<void> {
    await input.fill(String(value));
    await input.press('Enter');
  }
}
