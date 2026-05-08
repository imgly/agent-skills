/**
 * CE.SDK T-Shirt Designer - Add to Cart Component
 *
 * Button showing total price and add to cart action.
 */

import styles from './AddToCart.module.css';

interface AddToCartProps {
  totalPrice: number;
  totalQuantity: number;
  onClick: () => void;
}

export function AddToCart({
  totalPrice,
  totalQuantity,
  onClick
}: AddToCartProps) {
  return (
    <section className={styles.section}>
      <button
        className={styles.button}
        disabled={totalQuantity <= 0}
        onClick={onClick}
      >
        {totalPrice.toFixed(2).replace('.', ',')} € • Add to Cart
      </button>
    </section>
  );
}
