// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type CreativeEngine from '@cesdk/engine';

import {
  pixelToCanvasUnit,
  zoomToSelectedText
} from '../../src/imgly/creative-engine-utils';

interface Fake {
  element: { getBoundingClientRect: () => DOMRect };
  editor: { getTextCursorPositionInScreenSpaceY: ReturnType<typeof vi.fn> };
  scene: { get: () => number; getZoomLevel: () => number };
  block: {
    findAllSelected: ReturnType<typeof vi.fn>;
    findByType: ReturnType<typeof vi.fn>;
    getPositionY: ReturnType<typeof vi.fn>;
    setPositionY: ReturnType<typeof vi.fn>;
    getEnum: ReturnType<typeof vi.fn>;
    getFloat: ReturnType<typeof vi.fn>;
  };
}

const createEngine = (
  overrides: { designUnit?: string; dpi?: number } = {}
) => {
  const fake: Fake = {
    element: {
      getBoundingClientRect: () =>
        ({ top: 0, left: 0, width: 400, height: 600 }) as DOMRect
    },
    editor: { getTextCursorPositionInScreenSpaceY: vi.fn(() => 100) },
    scene: { get: () => 1, getZoomLevel: () => 1 },
    block: {
      findAllSelected: vi.fn(() => [5]),
      findByType: vi.fn(() => [7]),
      getPositionY: vi.fn(() => 0),
      setPositionY: vi.fn(),
      getEnum: vi.fn(() => overrides.designUnit ?? 'Pixel'),
      getFloat: vi.fn(() => overrides.dpi ?? 300)
    }
  };
  return fake as unknown as CreativeEngine & Fake;
};

beforeEach(() => {
  window.devicePixelRatio = 1;
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: { height: 600 }
  });
});

describe('MB-U8 pixelToCanvasUnit', () => {
  it('is the identity for a pixel scene at zoom 1', () => {
    expect(pixelToCanvasUnit(createEngine(), 120)).toBe(120);
  });

  it('divides by the device pixel ratio and the zoom level', () => {
    window.devicePixelRatio = 2;
    const engine = createEngine();
    engine.scene.getZoomLevel = () => 4;
    expect(pixelToCanvasUnit(engine, 120)).toBe(15);
  });

  it('converts through the scene dpi for a millimetre scene', () => {
    const engine = createEngine({ designUnit: 'Millimeter', dpi: 25.4 });
    expect(pixelToCanvasUnit(engine, 120)).toBe(120);
  });

  it('converts through the scene dpi for an inch scene', () => {
    const engine = createEngine({ designUnit: 'Inch', dpi: 300 });
    expect(pixelToCanvasUnit(engine, 300)).toBe(1);
  });
});

describe('MB-U9 zoomToSelectedText', () => {
  it('does nothing while the cursor has no laid-out position', async () => {
    const engine = createEngine();
    engine.editor.getTextCursorPositionInScreenSpaceY.mockReturnValue(0);
    await zoomToSelectedText(engine);
    expect(engine.block.setPositionY).not.toHaveBeenCalled();
  });

  it('does nothing unless exactly one block is selected', async () => {
    const engine = createEngine();
    engine.block.findAllSelected.mockReturnValue([5, 6]);
    await zoomToSelectedText(engine);
    expect(engine.block.setPositionY).not.toHaveBeenCalled();
  });

  it('leaves the camera alone while the cursor is inside the visible area', async () => {
    const engine = createEngine();
    engine.editor.getTextCursorPositionInScreenSpaceY.mockReturnValue(100);
    await zoomToSelectedText(engine, 0, 0);
    expect(engine.block.setPositionY).not.toHaveBeenCalled();
  });

  it('moves the camera when the cursor sits below the visible area', async () => {
    const engine = createEngine();
    engine.editor.getTextCursorPositionInScreenSpaceY.mockReturnValue(590);
    await zoomToSelectedText(engine, 0, 100);
    expect(engine.block.setPositionY).toHaveBeenCalledWith(7, 90);
  });

  it('moves the camera when the cursor sits above the top padding', async () => {
    const engine = createEngine();
    engine.editor.getTextCursorPositionInScreenSpaceY.mockReturnValue(10);
    await zoomToSelectedText(engine, 50, 0);
    expect(engine.block.setPositionY).toHaveBeenCalledWith(7, -590);
  });

  it('subtracts the part of the canvas the viewport no longer shows', async () => {
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: { height: 400 }
    });
    const engine = createEngine();
    engine.editor.getTextCursorPositionInScreenSpaceY.mockReturnValue(450);
    await zoomToSelectedText(engine);
    expect(engine.block.setPositionY).toHaveBeenCalledWith(7, 50);
  });
});
