import { expect, test } from '@imgly/kit-test-harness';
import type { KitEditor } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { RoleSwitcher, type Role } from './roles';

/**
 * The kit registers `importScene` but puts no Import control in either
 * navigation bar, so the action is reached the way an integrator would.
 */
async function importScene(
  page: Page,
  editor: JSHandle<KitEditor>,
  path: string
): Promise<void> {
  const chooser = page.waitForEvent('filechooser');
  const run = page.evaluate(
    (handle) => (handle as KitEditor).cesdk!.actions.run('importScene'),
    editor
  );
  await (await chooser).setFiles(path);
  await run;
}

function writeTemp(name: string, contents: string): string {
  const path = join(mkdtempSync(join(tmpdir(), 'kit-')), name);
  writeFileSync(path, contents);
  return path;
}

const ROLES: Role[] = ['Creator', 'Adopter'];

test.describe('Importing a scene', () => {
  for (const role of ROLES) {
    test(`PH-07 ${role} imports a scene through the registered action`, async ({
      kit
    }) => {
      let editor = kit.editor;
      if (role === 'Adopter') {
        editor = await new RoleSwitcher(kit.page).switchTo('Adopter');
      }

      const blockCount = () =>
        kit.page.evaluate(
          (handle) => (handle as KitEditor).engine.block.findAll().length,
          editor
        );
      const before = await blockCount();

      const saved = await kit.page.evaluate(
        (handle) => (handle as KitEditor).engine.scene.saveToString(),
        editor
      );
      const path = writeTemp('design.scene', saved);

      await importScene(kit.page, editor, path);

      await expect.poll(blockCount, { timeout: 60_000 }).toBe(before);
    });
  }
});
