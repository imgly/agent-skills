import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

// The kit imports CreativeEditorSDK as a value for `CreativeEditorSDK.version`,
// and the browser bundle touches `window` at import time.
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { setupActions } from '../../src/imgly/config/actions';
import { setupDock } from '../../src/imgly/config/ui/dock';
import { setupFeatures } from '../../src/imgly/config/features';
import { visuallySortBlocks } from '../../src/imgly/plugins/layouts/applyLayout';
import { LayoutsAssetSourcePlugin } from '../../src/imgly/plugins/layouts/layout';

interface DockEntry {
  id: string;
  key: string;
}

const DOCK_KEYS = [
  'ly.img.elements',
  'ly.img.upload',
  'ly.img.image',
  'ly.img.text',
  'ly.img.vector.shape',
  'ly.img.sticker',
  'ly.img.spacer',
  'ly.img.separator.layers',
  'ly.img.layerList'
];

function dockOrder(): DockEntry[] {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupDock(spy.api);
  return (spy.lastArgsOf('ui.setComponentOrder') as [unknown, DockEntry[]])[1];
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

describe('LAY-U3 setupDock', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupDock(spy.api);
  const settings = new Map(
    spy
      .callsTo('engine.editor.setSetting')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('shows labels and large icons', () => {
    expect(settings.get('dock/hideLabels')).toBe(false);
    expect(settings.get('dock/iconSize')).toBe('large');
  });

  it('orders the dock and declares no template library', () => {
    expect(dockOrder().map((entry) => entry.key)).toEqual(DOCK_KEYS);
  });
});

describe('LAY-U3 setupFeatures', () => {
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

  it.each(['ly.img.dock', 'ly.img.library.panel', 'ly.img.page.resize'])(
    'enables %s',
    (feature) => {
      expect(enabled).toContain(feature);
    }
  );
});

/** Records the plugin's calls and answers `getComponentOrder` with the kit's own dock. */
function fakeEditor() {
  const calls: { path: string; args: unknown[] }[] = [];
  const record =
    (path: string) =>
    (...args: unknown[]) => {
      calls.push({ path, args });
    };
  let currentDock = dockOrder();
  return {
    calls,
    dock: () => currentDock,
    cesdk: {
      i18n: { setTranslations: record('i18n.setTranslations') },
      engine: {
        asset: {
          addLocalAssetSourceFromJSONString: record(
            'asset.addLocalAssetSourceFromJSONString'
          ),
          registerApplyMiddleware: record('asset.registerApplyMiddleware')
        }
      } as unknown as CreativeEngine,
      ui: {
        addAssetLibraryEntry: record('ui.addAssetLibraryEntry'),
        getComponentOrder: () => currentDock,
        setComponentOrder: (_target: unknown, next: DockEntry[]) => {
          currentDock = next;
        }
      }
    } as unknown as CreativeEditorSDK
  };
}

async function initialisePlugin(options?: { baseURL?: string }) {
  const editor = fakeEditor();
  const plugin = new LayoutsAssetSourcePlugin(options);
  await plugin.initialize({ cesdk: editor.cesdk } as never);
  return { ...editor, plugin };
}

describe('LAY-U3 LayoutsAssetSourcePlugin', () => {
  it('registers the catalogue against the base URL it was given', async () => {
    const editor = await initialisePlugin({ baseURL: 'https://layouts.test' });

    const [contentJSON, basePath] =
      editor.calls.find(
        ({ path }) => path === 'asset.addLocalAssetSourceFromJSONString'
      )?.args ?? [];
    expect(JSON.parse(contentJSON as string).id).toBe('ly.img.layouts');
    expect(basePath).toBe('https://layouts.test');
  });

  it('puts Layouts first, followed by a separator', async () => {
    const editor = await initialisePlugin();

    const order = editor.dock();
    expect(order[0]).toMatchObject({
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.layouts',
      label: 'libraries.ly.img.layouts.label'
    });
    expect(order[1]).toBe('ly.img.separator');
  });

  it('leaves the dock without a templates entry', async () => {
    const editor = await initialisePlugin();

    // The kit declares no template library, and the plugin adds none, so the
    // dock leads with Layouts and never offers Templates.
    expect(
      editor.dock().some((entry) => entry.key === 'ly.img.templates')
    ).toBe(false);
  });

  it('renders the dock icon at both sizes', async () => {
    const editor = await initialisePlugin();

    const { icon } = editor.dock()[0] as unknown as {
      icon: (options: { iconSize: string }) => string;
    };
    expect(icon({ iconSize: 'normal' })).toContain('collage-small.svg');
    expect(icon({ iconSize: 'large' })).toContain('collage-large.svg');
  });

  it('releases the asset middleware when it is disposed', async () => {
    const editor = await initialisePlugin();

    expect(() => editor.plugin.dispose()).not.toThrow();
  });

  it('registers the library entry for the layouts source', async () => {
    const editor = await initialisePlugin();

    expect(
      editor.calls.find(({ path }) => path === 'ui.addAssetLibraryEntry')
        ?.args[0]
    ).toMatchObject({
      id: 'ly.img.layouts',
      sourceIds: ['ly.img.layouts'],
      gridColumns: 2
    });
  });
});

/** A stand-in engine that only answers the two position getters the sort reads. */
function positionEngine(
  positions: Record<number, [number, number]>
): CreativeEngine {
  return {
    block: {
      getPositionX: (block: number) => positions[block][0],
      getPositionY: (block: number) => positions[block][1]
    }
  } as unknown as CreativeEngine;
}

describe('LAY-U2 visuallySortBlocks', () => {
  it('sorts top to bottom, then left to right', () => {
    const engine = positionEngine({
      1: [100, 200],
      2: [0, 200],
      3: [50, 10]
    });

    expect(visuallySortBlocks(engine, [1, 2, 3])).toEqual([3, 2, 1]);
  });

  it('treats sub-pixel differences in Y as the same row', () => {
    const engine = positionEngine({
      1: [90, 10.4],
      2: [10, 10.2]
    });

    expect(visuallySortBlocks(engine, [1, 2])).toEqual([2, 1]);
  });
});

describe('LAY-U4 setupActions', () => {
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
