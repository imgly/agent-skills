import { getEditor, waitForEditorReady } from '@imgly/kit-test-harness';
import type { JSHandle, Locator, Page } from '@playwright/test';

/**
 * The kit's selection screen. The editor only exists after Open Editor is
 * clicked, so every editor case goes through here first.
 */
export class SelectionScreen {
  constructor(private readonly page: Page) {}

  image(alt: string): Locator {
    return this.page.getByRole('img', { name: alt, exact: true });
  }

  /** The clickable card around an image or a preset icon. */
  option(alt: string): Locator {
    return this.image(alt).locator(
      'xpath=ancestor::div[contains(@class,"Option")][1]'
    );
  }

  mode(label: string): Locator {
    return this.page.getByRole('button', { name: label, exact: true });
  }

  get modeDescription(): Locator {
    return this.page.getByRole('paragraph');
  }

  get openEditorButton(): Locator {
    return this.page.getByRole('button', { name: 'Open Editor', exact: true });
  }

  /**
   * Open the editor and wait for the instance this click creates. The kit
   * leaves `window.cesdk` from an earlier open in place, so it is cleared
   * first.
   */
  async openEditor(): Promise<
    JSHandle<import('@imgly/kit-test-harness').KitEditor>
  > {
    await this.page.evaluate(() => {
      delete (window as unknown as Record<string, unknown>).cesdk;
    });
    await this.openEditorButton.click();
    await waitForEditorReady(this.page);
    return getEditor(this.page);
  }

  async closeEditor(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Close', exact: true })
      .first()
      .click();
    await this.page
      .getByRole('button', { name: 'Crop', exact: true })
      .waitFor({ state: 'hidden' });
  }
}

export interface PageShape {
  width: number;
  height: number;
  image: string;
  editMode: string;
}

export async function readPage(
  page: Page,
  editor: JSHandle<import('@imgly/kit-test-harness').KitEditor>
): Promise<PageShape> {
  return page.evaluate((handle) => {
    const engine = handle.engine;
    const block = engine.scene.getCurrentPage();
    return {
      width: Math.round(engine.block.getWidth(block)),
      height: Math.round(engine.block.getHeight(block)),
      image: engine.block
        .getString(engine.block.getFill(block), 'fill/image/imageFileURI')
        .split('/')
        .pop(),
      editMode: engine.editor.getEditMode()
    };
  }, editor);
}
