// @vitest-environment jsdom
import {
  act,
  render,
  renderHook,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders, resizeObservedElements, installBrowserStubs } =
  await import('./support/render');
const { IMAGE_BLOCK, PAGE_A, TEXT_BLOCK, engineSpy } =
  await import('./support/fake-engine');
const { useEditor } = await import('../../src/app/contexts/EditorContext');
const { useEngine } = await import('../../src/app/contexts/EngineContext');
const { usePagePreview } =
  await import('../../src/app/contexts/PagePreviewContext');
const { useSinglePageMode } =
  await import('../../src/app/contexts/SinglePageModeContext');
const { useSelection } = await import('../../src/app/contexts/UseSelection');
const { useBlockBar } =
  await import('../../src/app/ui/BlockBarContext/BlockBarContext');
const { useProperty } =
  await import('../../src/app/contexts/UseSelectedProperty');
const { useToolbarHeight } =
  await import('../../src/app/ui/UseToolbarHeight/UseToolbarHeight');
const { useOnClickOutside } =
  await import('../../src/app/ui/ColorPicker/UseOnClickOutside');
const { default: useDebounceCallback } =
  await import('../../src/app/ui/ColorPicker/UseDebounceCallback');

describe('PB-C60 every context refuses to be used outside its provider', () => {
  it.each([
    ['useEditor', useEditor, 'useEditor must be used within a EditorProvider'],
    ['useEngine', useEngine, 'useEngine must be used within a EngineProvider'],
    [
      'usePagePreview',
      usePagePreview,
      'usePagePreview must be used within a PagePreviewProvider'
    ],
    [
      'useSinglePageMode',
      useSinglePageMode,
      'useSinglePageMode must be used within a SinglePageModeProvider'
    ],
    [
      'useSelection',
      useSelection,
      'useSelection must be used within a SelectionContext'
    ],
    [
      'useBlockBar',
      useBlockBar,
      'useBlockBar must be used within a BlockBarProvider'
    ]
  ])('%s', (_name, hook, message) => {
    expect(() => renderHook(() => hook())).toThrow(message);
  });
});

/** Reads the single-page-mode context out so a test can drive it. */
function SinglePageProbe({
  onReady
}: {
  onReady: (value: ReturnType<typeof useSinglePageMode>) => void;
}) {
  const value = useSinglePageMode();
  onReady(value);
  return <span>probe</span>;
}

describe('PB-C61 refocusing the canvas', () => {
  it('zooms to the page whenever the canvas is resized', async () => {
    const { engine } = await renderWithProviders(<span />);
    await waitFor(() =>
      expect(engineSpy(engine, 'scene.zoomToBlock')).toHaveBeenCalled()
    );
    engineSpy(engine, 'scene.zoomToBlock').mockClear();

    act(() => resizeObservedElements());

    expect(engineSpy(engine, 'scene.zoomToBlock')).toHaveBeenCalledWith(
      PAGE_A,
      expect.anything()
    );
  });

  it('zooms to the page when the visual viewport changes', async () => {
    const { engine } = await renderWithProviders(<span />);
    await waitFor(() =>
      expect(engineSpy(engine, 'scene.zoomToBlock')).toHaveBeenCalled()
    );
    engineSpy(engine, 'scene.zoomToBlock').mockClear();

    act(() => {
      window.visualViewport?.dispatchEvent(new Event('resize'));
    });

    expect(engineSpy(engine, 'scene.zoomToBlock')).toHaveBeenCalledWith(
      PAGE_A,
      expect.anything()
    );
  });

  it('zooms to the selected block in crop mode once that is turned on', async () => {
    let context: ReturnType<typeof useSinglePageMode> | undefined;
    const handle = await renderWithProviders(
      <SinglePageProbe
        onReady={(value) => {
          context = value;
        }}
      />
    );
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    act(() => context?.setRefocusCropModeEnabled(true));
    handle.select([IMAGE_BLOCK]);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => handle.setEditMode('Crop'));

    await waitFor(() => {
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalledWith(
        IMAGE_BLOCK,
        expect.anything()
      );
    });
  });

  it('scrolls to the text cursor in text mode', async () => {
    let context: ReturnType<typeof useSinglePageMode> | undefined;
    const handle = await renderWithProviders(
      <SinglePageProbe
        onReady={(value) => {
          context = value;
        }}
      />,
      { cursorY: 5000, selection: [TEXT_BLOCK] }
    );
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    act(() => handle.setEditMode('Text'));
    handle.select([TEXT_BLOCK]);

    act(() => context?.refocus());

    // Only the text-scroll path looks the camera up; the camera arithmetic
    // itself is pinned by PB-U17.
    expect(handle.engine.block.findByType).toHaveBeenCalledWith('camera');
  });

  it('leaves the canvas alone while the scene has no page', async () => {
    const handle = await renderWithProviders(<span />, {
      configure: (fake) => {
        (
          fake.engine.block.findByType as ReturnType<typeof vi.fn>
        ).mockReturnValue([]);
        (
          fake.engine.scene.getPages as ReturnType<typeof vi.fn>
        ).mockReturnValue([]);
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });
});

describe('PB-C62 the toolbar height', () => {
  function ToolbarProbe() {
    const { ref } = useToolbarHeight();
    return <div ref={ref}>bar</div>;
  }

  it('adds the measured bar height to the bottom padding', async () => {
    const { engine } = await renderWithProviders(<ToolbarProbe />, {
      paddingBottom: 10
    });
    await waitFor(() =>
      expect(engineSpy(engine, 'scene.zoomToBlock')).toHaveBeenCalled()
    );
    engineSpy(engine, 'scene.zoomToBlock').mockClear();

    act(() => resizeObservedElements());

    await waitFor(() => {
      const [, options] = engineSpy(engine, 'scene.zoomToBlock').mock.calls.at(
        -1
      ) as [number, { padding: { bottom: number } }];
      // jsdom measures every element as zero high, so only the 12px gap is left.
      expect(options.padding.bottom).toBe(22);
    });
  });
});

describe('PB-C63 the debounced picker callback', () => {
  it('fires once after the delay, however many times it is called', async () => {
    vi.useFakeTimers();
    try {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebounceCallback(callback, 500));

      act(() => {
        result.current();
        result.current();
      });
      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(callback).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('PB-C64 closing the picker on an outside click', () => {
  it('calls back for a real click outside, and not for one inside', () => {
    installBrowserStubs();
    const callback = vi.fn();
    const inside = document.createElement('div');
    document.body.appendChild(inside);
    // jsdom makes `isTrusted` non-configurable on a real event, so the handler
    // the hook registers is captured and called with the shape it reads.
    let handler: ((event: MouseEvent) => void) | undefined;
    const addEventListener = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation((type, listener) => {
        if (type === 'click') handler = listener as never;
      });
    renderHook(() => useOnClickOutside({ current: inside }, callback));
    addEventListener.mockRestore();

    handler?.({ target: inside, isTrusted: true } as unknown as MouseEvent);
    expect(callback).not.toHaveBeenCalled();

    handler?.({
      target: document.body,
      isTrusted: true
    } as unknown as MouseEvent);
    expect(callback).toHaveBeenCalledTimes(1);

    // A scripted click must not close the picker the script just opened.
    handler?.({
      target: document.body,
      isTrusted: false
    } as unknown as MouseEvent);
    expect(callback).toHaveBeenCalledTimes(1);
    inside.remove();
  });
});

describe('PB-C65 reading and writing a block property', () => {
  function PropertyProbe({
    block,
    property
  }: {
    block: number;
    property: string;
  }) {
    const [value, setValue] = useProperty(block, property) as [
      unknown,
      (next: unknown) => void
    ];
    return (
      <button onClick={() => setValue('Right')}>{String(value ?? '')}</button>
    );
  }

  it('reads nothing and writes nothing without a block', async () => {
    const { engine } = await renderWithProviders(
      <PropertyProbe block={0} property="text/horizontalAlignment" />
    );

    await userEvent.click(screen.getByRole('button'));
    expect(engine.block.setEnum).not.toHaveBeenCalled();
  });

  it('survives a property the block does not carry', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { engine } = await renderWithProviders(
      <PropertyProbe block={TEXT_BLOCK} property="text/text" />
    );

    expect(screen.getByRole('button').textContent).toBe('');
    await userEvent.click(screen.getByRole('button'));
    expect(engine.block.setString).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'text/text',
      'Right'
    );
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  it('survives a setter the engine refuses', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const handle = await renderWithProviders(
      <PropertyProbe block={TEXT_BLOCK} property="text/horizontalAlignment" />,
      {
        configure: (fake) => {
          (
            fake.engine.block.setEnum as ReturnType<typeof vi.fn>
          ).mockImplementation(() => {
            throw new Error('scope not allowed');
          });
        }
      }
    );

    await userEvent.click(screen.getByRole('button'));

    expect(log).toHaveBeenCalled();
    expect(handle.engine.editor.addUndoStep).toBeDefined();
    log.mockRestore();
  });

  it('ignores an update event that destroys the block', async () => {
    const handle = await renderWithProviders(
      <PropertyProbe block={TEXT_BLOCK} property="text/horizontalAlignment" />
    );
    expect(screen.getByRole('button').textContent).toBe('Left');

    handle.properties.set(`${TEXT_BLOCK}:text/horizontalAlignment`, 'Center');
    act(() => handle.emitBlockEvent(TEXT_BLOCK, 'Destroyed'));

    expect(screen.getByRole('button').textContent).toBe('Left');
  });
});

describe('PB-C66 the canvas element', () => {
  it('puts the engine canvas back when the wrapper unmounts', async () => {
    const CESDKCanvas = (
      await import('../../src/app/ui/CESDKCanvas/CESDKCanvas')
    ).default;
    const { engine, rendered } = await renderWithProviders(
      <CESDKCanvas isVisible={false} />
    );

    const wrapper = document.getElementById('cesdk') as HTMLElement;
    expect(wrapper.style.visibility).toBe('hidden');
    expect(wrapper.contains(engine.element)).toBe(true);

    rendered.unmount();
    expect(document.getElementById('cesdk')).toBeNull();
  });
});

describe('PB-C67 redo', () => {
  it('redoes through the engine once the engine allows it', async () => {
    const UndoRedoButtons = (
      await import('../../src/app/ui/UndoRedoButtons/UndoRedoButtons')
    ).default;
    const handle = await renderWithProviders(<UndoRedoButtons />, {
      configure: (fake) => {
        (
          fake.engine.editor.canRedo as ReturnType<typeof vi.fn>
        ).mockReturnValue(true);
      }
    });
    act(() => handle.emitHistoryUpdated());

    const redo = screen.getByRole('button', { name: 'Redo' });
    await waitFor(() =>
      expect((redo as HTMLButtonElement).disabled).toBe(false)
    );
    await userEvent.click(redo);

    expect(handle.engine.editor.redo).toHaveBeenCalledTimes(1);
  });
});

describe('PB-C68 the block bar selection', () => {
  it('renders children with the active flag the bar computes', async () => {
    const BlockBar = (await import('../../src/app/ui/BlockBar/BlockBar'))
      .default;
    const Child = ({ isActive }: { isActive?: boolean }) => (
      <button>{isActive ? 'child active' : 'child idle'}</button>
    );

    render(
      <BlockBar
        items={[
          {
            id: 'one',
            label: 'One',
            Component: <span>one panel</span>,
            Icon: <span>icon</span>
          }
        ]}
      >
        <Child />
        {'plain text'}
      </BlockBar>
    );

    expect(screen.getByText('child active')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'icon One' }));
    expect(screen.getByText('one panel')).toBeTruthy();
    expect(screen.getByText('child idle')).toBeTruthy();
  });
});
