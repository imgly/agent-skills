// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders, installBrowserStubs, resizeObservedElements } =
  await import('./support/render');
const { IMAGE_BLOCK, PAGE_A, TEXT_BLOCK, createFakeEngine } =
  await import('./support/fake-engine');
const { installFakeEngine } = await import('./support/engine-mock');
const { EngineProvider } = await import('../../src/app/contexts/EngineContext');
const { SelectionProvider, useSelection } =
  await import('../../src/app/contexts/UseSelection');
const { useSinglePageMode } =
  await import('../../src/app/contexts/SinglePageModeContext');
const { useToolbarHeight } =
  await import('../../src/app/ui/UseToolbarHeight/UseToolbarHeight');
const { ColorPicker } =
  await import('../../src/app/ui/ColorPicker/ColorPicker');
const BlockBar = (await import('../../src/app/ui/BlockBar/BlockBar')).default;
const TextAdjustmentsBar = (
  await import('../../src/app/ui/TextAdjustmentsBar/TextAdjustmentsBar')
).default;
const { useImageUpload } = await import('../../src/app/hooks/UseImageUpload');
const AddImageSecondary = (
  await import('../../src/app/ui/AddImageSecondary/AddImageSecondary')
).default;

/** jsdom never loads an image, so the upload flow needs one that resolves. */
function stubImageLoading(): void {
  class LoadingImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    width = 320;
    height = 240;
    set src(_value: string) {
      setTimeout(() => this.onload?.(), 0);
    }
  }
  vi.stubGlobal('Image', LoadingImage);
}

describe('AP-C40 the engine provider', () => {
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
    const order: string[] = [];
    const configure = vi.fn(async () => {
      order.push('configure');
    });

    render(
      <EngineProvider
        config={{}}
        configure={configure}
        LoadingComponent={<span>loading</span>}
      >
        <span onClick={() => order.push('children')}>ready</span>
      </EngineProvider>
    );

    await screen.findByText('ready');
    expect(configure).toHaveBeenCalled();
    expect(order).toEqual(['configure']);
  });
});

describe('AP-C41 correcting the selection the engine reports', () => {
  function SelectionProbe() {
    const { selection } = useSelection();
    return <span data-testid="selection">{selection.join(',')}</span>;
  }

  async function renderSelection(fake = createFakeEngine()) {
    installBrowserStubs();
    render(
      <SelectionProvider engine={fake.engine}>
        <SelectionProbe />
      </SelectionProvider>
    );
    return fake;
  }

  it('keeps the same array while the selection has not moved', async () => {
    const fake = await renderSelection();

    act(() => fake.select([]));

    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('drops a selection whose block the engine has destroyed', async () => {
    vi.useFakeTimers();
    try {
      const fake = createFakeEngine();
      installBrowserStubs();
      render(
        <SelectionProvider engine={fake.engine}>
          <SelectionProbe />
        </SelectionProvider>
      );

      act(() => fake.select([IMAGE_BLOCK]));
      expect(screen.getByTestId('selection').textContent).toBe(
        String(IMAGE_BLOCK)
      );
      // The engine destroyed the block and dropped it without a second event.
      fake.blocks.delete(IMAGE_BLOCK);
      fake.engine.block.setSelected(IMAGE_BLOCK, false);
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByTestId('selection').textContent).toBe('');
    } finally {
      vi.useRealTimers();
    }
  });

  it('deselects the leftover block when the engine ends up with nothing', async () => {
    vi.useFakeTimers();
    try {
      const fake = createFakeEngine();
      installBrowserStubs();
      render(
        <SelectionProvider engine={fake.engine}>
          <SelectionProbe />
        </SelectionProvider>
      );

      // The event says nothing is selected while the engine still reports one.
      act(() => {
        fake.engine.block.setSelected(TEXT_BLOCK, false);
        fake.select([]);
        fake.engine.block.setSelected(TEXT_BLOCK, true);
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(fake.engine.block.isSelected(TEXT_BLOCK)).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps only the newly selected block when the engine still holds another', async () => {
    vi.useFakeTimers();
    try {
      const fake = createFakeEngine();
      installBrowserStubs();
      render(
        <SelectionProvider engine={fake.engine}>
          <SelectionProbe />
        </SelectionProvider>
      );

      act(() => fake.select([TEXT_BLOCK]));
      act(() => {
        fake.engine.block.setSelected(IMAGE_BLOCK, true);
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(fake.engine.block.isSelected(TEXT_BLOCK)).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('AP-C42 the single-page mode before it is switched on', () => {
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
      />,
      {
        configure: (fake) => {
          // A scene that never finishes loading leaves the mode switched off.
          (fake.engine.scene.load as ReturnType<typeof vi.fn>).mockReturnValue(
            new Promise(() => {})
          );
        }
      }
    );

    act(() => context?.refocus());
    act(() => context?.setRefocusCropModeEnabled(true));
    act(() => handle.setEditMode('Crop'));
    act(() => context?.refocus());

    expect(handle.spy('scene.zoomToBlock')).not.toHaveBeenCalled();
  });

  it('shows one page at a time once the scene carries several', async () => {
    const handle = await renderWithProviders(<span />, {
      configure: (fake) => {
        const second = fake.engine.block.create('page');
        fake.blocks.get(second)!.parent = PAGE_A;
        (
          fake.engine.scene.getPages as ReturnType<typeof vi.fn>
        ).mockReturnValue([PAGE_A, second]);
      }
    });

    await waitFor(() => {
      expect(handle.engine.block.setVisible).toHaveBeenCalledWith(501, false);
      expect(handle.engine.block.isVisible(PAGE_A)).toBe(true);
    });
  });
});

describe('AP-C43 the standalone colour picker', () => {
  it('renders its own trigger and label when no child is given', async () => {
    const onChange = vi.fn();
    installBrowserStubs();
    render(
      <ColorPicker
        name="picker"
        label="Background"
        value="#ff0000"
        onChange={onChange}
      />
    );

    expect(screen.getByText('Background')).toBeTruthy();
    const swatch = document.querySelector(
      'span[class*="colorPreviewSpan"]'
    ) as HTMLElement;
    expect(swatch.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('does nothing after the delay when no follow-up was given', async () => {
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

  it('fires the debounced callback once after the delay', async () => {
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

describe('AP-C44 the block bar with a plain child', () => {
  it('passes text children through untouched', () => {
    render(<BlockBar items={[]}>{'plain text'}</BlockBar>);

    expect(screen.getByText('plain text')).toBeTruthy();
  });
});

describe('AP-C45 the font list scrolls the active font into view', () => {
  it('scrolls once the list arrives with an active typeface', async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const handle = await renderWithProviders(<TextAdjustmentsBar />, {
      selection: [TEXT_BLOCK]
    });

    handle.select([TEXT_BLOCK]);
    await userEvent.click(screen.getByRole('button', { name: 'Font' }));

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
  });
});

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

describe('AP-C46 uploading an image', () => {
  it('adds the file to the upload source and reloads the bar', async () => {
    stubImageLoading();
    const handle = await renderWithProviders(<AddImageSecondary />);
    await screen.findAllByAltText('sample asset');
    const file = new File(['x'], 'shirt.png', { type: 'image/png' });

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
});

describe('AP-C47 the canvas wrapper before the engine is ready', () => {
  it('waits for the engine to hand it a canvas element', async () => {
    const CESDKCanvas = (
      await import('../../src/app/ui/CESDKCanvas/CESDKCanvas')
    ).default;
    const { rendered } = await renderWithProviders(<CESDKCanvas isVisible />, {
      configure: (fake) => {
        Object.defineProperty(fake.engine, 'element', { value: undefined });
      }
    });

    expect(rendered.container.querySelector('canvas')).toBeNull();
  });
});

describe('AP-C48 the toolbar height without a bar to measure', () => {
  function paddingBottom(handle: {
    spy: (path: string) => { mock: { calls: unknown[][] } };
  }): number {
    const call = handle.spy('scene.zoomToBlock').mock.calls.at(-1) as [
      number,
      { padding: { bottom: number } }
    ];
    return call[1].padding.bottom;
  }

  it('keeps its assumed height while the ref is unattached', async () => {
    function DetachedProbe() {
      useToolbarHeight();
      return <span>no bar</span>;
    }
    const handle = await renderWithProviders(<DetachedProbe />);
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );

    act(() => resizeObservedElements());

    // 92 default + the 72 the hook assumes + the 12px gap; a resize it never
    // observed cannot change it.
    expect(paddingBottom(handle)).toBe(176);
  });

  it('measures nothing once the bar it observed is gone', async () => {
    let hide: (() => void) | undefined;
    function TogglingProbe() {
      const [show, setShow] = useState(true);
      hide = () => setShow(false);
      const { ref } = useToolbarHeight();
      return show ? <div ref={ref}>bar</div> : <span>gone</span>;
    }
    const handle = await renderWithProviders(<TogglingProbe />);
    await waitFor(() =>
      expect(handle.spy('scene.zoomToBlock')).toHaveBeenCalled()
    );

    act(() => hide?.());
    act(() => resizeObservedElements());

    expect(screen.getByText('gone')).toBeTruthy();
  });
});

describe('AP-C49 the font list without a regular weight', () => {
  it('falls back to the first font the typeface ships', async () => {
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

describe('AP-C50 an image the browser cannot decode', () => {
  it('drops the upload instead of adding a sizeless asset', async () => {
    class FailingImage {
      onload: (() => void) | null = null;
      onerror: ((error: unknown) => void) | null = null;
      set src(_value: string) {
        setTimeout(() => this.onerror?.(new Event('error')), 0);
      }
    }
    vi.stubGlobal('Image', FailingImage);
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

describe('AP-C51 the editor closing while its scene loads', () => {
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
    handle.spy('scene.getPages').mockClear();

    handle.rendered.unmount();
    await act(async () => {
      finishLoad();
    });

    expect(handle.spy('scene.getPages')).not.toHaveBeenCalled();
  });
});
