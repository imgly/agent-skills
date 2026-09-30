import { download, expect, test } from '@imgly/kit-test-harness';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { RendererNavigationBar } from './actions';

function writeTemp(name: string, buffer: Buffer): string {
  const path = join(mkdtempSync(join(tmpdir(), 'kit-')), name);
  writeFileSync(path, buffer);
  return path;
}

test.describe('Scene and archive', () => {
  test('RND-10 a scene can be exported', async ({ kit }) => {
    const nav = new RendererNavigationBar(kit.page);

    const files = await download(kit.page, async () => {
      await nav.openActions();
      await kit.page.getByRole('button', { name: 'Export Design' }).click();
    });

    expect(files).toHaveLength(1);
    expect(files[0].buffer.subarray(0, 4).toString()).toMatch(/^UBQ\d$/);
  });

  test('RND-11 an archive can be exported', async ({ kit }) => {
    const nav = new RendererNavigationBar(kit.page);

    const files = await download(kit.page, async () => {
      await nav.openActions();
      await kit.page.getByRole('button', { name: 'Export Archive' }).click();
    });

    expect(files).toHaveLength(1);
    expect(files[0].buffer.subarray(0, 2).toString()).toBe('PK');
  });

  test('RND-12 a scene and an archive can be imported again', async ({
    kit
  }) => {
    const nav = new RendererNavigationBar(kit.page);
    const blockCount = () =>
      kit.page.evaluate(
        (handle) => handle.engine.block.findAll().length,
        kit.editor
      );
    const before = await blockCount();

    const exported = await download(kit.page, async () => {
      await nav.openActions();
      await kit.page.getByRole('button', { name: 'Export Design' }).click();
    });
    const archived = await download(kit.page, async () => {
      await nav.openActions();
      await kit.page.getByRole('button', { name: 'Export Archive' }).click();
    });

    for (const file of [exported[0], archived[0]]) {
      const path = writeTemp(file.name, file.buffer);
      const chooser = kit.page.waitForEvent('filechooser');
      await nav.openActions();
      await kit.page.getByRole('button', { name: 'Import' }).click();
      await (await chooser).setFiles(path);

      await expect.poll(blockCount, { timeout: 60_000 }).toBe(before);
    }
  });
});
