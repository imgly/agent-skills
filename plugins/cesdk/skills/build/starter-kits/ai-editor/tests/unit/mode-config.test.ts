import { createApiSpy, type ApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions as setupDesignActions } from '../../src/imgly/config/design-editor/actions';
import { setupFeatures as setupDesignFeatures } from '../../src/imgly/config/design-editor/features';
import { setupTranslations as setupDesignTranslations } from '../../src/imgly/config/design-editor/i18n';
import { setupSettings as setupDesignSettings } from '../../src/imgly/config/design-editor/settings';
import { setupUI as setupDesignUI } from '../../src/imgly/config/design-editor/ui';
import { setupFeatures as setupPhotoFeatures } from '../../src/imgly/config/photo-editor/features';
import { setupTranslations as setupPhotoTranslations } from '../../src/imgly/config/photo-editor/i18n';
import { setupSettings as setupPhotoSettings } from '../../src/imgly/config/photo-editor/settings';
import { setupUI as setupPhotoUI } from '../../src/imgly/config/photo-editor/ui';
import { setupFeatures as setupVideoFeatures } from '../../src/imgly/config/video-editor/features';
import { setupTranslations as setupVideoTranslations } from '../../src/imgly/config/video-editor/i18n';
import { setupSettings as setupVideoSettings } from '../../src/imgly/config/video-editor/settings';
import { setupUI as setupVideoUI } from '../../src/imgly/config/video-editor/ui';

type Order = (string | { id: string; key?: string; children?: string[] })[];

function ui(setup: (cesdk: CreativeEditorSDK) => void) {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  return spy;
}

function orderIn(spy: ApiSpy<CreativeEditorSDK>, target: string): Order {
  const call = spy
    .callsTo('ui.setComponentOrder')
    .find(({ args }) => (args[0] as { in: string }).in === target);
  if (call == null) {
    throw new Error(`No component order was set for ${target}.`);
  }
  return call.args[1] as Order;
}

function actionsMenu(spy: ApiSpy<CreativeEditorSDK>): string[] {
  const entry = orderIn(spy, 'ly.img.navigation.bar').find(
    (item) =>
      typeof item === 'object' && item.id === 'ly.img.actions.navigationBar'
  ) as { children: string[] };
  return entry.children;
}

function settings(setup: (engine: CreativeEngine) => void) {
  const spy = createApiSpy<CreativeEngine>();
  setup(spy.api);
  return new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );
}

describe('AIE-U12 the navigation bar per mode', () => {
  it.each([
    [
      'Design',
      setupDesignUI,
      ['ly.img.exportImage.navigationBar', 'ly.img.exportPDF.navigationBar']
    ],
    ['Photo', setupPhotoUI, ['ly.img.exportImage.navigationBar']],
    ['Video', setupVideoUI, ['ly.img.exportVideo.navigationBar']]
  ] as const)(
    '%s offers exactly its own export entries',
    (_mode, setup, expected) => {
      expect(actionsMenu(ui(setup))).toEqual(expected);
    }
  );

  it.each([
    ['Design', setupDesignUI],
    ['Photo', setupPhotoUI],
    ['Video', setupVideoUI]
  ] as const)('%s keeps undo/redo and zoom', (_mode, setup) => {
    const order = orderIn(ui(setup), 'ly.img.navigation.bar');
    expect(order).toContain('ly.img.undoRedo.navigationBar');
    expect(order).toContain('ly.img.zoom.navigationBar');
  });
});

describe('AIE-U12 the dock per mode', () => {
  function libraryKeys(spy: ApiSpy<CreativeEditorSDK>): string[] {
    return orderIn(spy, 'ly.img.dock')
      .filter(
        (item): item is { id: string; key: string } =>
          typeof item === 'object' && item.id === 'ly.img.assetLibrary.dock'
      )
      .map((item) => item.key);
  }

  it('Design offers elements, upload, the four static libraries and the layer list', () => {
    expect(libraryKeys(ui(setupDesignUI))).toEqual([
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.layerList'
    ]);
  });

  it('Photo leads with the photo tools and offers no image library', () => {
    const order = orderIn(ui(setupPhotoUI), 'ly.img.dock');
    expect(order.slice(0, 5)).toEqual([
      'ly.img.spacer',
      'ly.img.crop.dock',
      'ly.img.adjustment.dock',
      'ly.img.filter.dock',
      'ly.img.effects.dock'
    ]);
    expect(libraryKeys(ui(setupPhotoUI))).toEqual([
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker'
    ]);
  });

  it('Video adds the video and audio libraries', () => {
    expect(libraryKeys(ui(setupVideoUI))).toEqual([
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.video',
      'ly.img.audio',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker'
    ]);
  });
});

describe('AIE-U12 the panels per mode', () => {
  it.each([
    ['Design', setupDesignUI],
    ['Photo', setupPhotoUI],
    ['Video', setupVideoUI]
  ] as const)(
    '%s docks the inspector and the asset library left',
    (_mode, setup) => {
      const spy = ui(setup);
      const positions = new Map(
        spy
          .callsTo('ui.setPanelPosition')
          .map(({ args }) => [args[0] as string, args[1]])
      );
      expect(positions.get('//ly.img.panel/inspector')).toBe('left');
      expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    }
  );
});

describe('AIE-U12 the features per mode', () => {
  function enabled(setup: (cesdk: CreativeEditorSDK) => void): string[] {
    const spy = createApiSpy<CreativeEditorSDK>();
    setup(spy.api);
    return spy.lastArgsOf('feature.enable')?.[0] as string[];
  }

  function withPrefix(features: string[], prefix: string): string[] {
    return features.filter((feature) => feature.startsWith(prefix));
  }

  it('Design enables the design features and no video timeline controls', () => {
    const features = enabled(setupDesignFeatures);
    expect(features).toContain('ly.img.text.edit');
    expect(features).toContain('ly.img.crop.size');
    expect(withPrefix(features, 'ly.img.video')).toEqual([]);
  });

  it('Photo drops the page and transform tools it has no use for', () => {
    const features = enabled(setupPhotoFeatures);
    expect(features).toContain('ly.img.crop.size');
    expect(withPrefix(features, 'ly.img.transform')).toEqual([]);
    expect(withPrefix(features, 'ly.img.cutout')).toEqual([]);
  });

  it.each([
    ['Design', setupDesignFeatures],
    ['Photo', setupPhotoFeatures],
    ['Video', setupVideoFeatures]
  ])(
    '%s names every feature on its own, enabling no umbrella group',
    (_mode, setup) => {
      const features = enabled(setup);
      const umbrellas = features.filter((feature) =>
        features.some((other) => other.startsWith(`${feature}.`))
      );
      expect(umbrellas).toEqual([]);
    }
  );

  it('Photo gates the canvas menu and the inspector bar on a non-page selection', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupPhotoFeatures(spy.api);
    const gated = new Map(
      spy.callsTo('feature.set').map(({ args }) => [args[0] as string, args[1]])
    );
    expect([...gated.keys()]).toEqual([
      'ly.img.canvas.menu',
      'ly.img.inspector.bar'
    ]);

    const engine = (type: string) => ({
      engine: {
        block: { findAllSelected: () => [1], getType: () => type }
      }
    });
    for (const feature of gated.keys()) {
      const predicate = gated.get(feature) as (context: {
        engine: unknown;
      }) => boolean;
      expect(predicate(engine('//ly.img.ubq/page'))).toBe(false);
      expect(predicate(engine('//ly.img.ubq/graphic'))).toBe(true);
    }
  });
});

describe('AIE-U12 the engine settings per mode', () => {
  it('Design shows the page title and crops on double click', () => {
    const design = settings(setupDesignSettings);
    expect(design.get('page/title/show')).toBe(true);
    expect(design.get('doubleClickToCropEnabled')).toBe(true);
    expect(design.get('colorPicker/colorMode')).toBe('Any');
  });

  it('Photo hides the page title and keeps the page selected', () => {
    const photo = settings(setupPhotoSettings);
    expect(photo.get('page/title/show')).toBe(false);
    expect(photo.get('doubleClickToCropEnabled')).toBe(false);
    expect(photo.get('page/selectWhenNoBlocksSelected')).toBe(true);
  });

  it('Video shows every track and picks RGB', () => {
    const video = settings(setupVideoSettings);
    expect(video.get('timeline/trackVisibility')).toBe('all');
    expect(video.get('colorPicker/colorMode')).toBe('RGB');
  });
});

describe('AIE-U12 the translations per mode', () => {
  function translations(setup: (cesdk: CreativeEditorSDK) => void) {
    const spy = createApiSpy<CreativeEditorSDK>();
    setup(spy.api);
    return spy.callsTo('i18n.setTranslations');
  }

  it('Photo names its dock buttons, so the builder finds their keys', () => {
    const [call] = translations(setupPhotoTranslations);
    const { en } = call.args[0] as { en: Record<string, string> };
    expect(en['ly.img.crop.dock.label']).toBe('Crop');
    expect(en['ly.img.adjustment.dock.label']).toBe('Adjust');
    expect(en['ly.img.filter.dock.label']).toBe('Filter');
    expect(en['ly.img.effects.dock.label']).toBe('Effects');
  });

  it.each([
    ['Design', setupDesignTranslations],
    ['Video', setupVideoTranslations]
  ] as const)('%s sets none, keeping the editor defaults', (_mode, setup) => {
    expect(translations(setup)).toEqual([]);
  });
});

describe('AIE-U12 the design actions', () => {
  it('registers the actions its navigation bar and menus reach', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupDesignActions(spy.api);
    const registered = spy
      .callsTo('actions.register')
      .map(({ args }) => args[0] as string);

    expect(registered).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });
});
