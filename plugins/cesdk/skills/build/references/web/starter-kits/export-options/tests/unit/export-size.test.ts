import { describe, expect, it } from 'vitest';

import { formatExportSize } from '../../src/imgly/plugins/export-design-panel';

// EO-U2: the size text under the resolution select.
describe('formatExportSize', () => {
  it.each([
    [0.5, '540 x 540 px'],
    [1, '1080 x 1080 px'],
    [1.5, '1620 x 1620 px'],
    [2, '2160 x 2160 px']
  ])('scales a 1080 px page by %s', (scale, expected) => {
    expect(formatExportSize('Pixel', 300, scale, 1080, 1080)).toBe(expected);
  });

  it('converts millimeters at the scene dpi', () => {
    expect(formatExportSize('Millimeter', 300, 1, 210, 297)).toBe(
      '2480 x 3508 px'
    );
    expect(formatExportSize('Millimeter', 300, 0.5, 210, 297)).toBe(
      '1240 x 1754 px'
    );
  });

  it('converts inches at the scene dpi', () => {
    expect(formatExportSize('Inch', 300, 1, 8.5, 11)).toBe('2550 x 3300 px');
    expect(formatExportSize('Inch', 300, 2, 8.5, 11)).toBe('5100 x 6600 px');
  });
});
