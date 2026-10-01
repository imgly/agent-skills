// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type CreativeEditorSDK from '@cesdk/cesdk-js';

const mocks = vi.hoisted(() => ({
  cesdk: undefined as unknown,
  renderMockup: vi.fn(),
  init3dProductPreviewEditor: vi.fn(async () => undefined),
  disposeMockupRenderer: vi.fn(),
  reportDemoPhase: vi.fn(),
  reportDemoLoadingState: vi.fn()
}));

vi.mock('@google/model-viewer', () => ({}));

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase: mocks.reportDemoPhase,
  reportDemoLoadingState: mocks.reportDemoLoadingState
}));

vi.mock('../../src/imgly', () => ({
  renderMockup: mocks.renderMockup,
  disposeMockupRenderer: mocks.disposeMockupRenderer,
  init3dProductPreviewEditor: mocks.init3dProductPreviewEditor,
  CLEAR_IMAGE: 'ly.img.mockup/clear'
}));

// The real editor boots the wasm engine. This stand-in only hands the app the
// `CreativeEditorSDK` its `init` callback expects.
vi.mock('@cesdk/cesdk-js/react', async () => {
  const { createElement, useEffect, useRef } = await import('react');
  const FakeCreativeEditor = ({
    init
  }: {
    init: (cesdk: CreativeEditorSDK) => Promise<void>;
  }) => {
    const started = useRef(false);
    useEffect(() => {
      if (started.current) return;
      started.current = true;
      void init(mocks.cesdk as CreativeEditorSDK);
    }, [init]);
    return createElement('div', { 'data-testid': 'editor' });
  };
  return { default: FakeCreativeEditor };
});

import App from '../../src/app/App';

const config = { license: 'test' };
let sceneLoad: (url: string) => Promise<number>;

function fakeCesdk() {
  return {
    load: vi.fn(async () => undefined),
    actions: { run: vi.fn(async () => undefined) },
    engine: {
      scene: { load: vi.fn((url: string) => sceneLoad(url)) },
      block: {
        findByKind: () => [1],
        export: async () => new Blob(['png'], { type: 'image/png' })
      },
      editor: { onHistoryUpdatedWithKind: vi.fn(() => vi.fn()) }
    }
  } as unknown as CreativeEditorSDK;
}

beforeEach(() => {
  sceneLoad = async () => 1;
  let created = 0;
  URL.createObjectURL = vi.fn(() => `blob:${++created}`) as never;
  URL.revokeObjectURL = vi.fn() as never;
  mocks.renderMockup.mockReset();
  mocks.renderMockup.mockResolvedValue({
    mockupUrl: 'blob:mockup',
    sceneString: '<rendered/>',
    blobUrls: ['blob:mockup']
  });
  mocks.init3dProductPreviewEditor.mockClear();
  mocks.disposeMockupRenderer.mockClear();
  mocks.reportDemoPhase.mockClear();
  mocks.cesdk = fakeCesdk();
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
});

/** Mount the app and wait until the initial mockup has been rendered. */
async function mountApp() {
  const view = render(<App config={config} />);
  await waitFor(() => expect(mocks.renderMockup).toHaveBeenCalledTimes(1));
  return view;
}

describe('P3D-C6 start-up', () => {
  it('configures the editor, loads the default product and renders its mockup', async () => {
    await mountApp();
    const cesdk = mocks.cesdk as CreativeEditorSDK;

    expect(mocks.init3dProductPreviewEditor).toHaveBeenCalledWith(cesdk);
    expect(cesdk.load).toHaveBeenCalledWith(
      expect.stringContaining('/t-shirt/')
    );
    expect(cesdk.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      page: 'first',
      autoFit: true
    });
    expect((window as { cesdk?: unknown }).cesdk).toBe(cesdk);
    expect(mocks.renderMockup).toHaveBeenCalledWith(
      config,
      expect.stringContaining('/t-shirt/'),
      expect.anything()
    );
  });

  it('reports the demo lifecycle once the first mockup is on screen', async () => {
    await mountApp();
    await waitFor(() =>
      expect(mocks.reportDemoPhase.mock.calls.flat()).toEqual([
        'created',
        'ready'
      ])
    );
  });

  it('disposes the mockup engine when the app goes away', async () => {
    const { unmount } = await mountApp();
    unmount();
    expect(mocks.disposeMockupRenderer).toHaveBeenCalledTimes(1);
  });
});

describe('P3D-C7 switching product', () => {
  it('loads the new design scene, refits the camera and re-renders the mockup', async () => {
    await mountApp();
    const cesdk = mocks.cesdk as CreativeEditorSDK;

    await userEvent.click(screen.getByRole('button', { name: 'Baseball Cap' }));

    await waitFor(() => expect(mocks.renderMockup).toHaveBeenCalledTimes(2));
    expect(cesdk.engine.scene.load).toHaveBeenCalledWith(
      expect.stringContaining('/cap/')
    );
    expect(mocks.renderMockup).toHaveBeenLastCalledWith(
      config,
      expect.stringContaining('/cap/'),
      expect.anything()
    );
  });

  it('ignores a click on the product that is already open', async () => {
    await mountApp();
    await userEvent.click(screen.getByRole('button', { name: 'Apparel' }));
    expect(mocks.renderMockup).toHaveBeenCalledTimes(1);
  });
});

describe('P3D-C9 a product picked while the editor is still starting up', () => {
  it('drops the start-up render the product switch overtook', async () => {
    // The product buttons unlock as soon as `isInitializing` clears, which is
    // before the start-up zoom and the first mockup render have finished.
    let releaseZoom: () => void = () => {};
    let startupZoomPending = true;
    mocks.cesdk = fakeCesdk();
    (mocks.cesdk as CreativeEditorSDK).actions.run = vi.fn(() => {
      if (!startupZoomPending) return Promise.resolve();
      startupZoomPending = false;
      return new Promise<void>((resolve) => {
        releaseZoom = resolve;
      });
    }) as never;

    render(<App config={config} />);
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Baseball Cap' })
      ).not.toHaveProperty('disabled', true)
    );

    await userEvent.click(screen.getByRole('button', { name: 'Baseball Cap' }));
    await act(async () => releaseZoom());

    await waitFor(() => expect(mocks.renderMockup).toHaveBeenCalledTimes(1));
    expect(mocks.renderMockup).toHaveBeenCalledWith(
      config,
      expect.stringContaining('/cap/'),
      expect.anything()
    );
  });
});

describe('P3D-C8 the fullscreen toggle', () => {
  it('hides the editor and shows it again', async () => {
    const { container } = await mountApp();
    const wrapper = () =>
      container.querySelector('.editorWrapper') as HTMLElement;
    expect(wrapper().className).not.toContain('hidden');

    await userEvent.click(screen.getByTitle('View fullscreen'));
    expect(wrapper().className).toContain('hidden');

    await userEvent.click(screen.getByTitle('Exit fullscreen'));
    expect(wrapper().className).not.toContain('hidden');
  });
});
