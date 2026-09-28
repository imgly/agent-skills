import type { Page } from '@playwright/test';

import { expect, test } from './fixtures';
import { ThemingSidebar } from './sidebar';

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
  test('TH-01 editor loads dark, at normal scale, with the sidebar, and reports its lifecycle', async ({
    kit
  }) => {
    const sidebar = new ThemingSidebar(kit.page);

    const state = await kit.page.evaluate(
      ({ engine, cesdk }) => ({
        pages: engine.scene.getPages().length,
        theme: cesdk.ui.getTheme(),
        scale: cesdk.ui.getScale(),
        pageTitles: engine.editor.getSettingBool('page/title/show')
      }),
      kit.editor
    );

    expect(state).toEqual({
      pages: 2,
      theme: 'dark',
      scale: 'normal',
      pageTitles: true
    });

    await expect
      .poll(() => lifecycleMarks(kit.page))
      .toEqual([
        'ly.img.demo.lifecycle.created',
        'ly.img.demo.lifecycle.ready'
      ]);

    await expect(sidebar.scaleButton('Normal')).toBeVisible();
    await expect(sidebar.scaleButton('Large')).toBeVisible();
    await expect(sidebar.themeButton('Light')).toBeVisible();
    await expect(sidebar.themeButton('Dark')).toBeVisible();

    for (const row of [
      'Surface Background',
      'Canvas Background',
      'Active',
      'Accent'
    ] as const) {
      await expect(sidebar.pickerTrigger(row)).toBeVisible();
      await expect(
        kit.page.getByRole('button', { name: new RegExp(`^${row} #`) })
      ).toHaveCount(5);
    }

    expect(await sidebar.hasCustomThemeStyle()).toBe(false);
  });
});
