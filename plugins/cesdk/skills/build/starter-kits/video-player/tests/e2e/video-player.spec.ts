import { expect, test } from '@imgly/kit-test-harness';

/** The bars the kit's read-only promise says are empty. */
const EMPTY_ORDERS: ReadonlyArray<{ in: string; at?: 'top' | 'bottom' }> = [
  { in: 'ly.img.dock' },
  { in: 'ly.img.navigation.bar' },
  { in: 'ly.img.canvas.menu' },
  { in: 'ly.img.inspector.bar' },
  { in: 'ly.img.canvas.bar', at: 'bottom' },
  { in: 'ly.img.canvas.bar', at: 'top' }
];

const orderKey = (target: { in: string; at?: string }) =>
  target.at == null ? target.in : `${target.in}:${target.at}`;

/** What the sibling video kits' asset-source plugins register, and this kit does not. */
const PLUGIN_ASSET_SOURCES = [
  'ly.img.audio',
  'ly.img.audio.upload',
  'ly.img.blur',
  'ly.img.caption.presets',
  'ly.img.color.palette',
  'ly.img.crop.presets',
  'ly.img.effect',
  'ly.img.filter',
  'ly.img.image',
  'ly.img.image.upload',
  'ly.img.page.presets',
  'ly.img.sticker',
  'ly.img.templates',
  'ly.img.templates.premium',
  'ly.img.text',
  'ly.img.text.components',
  'ly.img.typeface',
  'ly.img.vector.shape',
  'ly.img.video',
  'ly.img.video.upload'
];

test.describe('Start-up', () => {
  test('VPY-01 the player loads the demo scene', async ({ kit }) => {
    const scene = await kit.page.evaluate((handle) => {
      const [page] = handle.engine.scene.getPages();
      return {
        mode: handle.engine.scene.getMode(),
        pages: handle.engine.scene.getPages().length,
        width: handle.engine.block.getFrameWidth(page),
        height: handle.engine.block.getFrameHeight(page)
      };
    }, kit.editor);

    expect(scene).toEqual({
      mode: 'Video',
      pages: 1,
      width: 1080,
      height: 1350
    });
  });

  test('VPY-02 the first page is fitted with the padding the kit asks for', async ({
    kit
  }) => {
    const fitted = await kit.page.evaluate(
      (handle) => handle.engine.scene.getZoomLevel(),
      kit.editor
    );
    expect(fitted).toBeGreaterThan(0);
    expect(fitted).not.toBe(1);

    // Re-running the kit's own call must land on the same zoom, which is what
    // proves the start-up zoom came from these arguments and not from a default.
    await kit.page.evaluate((handle) => {
      handle.engine.scene.setZoomLevel(2);
      return handle.cesdk.actions.run('zoom.toPage', {
        page: 'first',
        autoFit: true,
        padding: 24
      });
    }, kit.editor);

    await expect
      .poll(() =>
        kit.page.evaluate(
          (handle) => handle.engine.scene.getZoomLevel(),
          kit.editor
        )
      )
      .toBeCloseTo(fitted, 3);
  });

  test('VPY-03 the debug hook is the editor instance', async ({ kit }) => {
    const hook = await kit.page.evaluate(
      (handle) => ({
        kind: handle.kind,
        hasEngine: typeof handle.engine.block.getType === 'function',
        hasUi: typeof handle.cesdk.ui.isPanelOpen === 'function'
      }),
      kit.editor
    );

    expect(hook).toEqual({ kind: 'cesdk', hasEngine: true, hasUi: true });
  });
});

test.describe('Playback', () => {
  test('VPY-04 play advances the page and pause stops it', async ({ kit }) => {
    const playbackTime = () =>
      kit.page.evaluate(
        (handle) =>
          handle.engine.block.getPlaybackTime(
            handle.engine.scene.getPages()[0]
          ) as number,
        kit.editor
      );
    const isPlaying = () =>
      kit.page.evaluate(
        (handle) =>
          handle.engine.block.isPlaying(
            handle.engine.scene.getPages()[0]
          ) as boolean,
        kit.editor
      );

    const before = await playbackTime();
    await kit.page.getByRole('button', { name: 'Play complete video' }).click();

    expect(await isPlaying()).toBe(true);
    await expect.poll(playbackTime).toBeGreaterThan(before);

    await kit.page
      .getByRole('button', { name: 'Pause complete video' })
      .click();

    await expect.poll(isPlaying).toBe(false);
  });

  test('VPY-05 the playback controls the player config leaves on are usable', async ({
    kit
  }) => {
    for (const name of [
      'Play complete video',
      'Disable Loop',
      'Fit Video to Timeline',
      'Reduce Timeline Scale',
      'Enlarge Timeline Scale'
    ]) {
      await expect(kit.page.getByRole('button', { name })).toBeEnabled();
    }
  });
});

test.describe('The read-only promise', () => {
  test('VPY-06 selecting and adding blocks are denied', async ({ kit }) => {
    const scopes = await kit.page.evaluate(
      (handle) =>
        ['editor/select', 'editor/add'].map((scope) => [
          scope,
          handle.engine.editor.getGlobalScope(scope)
        ]),
      kit.editor
    );

    expect(scopes).toEqual([
      ['editor/select', 'Deny'],
      ['editor/add', 'Deny']
    ]);
  });

  test('VPY-07 no editing surface and no asset source of the kit’s own', async ({
    kit
  }) => {
    const ui = await kit.page.evaluate(
      ({ handle, targets }) => ({
        orders: Object.fromEntries(
          targets.map((target) => [
            target.at == null ? target.in : `${target.in}:${target.at}`,
            handle.cesdk.ui.getComponentOrder(target as never).length
          ])
        ),
        sources: handle.engine.asset.findAllSources() as string[]
      }),
      { handle: kit.editor, targets: EMPTY_ORDERS }
    );

    expect(ui.orders).toEqual(
      Object.fromEntries(EMPTY_ORDERS.map((target) => [orderKey(target), 0]))
    );
    // Whatever the editor registers for itself is its own business; what the
    // kit owns is that it adds no asset-source plugin.
    for (const source of PLUGIN_ASSET_SOURCES) {
      expect(ui.sources).not.toContain(source);
    }
  });

  test('VPY-08 clicking a block on the canvas selects nothing', async ({
    kit
  }) => {
    await kit.page
      .getByRole('region', { name: 'Canvas', exact: true })
      .click({ position: { x: 700, y: 350 } });

    const selected = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected() as number[],
      kit.editor
    );

    expect(selected).toEqual([]);
  });
});
