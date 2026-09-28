import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupKeyboardShortcuts } from '../../src/imgly/config/keyboard/keyboard';
import { setupUI } from '../../src/imgly/config/ui';

describe('BGR-U6 setupUI', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupUI(spy.api);
  const targets = spy
    .callsTo('ui.setComponentOrder')
    .map(({ args }) => args[0] as { in: string });
  const positions = new Map(
    spy
      .callsTo('ui.setPanelPosition')
      .map(({ args }) => [args[0] as string, args[1]])
  );

  it('docks the inspector and the asset library on the left', () => {
    expect(positions.get('//ly.img.panel/inspector')).toBe('left');
    expect(positions.get('//ly.img.panel/assetLibrary')).toBe('left');
    expect(spy.callsTo('ui.setPanelFloating')).toHaveLength(2);
  });

  it('orders the navigation bar, the dock, the canvas and the inspector bar', () => {
    const ordered = new Set(targets.map((target) => target.in));
    expect(ordered).toContain('ly.img.navigation.bar');
    expect(ordered).toContain('ly.img.dock');
    expect(ordered).toContain('ly.img.canvas.menu');
    expect(ordered).toContain('ly.img.inspector.bar');
  });

  it('leaves the video timeline alone, as this is a design kit', () => {
    expect(targets.map((target) => target.in)).not.toContain(
      'ly.img.video.timeline'
    );
  });
});

describe('BGR-U7 setupKeyboardShortcuts', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupKeyboardShortcuts(spy.api);
  const catalog = spy.lastArgsOf('shortcuts.set')?.[0] as {
    keys: string;
    run: unknown;
  }[];

  it('sets one US ANSI catalog', () => {
    expect(spy.callsTo('shortcuts.set')).toHaveLength(1);
    expect(catalog.length).toBeGreaterThan(0);
    expect(catalog.map((shortcut) => shortcut.keys)).toContain('Mod+a');
  });

  it('gives every shortcut a key combination and something to run', () => {
    expect(
      catalog.filter((shortcut) => shortcut.keys === '' || shortcut.run == null)
    ).toEqual([]);
  });
});
