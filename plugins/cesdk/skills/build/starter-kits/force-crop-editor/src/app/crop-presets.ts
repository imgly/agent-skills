import type { CropPreset } from '../imgly';
import { resolveAssetPath } from '../imgly/resolveAssetPath';

const CASE_ASSET_PATH = resolveAssetPath('/assets/force-crop');

/**
 * Default crop presets for common social media formats.
 */
export const DEFAULT_CROP_PRESETS: CropPreset[] = [
  {
    id: 'custom-portrait-post',
    label: { en: 'Portrait Post (4:5)' },
    meta: {
      thumbUri: `${CASE_ASSET_PATH}/thumb-instagram.png`,
      icon: `${CASE_ASSET_PATH}/logo-instagram.svg`,
      thumbAlt: 'Instagram Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 4,
        height: 5,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-profile-photo',
    label: { en: 'Profile Photo (1:1)' },
    meta: {
      thumbUri: `${CASE_ASSET_PATH}/thumb-linkedin.png`,
      icon: `${CASE_ASSET_PATH}/logo-linkedin.svg`,
      thumbAlt: 'LinkedIn Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  },
  {
    id: 'custom-shared-image',
    label: { en: 'Shared Image (1.91:1)' },
    meta: {
      thumbUri: `${CASE_ASSET_PATH}/thumb-facebook.png`,
      icon: `${CASE_ASSET_PATH}/logo-facebook.svg`,
      thumbAlt: 'Facebook Logo'
    },
    payload: {
      transformPreset: {
        type: 'FixedAspectRatio',
        width: 1.91,
        height: 1,
        designUnit: 'Pixel'
      }
    },
    groups: ['custom-ratio']
  }
];
