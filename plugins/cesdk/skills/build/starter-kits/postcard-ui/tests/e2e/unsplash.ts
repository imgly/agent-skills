import type { Page } from '@playwright/test';

/** A 1x1 PNG the engine and the DOM can both load without a network hop. */
export const FIXTURE_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** A photo shaped like the Unsplash search response the kit maps. */
export const FIXTURE_PHOTO = {
  id: 'fixture-photo',
  width: 640,
  height: 480,
  description: 'A skateboard',
  alt_description: 'skateboard on asphalt',
  urls: {
    full: FIXTURE_IMAGE,
    raw: FIXTURE_IMAGE,
    regular: FIXTURE_IMAGE,
    small: FIXTURE_IMAGE,
    thumb: FIXTURE_IMAGE
  },
  links: {
    self: 'https://api.img.ly/unsplashProxy/photos/fixture-photo',
    html: 'https://unsplash.com/photos/fixture-photo',
    download: 'https://api.img.ly/unsplashProxy/photos/fixture-photo/download',
    download_location:
      'https://api.img.ly/unsplashProxy/photos/fixture-photo/download'
  },
  user: { name: 'Fixture Author', links: { html: 'https://unsplash.com/@fix' } }
};

/**
 * Answer every Unsplash proxy request from a fixture. The tracked-download
 * endpoint hands back a data URI, so applying the asset needs no network.
 */
export async function mockUnsplash(page: Page): Promise<string[]> {
  const requested: string[] = [];
  // The proxy host is whatever VITE_UNSPLASH_API_URL was baked with, so match
  // the Unsplash API paths instead of a host.
  const isUnsplashRequest = (url: URL) =>
    url.pathname.endsWith('/search/photos') ||
    /\/photos\/[^/]+(\/download)?$/.test(url.pathname);
  await page.route(
    (url) => isUnsplashRequest(url),
    async (route) => {
      requested.push(route.request().url());
      const url = new URL(route.request().url());
      const body = url.pathname.endsWith('/download')
        ? { url: FIXTURE_IMAGE }
        : { results: [FIXTURE_PHOTO], total: 1, total_pages: 1 };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body)
      });
    }
  );
  return requested;
}
