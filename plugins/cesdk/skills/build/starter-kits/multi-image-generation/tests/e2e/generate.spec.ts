import { expect, test } from '@imgly/kit-test-harness';

import {
  MultiImageGenerationKit,
  RESTAURANT_NAMES,
  TEMPLATE_LABELS
} from './kit';

test.describe('Restaurant selection', () => {
  test('MIG-01 default state', async ({ page }) => {
    const kit = await MultiImageGenerationKit.open(page);

    for (const name of RESTAURANT_NAMES) {
      await expect(kit.restaurantButton(name)).toBeEnabled();
      await expect(kit.restaurantButton(name)).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    }

    for (const label of TEMPLATE_LABELS) {
      await expect(kit.card(label)).toBeVisible();
    }

    // Nothing is generated yet, so every card still shows its placeholder.
    for (const src of await kit.cardSources()) {
      expect(src).toMatch(/\/images\/placeholder-\d\.png$/);
    }
  });

  test('MIG-02 generate for each restaurant', async ({ page }) => {
    const kit = await MultiImageGenerationKit.open(page);
    const rendered: string[][] = [];

    for (const name of RESTAURANT_NAMES) {
      const previous = await kit.cardSources();
      await kit.selectRestaurant(name);

      await expect(kit.restaurantButton(name)).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      for (const other of RESTAURANT_NAMES.filter((it) => it !== name)) {
        await expect(kit.restaurantButton(other)).toHaveAttribute(
          'aria-pressed',
          'false'
        );
      }

      await kit.waitForGenerated(previous);
      const sources = await kit.cardSources();
      for (const src of sources) {
        expect(src).toMatch(/^blob:/);
      }
      rendered.push(sources as string[]);
    }

    // Each restaurant produces its own three assets.
    const all = rendered.flat();
    expect(new Set(all).size).toBe(all.length);
  });

  test('MIG-02b every restaurant button is disabled while generating', async ({
    page
  }) => {
    const kit = await MultiImageGenerationKit.open(page);

    await kit.selectRestaurant(RESTAURANT_NAMES[0]);
    for (const name of RESTAURANT_NAMES) {
      await expect(kit.restaurantButton(name)).toBeDisabled();
    }

    await kit.waitForGenerated();
    for (const name of RESTAURANT_NAMES) {
      await expect(kit.restaurantButton(name)).toBeEnabled();
    }
  });

  test('MIG-03 deselecting a restaurant empties the cards', async ({
    page
  }) => {
    const kit = await MultiImageGenerationKit.open(page);

    await kit.selectRestaurant(RESTAURANT_NAMES[0]);
    await kit.waitForGenerated();

    await kit.selectRestaurant(RESTAURANT_NAMES[0]);

    await expect(kit.restaurantButton(RESTAURANT_NAMES[0])).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    for (const src of await kit.cardSources()) {
      expect(src).toMatch(/\/images\/placeholder-\d\.png$/);
    }
  });
});
