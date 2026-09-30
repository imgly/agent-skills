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

/** The text of every block with this name, on every page. */
function textsOf(
  page: import('@playwright/test').Page,
  editor: unknown,
  name: string
) {
  return page.evaluate(
    ([handle, blockName]) => {
      const engine = (handle as { engine: any }).engine;
      return engine.block
        .findByType('text')
        .filter((id: number) => engine.block.getName(id) === blockName)
        .map((id: number) => engine.block.getString(id, 'text/text'));
    },
    [editor, name] as const
  );
}

/** The image of every block whose fill the template lets the user change. */
function templateImages(
  page: import('@playwright/test').Page,
  editor: unknown
): Promise<{ name: string; uri: string }[]> {
  return page.evaluate((handle) => {
    const engine = (handle as { engine: any }).engine;
    return engine.block
      .findByType('graphic')
      .filter(
        (id: number) =>
          engine.block.getType(engine.block.getFill(id)) ===
            '//ly.img.ubq/fill/image' &&
          engine.block.isScopeEnabled(id, 'fill/change')
      )
      .map((id: number) => {
        const fill = engine.block.getFill(id);
        return {
          name: engine.block.getName(id),
          uri:
            engine.block.getSourceSet(fill, 'fill/image/sourceSet')[0]?.uri ??
            engine.block.getString(fill, 'fill/image/imageFileURI')
        };
      });
  }, editor);
}

function pngFile(): string {
  const path = join(mkdtempSync(join(tmpdir(), 'kit-')), 'replacement.png');
  writeFileSync(path, PNG);
  return path;
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
    // Replacing is the only thing the panel offers for an image. Whole words
    // only, so a colour name such as "#AADDC5" does not count as "add".
    await expect(
      panel.root.getByRole('button', { name: /\b(delete|remove|add)\b/i })
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

test.describe('Image section, every named block', () => {
  test('FTA-15 each image entry previews the image on the canvas', async ({
    kit
  }) => {
    const panel = new EditTemplatePanel(kit.page);
    const previewUris = () =>
      panel.previews.evaluateAll((elements) =>
        elements.map(
          (element) =>
            /url\("?([^")]+)"?\)/.exec(
              (element as HTMLElement).style.backgroundImage
            )?.[1] ?? ''
        )
      );

    const images = await templateImages(kit.page, kit.editor);
    const firstOfEachName = [
      ...new Map(images.map((image) => [image.name, image.uri])).values()
    ];
    await expect(panel.previews).toHaveCount(firstOfEachName.length);
    expect(await previewUris()).toEqual(firstOfEachName);

    const chooser = kit.page.waitForEvent('filechooser');
    await panel.imageAction.first().click();
    await (await chooser).setFiles(pngFile());

    await expect.poll(async () => (await previewUris())[0]).toMatch(/^blob:/);
    expect((await previewUris())[0]).toBe(
      (await templateImages(kit.page, kit.editor))[0].uri
    );
  });

  test('FTA-16 one Change replaces the image of every block of that name', async ({
    kit
  }) => {
    const panel = new EditTemplatePanel(kit.page);
    const images = await templateImages(kit.page, kit.editor);
    const [name] = images.map((image) => image.name);
    const named = () =>
      templateImages(kit.page, kit.editor).then((all) =>
        all.filter((image) => image.name === name).map(({ uri }) => uri)
      );
    // The demo template repeats each image on both pages.
    expect((await named()).length).toBeGreaterThan(1);

    const chooser = kit.page.waitForEvent('filechooser');
    await panel.imageAction.first().click();
    await (await chooser).setFiles(pngFile());

    await expect
      .poll(async () => (await named()).every((uri) => uri.startsWith('blob:')))
      .toBe(true);
    expect(new Set(await named()).size).toBe(1);
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

test.describe('Text section, every named block', () => {
  test('FTA-17 a field writes every block of its name', async ({ kit }) => {
    const panel = new EditTemplatePanel(kit.page);
    for (const [name, value] of [
      ['Headline', 'New headline'],
      ['Body', 'First line\nSecond line']
    ]) {
      // The demo template repeats each text on both pages.
      expect((await textsOf(kit.page, kit.editor, name)).length).toBe(2);

      const field = panel.textField(name);
      await field.fill(value);
      await field.blur();

      await expect
        .poll(() => textsOf(kit.page, kit.editor, name))
        .toEqual([value, value]);
    }
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
    expect(labels).toEqual(
      labels.map((_, index) =>
        expect.stringMatching(new RegExp(`^Color ${index + 1}: #[0-9A-F]{6}$`))
      )
    );
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
  test('FTA-18 changing one color leaves the other colors alone', async ({
    kit
  }) => {
    const panel = new EditTemplatePanel(kit.page);
    // Every colour the kit groups: non-text fills, strokes and text colours.
    const colors = () =>
      kit.page.evaluate((handle) => {
        const engine = handle.engine;
        const hex = ({ r, g, b }: { r: number; g: number; b: number }) =>
          '#' +
          [r, g, b]
            .map((channel) =>
              Math.round(channel * 255)
                .toString(16)
                .padStart(2, '0')
            )
            .join('')
            .toUpperCase();
        const found: { source: string; hex: string }[] = [];
        for (const block of engine.block.findAll()) {
          const type = engine.block.getType(block);
          if (type === '//ly.img.ubq/text') {
            engine.block
              .getTextColors(block)
              .forEach((color: { r: number; g: number; b: number }) =>
                found.push({ source: `${block} text`, hex: hex(color) })
              );
            continue;
          }
          if (
            engine.block.supportsFill(block) &&
            engine.block.isFillEnabled(block) &&
            engine.block.getType(engine.block.getFill(block)) ===
              '//ly.img.ubq/fill/color'
          ) {
            found.push({
              source: `${block} fill`,
              hex: hex(
                engine.block.getColor(
                  engine.block.getFill(block),
                  'fill/color/value'
                )
              )
            });
          }
          if (
            engine.block.supportsStroke(block) &&
            engine.block.isStrokeEnabled(block)
          ) {
            found.push({
              source: `${block} stroke`,
              hex: hex(engine.block.getStrokeColor(block))
            });
          }
        }
        return found;
      }, kit.editor);

    const before = await colors();
    const edited = ((await panel.colorInput(2).textContent()) ?? '').trim();
    const others = before.filter(({ hex }) => hex !== edited);
    expect(before.length).toBeGreaterThan(others.length);
    expect(new Set(others.map(({ hex }) => hex)).size).toBeGreaterThan(1);

    await panel.colorInput(2).click();
    const hexField = kit.page.getByRole('textbox').last();
    await hexField.fill('FF0000');
    await hexField.press('Enter');

    await expect
      .poll(async () =>
        (await colors())
          .filter(({ source }) =>
            before.some(
              (color) => color.source === source && color.hex === edited
            )
          )
          .every(({ hex }) => hex === '#FF0000')
      )
      .toBe(true);
    const after = await colors();
    for (const { source, hex } of others) {
      expect(after.find((color) => color.source === source)?.hex, source).toBe(
        hex
      );
    }
  });
});
