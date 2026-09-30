import type { Page } from '@playwright/test';
import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { switchRole } from './roles';

function timeline(page: Page) {
  return editorPanel(page, 'ly.img.scope.videoTimeline');
}

function ruler(page: Page) {
  return timeline(page).locator('[data-cy="timelineRuler"]');
}

/** The ruler's time labels, which it renders only while it is shown. */
function rulerMarks(page: Page) {
  return ruler(page).locator('[data-second]');
}

async function expectRulerShown(page: Page) {
  await expect(rulerMarks(page).first()).toBeVisible();
}

/** Checked once the timeline has settled, so the labels had time to render. */
async function expectRulerOff(page: Page) {
  await expect(ruler(page)).toBeAttached();
  await expect(rulerMarks(page)).toHaveCount(0);
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

/** The Creator timeline once its tracks have grown it to full height. */
async function creatorTimeline(page: Page) {
  await expectRulerShown(page);
  const height = await settledTimelineHeight(page);
  return { height, clips: await foregroundClips(page).count() };
}

test.describe('Timeline per role', () => {
  test("VPL-16 Creator shows every track at the editor's own height", async ({
    kit
  }) => {
    const creator = await creatorTimeline(kit.page);
    expect(creator.height).toBeGreaterThan(300);
  });

  test('VPL-17 Adopter shows the simplified timeline', async ({ kit }) => {
    const creator = await creatorTimeline(kit.page);

    const editor = await switchRole(kit, 'Adopter');

    await expect
      .poll(() => foregroundClips(kit.page).count())
      .toBeGreaterThan(0);
    expect(await settledTimelineHeight(kit.page)).toBeLessThan(creator.height);
    expect(await foregroundClips(kit.page).count()).toBeLessThan(creator.clips);
    await expectRulerOff(kit.page);
    await editor.dispose();
  });

  test('VPL-18 switching back to Creator restores the full timeline', async ({
    kit
  }) => {
    const before = await creatorTimeline(kit.page);

    const adopter = await switchRole(kit, 'Adopter');
    await settledTimelineHeight(kit.page);
    await expectRulerOff(kit.page);
    await adopter.dispose();

    const creator = await switchRole(kit, 'Creator');
    await expectRulerShown(kit.page);
    await expect
      .poll(() => foregroundClips(kit.page).count())
      .toBe(before.clips);
    await expect
      .poll(() => timelineHeight(kit.page))
      .toBeCloseTo(before.height, 0);
    await creator.dispose();
  });
});
