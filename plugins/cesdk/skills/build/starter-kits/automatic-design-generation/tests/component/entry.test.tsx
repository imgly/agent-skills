// @vitest-environment jsdom
import { act, waitFor } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The entry only wires the root container to `App`; the app itself is driven by
// its own component cases, and mounting it here would boot an engine.
vi.mock('../../src/app/App', async () => {
  const { createElement } = await import('react');
  return { default: () => createElement('div', { 'data-testid': 'app' }) };
});

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  document.getElementById('root')?.remove();
});

// ADG-C16
describe('the entry point', () => {
  it('mounts the app into the root container the page ships', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);

    await act(async () => {
      await import('../../src/index');
    });

    await waitFor(() =>
      expect(container.querySelector('[data-testid="app"]')).toBeTruthy()
    );
  });

  it('fails loudly when the page ships no root container', async () => {
    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
  });
});
