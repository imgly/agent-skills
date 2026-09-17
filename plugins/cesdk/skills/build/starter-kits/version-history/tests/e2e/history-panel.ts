import type { JSHandle, Locator, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';

/** The kit's History panel and the navigation-bar action that feeds it. */
export class HistoryPanel {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'History' });
  }

  get count(): Locator {
    return this.page.getByText(/^\d+ Snapshots?$/);
  }

  get entries(): Locator {
    return this.page.getByRole('button', { name: /Load$/ });
  }

  entry(userName: string): Locator {
    return this.entries.filter({ hasText: userName });
  }

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save Snapshot' });
  }

  async userNames(): Promise<string[]> {
    const texts = await this.entries.allInnerTexts();
    return texts.map((text) => text.split('\n')[0].trim());
  }
}

/**
 * The text of every text block on the canvas, sorted. The three seeded
 * snapshots each carry a different set, so this tells them apart without
 * comparing pixels.
 */
export async function sceneText(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<string[]> {
  return page.evaluate(
    (cesdk) =>
      cesdk.engine.block
        .findByType('text')
        .map((id: number) => cesdk.engine.block.getString(id, 'text/text'))
        .sort(),
    editor
  );
}
