import { actionsMenu } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

const ACTIVE_CLASS = /_active_/;

/** The kit's locale switcher and the editor controls its cases reach. */
export class LocaleSwitcher {
  constructor(private readonly page: Page) {}

  localeButton(label: 'English' | 'German'): Locator {
    return this.page.getByRole('button', { name: label, exact: true });
  }

  imagesDockEntry(label: string): Locator {
    return this.page.getByRole('button', { name: label, exact: true });
  }

  get exportImageButton(): Locator {
    return this.page.getByRole('button', { name: 'Export Images' });
  }

  get actionsDropdown(): Locator {
    return actionsMenu(this.page);
  }

  get exportPdfItem(): Locator {
    return this.page
      .getByRole('menu')
      .getByRole('button', { name: 'Export PDF' });
  }

  /** The switcher marks the chosen locale with its own `active` CSS module class. */
  async isActive(button: Locator): Promise<boolean> {
    return ACTIVE_CLASS.test((await button.getAttribute('class')) ?? '');
  }
}
