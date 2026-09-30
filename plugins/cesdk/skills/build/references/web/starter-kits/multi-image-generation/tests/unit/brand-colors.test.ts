import type { CreativeEngine } from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

import { applyRestaurantColors } from '../../src/imgly/generation';
import type { Restaurant } from '../../src/imgly/types';

const RESTAURANT: Restaurant = {
  name: 'Bean there Bean good',
  photoPath: '/assets/photo.png',
  logoPath: '/assets/logo.png',
  cardPath: '/assets/card.png',
  price: '$$',
  reviewCount: 281,
  rating: 1,
  primaryColor: '#050087',
  secondaryColor: '#F1E1C7'
};

describe('MIG-U12 applyRestaurantColors', () => {
  it('leaves a text block the engine reports no colour for alone', async () => {
    const setTextColor = vi.fn();
    const engine = {
      variable: { setString: vi.fn() },
      block: {
        findAll: () => [1],
        getType: () => '//ly.img.ubq/text',
        getTextColors: () => [],
        setTextColor,
        supportsFill: () => false
      }
    } as unknown as CreativeEngine;

    await applyRestaurantColors(engine, RESTAURANT);

    expect(setTextColor).not.toHaveBeenCalled();
  });
});
