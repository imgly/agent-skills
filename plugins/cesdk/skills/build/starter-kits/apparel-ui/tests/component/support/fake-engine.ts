import type CreativeEngine from '@cesdk/engine';
import { vi } from 'vitest';

/**
 * A hand-written stand-in for `CreativeEngine`, concrete enough that the kit's
 * own providers and hooks run unchanged: property reads round-trip through a
 * map, and the subscriptions the components register can be fired from a test.
 * A recording proxy cannot do this — the components do arithmetic on what the
 * getters return.
 */

export const SCENE = 1;
export const BACKDROP = 2;
export const PAGE_A = 10;
export const TEXT_BLOCK = 20;
export const IMAGE_BLOCK = 21;
export const SHAPE_BLOCK = 22;
export const STICKER_BLOCK = 23;

const IMAGE_FILL = 210;
const SHAPE_FILL = 220;
const TEXT_FILL = 200;
const PAGE_A_FILL = 100;

const PROPERTY_TYPES: Record<string, string> = {
  'fill/solid/color': 'Color',
  'text/horizontalAlignment': 'Enum',
  'placeholder/enabled': 'Bool',
  'text/text': 'String',
  'text/fontSize': 'Float',
  'scene/dpi': 'Float'
};

export const BLACK = { r: 0, g: 0, b: 0, a: 1 };

interface Block {
  type: string;
  kind: string;
  name: string;
  parent: number | null;
  children: number[];
  fill: number | null;
  visible: boolean;
  scopes: Record<string, boolean>;
}

export interface FakeEngineOptions {
  /** Blocks reported as selected before the first selection event. */
  selection?: number[];
  editMode?: string;
  typeface?: unknown;
  /** Where the text cursor sits, in screen space. */
  cursorY?: number;
}

export interface FakeEngine {
  engine: CreativeEngine;
  /** Replace the selection and notify every `onSelectionChanged` subscriber. */
  select(blocks: number[]): void;
  /** Notify every `onStateChanged` subscriber, which is how edit mode travels. */
  setEditMode(mode: string): void;
  emitHistoryUpdated(): void;
  emitBlockEvent(block: number, type?: string): void;
  /**
   * A spy by dotted path, e.g. `spy('scene.zoomToBlock')`. Reading one off
   * `engine` directly would resolve a deprecated overload and fail lint.
   */
  spy(path: string): ReturnType<typeof vi.fn>;
  properties: Map<string, unknown>;
  assets: Map<string, unknown[]>;
  blocks: Map<number, Block>;
  destroyed: number[];
}

function block(overrides: Partial<Block> = {}): Block {
  return {
    type: '//ly.img.ubq/graphic',
    kind: '',
    name: '',
    parent: null,
    children: [],
    fill: null,
    visible: true,
    scopes: { 'lifecycle/destroy': true },
    ...overrides
  };
}

export function typefaceFixture(name = 'Caveat') {
  return {
    name,
    fonts: [
      { uri: `${name}-Regular.ttf`, weight: 'normal', style: 'normal' },
      { uri: `${name}-Bold.ttf`, weight: 'bold', style: 'normal' }
    ]
  };
}

export function typefaceAsset(name: string) {
  return { id: name, payload: { typeface: typefaceFixture(name) } };
}

export function imageAsset(id: string, sourceId = 'ly.img.image.upload') {
  return {
    id,
    context: { sourceId },
    meta: { uri: `${id}.png`, thumbUri: `${id}-thumb.png` }
  };
}

/**
 * A spy on the fake engine by dotted path. Reading `engine.scene.zoomToBlock`
 * directly resolves a deprecated overload, which the kit's lint rejects.
 */
export function engineSpy(
  engine: CreativeEngine,
  path: string
): ReturnType<typeof vi.fn> {
  const found = path
    .split('.')
    .reduce<
      Record<string, unknown>
    >((node, key) => node[key] as Record<string, unknown>, engine as unknown as Record<string, unknown>);
  return found as unknown as ReturnType<typeof vi.fn>;
}

export function createFakeEngine({
  selection = [],
  editMode = 'Transform',
  typeface = typefaceFixture(),
  cursorY = 0
}: FakeEngineOptions = {}): FakeEngine {
  const blocks = new Map<number, Block>([
    [
      SCENE,
      block({ type: '//ly.img.ubq/scene', children: [BACKDROP, PAGE_A] })
    ],
    [BACKDROP, block({ kind: 'image', parent: SCENE, name: 'Backdrop' })],
    [
      PAGE_A,
      block({
        type: '//ly.img.ubq/page',
        parent: SCENE,
        fill: PAGE_A_FILL,
        children: [TEXT_BLOCK, IMAGE_BLOCK, SHAPE_BLOCK, STICKER_BLOCK]
      })
    ],
    [
      TEXT_BLOCK,
      block({
        type: '//ly.img.ubq/text',
        kind: 'text',
        parent: PAGE_A,
        fill: TEXT_FILL
      })
    ],
    [IMAGE_BLOCK, block({ kind: 'image', parent: PAGE_A, fill: IMAGE_FILL })],
    [SHAPE_BLOCK, block({ kind: 'shape', parent: PAGE_A, fill: SHAPE_FILL })],
    [STICKER_BLOCK, block({ kind: 'sticker', parent: PAGE_A })]
  ]);

  // The kit reads `fill/solid/color` off the block and only subscribes through
  // its fill, so the value is keyed by the block the components ask about.
  const properties = new Map<string, unknown>([
    [`${TEXT_BLOCK}:fill/solid/color`, BLACK],
    [`${SHAPE_BLOCK}:fill/solid/color`, BLACK],
    [`${IMAGE_BLOCK}:fill/solid/color`, BLACK],
    [`${PAGE_A}:fill/solid/color`, BLACK],
    [`${TEXT_BLOCK}:text/horizontalAlignment`, 'Left'],
    [`${IMAGE_BLOCK}:placeholder/enabled`, false],
    [`${SCENE}:scene/designUnit`, 'Pixel'],
    [`${SCENE}:scene/dpi`, 300]
  ]);

  const assets = new Map<string, unknown[]>([
    ['ly.img.typeface', [typefaceAsset('Caveat'), typefaceAsset('Aleo')]],
    ['ly.img.vector.shape', [imageAsset('shape-1', 'ly.img.vector.shape')]],
    ['ly.img.sticker', [imageAsset('sticker-1', 'ly.img.sticker')]],
    ['ly.img.image.upload', [imageAsset('upload-1')]],
    ['unsplash', [imageAsset('unsplash-1', 'unsplash')]]
  ]);

  const destroyed: number[] = [];
  let selected = [...selection];
  let currentEditMode = editMode;
  let nextId = 500;

  const selectionListeners = new Set<() => void>();
  const stateListeners = new Set<() => void>();
  const historyListeners = new Set<() => void>();
  const blockListeners = new Set<{
    blocks: number[];
    handler: (events: { type: string; block: number }[]) => void;
  }>();

  const get = (id: number): Block => {
    const found = blocks.get(id);
    if (found == null) throw new Error(`unknown block ${id}`);
    return found;
  };
  const key = (id: number, property: string) => `${id}:${property}`;
  const readProperty = (id: number, property: string) => {
    const stored = properties.get(key(id, property));
    if (stored === undefined) throw new Error(`no ${property} on ${id}`);
    return stored;
  };
  const writeProperty = (id: number, property: string, value: unknown) => {
    properties.set(key(id, property), value);
  };
  const notifyBlock = (id: number, type = 'Updated') => {
    for (const listener of blockListeners) {
      if (listener.blocks.includes(id)) listener.handler([{ type, block: id }]);
    }
  };

  const engine = {
    element: document.createElement('canvas'),
    getBaseURL: () => 'https://assets.example/',
    dispose: vi.fn(),
    editor: {
      setSetting: vi.fn(),
      setRole: vi.fn(),
      getEditMode: () => currentEditMode,
      setEditMode: vi.fn((mode: string) => {
        currentEditMode = mode;
        stateListeners.forEach((listener) => listener());
      }),
      onStateChanged: (listener: () => void) => {
        stateListeners.add(listener);
        return () => stateListeners.delete(listener);
      },
      onHistoryUpdatedWithKind: (listener: () => void) => {
        historyListeners.add(listener);
        return () => historyListeners.delete(listener);
      },
      canUndo: vi.fn(() => true),
      canRedo: vi.fn(() => false),
      undo: vi.fn(),
      redo: vi.fn(),
      addUndoStep: vi.fn(),
      getActiveHistory: vi.fn(() => 1),
      createHistory: vi.fn(() => 2),
      setActiveHistory: vi.fn(),
      destroyHistory: vi.fn(),
      getGlobalScope: vi.fn(() => 'Allow'),
      setGlobalScope: vi.fn(),
      getTextCursorPositionInScreenSpaceX: vi.fn(() => cursorY),
      getTextCursorPositionInScreenSpaceY: vi.fn(() => cursorY)
    },
    scene: {
      load: vi.fn(async () => SCENE),
      get: () => SCENE,
      getPages: vi.fn(() => [PAGE_A]),
      getCurrentPage: vi.fn(() => PAGE_A),
      getZoomLevel: vi.fn(() => 1),
      zoomToBlock: vi.fn(async () => undefined)
    },
    event: {
      subscribe: (
        subscribedBlocks: number[],
        handler: (events: { type: string; block: number }[]) => void
      ) => {
        const listener = { blocks: subscribedBlocks, handler };
        blockListeners.add(listener);
        return () => blockListeners.delete(listener);
      }
    },
    asset: {
      addSource: vi.fn(),
      addLocalSource: vi.fn(),
      addLocalAssetSourceFromJSONURI: vi.fn(async () => undefined),
      addAssetToSource: vi.fn(),
      findAllSources: vi.fn(() => [...assets.keys()]),
      getSupportedMimeTypes: vi.fn(() => ['image/png']),
      findAssets: vi.fn(async (sourceId: string) => {
        const found = assets.get(sourceId) ?? [];
        return { assets: [...found], total: found.length, currentPage: 0 };
      }),
      apply: vi.fn(async () => nextId),
      applyToBlock: vi.fn(async () => undefined)
    },
    block: {
      create: vi.fn((type: string) => {
        const id = ++nextId;
        blocks.set(id, block({ type: `//ly.img.ubq/${type}` }));
        return id;
      }),
      destroy: vi.fn((id: number) => {
        destroyed.push(id);
        blocks.delete(id);
        // The engine drops a destroyed block from the selection and says so.
        if (selected.includes(id)) {
          selected = selected.filter((block) => block !== id);
          selectionListeners.forEach((listener) => listener());
        }
      }),
      isValid: vi.fn((id: number) => blocks.has(id)),
      isVisible: vi.fn((id: number) => get(id).visible),
      setVisible: vi.fn((id: number, visible: boolean) => {
        get(id).visible = visible;
      }),
      setClipped: vi.fn(),
      getType: vi.fn((id: number) => get(id).type),
      getKind: vi.fn((id: number) => get(id).kind),
      getName: vi.fn((id: number) => get(id).name),
      getParent: vi.fn((id: number) => get(id).parent),
      getChildren: vi.fn((id: number) => [...get(id).children]),
      appendChild: vi.fn((parent: number, child: number) => {
        get(parent).children.push(child);
        get(child).parent = parent;
      }),
      findByType: vi.fn((type: string) =>
        [...blocks.entries()]
          .filter(([, value]) => value.type.endsWith(`/${type}`))
          .map(([id]) => id)
      ),
      findByKind: vi.fn((kind: string) =>
        [...blocks.entries()]
          .filter(([, value]) => value.kind === kind)
          .map(([id]) => id)
      ),
      findAllSelected: vi.fn(() => [...selected]),
      isSelected: vi.fn((id: number) => selected.includes(id)),
      setSelected: vi.fn((id: number, isSelected: boolean) => {
        selected = isSelected
          ? [...new Set([...selected, id])]
          : selected.filter((block) => block !== id);
      }),
      onSelectionChanged: (listener: () => void) => {
        selectionListeners.add(listener);
        return () => selectionListeners.delete(listener);
      },
      supportsFill: vi.fn((id: number) => get(id).fill != null),
      getFill: vi.fn((id: number) => {
        const fill = get(id).fill;
        if (fill == null) throw new Error(`block ${id} has no fill`);
        return fill;
      }),
      getPropertyType: vi.fn(
        (property: string) => PROPERTY_TYPES[property] ?? 'Float'
      ),
      getColor: vi.fn((id: number, property: string) =>
        readProperty(id, property)
      ),
      setColor: vi.fn((id: number, property: string, value: unknown) => {
        writeProperty(id, property, value);
        notifyBlock(id);
      }),
      getEnum: vi.fn((id: number, property: string) =>
        readProperty(id, property)
      ),
      setEnum: vi.fn((id: number, property: string, value: unknown) => {
        writeProperty(id, property, value);
        notifyBlock(id);
      }),
      getBool: vi.fn((id: number, property: string) =>
        readProperty(id, property)
      ),
      setBool: vi.fn((id: number, property: string, value: unknown) =>
        writeProperty(id, property, value)
      ),
      getString: vi.fn((id: number, property: string) =>
        readProperty(id, property)
      ),
      setString: vi.fn((id: number, property: string, value: unknown) =>
        writeProperty(id, property, value)
      ),
      getFloat: vi.fn(
        (id: number, property: string) => properties.get(key(id, property)) ?? 0
      ),
      setFloat: vi.fn((id: number, property: string, value: unknown) =>
        writeProperty(id, property, value)
      ),
      getWidth: vi.fn(() => 800),
      getHeight: vi.fn(() => 800),
      setWidth: vi.fn(),
      getPositionX: vi.fn(() => 0),
      getPositionY: vi.fn(() => 0),
      setPositionX: vi.fn(),
      setPositionY: vi.fn(),
      setPositionXMode: vi.fn(),
      setPositionYMode: vi.fn(),
      setHeightMode: vi.fn(),
      setFont: vi.fn(),
      getTypeface: vi.fn(() => typeface),
      resetCrop: vi.fn(),
      getSourceSet: vi.fn(() => []),
      setSourceSet: vi.fn(),
      isScopeEnabled: vi.fn(
        (id: number, scope: string) => get(id).scopes[scope]
      ),
      setScopeEnabled: vi.fn((id: number, scope: string, enabled: boolean) => {
        get(id).scopes[scope] = enabled;
      }),
      // A block that is gone allows nothing. The kit can still hold a stale
      // selection for the tick between the destroy and the selection event.
      isAllowedByScope: vi.fn(
        (id: number, scope: string) => blocks.get(id)?.scopes[scope] ?? false
      ),
      export: vi.fn(
        async () => new Blob(['page'], { type: 'application/pdf' })
      ),
      getDominantColors: vi.fn(async () => [])
    }
  } as unknown as CreativeEngine;

  return {
    engine,
    properties,
    assets,
    blocks,
    destroyed,
    select(next) {
      selected = [...next];
      selectionListeners.forEach((listener) => listener());
    },
    setEditMode(mode) {
      currentEditMode = mode;
      stateListeners.forEach((listener) => listener());
    },
    emitHistoryUpdated() {
      historyListeners.forEach((listener) => listener());
    },
    emitBlockEvent(id, type = 'Updated') {
      notifyBlock(id, type);
    },
    spy(path) {
      return engineSpy(engine, path);
    }
  };
}
