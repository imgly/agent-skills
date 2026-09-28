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

/** The font buttons pair a preview glyph with the typeface name. */
function fontButton(name: string): HTMLButtonElement {
  const label = screen.getByText(name);
  return label.closest('button') as HTMLButtonElement;
}
const { IMAGE_BLOCK, PAGE_A, SHAPE_BLOCK, TEXT_BLOCK } =
  await import('./support/fake-engine');
const AddBlockBar = (await import('../../src/app/ui/AddBlockBar/AddBlockBar'))
  .default;
const ImageAdjustmentBar = (
  await import('../../src/app/ui/ImageAdjustmentBar/ImageAdjustmentBar')
).default;
const TextAdjustmentsBar = (
  await import('../../src/app/ui/TextAdjustmentsBar/TextAdjustmentsBar')
).default;
const ShapesAdjustmentBar = (
  await import('../../src/app/ui/ShapesAdjustmentBar/ShapesAdjustmentBar')
).default;
const StickerAdjustmentBar = (
  await import('../../src/app/ui/StickerAdjustmentBar/StickerAdjustmentBar')
).default;
const ChangeImageFileSecondary = (
  await import('../../src/app/ui/ChangeImageFileSecondary/ChangeImageFileSecondary')
).default;
const CropModeSecondary = (
  await import('../../src/app/ui/CropModeSecondary/CropModeSecondary')
).default;

describe('AP-C20 the add bar', () => {
  it('adds a text block from the font list and places it on the page', async () => {
    const { engine } = await renderWithProviders(<AddBlockBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Text' }));

    await screen.findByText('Caveat');
    await userEvent.click(fontButton('Caveat'));

    expect(engine.block.create).toHaveBeenCalledWith('text');
    const created = (engine.block.create as ReturnType<typeof vi.fn>).mock
      .results[0].value as number;
    expect(engine.block.setFont).toHaveBeenCalledWith(
      created,
      'Caveat-Regular.ttf',
      expect.objectContaining({ name: 'Caveat' })
    );
    expect(engine.block.setEnum).toHaveBeenCalledWith(
      created,
      'text/horizontalAlignment',
      'Center'
    );
    expect(engine.block.setWidth).toHaveBeenCalledWith(created, 400);
    expect(engine.block.appendChild).toHaveBeenCalledWith(PAGE_A, created);
    expect(engine.block.isSelected(created)).toBe(true);
  });

  it.each([
    ['Shape', 'Add shape 0', 'ly.img.vector.shape'],
    ['Sticker', 'Add sticker 0', 'ly.img.sticker']
  ])('applies the %s the user picks', async (tab, asset, sourceId) => {
    const { engine } = await renderWithProviders(<AddBlockBar />);

    await userEvent.click(screen.getByRole('button', { name: tab }));
    await userEvent.click(await screen.findByRole('button', { name: asset }));

    expect(engine.asset.findAssets).toHaveBeenCalledWith(sourceId, {
      page: 0,
      perPage: 999
    });
    expect(engine.asset.apply).toHaveBeenCalledWith(
      sourceId,
      expect.objectContaining({ context: { sourceId } })
    );
  });

  it('lists the upload and Unsplash images, and applies the one clicked', async () => {
    const { engine } = await renderWithProviders(<AddBlockBar />);

    await userEvent.click(screen.getByRole('button', { name: 'Image' }));
    const images = await screen.findAllByAltText('sample asset');
    expect(images).toHaveLength(2);
    await userEvent.click(images[0].closest('button') as HTMLButtonElement);

    await waitFor(() => {
      expect(engine.asset.apply).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({ id: 'upload-1' })
      );
    });
  });

  it('shows the spinner while the image list is still empty', async () => {
    const { rendered } = await renderWithProviders(<AddBlockBar />, {
      configure: (fake) => {
        fake.assets.set('ly.img.image.upload', []);
        fake.assets.set('unsplash', []);
      }
    });

    await userEvent.click(screen.getByRole('button', { name: 'Image' }));

    await waitFor(() => {
      expect(rendered.container.querySelector('svg')).toBeTruthy();
    });
    expect(screen.queryAllByAltText('sample asset')).toHaveLength(0);
  });

  it('skips Unsplash when the source is not registered', async () => {
    const { engine } = await renderWithProviders(<AddBlockBar />, {
      configure: (fake) => {
        fake.assets.delete('unsplash');
      }
    });

    await userEvent.click(screen.getByRole('button', { name: 'Image' }));

    await waitFor(() => {
      expect(screen.getAllByAltText('sample asset')).toHaveLength(1);
    });
    expect(engine.asset.findAssets).not.toHaveBeenCalledWith(
      'unsplash',
      expect.anything()
    );
  });
});

describe('AP-C21 the image adjustment bar', () => {
  it('opens and closes the replace bar', async () => {
    await renderWithProviders(<ImageAdjustmentBar />, {
      selection: [IMAGE_BLOCK]
    });

    await userEvent.click(screen.getByRole('button', { name: 'Replace' }));
    expect(await screen.findAllByAltText('sample asset')).not.toHaveLength(0);

    await userEvent.click(screen.getByRole('button', { name: 'Replace' }));
    await waitFor(() => {
      expect(screen.queryAllByAltText('sample asset')).toHaveLength(0);
    });
  });

  it('enters and leaves crop mode through the engine', async () => {
    const handle = await renderWithProviders(<ImageAdjustmentBar />, {
      selection: [IMAGE_BLOCK]
    });

    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    expect(handle.engine.editor.setEditMode).toHaveBeenCalledWith('Crop');

    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    expect(handle.engine.editor.setEditMode).toHaveBeenLastCalledWith(
      'Transform'
    );
  });

  it('opens the crop bar as soon as the engine reports crop mode', async () => {
    const handle = await renderWithProviders(<ImageAdjustmentBar />, {
      selection: [IMAGE_BLOCK],
      editMode: 'Crop'
    });

    expect(screen.getByRole('button', { name: 'Done' })).toBeTruthy();

    handle.select([IMAGE_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(handle.engine.block.resetCrop).toHaveBeenCalledWith(IMAGE_BLOCK);
  });

  it('opens the replace bar and disables cropping for a placeholder', async () => {
    await renderWithProviders(<ImageAdjustmentBar />, {
      selection: [IMAGE_BLOCK],
      configure: (fake) => {
        fake.properties.set(`${IMAGE_BLOCK}:placeholder/enabled`, true);
      }
    });

    await waitFor(() => {
      expect(
        (screen.getByRole('button', { name: 'Crop' }) as HTMLButtonElement)
          .disabled
      ).toBe(true);
    });
    expect(await screen.findAllByAltText('sample asset')).not.toHaveLength(0);
  });

  it('replaces the fill of the selected block from the image bar', async () => {
    const { engine } = await renderWithProviders(<ChangeImageFileSecondary />, {
      selection: [IMAGE_BLOCK]
    });

    const images = await screen.findAllByAltText('sample asset');
    await userEvent.click(images[0].closest('button') as HTMLButtonElement);

    await waitFor(() => {
      expect(engine.asset.applyToBlock).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({ id: 'upload-1' }),
        IMAGE_BLOCK
      );
    });
  });
});

describe('AP-C22 leaving crop mode', () => {
  it('returns to transform mode from the Done button', async () => {
    const { engine } = await renderWithProviders(<CropModeSecondary />, {
      selection: [IMAGE_BLOCK],
      editMode: 'Crop'
    });

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(engine.editor.setEditMode).toHaveBeenCalledWith('Transform');
  });
});

describe('AP-C23 the text adjustment bar', () => {
  it('writes the colour the user picks onto the text block', async () => {
    const { engine } = await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK]
    });

    await userEvent.click(screen.getByRole('button', { name: 'Color' }));
    const swatches = await screen.findAllByRole('button', { name: '' });
    // The first six swatches are the palette; the last one opens the picker.
    await userEvent.click(swatches[1]);

    expect(engine.block.setColor).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'fill/solid/color',
      { r: 0, g: 0, b: 0, a: 1 }
    );
  });

  it('changes the alignment through the engine', async () => {
    const { engine } = await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK]
    });

    await userEvent.click(screen.getByRole('button', { name: 'Align' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Center' })
    );

    expect(engine.block.setEnum).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'text/horizontalAlignment',
      'Center'
    );
  });

  it('marks the alignment the block already has', async () => {
    await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK]
    });

    await userEvent.click(screen.getByRole('button', { name: 'Align' }));

    const left = await screen.findByRole('button', { name: 'Left' });
    expect(left.className).toContain('wrapper--active');
    expect(
      screen.getByRole('button', { name: 'Right' }).className
    ).not.toContain('wrapper--active');
  });

  it('sets the font on every selected block and marks it active', async () => {
    const handle = await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK]
    });
    const { engine } = handle;

    await userEvent.click(screen.getByRole('button', { name: 'Font' }));
    await screen.findByText('Caveat');
    const font = fontButton('Caveat');
    handle.select([TEXT_BLOCK]);
    await userEvent.click(font);

    expect(engine.block.setFont).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'Caveat-Regular.ttf',
      expect.objectContaining({ name: 'Caveat' })
    );
    await waitFor(() => expect(font.className).toContain('wrapper--active'));
  });

  it('treats a block with no typeface as having none active', async () => {
    const handle = await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK],
      configure: (fake) => {
        (
          fake.engine.block.getTypeface as ReturnType<typeof vi.fn>
        ).mockImplementation(() => {
          throw new Error('no typeface yet');
        });
      }
    });

    handle.select([TEXT_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Font' }));

    await screen.findByText('Caveat');
    expect(fontButton('Caveat').className).not.toContain('wrapper--active');
  });
});

describe('AP-C24 the shape and sticker adjustment bars', () => {
  it('writes the shape colour and shows the current one on the icon', async () => {
    const { engine, rendered } = await renderWithProviders(
      <ShapesAdjustmentBar />,
      { selection: [SHAPE_BLOCK] }
    );
    const icon = rendered.container.querySelector(
      'span[class="icon"]'
    ) as HTMLElement;
    expect(icon.style.backgroundColor).toBe('rgb(0, 0, 0)');

    await userEvent.click(screen.getByRole('button', { name: 'Color' }));
    const swatches = await screen.findAllByRole('button', { name: '' });
    await userEvent.click(swatches[1]);

    expect(engine.block.setColor).toHaveBeenCalledWith(
      SHAPE_BLOCK,
      'fill/solid/color',
      expect.anything()
    );
  });

  it('offers only the delete button for a sticker', async () => {
    const handle = await renderWithProviders(<StickerAdjustmentBar />, {
      selection: [IMAGE_BLOCK]
    });

    handle.select([IMAGE_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(handle.destroyed).toEqual([IMAGE_BLOCK]);
    expect(handle.engine.editor.addUndoStep).toHaveBeenCalled();
  });

  it('leaves crop mode before it deletes', async () => {
    const handle = await renderWithProviders(<StickerAdjustmentBar />, {
      selection: [IMAGE_BLOCK],
      editMode: 'Crop'
    });

    handle.select([IMAGE_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(handle.engine.editor.setEditMode).toHaveBeenCalledWith('Transform');
    expect(handle.destroyed).toEqual([IMAGE_BLOCK]);
  });

  it('hides the delete button while the block may not be destroyed', async () => {
    await renderWithProviders(<StickerAdjustmentBar />, {
      selection: [IMAGE_BLOCK],
      configure: (fake) => {
        fake.blocks.get(IMAGE_BLOCK)!.scopes['lifecycle/destroy'] = false;
      }
    });

    expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
  });
});

describe('AP-C25 the colour picker inside the colour bar', () => {
  it('applies a colour typed into the picker and ignores an unparseable one', async () => {
    const { engine } = await renderWithProviders(<ShapesAdjustmentBar />, {
      selection: [SHAPE_BLOCK]
    });
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Pick color' })
    );

    const hexInput = screen.getByRole('textbox');
    fireEvent.change(hexInput, { target: { value: '#00ff00' } });

    await waitFor(() => {
      expect(engine.block.setColor).toHaveBeenCalledWith(
        SHAPE_BLOCK,
        'fill/solid/color',
        { r: 0, g: 1, b: 0, a: 1 }
      );
    });

    (engine.block.setColor as ReturnType<typeof vi.fn>).mockClear();
    fireEvent.change(hexInput, { target: { value: '#12' } });
    expect(engine.block.setColor).not.toHaveBeenCalled();
  });
});
