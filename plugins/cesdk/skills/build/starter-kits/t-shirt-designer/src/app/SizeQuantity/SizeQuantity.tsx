/**
 * CE.SDK T-Shirt Designer - Size & Quantity Component
 *
 * Horizontal layout for size/quantity inputs.
 */

import { ProductSize } from '../product-catalog';
import styles from './SizeQuantity.module.css';

interface SizeQuantityProps {
  sizes: ProductSize[];
  quantities: Map<string, number>;
  onChange: (sizeId: string, value: number) => void;
}

export function SizeQuantity({
  sizes,
  quantities,
  onChange
}: SizeQuantityProps) {
  const handleChange = (sizeId: string, value: string) => {
    let num = parseInt(value) || 0;
    if (num < 0) num = 0;
    onChange(sizeId, num);
  };

  return (
    <section className={styles.section}>
      <div className={styles.title}>Size & Quantity</div>
      <div className={styles.sizes}>
        {sizes.map((size) => (
          <div key={size.id} className={styles.column}>
            <p className={styles.label}>{size.id}</p>
            <input
              type="number"
              min="0"
              className={styles.input}
              value={quantities.get(size.id) || 0}
              onChange={(e) => handleChange(size.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
