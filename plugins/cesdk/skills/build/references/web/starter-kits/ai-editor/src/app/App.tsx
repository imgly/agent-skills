/**
 * CE.SDK AI Editor - Main App Component
 *
 * Uses the official CE.SDK React wrapper with AI generation capabilities.
 * Supports Design, Photo, and Video editing modes with configurable AI providers.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import {
  initAiDesignEditor,
  initAiPhotoEditor,
  initAiVideoEditor
} from '../imgly';
import {
  getGatewayUrl,
  installAiCredentials,
  OnboardingScreen,
  probeAiCredentials,
  type AiCredentialMode,
  type AiCredentialProbe
} from './ai-credentials';
import {
  getSelectedProviders,
  providersForMode,
  type AIProviders
} from './ai-sidebar';
import { DEFAULT_PHOTO_URL, SCENE_URLS } from './constants';

import { Sidebar } from './Sidebar/Sidebar';
import { Topbar } from './Topbar/Topbar';
import styles from './App.module.css';


// ============================================================================
// Editor Mode Type
// ============================================================================

/**
 * Available editor modes for the AI Editor.
 */
export type EditorMode = 'Design' | 'Video' | 'Photo';

/**
 * All available editor modes.
 */
const EDITOR_MODES: readonly EditorMode[] = ['Design', 'Video', 'Photo'];

// ============================================================================
// Props
// ============================================================================

interface AppProps {
  /**
   * CE.SDK configuration object.
   * Passed to the CreativeEditor component.
   */
  config: Partial<Configuration>;
}

// ============================================================================
// URL Parameter Handling
// ============================================================================

function getInitialMode(): EditorMode {
  const url = new URL(window.location.href);
  const modeParam = url.searchParams.get('mode') as EditorMode | null;
  if (modeParam && EDITOR_MODES.includes(modeParam)) {
    return modeParam;
  }
  return 'Design';
}

// ============================================================================
// App Component
// ============================================================================

/**
 * Boot phases, rendered as distinct UI states:
 *   - `probing`    — credential preflight in flight; show a minimal shell.
 *   - `onboarding` — no key / invalid key; show `OnboardingScreen` with
 *                    `reason` and `mode` from the probe so the copy can
 *                    match who actually minted the rejected token.
 *   - `ready`      — credentials check out; mount the editor + sidebar.
 */
type BootState =
  | { phase: 'probing' }
  | {
      phase: 'onboarding';
      reason: 'missing' | 'invalid';
      mode: AiCredentialMode;
    }
  | { phase: 'ready'; catalog: unknown; providers: AIProviders };

export default function App({ config }: AppProps) {
  const [currentMode, setCurrentMode] = useState<EditorMode>(getInitialMode);

  // Bootstrap state — starts in `probing` and transitions once
  // `probeAiCredentials` resolves (see effect below).
  const [boot, setBoot] = useState<BootState>({ phase: 'probing' });

  // Track initialization key to force re-mount of CreativeEditor.
  const [editorKey, setEditorKey] = useState(0);

  // The probe runs once, so read the mode through a ref: the user may switch
  // modes while it is still in flight.
  const modeRef = useRef(currentMode);
  modeRef.current = currentMode;

  // ------------------------------------------------------------------
  // Credential preflight — runs BEFORE CE.SDK mounts, once per page load.
  //
  // We talk to `/v1/models?groupBy=capability` once, up front. That single
  // round-trip tells us:
  //   - whether the configured credentials are valid (→ 401/403 = invalid),
  //   - whether any are configured at all (→ `resolveAiToken` throws),
  //   - and what models the gateway exposes (payload doubles as the
  //     sidebar's dynamic catalog, no second fetch needed).
  //
  // Only when the probe comes back `ok` do we commit to mounting the
  // heavy CE.SDK bundle — no "mount then tear down" when creds are bad.
  // The catalog is kept so a mode switch rebuilds the sidebar from it
  // instead of probing again.
  // ------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    probeAiCredentials().then((result: AiCredentialProbe) => {
      if (cancelled) return;

      if (result.status === 'missing') {
        setBoot({
          phase: 'onboarding',
          reason: 'missing',
          mode: 'unconfigured'
        });
        return;
      }
      if (result.status === 'invalid') {
        setBoot({
          phase: 'onboarding',
          reason: 'invalid',
          mode: result.mode
        });
        return;
      }
      if (result.status === 'unreachable') {
        console.warn('[ai-editor] gateway unreachable:', result.message);
      }

      const catalog =
        result.status === 'ok' ? result.modelsByCapability : undefined;
      setBoot({
        phase: 'ready',
        catalog,
        providers: providersForMode(
          modeRef.current,
          catalog,
          undefined,
          getGatewayUrl()
        )
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Initialize CE.SDK via the CreativeEditor component's init callback.
   *
   * Only runs when `boot.phase === 'ready'`, so credentials have already
   * been verified by the preflight probe.
   */
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {

      // Register the credential action so gateway providers can call it
      // for every generation request.
      installAiCredentials(cesdk);

      const providers =
        boot.phase === 'ready'
          ? boot.providers
          : providersForMode(
              currentMode,
              undefined,
              undefined,
              getGatewayUrl()
            );
      const providerMap = getSelectedProviders(providers);

      switch (currentMode) {
        case 'Design':
          await initAiDesignEditor(cesdk, providerMap);
          await cesdk.load(SCENE_URLS.Design);
          break;
        case 'Photo':
          await initAiPhotoEditor(cesdk, providerMap);
          await cesdk.createFromImage(DEFAULT_PHOTO_URL);
          break;
        case 'Video':
          await initAiVideoEditor(cesdk, providerMap);
          await cesdk.load(SCENE_URLS.Video);
          break;
        default:
          await initAiDesignEditor(cesdk, providerMap);
          await cesdk.load(SCENE_URLS.Design);
      }
    },
    [boot, currentMode]
  );

  /**
   * Handle mode change from the topbar selector.
   *
   * Rebuilds the sidebar for the new mode from the catalog the preflight
   * already fetched, carrying the current selection over, and remounts the
   * editor with the resulting provider map.
   */
  const handleModeChange = useCallback((newMode: EditorMode) => {
    setCurrentMode(newMode);
    setBoot((current) =>
      current.phase === 'ready'
        ? {
            ...current,
            providers: providersForMode(
              newMode,
              current.catalog,
              current.providers,
              getGatewayUrl()
            )
          }
        : current
    );

    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url.toString());

    setEditorKey((prev) => prev + 1);
  }, []);

  /**
   * Handle provider changes from the sidebar — triggered on "Apply Changes".
   */
  const handleProviderChange = useCallback((newProviders: AIProviders) => {
    setBoot((current) =>
      current.phase === 'ready'
        ? { ...current, providers: newProviders }
        : current
    );
    setEditorKey((prev) => prev + 1);
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Topbar
          modes={EDITOR_MODES}
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />
      </div>
      <div className={styles.editorRow}>
        {boot.phase === 'probing' ? (
          <div className={styles.editor} aria-hidden="true" />
        ) : boot.phase === 'onboarding' ? (
          <OnboardingScreen reason={boot.reason} mode={boot.mode} />
        ) : (
          <>
            <CreativeEditor
              key={editorKey}
              className={styles.editor}
              config={config}
              init={handleInit}
            />
            <Sidebar
              providers={boot.providers}
              onApplyChanges={handleProviderChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
