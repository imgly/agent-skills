import { actionsMenu } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

export type ColorRow =
  | 'Surface Background'
  | 'Canvas Background'
  | 'Active'
  | 'Accent';

const ACTIVE_CLASS = /_active_/;

/**
 * The kit's theming sidebar and the editor controls its cases reach.
 *
 * Role and label locators throughout, except the navigation bar's actions
 * dropdown: the editor renders it as an icon-only button with no accessible
 * name, so it needs the builder's generated `data-cy`.
 */
export class ThemingSidebar {
  constructor(private readonly page: Page) {}

  scaleButton(scale: 'Normal' | 'Large'): Locator {
    return this.page.getByRole('button', { name: scale, exact: true });
  }

  themeButton(theme: 'Light' | 'Dark'): Locator {
    return this.page.getByRole('button', { name: theme, exact: true });
  }

  presetSwatch(row: ColorRow, color: string): Locator {
    return this.page.getByRole('button', { name: `${row} ${color}` });
  }

  pickerTrigger(row: ColorRow): Locator {
    return this.page.getByLabel(`${row} picker`);
  }

  hexInput(row: ColorRow): Locator {
    return this.page.getByLabel(`${row} hex value`);
  }

  get exportImageButton(): Locator {
    return this.page.getByRole('button', { name: 'Export Images' });
  }

  get actionsDropdown(): Locator {
    return actionsMenu(this.page);
  }

  get exportPdfItem(): Locator {
    return this.page
      .getByRole('menu')
      .getByRole('button', { name: 'Export PDF' });
  }

  /** The sidebar marks the chosen option with its own `active` CSS module class. */
  async isActive(button: Locator): Promise<boolean> {
    return ACTIVE_CLASS.test((await button.getAttribute('class')) ?? '');
  }

  async setHex(row: ColorRow, hex: string): Promise<void> {
    await this.pickerTrigger(row).click();
    await this.hexInput(row).fill(hex.replace('#', ''));
    await this.hexInput(row).press('Enter');
  }

  hasCustomThemeStyle(): Promise<boolean> {
    return this.page.evaluate(
      () => document.getElementById('cesdk-custom-theme') != null
    );
  }

  /**
   * A design token as the browser resolves it, so a value written as
   * `hsl(207,18%,10%)` compares equal to the same colour in any other
   * notation.
   */
  async resolvedToken(token: string): Promise<string> {
    return this.resolveColor(
      await this.page.evaluate(
        (name) =>
          getComputedStyle(
            document.querySelector('.ubq-public') as Element
          ).getPropertyValue(name),
        token
      )
    );
  }

  async resolveColor(value: string): Promise<string> {
    return this.page.evaluate((color) => {
      const probe = document.createElement('span');
      probe.style.color = color;
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    }, value.trim());
  }
}
