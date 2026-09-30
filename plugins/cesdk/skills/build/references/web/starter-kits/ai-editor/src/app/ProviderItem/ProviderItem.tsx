/**
 * Provider Item Component
 *
 * Individual provider checkbox item within a category section.
 */

import type { ChangeEvent, MouseEvent } from 'react';
import { useCallback } from 'react';
import classNames from 'classnames';

import styles from '../Sidebar/Sidebar.module.css';

// ============================================================================
// Types
// ============================================================================

export interface ProviderItemProps {
  sectionKey: string;
  provider: { name: string; label: string; selected: boolean };
  index: number;
  onToggle: (sectionKey: string, providerIndex: number) => void;
}

// ============================================================================
// Component
// ============================================================================

export function ProviderItem({
  sectionKey,
  provider,
  index,
  onToggle
}: ProviderItemProps) {
  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      onToggle(sectionKey, index);
    },
    [sectionKey, index, onToggle]
  );

  const handleLabelClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  const checkboxId = `provider-${sectionKey}-${index}`;

  return (
    <div
      className={classNames(styles.providerItem, {
        [styles.selected]: provider.selected
      })}
    >
      <label
        htmlFor={checkboxId}
        className={styles.checkbox}
        onClick={handleLabelClick}
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={provider.selected}
          onChange={handleCheckboxChange}
        />
        <span className={styles.checkmark} />
        <div className={styles.providerInfo}>
          <span className={styles.providerName}>{provider.name}</span>
          <span className={styles.providerLabel}>{provider.label}</span>
        </div>
      </label>
    </div>
  );
}
