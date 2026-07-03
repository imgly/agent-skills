/**
 * CE.SDK T-Shirt Designer - Color Picker Component
 *
 * Displays color swatches for selecting t-shirt colors.
 */

import classNames from 'classnames';
import { ProductColor } from '../product-catalog';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelect: (color: ProductColor) => void;
}

export function ColorPicker({
  colors,
  selectedColor,
  onSelect
}: ColorPickerProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Color</h3>
      <div className={styles.colors}>
        {colors.map((color) => (
          <div
            key={color.id}
            className={classNames(styles.wrapper, {
              [styles.active]: color.id === selectedColor.id
            })}
          >
            <button
              className={styles.button}
              style={{ backgroundColor: color.colorHex }}
              title={color.id.charAt(0).toUpperCase() + color.id.slice(1)}
              onClick={() => onSelect(color)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
