import { expect, test } from '@imgly/kit-test-harness';
import { RendererNavigationBar } from './actions';

test.describe('Start-up and navigation bar', () => {
  test('RND-01 editor loads with the sample video scene', async ({ kit }) => {
    const scene = await kit.page.evaluate(
      (handle) => ({
        pages: handle.engine.scene.getPages().length,
        mode: handle.engine.scene.getMode()
      }),
      kit.editor
    );

    expect(scene.pages).toBe(1);
    expect(scene.mode).toBe('Video');
    await expect(
      kit.page.getByRole('button', { name: 'Play complete video' })
    ).toBeVisible();
  });

  test('RND-02 video can only be exported through the Renderer', async ({
    kit
  }) => {
    const nav = new RendererNavigationBar(kit.page);

    await expect(nav.exportButton).toBeVisible();
    expect(await nav.actionLabels()).toEqual([
      'Import',
      'Export Design',
      'Export Archive'
    ]);
    await expect(
      kit.page.getByRole('button', { name: /Export Video/i })
    ).toHaveCount(0);
  });

  test('RND-03 preview and placeholder features are off', async ({ kit }) => {
    const features = await kit.page.evaluate(
      (handle) => ({
        preview: handle.cesdk.feature.isEnabled('ly.img.preview'),
        placeholder: handle.cesdk.feature.isEnabled('ly.img.placeholder')
      }),
      kit.editor
    );

    expect(features).toEqual({ preview: false, placeholder: false });
    await expect(kit.page.getByRole('button', { name: 'Preview' })).toHaveCount(
      0
    );
  });
});
