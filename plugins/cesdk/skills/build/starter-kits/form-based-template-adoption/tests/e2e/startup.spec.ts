import { expect, test } from '@imgly/kit-test-harness';
import { EditTemplatePanel } from './edit-template-panel';

test.describe('Start-up and locked-down UI', () => {
  test('FTA-01 editor loads with the Edit Template panel', async ({ kit }) => {
    const panel = new EditTemplatePanel(kit.page);

    await expect(panel.root).toBeVisible();
    await expect(panel.title).toBeVisible();
    await expect(panel.section('Image')).toBeVisible();
    await expect(panel.section('Text')).toBeVisible();
    await expect(panel.section('Color')).toBeVisible();

    const pages = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );
    expect(pages).toBe(2);

    await expect(kit.page.getByRole('region', { name: 'Dock' })).toHaveCount(0);
    const inspectorBar = kit.page.getByRole('region', {
      name: 'Inspector Bar'
    });
    await expect(inspectorBar.getByRole('button')).toHaveCount(0);
  });

  test('FTA-02 the canvas cannot be edited directly', async ({ kit }) => {
    const canvas = kit.page.getByRole('region', {
      name: 'Canvas',
      exact: true
    });
    const box = (await canvas.boundingBox())!;

    await kit.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await kit.page.mouse.dblclick(
      box.x + box.width / 2,
      box.y + box.height / 2
    );

    const state = await kit.page.evaluate(
      (handle) => ({
        selected: handle.engine.block.findAllSelected().length,
        scope: handle.engine.editor.getGlobalScope('editor/select')
      }),
      kit.editor
    );
    expect(state).toEqual({ selected: 0, scope: 'Deny' });
  });

  test('FTA-03 the panel cannot be closed', async ({ kit }) => {
    const panel = new EditTemplatePanel(kit.page);

    await expect(panel.root.getByRole('button', { name: 'Close' })).toHaveCount(
      0
    );
    await kit.page.keyboard.press('Escape');

    await expect(panel.root).toBeVisible();
    expect(
      await kit.page.evaluate(
        (handle) => handle.cesdk.ui.isPanelOpen('form-based-adaption'),
        kit.editor
      )
    ).toBe(true);
  });

  test('FTA-04 zoom and scroll are off', async ({ kit }) => {
    const zoom = () =>
      kit.page.evaluate(
        (handle) => handle.engine.scene.getZoomLevel(),
        kit.editor
      );
    const before = await zoom();
    const canvas = kit.page.getByRole('region', {
      name: 'Canvas',
      exact: true
    });
    const box = (await canvas.boundingBox())!;

    await kit.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await kit.page.mouse.wheel(0, 400);
    await kit.page.waitForTimeout(500);

    expect(await zoom()).toBe(before);
  });
});
