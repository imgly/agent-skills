import {
  actionsMenu,
  getEditor,
  waitForEditorReady,
  type KitEditor
} from '@imgly/kit-test-harness';
import type { JSHandle, Locator, Page } from '@playwright/test';

export const VARIANT_LABELS = [
  'Instagram Story',
  'Instagram Post 4:5',
  'X (Twitter) Post',
  'Facebook Post'
] as const;

/**
 * The demo page and the editor the modal opens.
 *
 * Role and text locators throughout, except the navigation bar's Actions
 * dropdown: the builder renders it as an unnamed chevron next to the primary
 * action, so it has no role + name locator and uses the builder's `data-cy`.
 */
export class ResizingKit {
  constructor(readonly page: Page) {}

  get templateSection(): Locator {
    return this.page.locator('section').filter({
      has: this.page.getByRole('heading', { name: 'Source Template' })
    });
  }

  get variantsSection(): Locator {
    return this.page.locator('section').filter({
      has: this.page.getByRole('heading', { name: 'Generated Variants' })
    });
  }

  templateCard(index: number): Locator {
    return this.page.getByRole('img', { name: `Template ${index + 1}` });
  }

  get templateEditButton(): Locator {
    return this.templateSection.getByRole('button', { name: 'Edit' });
  }

  get generateButton(): Locator {
    return this.page.getByRole('button', { name: 'Generate' });
  }

  /** Variant Edit buttons, in preset order. Present only once generated. */
  variantEditButton(index: number): Locator {
    return this.variantsSection
      .getByRole('button', { name: 'Edit' })
      .nth(index);
  }

  variantDownloadButton(index: number): Locator {
    return this.variantsSection
      .getByRole('button', { name: 'Download' })
      .nth(index);
  }

  get variantDownloadButtons(): Locator {
    return this.variantsSection.getByRole('button', { name: 'Download' });
  }

  /** The four card headings, without the section's own title. */
  get variantHeadings(): Locator {
    return this.variantsSection
      .getByRole('heading')
      .filter({ hasNotText: 'Generated Variants' });
  }

  get editorSaveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save', exact: true });
  }

  get editorActionsDropdown(): Locator {
    return actionsMenu(this.page);
  }

  get editorCloseButton(): Locator {
    return this.page.locator('[data-cy="tb-closeScene"]');
  }

  /**
   * Open the kit and wait for the four empty variant cards.
   *
   * The kit shows no ready state, so `Generate` is a silent no-op until the
   * headless engine has booted and loaded the first template. Waiting for that
   * template's response is the only signal the page gives.
   */
  async open(): Promise<void> {
    const templateLoaded = this.page.waitForResponse(
      (response) => /example-1\.scene(\?|$)/.test(response.url()),
      { timeout: 120_000 }
    );
    await this.page.goto('./');
    await this.variantHeadings.first().waitFor();
    await templateLoaded;
  }

  /** Open the kit without waiting for the engine, to reach the early state. */
  async openWithoutEngine(): Promise<void> {
    await this.page.goto('./');
    await this.variantHeadings.first().waitFor();
  }

  /** Wait until the modal's editor is ready, then hand back its handle. */
  async editor(): Promise<JSHandle<KitEditor>> {
    await waitForEditorReady(this.page);
    return getEditor(this.page);
  }

  async openTemplateEditor(): Promise<JSHandle<KitEditor>> {
    await this.templateEditButton.click();
    return this.editor();
  }

  async openVariantEditor(index: number): Promise<JSHandle<KitEditor>> {
    await this.variantEditButton(index).click();
    return this.editor();
  }

  /** Run Generate and wait for all four variants to finish. */
  async generate(): Promise<void> {
    await this.generateButton.click();
    await this.variantDownloadButtons.nth(3).waitFor({ timeout: 120_000 });
  }

  async closeEditorWithoutSaving(): Promise<void> {
    await this.editorCloseButton.click();
    await this.editorCloseButton.waitFor({ state: 'detached' });
  }
}

/** The first text block's string, read through the kit's editor instance. */
export async function firstText(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<string> {
  return page.evaluate((handle) => {
    const [text] = handle.engine.block.findByType('text');
    return handle.engine.block.getString(text, 'text/text') as string;
  }, editor);
}

/** Replace the first text block's string, so a save can be traced. */
export async function setFirstText(
  page: Page,
  editor: JSHandle<KitEditor>,
  value: string
): Promise<void> {
  await page.evaluate(
    ([handle, next]) => {
      const [text] = (handle as KitEditor).engine.block.findByType('text');
      (handle as KitEditor).engine.block.replaceText(text, next as string);
    },
    [editor, value] as const
  );
}
