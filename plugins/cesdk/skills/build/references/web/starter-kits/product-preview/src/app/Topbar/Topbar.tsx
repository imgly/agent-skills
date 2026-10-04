/**
 * CE.SDK Mockup Editor - Topbar
 *
 * Contains the product selector for switching between product types.
 */

import { ProductSelector } from '../ProductSelector/ProductSelector';
import { PRODUCTS } from '../../constants';

interface TopbarProps {
  currentProductKey: string;
  onProductChange: (productKey: string) => Promise<void>;
  disabled?: boolean;
}

export function Topbar({
  currentProductKey,
  onProductChange,
  disabled = false
}: TopbarProps) {
  return (
    <ProductSelector
      products={PRODUCTS}
      currentProduct={currentProductKey}
      onProductChange={onProductChange}
      disabled={disabled}
    />
  );
}

export { type TopbarProps };
