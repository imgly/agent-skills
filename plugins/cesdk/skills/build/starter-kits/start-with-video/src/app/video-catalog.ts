/**
 * CE.SDK Start with Video - Video Catalog
 *
 * Sample videos from Pexels.com (licensed for free use)
 */

/**
 * Demo assets for this example (videos, thumbnails, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.81.0/starterkit-start-with-video';

// ============================================================================
// Types
// ============================================================================

export interface VideoAsset {
  /** Full URL to the video file */
  full: string;
  /** URL to the thumbnail image */
  thumbUri: string;
  /** Alt text description */
  alt: string;
  /** Attribution information */
  author: {
    name: string;
    url: string;
  };
}

// ============================================================================
// Video Catalog
// ============================================================================

// highlight-video-catalog
export const VIDEO_CATALOG: VideoAsset[] = [
  {
    full: `${DEMO_ASSETS_BASE_URL}/assets/videos/pexels-koolshooters-6975806.mp4`,
    thumbUri: `${DEMO_ASSETS_BASE_URL}/assets/videos/pexels-koolshooters-6975806.png`,
    alt: 'A Young Man Squeezing An Orange',
    author: {
      name: 'KoolShooters',
      url: 'https://www.pexels.com/video/a-young-an-squeezing-an-orange-6975806/'
    }
  },
  {
    full: `${DEMO_ASSETS_BASE_URL}/assets/videos/pexels-nicola-barts-7930811.mp4`,
    thumbUri: `${DEMO_ASSETS_BASE_URL}/assets/videos/pexels-nicola-barts-7930811.png`,
    alt: 'Person Decorating Dessert With Kiwi',
    author: {
      name: 'Nicola Barts',
      url: 'https://www.pexels.com/video/person-decorating-dessert-with-kiwi-7930811/'
    }
  },
  {
    full: `${DEMO_ASSETS_BASE_URL}/assets/videos/pexels-tima-miroshnichenko-7033913.mp4`,
    thumbUri: `${DEMO_ASSETS_BASE_URL}/assets/videos/pexels-tima-miroshnichenko-7033913.png`,
    alt: 'Close Up Video Of An Opened Pomegranate',
    author: {
      name: 'Tima Miroshnichenko',
      url: 'https://www.pexels.com/video/close-up-video-of-an-opened-pomegranate-7033913/'
    }
  }
];
// highlight-video-catalog
