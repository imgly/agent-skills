// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  hasEmbeddedParent,
  requestTokenFromParent
} from '../../src/app/ai-credentials/ai-token-embedded';

const RESPONSE_TYPE = 'ly.img.ai.token.response';

let postMessage = vi.fn();

/** Stand in for a hosting frame, which jsdom otherwise reports as the page. */
function setParent(parent: unknown): void {
  Object.defineProperty(window, 'parent', {
    value: parent,
    configurable: true
  });
}

/** The message the kit posts to the host, with the id it generated. */
function lastRequest(): { type: string; requestId: string } {
  return postMessage.mock.calls.at(-1)![0] as {
    type: string;
    requestId: string;
  };
}

function answer(payload: Record<string, unknown>): void {
  window.dispatchEvent(new MessageEvent('message', { data: payload }));
}

beforeEach(() => {
  postMessage = vi.fn();
  setParent({ postMessage });
  window.history.replaceState({}, '', '/?demoPreview=true');
});

afterEach(() => {
  setParent(window);
  window.history.replaceState({}, '', '/');
  vi.useRealTimers();
});

describe('AIE-C3 hasEmbeddedParent', () => {
  it('is true only inside a frame that carries the preview flag', () => {
    expect(hasEmbeddedParent()).toBe(true);

    window.history.replaceState({}, '', '/');
    expect(hasEmbeddedParent()).toBe(false);
  });

  it('is false when the page is its own parent', () => {
    setParent(window);
    expect(hasEmbeddedParent()).toBe(false);
  });
});

describe('AIE-C4 requestTokenFromParent', () => {
  it('resolves with the token the host answers with', async () => {
    const pending = requestTokenFromParent();
    const { type, requestId } = lastRequest();

    expect(type).toBe('ly.img.ai.token.request');
    answer({ type: RESPONSE_TYPE, requestId, token: 'jwt-1' });

    await expect(pending).resolves.toBe('jwt-1');
  });

  it('ignores an answer to a different request and any other message', async () => {
    const pending = requestTokenFromParent();
    const { requestId } = lastRequest();

    answer({ type: 'something.else' });
    answer({ type: RESPONSE_TYPE, requestId: 'other', token: 'wrong' });
    answer({ type: RESPONSE_TYPE, requestId, token: 'jwt-2' });

    await expect(pending).resolves.toBe('jwt-2');
  });

  it('rejects with the error the host reports', async () => {
    const pending = requestTokenFromParent();
    answer({
      type: RESPONSE_TYPE,
      requestId: lastRequest().requestId,
      error: 'not signed in'
    });

    await expect(pending).rejects.toThrow('not signed in');
  });

  it('rejects an answer that carries neither a token nor an error', async () => {
    const pending = requestTokenFromParent();
    answer({ type: RESPONSE_TYPE, requestId: lastRequest().requestId });

    await expect(pending).rejects.toThrow('invalid token response');
  });

  it('gives up after ten seconds and says who has to install the listener', async () => {
    vi.useFakeTimers();
    // The rejection lands while the timers advance, so the expectation has to
    // be attached before that.
    const settled = expect(requestTokenFromParent()).rejects.toThrow(
      /Timed out waiting for AI token from the hosting demo app/
    );

    await vi.advanceTimersByTimeAsync(10_000);
    await settled;
  });
});

describe('AIE-C7 the bridge after it has settled', () => {
  it('AIE-C7 keeps the token it resolved with', async () => {
    vi.useFakeTimers();
    try {
      const pending = requestTokenFromParent();
      answer({
        type: RESPONSE_TYPE,
        requestId: lastRequest().requestId,
        token: 'first'
      });
      await expect(pending).resolves.toBe('first');

      answer({
        type: RESPONSE_TYPE,
        requestId: lastRequest().requestId,
        token: 'second'
      });
      await vi.advanceTimersByTimeAsync(10_000);

      await expect(pending).resolves.toBe('first');
    } finally {
      vi.useRealTimers();
    }
  });
});
