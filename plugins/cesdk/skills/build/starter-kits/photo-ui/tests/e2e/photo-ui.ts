import type { Kit } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';

/** A call the kit made into the engine, recorded by `spyEngine`. */
export interface EngineCall {
  method: string;
  args: unknown[];
}

/**
 * Record the calls a kit makes into `engine.block` and `engine.editor`. The kit
 * owns which calls it makes; the engine owns what they produce.
 */
export async function spyEngine(
  kit: Kit,
  methods: string[]
): Promise<() => Promise<EngineCall[]>> {
  await kit.page.evaluate(
    ({ handle, names }) => {
      const recorded: EngineCall[] = [];
      (window as unknown as { __engineCalls: EngineCall[] }).__engineCalls =
        recorded;
      for (const name of names) {
        const [namespace, method] = name.split('.');
        const api = (handle.engine as Record<string, Record<string, unknown>>)[
          namespace
        ];
        const original = api[method] as (...args: unknown[]) => unknown;
        api[method] = function spied(this: unknown, ...args: unknown[]) {
          recorded.push({ method: name, args });
          return original.apply(this, args);
        };
      }
    },
    { handle: kit.editor, names: methods }
  );

  return () =>
    kit.page.evaluate(
      () => (window as unknown as { __engineCalls: EngineCall[] }).__engineCalls
    );
}

/** The page block the kit edits: this kit's scene has exactly one page. */
export async function pageBlock(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) => handle.engine.block.findByType('page')[0],
    kit.editor
  );
}

export async function pageFloat(kit: Kit, property: string): Promise<number> {
  return kit.page.evaluate(
    ({ handle, name }) =>
      handle.engine.block.getFloat(
        handle.engine.block.findByType('page')[0],
        name
      ),
    { handle: kit.editor, name: property }
  );
}

/** The effects on the page, as their fully qualified type strings. */
export async function pageEffectTypes(kit: Kit): Promise<string[]> {
  return kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    return handle.engine.block
      .getEffects(page)
      .map((effect: number) => handle.engine.block.getString(effect, 'type'));
  }, kit.editor);
}

/** The value of an effect property on the page's first effect of that type. */
export async function effectFloat(
  kit: Kit,
  type: string,
  property: string
): Promise<number> {
  return kit.page.evaluate(
    ({ handle, effectType, name }) => {
      const [page] = handle.engine.block.findByType('page');
      const effect = handle.engine.block
        .getEffects(page)
        .find(
          (candidate: number) =>
            handle.engine.block.getString(candidate, 'type') === effectType
        );
      return handle.engine.block.getFloat(effect, name);
    },
    { handle: kit.editor, effectType: type, name: property }
  );
}

/** The image fill URI of the page. */
export async function pageFillURI(kit: Kit): Promise<string> {
  return kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    return handle.engine.block.getString(
      handle.engine.block.getFill(page),
      'fill/image/imageFileURI'
    );
  }, kit.editor);
}

export function tab(page: Page, name: 'Crop' | 'Adjust' | 'Filter'): Locator {
  return page.getByRole('button', { name, exact: true });
}

export function resetButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Reset' });
}

/**
 * Drag the value slider. It is a `react-draggable` handle with one marker every
 * 10 px, so a step is 10 px to the left.
 */
export async function dragSlider(
  page: Page,
  slider: Locator,
  steps: number
): Promise<void> {
  const box = await slider.boundingBox();
  if (box == null) {
    throw new Error('The slider is not visible.');
  }
  const y = box.y + box.height / 2;
  const startX = box.x + box.width / 2;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(startX - steps * 10, y, { steps: 5 });
  await page.mouse.up();
}

/** The slider handle of the bar currently shown, located by its value label. */
export function slider(page: Page, label: string | RegExp): Locator {
  return page.getByRole('button', { name: label, exact: true });
}
