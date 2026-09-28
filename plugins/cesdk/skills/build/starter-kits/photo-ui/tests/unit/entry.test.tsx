// @vitest-environment jsdom
import { act } from '@imgly/kit-test-harness/component';
import { beforeAll, describe, expect, it, vi } from 'vitest';

// The entry point renders the whole app, so the engine never finishes starting;
// what is under test is the bootstrap itself.
vi.mock('@cesdk/engine', () => ({
  default: { init: () => new Promise(() => {}) }
}));

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??= ResizeObserverStub as never;
});

describe('PH-U9 The entry point', () => {
  it('mounts the app into #root', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.append(root);

    await act(async () => {
      await import('../../src/index');
    });

    expect(root.querySelector('#scroll-container')).toBeTruthy();
  });
});
