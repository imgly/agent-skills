import type { VariantImage } from '../../imgly';
import { VariantCard } from '../VariantCard/VariantCard';

import styles from './VariantsSection.module.css';

interface VariantsSectionProps {
  variants: VariantImage[];
  onEdit: (variant: VariantImage) => void;
  onDownload: (variant: VariantImage) => void;
}

export function VariantsSection({
  variants,
  onEdit,
  onDownload
}: VariantsSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4 className={styles.title}>Generated Variants</h4>
        <p className={styles.description}>
          Can be edited individually to better fit the different form factors.
        </p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {variants.map((variant) => (
            <VariantCard
              key={variant.size.id}
              variant={variant}
              onEdit={() => onEdit(variant)}
              onDownload={() => onDownload(variant)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
