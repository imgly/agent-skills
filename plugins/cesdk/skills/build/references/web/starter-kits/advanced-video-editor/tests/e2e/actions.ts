import { actionsMenu } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

/**
 * The `ly.img.actions.navigationBar` entry the kit inserts.
 *
 * The editor renders the first child as its own navigation-bar button and the
 * remaining four inside a dropdown.
 */
export class ActionsMenu {
  constructor(private readonly page: Page) {}

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save', exact: true });
  }

  get trigger(): Locator {
    return actionsMenu(this.page);
  }

  get items(): Locator {
    return this.page.locator('[id^="UBQ__popover-content"] button');
  }

  async open(): Promise<void> {
    if ((await this.trigger.getAttribute('aria-expanded')) !== 'true') {
      await this.trigger.click();
    }
    await this.items.first().waitFor();
  }

  async click(name: string): Promise<void> {
    await this.open();
    await this.items.filter({ hasText: name }).first().click();
  }
}
