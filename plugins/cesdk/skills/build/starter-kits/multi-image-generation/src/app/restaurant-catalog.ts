/**
 * Multi-Image Generation App - Restaurant Catalog
 *
 * Demo restaurant data for template personalization.
 */

import type { Restaurant } from '../imgly';

/**
 * Demo assets for this example (images, scenes, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.80.0-rc.1/starterkit-multi-image-generation';

/**
 * Demo restaurants with brand colors and assets.
 */
export const RESTAURANTS: Restaurant[] = [
  {
    name: 'Bean there Bean good',
    photoPath: `${DEMO_ASSETS_BASE_URL}/images/photo-bean.png`,
    price: '$$',
    reviewCount: 281,
    rating: 1,
    cardPath: `${DEMO_ASSETS_BASE_URL}/images/card-bean.png`,
    logoPath: `${DEMO_ASSETS_BASE_URL}/images/logo-bean.png`,
    primaryColor: '#050087',
    secondaryColor: '#F1E1C7'
  },
  {
    name: 'Scoop there it is',
    photoPath: `${DEMO_ASSETS_BASE_URL}/images/photo-scoop.png`,
    price: '$',
    reviewCount: 114,
    rating: 5,
    cardPath: `${DEMO_ASSETS_BASE_URL}/images/card-scoop.png`,
    logoPath: `${DEMO_ASSETS_BASE_URL}/images/logo-scoop.png`,
    primaryColor: '#EB11D5',
    secondaryColor: '#85EAD1'
  },
  {
    name: 'BUN intended',
    photoPath: `${DEMO_ASSETS_BASE_URL}/images/photo-bun.png`,
    price: '$$$',
    reviewCount: 65,
    rating: 3,
    cardPath: `${DEMO_ASSETS_BASE_URL}/images/card-bun.png`,
    logoPath: `${DEMO_ASSETS_BASE_URL}/images/logo-bun.png`,
    primaryColor: '#2E573E',
    secondaryColor: '#E4A341'
  }
];
