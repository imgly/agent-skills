import { exerciseKeyboardCatalog } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it } from 'vitest';

import { usAnsiCatalog as designUsAnsiCatalog } from '../../src/imgly/config/design/keyboard/catalogs/us-ansi';
import { usAnsiCatalog as videoUsAnsiCatalog } from '../../src/imgly/config/video/keyboard/catalogs/us-ansi';

const catalogs = [
  ['design us-ansi', designUsAnsiCatalog],
  ['video us-ansi', videoUsAnsiCatalog]
] as const;

describe.each(catalogs)('%s keyboard catalog', (_label, catalog) => {
  const result = exerciseKeyboardCatalog(catalog);

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
