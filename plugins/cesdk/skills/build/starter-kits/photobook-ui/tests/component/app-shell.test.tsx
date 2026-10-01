// @vitest-environment jsdom
import { screen, userEvent, waitFor } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders, exportButton } = await import('./support/render');
const { PAGE_A, PAGE_B, STACK, engineSpy } =
  await import('./support/fake-engine');
const PhotoBookUI = (
  await import('../../src/app/components/PhotoBookUI/PhotoBookUI')
).default;

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ text: async () => 'UBQ1-template' }) as Response)
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** The design headline only renders once the scene has loaded. */
async function renderShell() {
  const handle = await renderWithProviders(<PhotoBookUI />);
  await screen.findByRole('heading', { name: 'Design' });
  return handle;
}

describe('PB-C10 the photobook shell', () => {
  it('loads the photobook scene and keeps the canvas mounted throughout', async () => {
    const { engine } = await renderWithProviders(<PhotoBookUI />);

    await waitFor(() => {
      expect(engine.scene.load).toHaveBeenCalledWith(
        expect.stringMatching(/\/photobook\.scene$/)
      );
    });
    const canvas = document.getElementById('cesdk') as HTMLElement;
    expect(canvas.contains(engine.element)).toBe(true);
    expect(canvas.style.visibility).toBe('hidden');

    await screen.findByRole('heading', { name: 'Design' });
    expect(canvas.style.visibility).toBe('visible');
  });

  it('shows the page rail and the four things this editor can add', async () => {
    await renderShell();

    expect(screen.getByRole('heading', { name: 'Pages' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /^Page \d$/ })).toHaveLength(
      2
    );
    for (const label of ['Theme', 'Layout', 'Color', 'Sticker']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
  });

  it('turns the placeholder overlay off, as if the user had replaced the photos', async () => {
    const { engine } = await renderShell();
    expect(engine.block.setPlaceholderEnabled).toHaveBeenCalledWith(
      expect.any(Number),
      false
    );
  });
});

describe('PB-C11 switching pages', () => {
  it('shows only the page the rail selects', async () => {
    const { engine } = await renderShell();

    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));

    await waitFor(() => {
      expect(engine.block.isVisible(PAGE_B)).toBe(true);
      expect(engine.block.isVisible(PAGE_A)).toBe(false);
    });
    expect(engineSpy(engine, 'scene.zoomToBlock')).toHaveBeenCalledWith(
      PAGE_B,
      {
        padding: {
          left: 40,
          top: 110,
          right: 40,
          bottom: expect.any(Number)
        }
      }
    );
  });

  it('starts a fresh history for the page the user moves to', async () => {
    const { engine } = await renderShell();
    (engine.editor.createHistory as ReturnType<typeof vi.fn>).mockClear();

    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));

    await waitFor(() => {
      expect(engine.editor.createHistory).toHaveBeenCalled();
    });
    expect(engine.editor.setActiveHistory).toHaveBeenCalledWith(2);
    expect(engine.editor.destroyHistory).toHaveBeenCalledWith(1);
  });
});

describe('PB-C12 changing the page list', () => {
  it('adds a page from the template scene and makes it destroyable', async () => {
    const { engine } = await renderShell();

    await userEvent.click(screen.getByRole('button', { name: 'Add Page' }));

    await waitFor(() => {
      expect(engine.block.loadFromString).toHaveBeenCalledWith('UBQ1-template');
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/template-0\.scene$/)
    );
    const appended = (
      engine.block.appendChild as ReturnType<typeof vi.fn>
    ).mock.calls.at(-1);
    expect(appended?.[0]).toBe(STACK);
    expect(engine.block.setScopeEnabled).toHaveBeenCalledWith(
      appended?.[1],
      'lifecycle/destroy',
      true
    );
  });

  it.each([
    ['up', 'Move page up', 0],
    ['down', 'Move page down', 1]
  ])('moves the current page %s', async (_direction, name, index) => {
    const { engine } = await renderShell();

    await userEvent.click(screen.getByRole('button', { name }));

    expect(engine.block.insertChild).toHaveBeenCalledWith(STACK, PAGE_A, index);
  });

  it('deletes the page the user is on', async () => {
    const { engine, destroyed } = await renderShell();

    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    await waitFor(() => expect(engine.block.isVisible(PAGE_B)).toBe(true));
    await userEvent.click(screen.getByRole('button', { name: 'Delete page' }));

    await waitFor(() => expect(destroyed).toContain(PAGE_B));
  });

  it('hides the delete button while the page cannot be destroyed', async () => {
    const handle = await renderWithProviders(<PhotoBookUI />);
    handle.blocks.get(PAGE_A)!.scopes['lifecycle/destroy'] = false;
    await screen.findByRole('heading', { name: 'Design' });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Delete page' })).toBeNull();
    });
  });
});

describe('PB-C13 undo and redo', () => {
  it('disables each button until the engine reports the step', async () => {
    const handle = await renderShell();
    const undo = screen.getByRole('button', { name: 'Undo' });
    const redo = screen.getByRole('button', { name: 'Redo' });
    expect((undo as HTMLButtonElement).disabled).toBe(true);
    expect((redo as HTMLButtonElement).disabled).toBe(true);

    handle.emitHistoryUpdated();

    await waitFor(() =>
      expect((undo as HTMLButtonElement).disabled).toBe(false)
    );
    expect((redo as HTMLButtonElement).disabled).toBe(true);
  });

  it('undoes through the engine', async () => {
    const handle = await renderShell();
    handle.emitHistoryUpdated();

    const undo = screen.getByRole('button', { name: 'Undo' });
    await waitFor(() =>
      expect((undo as HTMLButtonElement).disabled).toBe(false)
    );
    await userEvent.click(undo);

    expect(handle.engine.editor.undo).toHaveBeenCalledTimes(1);
  });
});

describe('PB-C14 exporting the book', () => {
  it('exports the whole scene as a PDF at 72 dpi and restores the editor', async () => {
    const { engine } = await renderShell();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    await userEvent.click(exportButton());

    await waitFor(() => {
      expect(engineSpy(engine, 'block.export')).toHaveBeenCalledWith(1, {
        mimeType: 'application/pdf'
      });
    });
    const dpi = (engine.block.setFloat as ReturnType<typeof vi.fn>).mock.calls
      .filter(([, property]) => property === 'scene/dpi')
      .map(([, , value]) => value);
    expect(dpi).toEqual([72, 300]);
    // Every page is shown for the export, then hidden again bar the current one.
    expect(engine.block.isVisible(PAGE_B)).toBe(false);
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it('disables the button while the export runs', async () => {
    const { engine } = await renderShell();
    let finish: (blob: Blob) => void = () => {};
    engineSpy(engine, 'block.export').mockReturnValue(
      new Promise<Blob>((resolve) => {
        finish = resolve;
      })
    );

    const button = exportButton();
    await userEvent.click(button);

    await waitFor(() =>
      expect((button as HTMLButtonElement).disabled).toBe(true)
    );
    finish(new Blob(['pdf']));
    await waitFor(() =>
      expect((button as HTMLButtonElement).disabled).toBe(false)
    );
  });
});

describe('PB-C15 the page previews', () => {
  it('exports a small jpeg per page and shows it in the rail', async () => {
    const { engine } = await renderShell();

    await waitFor(() => {
      expect(engineSpy(engine, 'block.export')).toHaveBeenCalledWith(PAGE_A, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.5
      });
    });
    await waitFor(() => {
      const page = screen.getByRole('button', { name: 'Page 1' });
      expect(page.querySelector('img')?.getAttribute('src')).toBe(
        'blob:preview'
      );
    });
  });

  it('renders the current page again when the history changes', async () => {
    const handle = await renderShell();
    await waitFor(() => expect(handle.spy('block.export')).toHaveBeenCalled());
    handle.spy('block.export').mockClear();

    handle.emitHistoryUpdated();

    await waitFor(() => {
      expect(handle.spy('block.export')).toHaveBeenCalledWith(PAGE_A, {
        mimeType: 'image/jpeg',
        jpegQuality: 0.5
      });
    });
  });

  it('skips a preview for a page that was deleted while it was queued', async () => {
    const handle = await renderShell();
    await waitFor(() => expect(handle.spy('block.export')).toHaveBeenCalled());
    handle.spy('block.export').mockClear();
    handle.blocks.delete(PAGE_B);

    handle.emitHistoryUpdated();

    await waitFor(() => expect(handle.spy('block.export')).toHaveBeenCalled());
    const exported = handle.spy('block.export').mock.calls.map(([id]) => id);
    expect(exported).not.toContain(PAGE_B);
  });
});
