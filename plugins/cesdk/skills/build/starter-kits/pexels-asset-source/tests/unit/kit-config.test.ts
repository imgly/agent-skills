import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupActions } from '../../src/imgly/config/actions';
import { setupFeatures } from '../../src/imgly/config/features';
import { initPexelsImageEditor } from '../../src/imgly';
import { PexelsAssetSourcePlugin } from '../../src/imgly/plugins/pexels';

interface DockEntry {
  id: string;
  key: string;
  label?: string;
  entries?: string[];
}

/**
 * Every feature `src/imgly/config/features.ts` enables, in the order the kit
 * lists them. A kit names each feature explicitly, so the whole list is pinned
 * here rather than a sample of it.
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
];

describe('PEX-U7 setupDock', () => {
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

  it('shows labels and large icons', () => {
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
});

describe('PEX-U7 setupFeatures', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupFeatures(spy.api);
  const enabled = spy.lastArgsOf('feature.enable')?.[0] as string[];

  it('enables features exactly once', () => {
    expect(spy.callsTo('feature.enable')).toHaveLength(1);
    expect(spy.callsTo('feature.disable')).toHaveLength(0);
  });

  it('enables exactly the features the kit lists', () => {
    expect(enabled).toEqual(ENABLED_FEATURES);
  });

  it.each([
    'ly.img.replace.fill',
    'ly.img.fill.image',
    'ly.img.dock',
    'ly.img.library.panel',
    'ly.img.page.resize'
  ])('enables %s', (feature) => {
    expect(enabled).toContain(feature);
  });

  it('leaves the video features off, as this is a design kit', () => {
    expect(enabled.filter((id) => id.startsWith('ly.img.video'))).toEqual([]);
  });
});

describe('PEX-U7 initPexelsImageEditor', () => {
  it('passes the proxy URL through to the plugin', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    await initPexelsImageEditor(spy.api, {
      pexelsApiKey: 'test-pexels-key'
    });

    const plugin = spy
      .callsTo('addPlugin')
      .map(({ args }) => args[0])
      .find(
        (candidate): candidate is PexelsAssetSourcePlugin =>
          candidate instanceof PexelsAssetSourcePlugin
      );
    expect(plugin).toBeDefined();
    expect(pluginOptions(plugin!).apiKey).toBe('test-pexels-key');
  });

  it('adds the asset sources in one concurrent batch, between the config plugin and Pexels', async () => {
    const editor = pausingEditor();

    const done = initPexelsImageEditor(editor.cesdk);

    await editor.settle();
    expect(editor.added).toEqual(['cesdk-design-editor']);

    await editor.releaseAll();
    expect(editor.added.slice(1)).toEqual([
      'cesdk-blur-asset-source',
      'cesdk-image-colors-asset-source',
      'cesdk-color-palette-asset-source',
      'cesdk-crop-presets-asset-source',
      'cesdk-upload-asset-sources',
      'cesdk-demo-asset-sources',
      'cesdk-effects-asset-source',
      'cesdk-filters-asset-source',
      'cesdk-page-presets-asset-source',
      'cesdk-sticker-asset-source',
      'cesdk-text-asset-source',
      'cesdk-text-component-asset-source',
      'cesdk-typeface-asset-source',
      'cesdk-vectorshape-asset-source',
      'cesdk-premium-asset-sources'
    ]);

    await editor.releaseAll();
    expect(editor.added.at(-1)).toBe('cesdk-pexels-asset-source');

    await editor.releaseAll();
    await done;
  });
});

function pluginOptions(plugin: PexelsAssetSourcePlugin): {
  apiKey?: string;
} {
  return (plugin as unknown as { options: { apiKey?: string } }).options;
}

/** Records the plugin's calls and answers `getComponentOrder` with the kit's own dock. */
function fakeEditor(dock: DockEntry[]) {
  const calls: { path: string; args: unknown[] }[] = [];
  const record =
    (path: string) =>
    (...args: unknown[]) => {
      calls.push({ path, args });
    };
  let currentDock = dock;
  return {
    calls,
    dock: () => currentDock,
    cesdk: {
      i18n: { setTranslations: record('i18n.setTranslations') },
      engine: { asset: { addSource: record('asset.addSource') } },
      ui: {
        addAssetLibraryEntry: record('ui.addAssetLibraryEntry'),
        getComponentOrder: () => currentDock,
        setComponentOrder: (_target: unknown, next: DockEntry[]) => {
          currentDock = next;
        },
        setReplaceAssetLibraryEntries: record(
          'ui.setReplaceAssetLibraryEntries'
        )
      }
    } as unknown as CreativeEditorSDK
  };
}

describe('PEX-U7 PexelsAssetSourcePlugin', () => {
  async function initialise(options?: { apiKey?: string }) {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupDock(spy.api);
    const dock = (
      spy.lastArgsOf('ui.setComponentOrder') as [unknown, DockEntry[]]
    )[1];
    const editor = fakeEditor(dock);
    await new PexelsAssetSourcePlugin(options).initialize({
      cesdk: editor.cesdk
    } as never);
    return editor;
  }

  it('replaces the Images dock entry with Pexels', async () => {
    const editor = await initialise({
      apiKey: 'test-pexels-key'
    });

    const entry = editor.dock().find((item) => item.key === 'pexels');
    expect(entry).toEqual({
      id: 'ly.img.assetLibrary.dock',
      key: 'pexels',
      label: 'libraries.pexels.label',
      entries: ['pexels']
    });
    expect(editor.dock().some((item) => item.key === 'ly.img.image')).toBe(
      false
    );
  });

  it('registers the source and its library entry', async () => {
    const editor = await initialise({
      apiKey: 'test-pexels-key'
    });

    const source = editor.calls.find(({ path }) => path === 'asset.addSource')
      ?.args[0] as { id: string };
    expect(source.id).toBe('pexels');
    expect(
      editor.calls.find(({ path }) => path === 'ui.addAssetLibraryEntry')
        ?.args[0]
    ).toMatchObject({
      id: 'pexels',
      sourceIds: ['pexels'],
      gridColumns: 2
    });
  });

  it('offers Pexels for an image fill and the defaults otherwise', async () => {
    const editor = await initialise({
      apiKey: 'test-pexels-key'
    });

    const pick = editor.calls.find(
      ({ path }) => path === 'ui.setReplaceAssetLibraryEntries'
    )?.args[0] as (context: {
      selectedBlocks: { fillType: string }[];
      defaultEntryIds: string[];
      replaceIntent: string;
    }) => string[];

    expect(
      pick({
        selectedBlocks: [{ fillType: '//ly.img.ubq/fill/image' }],
        defaultEntryIds: ['ly.img.image'],
        replaceIntent: 'fill'
      })
    ).toEqual(['pexels']);
    expect(
      pick({
        selectedBlocks: [{ fillType: '//ly.img.ubq/fill/color' }],
        defaultEntryIds: ['ly.img.image'],
        replaceIntent: 'fill'
      })
    ).toEqual(['ly.img.image']);
  });

  it('falls back to an empty API key when none is given', async () => {
    const editor = await initialise();

    const source = editor.calls.find(({ path }) => path === 'asset.addSource')
      ?.args[0] as { findAssets: (query: unknown) => Promise<unknown> };
    const alert = vi.fn();
    vi.stubGlobal('alert', alert);
    vi.stubGlobal('fetch', vi.fn());

    await source.findAssets({ page: 0, perPage: 20 });

    expect(alert).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe('PEX-U8 setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('registers the actions the kit UI reaches', () => {
    expect(registered).toEqual(
      expect.arrayContaining([
        'saveScene',
        'exportDesign',
        'importScene',
        'exportScene',
        'uploadFile'
      ])
    );
  });
});

/**
 * A spy whose `addPlugin` stays pending until the test releases it, so a
 * sequential `await` per plugin and a single `Promise.all` are told apart.
 */
function pausingEditor() {
  const spy = createApiSpy<CreativeEditorSDK>();
  const added: string[] = [];
  let pending: (() => void)[] = [];
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
  const addPlugin = (plugin: { name: string }) => {
    added.push(plugin.name);
    return new Promise<void>((resolve) => pending.push(resolve));
  };
  return {
    added,
    settle,
    async releaseAll() {
      const releasing = pending;
      pending = [];
      releasing.forEach((resolve) => resolve());
      await settle();
    },
    cesdk: new Proxy(spy.api as object, {
      get: (target, key) =>
        key === 'addPlugin' ? addPlugin : Reflect.get(target, key)
    }) as CreativeEditorSDK
  };
}
