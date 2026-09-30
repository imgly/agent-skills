import { editorPanel, expect, test } from '@imgly/kit-test-harness';

const ANIMATION_PANEL = '//ly.img.panel/inspector/animation';

test.describe('Start-up', () => {
  test('VAN-01 the Lunar template opens with animations applied', async ({
    kit
  }) => {
    const scene = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      return {
        mode: engine.scene.getMode(),
        pages: engine.scene.getPages().length,
        animated: engine.block
          .findAll()
          .filter(
            (block: number) =>
              engine.block.supportsAnimation(block) &&
              (engine.block.getInAnimation(block) !== 0 ||
                engine.block.getOutAnimation(block) !== 0 ||
                engine.block.getLoopAnimation(block) !== 0)
          ).length
      };
    }, kit.editor);

    expect(scene.mode).toBe('Video');
    expect(scene.pages).toBe(1);
    expect(scene.animated).toBeGreaterThan(0);
  });

  test('VAN-02 the animation panel is open on a background clip', async ({
    kit
  }) => {
    await expect(editorPanel(kit.page, ANIMATION_PANEL)).toBeVisible();

    const selection = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [selected] = engine.block.findAllSelected();
      const parent = engine.block.getParent(selected);
      return {
        onBackgroundTrack: engine.block.isAlwaysOnBottom(parent),
        visible: engine.block.isVisibleAtCurrentPlaybackTime(selected),
        inspectorPosition: handle.cesdk.ui.getPanelPosition(
          '//ly.img.panel/inspector'
        )
      };
    }, kit.editor);

    expect(selection.onBackgroundTrack).toBe(true);
    expect(selection.visible).toBe(true);
    expect(selection.inspectorPosition).toBe('right');
  });

  test('VAN-03 the animation panel reopens on a scene change', async ({
    kit
  }) => {
    const before = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected()[0],
      kit.editor
    );

    await kit.page.evaluate(async (handle) => {
      const [asset] = (
        await handle.engine.asset.findAssets('ly.img.video.scene', {
          page: 0,
          perPage: 10
        })
      ).assets.filter((entry: { id: string }) => entry.id === 'surf-school');
      await handle.engine.scene.load(asset.meta.uri);
    }, kit.editor);

    await expect
      .poll(() =>
        kit.page.evaluate((handle) => {
          const engine = handle.engine;
          const [selected] = engine.block.findAllSelected();
          if (selected == null) {
            return false;
          }
          return engine.block.isAlwaysOnBottom(
            engine.block.getParent(selected)
          );
        }, kit.editor)
      )
      .toBe(true);

    await expect(editorPanel(kit.page, ANIMATION_PANEL)).toBeVisible();

    const after = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected()[0],
      kit.editor
    );
    expect(after).not.toBe(before);
  });
});
