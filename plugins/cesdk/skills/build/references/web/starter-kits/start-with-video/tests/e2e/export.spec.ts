import {
  download,
  spyExportVideo,
  videoExportCalls
} from '@imgly/kit-test-harness';
import { expect, test } from './fixtures';
import { chooseVideo } from './kit';

test.describe('Export', () => {
  test('SWV-06 export video passes the kit bitrate', async ({ page }) => {
    await page.goto('./');
    await chooseVideo(page, 0);
    // A real encode takes tens of seconds and is engine behaviour; the kit
    // owns only the options it sends.
    await spyExportVideo(page, { intercept: true });

    const [file] = await download(page, () =>
      page.getByRole('button', { name: 'Export Video' }).click()
    );

    const calls = await videoExportCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options.videoBitrate).toBe('Auto');
    expect(calls[0].options.mimeType).toBe('video/mp4');
    expect(file.name).toMatch(/\.mp4$/);
  });
});
