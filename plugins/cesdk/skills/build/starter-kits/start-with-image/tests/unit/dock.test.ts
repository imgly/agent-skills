import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupDock } from '../../src/imgly/config/ui/dock';
import { createDockContext } from './dock-context';

interface DockEntry {
  key: string;
  label?: string;
  entries?: string[];
  onClick?: () => void;
  isSelected?: () => boolean;
}

function dockEntries(context = createDockContext()): DockEntry[] {
  const orders: unknown[][] = [];
  context.cesdk.ui.setComponentOrder = (_target: unknown, order: unknown[]) =>
    orders.push(order);
  setupDock(context.cesdk);
  return orders[0] as DockEntry[];
}

/** Drops the settings `setupDock` writes, so `calls` holds the entry's own work. */
function entry(key: string, context = createDockContext()): DockEntry {
  const found = dockEntries(context).find((item) => item.key === key);
  if (found == null) {
    throw new Error(`No dock entry with key ${key}.`);
  }
  context.calls.length = 0;
  return found;
}

const LIBRARY_PANEL = '//ly.img.panel/assetLibrary';

describe('setupDock', () => {
  it('SWI-U2 orders the four photo tools before the three overlay libraries', () => {
    const spy = createApiSpy<CreativeEditorSDK>();
    setupDock(spy.api);
    const order = spy.lastArgsOf('ui.setComponentOrder')?.[1] as (
      | string
      | DockEntry
    )[];

    expect(
      order.map((item) => (typeof item === 'string' ? item : item.key))
    ).toEqual([
      'ly.img.spacer',
      'ly.img.crop',
      'ly.img.adjustment',
      'ly.img.filter',
      'ly.img.effects',
      'ly.img.separator',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.spacer'
    ]);
  });

  it('SWI-U2 names no image or upload library', () => {
    const libraries = dockEntries()
      .flatMap((item) => item.entries ?? [])
      .filter(Boolean);

    expect(libraries).not.toContain('ly.img.image');
    expect(libraries).not.toContain('ly.img.upload');
    expect(libraries).not.toContain('ly.img.image.upload');
  });

  it('SWI-U2 shows labels and large icons', () => {
    const context = createDockContext();
    dockEntries(context);

    expect(context.calls).toContain('setSetting dock/hideLabels=false');
    expect(context.calls).toContain('setSetting dock/iconSize=large');
  });
});

describe('the Crop entry', () => {
  it('SWI-U3 closes the panels, selects the page and enters crop mode', () => {
    const context = createDockContext({ editMode: 'Transform' });
    entry('ly.img.crop', context).onClick?.();

    expect(context.calls).toEqual([
      'closePanel *',
      'select 1',
      'setEditMode Crop'
    ]);
    expect(context.selected).toEqual([1]);
  });

  it('SWI-U3 returns to transform mode when it is already cropping', () => {
    const context = createDockContext({ editMode: 'Crop' });
    entry('ly.img.crop', context).onClick?.();

    expect(context.calls).toEqual(['setEditMode Transform']);
  });

  it('SWI-U3 does nothing when there is no current page', () => {
    const context = createDockContext({ currentPage: null });
    entry('ly.img.crop', context).onClick?.();

    expect(context.calls).toEqual([]);
    expect(context.editMode).toBe('Transform');
  });

  it('SWI-U3 reads its selected state from the crop panel', () => {
    const closed = createDockContext();
    expect(entry('ly.img.crop', closed).isSelected?.()).toBe(false);

    const open = createDockContext({
      open: [{ id: '//ly.img.panel/inspector/crop' }]
    });
    expect(entry('ly.img.crop', open).isSelected?.()).toBe(true);
  });
});

describe.each([
  ['ly.img.adjustment', '//ly.img.panel/inspector/adjustments'],
  ['ly.img.filter', '//ly.img.panel/inspector/filters'],
  ['ly.img.effects', '//ly.img.panel/inspector/effects']
])('the %s entry', (key, panelId) => {
  it('SWI-U4 opens its floating panel on the selected page', () => {
    const context = createDockContext();
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([
      'closePanel *',
      'setEditMode Transform',
      'select 1',
      `openPanel ${panelId}`
    ]);
  });

  it('SWI-U4 closes only that panel when it is already open', () => {
    const context = createDockContext({ open: [{ id: panelId }] });
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([`closePanel ${panelId}`]);
  });

  it('SWI-U4 reads its selected state from that panel', () => {
    expect(entry(key, createDockContext()).isSelected?.()).toBe(false);
    expect(
      entry(key, createDockContext({ open: [{ id: panelId }] })).isSelected?.()
    ).toBe(true);
  });

  it('SWI-U4 opens nothing when there is no current page', () => {
    const context = createDockContext({ currentPage: null });
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([]);
  });
});

describe.each([
  ['ly.img.text', 'ly.img.text', 'libraries.ly.img.text.label'],
  [
    'ly.img.vector.shape',
    'ly.img.vector.shape',
    'libraries.ly.img.vector.shape.label'
  ],
  ['ly.img.sticker', 'ly.img.sticker', 'libraries.ly.img.sticker.label']
])('the %s library entry', (key, library, title) => {
  const payload = { entries: [library], title };

  it('SWI-U5 opens the asset library with its own payload', () => {
    const context = createDockContext();
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([
      'closePanel *',
      `openPanel ${LIBRARY_PANEL}`
    ]);
    expect(context.open).toEqual([{ id: LIBRARY_PANEL, payload }]);
  });

  it('SWI-U5 closes the library when it already shows that payload', () => {
    const context = createDockContext({
      open: [{ id: LIBRARY_PANEL, payload }]
    });
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([`closePanel ${LIBRARY_PANEL}`]);
  });

  it('SWI-U5 reads its selected state from that payload', () => {
    expect(entry(key, createDockContext()).isSelected?.()).toBe(false);
    expect(
      entry(
        key,
        createDockContext({ open: [{ id: LIBRARY_PANEL, payload }] })
      ).isSelected?.()
    ).toBe(true);
    expect(
      entry(
        key,
        createDockContext({
          open: [
            { id: LIBRARY_PANEL, payload: { entries: ['other'], title: 'x' } }
          ]
        })
      ).isSelected?.()
    ).toBe(false);
  });

  it('SWI-U5 ignores the library when it shows another payload', () => {
    const context = createDockContext({
      open: [{ id: LIBRARY_PANEL, payload: { entries: ['other'], title: 'x' } }]
    });
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([
      'closePanel *',
      `openPanel ${LIBRARY_PANEL}`
    ]);
  });
});

describe.each([
  ['ly.img.text', 'ly.img.text', 'libraries.ly.img.text.label'],
  [
    'ly.img.vector.shape',
    'ly.img.vector.shape',
    'libraries.ly.img.vector.shape.label'
  ],
  ['ly.img.sticker', 'ly.img.sticker', 'libraries.ly.img.sticker.label']
])('the %s library entry', (key, library, title) => {
  const payload = { entries: [library], title };

  it('SWI-U5 opens the asset library with its own payload', () => {
    const context = createDockContext();
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([
      'closePanel *',
      `openPanel ${LIBRARY_PANEL}`
    ]);
    expect(context.open).toEqual([{ id: LIBRARY_PANEL, payload }]);
  });

  it('SWI-U5 closes the library when it already shows that payload', () => {
    const context = createDockContext({
      open: [{ id: LIBRARY_PANEL, payload }]
    });
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([`closePanel ${LIBRARY_PANEL}`]);
  });

  it('SWI-U5 ignores the library when it shows another payload', () => {
    const context = createDockContext({
      open: [{ id: LIBRARY_PANEL, payload: { entries: ['other'], title: 'x' } }]
    });
    entry(key, context).onClick?.();

    expect(context.calls).toEqual([
      'closePanel *',
      `openPanel ${LIBRARY_PANEL}`
    ]);
  });
});
