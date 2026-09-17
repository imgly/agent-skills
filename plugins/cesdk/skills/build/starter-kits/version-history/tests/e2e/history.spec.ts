import { expect, test, type Kit } from '@imgly/kit-test-harness';
import { HistoryPanel, sceneText } from './history-panel';

/** Move the first graphic on the page, which is an edit the canvas shows. */
async function moveAGraphic(kit: Kit): Promise<number> {
  return kit.page.evaluate((cesdk) => {
    const [block] = cesdk.engine.block.findByType('graphic');
    const moved = cesdk.engine.block.getPositionX(block) + 120;
    cesdk.engine.block.setPositionX(block, moved);
    return moved;
  }, kit.editor);
}

test.describe('Version history', () => {
  test('VH-01 the seeded snapshots', async ({ kit }) => {
    const panel = new HistoryPanel(kit.page);

    await expect(panel.heading).toBeVisible();
    await expect(panel.count).toHaveText('3 Snapshots');
    expect(await panel.userNames()).toEqual([
      'Patrick S.',
      'Dustin K.',
      'Marius W.'
    ]);
    await expect(panel.entries.first().getByRole('img')).toBeVisible();
    await expect(panel.saveButton).toBeEnabled();
  });

  test('VH-02 load a snapshot', async ({ kit }) => {
    const panel = new HistoryPanel(kit.page);
    const first = await sceneText(kit.page, kit.editor);

    await panel.entry('Dustin K.').click();
    await expect.poll(() => sceneText(kit.page, kit.editor)).not.toEqual(first);
    const second = await sceneText(kit.page, kit.editor);

    await panel.entry('Marius W.').click();
    await expect
      .poll(() => sceneText(kit.page, kit.editor))
      .not.toEqual(second);
    const third = await sceneText(kit.page, kit.editor);
    expect(third).not.toEqual(first);

    await panel.entry('Patrick S.').click();
    await expect.poll(() => sceneText(kit.page, kit.editor)).toEqual(first);

    await expect(panel.count).toHaveText('3 Snapshots');
  });

  test('VH-03 editing does not add a snapshot', async ({ kit }) => {
    const panel = new HistoryPanel(kit.page);

    const moved = await moveAGraphic(kit);

    expect(
      await kit.page.evaluate(
        (cesdk) =>
          cesdk.engine.block.getPositionX(
            cesdk.engine.block.findByType('graphic')[0]
          ),
        kit.editor
      )
    ).toBeCloseTo(moved, 3);
    await expect(panel.count).toHaveText('3 Snapshots');
    await expect(panel.entries).toHaveCount(3);
  });

  test('VH-04 save a snapshot', async ({ kit }) => {
    const panel = new HistoryPanel(kit.page);
    const seeded = await sceneText(kit.page, kit.editor);

    await kit.page.evaluate((cesdk) => {
      const [text] = cesdk.engine.block.findByType('text');
      cesdk.engine.block.setString(text, 'text/text', 'Edited before saving');
    }, kit.editor);
    const edited = await sceneText(kit.page, kit.editor);

    await panel.saveButton.click();

    await expect(panel.count).toHaveText('4 Snapshots');
    expect(await panel.userNames()).toEqual([
      'Anonymous',
      'Patrick S.',
      'Dustin K.',
      'Marius W.'
    ]);
    await expect(panel.entries.first().getByRole('img')).toBeVisible();

    await panel.entry('Dustin K.').click();
    await expect
      .poll(() => sceneText(kit.page, kit.editor))
      .not.toEqual(edited);

    await panel.entry('Anonymous').click();
    await expect.poll(() => sceneText(kit.page, kit.editor)).toEqual(edited);
    expect(edited).not.toEqual(seeded);
  });

  test('VH-05 snapshots are not persisted', async ({ kit }) => {
    const panel = new HistoryPanel(kit.page);
    await panel.saveButton.click();
    await expect(panel.count).toHaveText('4 Snapshots');

    await kit.page.reload();
    await kit.page.waitForFunction(
      () => (window as any).cesdk?.engine?.scene?.get() != null
    );

    await expect(panel.count).toHaveText('3 Snapshots');
    expect(await panel.userNames()).toEqual([
      'Patrick S.',
      'Dustin K.',
      'Marius W.'
    ]);
  });

  test('VH-06 two snapshots in a row', async ({ kit }) => {
    const panel = new HistoryPanel(kit.page);

    await kit.page.evaluate((cesdk) => {
      const [text] = cesdk.engine.block.findByType('text');
      cesdk.engine.block.setString(text, 'text/text', 'First save');
    }, kit.editor);
    await panel.saveButton.click();
    await expect(panel.count).toHaveText('4 Snapshots');
    const firstSave = await sceneText(kit.page, kit.editor);

    await kit.page.evaluate((cesdk) => {
      const [text] = cesdk.engine.block.findByType('text');
      cesdk.engine.block.setString(text, 'text/text', 'Second save');
    }, kit.editor);
    await panel.saveButton.click();
    await expect(panel.count).toHaveText('5 Snapshots');
    const secondSave = await sceneText(kit.page, kit.editor);

    expect(await panel.userNames()).toEqual([
      'Anonymous',
      'Anonymous',
      'Patrick S.',
      'Dustin K.',
      'Marius W.'
    ]);

    await panel.entries.nth(1).click();
    await expect.poll(() => sceneText(kit.page, kit.editor)).toEqual(firstSave);

    await panel.entries.nth(0).click();
    await expect
      .poll(() => sceneText(kit.page, kit.editor))
      .toEqual(secondSave);
  });
});
