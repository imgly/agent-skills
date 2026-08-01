import type { ImageConfig } from '../imgly';

/**
 * Demo assets for this example (images, icons, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.80.0/starterkit-force-crop-editor';

const CASE_ASSET_PATH = `${DEMO_ASSETS_BASE_URL}/assets/force-crop`;

/**
 * Sample images for demonstration purposes.
 */
export const SAMPLE_IMAGES: ImageConfig[] = [
  {
    full: `${CASE_ASSET_PATH}/image-1.png`,
    thumb: `${CASE_ASSET_PATH}/image-1.png`,
    width: 800,
    height: 1200,
    alt: 'Photographer with camera'
  },
  {
    full: `${CASE_ASSET_PATH}/image-2.png`,
    thumb: `${CASE_ASSET_PATH}/image-2.png`,
    width: 1200,
    height: 800,
    alt: 'Mountain landscape'
  },
  {
    full: `${CASE_ASSET_PATH}/image-3.png`,
    thumb: `${CASE_ASSET_PATH}/image-3.png`,
    width: 1200,
    height: 1200,
    alt: 'Healthy salad bowl'
  }
];
