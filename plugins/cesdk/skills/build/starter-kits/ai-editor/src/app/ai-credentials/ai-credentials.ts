/**
 * AI Gateway Credential Resolution (App-Level, DEMO / LOCAL DEV ONLY)
 *
 * Registers the single `ly.img.ai.getToken` action on a CE.SDK instance.
 * Every authenticated AI call — both the gateway providers' per-request
 * auth and the sidebar's model-catalog fetch — routes through this
 * action, so the app has exactly one credential path.
 *
 * ⚠️  PRODUCTION WARNING
 *
 * The `apiKey` mode below returns the raw IMG.LY API key to the browser
 * via `{ dangerouslyExposeApiKey }`. This is intentional for this
 * starterkit's local-dev experience — it is NOT appropriate for
 * production deployments.
 *
 * In production you MUST:
 *
 *   1. Store the API key on a backend you control (never ship it to the
 *      browser, never commit it to git, never put it in `.env` files that
 *      get bundled into the client).
 *   2. Expose a backend endpoint that mints a short-lived JWT bound to
 *      the current user/session.
 *   3. Replace `installAiCredentials` with an action registration that
 *      fetches that JWT from your endpoint and returns the token string
 *      directly (no `dangerouslyExposeApiKey`).
 *
 * Full recipe:
 *   https://img.ly/docs/cesdk/js/user-interface/ai-integration/gateway-provider-06df22/
 *
 * The `imgly/` config payload is deliberately unaware of how credentials
 * are resolved — it only assumes the `ly.img.ai.getToken` action has been
 * registered on the CE.SDK instance before the AI Apps plugin runs.
 *
 * Credential modes, in order of precedence:
 *
 *   1. `apiKey`       — `VITE_AI_API_KEY` is set in `.env`. The key is
 *                       returned via `{ dangerouslyExposeApiKey }`.
 *                       ⚠️  Demo / local-dev ONLY — see warning above.
 *
 *   2. `unconfigured` — no credentials detected. The action throws when
 *                       invoked; the React onboarding screen surfaces
 *                       the failure.
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// START_HIDDEN_BLOCK
import { hasEmbeddedParent, requestTokenFromParent } from './ai-token-embedded';
// END_HIDDEN_BLOCK

// ============================================================================
// Credential Mode Detection
// ============================================================================

export type AiCredentialMode =
  // START_HIDDEN_BLOCK
  | 'embedded'
  // END_HIDDEN_BLOCK
  | 'apiKey'
  | 'unconfigured';

// ----------------------------------------------------------------------------
// User-entered API key (deployed production bundles only)
// ----------------------------------------------------------------------------
//
// In a `vite build` bundle there is no `.env` the visitor can edit, so we
// persist a key pasted into the onboarding screen in `localStorage`. Only
// used when `import.meta.env.PROD === true`; during `vite dev` the env
// file remains the single source of truth.

const USER_API_KEY_STORAGE = 'imgly.ai-editor.apiKey';

export function getUserApiKey(): string | undefined {
  if (!import.meta.env.PROD) return undefined;
  if (typeof window === 'undefined') return undefined;
  try {
    const stored = window.localStorage.getItem(USER_API_KEY_STORAGE);
    return stored != null && stored.length > 0 ? stored : undefined;
  } catch {
    return undefined;
  }
}

export function setUserApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(USER_API_KEY_STORAGE, key);
  } catch {
    // `localStorage` may be disabled (private browsing, quota, etc.).
    // Silently drop — the onboarding screen will re-prompt after reload.
  }
}

export function clearUserApiKey(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(USER_API_KEY_STORAGE);
  } catch {
    // Same reasoning as `setUserApiKey` — nothing to do on failure.
  }
}

function getApiKey(): string | undefined {
  // Deployed bundles: prefer a user-pasted key from `localStorage` so
  // adopters can swap keys without rebuilding. `getUserApiKey` already
  // no-ops during `vite dev`, so dev keeps its familiar `.env` flow.
  const stored = getUserApiKey();
  if (stored != null) return stored;

  const key = import.meta.env.VITE_AI_API_KEY;
  return typeof key === 'string' && key.length > 0 ? key : undefined;
}

export function detectAiCredentialMode(): AiCredentialMode {
  // START_HIDDEN_BLOCK
  if (hasEmbeddedParent()) return 'embedded';
  // END_HIDDEN_BLOCK
  if (getApiKey() != null) return 'apiKey';
  return 'unconfigured';
}

// ============================================================================
// Token Resolution (shared by the action handler and the preflight probe)
// ============================================================================

/**
 * Shape returned to gateway providers by `ly.img.ai.getToken`.
 *   - `string` — a minted JWT (production); forwarded as the bearer.
 *   - `{ dangerouslyExposeApiKey }` — raw IMG.LY API key (demo/local dev).
 */
export type AiTokenResult = string | { dangerouslyExposeApiKey: string };

/**
 * Single source of truth for credential resolution. Both the
 * `ly.img.ai.getToken` action registered on the cesdk instance and the
 * preflight probe in `probeAiCredentials` call into this function.
 *
 * ⚠️  PRODUCTION: replace the `apiKey` branch below with a `fetch()` to
 * your backend that returns a short-lived JWT scoped to the current
 * session, and return that string directly (no `dangerouslyExposeApiKey`).
 * See the file header for the full recipe.
 *
 * Throws when no credentials are detected so the onboarding flow can
 * distinguish "missing" from "invalid."
 */
export async function resolveAiToken(): Promise<AiTokenResult> {
  // START_HIDDEN_BLOCK
  if (hasEmbeddedParent()) {
    return requestTokenFromParent();
  }
  // END_HIDDEN_BLOCK

  const apiKey = getApiKey();
  if (apiKey != null) {
    // ⚠️  Demo / local-dev ONLY — raw key is forwarded to the browser.
    return { dangerouslyExposeApiKey: apiKey };
  }

  throw new Error(
    'No AI credentials configured. Set VITE_AI_API_KEY to an API key from ' +
      'the IMG.LY dashboard (https://img.ly/dashboard).'
  );
}

/**
 * Collapse an `AiTokenResult` to the raw bearer string used in
 * `Authorization: Bearer <token>` headers.
 */
export function bearerFromTokenResult(token: AiTokenResult): string {
  return typeof token === 'string' ? token : token.dangerouslyExposeApiKey;
}

// ============================================================================
// Action Registration
// ============================================================================

/**
 * Install the app-level credential handling on a CE.SDK instance.
 *
 * Registers `ly.img.ai.getToken` so gateway providers can authenticate.
 * Call this once, immediately after CE.SDK is created, before the AI Apps
 * configuration plugin initializes.
 *
 * Surfacing missing/invalid credentials to the user is handled separately
 * by the preflight probe + React onboarding screen — see
 * `probeAiCredentials` below and `OnboardingScreen.tsx`.
 */
export function installAiCredentials(cesdk: CreativeEditorSDK): void {
  cesdk.actions.register('ly.img.ai.getToken', resolveAiToken);
}

// ============================================================================
// Gateway URL Resolution
// ============================================================================

const DEFAULT_GATEWAY_URL = 'https://gateway.img.ly';

/**
 * Resolve the gateway URL to use for both the preflight probe and the
 * generation providers. Resolution order:
 *
 *   1. Embedded mode — `?gatewayUrl=` query param forwarded by the
 *      hosting demos page. Lets the host pair its Clerk instance with
 *      the matching gateway (e.g. staging Clerk → `gateway.staging.img.ly`)
 *      without any starterkit-side config.
 *   2. `VITE_AI_GATEWAY_URL` env var — standalone dev pointing at a
 *      non-production gateway.
 *   3. The default production gateway.
 *
 * Called eagerly by both the probe and the provider factory options so
 * every outbound request uses the same host.
 */
export function getGatewayUrl(): string {
  // START_HIDDEN_BLOCK
  if (hasEmbeddedParent()) {
    const params = new URLSearchParams(window.location.search);
    const hostGateway = params.get('gatewayUrl');
    if (hostGateway != null && hostGateway.length > 0) return hostGateway;
  }
  // END_HIDDEN_BLOCK
  return import.meta.env.VITE_AI_GATEWAY_URL || DEFAULT_GATEWAY_URL;
}

// ============================================================================
// Preflight Probe
// ============================================================================

/**
 * Discriminated result of `probeAiCredentials`. Lets the app decide
 * whether to render the editor, the onboarding screen, or continue with
 * degraded defaults.
 *
 * The `ok` branch includes the catalog payload so callers can avoid a
 * second round-trip after the probe succeeds. The `invalid` branch
 * carries the credential mode so the UI can tell the user whether to
 * fix a local `.env` key (`apiKey`) or chase a host-side Clerk/gateway
 * mismatch (`embedded`).
 */
export type AiCredentialProbe =
  | { status: 'ok'; modelsByCapability: unknown }
  | { status: 'missing' }
  | { status: 'invalid'; mode: AiCredentialMode }
  | { status: 'unreachable'; message: string };

function isMissingCredentialsError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.startsWith('No AI credentials configured')
  );
}

/**
 * Verify credentials work against the IMG.LY AI Gateway before mounting
 * the editor. Fetches `/v1/models?groupBy=capability`, which serves as
 * both an auth probe and a source of the model catalog consumed by the
 * sidebar.
 *
 * Never throws — resolves with a discriminated status so the caller can
 * map each outcome to a UI state without a try/catch.
 */
export async function probeAiCredentials(): Promise<AiCredentialProbe> {
  let token: AiTokenResult;
  try {
    token = await resolveAiToken();
  } catch (error) {
    if (isMissingCredentialsError(error)) return { status: 'missing' };
    return {
      status: 'unreachable',
      message: error instanceof Error ? error.message : String(error)
    };
  }

  let res: Response;
  try {
    res = await fetch(`${getGatewayUrl()}/v1/models?groupBy=capability`, {
      headers: { Authorization: `Bearer ${bearerFromTokenResult(token)}` }
    });
  } catch (error) {
    return {
      status: 'unreachable',
      message: error instanceof Error ? error.message : String(error)
    };
  }

  if (res.status === 401 || res.status === 403) {
    return { status: 'invalid', mode: detectAiCredentialMode() };
  }
  if (!res.ok) {
    return {
      status: 'unreachable',
      message: `Gateway returned ${res.status} ${res.statusText}`
    };
  }

  return { status: 'ok', modelsByCapability: await res.json() };
}
