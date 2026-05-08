/**
 * CE.SDK T-Shirt Designer - Sidebar Component
 *
 * Container for t-shirt configuration: area selector, color picker,
 * size/quantity inputs, and cart functionality.
 * This is a pure UI component - all CE.SDK operations are handled by App.
 */

import { useState } from 'react';
import { PRODUCT_SAMPLES, ProductColor } from '../product-catalog';
import { AreaSelector } from '../AreaSelector/AreaSelector';
import { ColorPicker } from '../ColorPicker/ColorPicker';
import { SizeQuantity } from '../SizeQuantity/SizeQuantity';
import { AddToCart } from '../AddToCart/AddToCart';
import { DownloadLink } from '../DownloadLink/DownloadLink';
import styles from './Sidebar.module.css';

interface SidebarProps {
  areaId: string;
  color: ProductColor;
  onAreaChange: (areaId: string) => void;
  onColorChange: (color: ProductColor) => void;
  onExportRequest: () => void;
  onAddToCart: (data: {
    totalQuantity: number;
    totalPrice: number;
    quantities: Map<string, number>;
  }) => void;
}

export function Sidebar({
  areaId,
  color,
  onAreaChange,
  onColorChange,
  onExportRequest,
  onAddToCart
}: SidebarProps) {
  const product = PRODUCT_SAMPLES[0]; // Single product: t-shirt

  // Initialize quantities (M and L start at 1, others at 0)
  const [quantities, setQuantities] = useState<Map<string, number>>(() => {
    const initial = new Map<string, number>();
    product.sizes?.forEach((size) => {
      initial.set(size.id, ['M', 'L'].includes(size.id) ? 1 : 0);
    });
    return initial;
  });

  const handleQuantityChange = (sizeId: string, value: number) => {
    setQuantities((prev) => {
      const next = new Map(prev);
      next.set(sizeId, value);
      return next;
    });
  };

  const getTotalQuantity = () => {
    let total = 0;
    quantities.forEach((qty) => (total += qty));
    return total;
  };

  const getTotalPrice = () => {
    return (product.unitPrice || 0) * getTotalQuantity();
  };

  const handleAddToCart = () => {
    onAddToCart({
      totalQuantity: getTotalQuantity(),
      totalPrice: getTotalPrice(),
      quantities: new Map(quantities)
    });
  };

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.brand}>Apparell Essentials</p>
          <h3 className={styles.productName}>{product.label}</h3>
        </div>
        <div className={styles.priceWrapper}>
          <h5 className={styles.price}>
            From {(product.unitPrice || 0).toFixed(2).replace('.', ',')} €
          </h5>
          <p className={styles.priceNote}>+ Additional Fees</p>
        </div>
      </div>

      {/* Decorations (Area Selector) */}
      <AreaSelector
        areas={product.areas}
        selectedAreaId={areaId}
        colorId={color.id}
        onSelect={onAreaChange}
      />

      {/* Color Picker */}
      <ColorPicker
        colors={product.colors}
        selectedColor={color}
        onSelect={onColorChange}
      />

      {/* Size & Quantity */}
      <SizeQuantity
        sizes={product.sizes || []}
        quantities={quantities}
        onChange={handleQuantityChange}
      />

      {/* Add to Cart */}
      <AddToCart
        totalPrice={getTotalPrice()}
        totalQuantity={getTotalQuantity()}
        onClick={handleAddToCart}
      />

      {/* Download Link */}
      <DownloadLink onClick={onExportRequest} />
    </aside>
  );
}
