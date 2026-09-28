import { editorPanel } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

export const PANEL_ID = '//ly.img.panel/export-print-ready-pdf';

/** The kit's own export panel and the navigation-bar button that opens it. */
export class ExportPanel {
  constructor(private readonly page: Page) {}

  get navigationBarButton(): Locator {
    return this.page.getByRole('button', { name: 'Export', exact: true });
  }

  get root(): Locator {
    return editorPanel(this.page, PANEL_ID);
  }

  get exportButton(): Locator {
    return this.root.getByRole('button', { name: 'Export PDF', exact: true });
  }

  get bleedCheckbox(): Locator {
    return this.root.getByRole('checkbox', { name: 'Include Bleed' });
  }

  /** The number input carries no accessible name; it is the panel's only one. */
  get bleedMargin(): Locator {
    return this.root.getByRole('spinbutton');
  }

  /** The text input carries no accessible name; it is the panel's only one. */
  get pageRange(): Locator {
    return this.root.getByRole('textbox');
  }

  /** The line under the page range: the format hint, or the parse error. */
  get pageRangeHint(): Locator {
    return this.root.getByRole('paragraph');
  }

  pagesButton(label: 'All' | 'Custom'): Locator {
    return this.root.getByRole('button', { name: label, exact: true });
  }

  /** A Select renders as a button whose accessible name is its current value. */
  selectWithValue(value: string): Locator {
    return this.root.getByRole('button', { name: value, exact: true });
  }

  async open(): Promise<void> {
    await this.navigationBarButton.click();
    await this.root.waitFor();
  }

  async choose(currentValue: string, nextValue: string): Promise<void> {
    await this.selectWithValue(currentValue).click();
    await this.page
      .getByRole('option', { name: nextValue, exact: true })
      .click();
    await this.selectWithValue(nextValue).waitFor();
  }
}
