// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  detectAiCredentialMode,
  getGatewayUrl,
  probeAiCredentials,
  resolveAiToken
} from '../../src/app/ai-credentials';

/** Stand in for a hosting frame, which jsdom otherwise reports as the page. */
function setParent(parent: unknown): void {
  Object.defineProperty(window, 'parent', {
    value: parent,
    configurable: true
  });
}

let hostListener: ((event: MessageEvent) => void) | undefined;

function answerWithToken(token: string): void {
  hostListener = (event: MessageEvent) => {
    const request = event.data as { type?: string; requestId?: string };
    if (request?.type !== 'ly.img.ai.token.request') return;
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'ly.img.ai.token.response',
          requestId: request.requestId,
          token
        }
      })
    );
  };
  window.addEventListener('message', hostListener);
}

beforeEach(() => {
  setParent({ postMessage: (data: unknown) => window.postMessage(data, '*') });
  window.history.replaceState({}, '', '/?demoPreview=true');
});

afterEach(() => {
  if (hostListener != null) {
    window.removeEventListener('message', hostListener);
    hostListener = undefined;
  }
  setParent(window);
  window.history.replaceState({}, '', '/');
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('AIE-C6 the credentials of an embedded preview', () => {
  it('AIE-C6 reports the embedded mode before it asks for anything', () => {
    expect(detectAiCredentialMode()).toBe('embedded');
  });

  it('AIE-C6 takes its token from the hosting frame', async () => {
    answerWithToken('jwt-from-host');

    await expect(resolveAiToken()).resolves.toBe('jwt-from-host');
  });

  it('AIE-C6 uses the gateway the host names in the query', () => {
    window.history.replaceState(
      {},
      '',
      '/?demoPreview=true&gatewayUrl=https://gateway.staging.img.ly'
    );

    expect(getGatewayUrl()).toBe('https://gateway.staging.img.ly');
  });

  it('AIE-C6 falls back to the configured gateway when the host names none', () => {
    vi.stubEnv('VITE_AI_GATEWAY_URL', '');

    expect(getGatewayUrl()).toBe('https://gateway.img.ly');
  });

  it('AIE-C6 reports a host that never answers as unreachable', async () => {
    vi.useFakeTimers();
    try {
      const probe = probeAiCredentials();
      await vi.advanceTimersByTimeAsync(10_000);

      await expect(probe).resolves.toEqual({
        status: 'unreachable',
        message: expect.stringContaining('Timed out waiting for AI token')
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('AIE-C6 reports a rejected session as invalid, naming the mode', async () => {
    answerWithToken('jwt-from-host');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ status: 401, ok: false }) as Response)
    );

    await expect(probeAiCredentials()).resolves.toEqual({
      status: 'invalid',
      mode: 'embedded'
    });
  });

  it('AIE-C6 reports a host bridge that throws a bare value', async () => {
    setParent({
      postMessage: () => {
        // eslint-disable-next-line no-throw-literal
        throw 'bridge exploded';
      }
    });

    await expect(probeAiCredentials()).resolves.toEqual({
      status: 'unreachable',
      message: 'bridge exploded'
    });
  });

  it('AIE-C6 reports a fetch that rejects with a bare value', async () => {
    answerWithToken('jwt-from-host');
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject('network exploded'))
    );

    await expect(probeAiCredentials()).resolves.toEqual({
      status: 'unreachable',
      message: 'network exploded'
    });
  });
});
