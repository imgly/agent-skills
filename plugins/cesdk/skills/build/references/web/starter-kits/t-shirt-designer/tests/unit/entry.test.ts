// @vitest-environment jsdom
import { render as renderTree } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { editorStub, reportDemoPhase, reportDemoLoadingState } = vi.hoisted(
  () => ({
    editorStub: { id: 'editor' },
    reportDemoPhase: vi.fn(),
    reportDemoLoadingState: vi.fn()
  })
);

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase,
  reportDemoLoadingState
}));

const appProps = vi.fn();
const editorProps = vi.fn();
const render = vi.fn((element: React.ReactElement) => {
  renderTree(element);
});
const createRoot = vi.fn(() => ({ render }));

vi.mock('react-dom/client', () => ({ createRoot }));
// The editor component reports its instance through `init`, which is what the
// entry's callback stores.
vi.mock('@cesdk/cesdk-js/react', async () => {
  const { useEffect } = await vi.importActual<typeof import('react')>('react');
  const EditorStub = (props: {
    init: (sdk: unknown) => void;
    onLoadingStateChange?: unknown;
  }) => {
    editorProps(props);
    const { init } = props;
    useEffect(() => {
      init(editorStub);
    }, [init]);
    return null;
  };
  return { default: EditorStub };
});
vi.mock('../../src/app/App', () => ({
  default: (props: { cesdk: unknown; children?: React.ReactNode }) => {
    appProps(props);
    return props.children ?? null;
  }
}));

describe('TSD-U18 src/index.tsx', () => {
  beforeEach(() => {
    vi.resetModules();
    createRoot.mockClear();
    render.mockClear();
    appProps.mockClear();
    editorProps.mockClear();
    reportDemoPhase.mockClear();
    document.body.innerHTML = '';
    delete (window as { cesdk?: unknown }).cesdk;
  });

  it('renders the editor and hands the created instance to the app', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);

    await import('../../src/index');

    expect(createRoot).toHaveBeenCalledWith(container);
    expect(render).toHaveBeenCalledTimes(1);
    expect((window as { cesdk?: unknown }).cesdk).toBe(editorStub);
    expect(appProps.mock.calls.at(-1)?.[0].cesdk).toBe(editorStub);
  });

  it('reports the created phase and the editor loading state', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);

    await import('../../src/index');

    expect(reportDemoPhase.mock.calls).toEqual([['created']]);
    expect(editorProps.mock.calls.at(-1)?.[0].onLoadingStateChange).toBe(
      reportDemoLoadingState
    );
  });

  it('fails loudly when the page ships no root container', async () => {
    await expect(import('../../src/index')).rejects.toThrow(
      'Root container not found'
    );
    expect(createRoot).not.toHaveBeenCalled();
  });
});
