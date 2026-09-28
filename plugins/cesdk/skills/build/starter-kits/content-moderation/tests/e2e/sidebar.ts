import type { Locator, Page } from '@playwright/test';

const MODERATION_URL = '**/sightengineApiProxy*';

export interface ModerationScores {
  weapon?: unknown;
  alcohol?: unknown;
  drugs?: unknown;
  nudity?: unknown;
}

/** The kit's moderation sidebar. */
export class ModerationSidebar {
  constructor(private readonly page: Page) {}

  get validateButton(): Locator {
    return this.page.getByRole('button', { name: /Validate Content|Checking/ });
  }

  get count(): Locator {
    return this.page.getByText(/^\d+ results?$/);
  }

  get error(): Locator {
    return this.page.getByRole('alert');
  }

  get emptyText(): Locator {
    return this.page.getByText(/No check has been performed|No content viola/);
  }

  get selectButtons(): Locator {
    return this.page.getByRole('button', { name: 'Select', exact: true });
  }

  /**
   * The rows for one category; one image produces at most one of each. The row
   * is the only element in the sidebar with neither a role nor a label, so it
   * is located by the kit's own class name.
   */
  row(category: string): Locator {
    return this.page
      .locator('.moderation-item')
      .filter({ hasText: new RegExp(`^${category}`) });
  }

  infoIcon(category: string): Locator {
    return this.row(category).first().getByRole('img', { name: 'Info' });
  }
}

/** Answer every moderation request with `scores`. */
export async function stubModeration(
  page: Page,
  scores: ModerationScores | number
): Promise<void> {
  await page.route(MODERATION_URL, (route) => {
    if (typeof scores === 'number') {
      return route.fulfill({ status: scores, body: 'moderation failed' });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(scores)
    });
  });
}
