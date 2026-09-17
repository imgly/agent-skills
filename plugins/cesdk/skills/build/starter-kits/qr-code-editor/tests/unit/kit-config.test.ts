import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupSettings } from '../../src/imgly/config/settings';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';

type DockEntry = { id: string; key: string; entries?: string[] };

describe('QR-U4a setupDock', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupDock(spy.api);
  const settings = new Map(
    spy
      .callsTo('engine.editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );
  const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    DockEntry[]
  ];

  it('shows large dock icons with their labels', () => {
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });

  it('orders the dock', () => {
    expect(target).toEqual({ in: 'ly.img.dock' });
    expect(order.map((entry) => entry.key)).toEqual([
      'ly.img.templates',
      'ly.img.separator',
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.spacer',
      'ly.img.separator.layers',
      'ly.img.layerList'
    ]);
  });

  it('lists the image sources the kit installs', () => {
    const byKey = new Map(order.map((entry) => [entry.key, entry]));
    expect(byKey.get('ly.img.elements')?.entries).toEqual([
      'ly.img.image',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker'
    ]);
    expect(byKey.get('ly.img.image')?.entries).toEqual([
      'ly.img.image',
      'ly.img.image.upload'
    ]);
  });
});

describe('QR-U4b setupNavigationBar and setupActions', () => {
  const navigationSpy = createApiSpy<CreativeEditorSDK>();
  setupNavigationBar(navigationSpy.api);
  const [target, order] = navigationSpy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    (string | { id: string; children: string[] })[]
  ];

  const actionsSpy = createApiSpy<CreativeEditorSDK>();
  setupActions(actionsSpy.api);
  const registered = actionsSpy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('puts the actions dropdown last', () => {
    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    expect(order.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });

  it('registers the five actions the kit has UI for', () => {
    expect(registered).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });

  it('downloads what exportDesign exported', async () => {
    const exportSpy = createApiSpy<CreativeEditorSDK>();
    setupActions(exportSpy.api);
    const handler = exportSpy
      .callsTo('actions.register')
      .find(({ args }) => args[0] === 'exportDesign')?.args[1] as (
      options: unknown
    ) => unknown;

    await handler({ mimeType: 'image/png' });

    expect(exportSpy.lastArgsOf('utils.export')?.[0]).toEqual({
      mimeType: 'image/png'
    });
    expect(exportSpy.callsTo('utils.downloadFile')).toHaveLength(1);
  });
});

/**
 * Every feature `setupFeatures` enables, in source order. The kit ships an
 * explicit leaf list, so this pins the whole list rather than a sample of it.
 */
const ENABLED_FEATURES = [
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
];

describe('QR-U5 setupFeatures and setupSettings', () => {
  const featureSpy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(featureSpy.api);
  const enabled = featureSpy.lastArgsOf('feature.enable')?.[0] as string[];

  const settingsSpy = createApiSpy<CreativeEngine>();
  setupSettings(settingsSpy.api);
  const settings = new Map(
    settingsSpy
      .callsTo('editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('enables the documented features exactly once and disables nothing', () => {
    expect(featureSpy.callsTo('feature.enable')).toHaveLength(1);
    expect(featureSpy.callsTo('feature.disable')).toHaveLength(0);
    expect(enabled).toEqual(ENABLED_FEATURES);
  });

  it.each([
    'ly.img.page.resize',
    'ly.img.stroke.width',
    'ly.img.shadow.blur',
    'ly.img.duplicate',
    'ly.img.delete',
    'ly.img.navigation.bar'
  ])('enables %s, which the QR flow needs', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('leaves the video, placeholder, ruler and settings groups off', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
    expect(enabled.filter((id) => id.startsWith('ly.img.placeholder'))).toEqual(
      []
    );
    expect(enabled.filter((id) => id.startsWith('ly.img.ruler'))).toEqual([]);
    expect(enabled.filter((id) => id.startsWith('ly.img.settings'))).toEqual(
      []
    );
  });

  it.each([
    ['page/title/show', false],
    ['doubleClickToCropEnabled', true],
    ['page/dimOutOfPageAreas', true],
    ['colorPicker/colorMode', 'Any']
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });
});
