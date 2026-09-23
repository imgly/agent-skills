// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { reportDemoPhase } = vi.hoisted(() => ({ reportDemoPhase: vi.fn() }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({ reportDemoPhase }));

const { renderWithProviders, installBrowserStubs, resizeObservedElements } =
  await import('./support/render');
const { installFakeEngine } = await import('./support/engine-mock');
const { IMAGE_BLOCK, PAGE_A, PAGE_B, TEXT_BLOCK } =
  await import('./support/fake-engine');
const { EngineProvider } = await import('../../src/app/contexts/EngineContext');
const { default: ColorPicker } =
  await import('../../src/app/ui/ColorPicker/ColorPicker');

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('PB-C70 the engine provider', () => {
  it('takes the local asset base URL when the kit runs against a local build', async () => {
    installBrowserStubs();
    vi.stubEnv('CESDK_USE_LOCAL', 'true');
    vi.stubEnv('VITE_IMGLY_LOCAL_ASSETS_URL', 'http://localhost:5199/local');
    installFakeEngine();
    const engineModule = (await import('@cesdk/engine')).default as unknown as {
      init: (config: { baseURL?: string }) => Promise<unknown>;
    };
    const init = vi.spyOn(engineModule, 'init');

    render(
      <EngineProvider config={{}} LoadingComponent={<span>loading</span>}>
        <span>ready</span>
      </EngineProvider>
    );

    await screen.findByText('ready');
    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: 'http://localhost:5199/local' })
    );
    init.mockRestore();
  });

  it('disposes an engine whose provider unmounted before it was ready', async () => {
    installBrowserStubs();
    const handle = installFakeEngine();
    const { unmount } = render(
      <EngineProvider config={{}} LoadingComponent={<span>loading</span>}>
        <span>ready</span>
      </EngineProvider>
    );

    unmount();
    await waitFor(() => expect(handle.engine.dispose).toHaveBeenCalled());
    expect(screen.queryByText('ready')).toBeNull();
  });

  it('turns the engine s own scroll and zoom off', async () => {
    const { engine } = await renderWithProviders(<span />);
    expect(engine.editor.setSetting).toHaveBeenCalledWith(
      'mouse/enableScroll',
      false
    );
    expect(engine.editor.setSetting).toHaveBeenCalledWith(
      'mouse/enableZoom',
      false
    );
  });
});

describe('PB-C77 the demo lifecycle beacon', () => {
  it('reports created once the engine exists and ready once the scene is up', async () => {
    reportDemoPhase.mockClear();
    await renderWithProviders(<span />);

    // The scene effect settles twice, and the beacon itself keeps only the
    // first mark per phase.
    await waitFor(() =>
      expect([
        ...new Set(reportDemoPhase.mock.calls.map(([phase]) => phase))
      ]).toEqual(['created', 'ready'])
    );
  });
});

describe('PB-C71 the colour picker on its own', () => {
  it('renders its own trigger, a label and the preset colours', async () => {
    installBrowserStubs();
    const onChange = vi.fn();
    render(
      <ColorPicker
        name="picker"
        label="Background"
        value="#ff0000"
        presetColors={['#00ff00', '#0000ff']}
        onChange={onChange}
      />
    );

    expect(screen.getAllByText('Background')).not.toHaveLength(0);
    const presets = screen
      .getAllByRole('button')
      .filter((button) => button.className.includes('colorPreset'));
    expect(presets).toHaveLength(2);

    await userEvent.click(presets[0]);
    expect(onChange).toHaveBeenCalledWith('#00ff00');
  });

  it('runs the debounced callback once after the last change', async () => {
    installBrowserStubs();
    vi.useFakeTimers();
    try {
      const onChangeDebounced = vi.fn();
      render(
        <ColorPicker
          name="picker"
          value="#ff0000"
          presetColors={['#00ff00']}
          onChange={vi.fn()}
          onChangeDebounced={onChangeDebounced}
        />
      );

      const preset = screen
        .getAllByRole('button')
        .find((button) => button.className.includes('colorPreset'));
      act(() => preset?.click());
      expect(onChangeDebounced).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(onChangeDebounced).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('opens the picker from its own trigger', async () => {
    installBrowserStubs();
    render(<ColorPicker name="picker" value="#ff0000" onChange={vi.fn()} />);

    const trigger = document.querySelector('label') as HTMLElement;
    expect(
      (trigger.nextElementSibling as HTMLElement | null)?.style.display
    ).toBe('none');

    await userEvent.click(trigger);

    expect(
      (trigger.nextElementSibling as HTMLElement | null)?.style.display
    ).toBe('block');
  });

  it('ignores the colour the picker reports while it has no value', async () => {
    const ColorSelect = (
      await import('../../src/app/ui/ColorSelect/ColorSelect')
    ).default;
    const onClick = vi.fn();
    await renderWithProviders(
      <ColorSelect colorPalette={[]} onClick={onClick} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Pick color' }));
    const input = screen.getByRole('textbox');

    act(() => {
      (input as HTMLInputElement).value = '#NaNNaNNaN';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('PB-C72 the page previews under pressure', () => {
  it('releases the preview of a page that was deleted', async () => {
    const revoke = vi.fn();
    const handle = await renderWithProviders(<span />);
    // Both page previews have to exist before one of them can be released.
    await waitFor(() =>
      expect(handle.spy('block.export')).toHaveBeenCalledTimes(2)
    );
    URL.revokeObjectURL = revoke;

    act(() => {
      (
        handle.engine.scene.getPages as ReturnType<typeof vi.fn>
      ).mockReturnValue([PAGE_A]);
      handle.emitBlockEvent(handle.blocks.get(PAGE_A)!.parent as number);
    });

    await waitFor(() => expect(revoke).toHaveBeenCalledWith('blob:preview'));
  });

  it('rethrows an export failure while the page is still there', async () => {
    const handle = await renderWithProviders(<span />);
    await waitFor(() => expect(handle.spy('block.export')).toHaveBeenCalled());
    const rejection = vi.fn();
    process.once('unhandledRejection', rejection);
    handle.spy('block.export').mockRejectedValue(new Error('export failed'));

    act(() => handle.emitHistoryUpdated());

    await waitFor(() => expect(rejection).toHaveBeenCalled());
  });

  it('swallows an export failure for a page that has just gone', async () => {
    const handle = await renderWithProviders(<span />);
    await waitFor(() => expect(handle.spy('block.export')).toHaveBeenCalled());
    handle.spy('block.export').mockImplementation(async (id: number) => {
      handle.blocks.delete(id);
      throw new Error('export failed');
    });

    act(() => handle.emitHistoryUpdated());

    await waitFor(() =>
      expect(handle.spy('block.export')).toHaveBeenCalledTimes(3)
    );
    expect(handle.blocks.has(PAGE_A)).toBe(false);
  });
});

describe('PB-C73 correcting a selection the engine disagrees with', () => {
  it('keeps the engine selection when the remembered block is gone', async () => {
    vi.useFakeTimers();
    try {
      const handle = installFakeEngine({ selection: [TEXT_BLOCK] });
      installBrowserStubs();
      const { SelectionProvider, useSelection } =
        await import('../../src/app/contexts/UseSelection');
      const Probe = () => <span>{useSelection().selection.join(',')}</span>;
      render(
        <SelectionProvider engine={handle.engine}>
          <Probe />
        </SelectionProvider>
      );

      act(() => handle.select([IMAGE_BLOCK]));
      expect(screen.getByText('21')).toBeTruthy();

      handle.blocks.delete(IMAGE_BLOCK);
      handle.engine.block.setSelected(IMAGE_BLOCK, false);
      handle.engine.block.setSelected(TEXT_BLOCK, true);
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByText('20')).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it('deselects the block the engine kept when the editor cleared the selection', async () => {
    vi.useFakeTimers();
    try {
      const handle = installFakeEngine({ selection: [] });
      installBrowserStubs();
      const { SelectionProvider } =
        await import('../../src/app/contexts/UseSelection');
      render(
        <SelectionProvider engine={handle.engine}>
          <span>probe</span>
        </SelectionProvider>
      );

      act(() => handle.select([]));
      handle.engine.block.setSelected(TEXT_BLOCK, true);
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(handle.engine.block.setSelected).toHaveBeenCalledWith(
        TEXT_BLOCK,
        false
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps only the block the editor selected when several are live', async () => {
    vi.useFakeTimers();
    try {
      const handle = installFakeEngine({ selection: [] });
      installBrowserStubs();
      const { SelectionProvider } =
        await import('../../src/app/contexts/UseSelection');
      render(
        <SelectionProvider engine={handle.engine}>
          <span>probe</span>
        </SelectionProvider>
      );

      act(() => handle.select([TEXT_BLOCK]));
      handle.engine.block.setSelected(IMAGE_BLOCK, true);
      (handle.engine.block.setSelected as ReturnType<typeof vi.fn>).mockClear();
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(handle.engine.block.setSelected).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('PB-C74 guards that keep the editor from touching a missing element', () => {
  it('leaves the canvas wrapper empty while the engine has no element', async () => {
    const CESDKCanvas = (
      await import('../../src/app/ui/CESDKCanvas/CESDKCanvas')
    ).default;

    await renderWithProviders(<CESDKCanvas isVisible />, {
      configure: (fake) => {
        (fake.engine as { element?: HTMLElement }).element = undefined;
      }
    });

    expect(document.getElementById('cesdk')?.childElementCount).toBe(0);
  });

  it('measures nothing while the toolbar has no element', async () => {
    const { useToolbarHeight } =
      await import('../../src/app/ui/UseToolbarHeight/UseToolbarHeight');
    function DetachedBar() {
      useToolbarHeight();
      return <div>bar</div>;
    }
    const handle = await renderWithProviders(<DetachedBar />);

    act(() => resizeObservedElements());
    expect(handle.engine).toBeDefined();
  });
});

describe('PB-C75 zooming with nothing valid to zoom to', () => {
  it('does nothing when the current page has been destroyed', async () => {
    const handle = await renderWithProviders(<span />);
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );
    handle.blocks.delete(PAGE_A);
    handle.spy('scene.zoomToBlock').mockClear();

    act(() => resizeObservedElements());

    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
    expect(handle.blocks.has(PAGE_B)).toBe(true);
  });
});

describe('PB-C88 the editor closing while its scene loads', () => {
  it('stops the template load instead of driving a gone editor', async () => {
    let finishLoad: () => void = () => {};
    const handle = await renderWithProviders(<span>probe</span>, {
      configure: ({ engine }) => {
        engine.scene.load = vi.fn(
          async () =>
            await new Promise<void>((resolve) => {
              finishLoad = resolve;
            })
        ) as never;
      }
    });
    handle.spy('block.findByKind').mockClear();

    handle.rendered.unmount();
    await act(async () => {
      finishLoad();
    });

    expect(handle.spy('block.findByKind')).not.toHaveBeenCalled();
  });
});
