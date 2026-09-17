import { expect } from '@imgly/kit-test-harness';
import type { Page, Route } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The kit's own curated ids, so a fixture catalogue overlaps the defaults. */
export const CURATED = {
  text2text: 'anthropic/claude-sonnet-4.6',
  text2image: 'bfl/flux-2',
  image2image: 'bfl/flux-2-edit',
  text2video: 'google/veo-3.1-fast',
  image2video: 'google/veo-3.1-fast-i2v',
  text2speech: 'elevenlabs/eleven-v3-tts'
} as const;

/**
 * `GET /v1/models?groupBy=capability`. Every curated model is echoed with a
 * display name, plus one extra image-to-image model the kit does not curate.
 */
export const MODEL_CATALOGUE = {
  text2text: [
    { id: CURATED.text2text, name: 'Claude Sonnet', creator: 'Anthropic' }
  ],
  text2image: [{ id: CURATED.text2image, name: 'Flux 2', creator: 'BFL' }],
  image2image: [
    { id: CURATED.image2image, name: 'Flux 2 Edit', creator: 'BFL' },
    { id: 'test/second-edit', name: 'Second Edit', creator: 'Test Lab' }
  ],
  text2video: [{ id: CURATED.text2video, name: 'Veo Fast', creator: 'Google' }],
  image2video: [
    { id: CURATED.image2video, name: 'Veo Fast I2V', creator: 'Google' }
  ],
  text2speech: [
    { id: CURATED.text2speech, name: 'Eleven v3', creator: 'ElevenLabs' }
  ]
};

const FIXTURES = join(__dirname, '..', 'fixtures');
const PHOTO_JPEG = readFileSync(join(FIXTURES, 'photo.jpg'));
const EDITED_PNG = readFileSync(join(FIXTURES, 'edited.png'));

const EDITED_URL = 'https://assets.gateway.test/edited.png';
const UPLOAD_URL = 'https://uploads.gateway.test/put';

function schemaFor(model: string) {
  return {
    model,
    name: model,
    type: 'image',
    capability: 'image2image',
    input_schema: {
      type: 'object',
      required: ['prompt', 'image_urls'],
      properties: {
        prompt: { type: 'string' },
        image_urls: { type: 'array', items: { type: 'string' } },
        format: { type: 'string', enum: ['square', 'landscape'] }
      },
      'x-property-order': ['prompt', 'image_urls', 'format']
    }
  };
}

function sseCompleted(url: string): string {
  return [
    'event: generation.completed',
    `data: ${JSON.stringify({
      request_id: 'req_test',
      status: 'completed',
      output: [{ type: 'image_url', url, content_type: 'image/png' }]
    })}`,
    '',
    ''
  ].join('\n');
}

export interface GatewayOptions {
  /** Status for `GET /v1/models`. 200 serves the catalogue. */
  modelsStatus: number;
  /** Fail the models request at the transport layer, as an offline gateway does. */
  modelsAborted: boolean;
  /** Key seeded into localStorage, which a production bundle reads. */
  storedApiKey: string | null;
}

export class Gateway {
  readonly modelsRequests: string[] = [];

  readonly generateBodies: Record<string, unknown>[] = [];

  private readonly unmatched: string[] = [];

  async install(page: Page, options: GatewayOptions): Promise<void> {
    await page.addInitScript((key: string | null) => {
      if (key == null) {
        window.localStorage.removeItem('imgly.ai-editor.apiKey');
      } else {
        window.localStorage.setItem('imgly.ai-editor.apiKey', key);
      }
    }, options.storedApiKey);

    // The default photo is an unsplash URL; the network guard forbids it and a
    // test must not depend on a third-party host.
    await page.route('https://images.unsplash.com/**', (route) =>
      route.fulfill({ contentType: 'image/jpeg', body: PHOTO_JPEG })
    );
    await page.route(`${EDITED_URL}**`, (route) =>
      route.fulfill({ contentType: 'image/png', body: EDITED_PNG })
    );
    await page.route(`${UPLOAD_URL}**`, (route) =>
      route.fulfill({ status: 200, body: '' })
    );
    await page.route('https://gateway.img.ly/**', (route) =>
      this.handle(route, options)
    );
  }

  /** Fails the test when the kit reached a gateway path with no fixture. */
  assertEveryRequestWasMocked(): void {
    expect(
      this.unmatched,
      'The kit asked the gateway for a path this test has no fixture for.'
    ).toEqual([]);
  }

  private async handle(route: Route, options: GatewayOptions): Promise<void> {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (pathname === '/v1/models') {
      this.modelsRequests.push(request.headers().authorization ?? '');
      if (options.modelsAborted) {
        await route.abort('failed');
        return;
      }
      await route.fulfill({
        status: options.modelsStatus,
        contentType: 'application/json',
        body: JSON.stringify(
          options.modelsStatus === 200 ? MODEL_CATALOGUE : { error: 'nope' }
        )
      });
      return;
    }

    if (pathname === '/v1/models/schema') {
      const model = new URL(request.url()).searchParams.get('model') ?? '';
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(schemaFor(model))
      });
      return;
    }

    if (pathname === '/v1/uploads') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'upload_test',
          upload_url: UPLOAD_URL,
          asset_url: `${EDITED_URL}?asset`,
          expires_in: 600
        })
      });
      return;
    }

    if (pathname === '/v1/responses') {
      this.generateBodies.push(
        request.postDataJSON() as Record<string, unknown>
      );
      await route.fulfill({
        contentType: 'text/event-stream',
        body: sseCompleted(EDITED_URL)
      });
      return;
    }

    this.unmatched.push(request.url());
    await route.abort('failed');
  }
}

export { EDITED_URL };
