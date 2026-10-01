// @vitest-environment jsdom
import {
  act,
  renderHook,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { useEffect, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders, resizeObservedElements, installBrowserStubs } =
  await import('./support/render');
const { BACK_PAGE, FRONT_PAGE, IMAGE_BLOCK, SCENE, TEXT_BLOCK } =
  await import('./support/fake-engine');
const { useEditor } = await import('@/app/contexts/EditorContext');
const { useEngine } = await import('@/app/contexts/EngineContext');
const { usePageSettings } = await import('@/app/contexts/PageSettingsContext');
const { useSinglePageMode } =
  await import('@/app/contexts/SinglePageModeContext');
const { useSelection } = await import('@/app/contexts/SelectionContext');
const { useBlockBar } =
  await import('@/app/components/BlockBarContext/BlockBarContext');
const { useProperty } = await import('@/app/hooks/useSelectedProperty');
const { useToolbarHeight } =
  await import('@/app/components/UseToolbarHeight/UseToolbarHeight');
const { useOnClickOutside } =
  await import('@/app/components/ColorPicker/UseOnClickOutside');
const { default: useDebounceCallback } =
  await import('@/app/components/ColorPicker/UseDebounceCallback');

describe('PC-C30 every context refuses to be used outside its provider', () => {
  it.each([
    ['useEditor', useEditor, 'useEditor must be used within a EditorProvider'],
    ['useEngine', useEngine, 'useEngine must be used within a EngineProvider'],
    [
      'usePageSettings',
      usePageSettings,
      'usePageSettings must be used within a PageSettingsProvider'
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

/**
 * The single-page mode only does anything once a template has switched it on,
 * so every case here mounts with one already picked.
 */
function WithTemplate({ children }: { children: ReactNode }) {
  const { setPostcardTemplateId, sceneIsLoaded } = useEditor();
  useEffect(() => setPostcardTemplateId('thank_you'), [setPostcardTemplateId]);
  return sceneIsLoaded ? <>{children}</> : <span>loading</span>;
}

/** Reads the single-page-mode context out so a test can drive it. */
function SinglePageProbe({
  onReady
}: {
  onReady: (value: ReturnType<typeof useSinglePageMode>) => void;
}) {
  onReady(useSinglePageMode());
  return <span>probe</span>;
}

async function renderLoaded(ui: ReactNode, options?: Record<string, unknown>) {
  const handle = await renderWithProviders(
    <WithTemplate>{ui}</WithTemplate>,
    options
  );
  await waitFor(() =>
    expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
  );
  return handle;
}

describe('PC-C31 refocusing the canvas', () => {
  it('zooms to the page whenever the canvas is resized', async () => {
    const handle = await renderLoaded(<span />);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => resizeObservedElements());

    expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalledWith(
      FRONT_PAGE,
      expect.anything()
    );
  });

  it('zooms to the page when the visual viewport changes', async () => {
    const handle = await renderLoaded(<span />);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => {
      window.visualViewport?.dispatchEvent(new Event('resize'));
    });

    expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalledWith(
      FRONT_PAGE,
      expect.anything()
    );
  });

  it('zooms to the selected block in crop mode once that is turned on', async () => {
    let context: ReturnType<typeof useSinglePageMode> | undefined;
    const handle = await renderLoaded(
      <SinglePageProbe
        onReady={(value) => {
          context = value;
        }}
      />
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
    const handle = await renderLoaded(
      <SinglePageProbe
        onReady={(value) => {
          context = value;
        }}
      />
    );
    act(() => context?.setRefocusCropModeEnabled(true));
    handle.select([IMAGE_BLOCK]);
    handle.blocks.delete(IMAGE_BLOCK);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => handle.setEditMode('Crop'));

    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });

  it('follows the text cursor while the editor stays in text mode', async () => {
    const handle = await renderLoaded(<span />, {
      cursorY: 5000,
      selection: [TEXT_BLOCK]
    });
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

  it('refreshes the page list when the scene tree changes', async () => {
    const handle = await renderLoaded(<span />);
    handle.spy('scene.getPages').mockClear();

    act(() => handle.emitBlockEvent(SCENE));

    expect(handle.spy('scene.getPages')).toHaveBeenCalled();
    expect(handle.engine.block.isVisible(FRONT_PAGE)).toBe(true);
  });

  it('leaves the canvas alone while the scene has no page', async () => {
    const handle = await renderWithProviders(
      <WithTemplate>{null}</WithTemplate>,
      {
        configure: (fake) => {
          (
            fake.engine.block.findByType as ReturnType<typeof vi.fn>
          ).mockReturnValue([]);
          (
            fake.engine.scene.getPages as ReturnType<typeof vi.fn>
          ).mockReturnValue([]);
        }
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });

  it('starts a fresh history for the page the scene names', async () => {
    const handle = await renderLoaded(<span />);

    expect(handle.engine.editor.createHistory).toHaveBeenCalled();
    expect(handle.engine.editor.setActiveHistory).toHaveBeenCalledWith(2);
    expect(handle.engine.editor.destroyHistory).toHaveBeenCalledWith(1);
  });

  it('shows only the page the current step names', async () => {
    const handle = await renderLoaded(<span />);

    await waitFor(() => {
      expect(handle.engine.block.isVisible(BACK_PAGE)).toBe(false);
    });
    expect(handle.engine.block.isVisible(FRONT_PAGE)).toBe(true);
  });
});

describe('PC-C32 the toolbar height', () => {
  function ToolbarProbe() {
    const { ref } = useToolbarHeight();
    return <div ref={ref}>bar</div>;
  }

  it('adds the measured bar height to the bottom padding', async () => {
    const handle = await renderLoaded(<ToolbarProbe />);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => resizeObservedElements());

    await waitFor(() => {
      const [, options] = handle.spy('scene.zoomToBlock').mock.calls.at(-1) as [
        number,
        { padding: { bottom: number } }
      ];
      // jsdom measures every element as zero high, so only the 12px gap is left.
      expect(options.padding.bottom).toBe(104);
    });
  });
});

describe('PC-C33 the debounced picker callback', () => {
  it('fires once after the delay, however many times it is called', () => {
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

describe('PC-C34 closing the picker on an outside click', () => {
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

describe('PC-C35 reading and writing a block property', () => {
  function PropertyProbe({
    block,
    property
  }: {
    block: number;
    property: string;
  }) {
    const [value, setValue] = useProperty(block, property);
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
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
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
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('survives a setter the engine refuses', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
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

    expect(error).toHaveBeenCalled();
    error.mockRestore();
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

describe('PC-C36 the canvas element', () => {
  it('puts the engine canvas back when the wrapper unmounts', async () => {
    const CESDKCanvas = (
      await import('@/app/components/CESDKCanvas/CESDKCanvas')
    ).default;
    const { engine, rendered } = await renderWithProviders(
      <CESDKCanvas isVisible={false} />
    );

    const wrapper = document.getElementById('cesdk') as HTMLElement;
    expect(wrapper.style.visibility).toBe('hidden');
    expect(wrapper.contains(engine.element ?? null)).toBe(true);

    rendered.unmount();
    expect(document.getElementById('cesdk')).toBeNull();
  });

  it('waits for the engine to hand it a canvas element', async () => {
    const CESDKCanvas = (
      await import('@/app/components/CESDKCanvas/CESDKCanvas')
    ).default;
    const { rendered } = await renderWithProviders(<CESDKCanvas isVisible />, {
      configure: (fake) => {
        Object.defineProperty(fake.engine, 'element', { value: undefined });
      }
    });

    expect(rendered.container.querySelector('canvas')).toBeNull();
  });
});

describe('PC-C37 undo and redo', () => {
  it('runs each history action once the engine allows it', async () => {
    const UndoRedoButtons = (
      await import('@/app/components/UndoRedoButtons/UndoRedoButtons')
    ).default;
    const handle = await renderWithProviders(<UndoRedoButtons />, {
      configure: (fake) => {
        (
          fake.engine.editor.canRedo as ReturnType<typeof vi.fn>
        ).mockReturnValue(true);
      }
    });
    act(() => handle.emitHistoryUpdated());

    const [undo, redo] = screen.getAllByRole('button');
    await waitFor(() =>
      expect((undo as HTMLButtonElement).disabled).toBe(false)
    );
    await userEvent.click(undo);
    await userEvent.click(redo);

    expect(handle.engine.actions.run).toHaveBeenCalledWith('history.undo');
    expect(handle.engine.actions.run).toHaveBeenCalledWith('history.redo');
    expect(handle.engine.editor.undo).toHaveBeenCalledTimes(1);
    expect(handle.engine.editor.redo).toHaveBeenCalledTimes(1);
  });
});
