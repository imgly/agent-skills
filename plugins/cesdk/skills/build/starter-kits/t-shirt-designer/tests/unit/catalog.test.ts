import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { PRODUCT_SAMPLES } from '../../src/app/product-catalog';
import {
  downloadProductAssets,
  setupSceneOptions,
  storeProductMetadata
} from '../../src/app/utils/product';

const product = PRODUCT_SAMPLES[0];

describe('TSD-U4 catalogue invariants', () => {
  it('ships exactly one product', () => {
    expect(PRODUCT_SAMPLES).toHaveLength(1);
    expect(product.id).toBe('tshirt');
    expect(product.label).toBe('Mens T-Shirt');
    expect(product.unitPrice).toBe(19.99);
    expect(product.designUnit).toBe('Inch');
  });

  it('offers ten unique colours with one default', () => {
    const ids = product.colors.map((color) => color.id);
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
    expect(product.colors.filter((color) => color.isDefault)).toEqual([
      { id: 'white', colorHex: '#FFFFFF', isDefault: true }
    ]);
  });

  it('offers five sizes', () => {
    expect(product.sizes?.map((size) => size.id)).toEqual([
      'XS',
      'S',
      'M',
      'L',
      'XL'
    ]);
  });

  it('gives the two enabled areas a mockup and the two disabled ones none', () => {
    const enabled = product.areas.filter((area) => !area.disabled);
    const disabled = product.areas.filter((area) => area.disabled);

    expect(enabled.map((area) => area.id)).toEqual(['front', 'back']);
    expect(disabled.map((area) => area.id)).toEqual(['left', 'right']);
    enabled.forEach((area) => {
      expect(area.mockup!.images).toHaveLength(1);
      expect(area.mockup!.images![0].uri).toContain('{{color}}');
      expect(area.mockup!.images![0].uri).toContain('/assets/products/tshirt/');
    });
    disabled.forEach((area) => expect(area.mockup).toBeUndefined());
  });

  it('declares no page shape, so every page stays rectangular', () => {
    expect(product.areas.some((area) => area.mockup?.pageShape != null)).toBe(
      false
    );
  });
});

describe('TSD-U3 setupSceneOptions', () => {
  it('drops the two disabled decorations', () => {
    const color = product.colors.find((c) => c.isDefault)!;

    const options = setupSceneOptions(product, color);

    expect(options.areas.map((area) => area.id)).toEqual(['front', 'back']);
    expect(options.designUnit).toBe('Inch');
    expect(options.variables).toEqual({ color: 'white' });
    options.areas.forEach((area) => {
      expect(Object.keys(area).sort()).toEqual(['id', 'mockup', 'pageSize']);
    });
  });
});

describe('TSD-U9 the printable area of the t-shirt', () => {
  it('centres the print area horizontally and lifts it 100 px', () => {
    const [product] = PRODUCT_SAMPLES;
    const mockup = product.areas.find((area) => area.mockup)!.mockup!;
    const { width, height } = mockup.printableAreaPx;
    const [imageWidth, imageHeight] = [815, 948];

    expect(mockup.printableAreaPx.x).toBe((imageWidth - width) / 2);
    expect(mockup.printableAreaPx.y).toBe((imageHeight - height) / 2 - 100);
  });
});

describe('TSD-U10 storeProductMetadata', () => {
  function engineStub(scene: number | null) {
    const metadata = new Map<string, string>();
    return {
      metadata,
      engine: {
        scene: { get: () => scene },
        block: {
          setMetadata: (_id: number, key: string, value: string) =>
            metadata.set(key, value)
        }
      } as unknown as CreativeEngine
    };
  }

  it('stores the product and the colour on the scene', () => {
    const [product] = PRODUCT_SAMPLES;
    const color = product.colors.find((entry) => entry.isDefault)!;
    const stub = engineStub(1);

    storeProductMetadata(stub.engine, product, color);

    expect(JSON.parse(stub.metadata.get('product')!).id).toBe(product.id);
    expect(JSON.parse(stub.metadata.get('color')!).id).toBe(color.id);
  });

  it('writes nothing when there is no scene yet', () => {
    const [product] = PRODUCT_SAMPLES;
    const stub = engineStub(null);

    storeProductMetadata(stub.engine, product, product.colors[0]);

    expect(stub.metadata.size).toBe(0);
  });
});

describe('TSD-U11 downloadProductAssets', () => {
  it('downloads one PDF and one thumbnail per page plus the archive', async () => {
    const anchors: {
      href: string;
      download: string;
      style: Record<string, string>;
      click: () => void;
      remove: () => void;
    }[] = [];
    vi.stubGlobal('URL', {
      createObjectURL: (blob: Blob) => `blob:${blob.size}`,
      revokeObjectURL: vi.fn()
    });
    vi.stubGlobal('document', {
      createElement: () => {
        const anchor = {
          href: '',
          download: '',
          style: {} as Record<string, string>,
          click: vi.fn(),
          remove: vi.fn()
        };
        anchors.push(anchor);
        return anchor;
      },
      body: { appendChild: vi.fn() }
    });

    const engine = {
      scene: { saveToArchive: async () => new Blob(['archive']) },
      block: {
        findByType: () => [10, 20],
        getName: (id: number) => (id === 10 ? 'front' : 'back'),
        setStrokeEnabled: vi.fn(),
        export: async () => new Blob(['file'])
      }
    } as unknown as CreativeEngine;

    await downloadProductAssets(engine);

    expect(anchors).toHaveLength(5);
    expect(anchors.map(({ download }) => download.split('-').at(-1))).toEqual([
      'front.pdf',
      'back.pdf',
      'front.png',
      'back.png',
      expect.stringMatching(/\.imgly$/)
    ]);
    anchors.forEach((anchor) => expect(anchor.click).toHaveBeenCalledTimes(1));
    vi.unstubAllGlobals();
  });
});
