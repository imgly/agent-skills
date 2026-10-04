/**
 * Curated AI Provider Defaults
 *
 * Returns a small, hand-picked set of `GatewayProvider` instances — one per
 * capability supported by the given editor mode. This is the shape that
 * `AiApps({ providers: … })` expects; pass it straight to `AiAppsConfig`.
 *
 * TODO — swap these defaults for the models you want to ship with. All
 * model IDs below are valid arguments to the corresponding `GatewayProvider`
 * — any id returned by `GET https://gateway.img.ly/v1/models` will work.
 *
 *   - Discover models in your dashboard: https://img.ly/dashboard
 *   - Gateway provider pattern (auth, token action, middleware):
 *     https://img.ly/docs/cesdk/js/user-interface/ai-integration/gateway-provider-06df22/
 *
 * ⚠️  Production token flow
 *
 * Gateway providers invoke the `ly.img.ai.getToken` action before every
 * generation request. This file does not register that action — the
 * embedding application is responsible. Two common flows:
 *
 *   1. `{ dangerouslyExposeApiKey: '…' }` — forwards a raw IMG.LY
 *      dashboard key to the browser. **DEMO / LOCAL DEV ONLY**;
 *      never ship a production build with this path active.
 *
 *   2. `return <jwt>` — the recommended production flow. Your backend
 *      mints a short-lived JWT scoped to the current session, the
 *      action fetches it, and the key never touches the browser.
 *
 * Register the action on the `CE.SDK` instance before calling
 * `initAi{Design,Photo,Video}Editor`.
 */

import { GatewayProvider as AudioGatewayProvider } from '@imgly/plugin-ai-audio-generation-web/gateway';
import { GatewayProvider as ImageGatewayProvider } from '@imgly/plugin-ai-image-generation-web/gateway';
import { GatewayProvider as TextGatewayProvider } from '@imgly/plugin-ai-text-generation-web/gateway';
import { GatewayProvider as VideoGatewayProvider } from '@imgly/plugin-ai-video-generation-web/gateway';

// ============================================================================
// Gateway Configuration
// ============================================================================

/**
 * Shared configuration for every `GatewayProvider`. `tokenActionId`
 * defaults to `ly.img.ai.getToken`; register that action on the cesdk
 * instance before initializing the AI editor.
 *
 * `gatewayUrl` defaults to the production gateway inside the underlying
 * plugin. Callers override it via the `options.gatewayUrl` argument on
 * `instantiateGatewayProvider` / `createAIProviders` — the app shell uses
 * that to point at staging during local-dev testing.
 */
const baseGatewayConfig = {
  debug: false
};

function buildGatewayConfig(gatewayUrl: string | undefined) {
  if (gatewayUrl == null || gatewayUrl.length === 0) return baseGatewayConfig;
  return { ...baseGatewayConfig, gatewayUrl };
}

export interface GatewayProviderOptions {
  /**
   * Override the gateway URL used by this provider. Leave unset to use
   * the plugin default (the production gateway). Forwarded verbatim to
   * the underlying `GatewayProvider` factory.
   */
  gatewayUrl?: string;
}

// ============================================================================
// Types
// ============================================================================

export type AiEditorMode = 'Design' | 'Photo' | 'Video';

/**
 * Capability identifiers. Keep in sync with the dynamic catalog shape in
 * `app/ai-sidebar/catalog.ts` — both modules share the same capability
 * vocabulary.
 */
export type AiCapability =
  | 'text2text'
  | 'text2image'
  | 'image2image'
  | 'text2video'
  | 'image2video'
  | 'text2speech'
  | 'text2sound';

/**
 * Provider map passed to `AiApps({ providers: … })`. Keys are capability
 * identifiers; values are one provider instance or an array of providers
 * for model-selection UIs.
 */
export type AiProviderMap = Partial<Record<AiCapability, any[]>>;

// ============================================================================
// Curated Model Selection
// ============================================================================

/**
 * Which capabilities are available in which editor modes.
 *
 * Photo mode is image-editing-focused so it skips text/video/audio.
 * Design mode skips video+audio (it targets static output).
 */
const CAPABILITIES_BY_MODE: Record<AiEditorMode, AiCapability[]> = {
  Design: ['text2text', 'text2image', 'image2image'],
  Photo: ['image2image'],
  Video: [
    'text2text',
    'text2image',
    'image2image',
    'text2video',
    'image2video',
    'text2speech',
    'text2sound'
  ]
};

/**
 * Curated default model IDs — one per capability. Exported so the app
 * shell (e.g. the sidebar) can seed its initial state from the same
 * source of truth used by `createAIProviders`.
 *
 * Discover all available model IDs: `GET https://gateway.img.ly/v1/models`.
 * IDs below were chosen as balanced mid-tier defaults for each capability;
 * swap them for whatever best fits your product.
 *
 * `text2sound` intentionally ships empty: the gateway doesn't expose a
 * text-to-sound-effect model in the catalog today. Populate it when a
 * sound-effect model becomes available and the Video editor will wire
 * it up automatically.
 */
export const CURATED_MODELS: Record<AiCapability, string[]> = {
  text2text: ['anthropic/claude-sonnet-4.6'],
  text2image: ['bfl/flux-2'],
  image2image: ['bfl/flux-2-edit'],
  text2video: ['google/veo-3.1-fast'],
  image2video: ['google/veo-3.1-fast-i2v'],
  text2speech: ['elevenlabs/eleven-v3-tts'],
  text2sound: []
};

/**
 * Instantiate a gateway provider for a given capability + model ID.
 *
 * Shared by `createAIProviders` below and by the app-level dynamic
 * catalog (so both resolution paths produce provider instances with the
 * same gateway config and quick-action setup).
 */
export function instantiateGatewayProvider(
  capability: AiCapability,
  modelId: string,
  options: GatewayProviderOptions = {}
): any {
  const gatewayConfig = buildGatewayConfig(options.gatewayUrl);
  switch (capability) {
    case 'text2text':
      return TextGatewayProvider(modelId, gatewayConfig);
    case 'text2image':
      return ImageGatewayProvider(modelId, gatewayConfig);
    case 'image2image':
      // Quick actions for image2image are derived from the model's
      // schema capability — no explicit `quickActions` argument needed.
      return ImageGatewayProvider(modelId, gatewayConfig);
    case 'text2video':
      return VideoGatewayProvider(modelId, gatewayConfig);
    case 'image2video':
      // Quick actions for image2video are derived from the model's
      // schema capability — no explicit `quickActions` argument needed.
      return VideoGatewayProvider(modelId, gatewayConfig);
    case 'text2speech':
    case 'text2sound':
      return AudioGatewayProvider(modelId, gatewayConfig);
    default: {
      const exhaustive: never = capability;
      throw new Error(`Unknown capability: ${String(exhaustive)}`);
    }
  }
}

/**
 * Build the default provider map for the given editor mode, assembled
 * from `CURATED_MODELS` filtered by `CAPABILITIES_BY_MODE`.
 */
export function createAIProviders(
  mode: AiEditorMode,
  options: GatewayProviderOptions = {}
): AiProviderMap {
  const providers: AiProviderMap = {};
  for (const capability of CAPABILITIES_BY_MODE[mode]) {
    const modelIds = CURATED_MODELS[capability];
    if (modelIds == null || modelIds.length === 0) continue;
    providers[capability] = modelIds.map((id) =>
      instantiateGatewayProvider(capability, id, options)
    );
  }
  return providers;
}

/**
 * Which capabilities are active for a given editor mode. Exposed for
 * app-level code that needs to mirror the mode → capabilities mapping
 * (e.g. the sidebar filtering the dynamic catalog).
 */
export function capabilitiesForMode(mode: AiEditorMode): AiCapability[] {
  return [...CAPABILITIES_BY_MODE[mode]];
}
