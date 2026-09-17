import type { Locator, Page } from '@playwright/test';

/**
 * The kit's canvas bar. The previous and next page buttons carry an icon and a
 * tooltip but no accessible name, so those two use the builder's `name`
 * attribute; everything else is reachable by role and name.
 */
export class CanvasBar {
  constructor(private readonly page: Page) {}

  get previousPage(): Locator {
    return this.page.locator('[name="CanvasBarBuilder-Button-prevPage"]');
  }

  get nextPage(): Locator {
    return this.page.locator('[name="CanvasBarBuilder-Button-nextPage"]');
  }

  get pageSelect(): Locator {
    return this.page.locator('[name="CanvasBarBuilder-Dropdown-pageSelect"]');
  }

  get addPage(): Locator {
    return this.page.getByRole('button', { name: 'Add Page' });
  }

  get pageMenu(): Locator {
    return this.page.getByRole('menu');
  }

  async openPageMenu(): Promise<Locator> {
    await this.pageSelect.click();
    return this.pageMenu;
  }
}

export function currentPage(page: Page, editor: unknown): Promise<number> {
  return page.evaluate(
    (cesdk: any) => cesdk.engine.scene.getCurrentPage(),
    editor
  );
}

export function pageIds(page: Page, editor: unknown): Promise<number[]> {
  return page.evaluate((cesdk: any) => cesdk.engine.scene.getPages(), editor);
}
