// @vitest-environment jsdom
import { screen, userEvent, waitFor } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders } = await import('./support/render');
const { BACK_PAGE, FRONT_PAGE, SCENE, TEXT_BLOCK } =
  await import('./support/fake-engine');
const PostcardUI = (await import('@/app/layout/PostcardUI/PostcardUI')).default;

/** The step labels are `display: none` until a media query widens the bar. */
function stepButton(label: string): HTMLButtonElement {
  return screen.getByText(label).closest('button') as HTMLButtonElement;
}

/** The palette swatches carry a colour and no accessible name. */
function swatches(): HTMLButtonElement[] {
  return [
    ...document.querySelectorAll<HTMLButtonElement>('[class~="colorButton"]')
  ];
}

/** Pick a template, which is what moves the kit off the Style step. */
async function renderDesignStep(
  options?: Parameters<typeof renderWithProviders>[1]
) {
  const handle = await renderWithProviders(<PostcardUI />, options);
  await userEvent.click(
    screen.getByRole('button', { name: 'Choose Thank you Template' })
  );
  await screen.findByRole('button', { name: 'Accent' }, { timeout: 3000 });
  return handle;
}

describe('PC-C10 the style step', () => {
  it('offers the four templates and keeps the canvas hidden', async () => {
    const { engine } = await renderWithProviders(<PostcardUI />);

    expect(screen.getAllByRole('button')).toHaveLength(4);
    const canvas = document.getElementById('cesdk') as HTMLElement;
    expect(canvas.style.visibility).toBe('hidden');
    expect(engine.scene.load).not.toHaveBeenCalled();
  });

  it('loads the scene of the template the user picks', async () => {
    const { engine } = await renderDesignStep();

    expect(engine.scene.load).toHaveBeenCalledWith(
      expect.stringMatching(/\/templates\/thank_you\.scene$/)
    );
    expect(
      (document.getElementById('cesdk') as HTMLElement).style.visibility
    ).toBe('visible');
  });

  it('reports a template whose scene will not load', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await renderWithProviders(<PostcardUI />, {
      configure: (fake) => {
        (fake.engine.scene.load as ReturnType<typeof vi.fn>).mockRejectedValue(
          new Error('404')
        );
      }
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'Choose Bonjour Paris Template' })
    );

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load postcard template'),
        expect.any(Error)
      );
    });
    error.mockRestore();
  });
});

describe('PC-C11 the process navigation', () => {
  it('keeps Design and Write locked until a template is chosen', async () => {
    await renderWithProviders(<PostcardUI />);

    // The step buttons only exist once the shell leaves the style step, so the
    // style step itself is the lock.
    expect(screen.queryByRole('button', { name: /Design/ })).toBeNull();
  });

  it('moves to the write step and shows the back page', async () => {
    const handle = await renderDesignStep();

    await userEvent.click(stepButton('Write'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Color/ })).toBeTruthy();
    });
    expect(handle.engine.block.isVisible(BACK_PAGE)).toBe(true);
    expect(handle.engine.block.isVisible(FRONT_PAGE)).toBe(false);
  });

  it('locks the navigation while the editor is cropping', async () => {
    const handle = await renderDesignStep();

    handle.setEditMode('Crop');

    await waitFor(() => {
      expect(stepButton('Write').disabled).toBe(true);
    });
  });
});

describe('PC-C12 the front page toolbar', () => {
  it('applies the template colours to the accent and background blocks', async () => {
    const { engine } = await renderDesignStep();

    await waitFor(() => {
      expect(engine.actions.run).toHaveBeenCalledWith(
        'setColorByBlockName',
        'Accent',
        expect.objectContaining({ r: expect.any(Number) })
      );
    });
    // The catalogue's first colour is the accent, the second the background.
    expect(engine.block.setColor).toHaveBeenCalledWith(
      expect.any(Number),
      'fill/solid/color',
      { r: 224 / 255, g: 159 / 255, b: 150 / 255, a: 1 }
    );
    expect(engine.block.setStrokeColor).toHaveBeenCalled();
  });

  it('writes the colour the user picks onto the accent block', async () => {
    const { engine } = await renderDesignStep();
    (engine.block.setColor as ReturnType<typeof vi.fn>).mockClear();

    await userEvent.click(screen.getByRole('button', { name: 'Accent' }));
    await waitFor(() => expect(swatches().length).toBeGreaterThan(2));
    await userEvent.click(swatches()[2]);

    await waitFor(() => {
      expect(engine.actions.run).toHaveBeenCalledWith(
        'setColorByBlockName',
        'Accent',
        { r: 118 / 255, g: 30 / 255, b: 64 / 255, a: 1 }
      );
    });
  });
});

describe('PC-C13 the back page toolbar', () => {
  async function renderWriteStep() {
    const handle = await renderDesignStep();
    await userEvent.click(stepButton('Write'));
    await screen.findByRole('button', { name: /Color/ });
    return handle;
  }

  it('reads the greeting typeface out of the scene', async () => {
    const { engine } = await renderWriteStep();

    expect(engine.block.getTypeface).toHaveBeenCalledWith(TEXT_BLOCK);
  });

  it('writes the text size the user picks onto the greeting', async () => {
    const { engine } = await renderWriteStep();

    await userEvent.click(screen.getByRole('button', { name: /Size/ }));
    await userEvent.click(await screen.findByRole('button', { name: 'S' }));

    await waitFor(() => {
      expect(engine.actions.run).toHaveBeenCalledWith(
        'setTextSizeByBlockName',
        'Greeting',
        14
      );
    });
    expect(engine.block.setFloat).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'text/fontSize',
      14
    );
  });

  it('writes the font the user picks onto the greeting', async () => {
    const { engine } = await renderWriteStep();

    await userEvent.click(screen.getByRole('button', { name: /Font/ }));
    await userEvent.click(
      (await screen.findByText('Caveat')).closest('button') as HTMLButtonElement
    );

    await waitFor(() => {
      expect(engine.actions.run).toHaveBeenCalledWith(
        'setFontByBlockName',
        'Greeting',
        expect.objectContaining({ name: 'Caveat' })
      );
    });
    expect(engine.block.setFont).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'Caveat-Regular.ttf',
      expect.objectContaining({ name: 'Caveat' })
    );
  });
});

describe('PC-C14 exporting the postcard', () => {
  it('exports both pages as a PDF at 72 dpi and restores the editor', async () => {
    const handle = await renderDesignStep();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    await userEvent.click(screen.getByText('Export').closest('button')!);

    await waitFor(() => {
      expect(handle.spy('block.export')).toHaveBeenCalledWith(SCENE, {
        mimeType: 'application/pdf'
      });
    });
    const dpi = handle
      .spy('block.setFloat')
      .mock.calls.filter(([, property]) => property === 'scene/dpi')
      .map(([, , value]) => value);
    expect(dpi).toEqual([72, 300]);
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });
});
