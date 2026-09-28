import {
  createTestEngine,
  disposeTestEngine,
  loadScene,
  readPngSize,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  exportDesignBlobs,
  QualityType
} from '../../src/imgly/plugins/export-design-panel';

const SCENE = fileURLToPath(
  new URL('../../public/assets/example-1.scene', import.meta.url)
);

let engine: TestEngine;
let asCreativeEngine: CreativeEngine;

async function pngBytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

beforeAll(async () => {
  engine = await createTestEngine();
  await loadScene(engine, SCENE);
  asCreativeEngine = engine as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

describe('exportDesignBlobs', () => {
  it('exports one image per page of the demo scene', async () => {
    const blobs = await exportDesignBlobs(
      asCreativeEngine,
      '',
      'image/png',
      1,
      QualityType.High
    );

    expect(blobs).toHaveLength(2);
    expect(readPngSize(await pngBytes(blobs[0]))).toEqual({
      width: 1080,
      height: 1080
    });
  });

  it('exports only the page in the range', async () => {
    const blobs = await exportDesignBlobs(
      asCreativeEngine,
      '2',
      'image/png',
      1,
      QualityType.High
    );

    expect(blobs).toHaveLength(1);
  });

  it('applies the resolution scale to the target size', async () => {
    const blobs = await exportDesignBlobs(
      asCreativeEngine,
      '1',
      'image/png',
      0.5,
      QualityType.High
    );

    expect(readPngSize(await pngBytes(blobs[0]))).toEqual({
      width: 540,
      height: 540
    });
  });

  it('produces a smaller JPEG at low quality than at maximum quality', async () => {
    const low = await exportDesignBlobs(
      asCreativeEngine,
      '1',
      'image/jpeg',
      1,
      QualityType.Low
    );
    const maximum = await exportDesignBlobs(
      asCreativeEngine,
      '1',
      'image/jpeg',
      1,
      QualityType.Maximum
    );

    expect(low[0].size).toBeLessThan(maximum[0].size);
  });

  it('exports one PDF and restores the pages it hid for the range', async () => {
    const pages = asCreativeEngine.scene.getPages();

    const blobs = await exportDesignBlobs(
      asCreativeEngine,
      '1',
      'application/pdf',
      1,
      QualityType.High
    );

    expect(blobs).toHaveLength(1);
    expect(blobs[0].type).toBe('application/pdf');
    expect(pages.map((id) => asCreativeEngine.block.isVisible(id))).toEqual([
      true,
      true
    ]);
  });

  it('rejects an invalid page range instead of exporting everything', async () => {
    await expect(
      exportDesignBlobs(
        asCreativeEngine,
        'abc',
        'image/png',
        1,
        QualityType.High
      )
    ).rejects.toThrow('Invalid page range');
  });
});
