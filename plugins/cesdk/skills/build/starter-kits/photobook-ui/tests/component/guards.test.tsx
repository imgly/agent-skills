// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders, installBrowserStubs, resizeObservedElements } =
  await import('./support/render');
const { installFakeEngine } = await import('./support/engine-mock');
const { IMAGE_BLOCK, PAGE_A, PAGE_B, TEXT_BLOCK } =
  await import('./support/fake-engine');
const { useSinglePageMode } =
  await import('../../src/app/contexts/SinglePageModeContext');

function SinglePageProbe({
  onReady
}: {
  onReady: (value: ReturnType<typeof useSinglePageMode>) => void;
}) {
  onReady(useSinglePageMode());
  return <span>probe</span>;
}

describe('PB-C80 leaving crop mode from the crop button', () => {
  it('goes back to transform when crop is pressed again', async () => {
    const BottomControls = (
      await import('../../src/app/ui/BottomControls/BottomControls')
    ).default;
    const handle = await renderWithProviders(<BottomControls />, {
      selection: [IMAGE_BLOCK],
      editMode: 'Crop'
    });
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.select([IMAGE_BLOCK]);
    (handle.engine.editor.setEditMode as ReturnType<typeof vi.fn>).mockClear();

    await userEvent.click(await screen.findByRole('button', { name: 'Crop' }));

    expect(handle.engine.editor.setEditMode).toHaveBeenCalledWith('Transform');
  });
});

describe('PB-C81 previews for a page that is already gone', () => {
  it('skips the export for a page the engine no longer knows', async () => {
    const handle = await renderWithProviders(<span />, {
      configure: (fake) => {
        (
          fake.engine.block.isValid as ReturnType<typeof vi.fn>
        ).mockImplementation(
          (id: number) => id !== PAGE_B && fake.blocks.has(id)
        );
      }
    });

    await waitFor(() =>
      expect(handle.spy('block.export')).toHaveBeenCalledWith(
        PAGE_A,
        expect.anything()
      )
    );
    expect(handle.spy('block.export')).not.toHaveBeenCalledWith(
      PAGE_B,
      expect.anything()
    );
  });
});

describe('PB-C82 correcting a selection the engine dropped', () => {
  it('re-selects the block the editor believes is selected', async () => {
    vi.useFakeTimers();
    try {
      installBrowserStubs();
      const handle = installFakeEngine({ selection: [] });
      const { SelectionProvider } =
        await import('../../src/app/contexts/UseSelection');
      render(
        <SelectionProvider engine={handle.engine}>
          <span>probe</span>
        </SelectionProvider>
      );

      act(() => handle.select([TEXT_BLOCK]));
      // The engine drops the selection behind the editor's back.
      handle.engine.block.setSelected(TEXT_BLOCK, false);
      (handle.engine.block.setSelected as ReturnType<typeof vi.fn>).mockClear();
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(handle.engine.block.setSelected).toHaveBeenCalledWith(
        TEXT_BLOCK,
        true
      );
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('PB-C83 refocusing while the single page mode is off', () => {
  it('zooms nowhere once the mode is disabled', async () => {
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
    act(() => handle.setEditMode('Crop'));
    act(() => context?.setEnabled(false));
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => context?.refocus());
    act(() => {
      context?.setRefocusCropModeEnabled(false);
    });
    act(() => context?.refocus());

    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });

  it('keeps reading the cursor while the editor stays in text mode', async () => {
    const handle = await renderWithProviders(<span />, { cursorY: 100 });
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    act(() => handle.setEditMode('Text'));
    (
      handle.engine.editor.getTextCursorPositionInScreenSpaceX as ReturnType<
        typeof vi.fn
      >
    ).mockClear();

    act(() => handle.setEditMode('Text'));

    expect(
      handle.engine.editor.getTextCursorPositionInScreenSpaceX
    ).toHaveBeenCalled();
  });
});

describe('PB-C84 the toolbar height after the bar has gone', () => {
  it('measures nothing once the element it watched is unmounted', async () => {
    const { useToolbarHeight } =
      await import('../../src/app/ui/UseToolbarHeight/UseToolbarHeight');
    function ToggleBar() {
      const [show, setShow] = useState(true);
      const { ref } = useToolbarHeight();
      return (
        <>
          <button onClick={() => setShow(false)}>hide</button>
          {show ? <div ref={ref}>bar</div> : <span>gone</span>}
        </>
      );
    }
    const handle = await renderWithProviders(<ToggleBar />);
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );

    await userEvent.click(screen.getByRole('button', { name: 'hide' }));
    act(() => resizeObservedElements());

    expect(screen.getByText('gone')).toBeTruthy();
  });
});

describe('PB-C86 a colour the picker cannot express', () => {
  it('ignores the NaN hex a zero-sized picker reports, and debounces nothing', async () => {
    const ColorSelect = (
      await import('../../src/app/ui/ColorSelect/ColorSelect')
    ).default;
    const onClick = vi.fn();
    await renderWithProviders(
      <ColorSelect
        colorPalette={[{ r: 1, g: 0, b: 0, a: 1 }]}
        onClick={onClick}
      />
    );
    act(() => screen.getByRole('button', { name: 'Pick color' }).click());
    onClick.mockClear();

    vi.useFakeTimers();
    try {
      // jsdom measures the picker as zero wide, so react-colorful divides by
      // zero and reports `#NaNNaNNaN` — the value the kit guards against.
      const interactive = document.querySelector(
        '.react-colorful__interactive'
      ) as HTMLElement;
      act(() => {
        interactive.dispatchEvent(
          new MouseEvent('mousedown', {
            bubbles: true,
            clientX: 0,
            clientY: 0
          })
        );
      });

      expect(onClick).not.toHaveBeenCalled();

      // The bar passes no debounced handler, so the timer fires the default.
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(onClick).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('PB-C88 fonts without a regular cut', () => {
  it('previews a typeface by its name and its first cut when no text is given', async () => {
    const FontPreview = (
      await import('../../src/app/ui/FontPreview/FontPreview')
    ).default;
    render(
      <FontPreview
        typeface={
          {
            name: 'Coiny',
            fonts: [{ uri: 'Coiny-Bold.ttf', weight: 'bold', style: 'normal' }]
          } as never
        }
      />
    );
    expect(screen.getByText('Coiny')).toBeTruthy();
    const faces = [...document.querySelectorAll('style')].map(
      (style) => style.textContent
    );
    expect(faces.some((css) => css?.includes('Coiny-Bold.ttf'))).toBe(true);
  });

  it('applies a theme whose typeface has no regular cut with its first cut', async () => {
    const AddBlockBar = (
      await import('../../src/app/components/AddBlockBar/AddBlockBar')
    ).default;
    const handle = await renderWithProviders(<AddBlockBar />, {
      configure: (fake) => {
        fake.assets.set('ly.img.typeface', [
          {
            id: 'Coiny',
            payload: {
              typeface: {
                name: 'Coiny',
                fonts: [
                  { uri: 'Coiny-Bold.ttf', weight: 'bold', style: 'normal' }
                ]
              }
            }
          }
        ]);
      }
    });
    await userEvent.click(screen.getByRole('button', { name: 'Theme' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'sea Theme' })
    );

    await waitFor(() => {
      expect(handle.engine.block.setFont).toHaveBeenCalledWith(
        TEXT_BLOCK,
        'Coiny-Bold.ttf',
        expect.objectContaining({ name: 'Coiny' })
      );
    });
  });

  it('opens the font bar with nothing active when nothing is selected', async () => {
    const ChangeFontSecondary = (
      await import('../../src/app/ui/ChangeFontSecondary/ChangeFontSecondary')
    ).default;
    const handle = await renderWithProviders(<ChangeFontSecondary />);
    const buttons = await screen.findAllByRole('button', {
      name: /Caveat|Aleo/
    });
    for (const button of buttons) {
      expect(button.className).not.toContain('wrapper--active');
    }
    expect(handle.engine.block.getTypeface).not.toHaveBeenCalled();
  });
});

describe('PB-C87 nothing left to zoom to', () => {
  it('skips the crop zoom when the selection has gone', async () => {
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
    act(() => handle.setEditMode('Crop'));
    handle.select([]);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => context?.refocus());

    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });
});
