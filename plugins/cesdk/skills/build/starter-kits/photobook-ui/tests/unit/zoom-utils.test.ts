// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as engineUtils from '../../src/imgly/engine-utils';
import * as contextUtils from '../../src/app/contexts/utils';

const CAMERA = 900;
const SCENE = 1;

interface FakeOptions {
  designUnit?: string;
  dpi?: number;
  zoomLevel?: number;
  selected?: number[];
  cursorY?: number;
  cameraY?: number;
  canvas?: { top: number; height: number };
}

function fakeEngine({
  designUnit = 'Pixel',
  dpi = 300,
  zoomLevel = 1,
  selected = [7],
  cursorY = 500,
  cameraY = 0,
  canvas = { top: 0, height: 1000 }
}: FakeOptions = {}) {
  const setPositionY = vi.fn();
  const engine = {
    element: {
      getBoundingClientRect: () => canvas
    } as unknown as HTMLElement,
    block: {
      findAllSelected: vi.fn(() => selected),
      findByType: vi.fn((type: string) => (type === 'camera' ? [CAMERA] : [])),
      getPositionY: vi.fn(() => cameraY),
      setPositionY,
      getEnum: vi.fn(() => designUnit),
      getFloat: vi.fn(() => dpi)
    },
    editor: {
      getTextCursorPositionInScreenSpaceY: vi.fn(() => cursorY)
    },
    scene: {
      get: vi.fn(() => SCENE),
      getZoomLevel: vi.fn(() => zoomLevel)
    }
  };
  return { engine, setPositionY };
}

beforeEach(() => {
  window.devicePixelRatio = 2;
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: { height: 1000 }
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Both modules ship the same two helpers: `src/imgly` for the plain-JS callers
// and `src/app/contexts` for the typed React ones.
describe.each([
  ['imgly/engine-utils', engineUtils],
  ['app/contexts/utils', contextUtils]
])('PB-U16 %s canvas-unit conversion', (_name, module) => {
  const { pixelToCanvasUnit } = module as typeof engineUtils;

  it('divides by the device pixel ratio and the zoom level', () => {
    const { engine } = fakeEngine({ zoomLevel: 4 });
    expect(pixelToCanvasUnit(engine as never, 80)).toBe(10);
  });

  it('converts millimetres through the scene dpi', () => {
    const { engine } = fakeEngine({ designUnit: 'Millimeter', dpi: 25.4 });
    expect(pixelToCanvasUnit(engine as never, 4)).toBe(2);
  });

  it('converts inches through the scene dpi', () => {
    const { engine } = fakeEngine({ designUnit: 'Inch', dpi: 2 });
    expect(pixelToCanvasUnit(engine as never, 8)).toBe(2);
  });
});

describe.each([
  ['imgly/engine-utils', engineUtils],
  ['app/contexts/utils', contextUtils]
])('PB-U17 %s scrolling to the text cursor', (_name, module) => {
  const { zoomToSelectedText } = module as typeof engineUtils;

  it('moves the camera when the cursor sits below the visible page area', async () => {
    const { engine, setPositionY } = fakeEngine({ cursorY: 2500 });
    await zoomToSelectedText(engine as never, 0, 0);
    expect(setPositionY).toHaveBeenCalledWith(CAMERA, 250);
  });

  it('moves the camera when the cursor sits above the top padding', async () => {
    const { engine, setPositionY } = fakeEngine({ cursorY: 10 });
    await zoomToSelectedText(engine as never, 100, 0);
    expect(setPositionY).toHaveBeenCalledWith(CAMERA, -995);
  });

  it('leaves the camera alone while the cursor stays in view', async () => {
    const { engine, setPositionY } = fakeEngine({ cursorY: 500 });
    await zoomToSelectedText(engine as never);
    expect(setPositionY).not.toHaveBeenCalled();
  });

  it('ignores a cursor position of zero, which means nothing is laid out yet', async () => {
    const { engine, setPositionY } = fakeEngine({ cursorY: 0 });
    await zoomToSelectedText(engine as never);
    expect(setPositionY).not.toHaveBeenCalled();
  });

  it.each([
    ['nothing is selected', []],
    ['several blocks are selected', [7, 8]]
  ])('does nothing when %s', async (_label, selected) => {
    const { engine, setPositionY } = fakeEngine({ selected, cursorY: 2500 });
    await zoomToSelectedText(engine as never);
    expect(setPositionY).not.toHaveBeenCalled();
  });

  it('subtracts the part of the canvas the keyboard covers', async () => {
    const { engine, setPositionY } = fakeEngine({
      cursorY: 1500,
      canvas: { top: 0, height: 1000 }
    });
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: { height: 600 }
    });
    await zoomToSelectedText(engine as never);
    // The visible area shrinks to 1200, so a cursor at 1500 is out of view.
    expect(setPositionY).toHaveBeenCalledWith(CAMERA, 150);
  });
});

describe('PB-U18 placing a new block on the page', () => {
  it('deselects everything, appends the block and selects it', () => {
    const engine = {
      block: {
        findAllSelected: vi.fn(() => [5, 6]),
        setSelected: vi.fn(),
        appendChild: vi.fn(),
        getWidth: vi.fn(() => 100),
        setPositionXMode: vi.fn(),
        setPositionX: vi.fn(),
        setPositionYMode: vi.fn(),
        setPositionY: vi.fn()
      },
      editor: { addUndoStep: vi.fn() }
    };
    vi.spyOn(Math, 'random').mockReturnValue(0);

    engineUtils.autoPlaceBlockOnPage(engine as never, 1, 2);

    expect(engine.block.setSelected.mock.calls).toEqual([
      [5, false],
      [6, false],
      [2, true]
    ]);
    expect(engine.block.appendChild).toHaveBeenCalledWith(1, 2);
    expect(engine.block.setPositionXMode).toHaveBeenCalledWith(2, 'Absolute');
    expect(engine.block.setPositionX).toHaveBeenCalledWith(2, 25);
    expect(engine.block.setPositionY).toHaveBeenCalledWith(2, 25);
    expect(engine.editor.addUndoStep).toHaveBeenCalledTimes(1);
  });

  it('offsets the block by the configured random spread', () => {
    const engine = {
      block: {
        findAllSelected: vi.fn(() => []),
        setSelected: vi.fn(),
        appendChild: vi.fn(),
        getWidth: vi.fn(() => 100),
        setPositionXMode: vi.fn(),
        setPositionX: vi.fn(),
        setPositionYMode: vi.fn(),
        setPositionY: vi.fn()
      },
      editor: { addUndoStep: vi.fn() }
    };
    vi.spyOn(Math, 'random').mockReturnValue(1);

    engineUtils.autoPlaceBlockOnPage(engine as never, 1, 2, {
      basePosX: 0.1,
      basePosY: 0.2,
      randomPosX: 0.5,
      randomPosY: 0.5
    });

    expect(engine.block.setPositionX).toHaveBeenCalledWith(2, 60);
    expect(engine.block.setPositionY).toHaveBeenCalledWith(2, 70);
  });
});

describe('PB-U19 reading an image size', () => {
  function stubImageLoading(behaviour: 'load' | 'error'): void {
    const created = document.createElement('img');
    Object.defineProperty(created, 'naturalWidth', { value: 640 });
    Object.defineProperty(created, 'naturalHeight', { value: 480 });
    Object.defineProperty(created, 'src', {
      set() {
        queueMicrotask(() =>
          behaviour === 'load'
            ? created.onload?.(new Event('load'))
            : created.onerror?.(new Event('error'))
        );
      }
    });
    vi.spyOn(document, 'createElement').mockReturnValue(created);
  }

  it('resolves with the natural size once the image has loaded', async () => {
    stubImageLoading('load');
    await expect(engineUtils.getImageSize('photo.png')).resolves.toEqual({
      width: 640,
      height: 480
    });
  });

  it('rejects when the image cannot be loaded', async () => {
    stubImageLoading('error');
    await expect(engineUtils.getImageSize('missing.png')).rejects.toBeDefined();
  });
});
