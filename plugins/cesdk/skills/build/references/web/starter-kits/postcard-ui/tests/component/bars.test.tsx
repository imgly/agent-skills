// @vitest-environment jsdom
import {
  fireEvent,
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

const { renderWithProviders } = await import('./support/render');
const { FRONT_PAGE, IMAGE_BLOCK, SHAPE_BLOCK, STICKER_BLOCK, TEXT_BLOCK } =
  await import('./support/fake-engine');
const AddBlockBar = (
  await import('@/app/features/blocks/AddBlockBar/AddBlockBar')
).default;
const BottomControls = (
  await import('@/app/features/blocks/BottomControls/BottomControls')
).default;
const ImageAdjustmentBar = (
  await import('@/app/features/image/ImageAdjustmentBar/ImageAdjustmentBar')
).default;
const TextAdjustmentsBar = (
  await import('@/app/features/text/TextAdjustmentsBar/TextAdjustmentsBar')
).default;
const ShapesAdjustmentBar = (
  await import('@/app/features/shape/ShapesAdjustmentBar/ShapesAdjustmentBar')
).default;
const StickerAdjustmentBar = (
  await import('@/app/features/sticker/StickerAdjustmentBar/StickerAdjustmentBar')
).default;
const ChangeImageFileSecondary = (
  await import('@/app/features/image/ChangeImageFileSecondary/ChangeImageFileSecondary')
).default;
const CropModeSecondary = (
  await import('@/app/features/image/CropModeSecondary/CropModeSecondary')
).default;

const { useEditor } = await import('@/app/contexts/EditorContext');

/**
 * The colour palettes come from the chosen template, so a bar that shows one
 * has to be mounted with a template already picked.
 */
function WithTemplate({ children }: { children: ReactNode }) {
  const { setPostcardTemplateId, postcardTemplate } = useEditor();
  useEffect(() => setPostcardTemplateId('thank_you'), [setPostcardTemplateId]);
  return postcardTemplate ? <>{children}</> : null;
}

/** The font buttons pair a preview glyph with the typeface name. */
function fontButton(name: string): HTMLButtonElement {
  return screen.getByText(name).closest('button') as HTMLButtonElement;
}

describe('PC-C20 the add bar', () => {
  it('adds a text block to the current page through the kit action', async () => {
    const handle = await renderWithProviders(<AddBlockBar />);

    await userEvent.click(screen.getByRole('button', { name: 'Text' }));
    await screen.findByText('Caveat');
    await userEvent.click(fontButton('Caveat'));

    expect(handle.engine.actions.run).toHaveBeenCalledWith(
      'addText',
      FRONT_PAGE,
      expect.objectContaining({ uri: 'Caveat-Regular.ttf' }),
      expect.objectContaining({ name: 'Caveat' })
    );
    expect(handle.engine.block.create).toHaveBeenCalledWith('text');
    expect(handle.engine.block.appendChild).toHaveBeenCalledWith(
      FRONT_PAGE,
      expect.any(Number)
    );
  });

  it.each([
    ['Shape', 'Add shape 0', 'ly.img.vector.shape'],
    ['Sticker', 'Add sticker 0', 'ly.img.sticker']
  ])('applies the %s the user picks', async (tab, asset, sourceId) => {
    const { engine } = await renderWithProviders(<AddBlockBar />);

    await userEvent.click(screen.getByRole('button', { name: tab }));
    await userEvent.click(await screen.findByRole('button', { name: asset }));

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

describe('PC-C21 the image adjustment bar', () => {
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

  it('enters and leaves crop mode through the engine actions', async () => {
    const handle = await renderWithProviders(<ImageAdjustmentBar />, {
      selection: [IMAGE_BLOCK]
    });

    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    expect(handle.engine.actions.run).toHaveBeenCalledWith('crop.enter');

    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));
    expect(handle.engine.actions.run).toHaveBeenCalledWith('editmode.exit');
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

describe('PC-C22 leaving crop mode', () => {
  it('returns to transform mode from the Done button', async () => {
    const { engine } = await renderWithProviders(<CropModeSecondary />, {
      selection: [IMAGE_BLOCK],
      editMode: 'Crop'
    });

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));

    expect(engine.editor.setEditMode).toHaveBeenCalledWith('Transform');
  });
});

describe('PC-C23 the text adjustment bar', () => {
  it('writes the colour the user picks onto the text block', async () => {
    const { engine } = await renderWithProviders(
      <WithTemplate>
        <TextAdjustmentsBar />
      </WithTemplate>,
      { selection: [TEXT_BLOCK] }
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Color' }));
    const swatches = await screen.findAllByRole('button', { name: '' });
    await userEvent.click(swatches[1]);

    expect(engine.block.setColor).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'fill/solid/color',
      expect.anything()
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

  it('replaces the font on the whole selection', async () => {
    const handle = await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK]
    });

    await userEvent.click(screen.getByRole('button', { name: 'Font' }));
    await screen.findByText('Caveat');
    handle.select([TEXT_BLOCK]);
    await userEvent.click(fontButton('Caveat'));

    expect(handle.engine.actions.run).toHaveBeenCalledWith(
      'replaceFontOnSelection',
      expect.objectContaining({ uri: 'Caveat-Regular.ttf' }),
      expect.objectContaining({ name: 'Caveat' })
    );
    expect(handle.engine.block.setFont).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'Caveat-Regular.ttf',
      expect.objectContaining({ name: 'Caveat' })
    );
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

describe('PC-C24 the shape and sticker adjustment bars', () => {
  it('writes the shape colour and shows the current one on the icon', async () => {
    const { engine, rendered } = await renderWithProviders(
      <WithTemplate>
        <ShapesAdjustmentBar />
      </WithTemplate>,
      { selection: [SHAPE_BLOCK] }
    );
    await screen.findByRole('button', { name: 'Color' });
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

  it('deletes the selection through the engine action', async () => {
    const handle = await renderWithProviders(<StickerAdjustmentBar />, {
      selection: [STICKER_BLOCK]
    });

    handle.select([STICKER_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(handle.destroyed).toEqual([STICKER_BLOCK]));
    expect(handle.engine.editor.addUndoStep).toHaveBeenCalled();
  });

  it('leaves crop mode before it deletes', async () => {
    const handle = await renderWithProviders(<StickerAdjustmentBar />, {
      selection: [STICKER_BLOCK],
      editMode: 'Crop'
    });

    handle.select([STICKER_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(handle.engine.actions.run).toHaveBeenCalledWith('editmode.exit');
    await waitFor(() => expect(handle.destroyed).toEqual([STICKER_BLOCK]));
  });

  it('hides the delete button while the block may not be destroyed', async () => {
    await renderWithProviders(<StickerAdjustmentBar />, {
      selection: [STICKER_BLOCK],
      configure: (fake) => {
        fake.blocks.get(STICKER_BLOCK)!.scopes['lifecycle/destroy'] = false;
      }
    });

    expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
  });
});

describe('PC-C25 the bottom controls follow the selection', () => {
  it.each([
    ['a text block', TEXT_BLOCK, 'Font'],
    ['an image block', IMAGE_BLOCK, 'Replace']
  ])('shows the bar for %s', async (_case, selected, label) => {
    const handle = await renderWithProviders(<BottomControls />);

    handle.select([selected]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    });
  });

  it('keeps the add bar for a multi-block selection', async () => {
    const handle = await renderWithProviders(<BottomControls />);

    handle.select([TEXT_BLOCK, IMAGE_BLOCK]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sticker' })).toBeTruthy();
    });
  });

  it('renders nothing while it is hidden', async () => {
    const { rendered } = await renderWithProviders(
      <BottomControls visible={false} />
    );

    expect(rendered.container.querySelectorAll('button')).toHaveLength(0);
  });
});

describe('PC-C26 the colour picker inside the colour bar', () => {
  it('applies a colour typed into the picker and ignores an unparseable one', async () => {
    const { engine } = await renderWithProviders(
      <WithTemplate>
        <ShapesAdjustmentBar />
      </WithTemplate>,
      { selection: [SHAPE_BLOCK] }
    );
    await userEvent.click(await screen.findByRole('button', { name: 'Color' }));
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
