import type { Page } from '@playwright/test';
import { CURATED, GENERATED_TEXT, expect, test } from './fixtures';

const ORIGINAL_TEXT = 'The original headline';

/** Selects the first block of a type on the first page and returns its id. */
async function selectFirst(
  page: Page,
  editor: Parameters<Page['evaluate']>[1],
  type: string
): Promise<number> {
  return page.evaluate(
    ([handle, blockType]) => {
      const { engine } = handle as any;
      const [first] = engine.scene.getPages();
      const id = engine.block
        .findByType(blockType)
        .find((block: number) => engine.block.getParent(block) === first);
      engine.block.findAllSelected().forEach((block: number) => {
        engine.block.setSelected(block, false);
      });
      engine.block.setSelected(id, true);
      return id;
    },
    [editor, type] as const
  );
}

/** The sparkle entry the AI plugins add at the start of the canvas menu. It has no accessible name. */
function aiMenuButton(page: Page) {
  return page
    .getByRole('region', { name: 'Canvas Menu' })
    .getByRole('button')
    .first();
}

test.describe('AI quick actions on a selected block', () => {
  test('AIE-22 the AI canvas-menu entry lists the quick actions for text and images', async ({
    kit
  }) => {
    await selectFirst(kit.page, kit.editor, 'text');
    await aiMenuButton(kit.page).click();
    for (const action of [
      'Improve Writing',
      'Fix Spelling & Grammar',
      'Make Shorter',
      'Make Longer',
      'Change Tone'
    ]) {
      await expect(
        kit.page.getByRole('button', { name: action }),
        `text offers ${action}`
      ).toBeVisible();
    }
    await expect(
      kit.page.getByRole('button', { name: 'Edit Image...' })
    ).toHaveCount(0);
    await kit.page.keyboard.press('Escape');

    await selectFirst(kit.page, kit.editor, 'graphic');
    await aiMenuButton(kit.page).click();
    for (const action of ['Edit Image...', 'Swap Background...']) {
      await expect(
        kit.page.getByRole('button', { name: action }),
        `an image offers ${action}`
      ).toBeVisible();
    }
    await expect(
      kit.page.getByRole('button', { name: 'Improve Writing' })
    ).toHaveCount(0);
  });

  test('AIE-23 Improve Writing, Fix Spelling & Grammar, Make Shorter and Make Longer replace the selected text with the result', async ({
    kit,
    gateway
  }) => {
    const actions = [
      'Improve Writing',
      'Fix Spelling & Grammar',
      'Make Shorter',
      'Make Longer'
    ];
    const block = await selectFirst(kit.page, kit.editor, 'text');
    await kit.page.evaluate(
      ([handle, id, text]) =>
        (handle as any).engine.block.replaceText(id, text),
      [kit.editor, block, ORIGINAL_TEXT] as const
    );
    const text = () =>
      kit.page.evaluate(
        ([handle, id]) =>
          (handle as any).engine.block.getString(id, 'text/text') as string,
        [kit.editor, block] as const
      );

    for (const action of actions) {
      await aiMenuButton(kit.page).click();
      await kit.page.getByRole('button', { name: action }).click();
      await expect.poll(text, action).toBe(GENERATED_TEXT);

      await aiMenuButton(kit.page).click();
      await expect.poll(text, `${action} discarded`).toBe(ORIGINAL_TEXT);
    }
    expect(gateway.generateBodies.map((body) => body.model)).toEqual(
      actions.map(() => CURATED.text2text)
    );
  });

  test('AIE-24 Before, After and Discard switch between the original and the generated text', async ({
    kit
  }) => {
    const block = await selectFirst(kit.page, kit.editor, 'text');
    await kit.page.evaluate(
      ([handle, id, text]) =>
        (handle as any).engine.block.replaceText(id, text),
      [kit.editor, block, ORIGINAL_TEXT] as const
    );
    const text = () =>
      kit.page.evaluate(
        ([handle, id]) =>
          (handle as any).engine.block.getString(id, 'text/text') as string,
        [kit.editor, block] as const
      );

    await aiMenuButton(kit.page).click();
    await kit.page.getByRole('button', { name: 'Improve Writing' }).click();
    await expect.poll(text).toBe(GENERATED_TEXT);

    await kit.page.getByRole('button', { name: 'Before', exact: true }).click();
    await expect.poll(text).toBe(ORIGINAL_TEXT);

    await kit.page.getByRole('button', { name: 'After', exact: true }).click();
    await expect.poll(text).toBe(GENERATED_TEXT);

    // While the result awaits confirmation, the menu's first button discards it.
    await aiMenuButton(kit.page).click();
    await expect.poll(text).toBe(ORIGINAL_TEXT);
  });
});
