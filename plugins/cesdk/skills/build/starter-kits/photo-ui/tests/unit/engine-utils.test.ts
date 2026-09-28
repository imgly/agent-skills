// @vitest-environment jsdom
import type CreativeEngine from '@cesdk/engine';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  autoPlaceBlockOnPage,
  getImageSize,
  pixelToCanvasUnit,
  zoomToSelectedText
} from '../../src/imgly/engine-utils';

const SCENE = 1;
const CAMERA = 2;
const PAGE = 3;
const BLOCK = 4;

interface EngineStub {
  designUnit: string;
  dpi: number;
  zoomLevel: number;
  selected: number[];
  cursorY: number;
  canvasTop: number;
  canvasHeight: number;
  cameraPositionY: number;
}

function createEngine(overrides: Partial<EngineStub> = {}) {
  const state: EngineStub = {
    designUnit: 'Pixel',
    dpi: 300,
    zoomLevel: 1,
    selected: [BLOCK],
    cursorY: 500,
    canvasTop: 0,
    canvasHeight: 400,
    cameraPositionY: 0,
    ...overrides
  };
  const element = document.createElement('div');
  element.getBoundingClientRect = () =>
    ({ top: state.canvasTop, height: state.canvasHeight }) as DOMRect;

  const engine = {
    element,
    editor: {
      getTextCursorPositionInScreenSpaceY: vi.fn(() => state.cursorY),
      addUndoStep: vi.fn()
    },
    scene: {
      get: vi.fn(() => SCENE),
      getZoomLevel: vi.fn(() => state.zoomLevel)
    },
    block: {
      findAllSelected: vi.fn(() => state.selected),
      findByType: vi.fn(() => [CAMERA]),
      getEnum: vi.fn(() => state.designUnit),
      getFloat: vi.fn(() => state.dpi),
      getPositionY: vi.fn(() => state.cameraPositionY),
      setPositionY: vi.fn(),
      setPositionX: vi.fn(),
      setPositionXMode: vi.fn(),
      setPositionYMode: vi.fn(),
      setSelected: vi.fn(),
      appendChild: vi.fn(),
      getWidth: vi.fn(() => 1000),
      getHeight: vi.fn(() => 500)
    }
  };
  return { engine: engine as unknown as CreativeEngine, state, raw: engine };
}

describe('PH-U4 pixelToCanvasUnit', () => {
  it('divides by the device pixel ratio and the zoom level in pixel scenes', () => {
    const { engine } = createEngine({ designUnit: 'Pixel', zoomLevel: 2 });
    expect(pixelToCanvasUnit(engine, 100)).toBe(50);
  });

  it('folds the scene dpi into millimetre scenes', () => {
    const { engine } = createEngine({ designUnit: 'Millimeter', dpi: 25.4 });
    expect(pixelToCanvasUnit(engine, 100)).toBe(100);
  });

  it('folds the scene dpi into inch scenes', () => {
    const { engine } = createEngine({ designUnit: 'Inch', dpi: 50 });
    expect(pixelToCanvasUnit(engine, 100)).toBe(2);
  });
});

describe('PH-U5 zoomToSelectedText', () => {
  const setViewport = (height: number) => {
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: { height }
    });
  };

  it('does nothing unless exactly one block is selected', async () => {
    const { engine, raw } = createEngine({ selected: [] });
    setViewport(800);
    await zoomToSelectedText(engine);
    expect(raw.block.setPositionY).not.toHaveBeenCalled();
  });

  it('ignores a cursor that has not been laid out yet', async () => {
    const { engine, raw } = createEngine({ cursorY: 0 });
    setViewport(800);
    await zoomToSelectedText(engine);
    expect(raw.block.setPositionY).not.toHaveBeenCalled();
  });

  it('moves the camera when the cursor sits below the visible page area', async () => {
    const { engine, raw } = createEngine({ cursorY: 900 });
    setViewport(800);
    await zoomToSelectedText(engine, 0, 0);
    expect(raw.block.setPositionY).toHaveBeenCalledWith(
      CAMERA,
      expect.any(Number)
    );
  });

  it('moves the camera when the cursor sits above the top padding', async () => {
    const { engine, raw } = createEngine({ cursorY: 10 });
    setViewport(800);
    await zoomToSelectedText(engine, 100, 0);
    expect(raw.block.setPositionY).toHaveBeenCalledTimes(1);
  });

  it('leaves the camera alone while the cursor is inside the visible area', async () => {
    const { engine, raw } = createEngine({ cursorY: 100 });
    setViewport(800);
    await zoomToSelectedText(engine, 0, 0);
    expect(raw.block.setPositionY).not.toHaveBeenCalled();
  });
});

describe('PH-U6 autoPlaceBlockOnPage', () => {
  it('clears the selection, appends the block and places it absolutely', () => {
    const { engine, raw } = createEngine({ selected: [7, 8] });
    autoPlaceBlockOnPage(engine, PAGE, BLOCK);

    expect(raw.block.setSelected).toHaveBeenCalledWith(7, false);
    expect(raw.block.setSelected).toHaveBeenCalledWith(8, false);
    expect(raw.block.appendChild).toHaveBeenCalledWith(PAGE, BLOCK);
    expect(raw.block.setPositionXMode).toHaveBeenCalledWith(BLOCK, 'Absolute');
    expect(raw.block.setPositionYMode).toHaveBeenCalledWith(BLOCK, 'Absolute');
    expect(raw.block.setSelected).toHaveBeenLastCalledWith(BLOCK, true);
    expect(raw.editor.addUndoStep).toHaveBeenCalledTimes(1);
  });

  it('keeps the placement inside the base offset plus the randomised span', () => {
    const { engine, raw } = createEngine({ selected: [] });
    autoPlaceBlockOnPage(engine, PAGE, BLOCK, {
      basePosX: 0.5,
      basePosY: 0.2,
      randomPosX: 0,
      randomPosY: 0
    });
    expect(raw.block.setPositionX).toHaveBeenCalledWith(BLOCK, 500);
    expect(raw.block.setPositionY).toHaveBeenCalledWith(BLOCK, 100);
  });
});

describe('PH-U7 getImageSize', () => {
  let restoreSrc = () => {};
  afterEach(() => restoreSrc());

  /** jsdom never fetches an `img`, so the load result is driven from the setter. */
  const stubImage = (outcome: 'load' | 'error') => {
    const original = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src'
    );
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      set(this: HTMLImageElement) {
        Object.defineProperty(this, 'naturalWidth', { value: 800 });
        Object.defineProperty(this, 'naturalHeight', { value: 600 });
        queueMicrotask(() => {
          if (outcome === 'load') this.onload?.(new Event('load'));
          else this.onerror?.(new Event('error'));
        });
      }
    });
    restoreSrc = () =>
      Object.defineProperty(HTMLImageElement.prototype, 'src', original!);
  };

  it('resolves with the natural size', async () => {
    stubImage('load');
    await expect(getImageSize('photo.jpg')).resolves.toEqual({
      width: 800,
      height: 600
    });
  });

  it('rejects when the image fails to load', async () => {
    stubImage('error');
    await expect(getImageSize('missing.jpg')).rejects.toBeInstanceOf(Event);
  });
});
