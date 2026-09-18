import { describe, expect, it } from 'vitest';

import {
  buildInitialSidebarState,
  getSelectedProviders,
  mergeCatalogIntoState,
  providersForMode,
  type AIProviders
} from '../../src/app/ai-sidebar';
import {
  deepCloneProviders,
  hasChanges
} from '../../src/app/ProviderItem/utils';

const GATEWAY = 'https://gateway.example';

function catalogue(
  models: Record<string, { id: string; name?: string; creator?: string }[]>
) {
  return models as unknown;
}

describe('AIE-U4 buildInitialSidebarState', () => {
  it('has one entry per capability that has a curated model', () => {
    expect(Object.keys(buildInitialSidebarState('Design'))).toEqual([
      'text2text',
      'text2image',
      'image2image'
    ]);
    expect(Object.keys(buildInitialSidebarState('Photo'))).toEqual([
      'image2image'
    ]);
    // text2sound is curated-empty, so it never reaches the sidebar.
    expect(Object.keys(buildInitialSidebarState('Video'))).not.toContain(
      'text2sound'
    );
  });

  it('starts every curated provider selected', () => {
    const state = buildInitialSidebarState('Video');
    Object.values(state).forEach((category) =>
      category?.providers.forEach((provider) =>
        expect(provider.selected).toBe(true)
      )
    );
  });

  it('falls back to the model id for the name and its vendor for the label', () => {
    const [provider] = buildInitialSidebarState('Photo').image2image!.providers;
    expect(provider.name).toBe(provider.modelId);
    expect(provider.label).toBe(provider.modelId.split('/')[0]);
  });

  it('names the capability and the modes it is offered in', () => {
    const state = buildInitialSidebarState('Video');
    expect(state.image2image?.name).toBe('Image to Image');
    expect(state.image2image?.supportedModes).toEqual([
      'Design',
      'Video',
      'Photo'
    ]);
    expect(state.text2video?.supportedModes).toEqual(['Video']);
  });

  it('reaches the provider factory with the gateway URL', () => {
    const [provider] = buildInitialSidebarState('Photo', GATEWAY).image2image!
      .providers;
    expect(typeof provider.provider()).toBe('function');
  });
});

describe('AIE-U5 mergeCatalogIntoState', () => {
  const initial = buildInitialSidebarState('Photo', GATEWAY);
  const curatedId = initial.image2image!.providers[0].modelId;

  it('takes the catalogue name and creator for a curated model, keeping its flag', () => {
    const merged = mergeCatalogIntoState(
      initial,
      catalogue({
        image2image: [
          { id: curatedId, name: 'Flux 2 Edit', creator: 'Black Forest Labs' }
        ]
      }),
      'Photo',
      GATEWAY
    );
    const [provider] = merged.image2image!.providers;
    expect(provider).toMatchObject({
      modelId: curatedId,
      name: 'Flux 2 Edit',
      label: 'Black Forest Labs',
      selected: true
    });
  });

  it('adds a catalogue-only model unselected', () => {
    const merged = mergeCatalogIntoState(
      initial,
      catalogue({
        image2image: [{ id: curatedId }, { id: 'other/model', name: 'Other' }]
      }),
      'Photo',
      GATEWAY
    );
    expect(merged.image2image!.providers.map((p) => p.selected)).toEqual([
      true,
      false
    ]);
  });

  it('keeps a curated model the catalogue does not echo, at the end', () => {
    const merged = mergeCatalogIntoState(
      initial,
      catalogue({ image2image: [{ id: 'other/model' }] }),
      'Photo',
      GATEWAY
    );
    expect(merged.image2image!.providers.map((p) => p.modelId)).toEqual([
      'other/model',
      curatedId
    ]);
  });

  it.each([
    ['a payload that is not an object', 'nonsense' as unknown],
    ['a null payload', null],
    ['a capability whose value is not an array', { image2image: 42 }],
    ['a model with no id', { image2image: [{ name: 'nameless' }] }]
  ])('ignores %s and keeps the curated entry', (_case, payload) => {
    const merged = mergeCatalogIntoState(initial, payload, 'Photo', GATEWAY);
    expect(merged.image2image!.providers.map((p) => p.modelId)).toEqual([
      curatedId
    ]);
  });

  it('drops capabilities the mode does not support', () => {
    const merged = mergeCatalogIntoState(
      initial,
      catalogue({ text2video: [{ id: 'vendor/video' }] }),
      'Photo',
      GATEWAY
    );
    expect(Object.keys(merged)).toEqual(['image2image']);
  });
});

describe('AIE-U6 getSelectedProviders', () => {
  it('instantiates the selected providers only', () => {
    const state = buildInitialSidebarState('Design', GATEWAY);
    state.text2image!.providers[0].selected = false;
    const map = getSelectedProviders(state);

    expect(Object.keys(map)).toEqual(['text2text', 'image2image']);
    expect(map.text2text).toHaveLength(1);
  });

  it('omits a capability with nothing selected rather than mapping it to an empty array', () => {
    const state = buildInitialSidebarState('Photo', GATEWAY);
    state.image2image!.providers[0].selected = false;
    expect(getSelectedProviders(state)).toEqual({});
  });
});

describe('AIE-U7 deepCloneProviders and hasChanges', () => {
  const original = buildInitialSidebarState('Design', GATEWAY);

  it('clones the arrays but shares the provider factory', () => {
    const clone = deepCloneProviders(original);
    expect(clone).not.toBe(original);
    expect(clone.text2image).not.toBe(original.text2image);
    expect(clone.text2image!.providers[0]).not.toBe(
      original.text2image!.providers[0]
    );
    expect(clone.text2image!.providers[0].provider).toBe(
      original.text2image!.providers[0].provider
    );
  });

  it('reports a change only while a flag differs', () => {
    const clone = deepCloneProviders(original);
    expect(hasChanges(clone, original)).toBe(false);

    clone.text2image!.providers[0].selected = false;
    expect(hasChanges(clone, original)).toBe(true);

    clone.text2image!.providers[0].selected = true;
    expect(hasChanges(clone, original)).toBe(false);
  });

  it('ignores a capability the other side does not have', () => {
    const clone = deepCloneProviders(original);
    const partial: AIProviders = { text2text: clone.text2text };
    expect(hasChanges(clone, partial)).toBe(false);
  });
});

describe('AIE-U14 providersForMode', () => {
  const catalog = catalogue({
    image2image: [
      { id: 'bfl/flux-2-edit', name: 'Flux 2 Edit' },
      { id: 'other/edit', name: 'Other Edit' }
    ]
  });

  it('merges the catalogue into the curated defaults of the mode', () => {
    const state = providersForMode('Photo', catalog, undefined, GATEWAY);
    expect(state.image2image!.providers.map((p) => p.name)).toEqual([
      'Flux 2 Edit',
      'Other Edit'
    ]);
  });

  it('carries the selection over to the next mode', () => {
    const design = providersForMode('Design', catalog, undefined, GATEWAY);
    design.image2image!.providers[0].selected = false;
    design.image2image!.providers[1].selected = true;

    const video = providersForMode('Video', catalog, design, GATEWAY);
    expect(video.image2image!.providers.map((p) => p.selected)).toEqual([
      false,
      true
    ]);
  });

  it('leaves a capability the previous mode did not have at its curated default', () => {
    const photo = providersForMode('Photo', catalog, undefined, GATEWAY);
    const video = providersForMode('Video', catalog, photo, GATEWAY);
    expect(video.text2video!.providers[0].selected).toBe(true);
  });

  it('keeps the curated defaults when no catalogue arrived', () => {
    const state = providersForMode('Design', undefined, undefined, GATEWAY);
    expect(Object.keys(state)).toEqual([
      'text2text',
      'text2image',
      'image2image'
    ]);
    expect(state.text2image!.providers[0].selected).toBe(true);
  });
});

describe('AIE-U26 the catalogue merge at its edges', () => {
  it('AIE-U26 keeps a curated capability the catalogue does not mention', () => {
    const initial = buildInitialSidebarState('Photo');
    expect(initial.image2image?.providers.length).toBeGreaterThan(0);

    const merged = mergeCatalogIntoState(
      initial,
      catalogue({}),
      'Photo',
      GATEWAY
    );

    expect(merged.image2image).toEqual(initial.image2image);
  });

  it('AIE-U26 keeps a capability the user has emptied', () => {
    const emptied = {
      image2image: {
        name: 'Image editing',
        supportedModes: ['Photo' as const],
        providers: []
      }
    };

    const merged = mergeCatalogIntoState(
      emptied,
      catalogue({}),
      'Photo',
      GATEWAY
    );

    expect(merged.image2image).toBe(emptied.image2image);
  });

  it('AIE-U26 leaves out a capability that is neither curated nor catalogued', () => {
    const merged = mergeCatalogIntoState({}, catalogue({}), 'Photo', GATEWAY);

    expect(merged).toEqual({});
  });

  it('AIE-U26 labels a model id that names no vendor with the id itself', () => {
    const merged = mergeCatalogIntoState(
      {},
      catalogue({ image2image: [{ id: 'bare-model' }] }),
      'Photo',
      GATEWAY
    );

    expect(merged.image2image?.providers[0]).toMatchObject({
      modelId: 'bare-model',
      name: 'bare-model',
      label: 'bare-model'
    });
  });
});

describe('AIE-U27 flattening a state with a missing category', () => {
  it('AIE-U27 skips a capability whose entry is undefined', () => {
    const map = getSelectedProviders({
      image2image: undefined
    } as unknown as AIProviders);

    expect(map).toEqual({});
  });
});
