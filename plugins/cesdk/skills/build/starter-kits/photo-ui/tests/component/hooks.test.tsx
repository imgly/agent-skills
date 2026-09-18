// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@imgly/kit-test-harness/component';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useProperty,
  useSelectedProperty
} from '../../src/app/hooks/useSelectedProperty';
import { useSinglePageFocus } from '../../src/app/hooks/useSinglePageFocus';
import {
  ADJUSTMENT_EFFECT,
  argsOf,
  createFakeEngine,
  PAGE,
  type FakeEngine
} from './fake-engine';

const SECOND_PAGE = 12;

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??= ResizeObserverStub as never;
  setVisualViewport(800);
});

/** jsdom defines no `visualViewport`, and the hook reads it as a bare global. */
function setVisualViewport(height: number): EventTarget & { height: number } {
  const viewport = new EventTarget() as EventTarget & { height: number };
  viewport.height = height;
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: viewport
  });
  return viewport;
}

let engine: FakeEngine;

beforeEach(() => {
  engine = createFakeEngine();
});

describe('PH-C13 useProperty', () => {
  it('reads the initial value through the type-specific getter', () => {
    const { result } = renderHook(() =>
      useProperty<number>(engine.api, ADJUSTMENT_EFFECT, 'adjustments/gamma')
    );
    expect(result.current[0]).toBe(0.5);
  });

  it('returns undefined without an engine or without a block', () => {
    const { result: noEngine } = renderHook(() =>
      useProperty<number>(null, ADJUSTMENT_EFFECT, 'adjustments/gamma')
    );
    expect(noEngine.current[0]).toBeUndefined();

    const { result: noBlock } = renderHook(() =>
      useProperty<number>(engine.api, undefined, 'adjustments/gamma')
    );
    expect(noBlock.current[0]).toBeUndefined();

    act(() => noBlock.current[1](1));
    expect(argsOf(engine, 'setFloat')).toEqual([]);
  });

  it('writes through the setter and adds one undo step by default', () => {
    const { result } = renderHook(() =>
      useProperty<number>(engine.api, ADJUSTMENT_EFFECT, 'adjustments/gamma')
    );
    act(() => result.current[1](0.25));

    expect(argsOf(engine, 'setFloat')).toContainEqual([
      ADJUSTMENT_EFFECT,
      'adjustments/gamma',
      0.25
    ]);
    expect(argsOf(engine, 'addUndoStep')).toHaveLength(1);
  });

  it('skips the undo step when the caller opts out', () => {
    const { result } = renderHook(() =>
      useProperty<number>(engine.api, ADJUSTMENT_EFFECT, 'adjustments/gamma', {
        shouldAddUndoStep: false
      })
    );
    act(() => result.current[1](0.25));
    expect(argsOf(engine, 'addUndoStep')).toHaveLength(0);
  });

  it.each([
    ['Bool', 'setBool', false],
    ['String', 'setString', 'value'],
    ['Color', 'setColorRGBA', { r: 1, g: 0, b: 0, a: 1 }]
  ])('routes a %s property to %s', (type, method, value) => {
    const typed = createFakeEngine();
    vi.spyOn(typed.api.block, 'getPropertyType').mockReturnValue(
      type as ReturnType<typeof typed.api.block.getPropertyType>
    );
    const { result } = renderHook(() =>
      useProperty(typed.api, ADJUSTMENT_EFFECT, 'some/property')
    );
    act(() => result.current[1](value));
    expect(argsOf(typed, method)).toContainEqual([
      ADJUSTMENT_EFFECT,
      'some/property',
      value
    ]);
  });

  it('reports an engine error instead of throwing out of the hook', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    vi.spyOn(engine.api.block, 'getPropertyType').mockImplementation(() => {
      throw new Error('unknown property');
    });

    const { result } = renderHook(() =>
      useProperty<number>(engine.api, ADJUSTMENT_EFFECT, 'adjustments/nope')
    );
    expect(result.current[0]).toBeUndefined();
    act(() => result.current[1](1));

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('refreshes on a block event and stops on a Destroyed one', async () => {
    const { result } = renderHook(() =>
      useProperty<number>(engine.api, ADJUSTMENT_EFFECT, 'adjustments/gamma')
    );
    act(() => {
      engine.api.block.setFloat(ADJUSTMENT_EFFECT, 'adjustments/gamma', 0.9);
      engine.emitBlockEvent(ADJUSTMENT_EFFECT);
    });
    await waitFor(() => expect(result.current[0]).toBe(0.9));

    act(() => {
      engine.api.block.setFloat(ADJUSTMENT_EFFECT, 'adjustments/gamma', 0.1);
      engine.emitBlockEvent(ADJUSTMENT_EFFECT, 'Destroyed');
    });
    expect(result.current[0]).toBe(0.9);
  });
});

describe('PH-C14 useSelectedProperty', () => {
  it('pins the block that was selected when the hook mounted', () => {
    const { result } = renderHook(() =>
      useSelectedProperty<number>(engine.api, 'adjustments/gamma')
    );
    act(() => result.current[1](0.75));
    expect(argsOf(engine, 'setFloat')).toContainEqual([
      PAGE,
      'adjustments/gamma',
      0.75
    ]);
  });

  it('has no block to read without an engine', () => {
    const { result } = renderHook(() =>
      useSelectedProperty<number>(null, 'adjustments/gamma')
    );
    expect(result.current[0]).toBeUndefined();
  });
});

describe('PH-C15 useSinglePageFocus', () => {
  const mount = (options: Parameters<typeof createFakeEngine>[0] = {}) => {
    engine = createFakeEngine(options);
    const rendered = renderHook(() =>
      useSinglePageFocus({ zoomPaddingBottomDefault: 80 })
    );
    act(() => {
      rendered.result.current.setEngine(engine.api);
      rendered.result.current.setEnabled(true);
    });
    return rendered;
  };

  it('stays inert until it is enabled and given an engine', () => {
    const { result } = renderHook(() => useSinglePageFocus({}));
    act(() => result.current.refocus());
    expect(result.current.currentPageBlockId).toBeUndefined();
  });

  it('tracks the scene pages and zooms the current one with the paddings', () => {
    const { result } = mount();
    expect(result.current.currentPageBlockId).toBe(PAGE);

    act(() => result.current.refocus());
    expect(argsOf(engine, 'zoomToBlock')).toContainEqual([
      PAGE,
      { padding: { left: 0, top: 0, right: 0, bottom: 80 } }
    ]);
  });

  it('re-reads the page order when the scene emits', () => {
    const { result } = mount({ pages: [PAGE, SECOND_PAGE] });
    act(() => engine.emitBlockEvent(1));
    expect(result.current.currentPageBlockId).toBe(PAGE);
  });

  it('shows only the current page when the scene has several', () => {
    const { result } = mount({ pages: [PAGE, SECOND_PAGE] });
    act(() => result.current.setCurrentPageIndex(1));

    expect(argsOf(engine, 'setVisible')).toContainEqual([SECOND_PAGE, true]);
    expect(argsOf(engine, 'setVisible')).toContainEqual([PAGE, false]);
    expect(result.current.currentPageBlockId).toBe(SECOND_PAGE);
  });

  it('scrolls to the text cursor while editing text', async () => {
    setVisualViewport(300);
    mount({ cursorY: 900 });

    act(() => engine.api.editor.setEditMode('Text'));
    await waitFor(() =>
      expect(argsOf(engine, 'setPositionY').length).toBeGreaterThan(0)
    );

    // A moved cursor goes through the listener the text-cursor effect installed,
    // not the one that put the hook into Text mode.
    const before = argsOf(engine, 'setPositionY').length;
    vi.spyOn(
      engine.api.editor,
      'getTextCursorPositionInScreenSpaceY'
    ).mockReturnValue(950);
    act(() => engine.emitStateChanged());
    await waitFor(() =>
      expect(argsOf(engine, 'setPositionY').length).toBeGreaterThan(before)
    );
  });

  it('zooms the selected block in crop mode when asked to', () => {
    const { result } = mount();
    act(() => result.current.setRefocusCropModeEnabled(true));
    act(() => engine.api.editor.setEditMode('Crop'));

    expect(argsOf(engine, 'zoomToBlock')).toContainEqual([
      PAGE,
      { padding: { left: 0, top: 0, right: 0, bottom: 80 } }
    ]);
  });

  it('applies every padding setter to the next zoom', () => {
    const { result } = mount();
    act(() => {
      result.current.setZoomPaddingTop(4);
      result.current.setZoomPaddingBottom(8);
      result.current.setZoomPaddingLeft(12);
      result.current.setZoomPaddingRight(16);
    });
    act(() => result.current.refocus());

    expect(argsOf(engine, 'zoomToBlock').at(-1)).toEqual([
      PAGE,
      { padding: { left: 12, top: 4, right: 16, bottom: 8 } }
    ]);
  });

  it('refocuses when the visual viewport resizes', () => {
    const viewport = setVisualViewport(400);
    mount();
    const before = argsOf(engine, 'zoomToBlock').length;
    act(() => {
      viewport.dispatchEvent(new Event('resize'));
    });
    expect(argsOf(engine, 'zoomToBlock').length).toBeGreaterThan(before);
  });
});
