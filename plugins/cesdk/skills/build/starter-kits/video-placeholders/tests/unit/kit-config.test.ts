import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { setupFeatures as setupAdvancedFeatures } from '../../src/imgly/config/advanced-video-editor/features';
import { setupSettings as setupAdvancedSettings } from '../../src/imgly/config/advanced-video-editor/settings';
import { setupNavigationBar as setupAdvancedNavigationBar } from '../../src/imgly/config/advanced-video-editor/ui/navigationBar';
import { setupFeatures } from '../../src/imgly/config/video-editor/features';
import { setupNavigationBar } from '../../src/imgly/config/video-editor/ui/navigationBar';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

const EXPORT_COMPONENTS = [
  'ly.img.exportVideo.navigationBar',
  'ly.img.actions.navigationBar',
  'ly.img.saveScene.navigationBar',
  'ly.img.exportScene.navigationBar'
];

function run<T>(setup: (api: T) => void) {
  const spy = createApiSpy<T>();
  setup(spy.api);
  return spy;
}

describe('VPL-U5 placeholder features per role', () => {
  const advanced = run<CreativeEditorSDK>(setupAdvancedFeatures);
  const plain = run<CreativeEditorSDK>(setupFeatures);

  function placeholderFeatures(spy: ReturnType<typeof run>): string[] {
    const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];
    return enabled.filter((feature) =>
      feature.startsWith('ly.img.placeholder')
    );
  }

  it('the Creator configuration enables the placeholder feature', () => {
    const features = placeholderFeatures(advanced);
    expect(features).toHaveLength(24);
    expect(features).toContain('ly.img.placeholder.fill.actAsPlaceholder');
    expect(features).toContain('ly.img.placeholder.text.actAsPlaceholder');
  });

  it('the Adopter configuration does not', () => {
    expect(placeholderFeatures(plain)).toEqual([]);
  });

  it.each([
    ['Creator', advanced],
    ['Adopter', plain]
  ])(
    'the %s configuration names every feature on its own, enabling no umbrella group',
    (_role, spy) => {
      const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];
      const umbrellas = enabled.filter((feature) =>
        enabled.some((other) => other.startsWith(`${feature}.`))
      );
      expect(umbrellas).toEqual([]);
    }
  );

  it.each([
    ['Creator', advanced],
    ['Adopter', plain]
  ])(
    'the %s configuration shows the timeline ruler, since every track is visible',
    (_role, spy) => {
      const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];
      expect(enabled).toContain('ly.img.video.timeline.ruler');
      expect(spy.callsTo('feature.disable')).toEqual([]);
    }
  );
});

describe('VPL-U6 neither navigation bar carries an export entry', () => {
  it.each([
    ['Creator', setupAdvancedNavigationBar],
    ['Adopter', setupNavigationBar]
  ])('%s', (_role, setup) => {
    const spy = run<CreativeEditorSDK>(setup);
    const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
      { in: string },
      unknown[]
    ];

    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    const ids = order.map((entry) =>
      typeof entry === 'string' ? entry : (entry as { id: string }).id
    );
    EXPORT_COMPONENTS.forEach((id) => expect(ids).not.toContain(id));
    expect(ids.at(-1)).toBe('ly.img.preview.navigationBar');
  });
});

describe('VPL-U7 dock settings per role', () => {
  const spy = run<CreativeEngine>(setupAdvancedSettings);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('the Creator configuration deliberately compacts the dock', () => {
    expect(settings.get('dock/hideLabels')).toBe(true);
    expect(settings.get('dock/iconSize')).toBe('normal');
  });
});
