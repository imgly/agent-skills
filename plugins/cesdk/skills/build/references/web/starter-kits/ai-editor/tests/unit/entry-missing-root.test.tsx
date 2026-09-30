// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/app/App', () => ({ default: () => null }));

describe('AIE-U28 the entry point without its container', () => {
  it('AIE-U28 fails loudly instead of mounting nothing', async () => {
    document.getElementById('root')?.remove();

    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
  });
});
