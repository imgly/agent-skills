import { expect, test } from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

const MAX_ERROR = "Height or width can't be greater than 4000";
const MIN_ERROR = 'Height and width must be at least 16';

test.describe('Custom resolution', () => {
  test('VEO-10 the custom size fields appear and stay in ratio', async ({
    kit
  }) => {
    const panel = new ExportPanel(kit.page);

    await panel.setResolution('Custom');

    await expect(panel.customHeight).toHaveValue('1080');
    await expect(panel.customWidth).toHaveValue('1920');

    await panel.setNumber(panel.customHeight, 720);
    await expect(panel.customWidth).toHaveValue('1280');

    await panel.setNumber(panel.customWidth, 640);
    await expect(panel.customHeight).toHaveValue('360');
  });

  test('VEO-11 a derived size above the limit is rejected', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);

    await panel.setResolution('Custom');
    // The input clamps at 4000; the derived width is not clamped, which is what
    // makes this message reachable.
    await panel.setNumber(panel.customHeight, 4000);

    await expect(panel.customWidth).toHaveValue('7111');
    await expect(panel.errorMessage(MAX_ERROR)).toBeVisible();
    await expect(panel.exportButton).toBeDisabled();
  });

  test('VEO-12 a derived size below the limit is rejected', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);

    await panel.setResolution('Custom');
    await panel.setNumber(panel.customWidth, 16);

    await expect(panel.customHeight).toHaveValue('9');
    await expect(panel.errorMessage(MIN_ERROR)).toBeVisible();
    await expect(panel.exportButton).toBeDisabled();
  });
});
