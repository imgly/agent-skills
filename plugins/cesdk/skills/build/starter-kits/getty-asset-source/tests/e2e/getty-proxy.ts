import type { Page, Route } from '@playwright/test';

export const PROXY_URL = 'https://getty-proxy.test/api';
const IMAGE_HOST = 'https://getty-proxy.test/images/';

/** A 2 x 2 opaque PNG, so the fixture's assets need no network. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8Dwn4GBgYEJRIAAG7oCBEvbP5cAAAAASUVORK5CYII=',
  'base64'
);

export interface GettyAsset {
  id: string;
  uri: string;
  thumbUri: string;
}

export function asset(id: string): GettyAsset {
  return {
    id,
    uri: `${IMAGE_HOST}${id}.png`,
    thumbUri: `${IMAGE_HOST}${id}-thumb.png`
  };
}

export function assetsQueryResult(
  ids: string[],
  options: { total?: number; currentPage?: number; nextPage?: number } = {}
) {
  return {
    assets: ids.map((id) => {
      const { uri, thumbUri } = asset(id);
      return {
        id,
        locale: 'en',
        label: `Getty ${id}`,
        meta: {
          uri,
          thumbUri,
          blockType: '//ly.img.ubq/graphic',
          fillType: '//ly.img.ubq/fill/image',
          kind: 'image',
          width: 2,
          height: 2
        },
        credits: { name: 'Getty photographer', url: 'https://example.test/' }
      };
    }),
    total: options.total ?? ids.length,
    currentPage: options.currentPage ?? 0,
    nextPage: options.nextPage
  };
}

export interface ProxyMock {
  /** The proxy URLs the page requested, in order. */
  requests: URL[];
  /** Answer the next proxy request with this body instead of the default. */
  respondWith(handler: (url: URL) => { status?: number; body: unknown }): void;
}

/**
 * Serve the proxy and the fixture images from memory. Every browser case
 * installs this, so no test needs a Getty account and none leaves the machine.
 */
export async function mockProxy(page: Page): Promise<ProxyMock> {
  const requests: URL[] = [];
  let handler: ((url: URL) => { status?: number; body: unknown }) | null = null;

  await page.route(`${IMAGE_HOST}**`, (route: Route) =>
    route.fulfill({ contentType: 'image/png', body: PNG })
  );

  await page.route(`${PROXY_URL}**`, (route: Route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    const gettyPage = Number(url.searchParams.get('page'));
    const perPage = Number(url.searchParams.get('perPage'));
    const ids = Array.from(
      { length: perPage },
      (_, index) => `p${gettyPage}-${index}`
    );
    const answer = handler?.(url) ?? {
      body: assetsQueryResult(ids, {
        total: perPage * 2,
        currentPage: gettyPage - 1,
        nextPage: gettyPage < 2 ? gettyPage : undefined
      })
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
