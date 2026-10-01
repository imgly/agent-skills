// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/engine', () => ({
  default: { init: async () => new Promise(() => {}) }
}));

describe('PH-U10 The entry point without its container', () => {
  it('logs the failure instead of throwing out of the module', async () => {
    // The suite shares one jsdom document, so another entry case may have left
    // a `#root` behind.
    document.getElementById('root')?.remove();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await import('../../src/index');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleError).toHaveBeenCalledWith(
      'Failed to initialize application:',
      expect.objectContaining({ message: 'Root container not found' })
    );
    consoleError.mockRestore();
  });
});
