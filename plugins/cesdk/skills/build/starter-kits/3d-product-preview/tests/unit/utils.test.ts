import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { CLEAR_IMAGE } from '../../src/imgly/mockup';
import {
  DEFAULT_EXPORT_HEIGHT,
  DEFAULT_EXPORT_WIDTH,
  DEFAULT_MAX_PLACEHOLDERS,
  DEMO_ASSETS_BASE_URL,
  PRODUCTS,
  getDesignSceneUrl,
  getMockupSceneUrl,
  getModelUrl
} from '../../src/app/constants';
import {
  buildPlaceholders,
  downloadMockup,
  getDefaultProductKey,
  getPlaceholderName
} from '../../src/app/utils';

/** The two calls `buildPlaceholders` makes, over a fixed page list. */
function fakeEngine(pages: number[]) {
  const exported: { id: number; options: Record<string, unknown> }[] = [];
  return {
    exported,
    engine: {
      block: {
        findByKind: () => pages,
        export: (id: number, options: Record<string, unknown>) => {
          exported.push({ id, options });
          return Promise.resolve(new Blob([`page-${id}`]));
        }
      }
    } as unknown as CreativeEngine
  };
}

describe('P3D-U1 getPlaceholderName', () => {
  it('is one-based', () => {
    expect(getPlaceholderName(0)).toBe('Image 1');
    expect(getPlaceholderName(9)).toBe('Image 10');
  });
});

describe('P3D-U2 URL helpers', () => {
  it.each(Object.entries(PRODUCTS))(
    '%s resolves its design, texture and model URLs',
    (key, product) => {
      const base = `${DEMO_ASSETS_BASE_URL}/${product.assetsFolderName}`;
      expect(getDesignSceneUrl(key)).toBe(`${base}/design.scene`);
      expect(getMockupSceneUrl(key)).toBe(
        `${base}/textures/Material_baseColor.scene`
      );
      expect(getModelUrl(key)).toBe(`${base}/scene.gltf`);
    }
  );

  it.each([getDesignSceneUrl, getMockupSceneUrl, getModelUrl])(
    'throws for an unknown product key',
    (helper) => {
      expect(() => helper('x')).toThrow('Unknown product key: x');
    }
  );

  it("prefers the VITE override over the kit's own URL", () => {
    expect(DEMO_ASSETS_BASE_URL).toBe(
      import.meta.env.VITE_DEMO_ASSETS_BASE_URL ??
        (typeof location === 'undefined'
          ? import.meta.env.BASE_URL
          : new URL(import.meta.env.BASE_URL, location.href).href
        ).replace(/\/$/, '')
    );
    expect(DEMO_ASSETS_BASE_URL.endsWith('/')).toBe(false);
  });
});

describe('P3D-U3 catalogue invariants', () => {
  it('offers three products in catalogue order', () => {
    expect(Object.keys(PRODUCTS)).toEqual(['businesscard', 'cap', 'apparel']);
    expect(Object.values(PRODUCTS).map((product) => product.label)).toEqual([
      'Business Card',
      'Baseball Cap',
      'Apparel'
    ]);
  });

  it.each(Object.entries(PRODUCTS))(
    '%s names an asset folder and a camera angle',
    (_key, product) => {
      expect(product.assetsFolderName).toMatch(/^[a-z-]+$/);
      expect(product.cameraOrbit).toMatch(/^-?\d+deg -?\d+deg$/);
      expect(Number.isInteger(product.baseColorTextureIndex)).toBe(true);
    }
  );

  it('gives only apparel a non-zero base-colour material index', () => {
    expect(
      Object.entries(PRODUCTS)
        .filter(([, product]) => product.baseColorTextureIndex !== 0)
        .map(([key]) => key)
    ).toEqual(['apparel']);
    expect(PRODUCTS.apparel.cameraOrbit).toBe('0deg 90deg');
    expect(PRODUCTS.cap.cameraOrbit).toBe('160deg 90deg');
  });
});

describe('P3D-U4 buildPlaceholders', () => {
  const size = { width: DEFAULT_EXPORT_WIDTH, height: DEFAULT_EXPORT_HEIGHT };

  it('exports one 1048 x 1048 image per page and clears the rest', async () => {
    const { engine, exported } = fakeEngine([1, 2, 3]);

    const placeholders = await buildPlaceholders(
      engine,
      DEFAULT_MAX_PLACEHOLDERS,
      size
    );

    expect(Object.keys(placeholders)).toHaveLength(DEFAULT_MAX_PLACEHOLDERS);
    ['Image 1', 'Image 2', 'Image 3'].forEach((name) =>
      expect(placeholders[name]).toBeInstanceOf(Blob)
    );
    for (let i = 4; i <= DEFAULT_MAX_PLACEHOLDERS; i++) {
      expect(placeholders[`Image ${i}`]).toBe(CLEAR_IMAGE);
    }
    exported.forEach(({ options }) =>
      expect(options).toEqual({
        mimeType: 'image/png',
        targetWidth: 1048,
        targetHeight: 1048
      })
    );
  });

  it('clears every slot when the design has no page', async () => {
    const { engine } = fakeEngine([]);

    const placeholders = await buildPlaceholders(
      engine,
      DEFAULT_MAX_PLACEHOLDERS,
      size
    );

    expect(Object.values(placeholders)).toEqual(
      Array(DEFAULT_MAX_PLACEHOLDERS).fill(CLEAR_IMAGE)
    );
  });
});

describe('P3D-U5 dead exports', () => {
  it('names the first catalogue entry as the default the App does not use', () => {
    // `App` starts on `apparel`, and the 3D preview has no download button, so
    // neither of these helpers has a caller (test plan issue 3).
    expect(getDefaultProductKey()).toBe('businesscard');
  });
});

describe('P3D-U7 downloadMockup', () => {
  it('names the file after the product and clicks a temporary link', () => {
    const link = { href: '', download: '' } as HTMLAnchorElement;
    link.click = vi.fn();
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    vi.stubGlobal('document', {
      createElement: () => link,
      body: { appendChild, removeChild }
    });

    const [productKey] = Object.keys(PRODUCTS);
    downloadMockup('blob:mockup/1', productKey);

    expect(link.href).toBe('blob:mockup/1');
    expect(link.download).toBe(
      `${PRODUCTS[productKey].label
        .toLowerCase()
        .replace(/\s+/g, '-')}-mockup.png`
    );
    expect(link.click).toHaveBeenCalledTimes(1);
    expect(appendChild).toHaveBeenCalledWith(link);
    expect(removeChild).toHaveBeenCalledWith(link);
    vi.unstubAllGlobals();
  });
});
