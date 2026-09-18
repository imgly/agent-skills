// @vitest-environment jsdom
import { act, render } from '@imgly/kit-test-harness/component';
import type { Configuration } from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface EditorComponentProps {
  config: Configuration;
  init: (cesdk: unknown) => Promise<void>;
  onError: (error: unknown) => void;
  onLoadingStateChange: unknown;
  width: string;
  height: string;
}

const mocks = vi.hoisted(() => ({
  initKitEditor: vi.fn(async () => undefined),
  props: { current: null as EditorComponentProps | null },
  reportDemoPhase: vi.fn(),
  reportDemoLoadingState: vi.fn()
}));

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase: mocks.reportDemoPhase,
  reportDemoLoadingState: mocks.reportDemoLoadingState
}));

vi.mock('@cesdk/cesdk-js/react', () => ({
  default: (props: EditorComponentProps) => {
    mocks.props.current = props;
    return null;
  }
}));

vi.mock('../../src/imgly', () => ({
  initPptxTemplateImportEditor: mocks.initKitEditor
}));

import { CreativeEditor } from '../../src/app/CreativeEditor/CreativeEditor';

const EDITOR_CONFIG: Configuration = { license: 'a-license' };
const ARCHIVE_URL = 'blob:archive';

interface OrderPosition {
  in: string;
  position: string;
}

interface NavigationBarEntry {
  id: string;
  onClick: () => void;
}

function createCesdk() {
  return {
    ui: {
      insertOrderComponent: vi.fn(
        (_position: OrderPosition, _entry: NavigationBarEntry) => undefined
      )
    },
    load: vi.fn(async (_url: string) => undefined),
    actions: {
      run: vi.fn((_id: string, _options: { autoFit: boolean }) => undefined)
    }
  };
}

function renderEditor() {
  const closeEditor = vi.fn();
  render(
    <CreativeEditor
      sceneArchiveUrl={ARCHIVE_URL}
      editorConfig={EDITOR_CONFIG}
      closeEditor={closeEditor}
    />
  );
  return { closeEditor, props: mocks.props.current! };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.props.current = null;
});

describe('PPTX-U10 the editor view hands the kit configuration to CE.SDK', () => {
  it('passes the kit configuration and fills its container', () => {
    const { props } = renderEditor();
    expect(props.config).toBe(EDITOR_CONFIG);
    expect(props.width).toBe('100%');
    expect(props.height).toBe('100%');
  });

  it('configures the editor for this kit before it loads the scene', async () => {
    const { props } = renderEditor();
    const cesdk = createCesdk();

    await act(async () => {
      await props.init(cesdk);
    });

    expect(mocks.initKitEditor).toHaveBeenCalledWith(cesdk);
    expect(cesdk.load).toHaveBeenCalledWith(ARCHIVE_URL);
    expect(mocks.initKitEditor.mock.invocationCallOrder[0]).toBeLessThan(
      cesdk.load.mock.invocationCallOrder[0]
    );
  });

  it('fits the imported page into the viewport once the scene is loaded', async () => {
    const { props } = renderEditor();
    const cesdk = createCesdk();

    await act(async () => {
      await props.init(cesdk);
    });

    expect(cesdk.actions.run).toHaveBeenCalledWith('zoom.toPage', {
      autoFit: true
    });
  });

  it('adds a close button at the start of the navigation bar', async () => {
    const { closeEditor, props } = renderEditor();
    const cesdk = createCesdk();

    await act(async () => {
      await props.init(cesdk);
    });

    expect(cesdk.ui.insertOrderComponent).toHaveBeenCalledTimes(1);
    const [position, component] = cesdk.ui.insertOrderComponent.mock.calls[0];
    expect(position).toEqual({
      in: 'ly.img.navigation.bar',
      position: 'start'
    });
    expect(component.id).toBe('ly.img.close.navigationBar');

    component.onClick();
    expect(closeEditor).toHaveBeenCalledTimes(1);
  });

  it('exposes the editor on window, the debug hook the kit documents', async () => {
    const { props } = renderEditor();
    const cesdk = createCesdk();

    await act(async () => {
      await props.init(cesdk);
    });

    expect((window as unknown as { cesdk?: unknown }).cesdk).toBe(cesdk);
  });

  it('reports the demo lifecycle while the editor starts', async () => {
    const { props } = renderEditor();
    const cesdk = createCesdk();

    expect(props.onLoadingStateChange).toBe(mocks.reportDemoLoadingState);
    expect(mocks.reportDemoPhase).not.toHaveBeenCalled();

    await act(async () => {
      await props.init(cesdk);
    });

    expect(mocks.reportDemoPhase.mock.calls).toEqual([['created'], ['ready']]);
  });

  it('returns to the result screen when the editor fails to start', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { closeEditor, props } = renderEditor();

    props.onError(new Error('no license'));

    expect(closeEditor).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
