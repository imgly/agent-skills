import {
  cesdkTestLicense,
  resolveNodeEngineEntry
} from '@imgly/kit-test-harness/node';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

import { importPptxFile } from '../../src/imgly/plugins/pptx-importer';

const DEMO_FILE = fileURLToPath(
  new URL(
    '../../../../../packages/cesdk-web-examples-data/data/starterkit-pptx-template-import/cases/pptx-template-import/example-2-bike.pptx',
    import.meta.url
  )
);

function pngSize(bytes: Uint8Array): { width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

// The kit only lets the caller set `baseURL`, and the engine resolves its wasm
// against it, so the Node engine's own asset directory is the one to pass.
const ENGINE_ASSETS = `${
  pathToFileURL(join(dirname(resolveNodeEngineEntry()), 'assets')).href
}/`;

beforeAll(() => {
  // The engine picks its browser code path from `typeof window`, and this
  // kit's Vitest config defines a bare `window` for its unit tests.
  delete (globalThis as { window?: unknown }).window;
});

describe('PPTX-H1 importPptxFile runs without a browser', () => {
  it('returns a preview, an archive and the parser messages', async () => {
    const file = new Blob([await readFile(DEMO_FILE)]);

    const result = await importPptxFile(file, 'example-2-bike.pptx', {
      license: cesdkTestLicense,
      baseURL: ENGINE_ASSETS
    });

    expect(result.fileName).toBe('example-2-bike.pptx');
    expect(Array.isArray(result.messages)).toBe(true);

    const preview = await fetch(result.imageUrl).then((response) =>
      response.arrayBuffer()
    );
    // 1000 x 1000 is the box the kit asks for; the engine keeps the slide
    // aspect ratio inside it, so one side comes back at 1000.
    const size = pngSize(new Uint8Array(preview));
    expect([size.width, size.height]).toContain(1000);

    const archive = await fetch(result.sceneArchiveUrl).then((response) =>
      response.arrayBuffer()
    );
    expect(new TextDecoder().decode(archive.slice(0, 2))).toBe('PK');

    URL.revokeObjectURL(result.imageUrl);
    URL.revokeObjectURL(result.sceneArchiveUrl);
  });
});
