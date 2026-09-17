import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setupExportDesignPanel } from '../../src/imgly/plugins/export-design-panel';

const PANEL_ID = '//ly.img.panel/export';
const PAGES = [10, 20];
const PAGE_WIDTH = 800;
const PAGE_HEIGHT = 600;

interface BuilderCall {
  type: string;
  id: string;
  options: Record<string, any>;
}

/** Records what the panel asks the builder to render, children included. */
function createBuilder() {
  const calls: BuilderCall[] = [];
  const record = (type: string) => (id: string, options: any) => {
    calls.push({ type, id, options: options ?? {} });
    options?.children?.();
  };
  return {
    calls,
    builder: {
      Section: record('Section'),
      ButtonGroup: record('ButtonGroup'),
      Button: record('Button'),
      Text: record('Text'),
      TextInput: record('TextInput'),
      Select: record('Select'),
      NumberInput: record('NumberInput')
    }
  };
}

/** The panel's state, kept between renders the way the editor keeps it. */
function createState() {
  const values = new Map<string, unknown>();
  return <T>(id: string, initial: T) => {
    if (!values.has(id)) {
      values.set(id, initial);
    }
    return {
      get value() {
        return values.get(id) as T;
      },
      setValue: (next: T) => values.set(id, next)
    };
  };
}

function createHarness(scene: number | null = 1) {
  const exported: unknown[] = [];
  const visibility: [number, boolean][] = [];
  const engine = {
    scene: {
      get: () => scene,
      getPages: () => PAGES
    },
    block: {
      getFloat: (_id: number, property: string) => {
        if (property === 'scene/pageDimensions/width') return PAGE_WIDTH;
        if (property === 'scene/pageDimensions/height') return PAGE_HEIGHT;
        return 300;
      },
      getEnum: () => 'Pixel',
      setVisible: (id: number, visible: boolean) =>
        visibility.push([id, visible]),
      export: vi.fn(async (id: number, options: unknown) => {
        exported.push({ id, options });
        return new Blob(['bytes']);
      })
    }
  };
  const downloadFile = vi.fn(async () => undefined);
  const openPanel = vi.fn();
  const closePanel = vi.fn();
  let panelOpen = false;
  const registered = new Map<string, any>();
  const cesdk = {
    engine,
    utils: { downloadFile },
    i18n: { setTranslations: vi.fn() },
    ui: {
      isPanelOpen: () => panelOpen,
      openPanel,
      closePanel,
      registerPanel: (id: string, render: unknown) =>
        registered.set(id, render),
      registerComponent: (id: string, render: unknown) =>
        registered.set(id, render),
      setPanelPosition: vi.fn(),
      insertOrderComponent: vi.fn()
    }
  };

  setupExportDesignPanel(cesdk as unknown as CreativeEditorSDK);

  const state = createState();
  const render = () => {
    const { builder, calls } = createBuilder();
    registered.get(PANEL_ID)({ builder, engine, state });
    return calls;
  };
  const renderNavigationBar = () => {
    const { builder, calls } = createBuilder();
    registered.get('ly.img.export-options-design.navigationBar')({ builder });
    return calls;
  };
  return {
    render,
    renderNavigationBar,
    exported,
    visibility,
    downloadFile,
    openPanel,
    closePanel,
    setPanelOpen: (open: boolean) => {
      panelOpen = open;
    }
  };
}

function find(calls: BuilderCall[], id: string) {
  const call = calls.find((entry) => entry.id === id);
  if (call == null) {
    throw new Error(`The panel rendered no ${id}.`);
  }
  return call;
}

describe('EO-U8 the export panel', () => {
  it('offers the three formats, the page modes and the image settings', () => {
    const calls = createHarness().render();

    expect(find(calls, 'image/jpeg').options.isActive).toBe(true);
    expect(find(calls, 'format-description').options.content).toBe(
      'formats/image/jpeg.description'
    );
    expect(find(calls, 'all').options.isActive).toBe(true);
    expect(find(calls, 'quality').options.inputLabel).toBe('Quality');
    expect(find(calls, 'resolution').options.inputLabel).toBe('Resolution');
    expect(find(calls, 'resolution-description').options.content).toBe(
      `${PAGE_WIDTH} x ${PAGE_HEIGHT} px`
    );
    expect(calls.some((call) => call.id === 'page-range')).toBe(false);
  });

  it('hides the quality and resolution settings for PDF', () => {
    const kit = createHarness();
    find(kit.render(), 'application/pdf').options.onClick();

    const calls = kit.render();

    expect(find(calls, 'application/pdf').options.isActive).toBe(true);
    expect(calls.some((call) => call.id === 'export-quality')).toBe(false);
  });

  it('shows the range hint, and the error for a range no page matches', () => {
    const kit = createHarness();
    find(kit.render(), 'range').options.onClick();

    const hint = kit.render();
    expect(find(hint, 'page-range-info').options.content).toBe('e.g.: 1,1-2');

    find(hint, 'page-range').options.setValue('9-10');
    expect(find(kit.render(), 'page-range-info').options.content).toBe(
      'No page in that range'
    );

    find(kit.render(), 'page-range').options.setValue('abc');
    expect(find(kit.render(), 'page-range-info').options.content).toBe(
      'Invalid page range'
    );
  });

  it('keeps the aspect ratio when a custom resolution is typed', () => {
    const kit = createHarness();
    const resolution = find(kit.render(), 'resolution').options;
    resolution.setValue(resolution.values.at(-1));

    const custom = kit.render();
    expect(find(custom, 'resolution-description').options.content).toBe(
      `${PAGE_WIDTH} x ${PAGE_HEIGHT} px`
    );
    find(custom, 'custom-resolution-height').options.setValue(PAGE_HEIGHT * 2);
    let next = kit.render();
    expect(find(next, 'custom-resolution-width').options.value).toBe(
      PAGE_WIDTH * 2
    );
    expect(find(next, 'resolution-description').options.content).toBe(
      `${PAGE_WIDTH * 2} x ${PAGE_HEIGHT * 2} px`
    );

    find(next, 'custom-resolution-width').options.setValue(PAGE_WIDTH / 2);
    next = kit.render();
    expect(find(next, 'custom-resolution-height').options.value).toBe(
      PAGE_HEIGHT / 2
    );
    expect(find(next, 'custom-resolution-width').options.max).toBe(4000);
  });

  it('exports one image per page and downloads each one', async () => {
    const kit = createHarness();

    await find(kit.render(), 'export').options.onClick();

    expect(kit.exported).toHaveLength(PAGES.length);
    expect(kit.exported[0]).toEqual({
      id: PAGES[0],
      options: {
        mimeType: 'image/jpeg',
        targetWidth: PAGE_WIDTH,
        targetHeight: PAGE_HEIGHT,
        jpegQuality: expect.any(Number),
        pngCompressionLevel: expect.any(Number)
      }
    });
    expect(kit.downloadFile).toHaveBeenCalledTimes(PAGES.length);
    expect(kit.downloadFile).toHaveBeenLastCalledWith(
      expect.any(Blob),
      'image/jpeg'
    );
  });

  it('exports one PDF for the whole scene and restores the hidden pages', async () => {
    const kit = createHarness();
    find(kit.render(), 'application/pdf').options.onClick();
    const pdf = kit.render();
    find(pdf, 'range').options.onClick();
    find(kit.render(), 'page-range').options.setValue('1');

    await find(kit.render(), 'export').options.onClick();

    expect(kit.exported).toEqual([
      { id: 1, options: { mimeType: 'application/pdf' } }
    ]);
    expect(kit.visibility).toEqual([
      [PAGES[1], false],
      [PAGES[1], true]
    ]);
    expect(kit.downloadFile).toHaveBeenCalledTimes(1);
  });

  it('exports nothing while the range is invalid', async () => {
    const kit = createHarness();
    find(kit.render(), 'range').options.onClick();
    find(kit.render(), 'page-range').options.setValue('abc');

    await find(kit.render(), 'export').options.onClick();

    expect(kit.exported).toEqual([]);
    expect(kit.downloadFile).not.toHaveBeenCalled();
  });

  it('exports nothing when there is no scene', async () => {
    const kit = createHarness(null);

    const calls = kit.render();
    expect(calls.some((call) => call.id === 'resolution-description')).toBe(
      true
    );

    await find(calls, 'export').options.onClick();

    expect(kit.exported).toEqual([]);
    expect(kit.downloadFile).not.toHaveBeenCalled();
  });
});

describe('EO-U9 the navigation bar export button', () => {
  let kit: ReturnType<typeof createHarness>;

  beforeEach(() => {
    kit = createHarness();
  });

  it('opens the panel when it is closed', () => {
    find(kit.renderNavigationBar(), 'export-button').options.onClick();

    expect(kit.openPanel).toHaveBeenCalledWith(PANEL_ID);
    expect(kit.closePanel).not.toHaveBeenCalled();
  });

  it('closes the panel when it is open', () => {
    kit.setPanelOpen(true);

    find(kit.renderNavigationBar(), 'export-button').options.onClick();

    expect(kit.closePanel).toHaveBeenCalledWith(PANEL_ID);
    expect(kit.openPanel).not.toHaveBeenCalled();
  });
});
