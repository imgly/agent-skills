// @vitest-environment jsdom
import type CreativeEngine from '@cesdk/engine';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  downloadBlob,
  findImageAssets,
  getImageSize,
  pixelToCanvasUnit,
  zoomToSelectedText
} from '@/imgly/utils';

interface EngineStubOptions {
  scene?: number | null;
  designUnit?: string;
  dpi?: number;
  zoom?: number;
  selected?: number[];
  cursorY?: number;
  canvasRect?: { top: number; height: number };
}

function engineStub({
  scene = 1,
  designUnit = 'Millimeter',
  dpi = 300,
  zoom = 1,
  selected = [7],
  cursorY = 500,
  canvasRect = { top: 0, height: 400 }
}: EngineStubOptions = {}) {
  const positions = new Map<number, number>([[42, 10]]);
  const element = {
    getBoundingClientRect: () => ({ ...canvasRect })
  } as unknown as HTMLElement;

  const engine = {
    element,
    scene: { get: () => scene, getZoomLevel: () => zoom },
    editor: {
      getTextCursorPositionInScreenSpaceY: () => cursorY,
      addUndoStep: vi.fn()
    },
    block: {
      findAllSelected: () => selected,
      findByType: () => [42],
      getEnum: () => designUnit,
      getFloat: () => dpi,
      getPositionY: (id: number) => positions.get(id) ?? 0,
      setPositionY: (id: number, value: number) => positions.set(id, value)
    }
  } as unknown as CreativeEngine;

  return { engine, positions };
}

/** jsdom ships no visual viewport; `zoomToSelectedText` reads one. */
function setVisualViewport(viewport: { height: number } | undefined): void {
  Object.defineProperty(window, 'visualViewport', {
    value: viewport,
    configurable: true
  });
}

beforeEach(() => {
  setVisualViewport({ height: 300 });
  Object.defineProperty(window, 'devicePixelRatio', {
    value: 1,
    configurable: true
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  setVisualViewport(undefined);
});

describe('PCU-U10 pixelToCanvasUnit', () => {
  it('answers 0 while no scene is loaded', () => {
    expect(pixelToCanvasUnit(engineStub({ scene: null }).engine, 100)).toBe(0);
  });

  it.each([
    ['Millimeter', 300 / 25.4],
    ['Inch', 300],
    ['Pixel', 1]
  ])('divides by the density factor of a %s scene', (unit, factor) => {
    const { engine } = engineStub({ designUnit: unit });
    expect(pixelToCanvasUnit(engine, 100)).toBeCloseTo(100 / factor, 6);
  });

  it('divides by the zoom level as well', () => {
    const { engine } = engineStub({ designUnit: 'Pixel', zoom: 2 });
    expect(pixelToCanvasUnit(engine, 100)).toBe(50);
  });
});

describe('PCU-U11 zoomToSelectedText', () => {
  it('does nothing without a visual viewport', async () => {
    setVisualViewport(undefined);
    const { engine, positions } = engineStub({ cursorY: 5000 });

    await zoomToSelectedText(engine);

    expect(positions.get(42)).toBe(10);
  });

  it('does nothing without a canvas element', async () => {
    const { engine, positions } = engineStub();
    (engine as { element?: unknown }).element = undefined;

    await zoomToSelectedText(engine);

    expect(positions.get(42)).toBe(10);
  });

  it('does nothing before the cursor has been laid out', async () => {
    const { engine, positions } = engineStub({ cursorY: 0 });

    await zoomToSelectedText(engine);

    expect(positions.get(42)).toBe(10);
  });

  it('does nothing unless exactly one block is selected', async () => {
    const { engine, positions } = engineStub({ selected: [1, 2] });

    await zoomToSelectedText(engine);

    expect(positions.get(42)).toBe(10);
  });

  it('moves the camera when the cursor sits below the visible area', async () => {
    const { engine, positions } = engineStub({ cursorY: 5000 });

    await zoomToSelectedText(engine);

    expect(positions.get(42)).not.toBe(10);
  });

  it('leaves the camera alone when the cursor is already in view', async () => {
    const { engine, positions } = engineStub({ cursorY: 100 });

    await zoomToSelectedText(engine, 0, 0);

    expect(positions.get(42)).toBe(10);
  });
});

describe('PCU-U12 getImageSize', () => {
  function stubImage(): { onload?: () => void; onerror?: () => void } {
    const image: Record<string, unknown> = {
      naturalWidth: 640,
      naturalHeight: 480
    };
    vi.stubGlobal('document', {
      createElement: () => image,
      body: { appendChild: vi.fn(), removeChild: vi.fn() }
    });
    return image as { onload?: () => void; onerror?: () => void };
  }

  it('answers with the natural size once the image loads', async () => {
    const image = stubImage();
    const pending = getImageSize('https://cdn.test/a.png');
    image.onload?.();

    await expect(pending).resolves.toEqual({ width: 640, height: 480 });
  });

  it('rejects when the image fails to load', async () => {
    const image = stubImage();
    const pending = getImageSize('https://cdn.test/missing.png');
    image.onerror?.();

    await expect(pending).rejects.toBeUndefined();
  });
});

describe('PCU-U13 downloadBlob', () => {
  it('clicks a hidden anchor and revokes the object URL afterwards', async () => {
    vi.useFakeTimers();
    const anchor = {
      setAttribute: vi.fn(),
      style: {} as Record<string, string>,
      click: vi.fn()
    };
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('document', {
      createElement: () => anchor,
      body: { appendChild: vi.fn(), removeChild: vi.fn() }
    });
    vi.stubGlobal('window', {
      URL: { createObjectURL: () => 'blob:postcard/1', revokeObjectURL }
    });

    downloadBlob(new Blob(['x']), 'postcard.png');

    expect(anchor.setAttribute).toHaveBeenCalledWith('href', 'blob:postcard/1');
    expect(anchor.setAttribute).toHaveBeenCalledWith(
      'download',
      'postcard.png'
    );
    expect(anchor.click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(0);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:postcard/1');
    vi.useRealTimers();
  });
});

describe('PCU-U14 findImageAssets', () => {
  function assetEngine(sources: string[]) {
    const findAssets = vi.fn(async (source: string, _query?: unknown) => ({
      assets: [{ id: `${source}-1` }],
      total: 1,
      currentPage: 0,
      nextPage: undefined
    }));
    return {
      findAssets,
      engine: {
        asset: { findAllSources: () => sources, findAssets }
      } as unknown as CreativeEngine
    };
  }

  it('lists the newest upload first and appends the Unsplash matches', async () => {
    const { engine, findAssets } = assetEngine([
      'ly.img.image.upload',
      'unsplash'
    ]);

    const assets = await findImageAssets(engine, 'mountains');

    expect(assets.map(({ id }) => id)).toEqual([
      'ly.img.image.upload-1',
      'unsplash-1'
    ]);
    expect(findAssets.mock.calls.at(-1)?.[1]).toEqual({
      page: 0,
      perPage: 10,
      query: 'mountains'
    });
  });

  it('lists only the uploads when Unsplash is not registered', async () => {
    const { engine } = assetEngine(['ly.img.image.upload']);

    const assets = await findImageAssets(engine);

    expect(assets.map(({ id }) => id)).toEqual(['ly.img.image.upload-1']);
  });
});
