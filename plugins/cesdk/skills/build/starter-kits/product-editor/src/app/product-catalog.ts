/**
 * CE.SDK Product Editor - Demo Product Catalog
 *
 * ============================================================================
 * [DEMO] This file is for demonstration purposes only.
 *
 * In production, you would replace this with product configurations
 * loaded from your own database, CMS, or product management system.
 * ============================================================================
 *
 * This file contains sample product configurations for demonstration.
 * Each product defines its printable areas, available colors, and mockup images.
 */

import type { DesignUnit, Source } from '@cesdk/cesdk-js';

// ─── Product Types ────────────────────────────────────────────────────────────

export interface ProductConfig {
  id: string;
  label: string;
  designUnit: DesignUnit;
  areas: ProductAreaConfig[];
  colors: ProductColor[];
  /** Optional unit price for display purposes */
  unitPrice?: number;
  /** Optional sizes for display purposes */
  sizes?: ProductSize[];
}

export interface ProductAreaConfig {
  id: string;
  label: string;
  pageSize: {
    width: number;
    height: number;
  };
  disabled?: boolean;
  mockup?: ProductMockupConfig;
}

export interface ProductMockupConfig {
  images?: Source[];
  printableAreaPx: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /**
   * Optional SVG path. When set, the page is clipped to this shape.
   */
  pageShape?: string;
}

export interface ProductColor {
  id: string;
  label?: string;
  colorHex: string;
  isDefault?: boolean;
}

export interface ProductSize {
  id: string;
  label?: string;
  value?: string;
}

/**
 * Base URL for product assets.
 * Must be a full URL to avoid CE.SDK baseURL resolution.
 * The engine resolves relative URLs against its baseURL (CDN by default).
 */
const ASSETS_BASE = `${window.location.origin}${import.meta.env.BASE_URL}assets/products`;

// ============================================================================
// Standard Colors (shared across most products)
// ============================================================================

const STANDARD_COLORS = [
  { id: 'white', colorHex: '#FFFFFF', isDefault: true },
  { id: 'black', colorHex: '#000000' },
  { id: 'blue', colorHex: '#1F40D3' },
  { id: 'gray', colorHex: '#929292' },
  { id: 'green', colorHex: '#43D31F' },
  { id: 'red', colorHex: '#E02D27' }
];

// ============================================================================
// T-Shirt Measurements
// ============================================================================

const TSHIRT = {
  imageWidth: 814,
  imageHeight: 947,
  printWidth: 360,
  printHeight: 360,
  /** Print area is shifted up from center */
  printOffsetY: -100
} as const;

// ============================================================================
// Cap Measurements
// ============================================================================

const CAP = {
  imageWidth: 736,
  imageHeight: 760,
  front: {
    printWidth: 300,
    printHeight: 200,
    /** Print area is shifted up from center */
    printOffsetY: -50
  },
  back: {
    printX: 269,
    printY: 244,
    printWidth: 199,
    printHeight: 92
  }
} as const;

// ============================================================================
// Arrow Sign Measurements
// ============================================================================

const ARROWSIGN = {
  imageWidth: 1039,
  imageHeight: 963,
  printX: 59,
  printY: 42,
  printWidth: 947,
  printHeight: 625
} as const;

// ============================================================================
// Mug Measurements
// ============================================================================

const MUG = {
  imageWidth: 841,
  imageHeight: 762,
  printX: 155,
  printY: 186,
  printWidth: 300,
  printHeight: 386
} as const;

// ============================================================================
// Phone Case Measurements
// ============================================================================

const PHONECASE = {
  imageWidth: 494,
  imageHeight: 917,
  printX: 73,
  printY: 321,
  printWidth: 348,
  printHeight: 341
} as const;

// ============================================================================
// Tote Bag Measurements
// ============================================================================

const TOTEBAG = {
  imageWidth: 751,
  imageHeight: 1225,
  printX: 132,
  printY: 619,
  printWidth: 489,
  printHeight: 432.32
} as const;

// ============================================================================
// Helper: Calculate centered print area
// ============================================================================

function centeredPrintArea(
  imageWidth: number,
  imageHeight: number,
  printWidth: number,
  printHeight: number,
  offsetY: number = 0
) {
  return {
    x: (imageWidth - printWidth) / 2,
    y: (imageHeight - printHeight) / 2 + offsetY,
    width: printWidth,
    height: printHeight
  };
}

// ============================================================================
// Product Samples
// ============================================================================

export const PRODUCT_SAMPLES: ProductConfig[] = [
  {
    id: 'tshirt',
    label: 'Mens T-Shirt',
    designUnit: 'Inch',
    unitPrice: 19.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: { width: 12, height: 12 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/tshirt/{{color}}_front.png`,
              width: TSHIRT.imageWidth,
              height: TSHIRT.imageHeight
            }
          ],
          printableAreaPx: centeredPrintArea(
            TSHIRT.imageWidth,
            TSHIRT.imageHeight,
            TSHIRT.printWidth,
            TSHIRT.printHeight,
            TSHIRT.printOffsetY
          )
        }
      },
      {
        id: 'back',
        label: 'Back',
        pageSize: { width: 12, height: 12 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/tshirt/{{color}}_back.png`,
              width: TSHIRT.imageWidth,
              height: TSHIRT.imageHeight
            }
          ],
          printableAreaPx: centeredPrintArea(
            TSHIRT.imageWidth,
            TSHIRT.imageHeight,
            TSHIRT.printWidth,
            TSHIRT.printHeight,
            TSHIRT.printOffsetY
          )
        }
      }
    ],
    colors: STANDARD_COLORS,
    sizes: [{ id: 'XS' }, { id: 'S' }, { id: 'M' }, { id: 'L' }, { id: 'XL' }]
  },
  {
    id: 'cap',
    label: 'Baseball Cap',
    designUnit: 'Inch',
    unitPrice: 14.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: { width: 4.5, height: 3 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/cap/{{color}}_front.png`,
              width: CAP.imageWidth,
              height: CAP.imageHeight
            }
          ],
          printableAreaPx: centeredPrintArea(
            CAP.imageWidth,
            CAP.imageHeight,
            CAP.front.printWidth,
            CAP.front.printHeight,
            CAP.front.printOffsetY
          )
        }
      },
      {
        id: 'back',
        label: 'Back',
        pageSize: { width: 2.99, height: 1.38 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/cap/{{color}}_back.png`,
              width: CAP.imageWidth,
              height: CAP.imageHeight
            }
          ],
          printableAreaPx: {
            x: CAP.back.printX,
            y: CAP.back.printY,
            width: CAP.back.printWidth,
            height: CAP.back.printHeight
          }
        }
      }
    ],
    colors: STANDARD_COLORS,
    sizes: [{ id: 'One Size' }]
  },
  {
    id: 'arrowsign',
    label: 'Arrow Sign',
    designUnit: 'Inch',
    unitPrice: 29.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: { width: 37.88, height: 25 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/arrowsign/{{color}}.png`,
              width: ARROWSIGN.imageWidth,
              height: ARROWSIGN.imageHeight
            }
          ],
          printableAreaPx: {
            x: ARROWSIGN.printX,
            y: ARROWSIGN.printY,
            width: ARROWSIGN.printWidth,
            height: ARROWSIGN.printHeight
          },
          // Arrow-sign silhouette.
          // Coordinates span the 947×625 printable area, preserving the
          // rounded corners of the physical sign.
          pageShape:
            'M628 0.97C623 3.97 623 3.97 623 46.97L623 88.97L621 91.97L618 93.97L311 94.97C142 94.97 3 95.97 3 95.97C3 95.97 2 96.97 2 98.97C0 101.97 0 124.97 0 309.97L0 516.97L3 519.97L6 522.97L312 522.97L618 522.97L620 525.97L623 528.97L623 570.97L623 611.97L625 614.97C627 616.97 629 616.97 631 616.97C635 616.97 640 611.97 788 464.97C939 312.97 940 311.97 940 308.97C940 304.97 939 303.97 788 151.97C652 16.97 635 -0.03 632 -0.03C631 -0.03 629 0.97 628 0.97Z'
        }
      }
    ],
    colors: STANDARD_COLORS,
    sizes: [{ id: '24" x 12"' }]
  },
  {
    id: 'mug',
    label: 'Coffee Mug',
    designUnit: 'Inch',
    unitPrice: 12.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: { width: 9, height: 11.58 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/mug/{{color}}.png`,
              width: MUG.imageWidth,
              height: MUG.imageHeight
            }
          ],
          printableAreaPx: {
            x: MUG.printX,
            y: MUG.printY,
            width: MUG.printWidth,
            height: MUG.printHeight
          }
        }
      }
    ],
    colors: STANDARD_COLORS,
    sizes: [{ id: '11oz' }]
  },
  {
    id: 'phonecase',
    label: 'Phone Case',
    designUnit: 'Inch',
    unitPrice: 16.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: { width: 2.75, height: 3.12 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/phonecase/{{color}}.png`,
              width: PHONECASE.imageWidth,
              height: PHONECASE.imageHeight
            }
          ],
          printableAreaPx: {
            x: PHONECASE.printX,
            y: PHONECASE.printY,
            width: PHONECASE.printWidth,
            height: PHONECASE.printHeight
          }
        }
      }
    ],
    colors: STANDARD_COLORS,
    sizes: [{ id: 'iPhone 14 Pro' }]
  },
  {
    id: 'totebag',
    label: 'Tote Bag',
    designUnit: 'Inch',
    unitPrice: 18.99,
    areas: [
      {
        id: 'front',
        label: 'Front',
        pageSize: { width: 15.37, height: 13.45 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/totebag/{{color}}.png`,
              width: TOTEBAG.imageWidth,
              height: TOTEBAG.imageHeight
            }
          ],
          printableAreaPx: {
            x: TOTEBAG.printX,
            y: TOTEBAG.printY,
            width: TOTEBAG.printWidth,
            height: TOTEBAG.printHeight
          }
        }
      }
    ],
    colors: STANDARD_COLORS,
    sizes: [{ id: 'One Size' }]
  }
];
