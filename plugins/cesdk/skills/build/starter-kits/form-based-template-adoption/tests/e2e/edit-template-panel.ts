import type { Locator, Page } from '@playwright/test';

/**
 * The kit's Edit Template panel.
 *
 * Role locators throughout, except the builder's TextInput, TextArea and
 * ColorInput controls: their accessible name is their current value, so they
 * are reached through the builder's generated `name` attribute.
 */
export class EditTemplatePanel {
  constructor(private readonly page: Page) {}

  get root(): Locator {
    return this.page.getByRole('complementary', { name: 'Edit Template' });
  }

  get title(): Locator {
    return this.root.getByText('Edit Template');
  }

  get imageAction(): Locator {
    return this.root.getByRole('button', { name: /^Change / });
  }

  textField(label: string): Locator {
    return this.root.locator(
      `[name="PanelBuilder-TextInput-text-${label}"], [name="PanelBuilder-TextArea-text-${label}"]`
    );
  }

  colorInput(index: number): Locator {
    return this.root.getByRole('button', { name: `Color ${index}` });
  }

  get colorInputs(): Locator {
    return this.root.getByRole('button', { name: /^Color \d+$/ });
  }

  section(title: string): Locator {
    return this.root.getByText(title, { exact: true });
  }
}
