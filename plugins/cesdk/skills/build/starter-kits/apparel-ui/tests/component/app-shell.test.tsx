// @vitest-environment jsdom
import {
  act,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders, exportButton } = await import('./support/render');
const { PAGE_A, SCENE, IMAGE_BLOCK, TEXT_BLOCK } =
  await import('./support/fake-engine');
const ApparelUI = (await import('../../src/app/components/ApparelUI/ApparelUI'))
  .default;
const { useEditor } = await import('../../src/app/contexts/EditorContext');

/** Reads `setCurrentStep` out of the editor context so a test can drive it. */
function StepProbe({
  onReady
}: {
  onReady: (setStep: (step: 'edit' | 'preview') => void) => void;
}) {
  const { setCurrentStep } = useEditor();
  onReady(setCurrentStep);
  return <span>probe</span>;
}

/** The bars only render once the scene has loaded and the spinner is gone. */
async function renderShell(
  options?: Parameters<typeof renderWithProviders>[1]
) {
  const handle = await renderWithProviders(<ApparelUI />, options);
  await screen.findByRole('button', { name: 'Preview' }, { timeout: 3000 });
  return handle;
}

describe('AP-C10 the apparel shell', () => {
  it('loads the kiosk scene and keeps the canvas mounted throughout', async () => {
    const { engine } = await renderWithProviders(<ApparelUI />);

    await waitFor(() => {
      expect(engine.scene.load).toHaveBeenCalledWith(
        expect.stringMatching(/\/kiosk\.scene$/)
      );
    });
    const canvas = document.getElementById('cesdk') as HTMLElement;
    expect(canvas.contains(engine.element)).toBe(true);
    expect(canvas.style.visibility).toBe('hidden');

    await screen.findByRole('button', { name: 'Preview' }, { timeout: 3000 });
    expect(canvas.style.visibility).toBe('visible');
  });

  it('shows the add bar with the four things this editor can add', async () => {
    await renderShell();

    for (const label of ['Text', 'Image', 'Shape', 'Sticker']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
  });
});

describe('AP-C11 the edit and preview steps', () => {
  it('starts in edit mode with the page interactive', async () => {
    const { engine } = await renderShell();

    await waitFor(() => {
      expect(engine.block.setClipped).toHaveBeenCalledWith(PAGE_A, false);
    });
    expect(engine.editor.setSetting).toHaveBeenCalledWith(
      'page/dimOutOfPageAreas',
      true
    );
    expect(engine.element!.style.pointerEvents).toBe('all');
  });

  it('zooms to the backdrop and clears the selection in preview', async () => {
    const handle = await renderShell({ selection: [IMAGE_BLOCK] });

    handle.select([IMAGE_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Preview' }));

    await waitFor(() => {
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalledWith(
        SCENE + 1,
        expect.objectContaining({ padding: expect.anything() })
      );
    });
    expect(handle.engine.element!.style.pointerEvents).toBe('none');
    expect(handle.engine.block.setClipped).toHaveBeenCalledWith(PAGE_A, true);
    expect(handle.engine.block.findAllSelected()).toEqual([]);
  });

  it('hides the bottom controls in the preview step', async () => {
    await renderShell();
    expect(screen.getByRole('button', { name: 'Text' })).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Preview' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Text' })).toBeNull();
    });
  });

  it('fails loudly when the scene carries no backdrop image', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    let setStep: ((step: 'edit' | 'preview') => void) | undefined;
    const { errors, engine } = await renderWithProviders(
      <StepProbe
        onReady={(value) => {
          setStep = value;
        }}
      />,
      {
        configure: (fake) => {
          fake.blocks.get(SCENE)!.children = [PAGE_A];
        }
      }
    );
    // The edit branch only runs once the scene load has named the current page.
    await waitFor(() => expect(engine.block.setClipped).toHaveBeenCalled());

    await act(async () => {
      setStep?.('preview');
    });

    expect(errors.map(({ message }) => message)).toContain(
      'Backdrop image not found'
    );
    error.mockRestore();
  });
});

describe('AP-C12 the top bar', () => {
  it('disables undo until the engine reports a step, then undoes', async () => {
    const handle = await renderShell();
    const [undo, redo] = screen.getAllByRole('button', { name: '' });
    expect((undo as HTMLButtonElement).disabled).toBe(true);
    expect((redo as HTMLButtonElement).disabled).toBe(true);

    handle.emitHistoryUpdated();

    await waitFor(() =>
      expect((undo as HTMLButtonElement).disabled).toBe(false)
    );
    await userEvent.click(undo);
    expect(handle.engine.editor.undo).toHaveBeenCalledTimes(1);
  });

  it('exports the scene as a PDF at 72 dpi and restores the editor', async () => {
    const handle = await renderShell();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    await userEvent.click(exportButton());

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

describe('AP-C13 the bottom controls follow the selection', () => {
  it.each([
    ['a text block', TEXT_BLOCK, 'Font'],
    ['an image block', IMAGE_BLOCK, 'Replace']
  ])('shows the bar for %s', async (_case, selected, label) => {
    const handle = await renderShell();

    handle.select([selected]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    });
  });

  it('keeps the add bar for a multi-block selection', async () => {
    const handle = await renderShell();

    handle.select([TEXT_BLOCK, IMAGE_BLOCK]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sticker' })).toBeTruthy();
    });
  });
});
