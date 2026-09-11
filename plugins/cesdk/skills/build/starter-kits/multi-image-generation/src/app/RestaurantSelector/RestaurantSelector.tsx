import classNames from 'classnames';

import type { Restaurant } from '../types';
import { resolveAssetPath } from '../resolveAssetPath';

import styles from './RestaurantSelector.module.css';

interface RestaurantSelectorProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  disabled: boolean;
  onSelect: (restaurant: Restaurant | null) => void;
}

export default function RestaurantSelector({
  restaurants,
  selectedRestaurant,
  disabled,
  onSelect
}: RestaurantSelectorProps) {
  const handleClick = (restaurant: Restaurant) => {
    if (selectedRestaurant?.name === restaurant.name) {
      onSelect(null);
    } else {
      onSelect(restaurant);
    }
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Select Restaurant</h3>
      <div className={styles.buttons}>
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.name}
            className={classNames(styles.button, {
              [styles.selected]: selectedRestaurant?.name === restaurant.name
            })}
            style={{ backgroundColor: restaurant.secondaryColor }}
            disabled={disabled}
            onClick={() => handleClick(restaurant)}
          >
            <img
              src={resolveAssetPath(restaurant.cardPath)}
              alt={restaurant.name}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
