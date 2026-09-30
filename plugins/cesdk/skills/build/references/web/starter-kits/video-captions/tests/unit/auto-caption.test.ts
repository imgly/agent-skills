import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@imgly/plugin-autocaption-web', () => ({
  default: (config: unknown) => ({ plugin: 'autocaption', config })
}));
vi.mock('@imgly/plugin-autocaption-web/fal-ai', () => ({
  ElevenLabsScribeV2: (config: { proxyUrl: string }) => ({
    provider: 'scribe-v2',
    proxyUrl: config.proxyUrl
  })
}));

const DEMO_PROXY = 'https://proxy.img.ly/api/proxy/falai';

async function proxyURL(): Promise<string> {
  vi.resetModules();
  const { createAutocaptionPlugin } =
    await import('../../src/imgly/plugins/auto-caption');
  const plugin = createAutocaptionPlugin() as unknown as {
    config: { provider: { proxyUrl: string } };
  };
  return plugin.config.provider.proxyUrl;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('VCA-U4 the provider reads the configured proxy URL', () => {
  it('uses VITE_AUTOCAPTION_PROXY_URL when it is set', async () => {
    vi.stubEnv('VITE_AUTOCAPTION_PROXY_URL', 'https://proxy.example.com/falai');
    expect(await proxyURL()).toBe('https://proxy.example.com/falai');
  });

  it("falls back to IMG.LY's demo proxy when it is not", async () => {
    vi.stubEnv('VITE_AUTOCAPTION_PROXY_URL', '');
    expect(await proxyURL()).toBe(DEMO_PROXY);
  });
});
