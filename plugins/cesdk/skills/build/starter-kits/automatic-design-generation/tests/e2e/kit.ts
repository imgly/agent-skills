import {
  actionsMenu,
  editorRoot,
  expect,
  getEditor,
  supportsVideoExport,
  waitForEditorReady,
  type KitEditor
} from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** iTunes results the search stub returns, so no test reaches the real API. */
export const PODCASTS = [1, 2, 3, 4].map((index) => ({
  artistName: `Host ${index}`,
  artworkUrl600: `https://artwork.test/${index}.png`,
  collectionId: 1000 + index,
  collectionName: `Podcast ${index}`,
  collectionViewUrl: `https://podcasts.test/${index}`
}));

/** A black square, so the dominant-colour extraction has a known answer. */
const BLACK_ARTWORK = readFileSync(
  join(__dirname, '..', '..', 'public', 'podcast-badge-black.png')
);

export const DEFAULT_MESSAGE_TEXT = "Don't miss the latest episode";

export interface DesignState {
  /** The page fill as an upper-case `#RRGGBB` string. */
  background: string;
  message: string | null;
  podcastName: string | null;
  badge: string | null;
}

/**
 * The kit's headless engine, which it already exposes as `window.engine`.
 * Reading the design it just produced is how a test asserts what the kit put
 * there without re-testing what the engine renders.
 */
export async function designState(page: Page): Promise<DesignState> {
  return page.evaluate(() => {
    const engine = (window as any).engine;
    const [pageBlock] = engine.block.findByKind('page');
    const variable = (name: string) => {
      try {
        return engine.variable.getString(name) as string;
      } catch {
        return null;
      }
    };
    const [badge] = engine.block.findByName('PodcastBadge');
    const color = engine.block.getColor(pageBlock, 'fill/solid/color');
    // The engine stores channels as float32, so read them back as bytes.
    const hex = [color.r, color.g, color.b]
      .map((channel: number) =>
        Math.round(channel * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('');
    return {
      background: `#${hex}`.toUpperCase(),
      message: variable('Message'),
      podcastName: variable('PodcastName'),
      badge:
        badge != null
          ? engine.block.getString(
              engine.block.getFill(badge),
              'fill/image/imageFileURI'
            )
          : null
    };
  });
}

/**
 * Wait until no generation is in flight. The Type control is the kit's own
 * loading indicator: it is disabled while any asset is still being generated.
 * On a browser without a video encoder the kit keeps it disabled for good, so
 * there step 3's asset cards stand in: their Download buttons are disabled
 * while an asset is still being generated. Only valid on step 2, and leaves
 * the page on step 2.
 */
export async function waitForIdle(page: Page): Promise<void> {
  if (await supportsVideoExport(page)) {
    await expect(
      page.getByRole('button', { name: 'Image', exact: true })
    ).toBeEnabled({ timeout: 120_000 });
    return;
  }
  await nextButton(page).click();
  const downloads = page.getByRole('button', { name: 'Download' });
  await expect(downloads.first()).toBeVisible({ timeout: 120_000 });
  await expect(downloads.and(page.locator(':disabled'))).toHaveCount(0, {
    timeout: 120_000
  });
  await step(page, '2 Customize').click();
}

/**
 * Wait for the design to carry `expected`, then wait for the generation to
 * finish and check it again — a run still in flight would otherwise overwrite
 * what was just asserted (known issue 5).
 */
export async function expectDesign(
  page: Page,
  expected: Record<keyof DesignState | string, unknown>
): Promise<void> {
  await expect
    .poll(() => designState(page), { timeout: 120_000 })
    .toMatchObject(expected);
  await waitForIdle(page);
  expect(await designState(page)).toMatchObject(expected);
}

/** Open the kit with iTunes and the artwork host stubbed. */
export async function openKit(page: Page): Promise<void> {
  await page.route('https://itunes.apple.com/search*', (route) =>
    route.fulfill({
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ resultCount: PODCASTS.length, results: PODCASTS })
    })
  );
  await page.route('https://artwork.test/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      headers: { 'access-control-allow-origin': '*' },
      body: BLACK_ARTWORK
    })
  );

  await page.goto('./');
  await page.waitForFunction(() => (window as any).engine != null, undefined, {
    timeout: 90_000
  });
}

export const step = (
  page: Page,
  label: '1 Select' | '2 Customize' | '3 Generate'
) => page.getByRole('button', { name: label });

export const nextButton = (page: Page) =>
  page.getByRole('button', { name: 'Next' });

export const messageInput = (page: Page) =>
  page.getByRole('textbox', { name: DEFAULT_MESSAGE_TEXT });

export const searchInput = (page: Page) =>
  page.getByRole('textbox', { name: 'e.g. "Conan O Brien Needs A Friend"' });

export const sizeCheckbox = (page: Page, label: string) =>
  page.getByRole('checkbox', { name: new RegExp(`^${label} `) });

export const assetImage = (page: Page, label: string) =>
  page.getByRole('img', { name: label, exact: true });

/**
 * The hover area of one generated asset card. A video asset renders a `video`
 * element with no accessible name, so the card is found by its label and
 * narrowed with the CSS-module class, as the pilot does where role and name
 * are not enough.
 */
export const assetCard = (page: Page, label: string) =>
  page
    .locator('[class*="assetWrapper"]')
    .filter({ has: page.getByText(label, { exact: true }) })
    .locator('[class*="assetPreviewWrapper"]');

/**
 * Open the edit modal of one generated asset. The Edit button lives in an
 * overlay that only becomes clickable while its card is hovered, so the hover
 * is forced past the image that covers it until then.
 */
export async function openAssetEditor(
  page: Page,
  label: string
): Promise<JSHandle<KitEditor>> {
  const card = assetCard(page, label);
  await card.hover({ force: true });
  await card.getByRole('button', { name: 'Edit' }).click();
  await waitForEditorReady(page);
  const editor = await getEditor(page);
  // The modal loads the asset's scene after the editor reports ready.
  await expect
    .poll(() =>
      page.evaluate(
        (handle) => handle.engine.block.getName(handle.engine.scene.get()),
        editor
      )
    )
    .toBe(label);
  return editor;
}

/** Wait until the modal has closed and released `window.cesdk`. */
export async function waitForEditorClosed(page: Page): Promise<void> {
  await page.waitForFunction(() => (window as any).cesdk == null, undefined, {
    timeout: 30_000
  });
}

export const editorRegion = (page: Page) => editorRoot(page);

export const actionsDropdown = (page: Page) => actionsMenu(editorRegion(page));

/**
 * Open the kit and wait for the generation it starts on load to finish. Step 2
 * carries the only loading indicator, so this passes through it and returns.
 */
export async function openKitIdle(page: Page): Promise<void> {
  await openKit(page);
  await nextButton(page).click();
  await waitForIdle(page);
  await step(page, '1 Select').click();
}
