import { describe, expect, it } from 'vitest';
import { deepCloneProviders } from '../../src/app/ProviderItem/utils';

import {
  CURATED_MODELS,
  capabilitiesForMode,
  createAIProviders,
  instantiateGatewayProvider,
  type AiCapability
} from '../../src/imgly';

describe('AIE-U1 capabilitiesForMode', () => {
  it('gives Design text and image capabilities only', () => {
    expect(capabilitiesForMode('Design')).toEqual([
      'text2text',
      'text2image',
      'image2image'
    ]);
  });

  it('gives Photo image editing only', () => {
    expect(capabilitiesForMode('Photo')).toEqual(['image2image']);
  });

  it('gives Video every capability', () => {
    expect(capabilitiesForMode('Video')).toEqual([
      'text2text',
      'text2image',
      'image2image',
      'text2video',
      'image2video',
      'text2speech',
      'text2sound'
    ]);
  });

  it('returns a fresh array each call', () => {
    const first = capabilitiesForMode('Design');
    first.push('text2video');
    expect(capabilitiesForMode('Design')).toHaveLength(3);
  });
});

describe('AIE-U3 CURATED_MODELS', () => {
  const withModels = Object.entries(CURATED_MODELS).filter(
    ([, ids]) => ids.length > 0
  );

  it('has one vendor/model id per capability', () => {
    expect(withModels).toHaveLength(6);
    withModels.forEach(([, ids]) => {
      expect(ids).toHaveLength(1);
      expect(ids[0]).toMatch(/^[^/]+\/[^/]+$/);
    });
  });

  it('ships text2sound empty, so the capability reaches no provider map', () => {
    expect(CURATED_MODELS.text2sound).toEqual([]);
  });
});

describe('AIE-U3 createAIProviders', () => {
  it('builds one provider per curated capability of the mode', () => {
    expect(Object.keys(createAIProviders('Design'))).toEqual([
      'text2text',
      'text2image',
      'image2image'
    ]);
    // text2sound is curated-empty, so Video has six of its seven capabilities.
    expect(Object.keys(createAIProviders('Video'))).toEqual([
      'text2text',
      'text2image',
      'image2image',
      'text2video',
      'image2video',
      'text2speech'
    ]);
  });

  it('gives Photo the single curated image-to-image model', () => {
    const providers = createAIProviders('Photo');
    expect(Object.keys(providers)).toEqual(['image2image']);
    expect(providers.image2image).toHaveLength(1);
    // Qase 3896 names "Gemini Flash Edit"; that title is stale — the kit's
    // decision is the curated id below.
    expect(CURATED_MODELS.image2image).toEqual(['bfl/flux-2-edit']);
  });
});

describe('AIE-U2 instantiateGatewayProvider', () => {
  const capabilities: AiCapability[] = [
    'text2text',
    'text2image',
    'image2image',
    'text2video',
    'image2video',
    'text2speech',
    'text2sound'
  ];

  it.each(capabilities)('builds a provider factory for %s', (capability) => {
    expect(typeof instantiateGatewayProvider(capability, 'vendor/model')).toBe(
      'function'
    );
  });

  it('rejects a capability it has no factory for', () => {
    expect(() =>
      instantiateGatewayProvider('text2hologram' as AiCapability, 'v/m')
    ).toThrow('Unknown capability: text2hologram');
  });
});

describe('AIE-U25 cloning the provider state', () => {
  it('AIE-U25 copies a category that declares no modes', () => {
    const clone = deepCloneProviders({
      text2image: {
        name: 'Image',
        supportedModes: undefined as never,
        providers: []
      }
    });

    expect(clone.text2image?.supportedModes).toEqual([]);
  });

  it('AIE-U25 keeps the provider factory by reference', () => {
    const factory = () => ({});
    const clone = deepCloneProviders({
      text2image: {
        name: 'Image',
        supportedModes: ['Design'],
        providers: [
          {
            modelId: 'vendor/model',
            name: 'Model',
            label: 'vendor',
            selected: true,
            provider: factory
          }
        ]
      }
    });

    expect(clone.text2image?.providers[0].provider).toBe(factory);
    expect(clone.text2image?.providers).not.toBe(undefined);
  });
});
