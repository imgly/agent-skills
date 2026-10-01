import { expect, test } from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

test.describe('Default settings per format', () => {
  test('EO-03 JPEG defaults', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);

    await expect(panel.formatButton('JPEG')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(panel.formatDescription).toHaveText('Shareable web format');
    await expect(panel.pagesButton('All')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(panel.qualitySelect).toHaveText('High');
    await expect(panel.resolutionSelect).toHaveText('Original');
    await expect(panel.sizeText).toHaveText('1080 x 1080 px');
  });

  test('EO-04 PNG defaults', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await panel.selectFormat('PNG');

    await expect(panel.formatButton('PNG')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(panel.formatDescription).toHaveText(
      'Complex Images with Transparency'
    );
    await expect(panel.pagesButton('All')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(panel.qualitySelect).toHaveText('High');
    await expect(panel.resolutionSelect).toHaveText('Original');
  });

  test('EO-05 PDF defaults', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await panel.selectFormat('PDF');

    await expect(panel.formatButton('PDF')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(panel.formatDescription).toHaveText('Best for Printing');
    await expect(panel.qualitySelect).toHaveCount(0);
    await expect(panel.resolutionSelect).toHaveCount(0);
  });
});
