import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { fileURLToPath } from 'node:url';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { exportPrintReadyPDF } from '../../src/imgly/plugins/export-print-ready-pdf';

const SCENE = fileURLToPath(
  new URL('../../public/assets/example-1.scene', import.meta.url)
);

const MARGINS = [
  'page/margin/top',
  'page/margin/bottom',
  'page/margin/left',
  'page/margin/right'
];

interface PDFXOptions {
  outputProfile: string;
  outputStandard: string;
  title: string;
}

// The plugin runs Ghostscript on a WASM payload; what it produces is the
// plugin's decision, so these cases record the options it is handed.
const convertToPDFX = vi.fn(
  async (pdf: Blob, _options: PDFXOptions) =>
    new Blob([await pdf.arrayBuffer()], { type: 'application/pdf' })
);
vi.mock('@imgly/plugin-print-ready-pdfs-web', () => ({
  convertToPDFX: (...args: unknown[]) =>
    (convertToPDFX as unknown as (...a: unknown[]) => Promise<Blob>)(...args)
}));

let raw: TestEngine;
let engine: CreativeEngine;

const DEFAULTS = {
  pageRange: '',
  colorProfile: 'fogra39',
  outputStandard: 'PDF/X-4',
  bleedEnabled: true,
  bleedMargin: 3
} as const;

function margins(pageId: number): number[] {
  return MARGINS.map((property) => engine.block.getFloat(pageId, property));
}

/**
 * Read the scene while the kit is mid-export. The property is typed locally
 * because the deprecation lint cannot tell the two `block.export` overloads
 * apart and reports the non-deprecated one.
 */
interface BlockExportApi {
  export: (block: number, options: Record<string, unknown>) => Promise<Blob>;
}

async function duringExport<T>(
  read: () => T,
  run: () => Promise<unknown>
): Promise<{
  captured: T | undefined;
  options: Record<string, unknown> | undefined;
}> {
  const api = engine.block as unknown as BlockExportApi;
  const original = api.export.bind(api);
  let captured: T | undefined;
  let options: Record<string, unknown> | undefined;
  api.export = async (block, exportOptions) => {
    captured = read();
    options = exportOptions;
    return original(block, exportOptions);
  };
  try {
    await run();
  } finally {
    api.export = original;
  }
  return { captured, options };
}

beforeAll(async () => {
  raw = await createTestEngine();
  engine = raw as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

beforeEach(async () => {
  // The engine is a process-wide singleton, so every case starts from a
  // freshly loaded scene rather than from what the previous one left.
  await loadScene(raw, SCENE);
  convertToPDFX.mockClear();
});

describe('the demo scene', () => {
  it('is two pages of pixels at 300 dpi', () => {
    expect(engine.scene.getPages()).toHaveLength(2);
    expect(engine.scene.getDesignUnit()).toBe('Pixel');
    expect(engine.block.getFloat(engine.scene.get()!, 'scene/dpi')).toBe(300);
  });
});

// PRP-H1
describe('bleed margins', () => {
  it('converts millimetres through the design unit and the dpi', async () => {
    const { captured } = await duringExport(
      () => engine.scene.getPages().map((id) => margins(id)),
      () => exportPrintReadyPDF(engine, DEFAULTS)
    );
    const applied = captured!;

    // 3 mm at 300 dpi is 3 / 25.4 * 300 px.
    const expected = (3 / 25.4) * 300;
    for (const page of applied) {
      for (const margin of page) {
        expect(margin).toBeCloseTo(expected, 2);
      }
    }
  });

  it('restores the margins the scene had before the export', async () => {
    const pages = engine.scene.getPages();
    const before = pages.map((id) => margins(id));
    const enabledBefore = pages.map((id) =>
      engine.block.getBool(id, 'page/marginEnabled')
    );

    await exportPrintReadyPDF(engine, DEFAULTS);

    expect(pages.map((id) => margins(id))).toEqual(before);
    expect(
      pages.map((id) => engine.block.getBool(id, 'page/marginEnabled'))
    ).toEqual(enabledBefore);
  });

  it.each([
    ['bleed off', { bleedEnabled: false }],
    ['a zero margin', { bleedMargin: 0 }]
  ])('leaves the scene margins alone with %s', async (_label, override) => {
    const before = engine.scene.getPages().map((id) => margins(id));
    const { captured: during } = await duringExport(
      () => engine.scene.getPages().map((id) => margins(id)),
      () => exportPrintReadyPDF(engine, { ...DEFAULTS, ...override })
    );

    expect(during).toEqual(before);
  });

  it.each([
    ['Millimeter', 3],
    ['Inch', 3 / 25.4]
  ] as const)('writes %s margins in that unit', async (unit, expected) => {
    engine.scene.setDesignUnit(unit);

    const { captured: during } = await duringExport(
      () => engine.scene.getPages().map((id) => margins(id)),
      () => exportPrintReadyPDF(engine, DEFAULTS)
    );

    expect(during![0][0]).toBeCloseTo(expected, 4);
  });
});

// PRP-H2
describe('page range', () => {
  it('hides the pages outside the range while exporting and restores them', async () => {
    const pages = engine.scene.getPages();

    const { captured: during } = await duringExport(
      () => pages.map((id) => engine.block.isVisible(id)),
      () => exportPrintReadyPDF(engine, { ...DEFAULTS, pageRange: '1' })
    );

    expect(during).toEqual([true, false]);
    expect(pages.map((id) => engine.block.isVisible(id))).toEqual([true, true]);
  });

  // PRP-H3: the panel now passes an empty range unless Pages is Custom, so an
  // exported range is the one the user asked for. Known issue 1, fixed.
  it('exports every page when the range is empty', async () => {
    const pages = engine.scene.getPages();

    const { captured: during } = await duringExport(
      () => pages.map((id) => engine.block.isVisible(id)),
      () => exportPrintReadyPDF(engine, DEFAULTS)
    );

    expect(during).toEqual([true, true]);
  });

  // PRP-H4: known issue 5, fixed — the caller now sees the failure.
  it('rejects an invalid range instead of exporting nothing in silence', async () => {
    await expect(
      exportPrintReadyPDF(engine, { ...DEFAULTS, pageRange: 'abc' })
    ).rejects.toThrow('Invalid page range');

    expect(convertToPDFX).not.toHaveBeenCalled();
  });

  it('leaves the scene untouched when the range is invalid', async () => {
    const pages = engine.scene.getPages();
    const before = pages.map((id) => margins(id));

    await expect(
      exportPrintReadyPDF(engine, { ...DEFAULTS, pageRange: 'abc' })
    ).rejects.toThrow();

    expect(pages.map((id) => margins(id))).toEqual(before);
    expect(pages.map((id) => engine.block.isVisible(id))).toEqual([true, true]);
  });
});

// PRP-H5
describe('conversion options', () => {
  it('hands the chosen printer marks to the PDF export', async () => {
    const exportSpy = vi.spyOn(engine.block, 'export');

    await exportPrintReadyPDF(engine, {
      ...DEFAULTS,
      printMarks: { exportPdfWithCropMarks: true, printMarkOffset: 2 }
    });

    expect(exportSpy).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        mimeType: 'application/pdf',
        exportPdfWithCropMarks: true,
        printMarkOffset: 2
      })
    );
    exportSpy.mockRestore();
  });

  it.each(['fogra39', 'gracol', 'srgb'] as const)(
    'hands %s to the conversion',
    async (colorProfile) => {
      await exportPrintReadyPDF(engine, { ...DEFAULTS, colorProfile });

      expect(convertToPDFX.mock.calls[0][1]).toEqual({
        outputProfile: colorProfile,
        outputStandard: 'PDF/X-4',
        title: 'Print-Ready Export'
      });
    }
  );

  it.each(['PDF/X-3', 'PDF/X-4'] as const)(
    'hands %s to the conversion',
    async (outputStandard) => {
      await exportPrintReadyPDF(engine, { ...DEFAULTS, outputStandard });

      expect(convertToPDFX.mock.calls[0][1]).toMatchObject({ outputStandard });
    }
  );

  it('converts the PDF the engine produced, with no other export option', async () => {
    let result: Blob | undefined;
    const { options } = await duringExport(
      () => undefined,
      async () => {
        result = await exportPrintReadyPDF(engine, DEFAULTS);
      }
    );

    expect(options).toEqual({ mimeType: 'application/pdf' });
    expect(result!.type).toBe('application/pdf');
  });
});
