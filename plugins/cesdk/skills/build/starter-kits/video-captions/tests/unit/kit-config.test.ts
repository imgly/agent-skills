import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { setupFeatures } from '../../src/imgly/config/features';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

function run<T>(setup: (api: T) => void) {
  const spy = createApiSpy<T>();
  setup(spy.api);
  return spy;
}

describe('VCA-U6 features and settings', () => {
  const features = run<CreativeEditorSDK>(setupFeatures);
  const enabled = features.lastArgsOf('feature.enable')?.[0] as string[];
  const settings = new Map(
    run<CreativeEngine>(setupSettings)
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it.each([
    'ly.img.video.caption',
    'ly.img.video.timeline.clips',
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
    'ly.img.text.edit'
  ])('enables %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('names every feature on its own, enabling no umbrella group', () => {
    const umbrellas = enabled.filter((feature) =>
      enabled.some((other) => other.startsWith(`${feature}.`))
    );
    expect(umbrellas).toEqual([]);
  });

  it('shows the timeline ruler, since every track is visible', () => {
    expect(enabled).toContain('ly.img.video.timeline.ruler');
    expect(features.callsTo('feature.disable')).toEqual([]);
  });

  it('shows every timeline track', () => {
    expect(settings.get('timeline/trackVisibility')).toBe('all');
  });
});

describe('VCA-U7 the navigation bar', () => {
  const spy = run<CreativeEditorSDK>(setupNavigationBar);
  const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    (string | { id: string; children: string[] })[]
  ];

  it('ends with an actions entry whose only child exports video', () => {
    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    expect(order.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: ['ly.img.exportVideo.navigationBar']
    });
  });

  it('inserts no Close entry — App.tsx does that per mode', () => {
    const ids = order.map((entry) =>
      typeof entry === 'string' ? entry : entry.id
    );
    expect(ids).not.toContain('ly.img.close.navigationBar');
    expect(spy.callsTo('ui.insertOrderComponent')).toHaveLength(0);
  });
});
