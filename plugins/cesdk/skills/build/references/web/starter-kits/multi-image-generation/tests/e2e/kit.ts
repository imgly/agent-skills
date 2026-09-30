import { actionsMenu, waitForEditorReady } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

export const TEMPLATE_LABELS = ['Square', 'Portrait', 'Landscape'] as const;
export type TemplateLabel = (typeof TEMPLATE_LABELS)[number];

export const RESTAURANT_NAMES = [
  'Bean there Bean good',
  'Scoop there it is',
  'BUN intended'
] as const;

/**
 * The kit's page.
 *
 * The editor exists only inside the modal, so `window.cesdk` is unset until a
 * card is opened. That is why these tests take the raw `page` fixture instead
 * of the harness `kit` fixture, which waits for an editor at page load.
 */
export class MultiImageGenerationKit {
  constructor(private readonly page: Page) {}

  static async open(page: Page): Promise<MultiImageGenerationKit> {
    const kit = new MultiImageGenerationKit(page);
    await page.goto('./');
    await kit.card('Square').waitFor();
    return kit;
  }

  restaurantButton(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  card(label: TemplateLabel): Locator {
    return this.page.getByRole('img', { name: `${label} template` });
  }

  /** The Edit button of one card. Its overlay only accepts clicks on hover. */
  editButton(label: TemplateLabel): Locator {
    return this.page
      .getByRole('button', { name: 'Edit' })
      .nth(TEMPLATE_LABELS.indexOf(label));
  }

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save', exact: true });
  }

  get backButton(): Locator {
    return this.page.getByRole('button', { name: 'Back', exact: true });
  }

  get actionsDropdown(): Locator {
    return actionsMenu(this.page);
  }

  get exportImagesButton(): Locator {
    return this.page.getByRole('button', { name: 'Export Images' });
  }

  /** The `src` of each generated card, in template order. */
  async cardSources(): Promise<(string | null)[]> {
    return Promise.all(
      TEMPLATE_LABELS.map((label) => this.card(label).getAttribute('src'))
    );
  }

  /**
   * Wait until every card shows a freshly rendered image.
   *
   * @param previous - sources to move away from, so a second generation is not
   *   mistaken for the first one's result
   */
  async waitForGenerated(previous: (string | null)[] = []): Promise<void> {
    await this.page.waitForFunction(
      ({ labels, before }) =>
        labels.every((label, index) => {
          const src = document.querySelector<HTMLImageElement>(
            `img[alt="${label} template"]`
          )?.src;
          return (
            src != null && src.startsWith('blob:') && src !== before[index]
          );
        }),
      { labels: [...TEMPLATE_LABELS], before: previous },
      { timeout: 120_000 }
    );
  }

  async selectRestaurant(name: string): Promise<void> {
    await this.restaurantButton(name).click();
  }

  /**
   * Open one card's editor and wait until the kit has finished configuring it.
   *
   * `waitForEditorReady` waits for the editor itself; the two buttons the kit
   * inserts into the navigation bar are what say the kit's own setup has run.
   */
  async openEditor(label: TemplateLabel): Promise<void> {
    // The overlay is `pointer-events: none` until the card is hovered, so the
    // hover cannot pass the usual actionability check.
    await this.card(label).hover({ force: true });
    await this.editButton(label).click();
    await waitForEditorReady(this.page);
    await this.backButton.waitFor();
    await this.saveButton.waitFor();
  }

  /** What the kit configured the open editor with. */
  async editorState(): Promise<{
    role: string;
    theme: string;
    title: string;
    name: string;
    pageCount: number;
  }> {
    return this.page.evaluate(() => {
      const cesdk = (window as any).cesdk;
      return {
        role: cesdk.engine.editor.getRole(),
        theme: cesdk.ui.getTheme(),
        title: cesdk.ui
          .getComponentOrder({ in: 'ly.img.navigation.bar' })
          .find((c: any) => c.id === 'ly.img.title.navigationBar')?.title,
        name: cesdk.engine.variable.getString('Name'),
        pageCount: cesdk.engine.scene.getPages().length
      };
    });
  }

  /**
   * What the kit configured the open editor with, without reading a variable.
   *
   * Creator mode loads the bare template, which carries no variable values.
   */
  async creatorEditorState(): Promise<{
    role: string;
    theme: string;
    title: string;
    pageCount: number;
  }> {
    return this.page.evaluate(() => {
      const cesdk = (window as any).cesdk;
      return {
        role: cesdk.engine.editor.getRole(),
        theme: cesdk.ui.getTheme(),
        title: cesdk.ui
          .getComponentOrder({ in: 'ly.img.navigation.bar' })
          .find((c: any) => c.id === 'ly.img.title.navigationBar')?.title,
        pageCount: cesdk.engine.scene.getPages().length
      };
    });
  }

  /** Wait until the modal is gone; the kit clears `window.cesdk` on close. */
  async waitForEditorClosed(): Promise<void> {
    await this.page.waitForFunction(
      () => (window as unknown as { cesdk?: unknown }).cesdk === undefined,
      undefined,
      { timeout: 60_000 }
    );
  }

  /** Replace the text of the named block, to give a save something to carry. */
  async editRestaurantName(text: string): Promise<void> {
    await this.page.evaluate((value) => {
      const engine = (window as any).cesdk.engine;
      const [block] = engine.block.findByName('RestaurantName');
      engine.block.replaceText(block, value);
    }, text);
  }
}
