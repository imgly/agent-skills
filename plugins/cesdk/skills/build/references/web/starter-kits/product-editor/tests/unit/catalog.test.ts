import { describe, expect, it } from 'vitest';

import {
  ASSETS_BASE,
  PRODUCT_SAMPLES,
  type ProductConfig
} from '../../src/app/product-catalog';
import { setupSceneOptions } from '../../src/app/utils/product';

const DESIGN_UNITS = ['Millimeter', 'Inch', 'Pixel'];

describe('PE-U4 catalogue invariants', () => {
  it('offers six products with unique ids', () => {
    const ids = PRODUCT_SAMPLES.map((product) => product.id);
    expect(ids).toEqual([
      'tshirt',
      'cap',
      'arrowsign',
      'mug',
      'phonecase',
      'totebag'
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(PRODUCT_SAMPLES.map((p): [string, ProductConfig] => [p.id, p]))(
    '%s has exactly one default colour and a valid design unit',
    (_id, product) => {
      expect(product.colors.filter((color) => color.isDefault)).toHaveLength(1);
      expect(DESIGN_UNITS).toContain(product.designUnit);
    }
  );

  it.each(PRODUCT_SAMPLES.map((p): [string, ProductConfig] => [p.id, p]))(
    '%s gives every enabled area a mockup rooted at ASSETS_BASE',
    (_id, product) => {
      const enabled = product.areas.filter((area) => !area.disabled);
      expect(enabled.length).toBeGreaterThan(0);
      enabled.forEach((area) => {
        expect(area.mockup).toBeDefined();
        expect(area.mockup!.images!.length).toBeGreaterThan(0);
        expect(area.mockup!.printableAreaPx.width).toBeGreaterThan(0);
        expect(area.mockup!.printableAreaPx.height).toBeGreaterThan(0);
        area.mockup!.images!.forEach((image) => {
          expect(image.uri).toContain('{{color}}');
          expect(image.uri.startsWith(ASSETS_BASE)).toBe(true);
        });
      });
    }
  );

  it('gives only the arrow sign a page shape', () => {
    const withShape = PRODUCT_SAMPLES.filter((product) =>
      product.areas.some((area) => area.mockup?.pageShape != null)
    ).map((product) => product.id);
    expect(withShape).toEqual(['arrowsign']);
  });
});

describe('PE-U3 setupSceneOptions', () => {
  it('maps a product and a colour to the setupScene payload', () => {
    const product = PRODUCT_SAMPLES[0];
    const color = product.colors.find((c) => c.isDefault)!;

    const options = setupSceneOptions(product, color);

    expect(options.designUnit).toBe(product.designUnit);
    expect(options.variables).toEqual({ color: color.id });
    expect(options.areas.map((area) => area.id)).toEqual(['front', 'back']);
    options.areas.forEach((area) => {
      expect(Object.keys(area).sort()).toEqual(['id', 'mockup', 'pageSize']);
    });
  });

  it('drops disabled areas', () => {
    const product: ProductConfig = {
      ...PRODUCT_SAMPLES[0],
      areas: [
        PRODUCT_SAMPLES[0].areas[0],
        { ...PRODUCT_SAMPLES[0].areas[1], disabled: true }
      ]
    };

    const options = setupSceneOptions(product, product.colors[0]);

    expect(options.areas.map((area) => area.id)).toEqual(['front']);
  });
});
