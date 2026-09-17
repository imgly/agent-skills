import type { Kit } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const PRODUCTS = [
  'Business Card',
  'Poster',
  'Social Media',
  'Post Card',
  'Apparel'
];

/** Every mounted editor contributes one navigation bar landmark. */
export function navigationBars(page: Page): Locator {
  return page.getByRole('region', { name: 'Navigation Bar' });
}

/** The kit's own chrome around the two editors. */
export class Preview {
  readonly image: Locator;

  readonly fullscreenButton: Locator;

  readonly editButton: Locator;

  readonly downloadButton: Locator;

  /** The design editor's navigation bar; the modal's is `modalNavigationBar`. */
  readonly designNavigationBar: Locator;

  readonly modalNavigationBar: Locator;

  constructor(private readonly page: Page) {
    this.image = page.getByRole('img', { name: 'Product mockup' });
    this.fullscreenButton = page.getByRole('button', {
      name: /fullscreen/i
    });
    this.editButton = page.getByRole('button', { name: 'Edit', exact: true });
    this.downloadButton = page.getByRole('button', { name: 'Download mockup' });
    this.designNavigationBar = navigationBars(page).last();
    this.modalNavigationBar = navigationBars(page).first();
  }

  product(label: string): Locator {
    return this.page.getByRole('button', { name: label, exact: true });
  }

  /** The dropdown next to Export Images; it holds Export PDF. */
  actionsDropdown(): Locator {
    return this.designNavigationBar
      .getByRole('button', { name: 'Export Images' })
      .locator('xpath=following-sibling::button[1]');
  }
}

/** The `src` of the preview image, or null while it is rendering. */
export async function previewSource(page: Page): Promise<string | null> {
  return page
    .getByRole('img', { name: 'Product mockup' })
    .getAttribute('src')
    .catch(() => null);
}

export async function pageCount(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) => handle.engine.scene.getPages().length,
    kit.editor
  );
}

export async function firstPageSize(
  kit: Kit
): Promise<{ width: number; height: number }> {
  return kit.page.evaluate((handle) => {
    const page = handle.engine.scene.getPages()[0];
    return {
      width: handle.engine.block.getWidth(page),
      height: handle.engine.block.getHeight(page)
    };
  }, kit.editor);
}

/** Add a text block to the first design page, which triggers a re-render. */
export async function editDesign(kit: Kit): Promise<void> {
  await kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const page = engine.scene.getPages()[0];
    const text = engine.block.create('text');
    engine.block.setString(text, 'text/text', `Edit ${Date.now()}`);
    engine.block.appendChild(page, text);
    // The renderer listens on the history, which an API mutation alone does
    // not touch.
    engine.editor.addUndoStep();
  }, kit.editor);
}

const REPO_ASSETS = resolve(__dirname, '../../../../../assets');

/**
 * Answer the Archivo faces the Poster design uses from the repository's own
 * asset bundle. Both the local dev mount and the static bundle are built with
 * `.woff2` only, so that design cannot export from either; the CDN this kit
 * points at in production ships both. Matched on the typeface path rather than
 * on a server prefix, so it holds in both serving modes.
 */
export async function serveRepositoryFonts(page: Page): Promise<void> {
  await page.route('**/ly.img.typeface/fonts/Archivo/**/*.ttf', (route) => {
    const relative = new URL(route.request().url()).pathname.replace(
      /^.*\/(ly\.img\.typeface\/)/,
      '$1'
    );
    const file = join(REPO_ASSETS, 'v7', relative);
    if (!existsSync(file)) {
      return route.fallback();
    }
    return route.fulfill({ body: readFileSync(file), contentType: 'font/ttf' });
  });
}
