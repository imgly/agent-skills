import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import { beforeAll, describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';
import { setupCanvas } from '../../src/imgly/config/ui/canvas';
import { setupComponents } from '../../src/imgly/config/ui/components';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupFeatures } from '../../src/imgly/config/features';
import { setupNavigationBar } from '../../src/imgly/config/ui/navigationBar';
import { setupPanels } from '../../src/imgly/config/ui/panel';
import { setupSettings } from '../../src/imgly/config/settings';
import { init3dProductPreviewEditor } from '../../src/imgly';

type NavigationEntry = string | { id: string; children: string[] };
type DockEntry = { key: string; entries: string[] };

interface InstalledPlugin {
  name: string;
  config?: { include?: string[] };
}

describe('P3D-U6 setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('enables features exactly once and disables none', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
  });

  it('enables exactly the documented list', () => {
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

  it('leaves the video features off, as this is a design kit', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });
});

describe('P3D-U6 setupActions', () => {
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

describe('P3D-U6 setupSettings', () => {
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
    ['page/moveChildrenWhenCroppingFill', false],
    ['page/selectWhenNoBlocksSelected', false],
    ['colorPicker/colorMode', 'Any']
  ])('sets %s to %s', (key, value) => {
    expect(settings.get(key as string)).toBe(value);
  });
});

describe('P3D-U6 setupNavigationBar', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupNavigationBar(spy.api);
  const order = spy.lastArgsOf(
    'ui.setComponentOrder'
  )?.[1] as NavigationEntry[];

  it('offers the actions dropdown with both export entries', () => {
    const actions = order.find(
      (entry) =>
        typeof entry !== 'string' && entry.id === 'ly.img.actions.navigationBar'
    ) as { children: string[] } | undefined;
    expect(actions?.children).toEqual([
      'ly.img.exportImage.navigationBar',
      'ly.img.exportPDF.navigationBar'
    ]);
  });

  it('drops the document settings entry again', () => {
    expect(order).toContain('ly.img.documentSettings.navigationBar');
    expect(spy.lastArgsOf('ui.removeOrderComponent')?.[0]).toEqual({
      in: 'ly.img.navigation.bar',
      match: 'ly.img.documentSettings.navigationBar'
    });
  });
});

describe('P3D-U6 setupCanvas', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupCanvas(spy.api);
  const canvasBar = spy
    .callsTo('ui.setComponentOrder')
    .find(({ args }) => (args[0] as { in: string }).in === 'ly.img.canvas.bar');

  it('offers document settings and page add at the bottom', () => {
    expect(canvasBar?.args[1]).toEqual([
      'ly.img.settings.canvasBar',
      'ly.img.spacer',
      'ly.img.page.add.canvasBar',
      'ly.img.spacer'
    ]);
  });
});

describe('P3D-U6 setupComponents', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupComponents(spy.api);

  it('registers nothing; the 3D preview is plain React', () => {
    expect(spy.calls).toEqual([]);
  });
});

describe('P3D-U6 setupDock', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupDock(spy.api);
  const order = spy.lastArgsOf('ui.setComponentOrder')?.[1] as DockEntry[];

  it('lists the libraries in order', () => {
    expect(order.map((entry) => entry.key)).toEqual([
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
});

describe('P3D-U6 setupPanels', () => {
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

  it('docks the inspector and the asset library on the left', () => {
    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(floating.get('//ly.img.panel/inspector')).toBe(false);
    expect(floating.get('//ly.img.panel/assetLibrary')).toBe(false);
  });
});

describe('P3D-U6 init3dProductPreviewEditor', () => {
  let spy: ReturnType<typeof createApiSpy<CreativeEditorSDK>>;
  let plugins: InstalledPlugin[];

  beforeAll(async () => {
    spy = createApiSpy<CreativeEditorSDK>();
    await init3dProductPreviewEditor(spy.api);
    plugins = spy
      .callsTo('addPlugin')
      .map(({ args }) => args[0] as unknown as InstalledPlugin);
  });

  it('installs the kit config plugin first', () => {
    expect(plugins[0].name).toBe('cesdk-design-editor');
    expect(plugins).toHaveLength(15);
  });

  it('limits the demo and upload sources to images', () => {
    const include = (name: string) =>
      plugins.find((plugin) => plugin.name === name)?.config?.include;
    expect(include('cesdk-demo-asset-sources')).toEqual(['ly.img.image.*']);
    expect(include('cesdk-upload-asset-sources')).toEqual([
      'ly.img.image.upload'
    ]);
  });

  it('opens in the light theme with the Creator role', () => {
    expect(spy.lastArgsOf('ui.setTheme')).toEqual(['light']);
    expect(spy.lastArgsOf('engine.editor.setRole')).toEqual(['Creator']);
  });
});

describe('P3D-U6 asset source registration is concurrent', () => {
  // A timer callback runs after every queued microtask, so the pending `await`
  // chain inside the kit has run by the time this resolves.
  function flushMicrotasks(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }

  it('issues the asset sources at once instead of one after another', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    const pending: (() => void)[] = [];
    // `addPlugin` resolves only when the test says so, so a sequential
    // registration would stall after the first asset source.
    const api = new Proxy(spy.api as object, {
      get(target, key) {
        if (key === 'addPlugin') {
          return (plugin: unknown) => {
            (target as { addPlugin: (value: unknown) => void }).addPlugin(
              plugin
            );
            return new Promise<void>((resolve) => pending.push(resolve));
          };
        }
        return Reflect.get(target, key);
      }
    }) as CreativeEditorSDK;

    const counts: number[] = [];
    void init3dProductPreviewEditor(api);
    await flushMicrotasks();
    counts.push(spy.callsTo('addPlugin').length);

    while (pending.length > 0) {
      pending.splice(0).forEach((resolve) => {
        resolve();
      });
      await flushMicrotasks();
      counts.push(spy.callsTo('addPlugin').length);
    }

    // The configuration plugin, then the fourteen asset sources together.
    expect(counts).toEqual([1, 15, 15]);
  });
});
