/**
 * CE.SDK Product Editor - Product Grid Component
 *
 * Displays a grid of product buttons for selection.
 */

import classNames from 'classnames';
import { ProductConfig } from '../product-catalog';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: ProductConfig[];
  selectedId: string;
  onSelect: (product: ProductConfig) => void;
}

export function ProductGrid({
  products,
  selectedId,
  onSelect
}: ProductGridProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Product</h3>
      <div className={styles.grid}>
        {products.map((product) => (
          <button
            key={product.id}
            className={classNames(styles.button, {
              [styles.active]: product.id === selectedId
            })}
            title={product.label}
            onClick={() => onSelect(product)}
          >
            <img
              className={styles.thumbnail}
              src={`${import.meta.env.BASE_URL}assets/products/${product.id}/thumbnail.png`}
              alt={product.label}
              draggable={false}
            />
            <span className={styles.label}>{product.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
