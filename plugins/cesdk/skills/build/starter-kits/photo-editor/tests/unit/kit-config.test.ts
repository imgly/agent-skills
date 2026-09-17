import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { initPhotoEditor } from '../../src/imgly';

const spy = createApiSpy<CreativeEditorSDK>();

beforeAll(async () => {
  await initPhotoEditor(spy.api);
});

/** The plugin's own `name`; the class names are minified in the built bundle. */
function pluginNames(): string[] {
  return spy
    .callsTo('addPlugin')
    .map(({ args }) => (args[0] as { name: string }).name);
}

function insertsInto(location: string): unknown[] {
  return spy
    .callsTo('ui.insertOrderComponent')
    .map(({ args }) => args)
    .find(([position]) => (position as { in: string }).in === location)!;
}

// PE-U1
describe('initPhotoEditor plugin order', () => {
  it('adds the photo editor configuration first', () => {
    expect(pluginNames()[0]).toBe('cesdk-photo-editor');
  });

  it('adds the twelve asset sources in order, before background removal', () => {
    expect(pluginNames().slice(1)).toEqual([
      'cesdk-blur-asset-source',
      'cesdk-image-colors-asset-source',
      'cesdk-color-palette-asset-source',
      'cesdk-crop-presets-asset-source',
      'cesdk-effects-asset-source',
      'cesdk-filters-asset-source',
      'cesdk-page-presets-asset-source',
      'cesdk-sticker-asset-source',
      'cesdk-text-asset-source',
      'cesdk-text-component-asset-source',
      'cesdk-typeface-asset-source',
      'cesdk-vectorshape-asset-source',
      '@imgly/plugin-background-removal-web'
    ]);
  });

  it('PE-U1 registers the twelve asset sources in one concurrent batch', async () => {
    const pending: Array<() => void> = [];
    const addPlugin = vi.fn(
      () => new Promise<void>((resolve) => pending.push(resolve))
    );
    const cesdk = {
      addPlugin,
      i18n: { setTranslations: vi.fn() },
      ui: { insertOrderComponent: vi.fn() }
    } as unknown as CreativeEditorSDK;

    const done = initPhotoEditor(cesdk);
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(1));

    pending.shift()!();
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(13));

    while (pending.length > 0) {
      pending.shift()!();
    }
    await vi.waitFor(() => expect(addPlugin).toHaveBeenCalledTimes(14));
    pending.shift()!();
    await done;
  });

  it('installs no upload, demo or premium template source', () => {
    expect(
      pluginNames().filter((name) => /upload|demo|premium/.test(name))
    ).toEqual([]);
  });

  it('sets neither the role nor the theme', () => {
    expect(spy.callsTo('engine.editor.setRole')).toEqual([]);
    expect(spy.callsTo('ui.setTheme')).toEqual([]);
  });
});

// PE-U2
describe('translation and export button', () => {
  it('translates the export label the button uses', () => {
    expect(spy.lastArgsOf('i18n.setTranslations')?.[0]).toEqual({
      en: { 'actions.export.image': 'Export Image' }
    });
  });

  it('appends an accent action button to the navigation bar', () => {
    const [location, component] = insertsInto('ly.img.navigation.bar');

    expect(location).toEqual({ in: 'ly.img.navigation.bar', position: 'end' });
    expect(component).toMatchObject({
      id: 'ly.img.action.navigationBar',
      key: 'actions.export.image',
      color: 'accent',
      icon: '@imgly/Image',
      label: 'actions.export.image'
    });
  });

  it('runs exportDesign as a PNG with no target size', async () => {
    const [, component] = insertsInto('ly.img.navigation.bar');

    await (component as { onClick: () => Promise<void> }).onClick();

    expect(spy.lastArgsOf('actions.run')).toEqual([
      'exportDesign',
      { mimeType: 'image/png' }
    ]);
  });
});

// PE-U3
describe('background removal', () => {
  it('installs the plugin last, so its dock entry exists to be placed', () => {
    expect(pluginNames().at(-1)).toBe('@imgly/plugin-background-removal-web');
  });

  it('places the plugin dock entry after the effects entry', () => {
    const [location, component] = insertsInto('ly.img.dock');

    expect(location).toEqual({
      in: 'ly.img.dock',
      after: { key: 'ly.img.effects' }
    });
    expect(component).toBe('@imgly/plugin-background-removal-web.dock');
  });
});
