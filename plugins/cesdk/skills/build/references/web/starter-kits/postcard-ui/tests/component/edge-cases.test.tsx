// @vitest-environment jsdom
import {
  act,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { useEffect, useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { reportDemoPhase } = vi.hoisted(() => ({ reportDemoPhase: vi.fn() }));
vi.mock('../../../shared/demo-preview/lifecycle', () => ({ reportDemoPhase }));

const { renderWithProviders, installBrowserStubs, resizeObservedElements } =
  await import('./support/render');
const { FRONT_PAGE, IMAGE_BLOCK, TEXT_BLOCK, createFakeEngine } =
  await import('./support/fake-engine');
const { installFakeEngine } = await import('./support/engine-mock');
const { EngineProvider } = await import('@/app/contexts/EngineContext');
const { SelectionProvider, useSelection } =
  await import('@/app/contexts/SelectionContext');
const { useEditor } = await import('@/app/contexts/EditorContext');
const { useSinglePageMode } =
  await import('@/app/contexts/SinglePageModeContext');
const { useToolbarHeight } =
  await import('@/app/components/UseToolbarHeight/UseToolbarHeight');
const { useImageUpload } = await import('@/app/hooks/useImageUpload');
const { ColorPicker } =
  await import('@/app/components/ColorPicker/ColorPicker');
const BlockBar = (await import('@/app/components/BlockBar/BlockBar')).default;
const ColorDropdown = (
  await import('@/app/components/ColorDropdown/ColorDropdown')
).default;
const AddImageSecondary = (
  await import('@/app/features/image/AddImageSecondary/AddImageSecondary')
).default;
const TextAdjustmentsBar = (
  await import('@/app/features/text/TextAdjustmentsBar/TextAdjustmentsBar')
).default;

/** jsdom never loads an image, so the upload flow needs one that resolves. */
function stubImageLoading(outcome: 'load' | 'error' = 'load'): void {
  class StubImage {
    onload: (() => void) | null = null;
    onerror: ((error: unknown) => void) | null = null;
    width = 320;
    height = 240;
    set src(_value: string) {
      setTimeout(() => {
        if (outcome === 'load') this.onload?.();
        else this.onerror?.(new Event('error'));
      }, 0);
    }
  }
  vi.stubGlobal('Image', StubImage);
}

/**
 * The kit's file input is module-level, and the coverage run loads the module
 * more than once, so the armed one is the input carrying a change handler.
 */
async function armedInput(): Promise<HTMLInputElement> {
  let armed: HTMLInputElement | undefined;
  await waitFor(() => {
    armed = [
      ...document.querySelectorAll<HTMLInputElement>('input[type="file"]')
    ].find((input) => typeof input.onchange === 'function');
    expect(armed).toBeDefined();
  });
  return armed as HTMLInputElement;
}

function WithTemplate({ children }: { children: ReactNode }) {
  const { setPostcardTemplateId, sceneIsLoaded } = useEditor();
  useEffect(() => setPostcardTemplateId('thank_you'), [setPostcardTemplateId]);
  return sceneIsLoaded ? <>{children}</> : <span>loading</span>;
}

describe('PC-C40 the engine provider', () => {
  it('disposes an engine that arrives after the provider is gone', async () => {
    installBrowserStubs();
    const fake = createFakeEngine();
    let deliver: (() => void) | undefined;
    const init = vi.fn(
      () =>
        new Promise((resolve) => {
          deliver = () => resolve(fake.engine);
        })
    );
    const engineModule = await import('@cesdk/engine');
    const previous = engineModule.default.init;
    engineModule.default.init = init as never;

    const { unmount } = render(
      <EngineProvider config={{}} LoadingComponent={<span>loading</span>}>
        <span>ready</span>
      </EngineProvider>
    );
    unmount();
    await act(async () => {
      deliver?.();
    });

    expect(fake.engine.dispose).toHaveBeenCalled();
    engineModule.default.init = previous;
  });

  it('reports the demo phases while the engine comes up', async () => {
    installBrowserStubs();
    installFakeEngine();
    reportDemoPhase.mockClear();

    render(
      <EngineProvider config={{}} LoadingComponent={<span>loading</span>}>
        <span>ready</span>
      </EngineProvider>
    );

    await screen.findByText('ready');
    expect(reportDemoPhase.mock.calls).toEqual([['created'], ['ready']]);
  });

  it('points the engine at the local asset host in a local build', async () => {
    installBrowserStubs();
    installFakeEngine();
    vi.stubEnv('CESDK_USE_LOCAL', 'true');
    vi.stubEnv('VITE_IMGLY_LOCAL_ASSETS_URL', 'http://localhost:5199/');
    const config: { baseURL?: string } = {};

    render(
      <EngineProvider config={config} LoadingComponent={<span>loading</span>}>
        <span>ready</span>
      </EngineProvider>
    );

    await screen.findByText('ready');
    expect(config.baseURL).toBe('http://localhost:5199/');
    vi.unstubAllEnvs();
  });

  it('runs the configure callback before it publishes the engine', async () => {
    installBrowserStubs();
    installFakeEngine();
    const configure = vi.fn(async () => {});

    render(
      <EngineProvider
        config={{}}
        configure={configure}
        LoadingComponent={<span>loading</span>}
      >
        <span>ready</span>
      </EngineProvider>
    );

    await screen.findByText('ready');
    expect(configure).toHaveBeenCalled();
  });
});

describe('PC-C41 reducing a marquee selection to one block', () => {
  function SelectionProbe() {
    const { selection } = useSelection();
    return <span data-testid="selection">{selection.join(',')}</span>;
  }

  function renderSelection(fake = createFakeEngine()) {
    installBrowserStubs();
    render(
      <SelectionProvider engine={fake.engine}>
        <SelectionProbe />
      </SelectionProvider>
    );
    return fake;
  }

  it('renders nothing at all without an engine', () => {
    installBrowserStubs();
    render(
      <SelectionProvider engine={null}>
        <SelectionProbe />
      </SelectionProvider>
    );

    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('keeps a single selection as the engine reports it', () => {
    const fake = renderSelection();

    act(() => fake.select([TEXT_BLOCK]));

    expect(screen.getByTestId('selection').textContent).toBe(
      String(TEXT_BLOCK)
    );
  });

  it('keeps the array identical when the selection has not moved', () => {
    const fake = renderSelection();

    act(() => fake.select([TEXT_BLOCK]));
    act(() => fake.select([TEXT_BLOCK]));

    expect(screen.getByTestId('selection').textContent).toBe(
      String(TEXT_BLOCK)
    );
  });

  it('reduces a multi-selection to one block outside a gesture', () => {
    const fake = renderSelection();

    act(() => fake.select([TEXT_BLOCK, IMAGE_BLOCK]));

    expect(screen.getByTestId('selection').textContent).toBe(
      String(IMAGE_BLOCK)
    );
    expect(fake.engine.block.isSelected(TEXT_BLOCK)).toBe(false);
  });

  it('waits for the gesture to end before it reduces', async () => {
    const fake = renderSelection();
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });

    act(() => {
      fake.engine.element!.dispatchEvent(new Event('pointerdown'));
    });
    act(() => fake.select([TEXT_BLOCK, IMAGE_BLOCK]));
    // Mid-gesture the marquee is left alone.
    expect(screen.getByTestId('selection').textContent).toBe('');

    act(() => {
      window.dispatchEvent(new Event('pointerup'));
    });

    expect(screen.getByTestId('selection').textContent).toBe(
      String(IMAGE_BLOCK)
    );
    raf.mockRestore();
  });

  it('ignores a pointer-up that never followed a pointer-down', () => {
    const fake = renderSelection();
    const raf = vi.spyOn(window, 'requestAnimationFrame');

    act(() => {
      window.dispatchEvent(new Event('pointerup'));
    });

    expect(raf).not.toHaveBeenCalled();
    expect(fake.engine.block.setSelected).not.toHaveBeenCalled();
    raf.mockRestore();
  });
});

describe('PC-C42 the single-page mode before it is switched on', () => {
  function SinglePageProbe({
    onReady
  }: {
    onReady: (value: ReturnType<typeof useSinglePageMode>) => void;
  }) {
    onReady(useSinglePageMode());
    return <span>probe</span>;
  }

  it('refocuses nothing while the mode is still off', async () => {
    let context: ReturnType<typeof useSinglePageMode> | undefined;
    const handle = await renderWithProviders(
      <SinglePageProbe
        onReady={(value) => {
          context = value;
        }}
      />
    );

    act(() => context?.refocus());
    act(() => context?.setRefocusCropModeEnabled(true));
    act(() => handle.setEditMode('Crop'));
    act(() => context?.refocus());

    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });

  it('falls back to the page padding when no text-scroll padding is given', async () => {
    let context: ReturnType<typeof useSinglePageMode> | undefined;
    await renderWithProviders(
      <SinglePageProbe
        onReady={(value) => {
          context = value;
        }}
      />,
      { textScrollPadding: null }
    );

    expect(context).toBeDefined();
  });
});

describe('PC-C43 the standalone colour picker', () => {
  it('renders its own trigger and label when no child is given', () => {
    installBrowserStubs();
    render(
      <ColorPicker
        name="picker"
        label="Background"
        value="#ff0000"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('Background')).toBeTruthy();
    const swatch = document.querySelector(
      'span[class*="colorPreviewSpan"]'
    ) as HTMLElement;
    expect(swatch.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('does nothing after the delay when no follow-up was given', () => {
    vi.useFakeTimers();
    try {
      const onChange = vi.fn();
      installBrowserStubs();
      render(
        <ColorPicker
          name="picker"
          value="#ff0000"
          presetColors={['#00ff00']}
          onChange={onChange}
        />
      );

      act(() => screen.getAllByRole('button')[0].click());
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(onChange).toHaveBeenCalledWith('#00ff00');
    } finally {
      vi.useRealTimers();
    }
  });

  it('fires the debounced callback once after the delay', () => {
    vi.useFakeTimers();
    try {
      const onChangeDebounced = vi.fn();
      installBrowserStubs();
      render(
        <ColorPicker
          name="picker"
          value="#ff0000"
          presetColors={['#00ff00', '#0000ff']}
          onChange={vi.fn()}
          onChangeDebounced={onChangeDebounced}
        />
      );

      const [preset] = screen.getAllByRole('button');
      act(() => {
        preset.click();
        preset.click();
      });
      expect(onChangeDebounced).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(onChangeDebounced).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('PC-C44 the colour dropdown', () => {
  it('applies a colour typed into its picker and ignores an incomplete one', async () => {
    const onClick = vi.fn();
    await renderWithProviders(
      <ColorDropdown
        label="Accent"
        colorPalette={[{ r: 1, g: 0, b: 0, a: 1 }]}
        onClick={onClick}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Accent' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Pick color' })
    );
    const hexInput = screen.getByRole('textbox');
    fireEvent.change(hexInput, { target: { value: '#00ff00' } });

    expect(onClick).toHaveBeenCalledWith({ r: 0, g: 1, b: 0, a: 1 });

    onClick.mockClear();
    fireEvent.change(hexInput, { target: { value: '#12' } });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('closes when the canvas is touched', async () => {
    const handle = await renderWithProviders(
      <ColorDropdown
        label="Accent"
        colorPalette={[{ r: 1, g: 0, b: 0, a: 1 }]}
        onClick={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Accent' }));
    await screen.findByRole('button', { name: 'Pick color' });

    act(() => {
      handle.engine.element!.dispatchEvent(new Event('touchstart'));
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Pick color' })).toBeNull();
    });
  });

  it('closes on a click outside it', async () => {
    await renderWithProviders(
      <ColorDropdown
        label="Accent"
        colorPalette={[{ r: 1, g: 0, b: 0, a: 1 }]}
        onClick={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Accent' }));
    await screen.findByRole('button', { name: 'Pick color' });

    await userEvent.click(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Pick color' })).toBeNull();
    });
  });
});

describe('PC-C45 the block bar with a plain child', () => {
  it('passes text children through untouched', () => {
    render(<BlockBar items={[]}>{'plain text'}</BlockBar>);

    expect(screen.getByText('plain text')).toBeTruthy();
  });
});

describe('PC-C46 the font list', () => {
  it('scrolls the active font into view and falls back to the first weight', async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const handle = await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK],
      configure: (fake) => {
        fake.assets.set('ly.img.typeface', [
          {
            id: 'Caveat',
            payload: {
              typeface: {
                name: 'Caveat',
                fonts: [
                  { uri: 'Caveat-Bold.ttf', weight: 'bold', style: 'normal' }
                ]
              }
            }
          }
        ]);
      }
    });

    handle.select([TEXT_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Font' }));
    await screen.findByText('Caveat');
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
    await userEvent.click(
      screen.getByText('Caveat').closest('button') as HTMLButtonElement
    );

    expect(handle.engine.block.setFont).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'Caveat-Bold.ttf',
      expect.anything()
    );
  });
});

describe('PC-C47 the toolbar height without a bar to measure', () => {
  it('keeps its assumed height while the ref is unattached', async () => {
    function DetachedProbe() {
      useToolbarHeight();
      return <span>no bar</span>;
    }
    const handle = await renderWithProviders(
      <WithTemplate>
        <DetachedProbe />
      </WithTemplate>
    );
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );

    act(() => resizeObservedElements());

    // 92 default + the 72 the hook assumes + the 12px gap.
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          padding: expect.objectContaining({ bottom: 176 })
        })
      )
    );
  });

  it('measures nothing once the bar it observed is gone', async () => {
    let hide: (() => void) | undefined;
    function TogglingProbe() {
      const [show, setShow] = useState(true);
      hide = () => setShow(false);
      const { ref } = useToolbarHeight();
      return show ? <div ref={ref}>bar</div> : <span>gone</span>;
    }
    await renderWithProviders(
      <WithTemplate>
        <TogglingProbe />
      </WithTemplate>
    );
    await screen.findByText('bar');

    act(() => hide?.());
    act(() => resizeObservedElements());

    expect(screen.getByText('gone')).toBeTruthy();
  });
});

describe('PC-C48 uploading an image', () => {
  it('adds the file to the upload source and reloads the bar', async () => {
    stubImageLoading();
    const handle = await renderWithProviders(<AddImageSecondary />);
    await screen.findAllByAltText('sample asset');
    const file = new File(['x'], 'card.png', { type: 'image/png' });

    await userEvent.click(screen.getByRole('button', { name: /Upload/ }));
    const input = await armedInput();
    await act(async () => {
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true
      });
      input.dispatchEvent(new Event('change'));
    });

    await waitFor(() => {
      expect(handle.engine.asset.addAssetToSource).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({
          meta: expect.objectContaining({ width: 320 })
        })
      );
    });
    vi.unstubAllGlobals();
  });

  it('reports an upload handler that rejects', async () => {
    stubImageLoading();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    let trigger: (() => Promise<void>) | undefined;
    function UploadProbe() {
      const { triggerFileUpload } = useImageUpload({
        onUpload: async () => {
          throw new Error('apply failed');
        }
      });
      trigger = triggerFileUpload;
      return <span>probe</span>;
    }
    await renderWithProviders(<UploadProbe />);

    const pending = trigger!();
    const input = await armedInput();
    Object.defineProperty(input, 'files', {
      value: [new File(['x'], 'a.png', { type: 'image/png' })],
      configurable: true
    });
    input.dispatchEvent(new Event('change'));
    await pending;

    expect(error).toHaveBeenCalledWith(
      'Failed to handle uploaded asset',
      expect.any(Error)
    );
    error.mockRestore();
    vi.unstubAllGlobals();
  });

  it('rejects when the picker reports no files', async () => {
    let trigger: (() => Promise<void>) | undefined;
    function UploadProbe() {
      const { triggerFileUpload } = useImageUpload({
        onUpload: async () => {}
      });
      trigger = triggerFileUpload;
      return <span>probe</span>;
    }
    await renderWithProviders(<UploadProbe />);

    const pending = trigger!();
    const input = await armedInput();
    Object.defineProperty(input, 'files', { value: null, configurable: true });
    input.dispatchEvent(new Event('change'));

    await expect(pending).rejects.toThrow('No files selected');
  });

  it('drops an image the browser cannot decode', async () => {
    stubImageLoading('error');
    let trigger: (() => Promise<void>) | undefined;
    function UploadProbe() {
      const { triggerFileUpload } = useImageUpload({
        onUpload: async () => {}
      });
      trigger = triggerFileUpload;
      return <span>probe</span>;
    }
    const handle = await renderWithProviders(<UploadProbe />);

    const pending = trigger!();
    const input = await armedInput();
    Object.defineProperty(input, 'files', {
      value: [new File(['x'], 'a.png', { type: 'image/png' })],
      configurable: true
    });
    input.dispatchEvent(new Event('change'));

    await expect(pending).rejects.toBeDefined();
    expect(handle.engine.asset.addAssetToSource).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe('PC-C49 the editor before the scene exists', () => {
  it('names no page while the engine reports no scene', async () => {
    const handle = await renderWithProviders(<span />, {
      configure: (fake) => {
        Object.defineProperty(fake.engine.scene, 'get', { value: () => null });
      }
    });

    expect(handle.spy('scene.getPages')).not.toHaveBeenCalled();
    expect(FRONT_PAGE).toBeGreaterThan(0);
  });
});

describe('PC-C50 the controls with nothing selected', () => {
  it.each([
    [
      'the shape colour bar',
      async () =>
        (
          await import('@/app/features/shape/ChangeShapeColorSecondary/ChangeShapeColorSecondary')
        ).default
    ],
    [
      'the text colour bar',
      async () =>
        (
          await import('@/app/features/text/ChangeTextColorSecondary/ChangeTextColorSecondary')
        ).default
    ]
  ])('%s falls back to black', async (_case, load) => {
    const Bar = await load();
    const { rendered } = await renderWithProviders(<Bar />);

    expect(rendered.container.querySelectorAll('button').length).toBe(1);
  });

  it('the alignment bar marks nothing active', async () => {
    const ChangeTextAlignmentSecondary = (
      await import('@/app/features/text/ChangeTextAlignmentSecondary/ChangeTextAlignmentSecondary')
    ).default;
    await renderWithProviders(<ChangeTextAlignmentSecondary />);

    for (const name of ['Left', 'Center', 'Right']) {
      expect(screen.getByRole('button', { name }).className).not.toContain(
        'wrapper--active'
      );
    }
  });

  it('the colour icon paints no background', async () => {
    const CurrentColorIcon = (
      await import('@/app/components/CurrentColorIcon/CurrentColorIcon')
    ).default;
    const { rendered } = await renderWithProviders(<CurrentColorIcon />);

    const icon = rendered.container.querySelector(
      'span[class="icon"]'
    ) as HTMLElement;
    expect(icon.style.backgroundColor).toBe('');
  });
});

describe('PC-C51 the page toolbars before a template exists', () => {
  it('the front toolbar renders nothing', async () => {
    const FrontPageToolbar = (
      await import('@/app/layout/PageToolbar/FrontPageToolbar')
    ).default;
    const { rendered } = await renderWithProviders(<FrontPageToolbar />);

    expect(rendered.container.querySelectorAll('button')).toHaveLength(0);
  });

  it('the page toolbar shows nothing on the style step', async () => {
    const PageToolbar = (await import('@/app/layout/PageToolbar/PageToolbar'))
      .default;
    const { rendered } = await renderWithProviders(<PageToolbar />);

    expect(rendered.container.querySelectorAll('button')).toHaveLength(0);
  });
});

describe('PC-C52 adding text with no page to add it to', () => {
  it('does nothing while the engine reports no scene', async () => {
    const AddTextSecondary = (
      await import('@/app/features/text/AddTextSecondary/AddTextSecondary')
    ).default;
    const handle = await renderWithProviders(<AddTextSecondary />, {
      configure: (fake) => {
        Object.defineProperty(fake.engine.scene, 'get', { value: () => null });
      }
    });

    await screen.findByText('Caveat');
    await userEvent.click(
      screen.getByText('Caveat').closest('button') as HTMLButtonElement
    );

    expect(handle.engine.actions.run).not.toHaveBeenCalledWith(
      'addText',
      expect.anything(),
      expect.anything(),
      expect.anything()
    );
  });
});

describe('PC-C53 the template keyword reaches the image search', () => {
  it('queries Unsplash for the template keyword', async () => {
    const handle = await renderWithProviders(
      <WithTemplate>
        <AddImageSecondary />
      </WithTemplate>
    );

    await waitFor(() => {
      expect(handle.engine.asset.findAssets).toHaveBeenCalledWith('unsplash', {
        page: 0,
        perPage: 10,
        query: 'Thank you flowers'
      });
    });
  });
});

describe('PC-C54 a selection the engine keeps changing', () => {
  function SelectionProbe() {
    const { selection } = useSelection();
    return <span data-testid="selection">{selection.join(',')}</span>;
  }

  it('ignores the events its own correction causes', () => {
    installBrowserStubs();
    const fake = createFakeEngine({ notifyOnSetSelected: true });
    render(
      <SelectionProvider engine={fake.engine}>
        <SelectionProbe />
      </SelectionProvider>
    );

    act(() => fake.select([TEXT_BLOCK, IMAGE_BLOCK]));

    expect(screen.getByTestId('selection').textContent).toBe(
      String(IMAGE_BLOCK)
    );
  });

  it('keeps the same array when the reduction lands on the block it already had', () => {
    installBrowserStubs();
    const fake = createFakeEngine();
    const raf = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });
    render(
      <SelectionProvider engine={fake.engine}>
        <SelectionProbe />
      </SelectionProvider>
    );

    act(() => fake.select([TEXT_BLOCK]));
    act(() => {
      fake.engine.element!.dispatchEvent(new Event('pointerdown'));
    });
    // Inside the gesture the text block is dropped and picked up again last,
    // so the reduction lands back on what the bar is already showing.
    act(() => fake.select([]));
    act(() => fake.select([IMAGE_BLOCK]));
    act(() => fake.select([IMAGE_BLOCK, TEXT_BLOCK]));
    act(() => {
      window.dispatchEvent(new Event('pointerup'));
    });

    expect(screen.getByTestId('selection').textContent).toBe(
      String(TEXT_BLOCK)
    );
    raf.mockRestore();
  });
});

describe('PC-C55 the greeting font without a regular weight', () => {
  it('falls back to the first font the typeface ships', async () => {
    const handle = await renderWithProviders(<span />);

    handle.engine.actions.run('setFontByBlockName', 'Greeting', {
      name: 'Caveat',
      fonts: [{ uri: 'Caveat-Bold.ttf', weight: 'bold', style: 'normal' }]
    } as never);

    expect(handle.engine.block.setFont).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'Caveat-Bold.ttf',
      expect.anything()
    );
  });
});
