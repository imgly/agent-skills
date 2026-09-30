import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const importModule = async () =>
  (await import('../../src/imgly/demo-assets')).DEMO_ASSETS_BASE_URL;

describe('the demo assets base URL', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('takes the configured base URL as it is', async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', 'https://cdn.example/kit');
    expect(await importModule()).toBe('https://cdn.example/kit');
  });

  it('makes a configured path absolute, without a trailing slash', async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', '/examples/kit/');
    vi.stubGlobal('location', { href: 'https://kit.example/app/index.html' });
    expect(await importModule()).toBe('https://kit.example/examples/kit');
  });

  it("falls back to the kit's own absolute URL, without a trailing slash", async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', undefined);
    vi.stubGlobal('location', { href: 'https://kit.example/app/index.html' });
    expect(await importModule()).toBe(
      new URL(
        import.meta.env.BASE_URL,
        'https://kit.example/app/index.html'
      ).href.replace(/\/$/, '')
    );
  });

  it('falls back to the base path outside a browser', async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', undefined);
    vi.stubGlobal('location', undefined);
    expect(await importModule()).toBe(
      import.meta.env.BASE_URL.replace(/\/$/, '')
    );
  });
});
