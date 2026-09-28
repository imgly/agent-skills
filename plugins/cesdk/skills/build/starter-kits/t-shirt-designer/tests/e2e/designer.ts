import type { Kit } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

/** The kit's React sidebar. */
export class Designer {
  readonly sidebar: Locator;

  readonly cartButton: Locator;

  readonly downloadLink: Locator;

  constructor(page: Page) {
    this.sidebar = page.getByRole('complementary');
    this.cartButton = this.sidebar.getByRole('button', {
      name: /Add to Cart/
    });
    this.downloadLink = this.sidebar.getByRole('button', { name: 'here' });
  }

  area(label: string): Locator {
    return this.sidebar.getByRole('button', { name: label, exact: true });
  }

  swatch(label: string): Locator {
    return this.sidebar.getByRole('button', { name: label, exact: true });
  }

  quantity(index: number): Locator {
    return this.sidebar.getByRole('spinbutton').nth(index);
  }

  preview(): Locator {
    return this.sidebar.getByRole('img');
  }
}

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

export async function currentAreaId(kit: Kit): Promise<string | null> {
  return kit.page.evaluate((handle) => {
    const page = handle.engine.scene.getCurrentPage();
    return page != null ? handle.engine.block.getName(page) : null;
  }, kit.editor);
}

export async function pageInfo(
  kit: Kit
): Promise<{ names: string[]; width: number; designUnit: string }> {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const pages = engine.block.findByType('page');
    return {
      names: pages.map((id: number) => engine.block.getName(id)),
      width: engine.block.getWidth(pages[0]),
      designUnit: engine.scene.getDesignUnit()
    };
  }, kit.editor);
}

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

export async function blockPlacement(
  kit: Kit,
  block: number
): Promise<{ parent: string; x: number; y: number }> {
  return kit.page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      return {
        parent: engine.block.getName(engine.block.getParent(id)),
        x: engine.block.getPositionX(id),
        y: engine.block.getPositionY(id)
      };
    },
    { handle: kit.editor, id: block }
  );
}
