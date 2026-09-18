// @vitest-environment jsdom
import { act, render, waitFor } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { GeneratedAsset } from '../../src/imgly';

const mocks = vi.hoisted(() => ({
  cesdk: undefined as unknown,
  initDesign: vi.fn(async () => undefined),
  initVideo: vi.fn(async () => undefined),
  readVariables: vi.fn(() => ({ Name: 'Conan' })),
  reportDemoPhase: vi.fn(),
  reportDemoLoadingState: vi.fn(),
  loadingStateHandler: undefined as unknown
}));

vi.mock('../../src/imgly', () => ({
  initDesignGenerationDesignEditor: mocks.initDesign,
  initDesignGenerationVideoEditor: mocks.initVideo,
  readVariables: mocks.readVariables
}));

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase: mocks.reportDemoPhase,
  reportDemoLoadingState: mocks.reportDemoLoadingState
}));

vi.mock('@cesdk/cesdk-js/react', async () => {
  const { createElement, useEffect, useRef } = await import('react');
  const FakeCreativeEditor = ({
    init,
    onLoadingStateChange
  }: {
    init: (cesdk: CreativeEditorSDK) => Promise<void>;
    onLoadingStateChange?: (state: string) => void;
  }) => {
    mocks.loadingStateHandler = onLoadingStateChange;
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

import { EditorModal } from '../../src/app/EditorModal/EditorModal';

const config = { license: 'test' };

function asset(overrides: Partial<GeneratedAsset> = {}): GeneratedAsset {
  return {
    id: 1,
    label: 'Square',
    isLoading: false,
    width: 1080,
    height: 1080,
    src: 'blob:asset',
    type: 'image',
    sceneString: '<scene/>',
    variables: { Name: 'Conan' },
    ...overrides
  };
}

let scene: number | null;

function fakeCesdk() {
  return {
    load: vi.fn(async () => undefined),
    actions: { register: vi.fn(), run: vi.fn() },
    ui: { insertOrderComponent: vi.fn() },
    engine: {
      editor: { setSetting: vi.fn() },
      variable: { setString: vi.fn() },
      scene: {
        get: vi.fn(() => scene),
        getCurrentPage: vi.fn(() => 7),
        saveToString: vi.fn(async () => '<saved/>')
      },
      block: {
        setName: vi.fn(),
        export: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
        exportVideo: vi.fn(async () => new Blob(['mp4'], { type: 'video/mp4' }))
      }
    }
  };
}

beforeEach(() => {
  scene = 3;
  URL.createObjectURL = vi.fn(() => 'blob:exported') as never;
  mocks.cesdk = fakeCesdk();
  mocks.initDesign.mockClear();
  mocks.initVideo.mockClear();
  mocks.reportDemoPhase.mockClear();
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
});

/** Mount the modal and wait until its editor has been configured. */
async function mountModal(overrides: Partial<GeneratedAsset> = {}) {
  const onClose = vi.fn();
  const onSave = vi.fn();
  const view = render(
    <EditorModal
      asset={asset(overrides)}
      config={config}
      onClose={onClose}
      onSave={onSave}
    />
  );
  const cesdk = mocks.cesdk as ReturnType<typeof fakeCesdk>;
  await waitFor(() =>
    expect(cesdk.ui.insertOrderComponent).toHaveBeenCalledTimes(1)
  );
  return { ...view, cesdk, onClose, onSave };
}

/** The `saveScene` action handler the modal registered. */
const saveHandler = (cesdk: ReturnType<typeof fakeCesdk>) =>
  cesdk.actions.register.mock.calls[0][1] as () => Promise<void>;

// ADG-C15
describe('EditorModal', () => {
  it('opens an image asset on the design editor and names its scene', async () => {
    const { cesdk } = await mountModal();

    expect(mocks.initDesign).toHaveBeenCalledWith(cesdk);
    expect(mocks.initVideo).not.toHaveBeenCalled();
    expect(cesdk.engine.editor.setSetting).toHaveBeenCalledWith(
      'page/title/show',
      false
    );
    expect(cesdk.load).toHaveBeenCalledWith('<scene/>');
    expect(cesdk.engine.variable.setString).toHaveBeenCalledWith(
      'Name',
      'Conan'
    );
    expect(cesdk.engine.block.setName).toHaveBeenCalledWith(3, 'Square');
    expect(cesdk.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      autoFit: true
    });
    expect((window as { cesdk?: unknown }).cesdk).toBe(cesdk);
  });

  it('reports the demo lifecycle around the editor it opens', async () => {
    await mountModal();

    expect(mocks.reportDemoPhase.mock.calls.flat()).toEqual([
      'created',
      'ready'
    ]);
    expect(mocks.loadingStateHandler).toBe(mocks.reportDemoLoadingState);
  });

  it('leaves the scene unnamed when the engine reports none', async () => {
    scene = null;
    const { cesdk } = await mountModal();
    expect(cesdk.engine.block.setName).not.toHaveBeenCalled();
  });

  it('does nothing at all for an asset that carries no scene', async () => {
    const onClose = vi.fn();
    render(
      <EditorModal
        asset={asset({ sceneString: null })}
        config={config}
        onClose={onClose}
        onSave={vi.fn()}
      />
    );
    const cesdk = mocks.cesdk as ReturnType<typeof fakeCesdk>;
    await waitFor(() =>
      expect((window as { cesdk?: unknown }).cesdk).toBe(cesdk)
    );
    expect(mocks.initDesign).not.toHaveBeenCalled();
    expect(cesdk.load).not.toHaveBeenCalled();
  });

  it('exports an image asset as a PNG at the asset size', async () => {
    const { cesdk, onSave } = await mountModal();

    await act(async () => saveHandler(cesdk)());

    expect(cesdk.engine.block.export).toHaveBeenCalledWith(3, {
      mimeType: 'image/png',
      targetWidth: 1080,
      targetHeight: 1080
    });
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        sceneString: '<saved/>',
        src: 'blob:exported',
        variables: { Name: 'Conan' }
      })
    );
  });

  it('opens a video asset on the video editor and exports it as MP4', async () => {
    const { cesdk, onSave } = await mountModal({ type: 'video' });

    expect(mocks.initVideo).toHaveBeenCalledWith(cesdk);
    expect(mocks.initDesign).not.toHaveBeenCalled();

    await act(async () => saveHandler(cesdk)());

    expect(cesdk.engine.block.exportVideo).toHaveBeenCalledWith(7, {
      mimeType: 'video/mp4',
      videoBitrate: 'Auto',
      targetWidth: 1080,
      targetHeight: 1080
    });
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ src: 'blob:exported' })
    );
  });

  it('closes from the navigation-bar button it inserts', async () => {
    const { cesdk, onClose } = await mountModal();
    const close = cesdk.ui.insertOrderComponent.mock.calls[0][1]
      .onClick as () => void;

    close();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks the page scroll while it is open and restores it after', async () => {
    document.body.style.overflow = 'scroll';
    const { unmount } = await mountModal();
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('scroll');
    expect((window as { cesdk?: unknown }).cesdk).toBeUndefined();
  });
});
