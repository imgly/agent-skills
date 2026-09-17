/**
 * Multi-Image Generation App - Restaurant Catalog
 *
 * Demo restaurant data for template personalization.
 */

import type { Restaurant } from '../imgly';
import { DEMO_ASSETS_BASE_URL } from '../imgly/demo-assets';
export { DEMO_ASSETS_BASE_URL };

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
