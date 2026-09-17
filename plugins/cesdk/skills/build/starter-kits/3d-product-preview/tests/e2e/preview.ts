import type { Kit } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

export const PRODUCTS = [
  { key: 'businesscard', label: 'Business Card', folder: 'business-card' },
  { key: 'cap', label: 'Baseball Cap', folder: 'cap' },
  { key: 'apparel', label: 'Apparel', folder: 't-shirt' }
];

/** The kit's top bar and the `<model-viewer>` it drives. */
export class Preview {
  readonly modelViewer: Locator;

  readonly fullscreenButton: Locator;

  readonly navigationBar: Locator;

  constructor(private readonly page: Page) {
    this.modelViewer = page.locator('model-viewer');
    this.fullscreenButton = page.getByRole('button', { name: /fullscreen/i });
    this.navigationBar = page.getByRole('region', { name: 'Navigation Bar' });
  }

  product(label: string): Locator {
    return this.page.getByRole('button', { name: label, exact: true });
  }

  /** The dropdown next to Export Images; it holds Export PDF. */
  actionsDropdown(): Locator {
    return this.navigationBar
      .getByRole('button', { name: 'Export Images' })
      .locator('xpath=following-sibling::button[1]');
  }
}

/**
 * Record every texture the kit applies to the model. `<model-viewer>` owns the
 * WebGL side; the kit decides the URL and the material index.
 */
export async function spyTexture(page: Page): Promise<void> {
  await page.evaluate(() => {
    const viewer = document.querySelector('model-viewer') as unknown as {
      createTexture(url: string): Promise<unknown>;
      model?: { materials: unknown[] };
    };
    const globals = window as unknown as {
      __kitTextureCalls?: { url: string; materialIndex: number }[];
    };
    globals.__kitTextureCalls = [];
    const original = viewer.createTexture.bind(viewer);
    viewer.createTexture = async (url: string) => {
      const texture = await original(url);
      const materials = (viewer.model?.materials ?? []) as {
        pbrMetallicRoughness?: {
          baseColorTexture?: { setTexture(value: unknown): void };
        };
      }[];
      materials.forEach((material, index) => {
        const slot = material?.pbrMetallicRoughness?.baseColorTexture;
        if (slot == null) return;
        const setTexture = slot.setTexture.bind(slot);
        slot.setTexture = (value: unknown) => {
          globals.__kitTextureCalls!.push({ url, materialIndex: index });
          setTexture(value);
        };
      });
      return texture;
    };
  });
}

export async function textureCalls(
  page: Page
): Promise<{ url: string; materialIndex: number }[]> {
  return page.evaluate(
    () =>
      (
        window as unknown as {
          __kitTextureCalls: { url: string; materialIndex: number }[];
        }
      ).__kitTextureCalls
  );
}

/** Wait until `<model-viewer>` reports a loaded model. */
export async function waitForModel(page: Page): Promise<void> {
  await page.waitForFunction(
    () =>
      (document.querySelector('model-viewer') as unknown as { model?: unknown })
        ?.model != null,
    undefined,
    { timeout: 90_000 }
  );
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
