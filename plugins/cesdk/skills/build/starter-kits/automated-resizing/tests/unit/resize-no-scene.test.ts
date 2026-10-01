import type CreativeEngine from '@cesdk/engine';
import { describe, expect, it, vi } from 'vitest';

import { resize } from '../../src/imgly/resizing';
import { DEFAULT_SIZES } from '../../src/imgly/sizes';

describe('AR-U9 resize', () => {
  it('fails loudly when the engine holds no scene after loading one', async () => {
    const engine = {
      scene: {
        saveToString: vi.fn(async () => 'scene'),
        load: vi.fn(async () => 0),
        getPages: () => [1],
        get: () => null
      },
      block: {
        resizeContentAware: vi.fn(),
        export: vi.fn()
      }
    } as unknown as CreativeEngine;

    await expect(
      resize({ engine, sizes: [DEFAULT_SIZES[0]], scene: 'scene' })
    ).rejects.toThrow('No scene available for export');
  });
});
