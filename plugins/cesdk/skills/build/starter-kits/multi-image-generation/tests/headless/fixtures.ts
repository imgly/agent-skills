import {
  cesdkTestLicense,
  repoRoot,
  resolveNodeEngineEntry
} from '@imgly/kit-test-harness/node';
import type { CreativeEngine } from '@cesdk/cesdk-js';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { initMultiImageGenerationHeadlessEngine } from '../../src/imgly/headless-engine';
import type { Restaurant } from '../../src/imgly/types';

const DEMO_DATA_DIR = join(
  repoRoot,
  'packages/cesdk-web-examples-data/data/starterkit-multi-image-generation'
);

const LFS_POINTER_PREFIX = 'version https://git-lfs.github.com/spec/v1';

/**
 * A `file://` URL for one of the kit's demo images.
 *
 * @throws Error when the file is still an unmaterialized git-LFS pointer, which
 *   the engine would happily load as a broken image.
 */
export function demoImageURL(name: string): string {
  const file = join(DEMO_DATA_DIR, 'images', name);
  const head = readFileSync(file).subarray(0, LFS_POINTER_PREFIX.length);
  if (head.toString('utf8') === LFS_POINTER_PREFIX) {
    throw new Error(
      `${file} is an unmaterialized git-LFS pointer. Run: ` +
        `git lfs pull -X '' -I 'packages/cesdk-web-examples-data/data/starterkit-multi-image-generation/**'`
    );
  }
  return pathToFileURL(file).href;
}

/**
 * The asset root the kit's scenes resolve against. They reference LUT filters
 * and typefaces by root-relative path, so this must be the flat asset bundle
 * the dev server serves, not the versioned `assets/` tree.
 */
function resolveContentAssetsDir(): string {
  const candidates = [
    join(dirname(resolveNodeEngineEntry()), 'assets'),
    join(repoRoot, 'apps/cesdk_web/build/assets')
  ];
  const found = candidates.find((dir) =>
    existsSync(join(dir, 'ly.img.filter.lut'))
  );
  if (found == null) {
    throw new Error(
      `No asset bundle with ly.img.filter.lut found in ${candidates.join(
        ' or '
      )}. ` +
        'Build one with `pnpm exec nx run @cesdk/node:build:assets` or ' +
        '`pnpm exec nx run @cesdk/cesdk-js:build:sdk`.'
    );
  }
  return found;
}

let sharedEngine: CreativeEngine | null = null;

/**
 * The engine the kit ships, configured for the Node runtime. Shared by every
 * test in a file; call `disposeKitEngine()` in `afterAll`.
 */
export async function createKitEngine(): Promise<CreativeEngine> {
  if (sharedEngine != null) {
    return sharedEngine;
  }
  const engine = await initMultiImageGenerationHeadlessEngine({
    license: process.env.CESDK_LICENSE || cesdkTestLicense,
    baseURL: `${pathToFileURL(resolveContentAssetsDir()).href}/`,
    core: {
      baseURL: `${
        pathToFileURL(join(dirname(resolveNodeEngineEntry()), 'assets', 'core'))
          .href
      }/`
    }
  });
  sharedEngine = engine as unknown as CreativeEngine;
  return sharedEngine;
}

export function disposeKitEngine(): void {
  sharedEngine?.dispose();
  sharedEngine = null;
}

/** A restaurant whose images resolve on disk, so no test reaches a CDN. */
export function testRestaurant(
  overrides: Partial<Restaurant> = {}
): Restaurant {
  return {
    name: 'Bean there Bean good',
    photoPath: demoImageURL('photo-bean.png'),
    logoPath: demoImageURL('logo-bean.png'),
    cardPath: demoImageURL('card-bean.png'),
    price: '$$',
    reviewCount: 281,
    rating: 1,
    primaryColor: '#050087',
    secondaryColor: '#F1E1C7',
    ...overrides
  };
}
