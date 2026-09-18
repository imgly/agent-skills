import { actionsMenu, expect } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

/** The navigation bar this kit installs, and the notifications its export writes. */
export class RendererNavigationBar {
  constructor(private readonly page: Page) {}

  get exportButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Export using CE.SDK Renderer'
    });
  }

  get actionsDropdown(): Locator {
    return actionsMenu(this.page);
  }

  get notification(): Locator {
    return this.page.locator('[data-cy="notification"]');
  }

  get dismissNotification(): Locator {
    return this.notification.getByRole('button', { name: 'Close' });
  }

  async openActions(): Promise<void> {
    await this.actionsDropdown.click();
    await expect(
      this.page.getByRole('button', { name: 'Import' })
    ).toBeVisible();
  }

  async actionLabels(): Promise<string[]> {
    await this.openActions();
    const popover = this.page.locator('[id^="UBQ__popover-content"]');
    return popover
      .getByRole('button')
      .evaluateAll((buttons) =>
        buttons.map((button) => button.textContent?.trim() ?? '')
      );
  }
}

export const RENDERER_ROUTE = '**/__renderer';

/** A 12 KB stand-in for the rendered video, so no encode runs in a kit test. */
export function renderedVideo(): Buffer {
  return Buffer.alloc(12_000, 1);
}
