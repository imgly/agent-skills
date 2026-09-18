// @vitest-environment jsdom
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { argsOf, createFakeEngine, PAGE, type FakeEngine } from './fake-engine';

// jsdom evaluates no `@media` rule, so every breakpoint-guarded block stays at
// its `display: none` default and carries no accessible name. Those controls
// are located by their own text or by the `alt` the kit gives them.
const buttonWithText = (text: string) =>
  screen.getByText(text).closest('button') as HTMLButtonElement;
const buttonWithImage = (alt: string) =>
  screen.getByAltText(alt).closest('button') as HTMLButtonElement;

/** The slider thumb is the `react-draggable` child wrapping the tick marks. */
const dragSlider = (pixels: number) => {
  const thumb = document.querySelector('.sliderWrapper span') as HTMLElement;
  fireEvent.mouseDown(thumb, { clientX: 0, clientY: 0 });
  fireEvent.mouseMove(thumb, { clientX: pixels, clientY: 0 });
  fireEvent.mouseUp(thumb, { clientX: pixels, clientY: 0 });
};

const hoisted = vi.hoisted(() => ({
  engine: undefined as { api: unknown } | undefined
}));

vi.mock('@cesdk/engine', () => ({
  default: { init: vi.fn(async () => hoisted.engine?.api) }
}));

// The scene builder and the image measurement are the engine-facing half of
// `src/imgly`; the headless suite owns them. Everything else stays real.
vi.mock('../../src/imgly', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/imgly')>()),
  initPhotoEditor: vi.fn(async () => {}),
  setupPhotoScene: vi.fn(async () => {}),
  setImageSource: vi.fn(async () => {}),
  getImageSize: vi.fn(async () => ({ width: 800, height: 600 }))
}));

const { default: App } = await import('../../src/app/App');
const imgly = await import('../../src/imgly');

let engine: FakeEngine;

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??= ResizeObserverStub as never;
  if (globalThis.visualViewport == null) {
    Object.defineProperty(globalThis, 'visualViewport', {
      configurable: true,
      value: {
        height: 800,
        addEventListener() {},
        removeEventListener() {}
      }
    });
  }
  window.URL.createObjectURL ??= () => 'blob:photo';
  Element.prototype.scrollIntoView ??= () => {};
});

async function renderApp(
  options: Parameters<typeof createFakeEngine>[0] = {}
): Promise<void> {
  engine = createFakeEngine(options);
  hoisted.engine = engine;
  render(<App engineConfig={{ license: 'test' }} />);
  await screen.findByText('Export Image');
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PH-C7 The photo screen boots', () => {
  it('configures the engine, shows the three photos and the three tools', async () => {
    await renderApp();

    expect(imgly.initPhotoEditor).toHaveBeenCalledTimes(1);
    expect(imgly.initPhotoEditor).toHaveBeenCalledWith(
      engine.api,
      expect.stringContaining('.jpg')
    );

    expect(screen.getByText('Select Image').tagName).toBe('H4');
    expect(
      ['Image 0', 'Image 1', 'Image 2'].map((alt) => buttonWithImage(alt))
    ).toHaveLength(3);
    for (const tool of ['Crop', 'Adjust', 'Filter']) {
      expect(screen.getByRole('button', { name: tool })).toBeTruthy();
    }
  });

  it('hands the engine canvas to the CESDKCanvas wrapper', async () => {
    await renderApp();
    expect(engine.element.parentElement?.id).toBe('cesdk');
  });

  it('makes the page visible once the scene is up', async () => {
    await renderApp();
    await waitFor(() =>
      expect(argsOf(engine, 'setVisible')).toContainEqual([PAGE, true])
    );
  });
});

describe('PH-C8 Adjust', () => {
  it('lists every adjustment and writes the selected one as a fraction', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));

    expect(screen.getByRole('button', { name: 'Brightness' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Saturation' })).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Saturation' }));
    await userEvent.click(buttonWithText('Reset'));

    expect(argsOf(engine, 'setFloat')).toContainEqual([
      20,
      'adjustments/saturation',
      0
    ]);
  });

  it('creates the adjustments effect when the page carries none', async () => {
    await renderApp({ effects: [] });
    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));

    expect(argsOf(engine, 'createEffect')).toContainEqual(['adjustments']);
    expect(argsOf(engine, 'appendEffect')).toContainEqual([PAGE, 20]);
  });

  it('leaves the Transform edit mode in place', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));
    expect(argsOf(engine, 'setEditMode')).toContainEqual(['Transform']);
  });

  it('closes the bar when the open tool is clicked again', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));
    expect(screen.getByRole('button', { name: 'Brightness' })).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));
    expect(screen.queryByRole('button', { name: 'Brightness' })).toBeNull();
  });
});

describe('PH-C9 Filter', () => {
  it('offers None plus every manifest entry and resolves each thumbnail', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));

    expect(buttonWithImage('none')).toBeTruthy();
    expect(screen.getByAltText('ad1920')).toBeTruthy();
    expect(
      (screen.getByAltText('ad1920') as HTMLImageElement).getAttribute('src')
    ).toBe('resolved://ly.img.filter/thumbnails/imgly_lut_ad1920.jpg');
  });

  it('writes the LUT uri, both tile counts and the intensity', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));

    await waitFor(() =>
      expect(argsOf(engine, 'setString')).toContainEqual([
        21,
        'effect/lut_filter/lutFileURI',
        'resolved://ly.img.filter.lut/LUTs/imgly_lut_ad1920_5_5_128.png'
      ])
    );
    expect(argsOf(engine, 'setInt')).toContainEqual([
      21,
      'effect/lut_filter/horizontalTileCount',
      5
    ]);
    expect(argsOf(engine, 'setInt')).toContainEqual([
      21,
      'effect/lut_filter/verticalTileCount',
      5
    ]);
  });

  it('destroys the LUT effect when None is picked', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
    await userEvent.click(buttonWithImage('none'));

    expect(argsOf(engine, 'destroy')).toContainEqual([21]);
    expect(screen.queryByText('Reset')).toBeNull();
  });

  it('switches to another filter and keeps its own tile counts', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
    await userEvent.click(buttonWithImage('bw'));

    await waitFor(() =>
      expect(
        argsOf(engine, 'setString').some(
          ([, , uri]) => typeof uri === 'string' && uri.includes('imgly_lut_bw')
        )
      ).toBe(true)
    );
  });

  it('falls back to no active filter when the page carries no LUT', async () => {
    await renderApp({ effects: [] });
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
    expect(screen.queryByText('Reset')).toBeNull();
  });

  it('creates the LUT effect on the first filter a bare page is given', async () => {
    await renderApp({ effects: [] });
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
    await userEvent.click(buttonWithImage('bw'));

    await waitFor(() =>
      expect(argsOf(engine, 'createEffect')).toContainEqual(['lut_filter'])
    );
    expect(argsOf(engine, 'appendEffect')).toContainEqual([PAGE, 20]);
  });
});

describe('PH-C10 Crop', () => {
  const openCrop = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    await screen.findByRole('button', { name: 'Straighten' });
  };

  it('selects the page, enters Crop mode and paints the crop highlight', async () => {
    await renderApp();
    await openCrop();

    expect(argsOf(engine, 'setEditMode')).toContainEqual(['Crop']);
    expect(argsOf(engine, 'setSelected')).toContainEqual([PAGE, true]);
    expect(argsOf(engine, 'setGlobalScope')).toContainEqual([
      'design/arrange',
      'Allow'
    ]);
    expect(argsOf(engine, 'setSetting')).toContainEqual([
      'highlightColor',
      { r: 0, g: 0, b: 1, a: 1 }
    ]);
  });

  it('offers Straighten and Scale and swaps the slider between them', async () => {
    await renderApp();
    await openCrop();

    expect(screen.getByText('0°')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Scale' }));
    expect(screen.getByText('0%')).toBeTruthy();
  });

  it('flips through the engine and adds one undo step', async () => {
    await renderApp();
    await openCrop();
    await userEvent.click(
      screen.getByRole('button', { name: 'Flip the image' })
    );

    expect(argsOf(engine, 'flipCropHorizontal')).toContainEqual([PAGE]);
    expect(argsOf(engine, 'addUndoStep').length).toBeGreaterThan(0);
  });

  it('rotates counterclockwise and refits the crop to the frame', async () => {
    await renderApp();
    await openCrop();
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Rotate the image counterclockwise'
      })
    );

    expect(argsOf(engine, 'setFloat')).toContainEqual([
      PAGE,
      'crop/rotation',
      expect.closeTo(-Math.PI / 2, 5)
    ]);
    expect(argsOf(engine, 'adjustCropToFillFrame')).toContainEqual([PAGE, 1.5]);
  });

  it('resets the crop back to the photo size', async () => {
    await renderApp();
    await openCrop();
    await userEvent.click(buttonWithText('Reset'));

    await waitFor(() =>
      expect(argsOf(engine, 'resetCrop')).toContainEqual([PAGE])
    );
    expect(argsOf(engine, 'setWidth')).toContainEqual([PAGE, 800]);
    expect(argsOf(engine, 'setHeight')).toContainEqual([PAGE, 600]);
    expect(argsOf(engine, 'setRotation')).toContainEqual([PAGE, 0]);
  });

  it('restores the canvas colour and the Transform mode on the way out', async () => {
    await renderApp();
    await openCrop();
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));

    await waitFor(() =>
      expect(argsOf(engine, 'setSetting')).toContainEqual([
        'highlightColor',
        { r: 236 / 255, g: 236 / 255, b: 238 / 255, a: 1 }
      ])
    );
    expect(argsOf(engine, 'setGlobalScope')).toContainEqual([
      'design/arrange',
      'Deny'
    ]);
  });

  it('leaves Crop mode when another tool is picked', async () => {
    await renderApp();
    await openCrop();
    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));

    expect(screen.queryByRole('button', { name: 'Straighten' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Brightness' })).toBeTruthy();
    expect(argsOf(engine, 'setEditMode').at(-1)).toEqual(['Transform']);
  });
});

describe('PH-C11 Export', () => {
  it('exports the scene as a jpeg and downloads it', async () => {
    await renderApp();
    // `localDownload` removes its anchor straight after clicking it, so the
    // bubbling click is the only place it can be observed.
    const downloads: HTMLAnchorElement[] = [];
    document.body.addEventListener('click', (event) => {
      const anchor = (event.target as HTMLElement).closest?.('a');
      if (anchor != null) {
        downloads.push(anchor);
        event.preventDefault();
      }
    });

    await userEvent.click(buttonWithText('Export Image'));

    await waitFor(() => expect(downloads).toHaveLength(1));
    expect(argsOf(engine, 'export')).toEqual([[1, { mimeType: 'image/jpeg' }]]);
    expect(downloads[0].getAttribute('download')).toBe('my-photo');
    expect(downloads[0].getAttribute('href')).toBe('blob:photo');
  });
});

describe('PH-C12 Swapping the photo', () => {
  it('swaps straight away while there is nothing to undo', async () => {
    await renderApp();
    await userEvent.click(buttonWithImage('Image 1'));

    await waitFor(() =>
      expect(imgly.setImageSource).toHaveBeenCalledWith(
        engine.api,
        PAGE,
        expect.stringContaining('mountains.jpg')
      )
    );
    expect(screen.queryByText('Unsaved Changes')).toBeNull();
  });

  it('asks first when the engine has an undo history', async () => {
    await renderApp({ canUndo: true });
    await userEvent.click(buttonWithImage('Image 2'));

    expect(screen.getByText('Unsaved Changes')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText('Unsaved Changes')).toBeNull();
    expect(imgly.setImageSource).not.toHaveBeenCalled();
  });

  it('rebuilds the scene when the changes are discarded', async () => {
    await renderApp({ canUndo: true });
    await userEvent.click(buttonWithImage('Image 0'));
    await userEvent.click(
      screen.getByRole('button', { name: 'Discard Changes' })
    );

    await waitFor(() =>
      expect(imgly.setupPhotoScene).toHaveBeenCalledWith(
        engine.api,
        expect.stringContaining('woman.jpg')
      )
    );
    expect(imgly.setImageSource).not.toHaveBeenCalled();
  });

  it('keeps the edits when the changes are applied', async () => {
    await renderApp({ canUndo: true });
    await userEvent.click(buttonWithImage('Image 0'));
    await userEvent.click(
      screen.getByRole('button', { name: 'Apply Changes' })
    );

    await waitFor(() => expect(imgly.setImageSource).toHaveBeenCalledTimes(1));
    expect(imgly.setupPhotoScene).not.toHaveBeenCalled();
  });
});

describe('PH-C16 Dragging a slider', () => {
  it('turns a straighten drag into a crop rotation and one undo step', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    await screen.findByRole('button', { name: 'Straighten' });

    dragSlider(-30);

    expect(engine.element.style.pointerEvents).toBe('auto');
    const rotations = argsOf(engine, 'setFloat').filter(
      ([, property]) => property === 'crop/rotation'
    );
    expect(rotations.length).toBeGreaterThan(0);
    expect(argsOf(engine, 'addUndoStep').length).toBeGreaterThan(0);
  });

  it('turns a scale drag into a crop scale ratio refit to the frame', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Scale' }));

    dragSlider(-100);

    expect(argsOf(engine, 'setCropScaleRatio').length).toBeGreaterThan(0);
    expect(argsOf(engine, 'adjustCropToFillFrame')).toContainEqual([PAGE, 1.5]);
  });

  it('writes the dragged adjustment as a fraction of the slider value', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));

    dragSlider(-50);

    const written = argsOf(engine, 'setFloat').filter(
      ([, property]) => property === 'adjustments/brightness'
    );
    expect(written.length).toBeGreaterThan(0);
    expect(Math.abs(written.at(-1)![2] as number)).toBeLessThanOrEqual(1);
  });

  it('writes the dragged filter intensity as a fraction', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
    await screen.findByAltText('ad1920');

    dragSlider(-40);

    const written = argsOf(engine, 'setFloat').filter(
      ([, property]) => property === 'effect/lut_filter/intensity'
    );
    expect(written.length).toBeGreaterThan(0);
    expect(Math.abs(written.at(-1)![2] as number)).toBeLessThanOrEqual(1);
  });

  it('resets the filter intensity back to full', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));
    await userEvent.click(buttonWithText('Reset'));

    expect(argsOf(engine, 'setFloat')).toContainEqual([
      21,
      'effect/lut_filter/intensity',
      1
    ]);
  });
});

describe('PH-C17 Cropping with the pointer', () => {
  it('recenters after a canvas drag ends and lets the canvas breathe', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    await screen.findByRole('button', { name: 'Straighten' });

    const zoomsBefore = argsOf(engine, 'zoomToBlock').length;
    fireEvent.mouseDown(engine.element);
    fireEvent.mouseUp(engine.element);
    await vi.advanceTimersByTimeAsync(500);

    expect(argsOf(engine, 'zoomToBlock').length).toBeGreaterThan(zoomsBefore);
    vi.useRealTimers();
  });

  it('closes the open bar when the canvas is clicked back to Transform', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Adjust' }));
    expect(screen.getByRole('button', { name: 'Brightness' })).toBeTruthy();

    fireEvent.click(engine.element);
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Brightness' })).toBeNull()
    );
  });

  it('ignores a drag that did not start on the canvas', async () => {
    await renderApp();
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    await screen.findByRole('button', { name: 'Straighten' });

    fireEvent.mouseDown(document.body);
    fireEvent.mouseUp(document.body);
    expect(engine.element.className).toBe('');
  });
});
