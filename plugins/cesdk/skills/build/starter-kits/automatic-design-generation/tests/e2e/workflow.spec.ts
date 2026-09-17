import { expect, test } from '@imgly/kit-test-harness';

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

const DEFAULT_BACKGROUND = '#9933FF';
const PLACEHOLDER_COUNT = 5;
const LABELS = ['Instagram Story', 'Instagram Post', 'Facebook / X Post'];

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
  });

  test('ADG-02 searching replaces the placeholders', async ({ page }) => {
    await openKit(page);
    await searchInput(page).fill('podcast');

    for (const podcast of PODCASTS) {
      const result = page.getByRole('button', {
        name: new RegExp(`${podcast.collectionName} .*${podcast.artistName}`)
      });
      await expect(result).toBeVisible();
      await expect(
        result.getByRole('img', { name: podcast.collectionName })
      ).toBeVisible();
    }
    await expect(
      page.getByRole('img', { name: 'Search Placeholder' })
    ).toHaveCount(0);

    // Hovering highlights but does not select: the view stays on step 1.
    await page
      .getByRole('button', { name: new RegExp(PODCASTS[0].collectionName) })
      .hover();
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

    await page
      .getByRole('button', { name: new RegExp(PODCASTS[1].collectionName) })
      .click();

    await expect(messageInput(page)).toBeVisible();
    // The stubbed artwork is a black square, so the dominant colour is black.
    await expectDesign(page, {
      podcastName: PODCASTS[1].collectionName,
      background: '#000000'
    });

    await step(page, '1 Select').click();
    await page
      .getByRole('button', { name: new RegExp(PODCASTS[2].collectionName) })
      .click();
    await expectDesign(page, { podcastName: PODCASTS[2].collectionName });
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
    ).toBeVisible();

    // No podcast was selected, so nothing is placed in the design.
    await expectDesign(page, {
      message: DEFAULT_MESSAGE_TEXT,
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
