import {
  download,
  expect,
  resetVideoExportCalls,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';

// No control runs this action: RND-02 pins that video leaves through the
// Renderer. It is driven here the way an embedding application would.
test.describe('Export Design', () => {
  test('RND-13 the registered export action bounds the video bitrate', async ({
    kit
  }) => {
    await spyExportVideo(kit.page, { intercept: true });

    const files = await download(kit.page, async () => {
      await kit.page.evaluate(
        (handle) =>
          handle.cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' }),
        kit.editor
      );
    });

    const calls = await videoExportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({
      videoBitrate: 'Auto',
      mimeType: 'video/mp4'
    });
    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.mp4$/);
  });

  test('RND-14 the caller can raise the bitrate above the bounded default', async ({
    kit
  }) => {
    await spyExportVideo(kit.page, { intercept: true });
    await resetVideoExportCalls(kit.page);

    await download(kit.page, async () => {
      await kit.page.evaluate(
        (handle) =>
          handle.cesdk.actions.run('exportDesign', {
            mimeType: 'video/mp4',
            videoBitrate: 8_000_000
          }),
        kit.editor
      );
    });

    const calls = await videoExportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options.videoBitrate).toBe(8_000_000);
  });
});
