import type { Kit } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

/** The kit's sidebar and the area buttons the plugin puts in the canvas bar. */
export class ProductEditor {
  readonly sidebar: Locator;

  readonly downloadLink: Locator;

  constructor(private readonly page: Page) {
    this.sidebar = page.getByRole('complementary');
    this.downloadLink = this.sidebar.getByRole('button', { name: 'here' });
  }

  product(label: string): Locator {
    return this.sidebar.getByRole('button', { name: new RegExp(`^${label}`) });
  }

  swatch(colorId: string): Locator {
    return this.sidebar.getByRole('button', { name: colorId, exact: true });
  }

  areaButton(label: string): Locator {
    return this.page
      .getByRole('region', { name: 'Canvas' })
      .getByRole('button', { name: label, exact: true });
  }
}

/** The currently visible backdrop, as the kit's own scene describes it. */
export async function visibleBackdrop(
  kit: Kit
): Promise<{ name: string; uri: string } | null> {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const block = engine.block
      .findByKind('backdrop_image')
      .find((id: number) => engine.block.isVisible(id));
    if (block == null) return null;
    const fill = engine.block.getFill(block);
    return {
      name: engine.block.getName(block),
      uri: engine.block.getSourceSet(fill, 'fill/image/sourceSet')[0].uri
    };
  }, kit.editor);
}

/** Name of the page the editor currently shows. */
export async function currentAreaId(kit: Kit): Promise<string | null> {
  return kit.page.evaluate((handle) => {
    const page = handle.engine.scene.getCurrentPage();
    return page != null ? handle.engine.block.getName(page) : null;
  }, kit.editor);
}

export async function pageNames(kit: Kit): Promise<string[]> {
  return kit.page.evaluate(
    (handle) =>
      handle.engine.block
        .findByType('page')
        .map((id: number) => handle.engine.block.getName(id)),
    kit.editor
  );
}

/** A value the kit stored on the scene block, parsed. */
export async function sceneMetadata<T>(kit: Kit, key: string): Promise<T> {
  return kit.page.evaluate(
    ({ handle, metadataKey }) =>
      JSON.parse(
        handle.engine.block.getMetadata(handle.engine.scene.get(), metadataKey)
      ),
    { handle: kit.editor, metadataKey: key }
  );
}

/** Add a text block to the page currently shown, and return its id. */
export async function addTextToCurrentPage(kit: Kit): Promise<number> {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const page = engine.scene.getCurrentPage()!;
    const text = engine.block.create('text');
    engine.block.setString(text, 'text/text', 'Hello');
    engine.block.appendChild(page, text);
    return text;
  }, kit.editor);
}

/** Record every `cesdk.actions.run` call from now on. */
export async function spyActions(kit: Kit): Promise<void> {
  await kit.page.evaluate((handle) => {
    const cesdk = handle.cesdk;
    const globals = window as unknown as {
      __kitActionCalls?: { action: string; args: unknown[] }[];
    };
    globals.__kitActionCalls = [];
    const original = cesdk.actions.run.bind(cesdk.actions);
    cesdk.actions.run = (action: string, ...args: unknown[]) => {
      globals.__kitActionCalls!.push({
        action,
        args: args.map((value) =>
          typeof value === 'object' && value !== null ? { ...value } : value
        )
      });
      return original(action, ...args);
    };
  }, kit.editor);
}

export async function actionCalls(
  kit: Kit
): Promise<{ action: string; args: unknown[] }[]> {
  return kit.page.evaluate(
    () =>
      (
        window as unknown as {
          __kitActionCalls: { action: string; args: unknown[] }[];
        }
      ).__kitActionCalls
  );
}
