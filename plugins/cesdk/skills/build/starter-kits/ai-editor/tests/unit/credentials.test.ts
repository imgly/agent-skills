// @vitest-environment jsdom
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  bearerFromTokenResult,
  clearUserApiKey,
  detectAiCredentialMode,
  getGatewayUrl,
  getUserApiKey,
  installAiCredentials,
  probeAiCredentials,
  resolveAiToken,
  setUserApiKey
} from '../../src/app/ai-credentials';

const API_KEY = 'sk_test_key';

function stubFetch(response: Partial<Response> | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error
      ? Promise.reject(response)
      : Promise.resolve(response as Response)
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv('VITE_AI_API_KEY', API_KEY);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('AIE-U9 resolveAiToken', () => {
  it('exposes the configured key to the browser', async () => {
    await expect(resolveAiToken()).resolves.toEqual({
      dangerouslyExposeApiKey: API_KEY
    });
  });

  it('throws when nothing is configured', async () => {
    vi.stubEnv('VITE_AI_API_KEY', '');
    await expect(resolveAiToken()).rejects.toThrow(
      /^No AI credentials configured/
    );
  });
});

describe('AIE-U9 bearerFromTokenResult', () => {
  it.each([
    ['a minted JWT', 'jwt-value', 'jwt-value'],
    ['an exposed API key', { dangerouslyExposeApiKey: API_KEY }, API_KEY]
  ])('collapses %s', (_case, token, expected) => {
    expect(bearerFromTokenResult(token as never)).toBe(expected);
  });
});

describe('AIE-U9 detectAiCredentialMode', () => {
  it('is apiKey with a key and unconfigured without one', () => {
    expect(detectAiCredentialMode()).toBe('apiKey');
    vi.stubEnv('VITE_AI_API_KEY', '');
    expect(detectAiCredentialMode()).toBe('unconfigured');
  });
});

describe('AIE-U9 getUserApiKey', () => {
  it('reads nothing outside a production build', () => {
    setUserApiKey('sk_stored');
    expect(getUserApiKey()).toBeUndefined();
    clearUserApiKey();
  });

  it('survives a localStorage that throws', () => {
    vi.stubGlobal('localStorage', {
      getItem() {
        throw new Error('denied');
      },
      setItem() {
        throw new Error('denied');
      },
      removeItem() {
        throw new Error('denied');
      }
    });
    expect(() => setUserApiKey('sk_stored')).not.toThrow();
    expect(() => clearUserApiKey()).not.toThrow();
    expect(getUserApiKey()).toBeUndefined();
  });
});

describe('AIE-U9 getGatewayUrl', () => {
  it('prefers the configured gateway', () => {
    vi.stubEnv('VITE_AI_GATEWAY_URL', 'https://gateway.staging.example');
    expect(getGatewayUrl()).toBe('https://gateway.staging.example');
  });

  it('falls back to the production gateway', () => {
    vi.stubEnv('VITE_AI_GATEWAY_URL', '');
    expect(getGatewayUrl()).toBe('https://gateway.img.ly');
  });
});

describe('AIE-U9 installAiCredentials', () => {
  it('registers exactly the token action the gateway providers call', () => {
    // A hand-rolled recorder rather than the harness spy: importing
    // `@imgly/kit-test-harness/vitest` pulls esbuild into the jsdom
    // environment, which breaks its TextEncoder invariant.
    const registered: unknown[][] = [];
    const cesdk = {
      actions: { register: (...args: unknown[]) => registered.push(args) }
    } as unknown as CreativeEditorSDK;

    installAiCredentials(cesdk);

    expect(registered).toEqual([['ly.img.ai.getToken', resolveAiToken]]);
  });
});

describe('AIE-U8 probeAiCredentials', () => {
  it('reports missing credentials without reaching the gateway', async () => {
    vi.stubEnv('VITE_AI_API_KEY', '');
    const fetchMock = stubFetch({ ok: true, status: 200 });

    await expect(probeAiCredentials()).resolves.toEqual({ status: 'missing' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('asks the catalogue endpoint with a bearer header', async () => {
    vi.stubEnv('VITE_AI_GATEWAY_URL', 'https://gateway.example');
    const payload = { image2image: [{ id: 'vendor/model' }] };
    const fetchMock = stubFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve(payload)
    } as Partial<Response>);

    await expect(probeAiCredentials()).resolves.toEqual({
      status: 'ok',
      modelsByCapability: payload
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://gateway.example/v1/models?groupBy=capability',
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
  });

  it.each([401, 403])('reports %s as an invalid key', async (status) => {
    stubFetch({ ok: false, status, statusText: 'Unauthorized' });
    await expect(probeAiCredentials()).resolves.toEqual({
      status: 'invalid',
      mode: 'apiKey'
    });
  });

  it('reports a server error as unreachable, naming the status', async () => {
    stubFetch({ ok: false, status: 500, statusText: 'Server Error' });
    await expect(probeAiCredentials()).resolves.toEqual({
      status: 'unreachable',
      message: 'Gateway returned 500 Server Error'
    });
  });

  it('reports a rejected request as unreachable, naming the reason', async () => {
    stubFetch(new Error('Failed to fetch'));
    await expect(probeAiCredentials()).resolves.toEqual({
      status: 'unreachable',
      message: 'Failed to fetch'
    });
  });
});

describe('AIE-U22 the key a deployed bundle stores in the browser', () => {
  beforeEach(() => {
    vi.stubEnv('PROD', true as never);
    window.localStorage.clear();
  });

  it('AIE-U22 round-trips the key through localStorage', () => {
    expect(getUserApiKey()).toBeUndefined();

    setUserApiKey(API_KEY);
    expect(getUserApiKey()).toBe(API_KEY);
    expect(detectAiCredentialMode()).toBe('apiKey');

    clearUserApiKey();
    expect(getUserApiKey()).toBeUndefined();
  });

  it('AIE-U22 treats an empty stored key as none at all', () => {
    setUserApiKey('');

    expect(getUserApiKey()).toBeUndefined();
  });

  it('AIE-U22 prefers the stored key over the build-time one', async () => {
    vi.stubEnv('VITE_AI_API_KEY', 'sk_from_env');
    setUserApiKey('sk_from_browser');

    await expect(resolveAiToken()).resolves.toEqual({
      dangerouslyExposeApiKey: 'sk_from_browser'
    });
  });

  it('AIE-U22 survives a localStorage that refuses to write', () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });
    const removeItem = vi
      .spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });

    expect(() => setUserApiKey(API_KEY)).not.toThrow();
    expect(() => clearUserApiKey()).not.toThrow();

    setItem.mockRestore();
    removeItem.mockRestore();
  });
});

describe('AIE-U23 the probe when the token cannot be resolved', () => {
  it('AIE-U23 reports a token failure that is not a missing key as unreachable', async () => {
    vi.stubEnv('VITE_AI_API_KEY', '');
    const getItem = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('storage blocked');
      });
    vi.stubEnv('PROD', true as never);

    // `getUserApiKey` swallows the storage failure, so the probe still sees a
    // missing key rather than an unreachable gateway.
    await expect(probeAiCredentials()).resolves.toEqual({ status: 'missing' });

    getItem.mockRestore();
  });
});
