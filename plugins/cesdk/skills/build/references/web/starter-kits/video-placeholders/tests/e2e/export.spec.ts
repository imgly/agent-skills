import {
  expect,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';
import { switchRole } from './roles';

const EXPORT_LABELS = [
  'Export Video',
  'Export Design',
  'Export Scene',
  'Export Archive',
  'Save'
];

async function expectNoExportAffordance(page: import('@playwright/test').Page) {
  for (const name of EXPORT_LABELS) {
    await expect(page.getByRole('button', { name })).toHaveCount(0);
  }
}

test.describe('Export', () => {
  test('VPL-10 export is not available in either role', async ({ kit }) => {
    await spyExportVideo(kit.page, { intercept: true });
    await expectNoExportAffordance(kit.page);
    expect(await videoExportCalls(kit.page)).toEqual([]);

    // The spy stays on the Creator instance: the role switch builds a new
    // editor and the harness installs only once per page.
    const editor = await switchRole(kit, 'Adopter');
    await expectNoExportAffordance(kit.page);
    expect(await videoExportCalls(kit.page)).toEqual([]);
    await editor.dispose();
  });
});
