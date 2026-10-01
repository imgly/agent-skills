// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  render: vi.fn(),
  createRoot: vi.fn()
}));

vi.mock('react-dom/client', () => ({ createRoot: mocks.createRoot }));

vi.mock('../../src/app/App', () => ({
  App: () => null
}));

const LOCAL_ASSETS = 'http://localhost:5199/local/cesdk-js/assets/';

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.createRoot.mockReturnValue({ render: mocks.render });
  vi.stubEnv('VITE_IMGLY_LOCAL_ASSETS_URL', LOCAL_ASSETS);
  vi.stubEnv('VITE_CESDK_LICENSE', 'a-license');
  document.body.innerHTML = '<div id="root"></div>';
});

describe('PDF-U17 the entry point configures the editor and mounts the app', () => {
  it('builds the editor configuration from the environment', async () => {
    const { editorConfig } = await import('../../src/index');
    expect(editorConfig).toEqual({
      baseURL: LOCAL_ASSETS,
      userId: 'starterkit-pdf-template-import-user',
      license: 'a-license'
    });
  });

  it('mounts the app into the root element', async () => {
    await import('../../src/index');
    expect(mocks.createRoot).toHaveBeenCalledWith(
      document.getElementById('root')
    );
    expect(mocks.render).toHaveBeenCalledTimes(1);
  });
});
