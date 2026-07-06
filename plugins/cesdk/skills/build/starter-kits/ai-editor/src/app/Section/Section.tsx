/**
 * Section Component
 *
 * Collapsible category section containing provider items.
 */

import { useCallback } from 'react';
import classNames from 'classnames';

import type { AIProviderCategory } from '../ai-sidebar';
import { ProviderItem } from '../ProviderItem/ProviderItem';
import styles from '../Sidebar/Sidebar.module.css';

// ============================================================================
// Types
// ============================================================================

export interface SectionProps {
  sectionKey: string;
  section: AIProviderCategory;
  isExpanded: boolean;
  onToggleSection: (sectionKey: string) => void;
  onToggleProvider: (sectionKey: string, providerIndex: number) => void;
}

// ============================================================================
// Component
// ============================================================================

export function Section({
  sectionKey,
  section,
  isExpanded,
  onToggleSection,
  onToggleProvider
}: SectionProps) {
  const selectedCount = section.providers.filter(
    (provider) => provider.selected
  ).length;
  const totalCount = section.providers.length;

  const handleHeaderClick = useCallback(() => {
    onToggleSection(sectionKey);
  }, [sectionKey, onToggleSection]);

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={handleHeaderClick}
        aria-expanded={isExpanded}
      >
        <div className={styles.sectionTitle}>
          <span
            className={classNames(styles.expandIcon, {
              [styles.expanded]: isExpanded
            })}
          />
          <span>{section.name}</span>
        </div>
        <span className={styles.sectionCount}>
          {selectedCount}/{totalCount}
        </span>
      </button>

      {isExpanded && (
        <div className={styles.sectionContent}>
          {section.providers.map((provider, index) => (
            <ProviderItem
              key={provider.name}
              sectionKey={sectionKey}
              provider={provider}
              index={index}
              onToggle={onToggleProvider}
            />
          ))}
        </div>
      )}
    </div>
  );
}
