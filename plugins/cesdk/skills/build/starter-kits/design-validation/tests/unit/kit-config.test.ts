import { vi } from 'vitest';

// The kit barrel reaches the editor build, which reads `window` at module scope.
vi.hoisted(() => {
  const global = globalThis as unknown as { window?: unknown };
  global.window ??= globalThis;
  (global.window as { location?: unknown }).location ??= new URL(
    'http://localhost/'
  );
});

import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { initDesignValidationEditor } from '../../src/imgly';

type ComponentEntry = string | { id: string; children?: string[] };

describe('DV-U3 the editor config', () => {
  it('orders the navigation bar and puts both exports in the Actions dropdown', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupNavigationBar(spy.api);

    const [target, order] = spy.lastArgsOf('ui.setComponentOrder') as [
      { in: string },
      ComponentEntry[]
    ];
    expect(target).toEqual({ in: 'ly.img.navigation.bar' });
    expect(order.slice(0, 7)).toEqual([
      'ly.img.undoRedo.navigationBar',
      'ly.img.pageResize.navigationBar',
      'ly.img.spacer',
      'ly.img.title.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.preview.navigationBar'
    ]);
    expect(order.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });

  it('registers the five actions the kit overrides', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupActions(spy.api);

    expect(
      spy
        .callsTo('actions.register')
        .map(({ args }) => args[0] as string)
        .sort()
    ).toEqual([
      'exportDesign',
      'exportScene',
      'importScene',
      'saveScene',
      'uploadFile'
    ]);
  });

  it('enables the design features once and no video feature', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupFeatures(spy.api);

    const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
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
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });
});

describe('DV-U3 asset-source registration', () => {
  it('requests every asset source before it waits for any of them', async () => {
    const requested: string[] = [];
    const pending: Array<() => void> = [];
    const addPlugin = (plugin: { name: string }) => {
      requested.push(plugin.name);
      return new Promise<void>((resolve) => pending.push(resolve));
    };
    const recorder = createApiSpy<CreativeEditorSDK>();
    const gated = new Proxy(recorder.api as object, {
      get: (target, key) =>
        key === 'addPlugin' ? addPlugin : Reflect.get(target, key)
    }) as CreativeEditorSDK;
    const settle = () => pending.splice(0).forEach((resolve) => resolve());

    const init = initDesignValidationEditor(gated);

    await vi.waitFor(() => expect(requested).toEqual(['cesdk-design-editor']));

    settle();
    await vi.waitFor(() => expect(requested).toHaveLength(16));
    settle();
    await init;
    expect(requested).toHaveLength(16);
  });
});
