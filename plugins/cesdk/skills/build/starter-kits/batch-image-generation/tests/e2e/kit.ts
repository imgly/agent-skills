import {
  actionsMenu,
  editorRoot,
  waitForEditorReady
} from '@imgly/kit-test-harness';
import { expect, type Locator, type Page } from '@playwright/test';

/** The employees the kit renders a card for, in grid order. */
export const EMPLOYEE_NAMES = [
  'Eray Basar',
  'Neslihan Dogan',
  'Daniel Hauschildt',
  'Nataliya Chukhrai',
  'Patrick Schneider',
  'Olga Stadnicka'
];

const RENDER_TIMEOUT = 120 * 1000;

export interface EditorState {
  role: string;
  theme: string;
  variables: string[];
}

/**
 * The kit's demo page.
 *
 * Role and label locators throughout, except the editor's Actions dropdown:
 * the builder renders it as an icon-only button with no accessible name, so
 * there is no role+name locator for it.
 */
export class Kit {
  constructor(private readonly page: Page) {}

  /** Open the kit and wait until the six cards have finished their first render. */
  async open(): Promise<void> {
    await this.page.goto('./');
    await this.card(EMPLOYEE_NAMES.at(-1)!).waitFor({
      timeout: RENDER_TIMEOUT
    });
    // The overlay clears only once every card has rendered, so it needs the
    // same budget as the render above.
    await expect(this.loadingOverlay).toHaveCount(0, {
      timeout: RENDER_TIMEOUT
    });
  }

  get loadingOverlay(): Locator {
    return this.page.getByText('Initializing...');
  }

  card(name: string): Locator {
    return this.page.getByRole('img', { name, exact: true });
  }

  templateButton(label: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${label}`) });
  }

  /** The Edit buttons: index 0 is the selected template, 1 onwards are the cards. */
  get editButtons(): Locator {
    return this.page.getByRole('button', { name: 'Edit', exact: true });
  }

  cardEditButton(name: string): Locator {
    return this.editButtons.nth(EMPLOYEE_NAMES.indexOf(name) + 1);
  }

  get editor(): Locator {
    return editorRoot(this.page);
  }

  get closeButton(): Locator {
    return this.editor.getByRole('button', { name: 'Close' });
  }

  get saveButton(): Locator {
    return this.editor.getByRole('button', { name: 'Save' });
  }

  get actionsDropdown(): Locator {
    return actionsMenu(this.editor);
  }

  /** Click something that opens the modal, then wait for the editor to be ready. */
  async openEditor(trigger: Locator): Promise<void> {
    await trigger.click();
    await waitForEditorReady(this.page);
    await expect(this.closeButton).toBeVisible();
  }

  /** What the kit configured the open editor to be. */
  async editorState(): Promise<EditorState> {
    return this.page.evaluate(() => {
      const cesdk = (window as any).cesdk;
      return {
        role: cesdk.engine.editor.getRole(),
        theme: cesdk.ui.getTheme(),
        variables: ['FirstName', 'LastName', 'Department'].map((name) =>
          cesdk.engine.variable.getString(name)
        )
      };
    });
  }

  /** Recolour a named block, standing in for a user's edit inside the modal. */
  async recolourBlock(
    blockName: string,
    colour: { r: number; g: number; b: number }
  ): Promise<void> {
    await this.page.evaluate(
      ({ name, rgb }) => {
        const engine = (window as any).cesdk.engine;
        const [block] = engine.block.findByName(name);
        if (block == null) {
          throw new Error(`No block named ${name}.`);
        }
        engine.block.setColor(engine.block.getFill(block), 'fill/color/value', {
          ...rgb,
          a: 1
        });
      },
      { name: blockName, rgb: colour }
    );
  }

  /** Close the modal and wait until the kit has dropped its editor handle. */
  async closeEditor(): Promise<void> {
    await this.closeButton.click();
    await this.page.waitForFunction(
      () => (window as { cesdk?: unknown }).cesdk == null
    );
  }

  /** Save from the modal; the kit closes it and re-renders the affected cards. */
  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForFunction(
      () => (window as { cesdk?: unknown }).cesdk == null,
      undefined,
      { timeout: RENDER_TIMEOUT }
    );
  }

  /**
   * A digest per card image, so a re-render can be compared without a
   * screenshot. The kit hands each card a blob URL that changes on every
   * render, so the bytes are what carries the meaning.
   */
  async cardDigests(): Promise<string[]> {
    return this.page.evaluate(async (names: string[]) => {
      const digests: string[] = [];
      for (const name of names) {
        const image = document.querySelector<HTMLImageElement>(
          `img[alt="${name}"]`
        );
        if (image == null) {
          throw new Error(`No card for ${name}.`);
        }
        const bytes = await (await fetch(image.src)).arrayBuffer();
        const hash = await crypto.subtle.digest('SHA-256', bytes);
        digests.push(
          Array.from(new Uint8Array(hash))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('')
        );
      }
      return digests;
    }, EMPLOYEE_NAMES);
  }

  /** Wait until the named card's bytes differ from `before`, then read them all. */
  async digestsAfterRerender(
    before: string[],
    changed: string
  ): Promise<string[]> {
    const index = EMPLOYEE_NAMES.indexOf(changed);
    await expect
      .poll(async () => (await this.cardDigests())[index], {
        timeout: RENDER_TIMEOUT
      })
      .not.toBe(before[index]);
    return this.cardDigests();
  }
}
