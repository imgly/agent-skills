import type { Page, Route } from '@playwright/test';

export const API_URL = 'https://unsplash-proxy.test';
const IMAGE_HOST = 'https://images.unsplash.test/';

/** A 2 x 2 opaque PNG, so the fixture's photos need no network. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8Dwn4GBgYEJRIAAG7oCBEvbP5cAAAAASUVORK5CYII=',
  'base64'
);

function photo(id: string) {
  return {
    id,
    description: `Unsplash ${id}`,
    alt_description: `Unsplash ${id}`,
    width: 2,
    height: 2,
    urls: {
      full: `${IMAGE_HOST}${id}/full.png`,
      regular: `${IMAGE_HOST}${id}/regular.png`,
      small: `${IMAGE_HOST}${id}/small.png`,
      thumb: `${IMAGE_HOST}${id}/thumb.png`
    },
    user: {
      name: `Photographer ${id}`,
      links: { html: `https://unsplash.test/@${id}` }
    },
    tags: [{ title: 'demo' }]
  };
}

export interface ProxyMock {
  /** The proxy URLs the page requested, in order. */
  requests: URL[];
  /** Answer every following request with this status instead of the fixture. */
  failWith(status: number): void;
}

const TOTAL = 60;

/**
 * Serve the Unsplash proxy and the fixture images from memory. Every browser
 * case installs this, so no test contacts Unsplash or the demo proxy.
 */
export async function mockUnsplashProxy(page: Page): Promise<ProxyMock> {
  const requests: URL[] = [];
  let failStatus: number | null = null;

  await page.route(`${IMAGE_HOST}**`, (route: Route) =>
    route.fulfill({ contentType: 'image/png', body: PNG })
  );

  await page.route(`${API_URL}/**`, (route: Route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    if (failStatus != null) {
      return route.fulfill({
        status: failStatus,
        contentType: 'application/json',
        body: JSON.stringify({ errors: ['proxy is down'] })
      });
    }
    const unsplashPage = Number(url.searchParams.get('page'));
    const perPage = Number(url.searchParams.get('per_page'));
    const isSearch = url.pathname.endsWith('/search/photos');
    const prefix = isSearch ? 'search' : 'popular';
    const photos = Array.from({ length: perPage }, (_, index) =>
      photo(`${prefix}-p${unsplashPage}-${index}`)
    );
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'x-total': String(TOTAL),
        'x-per-page': String(perPage),
        // unsplash-js reads the paging headers, and the mocked proxy is a
        // different origin, so they have to be exposed explicitly.
        'access-control-allow-origin': '*',
        'access-control-expose-headers': 'x-total, x-per-page'
      },
      body: JSON.stringify(
        isSearch
          ? {
              results: photos,
              total: TOTAL,
              total_pages: Math.ceil(TOTAL / perPage)
            }
          : photos
      )
    });
  });

  return {
    requests,
    failWith(status) {
      failStatus = status;
    }
  };
}
