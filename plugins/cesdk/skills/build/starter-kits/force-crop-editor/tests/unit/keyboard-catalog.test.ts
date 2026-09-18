import { exerciseKeyboardCatalog } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it } from 'vitest';

import { usAnsiCatalog } from '../../src/imgly/config/keyboard/catalogs/us-ansi';

describe('us-ansi keyboard catalog', () => {
  const result = exerciseKeyboardCatalog(usAnsiCatalog);

  it('resolves every shortcut in every editor state', () => {
    expect(result.failures).toEqual([]);
  });

  it('activates every shortcut in at least one editor state', () => {
    expect(result.neverActive).toEqual([]);
  });

  it('dispatches an action from every shortcut that runs code', () => {
    expect(result.runsWithoutSdkCall).toEqual([]);
  });
});
