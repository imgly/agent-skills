// @vitest-environment jsdom
import { screen } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const renderRoot = vi.fn();
const createRoot = vi.fn(() => ({ render: renderRoot, unmount: vi.fn() }));

vi.mock('react-dom/client', () => ({ createRoot, default: { createRoot } }));
vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { installBrowserStubs } = await import('./support/render');
const { installFakeEngine } = await import('./support/engine-mock');
const { injectFonts } = await import('../../src/app/fonts');

beforeEach(() => {
  installBrowserStubs();
  vi.clearAllMocks();
  vi.resetModules();
  document.getElementById('photobook-ui-fonts')?.remove();
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PB-C50 the web fonts', () => {
  it('declares the four IBM Plex Sans weights against the demo asset base URL', () => {
    injectFonts();

    const style = document.getElementById('photobook-ui-fonts') as HTMLElement;
    expect(style.tagName).toBe('STYLE');
    expect(style.textContent).toContain('--font-family-ibm-sans');
    for (const weight of [400, 500, 600, 700]) {
      expect(style.textContent).toContain(`font-weight: ${weight};`);
    }
    expect(style.textContent?.match(/IBMPlexSans-\w+\.ttf/g)?.length).toBe(4);
    expect(style.textContent).toContain('/fonts/IBMPlexSans-Regular.ttf');
  });

  it('injects the faces only once', () => {
    injectFonts();
    injectFonts();
    expect(document.querySelectorAll('#photobook-ui-fonts')).toHaveLength(1);
  });
});

describe('PB-C51 the entry point', () => {
  it('injects the fonts and mounts the app into #root', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);

    await import('../../src/index');

    expect(document.getElementById('photobook-ui-fonts')).not.toBeNull();
    expect(createRoot).toHaveBeenCalledWith(container);
    expect(renderRoot).toHaveBeenCalledTimes(1);
  });

  it('fails loudly when the page has no root container', async () => {
    vi.resetModules();
    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
  });
});

describe('PB-C52 the application shell', () => {
  it('renders the editor under the whole provider stack', async () => {
    installFakeEngine();
    const { default: App } = await import('../../src/app/App');
    const { render } = await import('@imgly/kit-test-harness/component');

    render(<App engineConfig={{ license: 'test-licence' }} />);

    expect(await screen.findByRole('heading', { name: 'Pages' })).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'Design' })).toBeTruthy();
  });

  it('shows the loading text until the engine is ready', async () => {
    installFakeEngine();
    const { default: App } = await import('../../src/app/App');
    const { render } = await import('@imgly/kit-test-harness/component');

    render(<App engineConfig={{}} />);

    expect(screen.getByText('Loading...')).toBeTruthy();
    await screen.findByRole('heading', { name: 'Pages' });
  });

  it('keeps scrolling prevented while merging the callers feature flags', async () => {
    installFakeEngine();
    const { default: App } = await import('../../src/app/App');
    const { render } = await import('@imgly/kit-test-harness/component');
    const engineModule = (await import('@cesdk/engine')).default as unknown as {
      init: ReturnType<typeof vi.fn>;
    };
    const init = vi.spyOn(engineModule, 'init');

    render(<App engineConfig={{ featureFlags: { extra: true } as never }} />);
    await screen.findByRole('heading', { name: 'Pages' });

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'Adopter',
        featureFlags: { preventScrolling: true, extra: true }
      })
    );
  });
});
