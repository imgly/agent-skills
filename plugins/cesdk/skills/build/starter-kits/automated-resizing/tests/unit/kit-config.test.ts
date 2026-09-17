import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions as setupAdvancedActions } from '../../src/imgly/config/advanced-editor/actions';
import { setupFeatures as setupAdvancedFeatures } from '../../src/imgly/config/advanced-editor/features';
import { setupNavigationBar as setupAdvancedNavigationBar } from '../../src/imgly/config/advanced-editor/ui/navigationBar';
import { setupActions as setupDesignActions } from '../../src/imgly/config/design-editor/actions';
import { setupFeatures as setupDesignFeatures } from '../../src/imgly/config/design-editor/features';
import { setupNavigationBar as setupDesignNavigationBar } from '../../src/imgly/config/design-editor/ui/navigationBar';

type ComponentEntry = string | { id: string; children?: string[] };

function enabledFeatures(setup: (cesdk: CreativeEditorSDK) => void): string[] {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  expect(spy.callsTo('feature.enable')).toHaveLength(1);
  expect(spy.callsTo('feature.disable')).toHaveLength(0);
  return spy.lastArgsOf('feature.enable')?.[0] as string[];
}

function navigationBarOrder(
  setup: (cesdk: CreativeEditorSDK) => void
): ComponentEntry[] {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
    { in: string },
    ComponentEntry[]
  ];
  expect(target).toEqual({ in: 'ly.img.navigation.bar' });
  return order;
}

function registeredActions(
  setup: (cesdk: CreativeEditorSDK) => void
): string[] {
  const spy = createApiSpy<CreativeEditorSDK>();
  setup(spy.api);
  return spy.callsTo('actions.register').map(({ args }) => args[0] as string);
}

function actionsDropdown(order: ComponentEntry[]): string[] {
  const entry = order.find(
    (item): item is { id: string; children?: string[] } =>
      typeof item !== 'string' && item.id === 'ly.img.actions.navigationBar'
  );
  expect(entry, 'the navigation bar has an Actions dropdown').toBeDefined();
  return entry!.children ?? [];
}

// AR-U3: the two editor configurations the modal picks between.
describe('advanced editor config', () => {
  const features = enabledFeatures(setupAdvancedFeatures);

  it('enables exactly the professional editing features', () => {
    expect(features).toEqual([
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
      'ly.img.placeholder.appearance.adjustments',
      'ly.img.placeholder.appearance.blur',
      'ly.img.placeholder.appearance.effect',
      'ly.img.placeholder.appearance.filter',
      'ly.img.placeholder.appearance.shadow',
      'ly.img.placeholder.arrange.flip',
      'ly.img.placeholder.arrange.move',
      'ly.img.placeholder.arrange.resize',
      'ly.img.placeholder.arrange.rotate',
      'ly.img.placeholder.fill.actAsPlaceholder',
      'ly.img.placeholder.fill.change',
      'ly.img.placeholder.fill.changeType',
      'ly.img.placeholder.fill.crop',
      'ly.img.placeholder.general.blendMode',
      'ly.img.placeholder.general.delete',
      'ly.img.placeholder.general.duplicate',
      'ly.img.placeholder.general.opacity',
      'ly.img.placeholder.shape.change',
      'ly.img.placeholder.stroke.change',
      'ly.img.placeholder.text.actAsPlaceholder',
      'ly.img.placeholder.text.character',
      'ly.img.placeholder.text.edit',
      'ly.img.position.align',
      'ly.img.position.arrange',
      'ly.img.position.distribute',
      'ly.img.replace.audio',
      'ly.img.replace.fill',
      'ly.img.replace.shape',
      'ly.img.rulers',
      'ly.img.scene.layout.free',
      'ly.img.scene.layout.horizontal',
      'ly.img.scene.layout.spacing',
      'ly.img.scene.layout.vertical',
      'ly.img.shadow.blur',
      'ly.img.shadow.color.library',
      'ly.img.shadow.color.picker.opacity',
      'ly.img.shadow.offset',
      'ly.img.shape.edit',
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
      'ly.img.trim',
      'ly.img.vectorEdit.addMode',
      'ly.img.vectorEdit.bendMode',
      'ly.img.vectorEdit.deleteMode',
      'ly.img.vectorEdit.done',
      'ly.img.vectorEdit.mirrorMode',
      'ly.img.vectorEdit.moveMode'
    ]);
  });

  it('leaves video off, as this is a design kit', () => {
    expect(features.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });

  it('orders the navigation bar around the title', () => {
    const order = navigationBarOrder(setupAdvancedNavigationBar);

    expect(order.slice(0, 2)).toEqual([
      'ly.img.documentSettings.navigationBar',
      'ly.img.undoRedo.navigationBar'
    ]);
    expect(order).toContain('ly.img.title.navigationBar');
    expect(order).toContain('ly.img.zoom.navigationBar');
  });

  it('offers Save, Export Scene and Import Scene in the Actions dropdown', () => {
    expect(
      actionsDropdown(navigationBarOrder(setupAdvancedNavigationBar))
    ).toEqual([
      'ly.img.saveScene.navigationBar',
      'ly.img.exportScene.navigationBar',
      'ly.img.importScene.navigationBar'
    ]);
  });

  it('registers the documented actions', () => {
    expect(registeredActions(setupAdvancedActions)).toEqual([
      'saveScene',
      'exportDesign',
      'exportScene',
      'importScene',
      'uploadFile'
    ]);
  });
});

describe('design editor config', () => {
  const features = enabledFeatures(setupDesignFeatures);

  it('enables exactly the features the resizing editor needs', () => {
    expect(features).toEqual([
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
    ]);
  });

  it.each([
    'ly.img.vectorEdit',
    'ly.img.rulers',
    'ly.img.placeholder',
    'ly.img.shape.edit'
  ])('leaves %s to the advanced editor', (prefix) => {
    const hasPrefix = (id: string) => id.startsWith(prefix);
    expect(features.some(hasPrefix)).toBe(false);
    expect(enabledFeatures(setupAdvancedFeatures).some(hasPrefix)).toBe(true);
  });

  it('offers Save, Export Image and Export Scene in the Actions dropdown', () => {
    expect(
      actionsDropdown(navigationBarOrder(setupDesignNavigationBar))
    ).toEqual([
      'ly.img.saveScene.navigationBar',
      'ly.img.exportImage.navigationBar',
      'ly.img.exportScene.navigationBar'
    ]);
  });

  it('registers the documented actions', () => {
    expect(registeredActions(setupDesignActions)).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });
});
