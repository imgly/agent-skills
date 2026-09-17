// @vitest-environment jsdom
import {
  fireEvent,
  render,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createFakeEngine, type FakeEngine } from './fake-engine';

// These cases drive the bars through the editor context directly, which is the
// only way to reach the states the assembled app never produces: no engine yet,
// and the Recenter button behind `ENABLE_AUTO_RECENTER`.
const hoisted = vi.hoisted(() => ({
  context: {} as Record<string, unknown>
}));

vi.mock('../../src/app/contexts/EditorContext', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../../src/app/contexts/EditorContext')
  >()),
  useEditor: () => hoisted.context
}));

const { default: AdjustSliderBar } =
  await import('../../src/app/AdjustSecondary/AdjustSliderBar');
const { default: CropModeSecondary } =
  await import('../../src/app/CropModeSecondary/CropModeSecondary');
const { default: FilterSliderBar } =
  await import('../../src/app/FilterSecondary/FilterSliderBar');
const { default: PhotoUI } = await import('../../src/app/PhotoUI/PhotoUI');
const { default: TopBar } = await import('../../src/app/TopBar/TopBar');
const { ALL_FILTERS } =
  await import('../../src/app/FilterSecondary/FilterSecondary');

let engine: FakeEngine;

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??= ResizeObserverStub as never;
});

beforeEach(() => {
  engine = createFakeEngine();
  hoisted.context = {
    engine: null,
    engineIsLoaded: false,
    sceneIsLoaded: true,
    currentPageBlockId: undefined,
    editMode: 'Transform',
    enableAutoRecenter: true,
    canRecenter: false,
    selectedImageUrl: 'photo.jpg',
    refocus: vi.fn(),
    setCanRecenter: vi.fn(),
    setZoomPaddingBottom: vi.fn(),
    changeImage: vi.fn()
  };
});

describe('PH-C19 The bars before the engine is there', () => {
  it('renders the adjust slider as NaN and writes nothing', async () => {
    render(<AdjustSliderBar adjustmentId="brightness" />);
    // Known issue 5: an unreadable adjustment reaches the slider as NaN.
    expect(screen.getByText('NaN')).toBeTruthy();
    await userEvent.click(
      screen.getByText('Reset').closest('button') as HTMLButtonElement
    );
    expect(engine.calls).toEqual([]);
  });

  it('renders the filter slider at zero and writes nothing', async () => {
    render(<FilterSliderBar lutFilterConfig={ALL_FILTERS[0]} />);
    await userEvent.click(
      screen.getByText('Reset').closest('button') as HTMLButtonElement
    );
    expect(engine.calls).toEqual([]);
  });

  it('renders the crop bar with its defaults and writes nothing', async () => {
    render(<CropModeSecondary />);

    expect(screen.getByText('0°')).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', { name: 'Flip the image' })
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Rotate the image counterclockwise'
      })
    );
    await userEvent.click(
      screen.getByText('Reset').closest('button') as HTMLButtonElement
    );

    await userEvent.click(screen.getByRole('button', { name: 'Scale' }));
    expect(screen.getByText('0%')).toBeTruthy();

    const thumb = document.querySelector('.sliderWrapper span') as HTMLElement;
    fireEvent.mouseDown(thumb, { clientX: 0 });
    fireEvent.mouseMove(thumb, { clientX: -60 });
    fireEvent.mouseUp(thumb, { clientX: -60 });

    expect(engine.calls).toEqual([]);
  });
});

describe('PH-C20 The Recenter button', () => {
  it('appears in crop mode once the automatic recentering is off', async () => {
    hoisted.context.enableAutoRecenter = false;
    hoisted.context.editMode = 'Crop';
    hoisted.context.engine = engine.api;

    const { rerender } = render(<TopBar />);
    const recenter = screen.getByRole('button', { name: 'Recenter' });
    expect(recenter).toHaveProperty('disabled', true);

    hoisted.context.canRecenter = true;
    rerender(<TopBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Recenter' }));
    expect(hoisted.context.refocus).toHaveBeenCalledTimes(1);
  });

  it('stays hidden while the kit recenters on its own', () => {
    hoisted.context.editMode = 'Crop';
    hoisted.context.engine = engine.api;
    render(<TopBar />);
    expect(screen.queryByRole('button', { name: 'Recenter' })).toBeNull();
  });
});

describe('PH-C21 The crop drag settle timer', () => {
  it('restarts the 400 ms settle on a second drag instead of stacking it', () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    hoisted.context.engine = engine.api;
    hoisted.context.engineIsLoaded = true;
    hoisted.context.editMode = 'Crop';

    render(<PhotoUI />);
    fireEvent.mouseUp(engine.element);
    vi.advanceTimersByTime(200);
    fireEvent.mouseUp(engine.element);
    vi.advanceTimersByTime(200);
    expect(hoisted.context.refocus).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(hoisted.context.refocus).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('marks a canvas drag as resizing only for a dragging cursor', () => {
    hoisted.context.engine = engine.api;
    hoisted.context.engineIsLoaded = true;
    hoisted.context.editMode = 'Crop';

    const { container } = render(<PhotoUI />);
    const wrapper = container.firstElementChild as HTMLElement;
    fireEvent.mouseDown(engine.element);
    expect(wrapper.className).toContain('wrapper--in-resize');

    fireEvent.mouseUp(engine.element);
    expect(wrapper.className).not.toContain('wrapper--in-resize');
  });
});
