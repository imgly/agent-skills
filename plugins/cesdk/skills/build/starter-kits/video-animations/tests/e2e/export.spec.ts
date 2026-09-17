import {
  expect,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';

test.describe('Export', () => {
  test("VAN-07 Export Video passes the kit's options", async ({ kit }) => {
    await spyExportVideo(kit.page, { intercept: true });

    await kit.page.getByRole('button', { name: 'Export Video' }).click();

    await expect
      .poll(() => videoExportCalls(kit.page).then((calls) => calls.length))
      .toBe(1);

    const [call] = await videoExportCalls(kit.page);
    const currentPage = await kit.page.evaluate(
      (handle) => handle.engine.scene.getCurrentPage(),
      kit.editor
    );

    expect(call.block).toBe(currentPage);
    expect(call.options.mimeType).toBe('video/mp4');
    expect(call.options.videoBitrate).toBe('Auto');
    expect(call.options).not.toHaveProperty('targetWidth');
    expect(call.options).not.toHaveProperty('targetHeight');
    expect(call.options).not.toHaveProperty('framerate');
  });
});
