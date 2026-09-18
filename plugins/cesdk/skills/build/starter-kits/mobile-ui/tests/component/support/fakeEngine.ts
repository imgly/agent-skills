import { vi } from 'vitest';
import type CreativeEngine from '@cesdk/engine';
import type { FontStyle, FontWeight } from '@cesdk/engine';

export interface FakeAsset {
  id: string;
  label?: string;
  meta: { thumbUri: string; uri?: string };
  payload?: { typeface: { name: string; fonts: FakeFont[] } };
  context?: { sourceId: string };
}

export interface FakeFont {
  uri: string;
  weight: FontWeight;
  style: FontStyle;
}

export const TYPEFACES = ['Caveat', 'Roboto', 'Oswald'].map((name) => ({
  id: `typeface-${name}`,
  meta: { thumbUri: `${name}.png` },
  payload: {
    typeface: {
      name,
      fonts: [
        {
          uri: `${name}-Italic.ttf`,
          weight: 'normal' as FontWeight,
          style: 'italic' as FontStyle
        },
        {
          uri: `${name}-Regular.ttf`,
          weight: 'normal' as FontWeight,
          style: 'normal' as FontStyle
        }
      ]
    }
  }
}));

export const IMAGES: FakeAsset[] = [
  {
    id: 'image-1',
    label: 'A beach',
    meta: { thumbUri: 'beach.jpg' },
    context: { sourceId: 'ly.img.image' }
  },
  {
    id: 'image-2',
    meta: { thumbUri: 'forest.jpg' },
    context: { sourceId: 'ly.img.image' }
  }
];

export const SHAPES: FakeAsset[] = [
  { id: 'shape-star', label: 'Star', meta: { thumbUri: 'star.svg' } }
];

export const STICKERS: FakeAsset[] = [
  { id: 'sticker-hand', label: 'Hand', meta: { thumbUri: 'hand.svg' } }
];

const ASSETS_BY_SOURCE: Record<string, unknown[]> = {
  'ly.img.typeface': TYPEFACES,
  'ly.img.image': IMAGES,
  'ly.img.vector.shape': SHAPES,
  'ly.img.sticker': STICKERS
};

export type FakeEngine = ReturnType<typeof createFakeEngine>;

/**
 * A concrete stand-in for `CreativeEngine`: every getter answers with a value
 * of the shape the kit's components destructure, every setter records.
 */
export function createFakeEngine(state?: {
  editMode?: string;
  pages?: number[];
  selected?: number[];
  properties?: Record<string, unknown>;
}) {
  const element = document.createElement('div');
  element.getBoundingClientRect = () =>
    ({ top: 0, left: 0, width: 400, height: 600 }) as DOMRect;

  let editMode = state?.editMode ?? 'Transform';
  const pages = state?.pages ?? [10];
  let selected = state?.selected ?? [];
  const properties: Record<string, unknown> = {
    'crop/scaleRatio': 1,
    'crop/rotation': 0,
    'text/horizontalAlignment': 'Center',
    'fill/solid/color': { r: 1, g: 0, b: 0, a: 1 },
    ...state?.properties
  };

  const stateListeners: (() => void)[] = [];
  const eventListeners: ((events: unknown[]) => void)[] = [];

  const engine = {
    element,
    dispose: vi.fn(),
    getBaseURL: vi.fn(() => 'https://assets.test/'),
    editor: {
      setSetting: vi.fn(),
      getEditMode: vi.fn(() => editMode),
      setEditMode: vi.fn((mode: string) => {
        editMode = mode;
        stateListeners.forEach((listener) => listener());
      }),
      canUndo: vi.fn(() => true),
      canRedo: vi.fn(() => true),
      undo: vi.fn(),
      redo: vi.fn(),
      addUndoStep: vi.fn(),
      getTextCursorPositionInScreenSpaceX: vi.fn(() => 0),
      getTextCursorPositionInScreenSpaceY: vi.fn(() => 0),
      onStateChanged: vi.fn((listener: () => void) => {
        stateListeners.push(listener);
        return () => stateListeners.splice(stateListeners.indexOf(listener), 1);
      })
    },
    event: {
      subscribe: vi.fn((_ids: number[], listener: (e: unknown[]) => void) => {
        eventListeners.push(listener);
        return () => eventListeners.splice(eventListeners.indexOf(listener), 1);
      })
    },
    scene: {
      get: vi.fn(() => 1),
      getPages: vi.fn(() => pages),
      getZoomLevel: vi.fn(() => 1),
      zoomToBlock: vi.fn((_block: number, _options?: unknown) => undefined),
      load: vi.fn(async () => 1)
    },
    asset: {
      addLocalAssetSourceFromJSONURI: vi.fn(
        async (_uri: string, _options?: unknown) => undefined
      ),
      addLocalSource: vi.fn(),
      addAssetToSource: vi.fn(),
      apply: vi.fn(),
      applyToBlock: vi.fn(),
      getGroups: vi.fn(async () => ['emoji', 'doodle']),
      findAssets: vi.fn(async (sourceId: string) => ({
        assets: ASSETS_BY_SOURCE[sourceId] ?? [],
        total: (ASSETS_BY_SOURCE[sourceId] ?? []).length,
        currentPage: 0
      }))
    },
    block: {
      findAllSelected: vi.fn(() => selected),
      setSelected: vi.fn(),
      isValid: vi.fn(() => true),
      getKind: vi.fn(() => 'image'),
      destroy: vi.fn(),
      create: vi.fn(() => 42),
      appendChild: vi.fn(),
      setVisible: vi.fn((_block: number, _visible: boolean) => undefined),
      getWidth: vi.fn(() => 100),
      getHeight: vi.fn(() => 100),
      setWidth: vi.fn(),
      setHeightMode: vi.fn(),
      setPositionX: vi.fn(),
      setPositionY: vi.fn(),
      setPositionXMode: vi.fn(),
      setPositionYMode: vi.fn(),
      getPositionY: vi.fn(() => 0),
      findByType: vi.fn(() => [7]),
      setFont: vi.fn(),
      getTypeface: vi.fn(() => TYPEFACES[0].payload.typeface),
      resizeContentAware: vi.fn(),
      export: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
      resetCrop: vi.fn(),
      setCropScaleRatio: vi.fn(),
      getCropScaleRatio: vi.fn(() => 2),
      setCropRotation: vi.fn(),
      adjustCropToFillFrame: vi.fn(),
      supportsFill: vi.fn(() => true),
      getFill: vi.fn(() => 99),
      getPropertyType: vi.fn((name: string) => {
        if (name.endsWith('color')) return 'Color';
        if (name.startsWith('crop/')) return 'Float';
        return 'Enum';
      }),
      getFloat: vi.fn((_id: number, name: string) => properties[name] ?? 0),
      setFloat: vi.fn(),
      getEnum: vi.fn((_id: number, name: string) => properties[name] ?? ''),
      setEnum: vi.fn((_id: number, name: string, value: unknown) => {
        properties[name] = value;
      }),
      getColor: vi.fn((_id: number, name: string) => properties[name]),
      setColor: vi.fn((_id: number, name: string, value: unknown) => {
        properties[name] = value;
      })
    }
  };

  return Object.assign(engine, {
    /** Drive the listeners the kit registered, the way the engine would. */
    emitStateChanged: () => stateListeners.forEach((listener) => listener()),
    emitEvents: (events: unknown[] = [{ type: 'Updated' }]) =>
      eventListeners.forEach((listener) => listener(events)),
    setSelection: (blocks: number[]) => {
      selected = blocks;
    },
    asCreativeEngine: () => engine as unknown as CreativeEngine
  });
}
