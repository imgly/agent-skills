import { expect, test } from '@imgly/kit-test-harness';
import type { Page } from '@playwright/test';

import {
  DEFAULT_MESSAGE_TEXT,
  expectDesign,
  messageInput,
  nextButton,
  openKit,
  openKitIdle,
  PODCASTS,
  searchInput,
  sizeCheckbox,
  step,
  waitForIdle
} from './kit';
import { PRESET_COLORS } from '../../src/app/constants';

const DEFAULT_BACKGROUND = '#9933FF';
const PLACEHOLDER_COUNT = 5;
const LABELS = ['Instagram Story', 'Instagram Post', 'Facebook / X Post'];
const HOVER_BORDER = 'rgba(71, 26, 255, 0.25)';
const SELECTED_BORDER = 'rgb(94, 88, 255)';
const NO_BORDER = 'rgba(0, 0, 0, 0)';

const resultCard = (page: Page, name: string) =>
  page.getByRole('button', { name: new RegExp(`^${name} `) });

const previewImage = (page: Page) =>
  page.getByRole('img', { name: 'Preview', exact: true });

/**
 * The background colour the preview shows. The templates lay a gradient over
 * the background, so the top-left pixel is matched to the nearest candidate.
 */
async function previewBackground(page: Page): Promise<string> {
  const corner = await previewImage(page).evaluate(
    async (image: HTMLImageElement) => {
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      return Array.from(context.getImageData(4, 4, 1, 1).data.slice(0, 3));
    }
  );
  const distance = (hex: string) =>
    [1, 3, 5].reduce(
      (sum, offset, index) =>
        sum +
        (parseInt(hex.slice(offset, offset + 2), 16) - corner[index]) ** 2,
      0
    );
  return ['#000000', ...PRESET_COLORS].reduce((best, hex) =>
    distance(hex) < distance(best) ? hex : best
  );
}

/** The result cards mark the selected podcast with a border, and only it. */
async function expectOnlySelected(page: Page, name: string): Promise<void> {
  for (const podcast of PODCASTS) {
    await expect(resultCard(page, podcast.collectionName)).toHaveCSS(
      'border-top-color',
      podcast.collectionName === name ? SELECTED_BORDER : NO_BORDER
    );
  }
}

test.describe('Podcast search', () => {
  test('ADG-01 step 1 is the only panel on start-up', async ({ page }) => {
    await openKit(page);

    await expect(searchInput(page)).toHaveValue('');
    await expect(
      page.getByRole('img', { name: 'Search Placeholder' })
    ).toHaveCount(PLACEHOLDER_COUNT);
    for (const podcast of PODCASTS) {
      await expect(
        page.getByRole('button', { name: new RegExp(podcast.collectionName) })
      ).toHaveCount(0);
    }

    await expect(step(page, '1 Select')).toBeEnabled();
    await expect(step(page, '2 Customize')).toBeDisabled();
    await expect(step(page, '3 Generate')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Back' })).toBeDisabled();

    await expect(messageInput(page)).toHaveCount(0);
    await expect(page.getByRole('img', { name: 'Preview' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Download' })).toHaveCount(0);

    await nextButton(page).click();
    await expect(messageInput(page)).toBeVisible();
    await expect(searchInput(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Download' })).toHaveCount(0);

    await nextButton(page).click();
    await expect(
      page.getByRole('button', { name: 'Download' }).first()
    ).toBeVisible();
    await expect(messageInput(page)).toHaveCount(0);
    await expect(searchInput(page)).toHaveCount(0);
  });

  test('ADG-02 searching replaces the placeholders', async ({ page }) => {
    await openKit(page);
    await searchInput(page).fill('podcast');

    for (const podcast of PODCASTS) {
      const result = resultCard(page, podcast.collectionName);
      await expect(result).toBeVisible();
      await expect(
        result.getByRole('img', { name: podcast.collectionName })
      ).toHaveAttribute('src', podcast.artworkUrl600);
      await expect(
        result.getByText(podcast.collectionName, { exact: true })
      ).toBeVisible();
      await expect(
        result.getByText(podcast.artistName, { exact: true })
      ).toBeVisible();
    }
    await expect(
      page.getByRole('img', { name: 'Search Placeholder' })
    ).toHaveCount(0);

    // Hovering highlights but does not select: the view stays on step 1.
    await resultCard(page, PODCASTS[0].collectionName).hover();
    await expect(resultCard(page, PODCASTS[0].collectionName)).toHaveCSS(
      'border-top-color',
      HOVER_BORDER
    );
    await expect(resultCard(page, PODCASTS[1].collectionName)).toHaveCSS(
      'border-top-color',
      NO_BORDER
    );
    await expect(step(page, '2 Customize')).toBeDisabled();

    await searchInput(page).fill('');
    await expect(
      page.getByRole('img', { name: 'Search Placeholder' })
    ).toHaveCount(PLACEHOLDER_COUNT);
  });

  test('ADG-03 selecting a podcast advances and fills the design', async ({
    page
  }) => {
    await openKitIdle(page);
    await searchInput(page).fill('podcast');

    await resultCard(page, PODCASTS[1].collectionName).click();

    await expect(messageInput(page)).toBeVisible();
    // The stubbed artwork is a black square, so the dominant colour is black.
    await expectDesign(page, {
      podcastName: PODCASTS[1].collectionName,
      background: '#000000'
    });

    await step(page, '1 Select').click();
    await expectOnlySelected(page, PODCASTS[1].collectionName);
    await resultCard(page, PODCASTS[2].collectionName).click();
    await expectDesign(page, { podcastName: PODCASTS[2].collectionName });

    await step(page, '1 Select').click();
    await expectOnlySelected(page, PODCASTS[2].collectionName);
  });
});

test.describe('Customize', () => {
  test('ADG-04 step 2 opens with the shipped defaults', async ({ page }) => {
    await openKit(page);
    await nextButton(page).click();

    await expect(messageInput(page)).toHaveValue(DEFAULT_MESSAGE_TEXT);
    for (const label of LABELS) {
      await expect(sizeCheckbox(page, label)).toBeChecked();
    }
    await expect(
      page.getByRole('button', { name: 'Image', exact: true })
    ).toHaveClass(/active/);
    await expect(
      page.getByRole('button', { name: 'Video', exact: true })
    ).not.toHaveClass(/active/);

    // No podcast was selected, so nothing is placed in the design.
    await expectDesign(page, {
      message: DEFAULT_MESSAGE_TEXT,
      podcastName: '',
      background: DEFAULT_BACKGROUND
    });
  });

  test('ADG-04 a search without a pick leaves the podcast out', async ({
    page
  }) => {
    await openKitIdle(page);
    await searchInput(page).fill('podcast');
    for (const podcast of PODCASTS) {
      await expect(resultCard(page, podcast.collectionName)).not.toHaveClass(
        /selected/
      );
    }

    await nextButton(page).click();

    await expect(messageInput(page)).toBeVisible();
    await expectDesign(page, {
      podcastName: '',
      background: DEFAULT_BACKGROUND
    });
  });

  test('ADG-11 Back returns to the step before', async ({ page }) => {
    await openKit(page);
    await nextButton(page).click();
    await expect(messageInput(page)).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(messageInput(page)).toBeHidden();
    await expect(searchInput(page)).toBeVisible();
    // The first step has nothing before it, so Back is offered but inert.
    await expect(page.getByRole('button', { name: 'Back' })).toBeDisabled();
  });

  test('ADG-05 the message and the colour reach the design', async ({
    page
  }) => {
    await openKit(page);
    await nextButton(page).click();
    await expectDesign(page, { message: DEFAULT_MESSAGE_TEXT });

    await messageInput(page).fill('Fresh episode 🎧');
    await expectDesign(page, { message: 'Fresh episode 🎧' });

    // Clearing the field restores the sample text rather than emptying it.
    await messageInput(page).fill('');
    await expectDesign(page, { message: DEFAULT_MESSAGE_TEXT });

    // A preset colour above the luminance threshold flips the badge to dark.
    await page.getByRole('button', { name: 'Select color #FFD333' }).click();
    await expectDesign(page, {
      background: '#FFD333',
      badge: expect.stringContaining('podcast-badge-black.png')
    });

    // ...and one below it flips back.
    await page.getByRole('button', { name: 'Select color #335FFF' }).click();
    await expectDesign(page, {
      background: '#335FFF',
      badge: expect.stringContaining('podcast-badge-white.png')
    });
  });

  test('ADG-12 a colour from the picker reaches the design', async ({
    page
  }) => {
    await openKit(page);
    await nextButton(page).click();
    await waitForIdle(page);

    const togglePicker = page.getByRole('button', {
      name: 'Toggle color picker'
    });
    await togglePicker.click();
    const hexField = page.locator('input[class*="hexInput"]');
    await hexField.fill('00FF00');
    await expectDesign(page, { background: '#00FF00' });

    // Without video export, waitForIdle leaves the step and comes back, which
    // closes the picker. A click outside closes it everywhere, so reopen it.
    await page.getByText('Background Color', { exact: true }).click();
    await togglePicker.click();
    await page
      .getByRole('slider', { name: 'Color' })
      .click({ position: { x: 20, y: 20 } });
    await expect(hexField).not.toHaveValue(/^00FF00$/i);
    const picked = `#${(await hexField.inputValue()).toUpperCase()}`;
    await expectDesign(page, { background: picked });
  });

  test('ADG-13 the preview shows the current design', async ({ page }) => {
    await openKitIdle(page);
    await searchInput(page).fill('podcast');
    await resultCard(page, PODCASTS[0].collectionName).click();
    // The stubbed artwork is black, so the podcast turns the background black.
    await expectDesign(page, { podcastName: PODCASTS[0].collectionName });
    await expect.poll(() => previewBackground(page)).toBe('#000000');

    await page.getByRole('button', { name: 'Select color #FFD333' }).click();
    await expectDesign(page, { background: '#FFD333' });
    await expect.poll(() => previewBackground(page)).toBe('#FFD333');

    const before = await previewImage(page).getAttribute('src');
    await messageInput(page).fill('A new message');
    await expectDesign(page, { message: 'A new message' });
    await expect(previewImage(page)).toHaveAttribute('src', /^blob:/);
    await expect(previewImage(page)).not.toHaveAttribute(
      'src',
      before as string
    );
  });

  test('ADG-06 unchecking a size removes and restores its asset', async ({
    page
  }) => {
    await openKit(page);
    await nextButton(page).click();
    await waitForIdle(page);

    await sizeCheckbox(page, 'Instagram Story').uncheck();
    await nextButton(page).click();
    await expect(page.getByRole('button', { name: 'Download' })).toHaveCount(2);
    await expect(
      page.getByRole('img', { name: 'Instagram Story', exact: true })
    ).toHaveCount(0);

    await step(page, '2 Customize').click();
    await sizeCheckbox(page, 'Instagram Story').check();
    await waitForIdle(page);
    await nextButton(page).click();
    await expect(page.getByRole('button', { name: 'Download' })).toHaveCount(3);

    // The cards are sorted by size index, so a re-added size returns to its
    // place in the Sizes order.
    expect(
      await page
        .getByRole('img', { name: /Instagram|Facebook/ })
        .evaluateAll((images) =>
          images.map((image) => image.getAttribute('alt'))
        )
    ).toEqual(LABELS);
  });
});
