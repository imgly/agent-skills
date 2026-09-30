import type { Page } from '@playwright/test';

import { editorRoot } from '@imgly/kit-test-harness';

import { expect, test } from './fixtures';
import { LocaleSwitcher } from './locale-switcher';

/** The phases the kit reported to the host that embeds the demo. */
function lifecycleMarks(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    performance
      .getEntriesByType('mark')
      .map((entry) => entry.name)
      .filter((name) => name.startsWith('ly.img.demo.lifecycle.'))
  );
}

test.describe('Start-up', () => {
  test('TI-01 the English and German controls are shown', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);

    await expect(switcher.localeButton('English')).toBeVisible();
    await expect(switcher.localeButton('German')).toBeVisible();

    const pages = await kit.page.evaluate(
      ({ engine }) => ({
        count: engine.scene.getPages().length,
        titles: engine.editor.getSettingBool('page/title/show')
      }),
      kit.editor
    );
    expect(pages).toEqual({ count: 2, titles: true });

    await expect
      .poll(() => lifecycleMarks(kit.page))
      .toEqual([
        'ly.img.demo.lifecycle.created',
        'ly.img.demo.lifecycle.ready'
      ]);
  });

  test('TI-01b the switcher sits centred above the editor', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);
    const editor = editorRoot(kit.page).first();

    await expect(
      editor.getByRole('button', { name: /^(English|German)$/ })
    ).toHaveCount(0);

    const english = (await switcher.localeButton('English').boundingBox())!;
    const german = (await switcher.localeButton('German').boundingBox())!;
    const editorBox = (await editor.boundingBox())!;
    const viewport = kit.page.viewportSize()!;

    const left = Math.min(english.x, german.x);
    const right = Math.max(english.x + english.width, german.x + german.width);
    const bottom = Math.max(
      english.y + english.height,
      german.y + german.height
    );
    expect(bottom).toBeLessThanOrEqual(editorBox.y);
    expect(Math.abs((left + right) / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(
      Math.abs(editorBox.x + editorBox.width / 2 - viewport.width / 2)
    ).toBeLessThan(2);
  });

  test('TI-02 English is the active control', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);

    expect(
      await kit.page.evaluate(({ cesdk }) => cesdk.i18n.getLocale(), kit.editor)
    ).toBe('en');
    expect(await switcher.isActive(switcher.localeButton('English'))).toBe(
      true
    );
    expect(await switcher.isActive(switcher.localeButton('German'))).toBe(
      false
    );
  });

  // The editor does not publish `userId`, so only the flag is observable here.
  test('TI-U7 the kit enables the archive feature flag', async ({ kit }) => {
    expect(
      await kit.page.evaluate(
        ({ cesdk }) => cesdk.config.featureFlags,
        kit.editor
      )
    ).toEqual({ archiveSceneEnabled: true });
  });
});

test.describe('Start-up on a German browser', () => {
  test.use({ locale: 'de-DE' });

  test('TI-03 the kit starts in German', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);

    expect(
      await kit.page.evaluate(({ cesdk }) => cesdk.i18n.getLocale(), kit.editor)
    ).toBe('de');
    expect(await switcher.isActive(switcher.localeButton('German'))).toBe(true);
  });
});
