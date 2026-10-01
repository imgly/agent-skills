/**
 * Onboarding screen shown in place of the editor when the AI gateway
 * cannot be reached with the configured credentials.
 *
 * Variants (picked in this order):
 *   1. `invalid` + `embedded` (hidden-block, stripped from the published
 *      release) — the starterkit runs inside the IMG.LY demos iframe and
 *      the session JWT minted by the hosting page was rejected; points
 *      at the host-side Clerk/gateway mismatch, not at any `.env`.
 *   2. `import.meta.env.PROD` — a deployed bundle (customer prod, or
 *      our `ubique.img.ly` staging) opened standalone. Shows an input
 *      field that writes the pasted key to `localStorage` via
 *      `setUserApiKey`; used for both the `missing` and `invalid` states.
 *   3. Dev (`vite dev`) — `.env` walkthrough for IMG.LY devs + adopters
 *      running the starterkit locally after cloning.
 */

import { useCallback, useState } from 'react';

import {
  clearUserApiKey,
  getUserApiKey,
  setUserApiKey,
  type AiCredentialMode
} from './ai-credentials';
import styles from './OnboardingScreen.module.css';

const DASHBOARD_URL = 'https://img.ly/dashboard';
const GATEWAY_DOCS_URL =
  'https://img.ly/docs/cesdk/js/user-interface/ai-integration/gateway-provider-06df22/';

const ENV_SNIPPET = `# .env (project root)
VITE_AI_API_KEY=sk_your_api_key_here`;

interface OnboardingScreenProps {
  reason: 'missing' | 'invalid';
  mode: AiCredentialMode;
}

export function OnboardingScreen(props: OnboardingScreenProps) {
  const { reason } = props;
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);


  if (import.meta.env.PROD) {
    return <DeployedApiKeyScreen reason={reason} />;
  }

  const isMissing = reason === 'missing';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <span
          className={`${styles.badge} ${isMissing ? '' : styles.badgeInvalid}`}
        >
          {isMissing ? 'Setup required' : 'Invalid API key'}
        </span>

        <div className={styles.title} role="heading" aria-level={2}>
          {isMissing
            ? 'Set up your IMG.LY API key'
            : 'Your API key was rejected'}
        </div>

        <p className={styles.lead}>
          {isMissing ? (
            'The AI Editor routes every generation request through the IMG.LY AI Gateway. To unlock the gateway and the catalog of supported models, you need an API key.'
          ) : (
            <>
              The gateway rejected the value in <code>VITE_AI_API_KEY</code>.
              The most likely cause is that the placeholder in <code>.env</code>{' '}
              was never replaced with a real key. Less commonly, the key may be
              expired, revoked, or scoped to a different account.
            </>
          )}
        </p>

        <ol className={styles.steps}>
          <li className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepBody}>
              <p className={styles.stepText}>
                Open your <strong>IMG.LY Dashboard</strong> and create an API
                key.
              </p>
            </div>
          </li>

          <li className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepBody}>
              <p className={styles.stepText}>
                Paste the key into a <code>.env</code> file in the project root.
              </p>
              <pre className={styles.codeBlock}>{ENV_SNIPPET}</pre>
            </div>
          </li>

          <li className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepBody}>
              <p className={styles.stepText}>
                Restart the dev server (Vite reads <code>.env</code> on start),
                then reload this page.
              </p>
            </div>
          </li>
        </ol>

        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open IMG.LY Dashboard →
          </a>
          <button
            type="button"
            className={styles.secondary}
            onClick={handleReload}
          >
            Reload
          </button>
        </div>

        <p className={styles.stepText}>
          For production, mint short-lived tokens from your backend and register
          a custom <code>ly.img.ai.getToken</code> action instead. See the{' '}
          <a href={GATEWAY_DOCS_URL} target="_blank" rel="noopener noreferrer">
            Gateway Provider guide
          </a>{' '}
          for the full setup.
        </p>
      </div>
    </div>
  );
}


/**
 * Variant shown in deployed production bundles (`import.meta.env.PROD`)
 * when opened standalone. Instead of instructing the visitor to edit a
 * `.env` they don't have access to, we accept the IMG.LY API key through
 * an input field and persist it in `localStorage` via `setUserApiKey`.
 *
 * Handles both `missing` (no stored key) and `invalid` (stored key was
 * rejected) states; only the header copy differs.
 */
function DeployedApiKeyScreen({ reason }: { reason: 'missing' | 'invalid' }) {
  const stored = getUserApiKey();
  const [input, setInput] = useState(stored ?? '');

  const trimmed = input.trim();
  const canSave = trimmed.length > 0 && trimmed !== (stored ?? '');

  const handleSave = useCallback(() => {
    if (!canSave) return;
    setUserApiKey(trimmed);
    window.location.reload();
  }, [canSave, trimmed]);

  const handleClear = useCallback(() => {
    clearUserApiKey();
    window.location.reload();
  }, []);

  const isMissing = reason === 'missing';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <span
          className={`${styles.badge} ${isMissing ? '' : styles.badgeInvalid}`}
        >
          {isMissing ? 'Setup required' : 'Invalid API key'}
        </span>

        <div className={styles.title} role="heading" aria-level={2}>
          {isMissing
            ? 'Set up your IMG.LY API key'
            : 'Your API key was rejected'}
        </div>

        <p className={styles.lead}>
          {isMissing
            ? 'Paste an IMG.LY API key below to unlock the AI Editor. The key is saved in this browser only; it never leaves your machine.'
            : 'The IMG.LY AI Gateway rejected the saved API key. Paste a different key below — most commonly the saved key is expired, revoked, or scoped to a different account.'}
        </p>

        <label className={styles.inputGroup} htmlFor="imgly-ai-key">
          <span className={styles.label}>API key</span>
          <input
            id="imgly-ai-key"
            className={styles.input}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="sk_..."
            spellCheck={false}
            autoComplete="off"
          />
          <p className={styles.helperText}>
            Create one in the{' '}
            <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
              IMG.LY Dashboard
            </a>
            .
          </p>
        </label>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={handleSave}
            disabled={!canSave}
          >
            Save and reload
          </button>
          {stored != null && (
            <button
              type="button"
              className={styles.secondary}
              onClick={handleClear}
            >
              Clear stored key
            </button>
          )}
        </div>

        <p className={styles.stepText}>
          For production, replace this onboarding by registering a custom{' '}
          <code>ly.img.ai.getToken</code> action that fetches a short-lived
          token from your backend. See the{' '}
          <a href={GATEWAY_DOCS_URL} target="_blank" rel="noopener noreferrer">
            Gateway Provider guide
          </a>{' '}
          for the full setup.
        </p>
      </div>
    </div>
  );
}
