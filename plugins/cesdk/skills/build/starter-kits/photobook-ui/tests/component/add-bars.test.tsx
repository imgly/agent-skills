// @vitest-environment jsdom
import {
  fireEvent,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders } = await import('./support/render');
const { PAGE_A, TEXT_BLOCK } = await import('./support/fake-engine');
const AddBlockBar = (
  await import('../../src/app/components/AddBlockBar/AddBlockBar')
).default;
const { ALL_THEMES } =
  await import('../../src/app/components/ThemeBar/ThemeBar');

async function renderAddBar() {
  const handle = await renderWithProviders(<AddBlockBar />);
  await screen.findByRole('button', { name: 'Theme' });
  return handle;
}

describe('PB-C20 the add bar', () => {
  it('offers exactly the four things a photobook page can change', async () => {
    await renderAddBar();
    expect(
      screen
        .getAllByRole('button')
        .map((button) => button.textContent)
        .filter(Boolean)
    ).toEqual(['Theme', 'Layout', 'Color', 'Sticker']);
  });

  it('shows the secondary bar of the button the user picks, and closes it again', async () => {
    await renderAddBar();

    await userEvent.click(screen.getByRole('button', { name: 'Layout' }));
    expect(
      await screen.findByRole('button', { name: 'Layout Preview' })
    ).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Layout' }));
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Layout Preview' })
      ).toBeNull();
    });
  });

  it('paints the colour button with the page background', async () => {
    const handle = await renderAddBar();
    const swatch = screen
      .getByRole('button', { name: 'Color' })
      .querySelector('span > span') as HTMLElement;
    expect(swatch.style.backgroundColor).toBe('rgb(0, 0, 0)');

    handle.properties.set(`${PAGE_A}:fill/solid/color`, {
      r: 1,
      g: 0,
      b: 0,
      a: 1
    });
    // The hook subscribes through the page's fill, not the page itself.
    handle.emitBlockEvent(handle.engine.block.getFill(PAGE_A));

    await waitFor(() => {
      expect(swatch.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });
  });
});

describe('PB-C21 the theme bar', () => {
  it('offers the four themes the kit ships', async () => {
    await renderAddBar();
    await userEvent.click(screen.getByRole('button', { name: 'Theme' }));

    expect(ALL_THEMES.map(({ id }) => id)).toEqual([
      'jungle',
      'sea',
      'savanna',
      'castle'
    ]);
    for (const { label } of ALL_THEMES) {
      expect(await screen.findByRole('button', { name: label })).toBeTruthy();
    }
  });

  it('applies the theme background, typeface and both artwork layers', async () => {
    const { engine } = await renderAddBar();
    await userEvent.click(screen.getByRole('button', { name: 'Theme' }));

    await userEvent.click(
      await screen.findByRole('button', { name: 'jungle Theme' })
    );

    await waitFor(() => {
      expect(engine.editor.addUndoStep).toHaveBeenCalled();
    });
    expect(engine.block.setColor).toHaveBeenCalledWith(
      PAGE_A,
      'fill/solid/color',
      { r: 0, g: 134 / 255, b: 37 / 255, a: 1 }
    );
    expect(engine.asset.findAssets).toHaveBeenCalledWith('ly.img.typeface', {
      page: 0,
      perPage: 1,
      query: 'Aleo'
    });
    expect(engine.block.setFont).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'Caveat-Regular.ttf',
      expect.objectContaining({ name: 'Caveat' })
    );
    const artwork = (
      engine.block.setString as ReturnType<typeof vi.fn>
    ).mock.calls.filter(
      ([, property]) => property === 'fill/image/imageFileURI'
    );
    expect(artwork.map(([, , uri]) => uri)).toEqual([
      expect.stringMatching(/jungle-bg-dark\.svg$/),
      expect.stringMatching(/jungle-bg-light\.svg$/)
    ]);
  });

  it('keeps the fonts untouched when the typeface is not installed', async () => {
    const handle = await renderAddBar();
    handle.assets.set('ly.img.typeface', []);
    await userEvent.click(screen.getByRole('button', { name: 'Theme' }));

    await userEvent.click(
      await screen.findByRole('button', { name: 'sea Theme' })
    );

    await waitFor(() => {
      expect(handle.engine.editor.addUndoStep).toHaveBeenCalled();
    });
    expect(handle.engine.block.setFont).not.toHaveBeenCalled();
  });
});

describe('PB-C22 the layout bar', () => {
  it('lists the layouts and applies the one the user picks', async () => {
    const { engine } = await renderAddBar();

    await userEvent.click(screen.getByRole('button', { name: 'Layout' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Layout Preview' })
    );

    expect(engine.asset.findAssets).toHaveBeenCalledWith('ly.img.layouts', {
      page: 0,
      perPage: 999
    });
    await waitFor(() => {
      expect(engine.asset.apply).toHaveBeenCalledWith(
        'ly.img.layouts',
        expect.objectContaining({ id: 'layout-1' })
      );
    });
  });
});

describe('PB-C23 the background colour bar', () => {
  it('offers the six template colours and the picker', async () => {
    await renderAddBar();
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));

    const swatches = await screen.findAllByRole('button', {
      name: /^#[0-9a-f]{8}$/
    });
    expect(swatches.map((button) => button.getAttribute('aria-label'))).toEqual(
      [
        '#dc1876ff',
        '#0027bcff',
        '#e2701dff',
        '#008625ff',
        '#7e18ceff',
        '#5bb1a7ff'
      ]
    );
    expect(screen.getByRole('button', { name: 'Pick color' })).toBeTruthy();
  });

  it('writes the swatch onto the page without its own undo step', async () => {
    const { engine } = await renderAddBar();
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));
    await screen.findByRole('button', { name: '#008625ff' });
    const undoSteps = (engine.editor.addUndoStep as ReturnType<typeof vi.fn>)
      .mock.calls.length;

    await userEvent.click(screen.getByRole('button', { name: '#008625ff' }));

    expect(engine.block.setColor).toHaveBeenCalledWith(
      PAGE_A,
      'fill/solid/color',
      { r: 0, g: 134 / 255, b: 37 / 255, a: 1 }
    );
    // The bar batches its edits into the single step it adds when it closes.
    expect(engine.editor.addUndoStep).toHaveBeenCalledTimes(undoSteps);
  });

  it('adds one undo step when the bar closes', async () => {
    const { engine } = await renderAddBar();
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));
    await screen.findByRole('button', { name: 'Pick color' });
    const undoSteps = (engine.editor.addUndoStep as ReturnType<typeof vi.fn>)
      .mock.calls.length;

    await userEvent.click(screen.getByRole('button', { name: 'Color' }));

    await waitFor(() => {
      expect(engine.editor.addUndoStep).toHaveBeenCalledTimes(undoSteps + 1);
    });
  });

  it('marks the swatch that matches the current background', async () => {
    const handle = await renderAddBar();
    handle.properties.set(`${PAGE_A}:fill/solid/color`, {
      r: 0,
      g: 134 / 255,
      b: 37 / 255,
      a: 1
    });
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));

    const active = await screen.findByRole('button', { name: '#008625ff' });
    expect(active.className).toContain('colorButton--active');
    expect(
      screen.getByRole('button', { name: '#dc1876ff' }).className
    ).not.toContain('colorButton--active');
  });

  it('applies a colour typed into the picker and ignores an unparseable one', async () => {
    const { engine } = await renderAddBar();
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Pick color' })
    );

    const hexInput = screen.getByRole('textbox');
    fireEvent.change(hexInput, { target: { value: '#00ff00' } });

    await waitFor(() => {
      expect(engine.block.setColor).toHaveBeenCalledWith(
        PAGE_A,
        'fill/solid/color',
        { r: 0, g: 1, b: 0, a: 1 }
      );
    });

    (engine.block.setColor as ReturnType<typeof vi.fn>).mockClear();
    fireEvent.change(hexInput, { target: { value: '#12' } });
    expect(engine.block.setColor).not.toHaveBeenCalled();
  });
});

describe('PB-C24 the sticker bar', () => {
  it('queries the sticker source and applies the sticker the user picks', async () => {
    const { engine } = await renderAddBar();

    await userEvent.click(screen.getByRole('button', { name: 'Sticker' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Add sticker 0' })
    );

    expect(engine.asset.findAssets).toHaveBeenCalledWith('ly.img.sticker', {
      page: 0,
      perPage: 999
    });
    expect(engine.asset.apply).toHaveBeenCalledWith(
      'ly.img.image.upload',
      expect.objectContaining({ id: 'sticker-1' })
    );
  });
});

describe('PB-C25 the block bar shell', () => {
  it('keeps every button active while nothing is selected', async () => {
    await renderAddBar();
    for (const label of ['Theme', 'Layout', 'Color', 'Sticker']) {
      expect(screen.getByRole('button', { name: label }).className).toContain(
        'wrapper--active'
      );
    }
  });

  it('leaves only the chosen button active once a secondary bar is open', async () => {
    await renderAddBar();
    await userEvent.click(screen.getByRole('button', { name: 'Theme' }));

    expect(screen.getByRole('button', { name: 'Theme' }).className).toContain(
      'wrapper--active'
    );
    expect(
      screen.getByRole('button', { name: 'Layout' }).className
    ).not.toContain('wrapper--active');
  });
});

describe('PB-C26 the images the theme bar shows', () => {
  it('points every theme thumbnail and artwork at the demo asset base URL', () => {
    for (const theme of ALL_THEMES) {
      expect(theme.asset.light).toMatch(
        new RegExp(`/themes/${theme.id}-bg-light\\.svg$`)
      );
      expect(theme.asset.dark).toMatch(
        new RegExp(`/themes/${theme.id}-bg-dark\\.svg$`)
      );
    }
  });
});
