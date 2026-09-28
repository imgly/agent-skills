// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SNAPSHOTS = vi.hoisted(() => [
  {
    thumbnailUrl: 'https://snapshots.test/a.png',
    sceneUrl: 'https://snapshots.test/a.scene',
    createdAt: '2026-09-01T10:00:00.000Z',
    userName: 'Ada'
  },
  {
    thumbnailUrl: 'https://snapshots.test/b.png',
    sceneUrl: 'https://snapshots.test/b.scene',
    createdAt: '2026-09-02T11:00:00.000Z',
    userName: 'Grace'
  }
]);

const initVersionHistoryEditor = vi.hoisted(() => vi.fn(async () => undefined));
const loadSnapshot = vi.hoisted(() => vi.fn(async () => undefined));
const createSnapshot = vi.hoisted(() =>
  vi.fn(async () => ({
    thumbnailUrl: 'https://snapshots.test/new.png',
    sceneUrl: 'https://snapshots.test/new.scene'
  }))
);

const reportDemoPhase = vi.hoisted(() => vi.fn());
const reportDemoLoadingState = vi.hoisted(() => vi.fn());

vi.mock('@cesdk/cesdk-js', () => ({ default: {} }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase,
  reportDemoLoadingState
}));
vi.mock('../../src/imgly', () => ({
  INITIAL_SNAPSHOTS: SNAPSHOTS,
  getInitialSceneUrl: () => 'https://snapshots.test/initial.scene',
  initVersionHistoryEditor,
  loadSnapshot,
  createSnapshot
}));

/** Stands in for the CE.SDK React wrapper: the test decides when it calls back. */
let wrapper: {
  init: (cesdk: unknown) => Promise<void>;
  onError: (error: Error) => void;
  onLoadingStateChange: (state: string) => void;
};

vi.mock('@cesdk/cesdk-js/react', () => ({
  default: (props: {
    init: (cesdk: unknown) => Promise<void>;
    onError: (error: Error) => void;
    onLoadingStateChange: (state: string) => void;
  }) => {
    wrapper = props;
    return <div data-testid="editor" />;
  }
}));

import App from '../../src/app/App';
import { HistoryPanel } from '../../src/app/HistoryPanel/HistoryPanel';

function fakeEditor() {
  const actions = new Map<string, () => Promise<void>>();
  return {
    actions: {
      register: (id: string, handler: () => Promise<void>) => {
        actions.set(id, handler);
      }
    },
    engine: { scene: { saveToString: vi.fn(async () => '{"scene":1}') } },
    load: vi.fn(async () => undefined),
    run: (id: string) => actions.get(id)!()
  };
}

describe('VH-C1 the version history screen', () => {
  beforeEach(() => {
    initVersionHistoryEditor.mockClear();
    loadSnapshot.mockClear();
    createSnapshot.mockClear();
    reportDemoPhase.mockClear();
  });

  afterEach(() => {
    delete (window as { cesdk?: unknown }).cesdk;
  });

  it('lists the snapshots it starts with', () => {
    render(<App editorConfig={{}} />);

    expect(screen.getByText('2 Snapshots')).toBeDefined();
    expect(screen.getAllByRole('button', { name: /Load/ })).toHaveLength(2);
    expect(screen.getByTestId('editor')).toBeDefined();
  });

  it('configures the editor, loads the initial scene and registers saveScene', async () => {
    render(<App editorConfig={{}} />);
    const editor = fakeEditor();

    await wrapper.init(editor);

    expect((window as { cesdk?: unknown }).cesdk).toBe(editor);
    expect(initVersionHistoryEditor).toHaveBeenCalledWith(editor);
    expect(editor.load).toHaveBeenCalledWith(
      'https://snapshots.test/initial.scene'
    );

    await editor.run('saveScene');

    expect(createSnapshot).toHaveBeenCalledWith(editor, '{"scene":1}');
    expect(await screen.findByText('3 Snapshots')).toBeDefined();
  });

  it('reports the demo lifecycle to the host that embeds it', async () => {
    render(<App editorConfig={{}} />);

    expect(wrapper.onLoadingStateChange).toBe(reportDemoLoadingState);

    await wrapper.init(fakeEditor());

    expect(reportDemoPhase.mock.calls).toEqual([['created'], ['ready']]);
  });

  it('loads the snapshot a click names, and does nothing before the editor exists', async () => {
    render(<App editorConfig={{}} />);
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: /Load/ })[0]);
    expect(loadSnapshot).not.toHaveBeenCalled();

    const editor = fakeEditor();
    await wrapper.init(editor);
    await user.click(screen.getAllByRole('button', { name: /Load/ })[0]);

    expect(loadSnapshot).toHaveBeenCalledWith(editor, SNAPSHOTS[0]);
  });

  it('reports a failed editor start-up', () => {
    render(<App editorConfig={{}} />);
    const failure = new Error('no license');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    wrapper.onError(failure);

    expect(consoleError).toHaveBeenCalledWith(
      'Failed to initialize CE.SDK:',
      failure
    );
    consoleError.mockRestore();
  });
});

describe('VH-C2 the history panel on its own', () => {
  it('counts a single snapshot in the singular and draws no divider', () => {
    const { container } = render(
      <HistoryPanel snapshots={[SNAPSHOTS[0]]} onLoadSnapshot={() => {}} />
    );

    expect(screen.getByText('1 Snapshot')).toBeDefined();
    expect(container.querySelectorAll('.snapshot-divider')).toHaveLength(0);
  });

  it('divides two snapshots', () => {
    const { container } = render(
      <HistoryPanel snapshots={SNAPSHOTS} onLoadSnapshot={() => {}} />
    );

    expect(container.querySelectorAll('.snapshot-divider')).toHaveLength(1);
  });
});
