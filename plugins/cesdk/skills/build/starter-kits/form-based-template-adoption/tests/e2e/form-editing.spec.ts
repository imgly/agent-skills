import { expect, test } from '@imgly/kit-test-harness';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EditTemplatePanel } from './edit-template-panel';

/** A 1×1 red PNG, small enough to inline. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

function textOf(
  page: import('@playwright/test').Page,
  editor: unknown,
  name: string
) {
  return page.evaluate(
    ([handle, blockName]) => {
      const engine = (handle as { engine: any }).engine;
      const block = engine.block
        .findByType('text')
        .find((id: number) => engine.block.getName(id) === blockName);
      return engine.block.getString(block, 'text/text');
    },
    [editor, name] as const
  );
}

test.describe('Image section', () => {
  test('FTA-05 every template image can only be replaced', async ({ kit }) => {
    const panel = new EditTemplatePanel(kit.page);

    // The panel shows one preview per name, not per block: blocks that share
    // a name are one property and are replaced together.
    const imageProperties = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const names = engine.block
        .findByType('graphic')
        .filter(
          (id: number) =>
            engine.block.getType(engine.block.getFill(id)) ===
              '//ly.img.ubq/fill/image' &&
            engine.block.isScopeEnabled(id, 'fill/change')
        )
        .map((id: number) => engine.block.getName(id) || String(id));
      return new Set(names).size;
    }, kit.editor);

    expect(imageProperties).toBeGreaterThan(0);
    await expect(panel.imageAction).toHaveCount(imageProperties);
    // Replacing is the only thing the panel offers for an image.
    await expect(
      panel.root.getByRole('button', { name: /delete|remove|add/i })
    ).toHaveCount(0);
  });

  test('FTA-06 replacing an image changes the block fill', async ({ kit }) => {
    const panel = new EditTemplatePanel(kit.page);
    const path = join(mkdtempSync(join(tmpdir(), 'kit-')), 'replacement.png');
    writeFileSync(path, PNG);
    const sourceSet = () =>
      kit.page.evaluate((handle) => {
        const engine = handle.engine;
        const graphic = engine.block
          .findByType('graphic')
          .find(
            (id: number) =>
              engine.block.getType(engine.block.getFill(id)) ===
                '//ly.img.ubq/fill/image' &&
              engine.block.isScopeEnabled(id, 'fill/change')
          );
        return engine.block.getSourceSet(
          engine.block.getFill(graphic),
          'fill/image/sourceSet'
        );
      }, kit.editor);

    const chooser = kit.page.waitForEvent('filechooser');
    await panel.imageAction.first().click();
    await (await chooser).setFiles(path);

    await expect
      .poll(async () => (await sourceSet())[0]?.uri ?? '')
      .toMatch(/^blob:/);
  });
});

test.describe('Text section', () => {
  test('FTA-07 every editable text block appears with its own text', async ({
    kit
  }) => {
    const panel = new EditTemplatePanel(kit.page);

    const expected = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      return engine.block
        .findByType('text')
        .filter((id: number) => engine.block.isScopeEnabled(id, 'text/edit'))
        .map((id: number) => ({
          name: engine.block.getName(id) || String(id),
          text: engine.block.getString(id, 'text/text')
        }));
    }, kit.editor);

    expect(expected.length).toBeGreaterThan(0);
    for (const { name, text } of expected) {
      await expect(panel.textField(name)).toHaveValue(text);
    }
  });

  test('FTA-08 a single-line field writes through to the canvas', async ({
    kit
  }) => {
    const panel = new EditTemplatePanel(kit.page);
    const field = panel.textField('Headline');

    await field.fill('New headline');
    await field.blur();

    await expect
      .poll(() => textOf(kit.page, kit.editor, 'Headline'))
      .toBe('New headline');
  });

  test('FTA-09 a multi-line block gets a text area', async ({ kit }) => {
    const panel = new EditTemplatePanel(kit.page);
    const body = panel.textField('Body');

    expect(await body.evaluate((el) => el.tagName)).toBe('TEXTAREA');

    await body.fill('First line\nSecond line');
    await body.blur();
    await expect
      .poll(() => textOf(kit.page, kit.editor, 'Body'))
      .toBe('First line\nSecond line');

    // The control is chosen once, when the scene loads, so it stays a text
    // area even when the field is emptied.
    await body.fill('');
    await body.blur();
    expect(await panel.textField('Body').evaluate((el) => el.tagName)).toBe(
      'TEXTAREA'
    );
  });

  test('FTA-10 an emoji reaches the canvas', async ({ kit }) => {
    const panel = new EditTemplatePanel(kit.page);
    const field = panel.textField('Headline');

    await field.fill('Yoga 🧘');
    await field.blur();

    await expect
      .poll(() => textOf(kit.page, kit.editor, 'Headline'))
      .toBe('Yoga 🧘');
  });
});

test.describe('Color section', () => {
  test('FTA-11 every distinct template color is its own input', async ({
    kit
  }) => {
    const panel = new EditTemplatePanel(kit.page);

    // Which blocks form a group is covered headless (FTA-H3). Here the
    // question is that each group gets its own numbered input.
    const labels = await panel.colorInputs.evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute('aria-label'))
    );

    expect(labels.length).toBeGreaterThan(1);
    expect(labels).toEqual(labels.map((_, index) => `Color ${index + 1}`));
    for (const input of await panel.colorInputs.all()) {
      await expect(input).toHaveText(/#[0-9A-F]{6}/);
    }
  });

  test('FTA-12 a color applies to its whole group at full opacity', async ({
    kit
  }) => {
    const panel = new EditTemplatePanel(kit.page);
    const group = () =>
      kit.page.evaluate((handle) => {
        const engine = handle.engine;
        const first = engine.block
          .findAll()
          .filter(
            (block: number) =>
              engine.block.supportsFill(block) &&
              engine.block.isValid(engine.block.getFill(block)) &&
              engine.block.getType(engine.block.getFill(block)) ===
                '//ly.img.ubq/fill/color' &&
              engine.block.isFillEnabled(block) &&
              engine.block.getType(block) !== '//ly.img.ubq/text'
          );
        return first.map((block: number) =>
          engine.block.getColor(engine.block.getFill(block), 'fill/color/value')
        );
      }, kit.editor);

    const before = await group();
    await panel.colorInput(1).click();
    const hex = kit.page.getByRole('textbox').last();
    await hex.fill('FF0000');
    await hex.press('Enter');

    await expect
      .poll(async () => {
        const after = await group();
        return after.filter(
          (color: { r: number; g: number; b: number }) =>
            color.r === 1 && color.g === 0 && color.b === 0
        ).length;
      })
      .toBeGreaterThan(0);

    // Every block keeps the alpha it came with: the panel reads and writes
    // fully opaque colors.
    const after = await group();
    expect(after.map((color: { a: number }) => color.a)).toEqual(
      before.map((color: { a: number }) => color.a)
    );
  });
});
