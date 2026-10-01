import {
  download,
  expect,
  exportCalls,
  spyExport,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';
import type { KitEditor } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { switchRole } from './roles';

/**
 * Neither role puts an Import or Export control in its navigation bar
 * (VPL-10), so the registered actions are reached the way an integrator would.
 */
function run(
  page: Page,
  editor: JSHandle<KitEditor>,
  action: string,
  options?: Record<string, unknown>
): Promise<void> {
  return page.evaluate(
    ([handle, id, args]) =>
      (handle as KitEditor).cesdk!.actions.run(
        id as string,
        args as never
      ) as Promise<void>,
    [editor, action, options] as const
  );
}

function writeTemp(name: string, contents: string): string {
  const path = join(mkdtempSync(join(tmpdir(), 'kit-')), name);
  writeFileSync(path, contents);
  return path;
}

test.describe('Registered actions', () => {
  test('VPL-11 Creator imports a scene through the registered action', async ({
    kit
  }) => {
    const blockCount = () =>
      kit.page.evaluate(
        (handle) => (handle as KitEditor).engine.block.findAll().length,
        kit.editor
      );
    const before = await blockCount();

    const saved = await kit.page.evaluate(
      (handle) => (handle as KitEditor).engine.scene.saveToString(),
      kit.editor
    );
    const path = writeTemp('design.scene', saved);

    const chooser = kit.page.waitForEvent('filechooser');
    const imported = run(kit.page, kit.editor, 'importScene');
    await (await chooser).setFiles(path);
    await imported;

    await expect.poll(blockCount, { timeout: 60_000 }).toBe(before);
  });

  test('VPL-12 Creator exports video as MP4 with the bounded bitrate', async ({
    kit
  }) => {
    await spyExportVideo(kit.page, { intercept: true });

    await download(kit.page, () => run(kit.page, kit.editor, 'exportVideo'));

    const calls = await videoExportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({
      mimeType: 'video/mp4',
      videoBitrate: 'Auto'
    });
  });

  test('VPL-13 Adopter exports a PNG when the caller names no format', async ({
    kit
  }) => {
    const editor = await switchRole(kit, 'Adopter');
    await spyExport(kit.page);
    await spyExportVideo(kit.page, { intercept: true });

    await download(kit.page, () => run(kit.page, editor, 'exportDesign'));

    // `utils.export` picks the image or the video API from the scene; the kit
    // owns only the options it hands over.
    const calls = [
      ...(await exportCalls(kit.page)),
      ...(await videoExportCalls(kit.page))
    ];
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toEqual({ mimeType: 'image/png' });
    await editor.dispose();
  });

  test('VPL-14 Adopter passes the bounded bitrate on a video export', async ({
    kit
  }) => {
    const editor = await switchRole(kit, 'Adopter');
    await spyExportVideo(kit.page, { intercept: true });

    await download(kit.page, () =>
      run(kit.page, editor, 'exportDesign', { mimeType: 'video/mp4' })
    );

    const calls = await videoExportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({
      mimeType: 'video/mp4',
      videoBitrate: 'Auto'
    });
    await editor.dispose();
  });
});
