import type { ImageConfig } from '../imgly';
import { resolveAssetPath } from '../imgly/resolveAssetPath';

const CASE_ASSET_PATH = resolveAssetPath('/assets/force-crop');

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
