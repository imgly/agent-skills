import {
  generateColorAbstractionTokensAccent,
  generateColorAbstractionTokensActive,
  generateColorAbstractionTokensCanvas,
  generateColorAbstractionTokensSurface
} from '../../src/imgly/color';
import { expect, test } from './fixtures';
import { ThemingSidebar, type ColorRow } from './sidebar';

/**
 * A colour row's token reaches `.ubq-public` from the kit's own generator, so
 * the case and the generator share one source of truth. The exact strings are
 * pinned by the unit tests.
 */
async function expectToken(
  sidebar: ThemingSidebar,
  token: string,
  expected: string
): Promise<void> {
  const wanted = await sidebar.resolveColor(expected);
  await expect.poll(() => sidebar.resolvedToken(token)).toBe(wanted);
}

async function pickPreset(
  sidebar: ThemingSidebar,
  row: ColorRow,
  color: string
): Promise<void> {
  await sidebar.presetSwatch(row, color).click();
}

test.describe('Colours', () => {
  test('TH-06 surface background from a preset', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await pickPreset(sidebar, 'Surface Background', '#230D38');

    expect(await sidebar.hasCustomThemeStyle()).toBe(true);
    await expectToken(
      sidebar,
      '--ubq-elevation-1',
      generateColorAbstractionTokensSurface('#230D38')['--ubq-elevation-1']
    );
  });

  test('TH-07 surface background from the colour field', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.setHex('Surface Background', '#3B0A45');

    await expectToken(
      sidebar,
      '--ubq-elevation-1',
      generateColorAbstractionTokensSurface('#3B0A45')['--ubq-elevation-1']
    );
  });

  test('TH-08 canvas background from a preset', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await pickPreset(sidebar, 'Canvas Background', '#242623');

    await expectToken(
      sidebar,
      '--ubq-canvas',
      generateColorAbstractionTokensCanvas('#242623')['--ubq-canvas']
    );
  });

  test('TH-09 canvas background from the colour field', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.setHex('Canvas Background', '#1E2A38');

    await expectToken(
      sidebar,
      '--ubq-canvas',
      generateColorAbstractionTokensCanvas('#1E2A38')['--ubq-canvas']
    );
  });

  test('TH-10 active colour from a preset', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await pickPreset(sidebar, 'Active', '#5D6266');

    await expectToken(
      sidebar,
      '--ubq-interactive-active-default',
      generateColorAbstractionTokensActive('#5D6266')[
        '--ubq-interactive-active-default'
      ]
    );
  });

  test('TH-11 active colour from the colour field', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.setHex('Active', '#C0FFEE');

    await expectToken(
      sidebar,
      '--ubq-interactive-active-default',
      generateColorAbstractionTokensActive('#C0FFEE')[
        '--ubq-interactive-active-default'
      ]
    );
  });

  test('TH-12 accent colour from a preset', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await pickPreset(sidebar, 'Accent', '#66D3EB');

    await expectToken(
      sidebar,
      '--ubq-interactive-accent-default',
      generateColorAbstractionTokensAccent('#66D3EB')[
        '--ubq-interactive-accent-default'
      ]
    );
  });

  test('TH-13 accent colour from the colour field', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.setHex('Accent', '#F6CE4B');

    await expectToken(
      sidebar,
      '--ubq-interactive-accent-default',
      generateColorAbstractionTokensAccent('#F6CE4B')[
        '--ubq-interactive-accent-default'
      ]
    );
  });

  test('TH-14 switching theme clears the custom colours', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await pickPreset(sidebar, 'Surface Background', '#230D38');
    expect(await sidebar.hasCustomThemeStyle()).toBe(true);

    await sidebar.themeButton('Light').click();

    await expect.poll(() => sidebar.hasCustomThemeStyle()).toBe(false);
    for (const [row, color] of [
      ['Surface Background', 'rgb(214, 219, 225)'],
      ['Canvas Background', 'rgb(214, 219, 225)'],
      ['Active', 'rgb(78, 84, 90)'],
      ['Accent', 'rgb(66, 96, 245)']
    ] as const) {
      await expect(
        sidebar.pickerTrigger(row).locator('span').first()
      ).toHaveCSS('background-color', color);
    }
  });

  test('TH-15 only one picker is open at a time', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    // Accent first: an open picker covers the rows under it, so the second
    // click has to land on a row above the first.
    await sidebar.pickerTrigger('Accent').click();
    await expect(sidebar.hexInput('Accent')).toBeVisible();

    await sidebar.pickerTrigger('Surface Background').click();
    await expect(sidebar.hexInput('Accent')).toBeHidden();
    await expect(sidebar.hexInput('Surface Background')).toBeVisible();

    await kit.page.getByText('UI Scaling').click();
    await expect(sidebar.hexInput('Surface Background')).toBeHidden();
  });
});
