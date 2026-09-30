import type { Page } from '@playwright/test';
import { editorPanel, expect, test, type Kit } from '@imgly/kit-test-harness';

function timeline(page: Page) {
  return editorPanel(page, 'ly.img.scope.videoTimeline');
}

function foregroundClips(page: Page) {
  return timeline(page).locator(
    '[data-cy="timelineForegroundTracks"] [id^="clip-"]'
  );
}

async function timelineHeight(page: Page): Promise<number> {
  const box = await timeline(page).boundingBox();
  return box?.height ?? 0;
}

async function settledTimelineHeight(page: Page): Promise<number> {
  let previous = -1;
  await expect
    .poll(
      async () => {
        const height = await timelineHeight(page);
        const settled = height > 0 && height === previous;
        previous = height;
        return settled;
      },
      { intervals: [250] }
    )
    .toBe(true);
  return previous;
}

async function pageHeightOnScreen(kit: Kit): Promise<number> {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const [, , , height] = engine.block.getScreenSpaceBoundingBoxXYWH([
      engine.scene.getCurrentPage()!
    ]);
    return height;
  }, kit.editor);
}

test.describe('Timeline', () => {
  test('VAN-08 the simplified timeline leaves the canvas more room', async ({
    kit
  }) => {
    await expect
      .poll(() => foregroundClips(kit.page).count())
      .toBeGreaterThan(0);
    const simplified = {
      height: await settledTimelineHeight(kit.page),
      clips: await foregroundClips(kit.page).count(),
      page: await pageHeightOnScreen(kit)
    };
    const ruler = timeline(kit.page).locator('[data-cy="timelineRuler"]');
    await expect(ruler).toBeAttached();
    // The ruler renders its time labels only while it is shown.
    await expect(ruler.locator('[data-second]')).toHaveCount(0);

    // The full timeline, for reference: it lists every track of the scene.
    await kit.page.evaluate((handle) => {
      handle.engine.editor.setSetting('timeline/trackVisibility', 'all');
    }, kit.editor);

    await expect
      .poll(() => foregroundClips(kit.page).count())
      .toBeGreaterThan(simplified.clips);
    await expect
      .poll(() => timelineHeight(kit.page))
      .toBeGreaterThan(simplified.height);
    await expect
      .poll(() => pageHeightOnScreen(kit))
      .toBeLessThan(simplified.page);
  });
});
