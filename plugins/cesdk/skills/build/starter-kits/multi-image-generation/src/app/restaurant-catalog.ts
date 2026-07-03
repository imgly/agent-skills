/**
 * Multi-Image Generation App - Restaurant Catalog
 *
 * Demo restaurant data for template personalization.
 */

import type { Restaurant } from './types';

/**
 * Demo restaurants with brand colors and assets.
 */
export const RESTAURANTS: Restaurant[] = [
  {
    name: 'Bean there Bean good',
    photoPath: '/images/photo-bean.png',
    price: '$$',
    reviewCount: 281,
    rating: 1,
    cardPath: '/images/card-bean.png',
    logoPath: '/images/logo-bean.png',
    primaryColor: '#050087',
    secondaryColor: '#F1E1C7'
  },
  {
    name: 'Scoop there it is',
    photoPath: '/images/photo-scoop.png',
    price: '$',
    reviewCount: 114,
    rating: 5,
    cardPath: '/images/card-scoop.png',
    logoPath: '/images/logo-scoop.png',
    primaryColor: '#EB11D5',
    secondaryColor: '#85EAD1'
  },
  {
    name: 'BUN intended',
    photoPath: '/images/photo-bun.png',
    price: '$$$',
    reviewCount: 65,
    rating: 3,
    cardPath: '/images/card-bun.png',
    logoPath: '/images/logo-bun.png',
    primaryColor: '#2E573E',
    secondaryColor: '#E4A341'
  }
];
