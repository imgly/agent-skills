import type { Page, Route } from '@playwright/test';

export const API_BASE = 'https://api.pexels.com/v1/';
export const API_KEY = 'test-pexels-key';
const IMAGE_HOST = 'https://images.pexels.test/';

/** A 2 x 2 opaque PNG, so the fixture's photos need no network. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8Dwn4GBgYEJRIAAG7oCBEvbP5cAAAAASUVORK5CYII=',
  'base64'
);

function photo(id: string) {
  return {
    id,
    width: 2,
    height: 2,
    url: `https://www.pexels.com/photo/${id}/`,
    photographer: `Photographer ${id}`,
    photographer_url: `https://www.pexels.com/@${id}`,
    photographer_id: 1,
    avg_color: '#123456',
    src: {
      original: `${IMAGE_HOST}${id}/original.png`,
      large2x: `${IMAGE_HOST}${id}/large2x.png`,
      large: `${IMAGE_HOST}${id}/large.png`,
      medium: `${IMAGE_HOST}${id}/medium.png`,
      small: `${IMAGE_HOST}${id}/small.png`,
      portrait: `${IMAGE_HOST}${id}/portrait.png`,
      landscape: `${IMAGE_HOST}${id}/landscape.png`,
      tiny: `${IMAGE_HOST}${id}/tiny.png`
    },
    liked: false,
    alt: `Pexels ${id}`
  };
}

export interface ApiRequest {
  url: URL;
  authorization: string | undefined;
}

export interface ApiMock {
  /** The Pexels requests the page made, in order. */
  requests: ApiRequest[];
  /** Answer the next requests with this instead of the default fixture. */
  respondWith(handler: (url: URL) => { status?: number; body: unknown }): void;
}

/**
 * Serve the Pexels API and the fixture images from memory. Every browser case
 * installs this, so no test needs a Pexels key and none leaves the machine.
 */
export async function mockPexelsApi(page: Page): Promise<ApiMock> {
  const requests: ApiRequest[] = [];
  let handler: ((url: URL) => { status?: number; body: unknown }) | null = null;

  await page.route(`${IMAGE_HOST}**`, (route: Route) =>
    route.fulfill({ contentType: 'image/png', body: PNG })
  );

  await page.route(`${API_BASE}**`, (route: Route) => {
    const url = new URL(route.request().url());
    requests.push({
      url,
      authorization: route.request().headers().authorization
    });
    const pexelsPage = Number(url.searchParams.get('page'));
    const perPage = Number(url.searchParams.get('per_page'));
    const prefix = url.pathname.endsWith('/search') ? 'search' : 'curated';
    const answer = handler?.(url) ?? {
      body: {
        page: pexelsPage,
        per_page: perPage,
        photos: Array.from({ length: perPage }, (_, index) =>
          photo(`${prefix}-p${pexelsPage}-${index}`)
        ),
        total_results: perPage * 2,
        next_page:
          pexelsPage < 2
            ? `${API_BASE}${prefix}?page=${pexelsPage + 1}`
            : undefined
      }
    };
    return route.fulfill({
      status: answer.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(answer.body)
    });
  });

  return {
    requests,
    respondWith(next) {
      handler = next;
    }
  };
}
