import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock
} from 'vitest';

import { createCesdkDouble, PanelHarness } from './export-panel';

const exportHtml = vi.hoisted(() => vi.fn());
const injectGsapPlayer = vi.hoisted(() => vi.fn(() => '<html>player</html>'));

vi.mock('@imgly/html-exporter', () => ({ exportHtml, injectGsapPlayer }));

const PANEL_ID = '//ly.img.panel/html5-export';

function exportResult(files: Map<string, { content: string | Uint8Array }>) {
  return {
    files: Object.assign(files, {
      toZip: async () => new Uint8Array([80, 75])
    }),
    messages: []
  };
}

function htmlResult(content: string | Uint8Array = '<html>banner</html>') {
  return exportResult(new Map([['index.html', { content }]]));
}

async function openPanel(pageCount: number): Promise<{
  panel: PanelHarness;
  double: ReturnType<typeof createCesdkDouble>;
}> {
  const { Html5ExportPanelPlugin } =
    await import('../../src/imgly/plugins/html5-export-panel');
  const double = createCesdkDouble();
  await new Html5ExportPanelPlugin().initialize({
    cesdk: double.cesdk as unknown as CreativeEditorSDK
  } as never);

  const panel = new PanelHarness(double.panels.get(PANEL_ID)!, pageCount);
  panel.run();
  return { panel, double };
}

beforeEach(() => {
  exportHtml.mockReset();
  injectGsapPlayer.mockClear();
  exportHtml.mockResolvedValue(htmlResult());
  vi.stubGlobal('URL', { createObjectURL: () => 'blob:kit/1' });
  vi.stubGlobal('window', { open: vi.fn() });
  vi.stubGlobal('document', {
    createElement: () => ({
      setAttribute: vi.fn(),
      style: {},
      click: vi.fn()
    }),
    body: { appendChild: vi.fn(), removeChild: vi.fn() }
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('H5-U1 panel structure', () => {
  it('offers the two formats in order, with a description under them', async () => {
    const { panel } = await openPanel(1);

    expect(panel.find('format').children.map(({ id }) => id)).toEqual([
      'embedded',
      'external'
    ]);
    expect(panel.find('embedded').options.label).toBe(
      'html5-export.format/embedded'
    );
    expect(panel.find('format-description').options.content).toBe(
      'html5-export.format/embedded.description'
    );
  });

  it('offers the two text modes in order, with a description under them', async () => {
    const { panel } = await openPanel(1);

    expect(panel.find('textMode').children.map(({ id }) => id)).toEqual([
      'html',
      'vector'
    ]);
    expect(panel.find('text-mode-description').options.content).toBe(
      'html5-export.textMode/html.description'
    );
  });

  it('defaults to embedded and HTML text', async () => {
    const { panel } = await openPanel(1);

    expect(panel.find('embedded').options.isActive).toBe(true);
    expect(panel.find('external').options.isActive).toBe(false);
    expect(panel.find('html').options.isActive).toBe(true);
    expect(panel.find('vector').options.isActive).toBe(false);
  });

  it('moves the active state and the description with the selection', async () => {
    const { panel } = await openPanel(1);

    await panel.click('external');
    expect(panel.find('external').options.isActive).toBe(true);
    expect(panel.find('embedded').options.isActive).toBe(false);
    expect(panel.find('format-description').options.content).toBe(
      'html5-export.format/external.description'
    );

    await panel.click('vector');
    expect(panel.find('vector').options.isActive).toBe(true);
    expect(panel.find('text-mode-description').options.content).toBe(
      'html5-export.textMode/vector.description'
    );

    await panel.click('embedded');
    expect(panel.find('embedded').options.isActive).toBe(true);
  });

  it('offers both export actions', async () => {
    const { panel } = await openPanel(1);

    expect(panel.find('export-preview').options.label).toBe('Export & Preview');
    expect(panel.find('download-zip').options.label).toBe('Download ZIP');
  });
});

describe('H5-U2 the page section follows the page count', () => {
  it('hides the page controls on a single-page scene', async () => {
    const { panel } = await openPanel(1);

    expect(panel.has('page-section')).toBe(false);
    expect(panel.has('pageIndex')).toBe(false);
  });

  it('shows a one-based page input on a multi-page scene', async () => {
    const { panel } = await openPanel(3);

    expect(panel.find('pageIndex').options).toMatchObject({
      min: 1,
      max: 3,
      step: 1,
      value: 1
    });
    expect(panel.find('page-info').options.content).toBe('Page 1 of 3');
  });

  it('clamps a page number outside the scene', async () => {
    const { panel } = await openPanel(3);
    const setValue = () => panel.find('pageIndex').options.setValue as Mock;

    (setValue() as unknown as (value: number) => void)(5);
    panel.run();
    expect(panel.find('page-info').options.content).toBe('Page 3 of 3');

    (setValue() as unknown as (value: number) => void)(0);
    panel.run();
    expect(panel.find('page-info').options.content).toBe('Page 1 of 3');
  });
});

describe('H5-U3 the options each action passes to the exporter', () => {
  it('previews the design as a self-contained document', async () => {
    const { panel } = await openPanel(1);

    await panel.click('export-preview');

    expect(exportHtml.mock.calls[0][1]).toEqual({
      format: 'embedded',
      pageIndex: 0,
      textMode: 'html',
      animated: true
    });
  });

  it('keeps previewing embedded when External is selected', async () => {
    const { panel } = await openPanel(1);

    await panel.click('external');
    await panel.click('export-preview');

    expect(exportHtml.mock.calls[0][1]).toMatchObject({ format: 'embedded' });
  });

  it('downloads the ZIP in the selected format', async () => {
    const { panel } = await openPanel(1);

    await panel.click('download-zip');
    expect(exportHtml.mock.calls[0][1]).toMatchObject({ format: 'embedded' });

    await panel.click('external');
    await panel.click('download-zip');
    expect(exportHtml.mock.calls[1][1]).toMatchObject({ format: 'external' });
  });

  it('passes the selected text mode and page to both actions', async () => {
    const { panel } = await openPanel(3);

    await panel.click('vector');
    (
      panel.find('pageIndex').options.setValue as unknown as (
        value: number
      ) => void
    )(3);
    panel.run();

    await panel.click('export-preview');
    await panel.click('download-zip');

    for (const call of exportHtml.mock.calls) {
      expect(call[1]).toMatchObject({
        textMode: 'vector',
        pageIndex: 2,
        animated: true
      });
    }
  });
});

describe('H5-U4 preview output handling', () => {
  it('adds an autoplaying GSAP player and opens the result in a tab', async () => {
    const { panel } = await openPanel(1);

    await panel.click('export-preview');

    expect(injectGsapPlayer).toHaveBeenCalledWith('<html>banner</html>', {
      autoplay: true
    });
    expect(window.open).toHaveBeenCalledWith('blob:kit/1', '_blank');
  });

  it('decodes an index.html that comes back as bytes', async () => {
    exportHtml.mockResolvedValue(
      htmlResult(new TextEncoder().encode('<html>bytes</html>'))
    );
    const { panel } = await openPanel(1);

    await panel.click('export-preview');

    expect(injectGsapPlayer).toHaveBeenCalledWith('<html>bytes</html>', {
      autoplay: true
    });
  });

  it('reports an export that produced no HTML file', async () => {
    exportHtml.mockResolvedValue(exportResult(new Map()));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { panel } = await openPanel(1);

    await panel.click('export-preview');

    expect(consoleError.mock.calls[0][1]).toEqual(
      new Error('Export did not produce an HTML file')
    );
    expect(window.open).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('H5-U5 loading state', () => {
  it('disables both buttons and spins only the one that runs', async () => {
    let release: ((value: unknown) => void) | undefined;
    exportHtml.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      })
    );
    const { panel } = await openPanel(1);

    const pending = (
      panel.find('export-preview').options.onClick as () => Promise<void>
    )();
    panel.run();
    expect(panel.find('export-preview').options.isLoading).toBe(true);
    expect(panel.find('export-preview').options.isDisabled).toBe(true);
    expect(panel.find('download-zip').options.isLoading).toBe(false);
    expect(panel.find('download-zip').options.isDisabled).toBe(true);

    release!(htmlResult());
    await pending;
    panel.run();
    expect(panel.find('export-preview').options.isDisabled).toBe(false);
    expect(panel.find('download-zip').options.isDisabled).toBe(false);
  });

  it('frees both buttons again after a failed export', async () => {
    exportHtml.mockRejectedValue(new Error('boom'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { panel } = await openPanel(1);

    await panel.click('download-zip');

    expect(panel.find('download-zip').options.isDisabled).toBe(false);
    expect(panel.find('export-preview').options.isDisabled).toBe(false);
    consoleError.mockRestore();
  });
});

describe('H5-U6 translations and placement', () => {
  it('translates the panel title, both formats and both text modes', async () => {
    const { double } = await openPanel(1);
    const en = (double.translations[0] as { en: Record<string, string> }).en;

    expect(en[`panel.${PANEL_ID}`]).toBe('Export HTML5');
    expect(en['html5-export.format/embedded']).toBe('Embedded');
    expect(en['html5-export.format/external']).toBe('External');
    expect(en['html5-export.textMode/html']).toBe('HTML Text');
    expect(en['html5-export.textMode/vector']).toBe('Vector');
    expect(en['html5-export.format/embedded.description']).toBe(
      'Single self-contained HTML file with base64-embedded assets'
    );
    expect(en['html5-export.textMode/vector.description']).toBe(
      'Pixel-perfect vectorized text (not selectable)'
    );
  });

  it('docks the panel on the right and puts its button last in the navigation bar', async () => {
    const { double } = await openPanel(1);

    expect(double.panelPositions).toEqual([[PANEL_ID, 'right']]);
    expect(double.components.has('ly.img.html5-export.navigationBar')).toBe(
      true
    );
    expect(double.inserted).toEqual([
      [
        { in: 'ly.img.navigation.bar', position: 'end' },
        { id: 'ly.img.html5-export.navigationBar' }
      ]
    ]);
  });
});

describe('H5-U15 exporter warnings and the engine-only host', () => {
  it('logs every message the exporter returns, for both actions', async () => {
    exportHtml.mockResolvedValue({
      ...htmlResult(),
      messages: [{ type: 'warning', message: 'font missing' }]
    });
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const { panel } = await openPanel(1);

    await panel.click('export-preview');
    expect(log).toHaveBeenCalledWith('[warning] font missing');

    log.mockClear();
    await panel.click('download-zip');
    expect(log).toHaveBeenCalledWith('[warning] font missing');
    log.mockRestore();
  });

  it('registers nothing when the host runs the engine alone', async () => {
    const { Html5ExportPanelPlugin } =
      await import('../../src/imgly/plugins/html5-export-panel');
    const engine = createApiSpy<CreativeEngine>();
    await new Html5ExportPanelPlugin().initialize({
      engine: engine.api
    } as never);

    expect(engine.calls).toEqual([]);
  });
});
