// HIDDEN_FILE
/**
 * Parent-frame postMessage bridge used when the starterkit runs inside the
 * IMG.LY showcases demo iframe (`?demoPreview=true`). The demo holds a
 * short-lived JWT tied to the user's IMG.LY account; this module lets the
 * iframe ask for it without ever seeing the underlying API key.
 *
 * Published releases of the starterkit DO NOT include this file — the
 * `HIDDEN_FILE` marker above tells `scripts/publish-example.mjs` to delete
 * it from the published output, in addition to the `START_HIDDEN_BLOCK`
 * guards that strip its import from `ai-credentials.ts`.
 */

const EMBEDDED_PREVIEW_FLAG = 'demoPreview';

export function hasEmbeddedParent(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.parent === window) return false;

  const params = new URLSearchParams(window.location.search);
  return params.get(EMBEDDED_PREVIEW_FLAG) === 'true';
}

interface TokenRequestMessage {
  type: 'ly.img.ai.token.request';
  requestId: string;
}

interface TokenResponseMessage {
  type: 'ly.img.ai.token.response';
  requestId: string;
  token?: string;
  error?: string;
}

const REQUEST_TYPE: TokenRequestMessage['type'] = 'ly.img.ai.token.request';
const RESPONSE_TYPE: TokenResponseMessage['type'] = 'ly.img.ai.token.response';
const BRIDGE_TIMEOUT_MS = 10_000;

function isTokenResponse(data: unknown): data is TokenResponseMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { type?: unknown }).type === RESPONSE_TYPE &&
    typeof (data as { requestId?: unknown }).requestId === 'string'
  );
}

export async function requestTokenFromParent(): Promise<string> {
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return new Promise<string>((resolve, reject) => {
    let settled = false;

    const onMessage = (event: MessageEvent) => {
      if (!isTokenResponse(event.data)) return;
      if (event.data.requestId !== requestId) return;
      if (settled) return;

      settled = true;
      window.removeEventListener('message', onMessage);
      clearTimeout(timer);

      if (event.data.error != null) {
        reject(new Error(event.data.error));
      } else if (typeof event.data.token === 'string') {
        resolve(event.data.token);
      } else {
        reject(new Error('Parent frame returned an invalid token response'));
      }
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', onMessage);
      reject(
        new Error(
          'Timed out waiting for AI token from the hosting demo app. ' +
            'Make sure the host installs an `ly.img.ai.token.request` postMessage listener.'
        )
      );
    }, BRIDGE_TIMEOUT_MS);

    window.addEventListener('message', onMessage);

    const request: TokenRequestMessage = { type: REQUEST_TYPE, requestId };
    // The iframe cannot verify the parent's origin when hosted cross-origin,
    // so we broadcast with '*'. The parent-side bridge is responsible for
    // filtering by `event.source` to avoid cross-iframe leaks.
    window.parent.postMessage(request, '*');
  });
}
