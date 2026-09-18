import type { JSHandle, Locator, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';

/** The kit's validation sidebar. */
export class ValidationSidebar {
  constructor(private readonly page: Page) {}

  get header(): Locator {
    return this.page.getByText('Check performed');
  }

  get count(): Locator {
    return this.page.getByText(/^\d+ results$/);
  }

  get emptyText(): Locator {
    return this.page.getByText('No design errors found.');
  }

  get selectButtons(): Locator {
    return this.page.getByRole('button', { name: 'Select', exact: true });
  }

  /**
   * The rows for one validation. A row carries no role and no label, so it is
   * located by its CSS-module class, whose local name stays `item`.
   */
  row(validation: string): Locator {
    return this.page
      .locator('[class*="_item_"]')
      .filter({ hasText: validation });
  }

  selectButtonFor(validation: string): Locator {
    return this.row(validation)
      .first()
      .getByRole('button', { name: 'Select', exact: true });
  }
}

/**
 * Commit the edits made since the last commit, so the sidebar's history
 * subscription fires the same way it does after a drag on the canvas.
 */
export async function commit(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<void> {
  await page.evaluate((handle) => handle.engine.editor.addUndoStep(), editor);
}
