// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EditorModal } from '../../src/app/EditorModal/EditorModal';

const { editorStub, initDesign, initAdvanced, init, lifecycle } = vi.hoisted(
  () => ({
    initDesign: vi.fn(async () => undefined),
    initAdvanced: vi.fn(async () => undefined),
    init: vi.fn(),
    lifecycle: {
      reportDemoPhase: vi.fn(),
      reportDemoLoadingState: vi.fn(),
      loadingStateHandler: undefined as unknown
    },
    editorStub: {
      actions: { register: vi.fn() },
      ui: { insertOrderComponent: vi.fn() },
      engine: { scene: { saveToString: vi.fn(async () => 'saved-scene') } },
      load: vi.fn(async () => undefined)
    }
  })
);

vi.mock('../../src/imgly', () => ({
  initAutomatedResizingDesignEditor: initDesign,
  initAutomatedResizingAdvancedEditor: initAdvanced
}));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase: lifecycle.reportDemoPhase,
  reportDemoLoadingState: lifecycle.reportDemoLoadingState
}));
vi.mock('@cesdk/cesdk-js/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');
  const EditorStub = ({
    init: onInit,
    onLoadingStateChange
  }: {
    init: (sdk: unknown) => Promise<void>;
    onLoadingStateChange?: (state: string) => void;
  }) => {
    lifecycle.loadingStateHandler = onLoadingStateChange;
    useEffect(() => {
      init(onInit);
      void onInit(editorStub);
    }, [onInit]);
    return <div data-testid="editor" />;
  };
  return { default: EditorStub };
});

function open(props: Partial<Parameters<typeof EditorModal>[0]> = {}) {
  return render(
    <EditorModal
      config={{}}
      isOpen
      scene="scene-string"
      mode="advanced"
      onClose={props.onClose ?? vi.fn()}
      onSave={props.onSave}
      {...props}
    />
  );
}

describe('AR-C9 EditorModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as { cesdk?: unknown }).cesdk;
  });

  it('renders nothing while it is closed', () => {
    const { container } = render(
      <EditorModal
        config={{}}
        isOpen={false}
        scene=""
        mode="design"
        onClose={vi.fn()}
      />
    );

    expect(container.innerHTML).toBe('');
  });

  it('configures the advanced editor, loads the scene and publishes the debug handle', async () => {
    open();

    await vi.waitFor(() => expect(editorStub.load).toHaveBeenCalledTimes(1));
    expect(initAdvanced).toHaveBeenCalledWith(editorStub);
    expect(initDesign).not.toHaveBeenCalled();
    expect(editorStub.load).toHaveBeenCalledWith('scene-string');
    expect((window as { cesdk?: unknown }).cesdk).toBe(editorStub);
    expect(lifecycle.reportDemoPhase.mock.calls.flat()).toEqual([
      'created',
      'ready'
    ]);
    expect(lifecycle.loadingStateHandler).toBe(
      lifecycle.reportDemoLoadingState
    );
  });

  it('configures the design editor in design mode', async () => {
    open({ mode: 'design' });

    await vi.waitFor(() => expect(initDesign).toHaveBeenCalledTimes(1));
    expect(initAdvanced).not.toHaveBeenCalled();
  });

  it('bubbles the serialized scene through the overridden save action', async () => {
    const onSave = vi.fn();
    open({ onSave });

    await vi.waitFor(() =>
      expect(editorStub.actions.register).toHaveBeenCalledWith(
        'saveScene',
        expect.any(Function)
      )
    );
    const [, handler] = editorStub.actions.register.mock.calls[0] as [
      string,
      () => Promise<void>
    ];
    await act(async () => {
      await handler();
    });

    expect(onSave).toHaveBeenCalledWith('saved-scene');
  });

  it('saves without a handler when the caller supplied none', async () => {
    open();

    await vi.waitFor(() =>
      expect(editorStub.actions.register).toHaveBeenCalledTimes(1)
    );
    const [, handler] = editorStub.actions.register.mock.calls[0] as [
      string,
      () => Promise<void>
    ];

    await expect(handler()).resolves.toBeUndefined();
  });

  it('closes from the back button, the backdrop and the escape key', async () => {
    const onClose = vi.fn();
    const { container, unmount } = open({ onClose });

    await vi.waitFor(() =>
      expect(editorStub.ui.insertOrderComponent).toHaveBeenCalledTimes(1)
    );
    const [, component] = editorStub.ui.insertOrderComponent.mock.calls[0] as [
      unknown,
      { onClick: () => void }
    ];
    component.onClick();
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.click(container.querySelector('[class*="backdrop"]')!);
    expect(onClose).toHaveBeenCalledTimes(2);

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onClose).toHaveBeenCalledTimes(3);

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
    expect(onClose).toHaveBeenCalledTimes(3);

    unmount();
    expect((window as { cesdk?: unknown }).cesdk).toBeUndefined();
    expect(screen.queryByTestId('editor')).toBeNull();
  });
});
