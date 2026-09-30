import { DEMO_ASSETS_BASE_URL } from '../imgly/demo-assets';

/**
 * CE.SDK Start with Image - Image Catalog
 *
 * Sample images from Unsplash.com (licensed for free use)
 * Original sources:
 * - Mountain: https://unsplash.com/photos/ePpaQC2c1xA
 * - Sea: https://unsplash.com/photos/6qqwAsB22_M
 * - Surf: https://unsplash.com/photos/y-GMWtWW_H8
 */

// ============================================================================
// Types
// ============================================================================

export interface ImageAsset {
  /** Full URL to the image file (1200px) */
  full: string;
  /** URL to the thumbnail image (300px) */
  thumbUri: string;
  /** Alt text description */
  alt: string;
}

// ============================================================================
// Image Catalog
// ============================================================================

// highlight-image-catalog
export const IMAGE_CATALOG: ImageAsset[] = [
  {
    full: `${DEMO_ASSETS_BASE_URL}/assets/images/mountain-1200.jpg`,
    thumbUri: `${DEMO_ASSETS_BASE_URL}/assets/images/mountain-300.jpg`,
    alt: 'Mountain landscape'
  },
  {
    full: `${DEMO_ASSETS_BASE_URL}/assets/images/sea-1200.jpg`,
    thumbUri: `${DEMO_ASSETS_BASE_URL}/assets/images/sea-300.jpg`,
    alt: 'Sea view'
  },
  {
    full: `${DEMO_ASSETS_BASE_URL}/assets/images/surf-1200.jpg`,
    thumbUri: `${DEMO_ASSETS_BASE_URL}/assets/images/surf-300.jpg`,
    alt: 'Surfer riding a wave'
  }
];
// highlight-image-catalog
