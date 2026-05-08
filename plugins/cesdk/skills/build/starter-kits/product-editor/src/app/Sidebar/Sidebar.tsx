/**
 * CE.SDK Product Editor - Sidebar Component
 *
 * Container for product selection, color picker, and download link.
 * This is a pure UI component - all CE.SDK operations are handled by App.
 */

import {
  PRODUCT_SAMPLES,
  ProductConfig,
  ProductColor
} from '../product-catalog';
import { ProductGrid } from '../ProductGrid/ProductGrid';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { DownloadLink } from '../DownloadLink/DownloadLink';
import styles from './Sidebar.module.css';

interface SidebarProps {
  productId: string;
  color: ProductColor;
  onProductChange: (product: ProductConfig, color: ProductColor) => void;
  onColorChange: (color: ProductColor) => void;
  onExportRequest: () => void;
}

export function Sidebar({
  productId,
  color,
  onProductChange,
  onColorChange,
  onExportRequest
}: SidebarProps) {
  const product = PRODUCT_SAMPLES.find((sample) => sample.id === productId);

  const handleProductSelect = (selectedProduct: ProductConfig) => {
    if (selectedProduct.id === productId) return;

    const defaultColor =
      selectedProduct.colors.find((color) => color.isDefault) ||
      selectedProduct.colors[0];

    onProductChange(selectedProduct, defaultColor);
  };

  return (
    <aside className={styles.sidebar}>
      <ProductGrid
        products={PRODUCT_SAMPLES}
        selectedId={productId}
        onSelect={handleProductSelect}
      />
      {product && (
        <ColorPicker
          colors={product.colors}
          selectedColor={color}
          onSelect={onColorChange}
        />
      )}
      <DownloadLink onClick={onExportRequest} />
    </aside>
  );
}
