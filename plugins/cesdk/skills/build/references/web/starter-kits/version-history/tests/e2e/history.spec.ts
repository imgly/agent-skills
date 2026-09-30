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

/** What each History entry shows: its thumbnail, author and date. */
function entryContents(panel: HistoryPanel) {
  return panel.entries.evaluateAll((entries) =>
    entries.map((entry) => ({
      thumbnail: entry.querySelector('img')?.getAttribute('src') ?? null,
      text: (entry as HTMLElement).innerText
    }))
  );
}

/**
 * How far a thumbnail is from the page on the canvas: both are drawn at
 * 32 × 40 and compared channel by channel, 0 for identical, 255 for opposite.
 */
function thumbnailDistance(kit: Kit, thumbnailUrl: string): Promise<number> {
  return kit.page.evaluate(
    async ({ cesdk, url }) => {
      const engine = cesdk.engine;
      const page = engine.scene.getCurrentPage();
      const rendered = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: 168,
        targetHeight: 210
      });
      const thumbnail = await (await fetch(url)).blob();
      const pixels = async (blob: Blob) => {
        const canvas = new OffscreenCanvas(32, 40);
        const context = canvas.getContext('2d')!;
        context.drawImage(await createImageBitmap(blob), 0, 0, 32, 40);
        return context.getImageData(0, 0, 32, 40).data;
      };
      const [a, b] = await Promise.all([pixels(rendered), pixels(thumbnail)]);
      let sum = 0;
      for (let i = 0; i < a.length; i += 4) {
        sum +=
          Math.abs(a[i] - b[i]) +
          Math.abs(a[i + 1] - b[i + 1]) +
          Math.abs(a[i + 2] - b[i + 2]);
      }
      return sum / ((a.length / 4) * 3);
    },
    { cesdk: kit.editor, url: thumbnailUrl }
  );
}

test.describe('History entries', () => {
  test('VH-07 editing leaves the existing entries as they were', async ({
    kit
  }) => {
    const panel = new HistoryPanel(kit.page);
    const before = await entryContents(panel);
    expect(before).toHaveLength(3);

    await moveAGraphic(kit);
    await kit.page.evaluate((cesdk) => {
      const [text] = cesdk.engine.block.findByType('text');
      cesdk.engine.block.setString(text, 'text/text', 'Edited');
      cesdk.engine.editor.addUndoStep();
    }, kit.editor);

    // Saving waits on an export, so anything the edit set off has run by the
    // time the new entry shows.
    await panel.saveButton.click();
    await expect(panel.count).toHaveText('4 Snapshots');
    expect((await entryContents(panel)).slice(1)).toEqual(before);
  });

  test('VH-08 each seeded thumbnail shows the design its entry loads', async ({
    kit
  }) => {
    const panel = new HistoryPanel(kit.page);
    const names = ['Dustin K.', 'Marius W.', 'Patrick S.'];
    const thumbnails = await Promise.all(
      names.map((name) =>
        panel.entry(name).getByRole('img').getAttribute('src')
      )
    );

    // Row: the design on the canvas after loading an entry. Column: a thumbnail.
    const distances: number[][] = [];
    for (const name of names) {
      const previous = await sceneText(kit.page, kit.editor);
      await panel.entry(name).click();
      await expect
        .poll(() => sceneText(kit.page, kit.editor))
        .not.toEqual(previous);
      const row: number[] = [];
      for (const url of thumbnails) {
        row.push(await thumbnailDistance(kit, url!));
      }
      distances.push(row);
    }

    distances.forEach((row, index) => {
      expect(row[index]).toBe(Math.min(...row));
      expect(row[index]).toBeLessThan(20);
    });
  });
});
