/**
 * CE.SDK Mockup Editor - Product Selector (Topbar)
 *
 * Renders a segmented control for selecting product types.
 */

/**
 * Product configuration with design and mockup scene paths.
 */
export interface Product {
  /** Display label for the product */
  label: string;
  /** Path to the design scene file (user-editable) */
  scenePath: string;
  /** Path to the mockup scene file (for rendering) */
  mockupScenePath: string;
}

import classNames from 'classnames';
import styles from './ProductSelector.module.css';

// ============================================================================
// Types
// ============================================================================

interface ProductSelectorProps {
  products: Record<string, Product>;
  currentProduct: string;
  onProductChange: (productKey: string) => Promise<void>;
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ProductSelector({
  products,
  currentProduct,
  onProductChange,
  disabled = false
}: ProductSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.segmentedControl}>
        {Object.entries(products).map(([key, product]) => (
          <button
            key={key}
            className={classNames(styles.button, {
              [styles.active]: key === currentProduct
            })}
            disabled={disabled}
            onClick={() => {
              if (key !== currentProduct) {
                onProductChange(key);
              }
            }}
          >
            {product.label}
          </button>
        ))}
      </div>
    </div>
  );
}
