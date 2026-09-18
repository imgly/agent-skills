import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { setupFeatures } from '../../src/imgly/config/features';
import { setupTranslations } from '../../src/imgly/config/i18n';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';

import { DEMO_ASSETS_BASE_URL } from '../../src/imgly/demo-assets';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

interface DockEntry {
  id: string;
  key?: string;
  label?: string;
  icon?: string | (() => string);
  entries?: string[];
}

function run<T>(setup: (api: T) => void) {
  const spy = createApiSpy<T>();
  setup(spy.api);
  return spy;
}

describe('VAN-U5 dock order', () => {
  const spy = run<CreativeEditorSDK>(setupDock);
  const entries = spy.lastArgsOf('ui.setComponentOrder')?.[1] as DockEntry[];

  it('registers the example-template library with two columns', () => {
    expect(spy.lastArgsOf('ui.addAssetLibraryEntry')?.[0]).toEqual({
      id: 'ly.img.video.scene',
      sourceIds: ['ly.img.video.scene'],
      gridColumns: 2
    });
  });

  it('puts the example templates first, then a separator', () => {
    expect(entries[0]).toMatchObject({
      id: 'ly.img.assetLibrary.dock',
      key: 'examples',
      label: 'libraries.ly.img.video.scene.label',
      entries: ['ly.img.video.scene']
    });
    expect((entries[0].icon as () => string)()).toBe(
      `${DEMO_ASSETS_BASE_URL}/assets/static-video-scenes-icon.svg`
    );
    expect(entries[1].id).toBe('ly.img.separator');
  });

  it('combines the element libraries into one entry, then lists uploads and the single types', () => {
    expect(entries[2].entries).toEqual([
      'ly.img.image',
      'ly.img.video',
      'ly.img.audio',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker'
    ]);
    expect(entries.slice(3).map((entry) => entry.key)).toEqual([
      'ly.img.upload',
      'ly.img.image',
      'ly.img.video',
      'ly.img.audio',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker'
    ]);
  });

  it('shows large icons with labels', () => {
    const settings = new Map(
      spy
        .callsTo('engine.editor.setSetting')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });
});

describe('VAN-U6 panels and view', () => {
  const spy = run<CreativeEditorSDK>(setupPanels);
  const positions = new Map(
    spy
      .callsTo('ui.setPanelPosition')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('opens in the default view', () => {
    expect(spy.lastArgsOf('ui.setView')).toEqual(['default']);
  });

  it('puts the inspector on the right, unlike the shared video configuration', () => {
    expect(positions.get('//ly.img.panel/inspector')).toBe('right');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
  });

  it('floats the settings panel on the right', () => {
    expect(positions.get('//ly.img.panel/settings')).toBe('right');
    expect(spy.lastArgsOf('ui.setPanelFloating')).toEqual([
      '//ly.img.panel/settings',
      true
    ]);
  });
});

describe('VAN-U7 features', () => {
  const spy = run<CreativeEditorSDK>(setupFeatures);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it.each([
    'ly.img.animations',
    'ly.img.transitions',
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
    'ly.img.video.caption',
    'ly.img.video.timeline.clips',
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
    expect(spy.callsTo('feature.disable')).toEqual([]);
  });
});

describe('VAN-U8 translations', () => {
  const spy = run<CreativeEditorSDK>(setupTranslations);

  it('renames the audio library and the example-template library', () => {
    expect(spy.lastArgsOf('i18n.setTranslations')?.[0]).toEqual({
      en: {
        'libraries.ly.img.audio.label': 'Soundstripe',
        'libraries.ly.img.video.scene.label': 'Example Templates'
      }
    });
  });
});

describe('setupSettings', () => {
  const spy = run<CreativeEngine>(setupSettings);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('shows every timeline track', () => {
    expect(settings.get('timeline/trackVisibility')).toBe('all');
  });
});

describe('VAN-U9 the navigation bar', () => {
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
});
