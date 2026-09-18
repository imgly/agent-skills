import type CreativeEngine from '@cesdk/engine';

export const SCENE = 1;
export const PAGE = 10;
export const CAMERA = 11;
export const ADJUSTMENT_EFFECT = 20;
export const LUT_EFFECT = 21;

const ADJUSTMENT_TYPE = '//ly.img.ubq/effect/adjustments';
const LUT_FILTER_TYPE = '//ly.img.ubq/effect/lut_filter';

const PROPERTY_TYPES: Record<string, string> = {
  'crop/scaleRatio': 'Float',
  'crop/rotation': 'Float',
  'effect/lut_filter/intensity': 'Float',
  'effect/lut_filter/lutFileURI': 'String',
  type: 'String'
};

export interface FakeEngine {
  api: CreativeEngine;
  /** Every `set*` the kit made, as `<method>:<block>:<property>` keys. */
  properties: Map<string, unknown>;
  calls: { method: string; args: unknown[] }[];
  effects: number[];
  /** Wake every `engine.event.subscribe` listener registered for `block`. */
  emitBlockEvent(block: number, type?: string): void;
  emitStateChanged(): void;
  setEditModeSilently(mode: string): void;
  element: HTMLElement;
  exportResult: Blob;
}

/**
 * A concrete stand-in for `CreativeEngine`, not a recording proxy: the kit's
 * React tree does arithmetic on what the getters return.
 */
export function createFakeEngine(
  overrides: {
    effects?: number[];
    canUndo?: boolean;
    pages?: number[];
    cursorY?: number;
  } = {}
): FakeEngine {
  const properties = new Map<string, unknown>();
  const calls: { method: string; args: unknown[] }[] = [];
  const blockListeners = new Map<number, ((events: unknown[]) => void)[]>();
  const stateListeners: (() => void)[] = [];
  const element = document.createElement('div');
  element.getBoundingClientRect = () =>
    ({ top: 0, height: 400, width: 400 }) as DOMRect;
  const exportResult = new Blob(['photo'], { type: 'image/jpeg' });

  let editMode = 'Transform';
  const effects = overrides.effects ?? [ADJUSTMENT_EFFECT, LUT_EFFECT];

  const record =
    <T>(method: string, result?: (...args: never[]) => T) =>
    (...args: unknown[]) => {
      calls.push({ method, args });
      return result?.(...(args as never[]));
    };

  const setValue =
    (method: string) =>
    (...args: unknown[]) => {
      calls.push({ method, args });
      properties.set(`${method}:${args[0]}:${args[1]}`, args[2]);
    };

  const DEFAULTS: Record<string, number> = { 'crop/scaleRatio': 1 };
  const numberOf = (block: number, property: string) =>
    (properties.get(`setFloat:${block}:${property}`) as number | undefined) ??
    DEFAULTS[property] ??
    // A non-zero adjustment, so the bar's Reset button is enabled.
    (property.startsWith('adjustments/') ? 0.5 : 0);

  const engine = {
    element,
    dispose: () => calls.push({ method: 'dispose', args: [] }),
    editor: {
      getEditMode: () => editMode,
      setEditMode: (mode: string) => {
        calls.push({ method: 'setEditMode', args: [mode] });
        editMode = mode;
        stateListeners.forEach((listener) => listener());
      },
      onStateChanged: (listener: () => void) => {
        stateListeners.push(listener);
        return () => {
          stateListeners.splice(stateListeners.indexOf(listener), 1);
        };
      },
      setSetting: record('setSetting'),
      setGlobalScope: record('setGlobalScope'),
      addUndoStep: record('addUndoStep'),
      canUndo: () => overrides.canUndo ?? false,
      defaultURIResolver: (uri: string) => `resolved://${uri}`,
      getCursorType: () => 'Move',
      getTextCursorPositionInScreenSpaceX: () => overrides.cursorY ?? 0,
      getTextCursorPositionInScreenSpaceY: () => overrides.cursorY ?? 0
    },
    event: {
      subscribe: (blocks: number[], listener: (events: unknown[]) => void) => {
        blocks.forEach((block) => {
          blockListeners.set(block, [
            ...(blockListeners.get(block) ?? []),
            listener
          ]);
        });
        return () => {
          blocks.forEach((block) => {
            blockListeners.set(
              block,
              (blockListeners.get(block) ?? []).filter(
                (entry) => entry !== listener
              )
            );
          });
        };
      }
    },
    scene: {
      get: () => SCENE,
      getPages: () => overrides.pages ?? [PAGE],
      getZoomLevel: () => 1,
      zoomToBlock: record('zoomToBlock')
    },
    block: {
      isValid: () => true,
      findAllSelected: () => [PAGE],
      findByType: (type: string) =>
        type === 'camera' ? [CAMERA] : (overrides.pages ?? [PAGE]),
      getEffects: () => effects,
      createEffect: record('createEffect', () => ADJUSTMENT_EFFECT),
      appendEffect: record('appendEffect'),
      destroy: record('destroy'),
      getPropertyType: (property: string) =>
        PROPERTY_TYPES[property] ?? 'Float',
      getString: (block: number, property: string) => {
        if (property === 'type') {
          return block === LUT_EFFECT ? LUT_FILTER_TYPE : ADJUSTMENT_TYPE;
        }
        return (properties.get(`setString:${block}:${property}`) ??
          'resolved://ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png') as string;
      },
      setString: setValue('setString'),
      getFloat: numberOf,
      setFloat: setValue('setFloat'),
      setInt: setValue('setInt'),
      getBool: () => false,
      setBool: setValue('setBool'),
      getEnum: () => 'Pixel',
      getColorRGBA: () => ({ r: 0, g: 0, b: 0, a: 1 }),
      setColorRGBA: setValue('setColorRGBA'),
      setSelected: record('setSelected'),
      setVisible: record('setVisible'),
      getWidth: () => 1000,
      getHeight: () => 800,
      setWidth: record('setWidth'),
      setHeight: record('setHeight'),
      setRotation: record('setRotation'),
      getPositionY: () => 0,
      setPositionY: record('setPositionY'),
      resetCrop: record('resetCrop'),
      flipCropHorizontal: record('flipCropHorizontal'),
      setCropScaleRatio: record('setCropScaleRatio'),
      getCropScaleRatio: record('getCropScaleRatio', () => 1.5),
      adjustCropToFillFrame: record('adjustCropToFillFrame'),
      export: async (...args: unknown[]) => {
        calls.push({ method: 'export', args });
        return exportResult;
      }
    }
  };

  return {
    api: engine as unknown as CreativeEngine,
    properties,
    calls,
    effects,
    element,
    exportResult,
    emitBlockEvent: (block, type = 'Updated') => {
      (blockListeners.get(block) ?? []).forEach((listener) =>
        listener([{ type, block }])
      );
    },
    emitStateChanged: () => stateListeners.forEach((listener) => listener()),
    setEditModeSilently: (mode) => {
      editMode = mode;
    }
  };
}

/** Calls to `path`, in order, as their argument lists. */
export function argsOf(engine: FakeEngine, method: string): unknown[][] {
  return engine.calls
    .filter((call) => call.method === method)
    .map((call) => call.args);
}
