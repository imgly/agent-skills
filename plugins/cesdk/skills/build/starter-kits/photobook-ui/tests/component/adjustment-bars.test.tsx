// @vitest-environment jsdom
import { screen, userEvent, waitFor } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders } = await import('./support/render');
const { IMAGE_BLOCK, SHAPE_BLOCK, STICKER_BLOCK, TEXT_BLOCK } =
  await import('./support/fake-engine');
const BottomControls = (
  await import('../../src/app/ui/BottomControls/BottomControls')
).default;

/**
 * Loading the scene deselects everything, so the selection is re-applied after
 * the mount — that is also what a real click on the canvas does.
 */
async function renderFor(selection: number[], options = {}) {
  const handle = await renderWithProviders(<BottomControls />, {
    selection,
    ...options
  });
  if (selection.length > 0) {
    // Wait for the scene load to finish; it deselects everything on its way.
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.select(selection);
    await waitFor(() =>
      expect(handle.engine.block.findAllSelected()).toEqual(selection)
    );
  }
  return handle;
}

describe('PB-C40 which bar the selection opens', () => {
  it('shows the add bar while nothing is selected', async () => {
    await renderFor([]);
    expect(await screen.findByRole('button', { name: 'Text' })).toBeTruthy();
  });

  it.each([
    ['a text block', TEXT_BLOCK, ['Color', 'Font', 'Align', 'Delete']],
    ['an image block', IMAGE_BLOCK, ['Replace', 'Crop', 'Delete']],
    ['a shape block', SHAPE_BLOCK, ['Color', 'Delete']],
    ['a sticker block', STICKER_BLOCK, ['Delete']]
  ])('shows the %s bar', async (_label, blockId, labels) => {
    await renderFor([blockId]);
    for (const label of labels) {
      expect(await screen.findByRole('button', { name: label })).toBeTruthy();
    }
  });

  it('falls back to the add bar when several blocks are selected', async () => {
    await renderFor([TEXT_BLOCK, IMAGE_BLOCK]);
    expect(await screen.findByRole('button', { name: 'Text' })).toBeTruthy();
  });

  it('renders nothing while the bar is hidden', async () => {
    const { rendered } = await renderWithProviders(
      <BottomControls visible={false} />
    );
    expect(rendered.container.querySelector('button')).toBeNull();
  });
});

describe('PB-C41 the text bar', () => {
  it('paints the colour icon with the text colour and follows a change', async () => {
    const handle = await renderFor([TEXT_BLOCK]);
    const icon = (
      await screen.findByRole('button', { name: 'Color' })
    ).querySelector('span > span') as HTMLElement;
    expect(icon.style.backgroundColor).toBe('rgb(0, 0, 0)');

    handle.properties.set(`${TEXT_BLOCK}:fill/solid/color`, {
      r: 1,
      g: 1,
      b: 0,
      a: 1
    });
    handle.emitBlockEvent(handle.engine.block.getFill(TEXT_BLOCK));

    await waitFor(() => {
      expect(icon.style.backgroundColor).toBe('rgb(255, 255, 0)');
    });
  });

  it('writes the picked colour onto the text block and adds an undo step', async () => {
    const { engine } = await renderFor([TEXT_BLOCK]);
    await userEvent.click(await screen.findByRole('button', { name: 'Color' }));

    await userEvent.click(
      await screen.findByRole('button', { name: '#0027bcff' })
    );

    expect(engine.block.setColor).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'fill/solid/color',
      { r: 0, g: 39 / 255, b: 188 / 255, a: 1 }
    );
    expect(engine.editor.addUndoStep).toHaveBeenCalled();
  });

  it('sets the font on every selected block and marks it active', async () => {
    const { engine } = await renderFor([TEXT_BLOCK]);
    await userEvent.click(await screen.findByRole('button', { name: 'Font' }));

    const aleo = await screen.findByRole('button', { name: /Aleo/ });
    await userEvent.click(aleo);

    expect(engine.block.setFont).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'Aleo-Regular.ttf',
      expect.objectContaining({ name: 'Aleo' })
    );
    await waitFor(() => expect(aleo.className).toContain('wrapper--active'));
  });

  it('treats a text block with no typeface as having none active', async () => {
    const { engine } = await renderFor([TEXT_BLOCK]);
    (engine.block.getTypeface as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw new Error('no typeface');
      }
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Font' }));

    const buttons = await screen.findAllByRole('button', {
      name: /Caveat|Aleo/
    });
    for (const button of buttons) {
      expect(button.className).not.toContain('wrapper--active');
    }
  });

  it('writes the alignment the user picks', async () => {
    const { engine } = await renderFor([TEXT_BLOCK]);
    await userEvent.click(await screen.findByRole('button', { name: 'Align' }));

    await userEvent.click(
      await screen.findByRole('button', { name: 'Center' })
    );

    expect(engine.block.setEnum).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'text/horizontalAlignment',
      'Center'
    );
  });
});

describe('PB-C42 the image bar', () => {
  it('opens the replace bar and applies the picked image to the block', async () => {
    const { engine } = await renderFor([IMAGE_BLOCK]);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Replace' })
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'sample asset' })
    );

    await waitFor(() => {
      expect(engine.asset.applyToBlock).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({ id: 'upload-1' }),
        IMAGE_BLOCK
      );
    });
  });

  it('enters and leaves crop mode', async () => {
    const handle = await renderFor([IMAGE_BLOCK]);

    await userEvent.click(await screen.findByRole('button', { name: 'Crop' }));
    expect(handle.engine.editor.setEditMode).toHaveBeenCalledWith('Crop');

    await userEvent.click(await screen.findByRole('button', { name: 'Done' }));
    expect(handle.engine.editor.setEditMode).toHaveBeenCalledWith('Transform');
  });

  it('resets the crop of every selected image', async () => {
    const handle = await renderFor([IMAGE_BLOCK], { editMode: 'Crop' });

    await userEvent.click(await screen.findByRole('button', { name: 'Reset' }));

    expect(handle.engine.block.resetCrop).toHaveBeenCalledWith(IMAGE_BLOCK);
  });

  it('opens the replace bar by itself for a placeholder and blocks cropping', async () => {
    const handle = await renderFor([IMAGE_BLOCK]);
    handle.properties.set(`${IMAGE_BLOCK}:placeholder/enabled`, true);
    // The placeholder flag lives on the block, not on its fill.
    handle.emitBlockEvent(IMAGE_BLOCK);

    await waitFor(() => {
      expect(
        (screen.getByRole('button', { name: 'Crop' }) as HTMLButtonElement)
          .disabled
      ).toBe(true);
    });
    expect(
      await screen.findByRole('button', { name: 'sample asset' })
    ).toBeTruthy();
  });

  it('closes the replace bar again', async () => {
    await renderFor([IMAGE_BLOCK]);
    const replace = await screen.findByRole('button', { name: 'Replace' });

    await userEvent.click(replace);
    await screen.findByRole('button', { name: 'sample asset' });
    await userEvent.click(replace);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'sample asset' })).toBeNull();
    });
  });
});

describe('PB-C43 deleting the selection', () => {
  it('leaves crop mode, destroys every selected block and adds an undo step', async () => {
    const handle = await renderFor([IMAGE_BLOCK], { editMode: 'Crop' });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete' })
    );

    expect(handle.engine.editor.setEditMode).toHaveBeenCalledWith('Transform');
    expect(handle.destroyed).toContain(IMAGE_BLOCK);
    expect(handle.engine.editor.addUndoStep).toHaveBeenCalled();
  });

  it('hides itself when the block may not be destroyed', async () => {
    await renderFor([SHAPE_BLOCK], {
      configure: (handle: {
        blocks: Map<number, { scopes: Record<string, boolean> }>;
      }) => {
        handle.blocks.get(SHAPE_BLOCK)!.scopes['lifecycle/destroy'] = false;
      }
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
    });
  });
});

describe('PB-C44 the shape bar', () => {
  it('writes the picked colour onto the shape', async () => {
    const { engine } = await renderFor([SHAPE_BLOCK]);
    await userEvent.click(await screen.findByRole('button', { name: 'Color' }));

    await userEvent.click(
      await screen.findByRole('button', { name: '#e2701dff' })
    );

    expect(engine.block.setColor).toHaveBeenCalledWith(
      SHAPE_BLOCK,
      'fill/solid/color',
      { r: 226 / 255, g: 112 / 255, b: 29 / 255, a: 1 }
    );
  });
});
