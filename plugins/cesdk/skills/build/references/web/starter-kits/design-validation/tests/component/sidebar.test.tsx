// @vitest-environment jsdom
import {
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BlockValidationResult } from '../../src/imgly/types';

const outside = vi.hoisted(() =>
  vi.fn(async (): Promise<BlockValidationResult[]> => [])
);
const protruding = vi.hoisted(() =>
  vi.fn(async (): Promise<BlockValidationResult[]> => [])
);
const hiddenTexts = vi.hoisted(() =>
  vi.fn(async (): Promise<BlockValidationResult[]> => [])
);
const lowResolution = vi.hoisted(() =>
  vi.fn(async (): Promise<BlockValidationResult[]> => [])
);
const initDesignValidationEditor = vi.hoisted(() =>
  vi.fn(async () => undefined)
);

vi.mock('@cesdk/cesdk-js', () => ({ default: {} }));
vi.mock('../../src/imgly/validation', () => ({
  validateOutsideBlocks: outside,
  validateProtrudingBlocks: protruding,
  validatePartiallyHiddenTexts: hiddenTexts,
  validateLowResolution: lowResolution
}));
vi.mock('../../src/imgly', () => ({ initDesignValidationEditor }));

const reportDemoPhase = vi.hoisted(() => vi.fn());
const reportDemoLoadingState = vi.hoisted(() => vi.fn());

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase,
  reportDemoLoadingState
}));

let wrapper: {
  init: (cesdk: unknown) => Promise<void>;
  onError: (error: { message: string; cause?: unknown }) => void;
  onLoadingStateChange?: unknown;
};

vi.mock('@cesdk/cesdk-js/react', () => ({
  default: (props: {
    init: (cesdk: unknown) => Promise<void>;
    onError: (error: { message: string; cause?: unknown }) => void;
  }) => {
    wrapper = props;
    return <div data-testid="editor" />;
  }
}));

import { App } from '../../src/app/App';
import { Sidebar } from '../../src/app/Sidebar/Sidebar';

interface Block {
  name: string;
  kind: string;
  text?: string;
  selectable?: boolean;
}

function fakeEditor(blocks: Record<number, Block>) {
  const selected = new Set<number>();
  const listeners: { history?: () => void } = {};
  const unsubscribeHistory = vi.fn();
  const forceLoadResources = vi.fn(async () => undefined);
  const engine = {
    scene: { get: () => 1 },
    block: {
      forceLoadResources,
      getName: (id: number) => blocks[id].name,
      getKind: (id: number) => blocks[id].kind,
      getString: (id: number) => blocks[id].text ?? '',
      isValid: (id: number) => blocks[id] != null,
      isAllowedByScope: (id: number) => blocks[id].selectable !== false,
      findAllSelected: () => [...selected],
      setSelected: (id: number, on: boolean) => {
        if (on) selected.add(id);
        else selected.delete(id);
      }
    },
    editor: {
      onHistoryUpdatedWithKind: (handler: () => void) => {
        listeners.history = handler;
        return unsubscribeHistory;
      }
    }
  };
  return {
    cesdk: { engine, load: vi.fn(async () => undefined) },
    listeners,
    selected,
    forceLoadResources,
    unsubscribeHistory
  };
}

const BLOCKS: Record<number, Block> = {
  1: {
    name: 'Text',
    kind: 'text',
    text: 'A headline that runs past the limit'
  },
  2: { name: '', kind: 'sticker' },
  3: { name: '', kind: 'shapes' },
  4: { name: '', kind: 'audio' },
  5: { name: 'Hero image', kind: 'image' },
  6: { name: '', kind: 'text', text: '' },
  7: { name: '', kind: 'image', selectable: false },
  8: { name: '', kind: '' }
};

function results(...ids: number[]): BlockValidationResult[] {
  return ids.map((blockId) => ({
    blockId,
    blockType: BLOCKS[blockId].kind,
    state: 'failed' as const
  }));
}

describe('DV-C1 the validation sidebar', () => {
  beforeEach(() => {
    for (const spy of [outside, protruding, hiddenTexts, lowResolution]) {
      spy.mockClear();
      spy.mockResolvedValue([]);
    }
  });

  it('waits for the first run before it reports anything', () => {
    render(<Sidebar cesdk={null} />);

    expect(screen.getByText('Check pending')).toBeDefined();
    expect(screen.getByText('Loading...')).toBeDefined();
    expect(outside).not.toHaveBeenCalled();
  });

  it('reports a clean design once every check has run', async () => {
    const editor = fakeEditor(BLOCKS);

    render(<Sidebar cesdk={editor.cesdk as never} />);

    expect(await screen.findByText('No design errors found.')).toBeDefined();
    expect(screen.getByText('Check performed')).toBeDefined();
    expect(screen.getByText('0 results')).toBeDefined();
  });

  it('names every block kind the way the panel decides', async () => {
    outside.mockResolvedValue(results(1, 2, 3, 4, 5, 6));
    const editor = fakeEditor(BLOCKS);

    render(<Sidebar cesdk={editor.cesdk as never} />);

    expect(await screen.findByText('6 results')).toBeDefined();
    // A layer name that is not the default `Text` wins over the kind.
    expect(screen.getByText('Hero image')).toBeDefined();
    expect(screen.getByText('A headline that runs p...')).toBeDefined();
    expect(screen.getByText('Sticker')).toBeDefined();
    expect(screen.getByText('Shape')).toBeDefined();
    expect(screen.getByText('audio')).toBeDefined();
    expect(screen.getByText('Text')).toBeDefined();
  });

  it('falls back to Unknown for a block with no kind', async () => {
    outside.mockResolvedValue(results(8));
    const editor = fakeEditor(BLOCKS);

    render(<Sidebar cesdk={editor.cesdk as never} />);

    expect(await screen.findByText('Unknown')).toBeDefined();
  });

  it('names nothing and selects nothing once the editor is gone', async () => {
    outside.mockResolvedValue(results(5));
    const editor = fakeEditor(BLOCKS);
    const { rerender } = render(<Sidebar cesdk={editor.cesdk as never} />);
    await screen.findByText('Hero image');

    rerender(<Sidebar cesdk={null} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Select' }));

    expect(screen.queryByText('Hero image')).toBeNull();
    expect([...editor.selected]).toEqual([]);
  });

  it('selects the block a result names, and leaves a locked one alone', async () => {
    outside.mockResolvedValue(results(5, 7));
    const editor = fakeEditor(BLOCKS);
    editor.selected.add(99);
    render(<Sidebar cesdk={editor.cesdk as never} />);
    const user = userEvent.setup();

    const buttons = await screen.findAllByRole('button', { name: 'Select' });
    await user.click(buttons[0]);
    expect([...editor.selected]).toEqual([5]);

    await user.click(buttons[1]);
    expect([...editor.selected]).toEqual([5]);
  });

  it('loads every resource before the checks read the layout', async () => {
    const editor = fakeEditor(BLOCKS);
    render(<Sidebar cesdk={editor.cesdk as never} />);
    await screen.findByText('Check performed');

    expect(editor.forceLoadResources).toHaveBeenCalledWith([1]);
    expect(editor.forceLoadResources.mock.invocationCallOrder[0]).toBeLessThan(
      outside.mock.invocationCallOrder[0]
    );
  });

  it('re-runs the checks when history commits', async () => {
    const editor = fakeEditor(BLOCKS);
    render(<Sidebar cesdk={editor.cesdk as never} />);
    await screen.findByText('Check performed');
    expect(outside).toHaveBeenCalledTimes(1);

    editor.listeners.history!();

    await waitFor(() => expect(outside).toHaveBeenCalledTimes(2));
  });

  it('releases the history subscription when it goes away', async () => {
    const editor = fakeEditor(BLOCKS);
    const { unmount } = render(<Sidebar cesdk={editor.cesdk as never} />);
    await screen.findByText('Check performed');

    unmount();

    expect(editor.unsubscribeHistory).toHaveBeenCalledTimes(1);
  });
});

describe('DV-C2 the app shell', () => {
  beforeEach(() => {
    reportDemoPhase.mockClear();
  });

  afterEach(() => {
    delete (window as { cesdk?: unknown }).cesdk;
  });

  it('configures the editor and loads the demo scene', async () => {
    render(<App editorConfig={{}} />);
    const editor = fakeEditor(BLOCKS);

    await wrapper.init(editor.cesdk);

    expect((window as { cesdk?: unknown }).cesdk).toBe(editor.cesdk);
    expect(initDesignValidationEditor).toHaveBeenCalledWith(editor.cesdk);
    expect(editor.cesdk.load).toHaveBeenCalledWith(
      expect.stringContaining('/assets/example.scene')
    );
    expect(await screen.findByText('Check performed')).toBeDefined();
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['created', 'ready']);
    expect(wrapper.onLoadingStateChange).toBe(reportDemoLoadingState);
  });

  it('reports a failed editor start-up with its cause', () => {
    render(<App editorConfig={{}} />);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    wrapper.onError({ message: 'no license', cause: 'expired' });

    expect(consoleError).toHaveBeenCalledWith(
      'Failed to initialize CE.SDK:',
      'no license',
      'expired'
    );
    consoleError.mockRestore();
  });
});
