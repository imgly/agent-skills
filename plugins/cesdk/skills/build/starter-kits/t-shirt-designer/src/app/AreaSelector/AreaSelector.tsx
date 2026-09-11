/**
 * CE.SDK T-Shirt Designer - Area Selector Component
 *
 * Segmented control for selecting Front/Back areas with preview card.
 */

import classNames from 'classnames';
import { ProductAreaConfig } from '../product-catalog';
import styles from './AreaSelector.module.css';

interface AreaSelectorProps {
  areas: ProductAreaConfig[];
  selectedAreaId: string;
  colorId: string;
  onSelect: (areaId: string) => void;
}

export function AreaSelector({
  areas,
  selectedAreaId,
  colorId,
  onSelect
}: AreaSelectorProps) {
  return (
    <section className={styles.section}>
      <div className={styles.title}>Decorations</div>

      {/* Segmented Control */}
      <div className={styles.selector}>
        {areas.map((area) => (
          <button
            key={area.id}
            className={classNames(styles.button, {
              [styles.active]: area.id === selectedAreaId
            })}
            disabled={area.disabled}
            onClick={() => !area.disabled && onSelect(area.id)}
          >
            {area.label}
          </button>
        ))}
      </div>

      {/* Print Details Card */}
      <div className={styles.details}>
        <img
          className={styles.preview}
          src={`assets/products/tshirt/${colorId}_${selectedAreaId}.png`}
          alt={`${colorId} t-shirt ${selectedAreaId}`}
        />
        <div className={styles.info}>
          <div>
            <p className={styles.label}>Print Area</p>
            <p className={styles.value}>Width 249mm</p>
            <p className={styles.value}>Height 265mm</p>
          </div>
          <div>
            <p className={styles.label}>Print Method</p>
            <p className={styles.value}>Digital Printing</p>
          </div>
        </div>
      </div>
    </section>
  );
}
