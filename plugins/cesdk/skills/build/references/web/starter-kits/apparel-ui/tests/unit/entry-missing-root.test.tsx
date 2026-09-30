// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/engine', () => ({
  default: { init: () => new Promise(() => {}) }
}));

describe('AP-U16 the entry point without its container', () => {
  it('AP-U16 fails loudly instead of mounting nothing', async () => {
    document.getElementById('root')?.remove();

    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
  });
});
