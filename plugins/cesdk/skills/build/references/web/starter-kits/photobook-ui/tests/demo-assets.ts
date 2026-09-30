import { repoRoot } from '@imgly/kit-test-harness/node';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** This kit's demo assets, as they sit in the repository. */
export const DEMO_ASSETS_DIR = join(
  repoRoot,
  'packages/cesdk-web-examples-data/data/starterkit-photobook-ui'
);

export const DEMO_ASSETS_BASE_URL = pathToFileURL(DEMO_ASSETS_DIR).href;
