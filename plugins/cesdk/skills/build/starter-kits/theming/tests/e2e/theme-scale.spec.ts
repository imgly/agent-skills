import { expect, test } from './fixtures';
import { ThemingSidebar } from './sidebar';

async function appearance(kit: {
  page: import('@playwright/test').Page;
  editor: import('@playwright/test').JSHandle<{ cesdk: any }>;
}): Promise<{ theme: string; scale: string }> {
  return kit.page.evaluate(
    ({ cesdk }) => ({ theme: cesdk.ui.getTheme(), scale: cesdk.ui.getScale() }),
    kit.editor
  );
}

test.describe('Theme and scale', () => {
  test('TH-02 light theme', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.themeButton('Light').click();

    await expect.poll(async () => (await appearance(kit)).theme).toBe('light');
    expect(await sidebar.isActive(sidebar.themeButton('Light'))).toBe(true);
    expect(await sidebar.isActive(sidebar.themeButton('Dark'))).toBe(false);
    expect(await sidebar.hasCustomThemeStyle()).toBe(false);
  });

  test('TH-03 dark theme', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.themeButton('Light').click();
    await sidebar.themeButton('Dark').click();

    await expect.poll(async () => (await appearance(kit)).theme).toBe('dark');
    expect(await sidebar.isActive(sidebar.themeButton('Dark'))).toBe(true);
  });

  test('TH-04 normal scaling', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.scaleButton('Large').click();
    await sidebar.scaleButton('Normal').click();

    await expect.poll(async () => (await appearance(kit)).scale).toBe('normal');
    expect(await sidebar.isActive(sidebar.scaleButton('Normal'))).toBe(true);
  });

  test('TH-05 large scaling', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);

    await sidebar.scaleButton('Large').click();

    await expect.poll(async () => (await appearance(kit)).scale).toBe('large');
    expect(await sidebar.isActive(sidebar.scaleButton('Large'))).toBe(true);
    expect(await sidebar.isActive(sidebar.scaleButton('Normal'))).toBe(false);
  });
});
