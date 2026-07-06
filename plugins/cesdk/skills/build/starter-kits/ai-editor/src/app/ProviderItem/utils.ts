/**
 * Provider Utility Functions
 *
 * Helper functions for provider state management.
 */

import type { AIProviders } from '../ai-sidebar';

/**
 * Deep clone the providers object to avoid mutations.
 * Preserves function references for the `provider` field.
 */
export function deepCloneProviders(obj: AIProviders): AIProviders {
  const result: AIProviders = {};

  for (const [key, category] of Object.entries(obj)) {
    if (category) {
      result[key as keyof AIProviders] = {
        name: category.name,
        supportedModes: [...(category.supportedModes || [])],
        providers: category.providers.map((providerConfig) => ({
          modelId: providerConfig.modelId,
          name: providerConfig.name,
          label: providerConfig.label,
          selected: providerConfig.selected,
          provider: providerConfig.provider
        }))
      };
    }
  }

  return result;
}

/**
 * Check if there are unsaved changes between local and original providers.
 */
export function hasChanges(
  localProviders: AIProviders,
  originalProviders: AIProviders
): boolean {
  for (const key of Object.keys(localProviders)) {
    const localCategory = localProviders[key as keyof AIProviders];
    const originalCategory = originalProviders[key as keyof AIProviders];

    if (!localCategory || !originalCategory) continue;

    for (let index = 0; index < localCategory.providers.length; index++) {
      if (
        localCategory.providers[index].selected !==
        originalCategory.providers[index].selected
      ) {
        return true;
      }
    }
  }
  return false;
}
