import {
  createTestEngine,
  disposeTestEngine,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { openAnimationPanel } from '../../src/imgly/animation-panel';

let engine: any;

function instance(): CreativeEditorSDK {
  return {
    engine,
    ui: { openPanel: vi.fn() }
  } as unknown as CreativeEditorSDK;
}

beforeAll(async () => {
  engine = (await createTestEngine()) as TestEngine;
});

afterAll(() => {
  disposeTestEngine();
});

/**
 * The headless engine has no render loop, so clip visibility stays at its
 * initial value until something drives an update. A tiny export is the
 * cheapest way to make one happen.
 */
async function tick(page: number): Promise<void> {
  await engine.block.export(page, {
    mimeType: 'image/png',
    targetWidth: 8,
    targetHeight: 8
  });
}

function createVideoPage(): { page: number; scene: number } {
  const scene = engine.scene.createVideo();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);
  engine.block.appendChild(scene, page);
  return { page, scene };
}

describe('VAN-H1 openAnimationPanel selects the first visible background clip', () => {
  it('picks the clip that covers the current playback time', async () => {
    const { page } = createVideoPage();
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);
    engine.block.setAlwaysOnBottom(track, true);

    const first = engine.block.create('graphic');
    engine.block.setShape(first, engine.block.createShape('rect'));
    engine.block.setFill(first, engine.block.createFill('color'));
    engine.block.appendChild(track, first);
    engine.block.setDuration(first, 1);

    const second = engine.block.create('graphic');
    engine.block.setShape(second, engine.block.createShape('rect'));
    engine.block.setFill(second, engine.block.createFill('color'));
    engine.block.appendChild(track, second);
    engine.block.setDuration(second, 3);

    engine.block.setPlaybackTime(page, 2);
    await tick(page);

    const cesdk = instance();
    await openAnimationPanel(cesdk);

    expect(engine.block.findAllSelected()).toEqual([second]);
    expect(cesdk.ui.openPanel).toHaveBeenCalledTimes(1);
    expect(cesdk.ui.openPanel).toHaveBeenCalledWith(
      '//ly.img.panel/inspector/animation'
    );
  });

  it('selects nothing when the scene has no background track', async () => {
    const { page } = createVideoPage();
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const clip = engine.block.create('graphic');
    engine.block.setShape(clip, engine.block.createShape('rect'));
    engine.block.setFill(clip, engine.block.createFill('color'));
    engine.block.appendChild(track, clip);
    engine.block.setDuration(clip, 3);
    await tick(page);

    const cesdk = instance();
    await openAnimationPanel(cesdk);

    expect(engine.block.findAllSelected()).toEqual([]);
    expect(cesdk.ui.openPanel).not.toHaveBeenCalled();
  });
});
