// @vitest-environment jsdom
import {
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const initCreator = vi.fn();
const initAdopter = vi.fn();

vi.mock('../../src/imgly', () => ({
  initVideoPlaceholdersCreatorEditor: (cesdk: CreativeEditorSDK) =>
    initCreator(cesdk),
  initVideoPlaceholdersAdopterEditor: (cesdk: CreativeEditorSDK) =>
    initAdopter(cesdk)
}));

const lifecycle = vi.hoisted(() => ({
  reportDemoPhase: vi.fn(),
  reportDemoLoadingState: vi.fn()
}));

vi.mock('../../../shared/demo-preview/lifecycle', () => lifecycle);

const editorProps: { onLoadingStateChange?: (state: string) => void } = {};

// The real component boots a wasm engine. This stub keeps the kit's own
// contract: it hands the instance to `init` once per mount.
function CreativeEditorStub({
  init,
  onLoadingStateChange
}: {
  init: (cesdk: CreativeEditorSDK) => Promise<void>;
  onLoadingStateChange?: (state: string) => void;
}) {
  editorProps.onLoadingStateChange = onLoadingStateChange;
  useEffect(() => {
    void init(fakeCesdk as unknown as CreativeEditorSDK);
  }, [init]);
  return <div data-testid="editor" />;
}

vi.mock('@cesdk/cesdk-js/react', () => ({ default: CreativeEditorStub }));

const fakeCesdk = {
  load: vi.fn(async () => undefined),
  actions: { run: vi.fn(async () => undefined) },
  engine: {
    scene: {
      load: vi.fn(async () => undefined),
      saveToString: vi.fn(async () => 'SAVED_SCENE')
    }
  }
};

const { default: App } = await import('../../src/app/App');

const SCENE_URL = '/cases/placeholders-video/example.scene';

function renderApp() {
  return render(
    <App config={{ license: 'test' } as never} sceneUrl={SCENE_URL} />
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  fakeCesdk.load.mockResolvedValue(undefined);
  fakeCesdk.engine.scene.load.mockResolvedValue(undefined);
  fakeCesdk.engine.scene.saveToString.mockResolvedValue('SAVED_SCENE');
});

describe('VPL-C1 the first mount', () => {
  it('loads the scene from the URL and auto-fits the page', async () => {
    renderApp();

    await waitFor(() => expect(fakeCesdk.load).toHaveBeenCalledWith(SCENE_URL));
    expect(fakeCesdk.engine.scene.load).not.toHaveBeenCalled();
    expect(fakeCesdk.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      autoFit: true
    });
  });

  it('reports the demo phases around the editor it mounts', async () => {
    renderApp();

    await waitFor(() =>
      expect(
        lifecycle.reportDemoPhase.mock.calls.map(([phase]) => phase)
      ).toEqual(['created', 'ready'])
    );
    expect(editorProps.onLoadingStateChange).toBe(
      lifecycle.reportDemoLoadingState
    );
  });

  it('starts in Creator, so the Creator configuration runs', async () => {
    renderApp();

    await waitFor(() => expect(initCreator).toHaveBeenCalledTimes(1));
    expect(initAdopter).not.toHaveBeenCalled();
  });
});

describe('VPL-C2 switching role', () => {
  it('carries the design over as an in-memory snapshot', async () => {
    renderApp();
    await waitFor(() => expect(fakeCesdk.load).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button', { name: 'Adopter' }));

    await waitFor(() => expect(initAdopter).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(fakeCesdk.engine.scene.load).toHaveBeenCalledWith('SAVED_SCENE')
    );
    expect(fakeCesdk.load).toHaveBeenCalledTimes(1);
  });

  it('falls back to the URL scene when the snapshot will not load', async () => {
    renderApp();
    await waitFor(() => expect(fakeCesdk.load).toHaveBeenCalledTimes(1));
    fakeCesdk.engine.scene.load.mockRejectedValueOnce(
      new Error('unreadable snapshot')
    );

    await userEvent.click(screen.getByRole('button', { name: 'Adopter' }));

    await waitFor(() => expect(fakeCesdk.load).toHaveBeenCalledTimes(2));
    expect(fakeCesdk.load).toHaveBeenLastCalledWith(SCENE_URL);
  });

  it('drops the snapshot when the design cannot be saved, and still switches', async () => {
    renderApp();
    await waitFor(() => expect(fakeCesdk.load).toHaveBeenCalledTimes(1));
    fakeCesdk.engine.scene.saveToString.mockRejectedValueOnce(
      new Error('no scene')
    );

    await userEvent.click(screen.getByRole('button', { name: 'Adopter' }));

    await waitFor(() => expect(initAdopter).toHaveBeenCalledTimes(1));
    expect(fakeCesdk.engine.scene.load).not.toHaveBeenCalled();
    await waitFor(() => expect(fakeCesdk.load).toHaveBeenCalledTimes(2));
  });

  it('uses the snapshot only once, so a second switch saves again', async () => {
    renderApp();
    await waitFor(() => expect(fakeCesdk.load).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button', { name: 'Adopter' }));
    await waitFor(() => expect(initAdopter).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button', { name: 'Creator' }));
    await waitFor(() => expect(initCreator).toHaveBeenCalledTimes(2));
    expect(fakeCesdk.engine.scene.saveToString).toHaveBeenCalledTimes(2);
  });
});
