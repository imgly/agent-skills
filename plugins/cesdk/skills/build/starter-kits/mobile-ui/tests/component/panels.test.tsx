// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
  within
} from '@imgly/kit-test-harness/component';
import type { Typeface } from '@cesdk/engine';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createFakeEngine,
  IMAGES,
  SHAPES,
  STICKERS,
  TYPEFACES
} from './support/fakeEngine';
import { renderEditor } from './support/renderEditor';
import FontPreview from '../../src/app/components/FontPreview/FontPreview';

vi.mock('@cesdk/engine', async () => {
  const { engineHolder: holder } = await import('./support/engineHolder');
  return { default: { init: async () => holder.engine } };
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
  document.querySelector('input[type=file]')?.remove();
});

/** Open one of the four add panels from the bottom bar. */
const openAddPanel = async (label: string) => {
  await userEvent.click(screen.getByRole('button', { name: label }));
};

describe('MB-C14 the add-block bar', () => {
  it('offers exactly the four block kinds the kit can add', async () => {
    await renderEditor(createFakeEngine());
    for (const label of ['Text', 'Image', 'Sticker', 'Shape']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
  });

  it('opens a panel and collapses it again', async () => {
    await renderEditor(createFakeEngine());
    await openAddPanel('Shape');
    expect(screen.getByText('Add Shape')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Collapse' }));
    await waitFor(() => expect(screen.queryByText('Add Shape')).toBeNull());
  });
});

describe('MB-C15 adding an image', () => {
  it('lists the images the source reports, named by their own label', async () => {
    await renderEditor(createFakeEngine());
    await openAddPanel('Image');

    expect(await screen.findByAltText('A beach')).toBeTruthy();
    // An asset with no label falls back to its id.
    expect(screen.getByAltText('image-2')).toBeTruthy();
  });

  it('applies the chosen image through its own source id', async () => {
    const engine = createFakeEngine();
    await renderEditor(engine);
    await openAddPanel('Image');

    await userEvent.click(
      (await screen.findByAltText('A beach')).parentElement!
    );
    expect(engine.asset.apply).toHaveBeenCalledWith('ly.img.image', IMAGES[0]);
  });

  it('adds an uploaded file to the image source and applies it', async () => {
    const engine = createFakeEngine();
    await renderEditor(engine);
    await openAddPanel('Image');

    await userEvent.click(screen.getByText('Upload'));
    const input = (await waitFor(() => {
      const found = document.querySelector('input[type=file]');
      expect(found).toBeTruthy();
      return found;
    })) as HTMLInputElement;
    expect(input.getAttribute('accept')).toBe(
      'image/jpeg,image/png,image/svg+xml,image/gif'
    );

    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file]
    });
    await act(async () => {
      input.dispatchEvent(new Event('change'));
    });

    await waitFor(() =>
      expect(engine.asset.addAssetToSource).toHaveBeenCalled()
    );
    const [sourceId, asset] = engine.asset.addAssetToSource.mock.calls[0];
    expect(sourceId).toBe('ly.img.image');
    expect(asset).toMatchObject({
      meta: { kind: 'image', fillType: '//ly.img.ubq/fill/image', width: 320 }
    });
    expect(engine.asset.apply).toHaveBeenCalledWith('ly.img.image', {
      ...asset,
      context: { sourceId: 'ly.img.image' }
    });
  });
});

describe('MB-C16 adding a shape and a sticker', () => {
  it('applies a shape through the vector shape source', async () => {
    const engine = createFakeEngine();
    await renderEditor(engine);
    await openAddPanel('Shape');

    await userEvent.click(await screen.findByRole('button', { name: 'Star' }));
    expect(engine.asset.apply).toHaveBeenCalledWith(
      'ly.img.vector.shape',
      SHAPES[0]
    );
  });

  it('applies a sticker through the sticker source', async () => {
    const engine = createFakeEngine();
    await renderEditor(engine);
    await openAddPanel('Sticker');

    await userEvent.click(await screen.findByRole('button', { name: 'Hand' }));
    expect(engine.asset.apply).toHaveBeenCalledWith(
      'ly.img.sticker',
      STICKERS[0]
    );
  });

  it('labels the sticker groups the source reports and filters by one', async () => {
    const engine = createFakeEngine();
    await renderEditor(engine);
    await openAddPanel('Sticker');

    const filter = await screen.findByRole('combobox', {
      name: 'Sticker group'
    });
    expect(
      [...within(filter).getAllByRole('option')].map((o) => o.textContent)
    ).toEqual(['All', 'Emoji', 'Doodle']);

    engine.asset.findAssets.mockClear();
    await userEvent.selectOptions(filter, 'emoji');
    await waitFor(() =>
      expect(engine.asset.findAssets).toHaveBeenCalledWith('ly.img.sticker', {
        page: 0,
        perPage: 9999,
        groups: ['emoji']
      })
    );
  });
});

describe('MB-C17 adding text', () => {
  it('offers only the typefaces in the kit subset', async () => {
    const engine = createFakeEngine();
    await renderEditor(engine);
    await openAddPanel('Text');

    const names = (await screen.findAllByText(/Caveat|Roboto|Oswald/)).map(
      (node) => node.textContent
    );
    expect(names).toContain('Caveat');
    expect(names).toContain('Roboto');
    expect(names).toContain('Oswald');
  });

  it('creates a centred half-page text block in the regular face', async () => {
    const engine = createFakeEngine({ pages: [10] });
    await renderEditor(engine);
    await openAddPanel('Text');

    await userEvent.click(
      (await screen.findByText('Caveat')).closest('button') as HTMLElement
    );

    expect(engine.block.create).toHaveBeenCalledWith('text');
    expect(engine.block.setFont).toHaveBeenCalledWith(
      42,
      'Caveat-Regular.ttf',
      TYPEFACES[0].payload.typeface
    );
    expect(engine.block.setFloat).toHaveBeenCalledWith(42, 'text/fontSize', 40);
    expect(engine.block.setEnum).toHaveBeenCalledWith(
      42,
      'text/horizontalAlignment',
      'Center'
    );
    expect(engine.block.setHeightMode).toHaveBeenCalledWith(42, 'Auto');
    expect(engine.block.setWidth).toHaveBeenCalledWith(42, 50);
    // autoPlaceBlockOnPage appends it to the page and selects it.
    expect(engine.block.appendChild).toHaveBeenCalledWith(10, 42);
    expect(engine.block.setSelected).toHaveBeenCalledWith(42, true);
    expect(engine.editor.addUndoStep).toHaveBeenCalled();
  });
});

describe('MB-C18 FontPreview', () => {
  const typeface = TYPEFACES[0].payload.typeface as Typeface;

  it('declares the face it renders with and shows the given text', () => {
    render(<FontPreview typeface={typeface} text="Ag" />);
    const preview = screen.getByText('Ag');
    expect(preview.style.fontFamily).toBe('Caveat');
    expect(preview.style.fontWeight).toBe('normal');
  });

  it('falls back to the typeface name when no text is given', () => {
    render(<FontPreview typeface={typeface} />);
    expect(screen.getByText('Caveat')).toBeTruthy();
  });

  it('falls back to the first font when the weight is not offered', () => {
    const { container } = render(
      <FontPreview typeface={typeface} weight="bold" text="Ag" />
    );
    expect(container.querySelector('style')?.textContent).toContain(
      'Caveat-Italic.ttf'
    );
  });
});
