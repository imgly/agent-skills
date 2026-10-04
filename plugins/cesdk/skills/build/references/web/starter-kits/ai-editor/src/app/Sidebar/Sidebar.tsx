/**
 * AI Provider Sidebar - Provider Selection Component
 *
 * Displays a sidebar panel that allows users to select/deselect AI providers.
 * Converted from vanilla TypeScript class to React functional component.
 */

import { useCallback, useEffect, useState } from 'react';

import type { AIProviderCategory, AIProviders } from '../ai-sidebar';
import { deepCloneProviders, hasChanges } from '../ProviderItem/utils';
import { Section } from '../Section/Section';
import styles from './Sidebar.module.css';

// ============================================================================
// Types
// ============================================================================

export interface SidebarProps {
  providers: AIProviders;
  onApplyChanges: (providers: AIProviders) => void;
}

// ============================================================================
// Component
// ============================================================================

export function Sidebar({ providers, onApplyChanges }: SidebarProps) {
  // Local state for editing providers
  const [localProviders, setLocalProviders] = useState<AIProviders>(() =>
    deepCloneProviders(providers)
  );

  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Sync local providers when external providers change
  useEffect(() => {
    setLocalProviders(deepCloneProviders(providers));
  }, [providers]);

  // Check for unsaved changes
  const isDirty = hasChanges(localProviders, providers);

  // Toggle section expanded/collapsed state
  const handleToggleSection = useCallback((sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  // Toggle provider selected state
  const handleToggleProvider = useCallback(
    (sectionKey: string, providerIndex: number) => {
      setLocalProviders((prev) => {
        const cloned = deepCloneProviders(prev);
        const section = cloned[sectionKey as keyof AIProviders];
        if (section && section.providers[providerIndex]) {
          section.providers[providerIndex].selected =
            !section.providers[providerIndex].selected;
        }
        return cloned;
      });
    },
    []
  );

  // Apply changes
  const handleApplyChanges = useCallback(() => {
    onApplyChanges(localProviders);
  }, [localProviders, onApplyChanges]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>AI Models</div>
        <p className={styles.subtitle}>
          Bring your own models. CE.SDK lets you integrate your model of choice.
        </p>
      </div>

      <div className={styles.sectionsContainer}>
        {Object.entries(localProviders).map(([key, section]) => (
          <Section
            key={key}
            sectionKey={key}
            section={section as AIProviderCategory}
            isExpanded={!!expandedSections[key]}
            onToggleSection={handleToggleSection}
            onToggleProvider={handleToggleProvider}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.applyButton}
          disabled={!isDirty}
          onClick={handleApplyChanges}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}
