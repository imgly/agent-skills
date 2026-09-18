// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import RestaurantSelector from '../../src/app/RestaurantSelector/RestaurantSelector';
import { RESTAURANTS } from '../../src/app/restaurant-catalog';

function renderSelector(
  overrides: Partial<React.ComponentProps<typeof RestaurantSelector>> = {}
) {
  const props: React.ComponentProps<typeof RestaurantSelector> = {
    restaurants: RESTAURANTS,
    selectedRestaurant: null,
    disabled: false,
    onSelect: vi.fn(),
    ...overrides
  };
  render(<RestaurantSelector {...props} />);
  return props;
}

// MIG-C2
describe('RestaurantSelector', () => {
  it('offers one unpressed button per restaurant', () => {
    renderSelector();

    for (const restaurant of RESTAURANTS) {
      const button = screen.getByRole('button', { name: restaurant.name });
      expect(button.getAttribute('aria-pressed')).toBe('false');
      expect(button.getAttribute('disabled')).toBeNull();
    }
  });

  it('presses only the selected restaurant', () => {
    renderSelector({ selectedRestaurant: RESTAURANTS[1] });

    expect(
      RESTAURANTS.map((restaurant) =>
        screen
          .getByRole('button', { name: restaurant.name })
          .getAttribute('aria-pressed')
      )
    ).toEqual(['false', 'true', 'false']);
  });

  it('selects a restaurant and deselects the one already chosen', async () => {
    const user = userEvent.setup();
    const first = renderSelector();

    await user.click(screen.getByRole('button', { name: RESTAURANTS[0].name }));
    expect(first.onSelect).toHaveBeenCalledWith(RESTAURANTS[0]);

    const second = renderSelector({ selectedRestaurant: RESTAURANTS[0] });
    await user.click(
      screen.getAllByRole('button', { name: RESTAURANTS[0].name })[1]
    );
    expect(second.onSelect).toHaveBeenCalledWith(null);
  });

  it('disables every button while a generation runs', () => {
    renderSelector({ disabled: true });

    for (const restaurant of RESTAURANTS) {
      expect(
        (
          screen.getByRole('button', {
            name: restaurant.name
          }) as HTMLButtonElement
        ).disabled
      ).toBe(true);
    }
  });
});
