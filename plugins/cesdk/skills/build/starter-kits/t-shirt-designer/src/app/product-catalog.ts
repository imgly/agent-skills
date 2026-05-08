/**
 * CE.SDK T-Shirt Designer - Product Configuration
 *
 * ============================================================================
 * [DEMO] This file is for demonstration purposes only.
 *
 * In production, you would replace this with product configurations
 * loaded from your own database, CMS, or product management system.
 * ============================================================================
 *
 * This file defines the t-shirt product with front/back print areas
 * (Left/Right shown as disabled demo) and 10 color options.
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
// T-Shirt Measurements (from mockup images: 815x948 pixels)
// ============================================================================

const TSHIRT = {
  imageWidth: 815,
  imageHeight: 948,
  printWidth: 360,
  printHeight: 360,
  /** Print area is centered horizontally, shifted up from vertical center */
  get printX() {
    return (this.imageWidth - this.printWidth) / 2; // 227.5
  },
  get printY() {
    return (this.imageHeight - this.printHeight) / 2 - 100; // 194
  }
} as const;

// ============================================================================
// T-Shirt Colors (10 options - order matches screenshot)
// ============================================================================

const TSHIRT_COLORS = [
  { id: 'black', colorHex: '#000000' },
  { id: 'gray', colorHex: '#929292' },
  { id: 'white', colorHex: '#FFFFFF', isDefault: true },
  { id: 'red', colorHex: '#E02D27' },
  { id: 'orange', colorHex: '#F88D28' },
  { id: 'yellow', colorHex: '#F7EC1E' },
  { id: 'green', colorHex: '#43D31F' },
  { id: 'cyan', colorHex: '#1FD3CA' },
  { id: 'blue', colorHex: '#1F40D3' },
  { id: 'purple', colorHex: '#E524EF' }
];

// ============================================================================
// T-Shirt Sizes
// ============================================================================

const TSHIRT_SIZES = [
  { id: 'XS' },
  { id: 'S' },
  { id: 'M' },
  { id: 'L' },
  { id: 'XL' }
];

// ============================================================================
// Product Configuration
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
        pageSize: { width: 20, height: 20 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/tshirt/{{color}}_front.png`,
              width: TSHIRT.imageWidth,
              height: TSHIRT.imageHeight
            }
          ],
          printableAreaPx: {
            x: 815 / 2 - 360 / 2,
            y: 948 / 2 - 360 / 2 - 100,
            width: TSHIRT.printWidth,
            height: TSHIRT.printHeight
          }
        }
      },
      {
        id: 'back',
        label: 'Back',
        pageSize: { width: 20, height: 20 },
        mockup: {
          images: [
            {
              uri: `${ASSETS_BASE}/tshirt/{{color}}_back.png`,
              width: TSHIRT.imageWidth,
              height: TSHIRT.imageHeight
            }
          ],
          printableAreaPx: {
            x: 815 / 2 - 360 / 2,
            y: 948 / 2 - 360 / 2 - 100,
            width: TSHIRT.printWidth,
            height: TSHIRT.printHeight
          }
        }
      },
      {
        id: 'left',
        label: 'Left',
        pageSize: { width: 20, height: 20 },
        disabled: true
      },
      {
        id: 'right',
        label: 'Right',
        pageSize: { width: 20, height: 20 },
        disabled: true
      }
    ],
    colors: TSHIRT_COLORS,
    sizes: TSHIRT_SIZES
  }
];
