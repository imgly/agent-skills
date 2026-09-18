import {
  editorPanel,
  kitTestOutputDir,
  type KitEditor
} from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const VECTORIZE_BUTTON = { name: 'Vectorizer' };
/** The plugin keeps its processing state in block metadata under its id. */
export const PLUGIN_ID = '@imgly/plugin-vectorizer-web';

export { VECTORIZE_BUTTON };

/** A 2 x 2 pixel image and a one-rectangle SVG, small enough to inline. */
const SAMPLES: Record<string, string> = {
  'sample.png':
    'data:iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFUlEQVR4nGP8//8/AzJgYkAD5AsAAP//DwEBnsFT1AAAAABJRU5ErkJggg==',
  'sample.jpg':
    'data:/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAACAAIBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
  'sample.svg':
    'text:<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#f00"/></svg>'
};

/**
 * Write a sample outside the kit directory: the dev server watches the kit and
 * would reload in the middle of the run.
 */
export function writeSample(name: keyof typeof SAMPLES): string {
  const dir = kitTestOutputDir(resolve(__dirname, '..', '..'), 'uploads');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, name);
  const value = SAMPLES[name];
  writeFileSync(
    file,
    value.startsWith('text:')
      ? value.slice('text:'.length)
      : Buffer.from(value.slice('data:'.length), 'base64')
  );
  return file;
}

/** Select the block at `index` of `kind` and return its id. */
export async function selectByKind(
  page: Page,
  editor: JSHandle<KitEditor>,
  kind: string,
  index = 0
): Promise<number> {
  return page.evaluate(
    ({ handle, blockKind, at }) => {
      const engine = handle.engine;
      const block = engine.block.findByKind(blockKind)[at];
      engine.block
        .findAllSelected()
        .forEach((selected: number) =>
          engine.block.setSelected(selected, false)
        );
      engine.block.select(block);
      return block as number;
    },
    { handle: editor, blockKind: kind, at: index }
  );
}

/** Upload `name` through the Uploads dock entry and add it to the page. */
export async function uploadAndAdd(
  page: Page,
  name: keyof typeof SAMPLES
): Promise<void> {
  await page.getByRole('button', { name: 'Uploads', exact: true }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Add File' }).first().click();
  await (await chooser).setFiles(writeSample(name));

  const panel = editorPanel(page, '//ly.img.panel/assetLibrary');
  const uploaded = panel.getByRole('button', { name, exact: true });
  await uploaded.waitFor();
  await uploaded.click();
}
