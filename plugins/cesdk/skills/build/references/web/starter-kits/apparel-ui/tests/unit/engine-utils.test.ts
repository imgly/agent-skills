// @vitest-environment jsdom
import type CreativeEngine from '@cesdk/engine';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getImageSize,
  pixelToCanvasUnit,
  zoomToSelectedText
} from '../../src/imgly/creative-engine-utils';

interface FakeOptions {
  designUnit?: string;
  dpi?: number;
  zoom?: number;
  selected?: number[];
  cursorY?: number;
  cameraY?: number;
}

function fakeEngine({
  designUnit = 'Pixel',
  dpi = 300,
  zoom = 1,
  selected = [1],
  cursorY = 0,
  cameraY = 0
}: FakeOptions = {}) {
  const canvas = document.createElement('canvas');
  canvas.getBoundingClientRect = () => ({ top: 0, height: 1000 }) as DOMRect;
  return {
    element: canvas,
    scene: { get: () => 9, getZoomLevel: () => zoom },
    editor: {
      getTextCursorPositionInScreenSpaceY: () => cursorY
    },
    block: {
      findAllSelected: () => selected,
      findByType: vi.fn(() => [77]),
      getEnum: () => designUnit,
      getFloat: () => dpi,
      getPositionY: () => cameraY,
      setPositionY: vi.fn()
    }
  } as unknown as CreativeEngine;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AP-U6 pixelToCanvasUnit', () => {
  it('AP-U6 divides by the device pixel ratio and the zoom in pixel scenes', () => {
    vi.stubGlobal('devicePixelRatio', 2);
    expect(pixelToCanvasUnit(fakeEngine({ zoom: 4 }), 800)).toBe(100);
  });

  it.each([
    ['Millimeter', 300 / 25.4],
    ['Inch', 300]
  ])('AP-U6 scales a %s scene by its dpi', (designUnit, densityFactor) => {
    vi.stubGlobal('devicePixelRatio', 1);
    expect(pixelToCanvasUnit(fakeEngine({ designUnit }), 100)).toBeCloseTo(
      100 / densityFactor,
      6
    );
  });
});

describe('AP-U7 zoomToSelectedText', () => {
  function withViewport(height: number) {
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: { height }
    });
  }

  it('AP-U7 does nothing while the cursor position is not known yet', async () => {
    vi.stubGlobal('devicePixelRatio', 1);
    withViewport(1000);
    const engine = fakeEngine({ cursorY: 0 });

    await zoomToSelectedText(engine, 0, 0);

    expect(engine.block.setPositionY).not.toHaveBeenCalled();
  });

  it('AP-U7 does nothing unless exactly one block is selected', async () => {
    vi.stubGlobal('devicePixelRatio', 1);
    withViewport(1000);
    const engine = fakeEngine({ selected: [1, 2], cursorY: 5000 });

    await zoomToSelectedText(engine, 0, 0);

    expect(engine.block.setPositionY).not.toHaveBeenCalled();
  });

  it('AP-U7 moves the camera when the cursor sits below the visible area', async () => {
    vi.stubGlobal('devicePixelRatio', 1);
    withViewport(1000);
    const engine = fakeEngine({ cursorY: 5000, cameraY: 10 });

    await zoomToSelectedText(engine, 0, 0);

    expect(engine.block.setPositionY).toHaveBeenCalledWith(77, 4010);
  });

  it('AP-U7 moves the camera when the cursor sits above the top padding', async () => {
    vi.stubGlobal('devicePixelRatio', 1);
    withViewport(1000);
    const engine = fakeEngine({ cursorY: 10 });

    await zoomToSelectedText(engine, 100, 0);

    expect(engine.block.setPositionY).toHaveBeenCalled();
  });

  it('AP-U7 leaves the camera alone while the cursor is already in view', async () => {
    vi.stubGlobal('devicePixelRatio', 1);
    withViewport(1000);
    const engine = fakeEngine({ cursorY: 500 });

    await zoomToSelectedText(engine, 0, 0);

    expect(engine.block.setPositionY).not.toHaveBeenCalled();
  });
});

describe('AP-U8 getImageSize', () => {
  const SIZE = { width: 640, height: 480 };

  /** jsdom loads no image, so setting `src` is what completes the promise. */
  function stubImageLoading(outcome: 'load' | 'error'): () => void {
    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src'
    ) as PropertyDescriptor;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      set(this: HTMLImageElement) {
        Object.defineProperty(this, 'naturalWidth', { value: SIZE.width });
        Object.defineProperty(this, 'naturalHeight', { value: SIZE.height });
        setTimeout(() => {
          if (outcome === 'load') this.onload?.(new Event('load'));
          else this.onerror?.(new Event('error'));
        }, 0);
      }
    });
    return () =>
      Object.defineProperty(HTMLImageElement.prototype, 'src', descriptor);
  }

  it('AP-U8 resolves with the natural size once the image loads', async () => {
    const restore = stubImageLoading('load');
    await expect(getImageSize('image.png')).resolves.toEqual(SIZE);
    restore();
  });

  it('AP-U8 rejects when the image cannot be loaded', async () => {
    const restore = stubImageLoading('error');
    await expect(getImageSize('missing.png')).rejects.toBeDefined();
    restore();
  });
});
