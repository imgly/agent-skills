import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The style picker is the plugin's; the kit only decides that it is used and
// with which labels. Faking it keeps this test off the plugin's asset sources.
const promptRenderer = () => () => ({});
const styleRenderer = () => () => ({});
vi.mock('@imgly/plugin-ai-generation-web', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@imgly/plugin-ai-generation-web')>()),
  CommonProperties: {
    StyleTransfer: vi.fn(() => ({
      prompt: promptRenderer,
      style: styleRenderer
    }))
  }
}));

import { CommonProperties } from '@imgly/plugin-ai-generation-web';

import {
  customizeProviderForPhotoEdit,
  getCurrentPageImageUri
} from '../../src/imgly/plugins/ai-photo-edit';

const SHAPE_KEYS = [
  'format',
  'aspect_ratio',
  'image_size',
  'size',
  'width',
  'height',
  'num_images',
  'num_outputs'
];

interface FakePanel {
  type: string;
  order?: (defaultOrder: string[]) => string[];
  userFlow?: string;
  renderCustomProperty?: Record<string, unknown>;
}

interface FakeProvider {
  id: string;
  input: { panel?: FakePanel };
  output: { middleware?: unknown[]; history?: boolean };
}

function fakeProvider(panel?: FakePanel, middleware?: unknown[]): FakeProvider {
  return {
    id: 'vendor/model',
    input: panel == null ? {} : { panel },
    output: { middleware }
  };
}

function schemaPanel(): FakePanel {
  const panel: FakePanel = { type: 'schema' };
  // The gateway factory exposes `renderCustomProperty` as a getter populated
  // when the model schema loads, which a plain assignment cannot overwrite.
  Object.defineProperty(panel, 'renderCustomProperty', {
    configurable: true,
    get: () => ({ image_urls: () => () => ({}) })
  });
  return panel;
}

function customize(provider: FakeProvider, cesdk: CreativeEditorSDK) {
  customizeProviderForPhotoEdit(provider as never, cesdk);
}

let cesdk: CreativeEditorSDK;

beforeEach(() => {
  vi.clearAllMocks();
  cesdk = createApiSpy<CreativeEditorSDK>().api;
});

describe('AIE-U10 customizeProviderForPhotoEdit reshapes the panel order', () => {
  it.each(SHAPE_KEYS)('drops the %s output-shape control', (key) => {
    const panel = schemaPanel();
    customize(fakeProvider(panel), cesdk);
    expect(panel.order!(['prompt', key, 'image_urls'])).not.toContain(key);
  });

  it('keeps image_urls, so the auto-supplied value still reaches the request', () => {
    const panel = schemaPanel();
    customize(fakeProvider(panel), cesdk);
    expect(panel.order!(['prompt', 'image_urls'])).toContain('image_urls');
  });

  it('inserts style right after prompt', () => {
    const panel = schemaPanel();
    customize(fakeProvider(panel), cesdk);
    expect(panel.order!(['image_urls', 'prompt', 'strength'])).toEqual([
      'image_urls',
      'prompt',
      'style',
      'strength'
    ]);
  });

  it('appends style when the schema has no prompt', () => {
    const panel = schemaPanel();
    customize(fakeProvider(panel), cesdk);
    expect(panel.order!(['image_urls'])).toEqual(['image_urls', 'style']);
  });
});

describe('AIE-U10 customizeProviderForPhotoEdit rewires the generation flow', () => {
  it('skips placeholder creation', () => {
    const panel = schemaPanel();
    customize(fakeProvider(panel), cesdk);
    expect(panel.userFlow).toBe('generation-only');
  });

  it('redefines renderCustomProperty over the schema getter', () => {
    const panel = schemaPanel();
    customize(fakeProvider(panel), cesdk);
    expect(Object.keys(panel.renderCustomProperty!)).toEqual([
      'image_urls',
      'prompt',
      'style'
    ]);
  });

  it('builds the style picker for this provider with the kit-registered labels', () => {
    customize(fakeProvider(schemaPanel()), cesdk);
    expect(CommonProperties.StyleTransfer).toHaveBeenCalledWith(
      'vendor/model',
      expect.objectContaining({
        i18n: {
          prompt: {
            inputLabel: '@imgly/plugin-ai-photo-edit.prompt.label',
            placeholder: '@imgly/plugin-ai-photo-edit.prompt.placeholder'
          }
        }
      })
    );
  });

  it('renders no picker for image_urls and yields the current page image', () => {
    const panel = schemaPanel();
    const engineSpy = createApiSpy<CreativeEditorSDK>();
    customize(fakeProvider(panel), {
      engine: {
        scene: { getCurrentPage: () => 7 },
        block: {
          getFill: () => 8,
          getSourceSet: () => [{ uri: 'file:///photo.png' }]
        }
      },
      ...engineSpy.api
    } as unknown as CreativeEditorSDK);

    const renderer = panel.renderCustomProperty!.image_urls as () => () => {
      id: string;
      type: string;
      value: string;
    };
    expect(renderer()()).toEqual({
      id: 'image_urls',
      type: 'string',
      value: 'file:///photo.png'
    });
  });

  it('yields an empty image value while the page carries no image', () => {
    const panel = schemaPanel();
    const engineSpy = createApiSpy<CreativeEditorSDK>();
    customize(fakeProvider(panel), {
      engine: {
        scene: { getCurrentPage: () => null },
        block: { getFill: () => 8, getSourceSet: () => [] }
      },
      ...engineSpy.api
    } as unknown as CreativeEditorSDK);

    const renderer = panel.renderCustomProperty!.image_urls as () => () => {
      value: string;
    };
    expect(renderer()().value).toBe('');
  });

  it('turns the history grid off and prepends the apply middleware', () => {
    const existing = vi.fn();
    const provider = fakeProvider(schemaPanel(), [existing]);
    customize(provider, cesdk);

    expect(provider.output.history).toBe(false);
    expect(provider.output.middleware).toHaveLength(2);
    expect(provider.output.middleware![1]).toBe(existing);
  });

  it('starts the middleware chain when the provider has none', () => {
    const provider = fakeProvider(schemaPanel());
    customize(provider, cesdk);
    expect(provider.output.middleware).toHaveLength(1);
  });
});

describe('AIE-U10 customizeProviderForPhotoEdit leaves other providers alone', () => {
  it.each([
    ['no panel', undefined],
    ['a panel that is not schema-driven', { type: 'custom' } as FakePanel]
  ])('touches nothing for %s', (_case, panel) => {
    const provider = fakeProvider(panel);
    customize(provider, cesdk);
    expect(provider.output.history).toBeUndefined();
    expect(provider.output.middleware).toBeUndefined();
  });
});

describe('AIE-U24 the image URI the photo prompt starts from', () => {
  function cesdkWith(block: Record<string, unknown>) {
    return {
      engine: {
        scene: { getCurrentPage: () => block.page ?? null },
        block: {
          getFill: () => {
            if (block.fillThrows === true) throw new Error('no fill');
            return 99;
          },
          getSourceSet: () => block.sourceSet ?? [],
          getString: () => block.fileUri ?? ''
        }
      }
    } as unknown as CreativeEditorSDK;
  }

  it('AIE-U24 prefers the first source-set entry', () => {
    expect(
      getCurrentPageImageUri(
        cesdkWith({ page: 1, sourceSet: [{ uri: 'set.png' }] })
      )
    ).toBe('set.png');
  });

  it('AIE-U24 falls back to the image file URI', () => {
    expect(
      getCurrentPageImageUri(
        cesdkWith({ page: 1, sourceSet: [{ uri: '' }], fileUri: 'file.png' })
      )
    ).toBe('file.png');
  });

  it.each([
    ['no current page', {}],
    [
      'a page the engine refuses to answer about',
      { page: 1, fillThrows: true }
    ],
    ['a fill with no image at all', { page: 1 }]
  ])('AIE-U24 reports nothing for %s', (_case, block) => {
    expect(getCurrentPageImageUri(cesdkWith(block))).toBeUndefined();
  });
});
