import { download, expect, test } from '@imgly/kit-test-harness';
import {
  RENDERER_ROUTE,
  RendererNavigationBar,
  renderedVideo
} from './actions';

test.describe('Renderer export', () => {
  test('RND-04 the export starts as soon as the action is clicked', async ({
    kit
  }) => {
    const nav = new RendererNavigationBar(kit.page);
    const request = kit.page.waitForRequest(RENDERER_ROUTE);
    await kit.page.route(RENDERER_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: renderedVideo()
      })
    );

    await nav.exportButton.click();
    await expect(nav.notification).toBeVisible();

    const posted = await request;
    expect(posted.method()).toBe('POST');
    const body = posted.postDataBuffer()!;
    expect(body.subarray(0, 400).toString('latin1')).toContain('name="scene"');
    // The scene part is the archive, which is a ZIP.
    expect(body.toString('latin1')).toContain('PK');
  });

  test('RND-05 the progress notification stays until the export ends', async ({
    kit
  }) => {
    const nav = new RendererNavigationBar(kit.page);
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await kit.page.route(RENDERER_ROUTE, async (route) => {
      await held;
      await route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: renderedVideo()
      });
    });

    await nav.exportButton.click();
    await expect(nav.notification).toBeVisible();
    await expect(nav.notification.getByRole('progressbar')).toBeVisible();
    await expect(nav.notification).toHaveText(
      /Archiving\.\.\.|Uploading the archive|Rendering on the server/
    );

    // A loading notification has an infinite duration: it is still there
    // long after the editor's default auto-dismiss would have run.
    await kit.page.waitForTimeout(6000);
    await expect(nav.notification).toBeVisible();

    release!();
    await expect(nav.notification).toHaveText(/server render took/);
  });

  test('RND-06 success replaces the progress notification and downloads the file', async ({
    kit
  }) => {
    const nav = new RendererNavigationBar(kit.page);
    await kit.page.route(RENDERER_ROUTE, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: renderedVideo()
      })
    );

    const files = await download(kit.page, () => nav.exportButton.click());

    expect(files).toHaveLength(1);
    expect(files[0].buffer).toHaveLength(12_000);
    await expect(nav.notification).toHaveText(
      /Export downloaded, server render took [\d.]+ seconds/
    );
    await expect(nav.notification.getByRole('progressbar')).toHaveCount(0);
  });

  test('RND-07 dismissing the notification does not cancel the export', async ({
    kit
  }) => {
    const nav = new RendererNavigationBar(kit.page);
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await kit.page.route(RENDERER_ROUTE, async (route) => {
      await held;
      await route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: renderedVideo()
      });
    });

    const files = await download(kit.page, async () => {
      await nav.exportButton.click();
      await expect(nav.notification).toBeVisible();
      await nav.dismissNotification.click();
      await expect(nav.notification).toHaveCount(0);
      release!();
    });

    expect(files).toHaveLength(1);
    // A dismissed notification is gone for good: the success update has no
    // notification left to write to.
    await expect(nav.notification).toHaveCount(0);
  });

  test.describe('failure', () => {
    test.use({
      // One alternation, not two entries: inside a spec `test.use` takes a
      // single pattern. The kit logs the rejected export before it shows the
      // error notification, and Chromium reports the mocked 500 itself.
      consoleErrorAllowlist: [
        /Error encountered during scene export:|responded with a status of 500 .*__renderer/
      ]
    });

    test('RND-08 a failed export shows an error notification', async ({
      kit
    }) => {
      const nav = new RendererNavigationBar(kit.page);
      await kit.page.route(RENDERER_ROUTE, (route) =>
        route.fulfill({ status: 500, body: 'boom' })
      );

      await nav.exportButton.click();

      await expect(
        nav.notification.filter({ hasText: 'Export failed' })
      ).toBeVisible();
      // The progress notification is dismissed, so only the error is left.
      await expect(nav.notification).toHaveCount(1);
    });
  });

  test('RND-09 the editor stays usable while the export runs', async ({
    kit
  }) => {
    const nav = new RendererNavigationBar(kit.page);
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await kit.page.route(RENDERER_ROUTE, async (route) => {
      await held;
      await route.fulfill({
        status: 200,
        contentType: 'video/mp4',
        body: renderedVideo()
      });
    });

    await nav.exportButton.click();
    await expect(nav.notification).toBeVisible();

    await kit.page.getByRole('button', { name: 'Play complete video' }).click();
    const playbackTime = () =>
      kit.page.evaluate(
        (handle) =>
          handle.engine.block.getPlaybackTime(
            handle.engine.scene.getPages()[0]
          ),
        kit.editor
      );
    await expect.poll(playbackTime).toBeGreaterThan(0);

    release!();
    await expect(nav.notification).toHaveText(/server render took/);
  });
});
