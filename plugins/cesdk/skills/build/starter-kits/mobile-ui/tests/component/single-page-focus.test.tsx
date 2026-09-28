// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it } from 'vitest';

import './support/jsdomEnv';
import { createFakeEngine, type FakeEngine } from './support/fakeEngine';
import { useSinglePageFocus } from '../../src/app/hooks/UseSinglePageFocus';

let engine: FakeEngine;

beforeEach(() => {
  engine = createFakeEngine({ pages: [10, 11] });
});

/** The hook as the kit configures it, with the engine already handed over. */
const mountFocus = async (enable = true) => {
  const view = renderHook(() =>
    useSinglePageFocus({
      zoomPaddingBottomDefault: 8,
      zoomPaddingLeftDefault: 8,
      zoomPaddingRightDefault: 8,
      zoomPaddingTopDefault: 8
    })
  );
  await act(async () => {
    view.result.current.setEngine(engine.asCreativeEngine());
    if (enable) view.result.current.setEnabled(true);
  });
  return view;
};

describe('MB-C35 the focus hook before it is enabled', () => {
  it('does nothing on refocus while it is switched off', async () => {
    const { result } = await mountFocus(false);
    act(() => result.current.refocus());
    expect(engine.scene.zoomToBlock).not.toHaveBeenCalled();
  });
});

describe('MB-C36 the crop refocus option the kit leaves off', () => {
  it('zooms to the selected block instead of the page in crop mode', async () => {
    engine.setSelection([5]);
    engine.editor.getEditMode.mockReturnValue('Crop');
    const { result } = await mountFocus();
    await waitFor(() => expect(engine.scene.zoomToBlock).toHaveBeenCalled());
    engine.scene.zoomToBlock.mockClear();

    await act(async () => result.current.setRefocusCropModeEnabled(true));
    act(() => result.current.refocus());

    expect(engine.scene.zoomToBlock).toHaveBeenCalledWith(5, {
      padding: { left: 8, top: 8, right: 8, bottom: 8 }
    });
  });

  it('does nothing when the selected block is gone', async () => {
    engine.setSelection([]);
    engine.editor.getEditMode.mockReturnValue('Crop');
    const { result } = await mountFocus();
    await act(async () => result.current.setRefocusCropModeEnabled(true));
    engine.scene.zoomToBlock.mockClear();

    act(() => result.current.refocus());
    expect(engine.scene.zoomToBlock).not.toHaveBeenCalled();
  });

  it('honours the padding the caller sets afterwards', async () => {
    engine.setSelection([5]);
    engine.editor.getEditMode.mockReturnValue('Crop');
    const { result } = await mountFocus();
    await act(async () => {
      result.current.setRefocusCropModeEnabled(true);
      result.current.setZoomPaddingTop(24);
      result.current.setZoomPaddingLeft(16);
      result.current.setZoomPaddingRight(16);
      result.current.setZoomPaddingBottom(32);
    });
    engine.scene.zoomToBlock.mockClear();

    act(() => result.current.refocus());
    expect(engine.scene.zoomToBlock).toHaveBeenCalledWith(5, {
      padding: { left: 16, top: 24, right: 16, bottom: 32 }
    });
  });
});

describe('MB-C37 the page zoom guards', () => {
  it('skips a page block the engine no longer knows', async () => {
    engine.block.isValid.mockReturnValue(false);
    const { result } = await mountFocus();
    engine.scene.zoomToBlock.mockClear();

    act(() => result.current.refocus());
    expect(engine.scene.zoomToBlock).not.toHaveBeenCalled();
  });

  it('moves to the page the caller selects', async () => {
    const { result } = await mountFocus();
    await waitFor(() => expect(engine.scene.zoomToBlock).toHaveBeenCalled());
    engine.scene.zoomToBlock.mockClear();

    await act(async () => result.current.setCurrentPageIndex(1));
    await waitFor(() =>
      expect(engine.scene.zoomToBlock.mock.calls.at(-1)?.[0]).toBe(11)
    );
    expect(engine.block.setVisible.mock.calls.at(-1)).toEqual([11, true]);
  });
});
