import { describe, expect, it } from 'vitest';

import {
  applyVariables,
  calculateBlockLayout
} from '../../src/imgly/plugins/product-scene';
import { PRODUCT_SAMPLES } from '../../src/app/product-catalog';

const tshirtFront = PRODUCT_SAMPLES[0].areas[0];

describe('TSD-U1 applyVariables', () => {
  const images = [
    { uri: 'https://cdn/{{color}}_{{side}}.png', width: 2, height: 3 }
  ];

  it('substitutes several keys in one URI', () => {
    expect(
      applyVariables(images, { color: 'black', side: 'front' })[0].uri
    ).toBe('https://cdn/black_front.png');
  });

  it('replaces every occurrence of a repeated token', () => {
    const repeated = [
      { uri: '{{color}}/x_{{color}}.png', width: 1, height: 1 }
    ];
    expect(applyVariables(repeated, { color: 'red' })[0].uri).toBe(
      'red/x_red.png'
    );
  });

  it('leaves an unknown token untouched', () => {
    expect(applyVariables(images, { color: 'red' })[0].uri).toBe(
      'https://cdn/red_{{side}}.png'
    );
  });

  it('returns the URIs unchanged for an empty map', () => {
    expect(applyVariables(images, {})[0].uri).toBe(images[0].uri);
  });

  it('carries width and height over', () => {
    const [result] = applyVariables(images, { color: 'red', side: 'back' });
    expect(result.width).toBe(2);
    expect(result.height).toBe(3);
  });

  it('does not mutate its input', () => {
    const input = [{ uri: '{{color}}.png', width: 1, height: 1 }];
    applyVariables(input, { color: 'blue' });
    expect(input[0].uri).toBe('{{color}}.png');
  });
});

describe('TSD-U2 calculateBlockLayout', () => {
  it('scales the mockup so the printable area covers the page', () => {
    const mockup = tshirtFront.mockup!;
    const config = {
      images: mockup.images!,
      printableAreaPx: mockup.printableAreaPx
    };
    const pageWidth = tshirtFront.pageSize.width;
    const scale = pageWidth / mockup.printableAreaPx.width;

    expect(calculateBlockLayout(pageWidth, config)).toEqual({
      width: mockup.images![0].width * scale,
      height: mockup.images![0].height * scale,
      x: -mockup.printableAreaPx.x * scale,
      y: -mockup.printableAreaPx.y * scale
    });
  });

  it('throws when the backdrop has no image', () => {
    expect(() =>
      calculateBlockLayout(12, {
        images: [],
        printableAreaPx: { x: 0, y: 0, width: 1, height: 1 }
      })
    ).toThrow('Backdrop configuration must include images');
  });
});
