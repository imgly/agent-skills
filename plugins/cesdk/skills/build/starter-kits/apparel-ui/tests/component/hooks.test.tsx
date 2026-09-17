// @vitest-environment jsdom
import {
  act,
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
const { IMAGE_BLOCK, PAGE_A, SCENE, TEXT_BLOCK } =
  await import('./support/fake-engine');
const { useEditor } = await import('../../src/app/contexts/EditorContext');
const { useEngine } = await import('../../src/app/contexts/EngineContext');
const { useSinglePageMode } =
  await import('../../src/app/contexts/SinglePageModeContext');
const { useSelection } = await import('../../src/app/contexts/UseSelection');
const { useBlockBar } =
  await import('../../src/app/ui/BlockBarContext/BlockBarContext');
const { useProperty } = await import('../../src/app/hooks/UseSelectedProperty');
const { useToolbarHeight } =
  await import('../../src/app/ui/UseToolbarHeight/UseToolbarHeight');
const { useOnClickOutside } =
  await import('../../src/app/ui/ColorPicker/UseOnClickOutside');

describe('AP-C30 every context refuses to be used outside its provider', () => {
  it.each([
    ['useEditor', useEditor, 'useEditor must be used within a EditorProvider'],
    ['useEngine', useEngine, 'useEngine must be used within a EngineProvider'],
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

describe('AP-C31 refocusing the canvas', () => {
  it('zooms to the page whenever the canvas is resized', async () => {
    const handle = await renderWithProviders(<span />);
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => resizeObservedElements());

    expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalledWith(
      PAGE_A,
      expect.anything()
    );
  });

  it('zooms to the page when the visual viewport changes', async () => {
    const handle = await renderWithProviders(<span />);
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => {
      window.visualViewport?.dispatchEvent(new Event('resize'));
    });

    expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalledWith(
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

  it('leaves the canvas alone in crop mode when the block is gone', async () => {
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
    handle.blocks.delete(IMAGE_BLOCK);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => handle.setEditMode('Crop'));

    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });

  it('scrolls to the text cursor in text mode', async () => {
    const handle = await renderWithProviders(<span />, {
      cursorY: 5000,
      selection: [TEXT_BLOCK]
    });
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.select([TEXT_BLOCK]);

    act(() => handle.setEditMode('Text'));

    // Only the text-scroll path looks the camera up; the camera arithmetic
    // itself is pinned by the headless suite.
    await waitFor(() =>
      expect(handle.engine.block.findByType).toHaveBeenCalledWith('camera')
    );
  });

  it('refreshes the page list when the scene tree changes', async () => {
    const handle = await renderWithProviders(<span />);
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.spy('scene.getPages').mockClear();

    act(() => handle.emitBlockEvent(SCENE));

    // The page list is unchanged, so nothing re-renders off the back of it.
    expect(handle.spy('scene.getPages')).toHaveBeenCalled();
    expect(handle.engine.block.isVisible(PAGE_A)).toBe(true);
  });

  it('follows the text cursor while the editor stays in text mode', async () => {
    const handle = await renderWithProviders(<span />, {
      cursorY: 5000,
      selection: [TEXT_BLOCK]
    });
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.select([TEXT_BLOCK]);
    act(() => handle.setEditMode('Text'));

    handle.engine.editor.getTextCursorPositionInScreenSpaceY = vi.fn(
      () => 6000
    );
    act(() => handle.setEditMode('Text'));

    await waitFor(() =>
      expect(handle.engine.block.findByType).toHaveBeenCalledWith('camera')
    );
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

  it('starts a fresh history for the page the scene names', async () => {
    const handle = await renderWithProviders(<span />);

    await waitFor(() =>
      expect(handle.engine.editor.createHistory).toHaveBeenCalled()
    );
    expect(handle.engine.editor.setActiveHistory).toHaveBeenCalledWith(2);
    expect(handle.engine.editor.destroyHistory).toHaveBeenCalledWith(1);
  });
});

describe('AP-C32 the toolbar height', () => {
  function ToolbarProbe() {
    const { ref } = useToolbarHeight();
    return <div ref={ref}>bar</div>;
  }

  it('adds the measured bar height to the bottom padding', async () => {
    const handle = await renderWithProviders(<ToolbarProbe />, {
      paddingBottom: 10
    });
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => resizeObservedElements());

    await waitFor(() => {
      const [, options] = handle.spy('scene.zoomToBlock').mock.calls.at(-1) as [
        number,
        { padding: { bottom: number } }
      ];
      // jsdom measures every element as zero high, so only the 12px gap is left.
      expect(options.padding.bottom).toBe(22);
    });
  });
});

describe('AP-C33 closing the picker on an outside click', () => {
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

describe('AP-C34 reading and writing a block property', () => {
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
    await renderWithProviders(
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

describe('AP-C35 the canvas element', () => {
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

describe('AP-C36 redo', () => {
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

    const [, redo] = screen.getAllByRole('button');
    await waitFor(() =>
      expect((redo as HTMLButtonElement).disabled).toBe(false)
    );
    await userEvent.click(redo);

    expect(handle.engine.editor.redo).toHaveBeenCalledTimes(1);
  });
});
