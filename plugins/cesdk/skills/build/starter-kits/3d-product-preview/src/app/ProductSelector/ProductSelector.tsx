/**
 * CE.SDK Mockup Editor - Product Selector (Topbar)
 *
 * Renders a segmented control for selecting product types.
 */

/**
 * Product configuration for 3D mockup editor.
 */
export interface Product {
  /** Display label for the product */
  label: string;
  /** Folder name containing product assets */
  assetsFolderName: string;
  /** Material index for base color texture */
  baseColorTextureIndex: number;
  /** Camera orbit position for 3D view */
  cameraOrbit: string;
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
