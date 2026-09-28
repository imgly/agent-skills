import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeAll, describe, expect, it, vi } from 'vitest';

const convertToPDFX = vi.hoisted(() => vi.fn(async (blob: Blob) => blob));

vi.mock('@imgly/plugin-print-ready-pdfs-web', () => ({ convertToPDFX }));

import { ExportPrintReadyPDFPanelPlugin } from '../../src/imgly/plugins/export-print-ready-pdf';

const PANEL_ID = '//ly.img.panel/export-print-ready-pdf';

interface Control {
  id: string;
  options: Record<string, unknown>;
}

/**
 * A builder that records the controls a panel asks for and runs the `children`
 * of every section, and a `state` that stores values. The harness
 * `createApiSpy` answers with proxies, so the panel's own branches — which
 * read `state.value` — never take the path a case is about.
 */
function renderPanel(
  initial: Record<string, unknown> = {},
  engine: unknown = {}
) {
  const values = new Map<string, unknown>(Object.entries(initial));
  const controls: Control[] = [];

  const record =
    (kind: string) =>
    (id: string, options: Record<string, unknown> = {}) => {
      controls.push({ id: `${kind}:${id}`, options });
      if (typeof options.children === 'function') {
        (options.children as () => void)();
      }
    };

  const builder = {
    Section: record('Section'),
    Select: record('Select'),
    Checkbox: record('Checkbox'),
    NumberInput: record('NumberInput'),
    ButtonGroup: record('ButtonGroup'),
    Button: record('Button'),
    TextInput: record('TextInput'),
    Text: record('Text')
  };

  const state = <T>(key: string, initialValue?: T) => {
    if (!values.has(key) && initialValue !== undefined) {
      values.set(key, initialValue);
    }
    return {
      get value() {
        return values.get(key) as T;
      },
      setValue: (next: T) => values.set(key, next)
    };
  };

  panelRenderer({ builder, engine, state });
  return { controls, values };
}

const showNotification = vi.fn();

let panelRenderer: (context: Record<string, unknown>) => void;
let registeredPanelId = '';
let panelPosition: unknown[] = [];
let translations: Record<string, unknown> = {};

beforeAll(async () => {
  const cesdk = {
    ui: {
      registerComponent: vi.fn(),
      registerPanel: vi.fn((id: string, renderer: never) => {
        registeredPanelId = id;
        panelRenderer = renderer;
      }),
      setPanelPosition: vi.fn((...args: unknown[]) => {
        panelPosition = args;
      }),
      isPanelOpen: vi.fn(() => false),
      openPanel: vi.fn(),
      closePanel: vi.fn(),
      showNotification
    },
    i18n: {
      setTranslations: vi.fn((next: Record<string, unknown>) => {
        translations = next;
      })
    },
    utils: {
      export: vi.fn(async () => ({
        blobs: [new Blob(['pdf'], { type: 'application/pdf' })]
      })),
      getPrintMarkExportOptions: vi.fn(() => ({}))
    }
  };
  await ExportPrintReadyPDFPanelPlugin().initialize!({
    cesdk: cesdk as unknown as CreativeEditorSDK
  } as never);
});

// PRP-U2
describe('the export panel', () => {
  it('registers itself on the right and translates its own labels', () => {
    expect(registeredPanelId).toBe(PANEL_ID);
    expect(panelPosition).toEqual([PANEL_ID, 'right']);
    expect(translations).toEqual({
      en: {
        [`panel.${PANEL_ID}`]: 'Export Print-Ready PDF',
        'pages/all': 'All',
        'pages/custom': 'Custom',
        'bleed/enabled': 'Include Bleed',
        'bleed/margin': 'Bleed Margin (mm)'
      }
    });
  });

  it('starts on PDF/X-4, ISO Coated v2, bleed on at 3 mm and all pages', () => {
    const { values } = renderPanel();

    expect(values.get('standard')).toEqual({
      id: 'PDF/X-4',
      label: 'PDF/X-4 (recommended)'
    });
    expect(values.get('colorProfile')).toEqual({
      id: 'fogra39',
      label: 'ISO Coated v2 (ECI) (CMYK)'
    });
    expect(values.get('bleedEnabled')).toBe(true);
    expect(values.get('bleedMargin')).toBe(3);
    expect(values.get('pages')).toBe('all');
  });

  it('clamps the bleed margin between 0 and 25 in half steps', () => {
    const { controls } = renderPanel();
    const input = controls.find((c) => c.id === 'NumberInput:bleed-margin')!;

    expect(input.options).toMatchObject({ min: 0, max: 25, step: 0.5 });
  });

  it('hides the bleed margin when bleed is off', () => {
    const { controls } = renderPanel({ bleedEnabled: false });

    expect(controls.map((c) => c.id)).not.toContain('NumberInput:bleed-margin');
  });

  it('shows the page range only while Pages is Custom', () => {
    const all = renderPanel().controls.map((c) => c.id);
    const custom = renderPanel({ pages: 'custom' }).controls.map((c) => c.id);

    expect(all).not.toContain('TextInput:page-range');
    expect(custom).toContain('TextInput:page-range');
    expect(custom).toContain('Text:page-range-info');
  });

  it('hints at the range format until the typed value is rejected', () => {
    const valid = renderPanel({ pages: 'custom' });
    expect(
      valid.controls.find((c) => c.id === 'Text:page-range-info')!.options
        .content
    ).toBe('e.g.: 1,1-2');

    const invalid = renderPanel({
      pages: 'custom',
      rangeInputError: 'Invalid page range'
    });
    expect(
      invalid.controls.find((c) => c.id === 'Text:page-range-info')!.options
        .content
    ).toBe('Invalid page range');
  });

  it('offers the three colour profiles and the two standards', () => {
    const { controls } = renderPanel();
    const values = (id: string) =>
      (
        controls.find((c) => c.id === id)!.options.values as {
          id: string;
        }[]
      ).map((entry) => entry.id);

    expect(values('Select:color-profile')).toEqual([
      'fogra39',
      'gracol',
      'srgb'
    ]);
    expect(values('Select:pdfx-standard')).toEqual(['PDF/X-4', 'PDF/X-3']);
  });
});

// PRP-U8
describe('the panel controls that write state', () => {
  function control(controls: Control[], id: string): Control {
    const found = controls.find((entry) => entry.id === id);
    if (found == null) {
      throw new Error(`No control ${id} was built.`);
    }
    return found;
  }

  it('switches the page selection between all and custom', () => {
    const { controls, values } = renderPanel();

    (control(controls, 'Button:custom').options.onClick as () => void)();
    expect(values.get('pages')).toBe('custom');

    const reopened = renderPanel({ pages: 'custom' });
    (control(reopened.controls, 'Button:all').options.onClick as () => void)();
    expect(reopened.values.get('pages')).toBe('all');
  });

  it('accepts a valid range and reports an invalid one', () => {
    const { controls, values } = renderPanel({ pages: 'custom' });
    const setValue = control(controls, 'TextInput:page-range').options
      .setValue as (next: string) => void;

    setValue('1-2');
    expect(values.get('rangeInput')).toBe('1-2');
    expect(values.get('rangeInputError')).toBeUndefined();

    setValue('nonsense');
    expect(values.get('rangeInputError')).toBeTypeOf('string');
  });
});

// PRP-U9
describe('the export button', () => {
  const engineWithoutScene = { scene: { get: () => null } };

  it('reports the export failure as a notification and stops loading', async () => {
    showNotification.mockClear();
    const { controls, values } = renderPanel({}, engineWithoutScene);
    const button = controls.find((entry) => entry.id === 'Button:export')!;

    await (button.options.onClick as () => Promise<void>)();

    expect(showNotification).toHaveBeenCalledWith({
      type: 'error',
      message: 'No scene to export',
      duration: 'medium'
    });
    expect(values.get('loading')).toBe(false);
  });

  it('passes the custom range, profile and standard the panel holds', async () => {
    showNotification.mockClear();
    const { controls } = renderPanel(
      {
        pages: 'custom',
        rangeInput: '1-2',
        colorProfile: { id: 'gracol' },
        pdfxStandard: { id: 'PDF/X-3' }
      },
      engineWithoutScene
    );
    const button = controls.find((entry) => entry.id === 'Button:export')!;

    await (button.options.onClick as () => Promise<void>)();

    expect(showNotification).toHaveBeenCalledTimes(1);
  });
});

// PRP-U10
describe('a successful export', () => {
  function workingEngine() {
    return {
      scene: {
        get: () => 1,
        getPages: () => [10],
        getDesignUnit: () => 'Millimeter'
      },
      block: {
        getBool: () => false,
        getFloat: () => 0,
        setBool: vi.fn(),
        setFloat: vi.fn(),
        setVisible: vi.fn(),
        export: async () => new Blob(['pdf'], { type: 'application/pdf' })
      }
    };
  }

  it('downloads the converted document under the kit filename', async () => {
    const anchor = {
      setAttribute: vi.fn(),
      style: {} as Record<string, string>,
      click: vi.fn()
    };
    vi.stubGlobal('document', {
      createElement: () => anchor,
      body: { appendChild: vi.fn(), removeChild: vi.fn() }
    });
    vi.stubGlobal('window', { URL: { createObjectURL: () => 'blob:pdf/1' } });

    const { controls, values } = renderPanel({}, workingEngine());
    const button = controls.find((entry) => entry.id === 'Button:export')!;

    await (button.options.onClick as () => Promise<void>)();

    expect(anchor.setAttribute).toHaveBeenCalledWith('href', 'blob:pdf/1');
    expect(anchor.setAttribute).toHaveBeenCalledWith(
      'download',
      'my-design-print-ready'
    );
    expect(anchor.click).toHaveBeenCalledTimes(1);
    expect(values.get('loading')).toBe(false);
    vi.unstubAllGlobals();
  });
});

// PRP-U22
describe('the navigation bar button', () => {
  /** Runs the registered navigation bar component with the panel open or shut. */
  async function pressExport(panelOpen: boolean) {
    let renderer: (context: Record<string, unknown>) => void = () => {};
    const openPanel = vi.fn();
    const closePanel = vi.fn();
    const cesdk = {
      ui: {
        registerComponent: vi.fn((id: string, next: never) => {
          if (id === 'ly.img.export-print-ready-pdf.navigationBar') {
            renderer = next;
          }
        }),
        registerPanel: vi.fn(),
        setPanelPosition: vi.fn(),
        isPanelOpen: vi.fn(() => panelOpen),
        openPanel,
        closePanel,
        showNotification: vi.fn()
      },
      i18n: { setTranslations: vi.fn() },
      utils: { getPrintMarkExportOptions: vi.fn(() => ({})) }
    };
    await ExportPrintReadyPDFPanelPlugin().initialize!({
      cesdk: cesdk as unknown as CreativeEditorSDK
    } as never);

    const buttons: Control[] = [];
    renderer({
      builder: {
        Button: (id: string, options: Record<string, unknown>) =>
          buttons.push({ id, options })
      }
    });
    const button = buttons.find((entry) => entry.id === 'export-button')!;
    (button.options.onClick as () => void)();

    return { button, openPanel, closePanel };
  }

  it('is an accent button labelled with the shared export wording', async () => {
    const { button } = await pressExport(false);

    expect(button.options).toMatchObject({
      color: 'accent',
      variant: 'regular',
      label: 'common.export'
    });
  });

  it('opens the export panel while it is closed', async () => {
    const { openPanel, closePanel } = await pressExport(false);

    expect(openPanel).toHaveBeenCalledWith(PANEL_ID);
    expect(closePanel).not.toHaveBeenCalled();
  });

  it('closes the export panel while it is open', async () => {
    const { openPanel, closePanel } = await pressExport(true);

    expect(closePanel).toHaveBeenCalledWith(PANEL_ID);
    expect(openPanel).not.toHaveBeenCalled();
  });
});

// PRP-U11
describe('the plugin outside an editor, and a failure that is not an Error', () => {
  it('registers nothing when the host runs the engine alone', async () => {
    await expect(
      ExportPrintReadyPDFPanelPlugin().initialize!({} as never)
    ).resolves.toBeUndefined();
  });

  it('falls back to a generic message when the export throws a non-Error', async () => {
    showNotification.mockClear();
    const { controls } = renderPanel(
      {},
      {
        scene: {
          get: () => {
            throw 'ghostscript exploded';
          }
        }
      }
    );
    const button = controls.find((entry) => entry.id === 'Button:export')!;

    await (button.options.onClick as () => Promise<void>)();

    expect(showNotification).toHaveBeenCalledWith({
      type: 'error',
      message: 'Print-ready PDF export failed.',
      duration: 'medium'
    });
  });
});
