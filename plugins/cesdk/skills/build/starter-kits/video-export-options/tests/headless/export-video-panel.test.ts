import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ExportVideoPanelPlugin } from '../../src/imgly/plugins/export-video-panel';
import { createPanelHarness } from '../unit/panel-harness';

const SCENE = fileURLToPath(
  new URL('../../public/assets/example-video-motion.scene', import.meta.url)
);

let engine: TestEngine;

beforeAll(async () => {
  engine = await createTestEngine();
  await loadScene(engine, SCENE);
});

afterAll(() => {
  disposeTestEngine();
});

describe('VEO-H1 the filter against the real demo scene', () => {
  it('offers the 16:9 presets and selects Full HD for the shipped page', async () => {
    const harness = await createPanelHarness(ExportVideoPanelPlugin() as never);

    harness.render(engine);

    const select = harness.find('Select', 'resolution-select')!;
    expect(
      (select.options.values as { id: string }[]).map((value) => value.id)
    ).toEqual([
      'HD (High Definition), 720p',
      'FHD (Full HD), 1080p',
      '2K (Quad HD), 1440p',
      '4K (Ultra HD), 2160p',
      'Custom'
    ]);
    expect(select.options.value.value).toEqual({ width: 1920, height: 1080 });
  });

  it('the shipped page is 1920 x 1080', () => {
    const scene = engine.scene as { getCurrentPage(): number };
    const block = engine.block as {
      getFrameWidth(id: number): number;
      getFrameHeight(id: number): number;
    };
    const page = scene.getCurrentPage();

    expect([block.getFrameWidth(page), block.getFrameHeight(page)]).toEqual([
      1920, 1080
    ]);
  });
});
