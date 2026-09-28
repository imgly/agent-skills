// @vitest-environment jsdom
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  downloadProductAssets,
  exportProductAssets
} from '../../src/app/utils/product';

const PRODUCT = {
  areas: [
    { id: 'front', pageSize: { width: 1, height: 1 } },
    { id: 'back', pageSize: { width: 1, height: 1 }, disabled: true }
  ]
};

interface EngineOptions {
  metadata?: string;
  pages?: Record<number, string>;
}

function fakeEngine({
  metadata,
  pages = { 1: 'front', 2: 'back' }
}: EngineOptions) {
  const strokes: [number, boolean][] = [];
  const exports: { page: number; mimeType: string }[] = [];
  return {
    strokes,
    exports,
    engine: {
      scene: {
        get: () => 100,
        saveToArchive: vi.fn(async () => new Blob(['archive']))
      },
      block: {
        getMetadata: () => metadata,
        findByType: () => Object.keys(pages).map(Number),
        getName: (page: number) => pages[page],
        setStrokeEnabled: (page: number, enabled: boolean) =>
          strokes.push([page, enabled]),
        export: vi.fn(async (page: number, options: { mimeType: string }) => {
          exports.push({ page, mimeType: options.mimeType });
          return new Blob([options.mimeType]);
        })
      }
    } as unknown as CreativeEngine
  };
}

describe('PE-U10 exportProductAssets', () => {
  it('exports a PDF and a thumbnail for every enabled area only', async () => {
    const fake = fakeEngine({ metadata: JSON.stringify(PRODUCT) });

    const assets = await exportProductAssets(fake.engine);

    expect(Object.keys(assets.pdfs)).toEqual(['front']);
    expect(Object.keys(assets.thumbnails)).toEqual(['front']);
    expect(fake.exports).toEqual([
      { page: 1, mimeType: 'application/pdf' },
      { page: 1, mimeType: 'image/png' }
    ]);
    expect(fake.strokes).toEqual([
      [1, false],
      [1, true]
    ]);
  });

  it('exports nothing when the scene carries no product', async () => {
    const fake = fakeEngine({ metadata: undefined });

    const assets = await exportProductAssets(fake.engine);

    expect(assets.pdfs).toEqual({});
    expect(fake.exports).toEqual([]);
  });
});

describe('PE-U11 downloadProductAssets', () => {
  let clicked: string[];

  beforeEach(() => {
    clicked = [];
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:product'),
      revokeObjectURL: vi.fn()
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
      function click(this: HTMLAnchorElement) {
        clicked.push(this.download);
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('downloads one PDF, one thumbnail and the archive, and cleans up', async () => {
    const fake = fakeEngine({ metadata: JSON.stringify(PRODUCT) });

    await downloadProductAssets(fake.engine);

    expect(clicked).toHaveLength(3);
    expect(clicked[0]).toMatch(/^scene-.*-front\.pdf$/);
    expect(clicked[1]).toMatch(/^scene-thumbnail-.*-front\.png$/);
    expect(clicked[2]).toMatch(/^scene-.*\.imgly$/);
    expect(document.body.querySelectorAll('a')).toHaveLength(0);
  });
});
