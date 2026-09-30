import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@imgly/plugin-ai-text-generation-web/gateway', () => ({
  GatewayProvider: vi.fn(() => 'text-provider')
}));
vi.mock('@imgly/plugin-ai-image-generation-web/gateway', () => ({
  GatewayProvider: vi.fn(() => 'image-provider')
}));
vi.mock('@imgly/plugin-ai-video-generation-web/gateway', () => ({
  GatewayProvider: vi.fn(() => 'video-provider')
}));
vi.mock('@imgly/plugin-ai-audio-generation-web/gateway', () => ({
  GatewayProvider: vi.fn(() => 'audio-provider')
}));

import { GatewayProvider as audio } from '@imgly/plugin-ai-audio-generation-web/gateway';
import { GatewayProvider as image } from '@imgly/plugin-ai-image-generation-web/gateway';
import { GatewayProvider as text } from '@imgly/plugin-ai-text-generation-web/gateway';
import { GatewayProvider as video } from '@imgly/plugin-ai-video-generation-web/gateway';

import { instantiateGatewayProvider } from '../../src/imgly/plugins/ai-providers';

describe('AIE-U2 instantiateGatewayProvider routes each capability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['text2text', 'text-provider', text],
    ['text2image', 'image-provider', image],
    ['image2image', 'image-provider', image],
    ['text2video', 'video-provider', video],
    ['image2video', 'video-provider', video],
    ['text2speech', 'audio-provider', audio],
    ['text2sound', 'audio-provider', audio]
  ] as const)('%s goes to the %s factory', (capability, expected, factory) => {
    expect(instantiateGatewayProvider(capability, 'vendor/model')).toBe(
      expected
    );
    expect(factory).toHaveBeenCalledWith('vendor/model', { debug: false });
  });

  it('forwards a gateway URL verbatim', () => {
    instantiateGatewayProvider('text2image', 'vendor/model', {
      gatewayUrl: 'https://gateway.staging.example'
    });
    expect(image).toHaveBeenCalledWith('vendor/model', {
      debug: false,
      gatewayUrl: 'https://gateway.staging.example'
    });
  });

  it.each([undefined, ''])(
    'omits a "%s" gateway URL so the plugin default applies',
    (gatewayUrl) => {
      instantiateGatewayProvider('text2image', 'vendor/model', { gatewayUrl });
      expect(image).toHaveBeenCalledWith('vendor/model', { debug: false });
    }
  );
});
