import { exerciseKeyboardCatalog } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it, vi } from 'vitest';

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

  it('saves the scene and the archive, and exports nothing else', () => {
    const exporting = result.actionIds.filter((id) =>
      /export|render/i.test(id)
    );
    expect(exporting).toEqual(['exportScene']);

    const entry = (keys: string) =>
      usAnsiCatalog.find((shortcut) => shortcut.keys === keys)!;
    expect(entry('Mod+s').run).toBe('saveScene');

    const run = vi.fn();
    const archive = entry('Mod+Shift+s').run;
    expect(typeof archive).toBe('function');
    (archive as (context: { cesdk: unknown }) => void)({
      cesdk: { actions: { run } }
    });
    expect(run.mock.calls).toEqual([['exportScene', { format: 'archive' }]]);
  });
});
