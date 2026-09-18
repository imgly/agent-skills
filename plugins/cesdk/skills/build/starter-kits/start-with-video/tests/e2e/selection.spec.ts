import { expect, test } from './fixtures';
import { chooseVideo, thumbnail, VIDEOS } from './kit';

test.describe('Video selection', () => {
  test('SWV-01 no editor before a video is chosen', async ({ page }) => {
    await page.goto('./');

    await expect(
      page.getByRole('heading', { name: 'Select Video' })
    ).toBeVisible();
    for (const video of VIDEOS) {
      await expect(thumbnail(page, VIDEOS.indexOf(video))).toBeVisible();
    }
    expect(await page.evaluate(() => (window as any).cesdk)).toBeUndefined();
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('SWV-02 the chosen video becomes the scene', async ({ page }) => {
    await page.goto('./');
    const editor = await chooseVideo(page, 0);

    const scene = await page.evaluate(({ engine }) => {
      const pages = engine.scene.getPages();
      const [track] = engine.block.getChildren(pages[0]);
      const clips = engine.block.getChildren(track);
      const fill = engine.block.getFill(clips[0]);
      return {
        pageCount: pages.length,
        size: [
          engine.block.getWidth(pages[0]),
          engine.block.getHeight(pages[0])
        ],
        duration: engine.block.getDuration(pages[0]),
        trackType: engine.block.getType(track),
        clipCount: clips.length,
        clipType: engine.block.getType(clips[0]),
        fillType: engine.block.getType(fill),
        uri: engine.block.getString(fill, 'fill/video/fileURI'),
        clipDuration: engine.block.getDuration(clips[0])
      };
    }, editor);

    expect(scene.pageCount).toBe(1);
    expect(scene.size).toEqual([960, 720]);
    expect(scene.trackType).toBe('//ly.img.ubq/track');
    expect(scene.clipCount).toBe(1);
    expect(scene.clipType).toBe('//ly.img.ubq/graphic');
    expect(scene.fillType).toBe('//ly.img.ubq/fill/video');
    expect(scene.uri).toContain(VIDEOS[0].file);
    expect(scene.duration).toBeCloseTo(scene.clipDuration, 2);
    expect(scene.duration).toBeGreaterThan(0);

    await expect(
      page.getByRole('region', { name: 'Video Timeline' })
    ).toBeVisible();
  });

  test('SWV-03 the chosen video appears in the video uploads', async ({
    page
  }) => {
    await page.goto('./');
    const editor = await chooseVideo(page, 0);

    const uploads = await page.evaluate(async ({ engine }) => {
      const result = await engine.asset.findAssets('ly.img.video.upload', {
        page: 0,
        perPage: 10
      });
      return result.assets.map((asset: any) => ({
        uri: asset.meta?.uri as string,
        thumbUri: asset.meta?.thumbUri as string
      }));
    }, editor);

    expect(uploads).toHaveLength(1);
    expect(uploads[0].uri).toContain(VIDEOS[0].file);
    // Pinned: the engine registers the video with an empty thumbnail path.
    expect(uploads[0].thumbUri).toBe('');

    await page.getByRole('button', { name: 'Videos', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Video Uploads' })
    ).toBeVisible();
  });

  test('SWV-04 choosing another video replaces the editor', async ({
    page
  }) => {
    await page.goto('./');
    await chooseVideo(page, 0);
    const editor = await chooseVideo(page, 1);

    const uri = await page.evaluate(({ engine }) => {
      const [firstPage] = engine.scene.getPages();
      const [track] = engine.block.getChildren(firstPage);
      const [clip] = engine.block.getChildren(track);
      return engine.block.getString(
        engine.block.getFill(clip),
        'fill/video/fileURI'
      );
    }, editor);

    expect(uri).toContain(VIDEOS[1].file);
    await expect(thumbnail(page, 1)).toHaveClass(/_selected_/);
    await expect(thumbnail(page, 0)).not.toHaveClass(/_selected_/);
  });
});
