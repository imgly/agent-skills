/**
 * AI Sidebar State (App-Level)
 *
 * The sidebar is a demo playground that lets visitors try every model the
 * IMG.LY AI Gateway exposes. Its state model:
 *
 *   - Seeded from the same `CURATED_MODELS` that `imgly/` ships with, so
 *     the sidebar and the editor boot aligned (`buildInitialSidebarState`).
 *   - Merged with the dynamic gateway catalog once the preflight probe
 *     returns it (`mergeCatalogIntoState`). Curated entries stay selected;
 *     catalog-only models are added unselected.
 *   - Flattened into the shape `AiApps({ providers: … })` expects via
 *     `getSelectedProviders`, which the editor consumes through
 *     `initAi*Editor(cesdk, providerMap)`.
 *
 * This module does no HTTP — the catalog payload is produced upstream by
 * `probeAiCredentials` in `app/ai-credentials` (which authenticates via
 * the shared `resolveAiToken`, so there's only one credential path
 * through the app).
 */

import {
  CURATED_MODELS,
  capabilitiesForMode,
  instantiateGatewayProvider,
  type AiCapability,
  type AiEditorMode
} from '../../imgly';

// ============================================================================
// Types
// ============================================================================

export type EditorMode = AiEditorMode;

export interface AIProviderConfig {
  /** Model ID (e.g. `openai/gpt-4o`), used as a stable key for the entry. */
  modelId: string;
  /** Display name shown in the sidebar. */
  name: string;
  /** Provider/creator label shown beneath the name. */
  label: string;
  /** Whether this provider is active in the editor. */
  selected: boolean;
  /** Factory that returns a provider instance (built lazily). */
  provider: () => any;
}

export interface AIProviderCategory {
  name: string;
  /** Which editor modes this category is available in. */
  supportedModes: EditorMode[];
  providers: AIProviderConfig[];
}

export type AIProviders = Partial<Record<AiCapability, AIProviderCategory>>;

// ============================================================================
// Capability Metadata
// ============================================================================

const CAPABILITY_NAMES: Record<AiCapability, string> = {
  text2text: 'Text to Text',
  text2image: 'Text to Image',
  image2image: 'Image to Image',
  text2video: 'Text to Video',
  image2video: 'Image to Video',
  text2speech: 'Text to Speech',
  text2sound: 'Text to Sound'
};

const CAPABILITY_SUPPORTED_MODES: Record<AiCapability, EditorMode[]> = {
  text2text: ['Design', 'Video'],
  text2image: ['Design', 'Video'],
  image2image: ['Design', 'Video', 'Photo'],
  text2video: ['Video'],
  image2video: ['Video'],
  text2speech: ['Video'],
  text2sound: ['Video']
};

function shortLabelFromId(modelId: string): string {
  const slashIdx = modelId.indexOf('/');
  return slashIdx >= 0 ? modelId.slice(0, slashIdx) : modelId;
}

function makeProviderConfig(
  capability: AiCapability,
  modelId: string,
  selected: boolean,
  name: string | undefined,
  label: string | undefined,
  gatewayUrl: string | undefined
): AIProviderConfig {
  return {
    modelId,
    name: name ?? modelId,
    label: label ?? shortLabelFromId(modelId),
    selected,
    provider: () =>
      instantiateGatewayProvider(capability, modelId, { gatewayUrl })
  };
}

// ============================================================================
// Initial Sidebar State (from imgly CURATED_MODELS)
// ============================================================================

/**
 * Build the sidebar's initial state from the same `CURATED_MODELS` that
 * the editor is mounted with. All curated entries start selected so the
 * sidebar mirrors the editor's active providers on first render.
 *
 * `gatewayUrl` is forwarded to every provider factory so the sidebar's
 * lazily-instantiated providers target the same gateway host the probe
 * verified against.
 */
export function buildInitialSidebarState(
  mode: EditorMode,
  gatewayUrl?: string
): AIProviders {
  const state: AIProviders = {};
  for (const capability of capabilitiesForMode(mode)) {
    const modelIds = CURATED_MODELS[capability];
    if (modelIds == null || modelIds.length === 0) continue;

    state[capability] = {
      name: CAPABILITY_NAMES[capability],
      supportedModes: [...CAPABILITY_SUPPORTED_MODES[capability]],
      providers: modelIds.map((id) =>
        makeProviderConfig(
          capability,
          id,
          true,
          undefined,
          undefined,
          gatewayUrl
        )
      )
    };
  }
  return state;
}

// ============================================================================
// Catalog Merge
// ============================================================================

interface GatewayModel {
  id: string;
  name?: string;
  creator?: string;
}

type ModelsByCapability = Partial<Record<AiCapability, GatewayModel[]>>;

/**
 * Merge a raw gateway catalog payload (as returned by `probeAiCredentials`
 * on success) into the given sidebar state. The user's selection on any
 * model already in `current` is preserved; catalog-only models are added
 * unselected; curated entries not echoed by the catalog are kept so the
 * editor never silently loses a selected provider.
 */
export function mergeCatalogIntoState(
  current: AIProviders,
  payload: unknown,
  mode: EditorMode,
  gatewayUrl?: string
): AIProviders {
  const modelsByCapability = (
    payload != null && typeof payload === 'object' ? payload : {}
  ) as ModelsByCapability;

  const next: AIProviders = {};
  const capabilities = capabilitiesForMode(mode);

  for (const capability of capabilities) {
    const models = modelsByCapability[capability];
    const existing = current[capability];
    const existingById = new Map<string, AIProviderConfig>();
    existing?.providers.forEach((p) => existingById.set(p.modelId, p));

    const providers: AIProviderConfig[] = [];
    if (Array.isArray(models)) {
      for (const model of models) {
        if (!model?.id) continue;
        const kept = existingById.get(model.id);
        providers.push(
          kept
            ? {
                ...kept,
                name: model.name ?? kept.name,
                label: model.creator ?? kept.label
              }
            : makeProviderConfig(
                capability,
                model.id,
                false,
                model.name,
                model.creator,
                gatewayUrl
              )
        );
      }
    }

    // Keep curated entries missing from the catalog response so we never
    // silently drop a selected model out from under the user.
    existing?.providers.forEach((p) => {
      if (!providers.some((q) => q.modelId === p.modelId)) {
        providers.push(p);
      }
    });

    if (providers.length > 0) {
      next[capability] = {
        name: CAPABILITY_NAMES[capability],
        supportedModes: [...CAPABILITY_SUPPORTED_MODES[capability]],
        providers
      };
    } else if (existing) {
      next[capability] = existing;
    }
  }

  return next;
}

// ============================================================================
// Selection → Provider Map
// ============================================================================

/**
 * Flatten the sidebar's toggle state into the shape the AI Apps plugin
 * expects: `{ text2text: [providerInstance], … }`. Only providers with
 * `selected: true` are instantiated.
 */
export function getSelectedProviders(
  providers: AIProviders
): Partial<Record<AiCapability, any[]>> {
  const result: Partial<Record<AiCapability, any[]>> = {};

  for (const [key, category] of Object.entries(providers)) {
    if (!category) continue;
    const selected = category.providers
      .filter((p) => p.selected)
      .map((p) => p.provider());
    if (selected.length > 0) {
      result[key as AiCapability] = selected;
    }
  }

  return result;
}
