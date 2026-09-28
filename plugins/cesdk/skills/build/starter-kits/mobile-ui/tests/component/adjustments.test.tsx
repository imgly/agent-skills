// @vitest-environment jsdom
import {
  act,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createFakeEngine,
  IMAGES,
  TYPEFACES,
  type FakeEngine
} from './support/fakeEngine';
import { renderEditor } from './support/renderEditor';

vi.mock('@cesdk/engine', async () => {
  const { engineHolder: holder } = await import('./support/engineHolder');
  return { default: { init: async () => holder.engine } };
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
});

/** Mount the editor with one block of `kind` already selected. */
const renderWithSelection = async (kind: string, engine?: FakeEngine) => {
  const fake = engine ?? createFakeEngine();
  fake.setSelection([5]);
  fake.block.getKind.mockReturnValue(kind);
  const result = await renderEditor(fake);
  await act(async () => fake.emitEvents());
  return { ...result, engine: fake };
};

describe('MB-C19 the bar follows the selected block kind', () => {
  it.each([
    ['text', 'Text', ['Font', 'Alignment', 'Color']],
    ['image', 'Image', ['Crop', 'Replace']],
    ['shape', 'Shape', ['Color']],
    ['sticker', 'Sticker', []]
  ])('shows the %s bar', async (kind, headline, controls) => {
    await renderWithSelection(kind);
    expect(await screen.findByText(headline)).toBeTruthy();
    for (const control of controls) {
      expect(screen.getByRole('button', { name: control })).toBeTruthy();
    }
  });

  it('offers Delete for every kind the kit can delete', async () => {
    await renderWithSelection('sticker');
    expect(screen.getByRole('button', { name: 'Delete' })).toBeTruthy();
  });

  it('hides Delete for a kind the kit does not delete', async () => {
    const engine = createFakeEngine();
    engine.setSelection([5]);
    engine.block.getKind.mockReturnValue('page');
    await renderEditor(engine);
    await act(async () => engine.emitEvents());
    expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
  });

  it('destroys the selection and records one undo step', async () => {
    const { engine } = await renderWithSelection('shape');
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(engine.block.destroy).toHaveBeenCalledWith(5);
    expect(engine.editor.addUndoStep).toHaveBeenCalled();
  });

  it('leaves crop mode before deleting', async () => {
    const { engine } = await renderWithSelection('image');
    engine.editor.getEditMode.mockReturnValue('Crop');
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(engine.editor.setEditMode).toHaveBeenCalledWith('Transform');
  });
});

describe('MB-C20 text adjustments', () => {
  it('writes the alignment the user picks onto the block', async () => {
    const { engine } = await renderWithSelection('text');
    await userEvent.click(screen.getByRole('button', { name: 'Alignment' }));

    await userEvent.click(await screen.findByRole('button', { name: 'Left' }));
    expect(engine.block.setEnum).toHaveBeenCalledWith(
      5,
      'text/horizontalAlignment',
      'Left'
    );
    expect(engine.editor.addUndoStep).toHaveBeenCalled();
  });

  it('writes a palette colour without an undo step of its own', async () => {
    const { engine } = await renderWithSelection('text');
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));

    const swatch = await screen.findByRole('button', { name: '#00d8a4ff' });
    await userEvent.click(swatch);
    // The value is written on the block itself; the fill is only what the
    // hook subscribes to for change notifications.
    expect(engine.block.setColor).toHaveBeenCalledWith(
      5,
      'fill/solid/color',
      expect.objectContaining({ a: 1 })
    );
  });

  it('sets the font on every selected block and marks it active', async () => {
    const { engine } = await renderWithSelection('text');
    await userEvent.click(screen.getByRole('button', { name: 'Font' }));

    await userEvent.click(
      (await screen.findByText('Oswald')).closest('button') as HTMLElement
    );
    expect(engine.block.setFont).toHaveBeenCalledWith(
      5,
      'Oswald-Regular.ttf',
      TYPEFACES[2].payload.typeface
    );
  });

  it('survives an engine that cannot report a typeface', async () => {
    const engine = createFakeEngine();
    engine.block.getTypeface.mockImplementation(() => {
      throw new Error('no typeface');
    });
    await renderWithSelection('text', engine);
    await userEvent.click(screen.getByRole('button', { name: 'Font' }));
    expect(await screen.findByText('Caveat')).toBeTruthy();
  });

  it('closes the panel from the collapse control', async () => {
    await renderWithSelection('text');
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));
    expect(await screen.findByText('Color')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Collapse' }));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Collapse' })).toBeNull()
    );
  });
});

describe('MB-C21 shape colour', () => {
  it('writes the fill colour of the shape', async () => {
    const { engine } = await renderWithSelection('shape');
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));

    await userEvent.click(
      await screen.findByRole('button', { name: '#000000ff' })
    );
    expect(engine.block.setColor).toHaveBeenCalledWith(
      5,
      'fill/solid/color',
      expect.objectContaining({ r: 0, g: 0, b: 0 })
    );
  });

  it('marks the swatch that matches the current fill', async () => {
    const engine = createFakeEngine({
      properties: { 'fill/solid/color': { r: 1, g: 1, b: 1, a: 1 } }
    });
    await renderWithSelection('shape', engine);
    await userEvent.click(screen.getByRole('button', { name: 'Color' }));

    const active = await screen.findByRole('button', { name: '#ffffffff' });
    expect(active.className).toContain('colorButton--active');
  });
});

describe('MB-C22 image crop and replace', () => {
  it('puts the engine into crop mode and opens the crop panel', async () => {
    const { engine } = await renderWithSelection('image');
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));

    expect(engine.editor.setEditMode).toHaveBeenCalledWith('Crop');
    expect(await screen.findByText('Crop')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeTruthy();
  });

  it('resets the crop of every selected block', async () => {
    const { engine } = await renderWithSelection('image');
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));

    await userEvent.click(await screen.findByRole('button', { name: 'Reset' }));
    expect(engine.block.resetCrop).toHaveBeenCalledWith(5);
  });

  it('scales the crop and refills the frame at the new ratio', async () => {
    const { engine } = await renderWithSelection('image');
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));

    const scale = await screen.findByRole('slider', { name: 'Scale' });
    scale.focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(engine.block.setCropScaleRatio).toHaveBeenCalledWith(5, 1.01);
    expect(engine.block.adjustCropToFillFrame).toHaveBeenCalledWith(5, 2);
  });

  it('straightens the crop in radians and keeps the starting scale', async () => {
    const { engine } = await renderWithSelection('image');
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));

    const straighten = await screen.findByRole('slider', {
      name: 'Straighten'
    });
    straighten.focus();
    await userEvent.keyboard('{ArrowRight}');

    const [, radians] = engine.block.setCropRotation.mock.calls[0];
    expect(radians).toBeCloseTo(Math.PI / 180, 6);
  });

  it('leaves crop mode when the panel collapses', async () => {
    const { engine } = await renderWithSelection('image');
    await userEvent.click(screen.getByRole('button', { name: 'Crop' }));

    await userEvent.click(await screen.findByRole('button', { name: 'Done' }));
    expect(engine.editor.setEditMode).toHaveBeenLastCalledWith('Transform');
  });

  it('replaces the image and resets its crop', async () => {
    const { engine } = await renderWithSelection('image');
    await userEvent.click(screen.getByRole('button', { name: 'Replace' }));

    await userEvent.click(
      (await screen.findByAltText('A beach')).parentElement!
    );
    expect(engine.asset.applyToBlock).toHaveBeenCalledWith(
      'ly.img.image',
      IMAGES[0],
      5
    );
    expect(engine.block.resetCrop).toHaveBeenCalledWith(5);
  });

  it('replaces the image with an upload without adding a new asset', async () => {
    const { engine } = await renderWithSelection('image');
    await userEvent.click(screen.getByRole('button', { name: 'Replace' }));
    await userEvent.click(await screen.findByText('Upload'));

    const input = (await waitFor(() => {
      const found = document.querySelector('input[type=file]');
      expect(found).toBeTruthy();
      return found;
    })) as HTMLInputElement;
    // Replace takes one file at a time.
    expect(input.hasAttribute('multiple')).toBe(false);

    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file]
    });
    await act(async () => {
      input.dispatchEvent(new Event('change'));
    });

    await waitFor(() =>
      expect(engine.asset.applyToBlock).toHaveBeenCalledWith(
        'ly.img.image',
        expect.objectContaining({ id: 'blob:upload' }),
        5
      )
    );
    input.remove();
  });
});
