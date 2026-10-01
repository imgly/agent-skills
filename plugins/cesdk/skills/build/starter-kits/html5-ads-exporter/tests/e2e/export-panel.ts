import { editorPanel } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

/** The kit's Export HTML5 panel and the navigation-bar button that toggles it. */
export class Html5ExportPanel {
  constructor(private readonly page: Page) {}

  get navigationBarButton(): Locator {
    return this.page.getByRole('button', { name: 'Export', exact: true });
  }

  get root(): Locator {
    return editorPanel(this.page, '//ly.img.panel/html5-export');
  }

  get title(): Locator {
    return this.root.getByText('Export HTML5');
  }

  formatButton(label: 'Embedded' | 'External'): Locator {
    return this.root.getByRole('button', { name: label });
  }

  textModeButton(label: 'HTML Text' | 'Vector'): Locator {
    return this.root.getByRole('button', { name: label });
  }

  get previewButton(): Locator {
    return this.root.getByRole('button', { name: 'Export & Preview' });
  }

  get zipButton(): Locator {
    return this.root.getByRole('button', { name: 'Download ZIP' });
  }

  get pageInput(): Locator {
    return this.root.locator('[name="PanelBuilder-NumberInput-pageIndex"]');
  }
}
