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
  createCesdk: vi.fn(),
  renderMockup: vi.fn(),
  initProductPreviewDesignEditor: vi.fn(async () => undefined),
  initProductPreviewSceneEditor: vi.fn(async () => undefined),
  disposeMockupRenderer: vi.fn(),
  reportDemoPhase: vi.fn(),
  reportDemoLoadingState: vi.fn()
}));

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase: mocks.reportDemoPhase,
  reportDemoLoadingState: mocks.reportDemoLoadingState
}));

vi.mock('../../src/imgly', () => ({
  renderMockup: mocks.renderMockup,
  disposeMockupRenderer: mocks.disposeMockupRenderer,
  initProductPreviewDesignEditor: mocks.initProductPreviewDesignEditor,
  initProductPreviewSceneEditor: mocks.initProductPreviewSceneEditor,
  CLEAR_IMAGE: 'ly.img.mockup/clear'
}));

// The real editor boots the wasm engine. This stand-in only hands each mounted
// editor the `CreativeEditorSDK` its own `init` callback expects.
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
      void init(mocks.createCesdk() as CreativeEditorSDK);
    }, [init]);
    return createElement('div', { 'data-testid': 'editor' });
  };
  return { default: FakeCreativeEditor };
});

import App from '../../src/app/App';

const config = { license: 'test', baseURL: 'https://assets.test/' };
let sceneLoad: (url: string) => Promise<number>;
let saveToString: () => Promise<string>;
let created: ReturnType<typeof fakeCesdk>[] = [];

function fakeCesdk() {
  return {
    load: vi.fn(async () => undefined),
    actions: { run: vi.fn(async () => undefined) },
    i18n: { setTranslations: vi.fn() },
    ui: { insertOrderComponent: vi.fn(), updateOrderComponent: vi.fn() },
    engine: {
      scene: {
        load: vi.fn((url: string) => sceneLoad(url)),
        saveToString: vi.fn(() => saveToString())
      },
      block: {
        findByKind: () => [1],
        export: async () => new Blob(['png'], { type: 'image/png' })
      },
      editor: { onHistoryUpdatedWithKind: vi.fn(() => vi.fn()) }
    }
  };
}

beforeEach(() => {
  created = [];
  sceneLoad = async () => 1;
  saveToString = async () => '<edited-mockup/>';
  let urls = 0;
  URL.createObjectURL = vi.fn(() => `blob:${++urls}`) as never;
  URL.revokeObjectURL = vi.fn() as never;
  mocks.createCesdk.mockReset();
  mocks.createCesdk.mockImplementation(() => {
    const cesdk = fakeCesdk();
    created.push(cesdk);
    return cesdk;
  });
  mocks.renderMockup.mockReset();
  mocks.renderMockup.mockResolvedValue({
    mockupUrl: 'blob:mockup',
    sceneString: '<rendered/>',
    blobUrls: ['blob:mockup']
  });
  mocks.initProductPreviewDesignEditor.mockClear();
  mocks.initProductPreviewSceneEditor.mockClear();
  mocks.disposeMockupRenderer.mockClear();
  mocks.reportDemoPhase.mockClear();
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
});

/** Mount the app and wait until the first mockup has been rendered. */
async function mountApp() {
  const view = render(<App config={config} />);
  await waitFor(() => expect(mocks.renderMockup).toHaveBeenCalledTimes(1));
  return view;
}

/** Open the mockup editor modal and wait until its editor has initialised. */
async function openModal() {
  await userEvent.click(screen.getByRole('button', { name: /Edit/ }));
  await waitFor(() =>
    expect(mocks.initProductPreviewSceneEditor).toHaveBeenCalledTimes(1)
  );
  return created[created.length - 1];
}

describe('PP-C1 start-up', () => {
  it('configures the editor, loads the default product and renders its mockup', async () => {
    await mountApp();
    const cesdk = created[0];

    expect(mocks.initProductPreviewDesignEditor).toHaveBeenCalledWith(cesdk);
    expect(cesdk.load).toHaveBeenCalledWith(
      expect.stringContaining('postcard.scene')
    );
    expect(cesdk.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      page: 'first',
      autoFit: true
    });
    expect((window as { cesdk?: unknown }).cesdk).toBe(cesdk);
    expect(screen.getByAltText('Product mockup')).toHaveProperty(
      'src',
      'blob:mockup'
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

describe('PP-C2 switching product', () => {
  it('loads the new design scene, refits the camera and re-renders the mockup', async () => {
    await mountApp();

    await userEvent.click(screen.getByRole('button', { name: 'Poster' }));

    await waitFor(() => expect(mocks.renderMockup).toHaveBeenCalledTimes(2));
    expect(created[0].engine.scene.load).toHaveBeenCalledWith(
      expect.stringContaining('poster.scene')
    );
    expect(mocks.renderMockup).toHaveBeenLastCalledWith(
      config,
      expect.stringContaining('poster-mockup.scene'),
      expect.anything()
    );
  });

  it('ignores a click on the product that is already open', async () => {
    await mountApp();
    await userEvent.click(screen.getByRole('button', { name: 'Post Card' }));
    expect(mocks.renderMockup).toHaveBeenCalledTimes(1);
  });
});

describe('PP-C3 a product picked while the editor is still starting up', () => {
  it('drops the start-up render the product switch overtook', async () => {
    // The product buttons unlock as soon as `isInitializing` clears, which is
    // before the start-up zoom and the first mockup render have finished.
    let releaseZoom: () => void = () => {};
    let startupZoomPending = true;
    mocks.createCesdk.mockImplementation(() => {
      const cesdk = fakeCesdk();
      cesdk.actions.run = vi.fn(() => {
        if (!startupZoomPending) return Promise.resolve();
        startupZoomPending = false;
        return new Promise<void>((resolve) => {
          releaseZoom = resolve;
        });
      }) as never;
      created.push(cesdk);
      return cesdk;
    });

    render(<App config={config} />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Poster' })).toHaveProperty(
        'disabled',
        false
      )
    );

    await userEvent.click(screen.getByRole('button', { name: 'Poster' }));
    await act(async () => releaseZoom());

    await waitFor(() => expect(mocks.renderMockup).toHaveBeenCalledTimes(1));
    expect(mocks.renderMockup).toHaveBeenCalledWith(
      config,
      expect.stringContaining('poster-mockup.scene'),
      expect.anything()
    );
  });
});

describe('PP-C4 the mockup preview panel', () => {
  it('shows the spinner while a render is in flight', async () => {
    let release: (result: unknown) => void = () => {};
    mocks.renderMockup.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = resolve;
        })
    );
    const { container } = render(<App config={config} />);

    await waitFor(() =>
      expect(container.querySelector('.spinner')).toBeTruthy()
    );
    expect(screen.queryByAltText('Product mockup')).toBeNull();

    await act(async () =>
      release({
        mockupUrl: 'blob:mockup',
        sceneString: '<rendered/>',
        blobUrls: []
      })
    );
    await waitFor(() => expect(container.querySelector('.spinner')).toBeNull());
  });

  it('shows the message of the last failed render', async () => {
    mocks.renderMockup.mockRejectedValueOnce(new Error('export failed'));
    render(<App config={config} />);
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain('export failed')
    );
  });

  it('toggles fullscreen from the control and from Escape', async () => {
    const { container } = await mountApp();
    const wrapper = () =>
      container.querySelector('[class*="editorWrapper"]') as HTMLElement;
    expect(wrapper().className).not.toContain('hidden');

    await userEvent.click(screen.getByTitle('View fullscreen'));
    expect(wrapper().className).toContain('hidden');

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
    });
    expect(wrapper().className).not.toContain('hidden');
  });

  it('ignores a key that is not Escape', async () => {
    const { container } = await mountApp();
    await userEvent.click(screen.getByTitle('View fullscreen'));
    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    });
    expect(
      (container.querySelector('[class*="editorWrapper"]') as HTMLElement)
        .className
    ).toContain('hidden');
  });

  it('downloads the rendered mockup under the product name', async () => {
    await mountApp();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    await userEvent.click(screen.getByTitle('Download mockup'));

    expect(click).toHaveBeenCalledTimes(1);
    click.mockRestore();
  });

  it('does nothing when there is no mockup to download yet', async () => {
    mocks.renderMockup.mockRejectedValueOnce(new Error('export failed'));
    render(<App config={config} />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    await userEvent.click(screen.getByTitle('Download mockup'));

    expect(click).not.toHaveBeenCalled();
    click.mockRestore();
  });
});

describe('PP-C5 the mockup scene editor modal', () => {
  it('opens on the rendered mockup scene and re-renders what it saves', async () => {
    await mountApp();
    const modal = await openModal();

    // The first render published a scene string, so the modal opens on it.
    expect(modal.load).toHaveBeenCalledWith('<rendered/>');
    expect(modal.i18n.setTranslations).toHaveBeenCalledWith({
      en: { 'editor.title': 'Post Card Mockup' }
    });
    expect(modal.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      autoFit: true
    });

    const save = modal.ui.updateOrderComponent.mock.calls[0][1].children[0]
      .onClick as () => Promise<void>;
    await act(async () => save());

    await waitFor(() => expect(mocks.renderMockup).toHaveBeenCalledTimes(2));
    expect(mocks.renderMockup).toHaveBeenLastCalledWith(
      config,
      { sceneString: '<edited-mockup/>' },
      expect.anything()
    );
    expect(screen.queryByText('Post Card Mockup')).toBeNull();
  });

  it('reports its own demo lifecycle when it opens', async () => {
    await mountApp();
    mocks.reportDemoPhase.mockClear();
    await openModal();

    await waitFor(() =>
      expect(mocks.reportDemoPhase.mock.calls.flat()).toEqual([
        'created',
        'ready'
      ])
    );
  });

  it('opens on the product mockup scene URL while no mockup has been rendered', async () => {
    mocks.renderMockup.mockRejectedValueOnce(new Error('export failed'));
    render(<App config={config} />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());

    const modal = await openModal();
    expect(modal.load).toHaveBeenCalledWith(
      expect.stringContaining('postcard-mockup.scene')
    );
  });

  it('closes from the Back button without saving', async () => {
    const { container } = await mountApp();
    const modal = await openModal();
    expect(container.querySelectorAll('[data-testid="editor"]')).toHaveLength(
      2
    );

    const back = modal.ui.insertOrderComponent.mock.calls[0][1]
      .onClick as () => void;
    await act(async () => back());

    expect(container.querySelectorAll('[data-testid="editor"]')).toHaveLength(
      1
    );
    expect(mocks.renderMockup).toHaveBeenCalledTimes(1);
  });

  it('logs a save the engine refuses instead of closing on it', async () => {
    await mountApp();
    const modal = await openModal();
    saveToString = async () => {
      throw new Error('scene is not valid');
    };
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const save = modal.ui.updateOrderComponent.mock.calls[0][1].children[0]
      .onClick as () => Promise<void>;
    await act(async () => save());

    expect(error).toHaveBeenCalledWith(
      'Failed to save mockup scene:',
      expect.any(Error)
    );
    expect(mocks.renderMockup).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });
});
