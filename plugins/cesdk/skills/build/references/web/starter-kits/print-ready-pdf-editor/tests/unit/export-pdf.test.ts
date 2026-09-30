import type { CreativeEngine } from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const convertToPDFX = vi.hoisted(() =>
  vi.fn(
    async (blob: Blob, _options: Record<string, unknown>) =>
      new Blob([blob, 'x'], { type: 'application/pdf' })
  )
);

vi.mock('@imgly/plugin-print-ready-pdfs-web', () => ({ convertToPDFX }));

import { exportPrintReadyPDF } from '../../src/imgly/plugins/export-print-ready-pdf';

const MARGIN_PROPERTIES = [
  'page/margin/top',
  'page/margin/bottom',
  'page/margin/left',
  'page/margin/right'
];

interface EngineStubOptions {
  designUnit?: 'Millimeter' | 'Inch' | 'Pixel';
  scene?: number | null;
  dpi?: number;
}

function engineStub({
  designUnit = 'Millimeter',
  scene = 1,
  dpi = 300
}: EngineStubOptions = {}) {
  const pages = [10, 20];
  const floats = new Map<string, number>();
  const bools = new Map<string, boolean>();
  const visibility: string[] = [];

  for (const page of pages) {
    bools.set(`${page}/page/marginEnabled`, false);
    for (const property of MARGIN_PROPERTIES) {
      floats.set(`${page}/${property}`, 1);
    }
  }

  const exportMock = vi.fn(
    async () => new Blob(['pdf'], { type: 'application/pdf' })
  );

  const engine = {
    scene: {
      get: () => scene,
      getPages: () => pages,
      getDesignUnit: () => designUnit
    },
    block: {
      getBool: (id: number, property: string) =>
        bools.get(`${id}/${property}`) ?? false,
      getFloat: (id: number, property: string) =>
        property === 'scene/dpi' ? dpi : (floats.get(`${id}/${property}`) ?? 0),
      setBool: (id: number, property: string, value: boolean) =>
        bools.set(`${id}/${property}`, value),
      setFloat: (id: number, property: string, value: number) =>
        floats.set(`${id}/${property}`, value),
      setVisible: (id: number, value: boolean) =>
        visibility.push(`${id}=${value}`),
      export: exportMock
    }
  } as unknown as CreativeEngine;

  return { engine, exportMock, pages, floats, bools, visibility };
}

const OPTIONS = {
  pageRange: '',
  colorProfile: 'fogra39',
  outputStandard: 'PDF/X-4',
  bleedEnabled: false,
  bleedMargin: 0
} as const;

beforeEach(() => {
  convertToPDFX.mockClear();
});

describe('PRP-U7 exportPrintReadyPDF', () => {
  it('exports the scene once and hands the blob to the converter', async () => {
    const stub = engineStub();

    const result = await exportPrintReadyPDF(stub.engine, { ...OPTIONS });

    expect(stub.exportMock).toHaveBeenCalledWith(1, {
      mimeType: 'application/pdf'
    });
    expect(convertToPDFX).toHaveBeenCalledTimes(1);
    expect(convertToPDFX.mock.calls[0][1]).toEqual({
      outputProfile: 'fogra39',
      outputStandard: 'PDF/X-4',
      title: 'Print-Ready Export'
    });
    expect(result.type).toBe('application/pdf');
  });

  it('refuses to export without a scene', async () => {
    const stub = engineStub({ scene: null });

    await expect(
      exportPrintReadyPDF(stub.engine, { ...OPTIONS })
    ).rejects.toThrow('No scene to export');
  });

  it('hides the pages outside the range and shows them again afterwards', async () => {
    const stub = engineStub();

    await exportPrintReadyPDF(stub.engine, { ...OPTIONS, pageRange: '1' });

    expect(stub.visibility).toEqual(['20=false', '20=true']);
  });

  it('restores the visibility even when the conversion fails', async () => {
    const stub = engineStub();
    convertToPDFX.mockRejectedValueOnce(new Error('ghostscript failed'));

    await expect(
      exportPrintReadyPDF(stub.engine, { ...OPTIONS, pageRange: '2' })
    ).rejects.toThrow('ghostscript failed');
    expect(stub.visibility).toEqual(['10=false', '10=true']);
  });

  it('writes the bleed in millimetres and restores the original margins', async () => {
    const stub = engineStub({ designUnit: 'Millimeter' });

    await exportPrintReadyPDF(stub.engine, {
      ...OPTIONS,
      bleedEnabled: true,
      bleedMargin: 3
    });

    for (const property of MARGIN_PROPERTIES) {
      expect(stub.floats.get(`10/${property}`)).toBe(1);
    }
    expect(stub.bools.get('10/page/marginEnabled')).toBe(false);
  });

  it.each([
    ['Inch', 3 / 25.4],
    ['Pixel', (3 / 25.4) * 300]
  ] as const)(
    'converts the bleed into the %s design unit',
    async (designUnit, expected) => {
      const stub = engineStub({ designUnit });
      let written: number | undefined;
      const original = stub.engine.block.setFloat;
      stub.engine.block.setFloat = ((
        id: number,
        property: string,
        value: number
      ) => {
        if (written === undefined && property === 'page/margin/top') {
          written = value;
        }
        return original(id, property, value);
      }) as CreativeEngine['block']['setFloat'];

      await exportPrintReadyPDF(stub.engine, {
        ...OPTIONS,
        bleedEnabled: true,
        bleedMargin: 3
      });

      expect(written).toBeCloseTo(expected, 6);
    }
  );

  it('leaves the margins alone when bleed is off or zero', async () => {
    const stub = engineStub();
    let marginWrites = 0;
    const original = stub.engine.block.setFloat;
    stub.engine.block.setFloat = ((
      id: number,
      property: string,
      value: number
    ) => {
      marginWrites += 1;
      return original(id, property, value);
    }) as CreativeEngine['block']['setFloat'];

    await exportPrintReadyPDF(stub.engine, {
      ...OPTIONS,
      bleedEnabled: true,
      bleedMargin: 0
    });

    // Only the restore pass writes: four properties on each of the two pages.
    expect(marginWrites).toBe(8);
  });
});

describe('PRP-U12 a scene that disappears mid-export', () => {
  it('keeps the bleed in millimetres rather than guessing a design unit', async () => {
    const stub = engineStub();
    let reads = 0;
    stub.engine.scene.get = (() => {
      reads += 1;
      return reads === 1 ? 1 : null;
    }) as CreativeEngine['scene']['get'];
    let written: number | undefined;
    const original = stub.engine.block.setFloat;
    stub.engine.block.setFloat = ((
      id: number,
      property: string,
      value: number
    ) => {
      if (written === undefined && property === 'page/margin/top') {
        written = value;
      }
      return original(id, property, value);
    }) as CreativeEngine['block']['setFloat'];

    await exportPrintReadyPDF(stub.engine, {
      ...OPTIONS,
      bleedEnabled: true,
      bleedMargin: 3
    });

    expect(written).toBe(3);
  });
});
