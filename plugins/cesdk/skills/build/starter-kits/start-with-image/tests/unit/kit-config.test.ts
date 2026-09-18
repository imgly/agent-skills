import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { IMAGE_CATALOG } from '../../src/app/image-catalog';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupTranslations } from '../../src/imgly/config/i18n';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';
import { DEMO_ASSETS_BASE_URL } from '../../src/imgly/demo-assets';

const PAGE_TYPE = '//ly.img.ubq/page';

/** A predicate the kit registered with `feature.set`. */
function predicateFor(
  spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>,
  feature: string
): (context: { engine: unknown }) => boolean {
  const call = spy
    .callsTo('feature.set')
    .find(({ args }) => args[0] === feature);
  if (call == null) {
    throw new Error(`No feature.set for ${feature}.`);
  }
  return call.args[1] as (context: { engine: unknown }) => boolean;
}

function engineWithSelection(types: string[]): unknown {
  return {
    block: {
      findAllSelected: () => types.map((_, index) => index + 1),
      getType: (id: number) => types[id - 1]
    }
  };
}

describe('IMAGE_CATALOG', () => {
  it('SWI-U1 holds three bundled pictures with a thumbnail and an alt text', () => {
    expect(IMAGE_CATALOG).toHaveLength(3);

    for (const image of IMAGE_CATALOG) {
      expect(image.full).toMatch(/\/assets\/images\/[a-z]+-1200\.jpg$/);
      expect(image.thumbUri).toMatch(/\/assets\/images\/[a-z]+-300\.jpg$/);
      expect(image.alt).not.toBe('');
      expect(image.full.startsWith(`${DEMO_ASSETS_BASE_URL}/`)).toBe(true);
    }
  });

  it('SWI-U1 names the mountain, sea and surf pictures', () => {
    expect(IMAGE_CATALOG.map((image) => image.alt)).toEqual([
      'Mountain landscape',
      'Sea view',
      'Surfer riding a wave'
    ]);
  });
});

describe('setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('SWI-U6 enables features exactly once', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
  });

  it('SWI-U6 enables exactly the documented list', () => {
    expect(enabled).toEqual([
      'ly.img.adjustment',
      'ly.img.blendMode',
      'ly.img.blur',
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
      'ly.img.navigation.undoRedo',
      'ly.img.navigation.zoom',
      'ly.img.notifications.redo',
      'ly.img.notifications.undo',
      'ly.img.opacity',
      'ly.img.page.settings',
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
      'ly.img.text.typeface'
    ]);
  });

  it('SWI-U6 leaves page resizing and the video features off', () => {
    expect(enabled).not.toContain('ly.img.page.resize');
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });

  it.each(['ly.img.canvas.menu', 'ly.img.inspector.bar'])(
    'SWI-U7 turns %s off while a page is selected',
    (feature) => {
      const predicate = predicateFor(spy, feature);

      expect(predicate({ engine: engineWithSelection([PAGE_TYPE]) })).toBe(
        false
      );
      expect(
        predicate({ engine: engineWithSelection(['//ly.img.ubq/graphic']) })
      ).toBe(true);
      expect(
        predicate({
          engine: engineWithSelection(['//ly.img.ubq/text', PAGE_TYPE])
        })
      ).toBe(false);
      expect(predicate({ engine: engineWithSelection([]) })).toBe(true);
    }
  );
});

describe('setupSettings', () => {
  const spy = createApiSpy<CreativeEngine>();
  setupSettings(spy.api);
  const settings = new Map(
    spy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it.each([
    ['doubleClickToCropEnabled', false],
    ['page/allowCropInteraction', true],
    ['page/moveChildrenWhenCroppingFill', true],
    ['page/selectWhenNoBlocksSelected', true],
    ['page/highlightWhenCropping', true],
    ['page/title/show', false]
  ])('SWI-U8 sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });
});

describe('setupTranslations', () => {
  it('SWI-U9 labels the three overlay libraries in English', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupTranslations(spy.api);
    const translations = (
      spy.lastArgsOf('i18n.setTranslations')?.[0] as {
        en: Record<string, string>;
      }
    ).en;

    expect(translations).toEqual({
      'libraries.ly.img.sticker.label': 'Stickers',
      'libraries.ly.img.vector.shape.label': 'Shapes',
      'libraries.ly.img.text.label': 'Text'
    });
  });
});

describe('setupNavigationBar and setupPanels', () => {
  it('SWI-U11 ends the navigation bar with an Export image and Export PDF dropdown', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupNavigationBar(spy.api);
    const order = spy.lastArgsOf('ui.setComponentOrder')?.[1] as unknown[];

    expect(order.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });

  it('SWI-U11 docks the inspector and the asset library on the left', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupPanels(spy.api);
    const positions = new Map(
      spy
        .callsTo('ui.setPanelPosition')
        .map(({ args }) => [args[0] as string, args[1]])
    );
    const floating = new Map(
      spy
        .callsTo('ui.setPanelFloating')
        .map(({ args }) => [args[0] as string, args[1]])
    );

    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(floating.get('//ly.img.panel/inspector')).toBe(false);
    expect(floating.get('//ly.img.panel/assetLibrary')).toBe(false);
  });
});
