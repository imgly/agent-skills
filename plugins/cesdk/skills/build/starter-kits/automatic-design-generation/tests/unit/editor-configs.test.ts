import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions as setupDesignActions } from '../../src/imgly/config/design/actions';
import { setupFeatures as setupDesignFeatures } from '../../src/imgly/config/design/features';
import { setupNavigationBar as setupDesignNavigationBar } from '../../src/imgly/config/design/ui/navigationBar';
import { setupActions as setupVideoActions } from '../../src/imgly/config/video/actions';
import { setupFeatures as setupVideoFeatures } from '../../src/imgly/config/video/features';
import { setupNavigationBar as setupVideoNavigationBar } from '../../src/imgly/config/video/ui/navigationBar';
import { setupVideoTimeline as setupVideoTimelineOfVideo } from '../../src/imgly/config/video/ui/videoTimeline';

type Setup = (cesdk: CreativeEditorSDK) => void;

function record(setup: Setup) {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  return spy;
}

const ACTIONS_DROPDOWN = 'ly.img.actions.navigationBar';

function actionIds(setup: Setup): string[] {
  return record(setup)
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);
}

function navigationBarOrder(setup: Setup) {
  const [target, order] = record(setup).lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    (string | { id: string; children: string[] })[]
  ];
  expect(target).toEqual({ in: 'ly.img.navigation.bar' });
  return order;
}

function enabledFeatures(setup: Setup): string[] {
  const spy = record(setup);
  expect(spy.callsTo('feature.enable')).toHaveLength(1);
  expect(spy.callsTo('feature.disable')).toHaveLength(0);
  return spy.lastArgsOf('feature.enable')?.[0] as string[];
}

// ADG-U4 — the two editor configurations the modal picks between.
describe('the design config', () => {
  const enabled = enabledFeatures(setupDesignFeatures);

  it('enables exactly the design features this kit needs', () => {
    expect(enabled).toEqual([
      'ly.img.adjustment',
      'ly.img.blendMode',
      'ly.img.blur',
      'ly.img.canvas.bar',
      'ly.img.canvas.menu',
      'ly.img.combine.exclude',
      'ly.img.combine.intersect',
      'ly.img.combine.subtract',
      'ly.img.combine.union',
      'ly.img.crop.fillAlignment',
      'ly.img.crop.fillMode',
      'ly.img.crop.flip',
      'ly.img.crop.panel.autoOpen',
      'ly.img.crop.position',
      'ly.img.crop.rotation',
      'ly.img.crop.scale',
      'ly.img.crop.size',
      'ly.img.cutout',
      'ly.img.delete',
      'ly.img.dock',
      'ly.img.duplicate',
      'ly.img.effect',
      'ly.img.fill.color.library',
      'ly.img.fill.color.picker.gradient',
      'ly.img.fill.color.picker.opacity',
      'ly.img.fill.image',
      'ly.img.filter',
      'ly.img.group.create',
      'ly.img.group.enter',
      'ly.img.group.select',
      'ly.img.group.ungroup',
      'ly.img.inspector.bar',
      'ly.img.inspector.toggle',
      'ly.img.keyboard.shortcuts',
      'ly.img.layerList.canvasFollow',
      'ly.img.layerList.layers',
      'ly.img.layerList.lock',
      'ly.img.layerList.menu',
      'ly.img.layerList.pages',
      'ly.img.layerList.panel',
      'ly.img.layerList.rename',
      'ly.img.layerList.reorder',
      // 'ly.img.layerList.thumbnails', /* Thumbnail on every row */
      'ly.img.layerList.visibility',
      'ly.img.library.panel',
      'ly.img.navigation.actions',
      'ly.img.navigation.back',
      'ly.img.navigation.bar',
      'ly.img.navigation.close',
      'ly.img.navigation.documentSettings',
      'ly.img.navigation.undoRedo',
      'ly.img.navigation.zoom',
      'ly.img.notifications.redo',
      'ly.img.notifications.undo',
      'ly.img.opacity',
      'ly.img.page.add',
      'ly.img.page.bleedMargin',
      'ly.img.page.clipContent',
      'ly.img.page.move',
      'ly.img.page.resize',
      'ly.img.page.settings',
      'ly.img.position.align',
      'ly.img.position.arrange',
      'ly.img.position.distribute',
      'ly.img.replace.audio',
      'ly.img.replace.fill',
      'ly.img.replace.shape',
      'ly.img.scene.layout.free',
      'ly.img.scene.layout.horizontal',
      'ly.img.scene.layout.spacing',
      'ly.img.scene.layout.vertical',
      'ly.img.shadow.blur',
      'ly.img.shadow.color.library',
      'ly.img.shadow.color.picker.opacity',
      'ly.img.shadow.offset',
      'ly.img.shape.options.cornerRadius',
      'ly.img.shape.options.innerDiameter',
      'ly.img.shape.options.lineWidth',
      'ly.img.shape.options.points',
      'ly.img.shape.options.sides',
      'ly.img.stroke.cap',
      'ly.img.stroke.color.library',
      'ly.img.stroke.color.picker.opacity',
      'ly.img.stroke.cornerGeometry',
      'ly.img.stroke.dash',
      'ly.img.stroke.position',
      'ly.img.stroke.style',
      'ly.img.stroke.width',
      'ly.img.text.advanced',
      'ly.img.text.alignment',
      'ly.img.text.background.library',
      'ly.img.text.background.picker.opacity',
      'ly.img.text.decoration',
      'ly.img.text.edit',
      'ly.img.text.fontSize',
      'ly.img.text.fontStyle',
      'ly.img.text.list.ordered',
      'ly.img.text.list.unordered',
      'ly.img.text.path.curve',
      'ly.img.text.path.direction',
      'ly.img.text.path.edit',
      'ly.img.text.path.offset',
      'ly.img.text.path.position',
      'ly.img.text.styles',
      'ly.img.text.typeface',
      'ly.img.transform.flip',
      'ly.img.transform.position',
      'ly.img.transform.rotation',
      'ly.img.transform.size',
      'ly.img.trim'
    ]);
  });

  it('leaves the video feature group off', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
    expect(enabled).not.toContain('ly.img.animations');
    expect(enabled).not.toContain('ly.img.transitions');
  });

  it('registers the documented actions', () => {
    expect(actionIds(setupDesignActions)).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });

  it('offers image export in the Actions dropdown', () => {
    const dropdown = navigationBarOrder(setupDesignNavigationBar).find(
      (entry) => typeof entry === 'object' && entry.id === ACTIONS_DROPDOWN
    ) as { children: string[] };

    expect(dropdown.children).toEqual([
      'ly.img.saveScene.navigationBar',
      'ly.img.exportImage.navigationBar'
    ]);
  });
});

describe('the video config', () => {
  const enabled = enabledFeatures(setupVideoFeatures);

  it('enables exactly the video features this kit needs', () => {
    expect(enabled).toEqual([
      'ly.img.adjustment',
      'ly.img.animations',
      'ly.img.blendMode',
      'ly.img.blur',
      'ly.img.canvas.bar',
      'ly.img.canvas.menu',
      'ly.img.combine.exclude',
      'ly.img.combine.intersect',
      'ly.img.combine.subtract',
      'ly.img.combine.union',
      'ly.img.crop.fillAlignment',
      'ly.img.crop.fillMode',
      'ly.img.crop.flip',
      'ly.img.crop.panel.autoOpen',
      'ly.img.crop.position',
      'ly.img.crop.rotation',
      'ly.img.crop.scale',
      'ly.img.crop.size',
      'ly.img.cutout',
      'ly.img.delete',
      'ly.img.dock',
      'ly.img.duplicate',
      'ly.img.effect',
      'ly.img.fill.color.library',
      'ly.img.fill.color.picker.gradient',
      'ly.img.fill.color.picker.opacity',
      'ly.img.fill.image',
      'ly.img.fill.video',
      'ly.img.filter',
      'ly.img.group.create',
      'ly.img.group.enter',
      'ly.img.group.select',
      'ly.img.group.ungroup',
      'ly.img.inspector.bar',
      'ly.img.inspector.toggle',
      'ly.img.keyboard.shortcuts',
      'ly.img.layerList.canvasFollow',
      'ly.img.layerList.layers',
      'ly.img.layerList.lock',
      'ly.img.layerList.menu',
      'ly.img.layerList.pages',
      'ly.img.layerList.panel',
      'ly.img.layerList.rename',
      'ly.img.layerList.reorder',
      'ly.img.layerList.visibility',
      'ly.img.library.panel',
      'ly.img.navigation.actions',
      'ly.img.navigation.back',
      'ly.img.navigation.bar',
      'ly.img.navigation.close',
      'ly.img.navigation.documentSettings',
      'ly.img.navigation.undoRedo',
      'ly.img.navigation.zoom',
      'ly.img.notifications.redo',
      'ly.img.notifications.undo',
      'ly.img.opacity',
      'ly.img.page.clipContent',
      'ly.img.page.resize',
      'ly.img.page.settings',
      'ly.img.playbackSpeed',
      'ly.img.position.align',
      'ly.img.position.arrange',
      'ly.img.position.distribute',
      'ly.img.replace.audio',
      'ly.img.replace.fill',
      'ly.img.replace.shape',
      'ly.img.shadow.blur',
      'ly.img.shadow.color.library',
      'ly.img.shadow.color.picker.opacity',
      'ly.img.shadow.offset',
      'ly.img.shape.options.cornerRadius',
      'ly.img.shape.options.innerDiameter',
      'ly.img.shape.options.lineWidth',
      'ly.img.shape.options.points',
      'ly.img.shape.options.sides',
      'ly.img.stroke.cap',
      'ly.img.stroke.color.library',
      'ly.img.stroke.color.picker.opacity',
      'ly.img.stroke.cornerGeometry',
      'ly.img.stroke.dash',
      'ly.img.stroke.position',
      'ly.img.stroke.style',
      'ly.img.stroke.width',
      'ly.img.text.advanced',
      'ly.img.text.alignment',
      'ly.img.text.background.library',
      'ly.img.text.background.picker.opacity',
      'ly.img.text.decoration',
      'ly.img.text.edit',
      'ly.img.text.fontSize',
      'ly.img.text.fontStyle',
      'ly.img.text.list.ordered',
      'ly.img.text.list.unordered',
      'ly.img.text.path.curve',
      'ly.img.text.path.direction',
      'ly.img.text.path.edit',
      'ly.img.text.path.offset',
      'ly.img.text.path.position',
      'ly.img.text.styles',
      'ly.img.text.typeface',
      'ly.img.transform.flip',
      'ly.img.transform.position',
      'ly.img.transform.rotation',
      'ly.img.transform.size',
      'ly.img.transitions',
      'ly.img.trim',
      'ly.img.video.caption',
      'ly.img.video.timeline.addClip',
      'ly.img.video.timeline.audio',
      'ly.img.video.timeline.clip.menu',
      'ly.img.video.timeline.clips',
      'ly.img.video.timeline.controls.background',
      'ly.img.video.timeline.controls.bar',
      'ly.img.video.timeline.controls.loop',
      'ly.img.video.timeline.controls.playback',
      'ly.img.video.timeline.controls.split',
      'ly.img.video.timeline.controls.timelineZoom',
      'ly.img.video.timeline.controls.toggle',
      'ly.img.video.timeline.overlays',
      'ly.img.video.timeline.ruler',
      'ly.img.volume'
    ]);
  });

  it('orders the video timeline controls', () => {
    const [target, order] = record(setupVideoTimelineOfVideo).lastArgsOf(
      'ui.setComponentOrder'
    ) as [{ in: string }, string[]];

    expect(target).toEqual({ in: 'ly.img.video.timeline.controls.bar' });
    expect(order.length).toBeGreaterThan(0);
  });

  it('registers only the generic export action', () => {
    expect(actionIds(setupVideoActions)).toEqual(['exportDesign']);
  });

  it('offers video export in the Actions dropdown', () => {
    const dropdown = navigationBarOrder(setupVideoNavigationBar).find(
      (entry) => typeof entry === 'object' && entry.id === ACTIONS_DROPDOWN
    ) as { children: string[] };

    expect(dropdown.children).toEqual([
      'ly.img.saveScene.navigationBar',
      'ly.img.exportVideo.navigationBar'
    ]);
  });
});
