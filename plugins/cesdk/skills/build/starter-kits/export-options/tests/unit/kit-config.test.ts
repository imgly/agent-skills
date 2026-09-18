import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';
import { setupExportDesignPanel } from '../../src/imgly/plugins/export-design-panel';

const EXPORT_PANEL_ID = '//ly.img.panel/export';
const EXPORT_BUTTON_ID = 'ly.img.export-options-design.navigationBar';

describe('setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('enables features exactly once', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
  });

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

  it('leaves the video and placeholder features off, as this is a design kit', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
    expect(enabled.filter((id) => id.startsWith('ly.img.placeholder'))).toEqual(
      []
    );
  });
});

describe('setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it.each(['saveScene', 'exportDesign', 'importScene', 'exportScene'])(
    'registers %s',
    (action) => {
      expect(registered).toContain(action);
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
    ['doubleClickToCropEnabled', true],
    ['doubleClickSelectionMode', 'Hierarchical'],
    ['page/dimOutOfPageAreas', true],
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['page/title/show', true],
    ['page/title/separator', '-'],
    ['colorPicker/colorMode', 'Any']
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });
});

describe('setupPanels', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupPanels(spy.api);
  const positions = new Map(
    spy
      .callsTo('ui.setPanelPosition')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('docks the inspector and the asset library on the left', () => {
    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
  });
});

describe('setupNavigationBar', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupNavigationBar(spy.api);
  const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    string[]
  ];

  it('orders the navigation bar', () => {
    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    expect(order).toContain('ly.img.undoRedo.navigationBar');
    expect(order).toContain('ly.img.zoom.navigationBar');
  });

  it('leaves the export button to the export panel plugin', () => {
    expect(order).not.toContain(EXPORT_BUTTON_ID);
  });
});

describe('setupExportDesignPanel', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;

  beforeEach(() => {
    spy = createApiSpy<CreativeEditorSDK>();
    setupExportDesignPanel(spy.api);
  });

  it('registers the export panel on the right', () => {
    expect(spy.lastArgsOf('ui.registerPanel')?.[0]).toBe(EXPORT_PANEL_ID);
    expect(spy.lastArgsOf('ui.setPanelPosition')).toEqual([
      EXPORT_PANEL_ID,
      'right'
    ]);
  });

  it('adds the export button at the end of the navigation bar', () => {
    expect(spy.lastArgsOf('ui.registerComponent')?.[0]).toBe(EXPORT_BUTTON_ID);
    expect(spy.lastArgsOf('ui.insertOrderComponent')).toEqual([
      { in: 'ly.img.navigation.bar', position: 'end' },
      { id: EXPORT_BUTTON_ID }
    ]);
  });

  it('translates the panel title, the formats and their descriptions', () => {
    const translations = (
      spy.lastArgsOf('i18n.setTranslations')?.[0] as {
        en: Record<string, string>;
      }
    ).en;

    expect(translations[`panel.${EXPORT_PANEL_ID}`]).toBe('Export Design');
    expect(translations['formats/image/jpeg']).toBe('JPEG');
    expect(translations['formats/image/jpeg.description']).toBe(
      'Shareable web format'
    );
    expect(translations['formats/image/png.description']).toBe(
      'Complex Images with Transparency'
    );
    expect(translations['formats/application/pdf.description']).toBe(
      'Best for Printing'
    );
  });
});
