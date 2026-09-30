// @vitest-environment jsdom
import {
  fireEvent,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@cesdk/engine',
  async () => (await import('./support/engine-mock')).cesdkEngineModule
);

const { renderWithProviders } = await import('./support/render');
const { PAGE_A, imageAsset } = await import('./support/fake-engine');
const AddBlockBar = (await import('../../src/app/ui/AddBlockBar/AddBlockBar'))
  .default;

class ImageStub {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 320;
  height = 240;
  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}

beforeEach(() => {
  vi.stubGlobal('Image', ImageStub);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function renderBlockBar() {
  const handle = await renderWithProviders(<AddBlockBar />);
  await screen.findByRole('button', { name: 'Text' });
  return handle;
}

describe('PB-C30 the block bar', () => {
  it('offers text, image, shape and sticker', async () => {
    await renderBlockBar();
    expect(
      screen
        .getAllByRole('button')
        .map((button) => button.textContent)
        .filter(Boolean)
    ).toEqual(['Text', 'Image', 'Shape', 'Sticker']);
  });
});

describe('PB-C31 adding text', () => {
  it('lists only the typefaces this kit curates', async () => {
    const handle = await renderBlockBar();
    handle.assets.set('ly.img.typeface', [
      {
        id: 'Caveat',
        payload: {
          typeface: {
            name: 'Caveat',
            fonts: [{ uri: 'a.ttf', weight: 'normal', style: 'normal' }]
          }
        }
      },
      {
        id: 'Roboto',
        payload: {
          typeface: {
            name: 'Roboto',
            fonts: [{ uri: 'b.ttf', weight: 'normal', style: 'normal' }]
          }
        }
      }
    ]);

    await userEvent.click(screen.getByRole('button', { name: 'Text' }));

    expect(handle.engine.asset.findAssets).toHaveBeenCalledWith(
      'ly.img.typeface',
      { page: 0, perPage: 100, query: '' }
    );
    expect(await screen.findByRole('button', { name: /Caveat/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Roboto/ })).toBeNull();
  });

  it('creates a centred, half-page-wide text block in the picked typeface', async () => {
    const { engine } = await renderBlockBar();

    await userEvent.click(screen.getByRole('button', { name: 'Text' }));
    await userEvent.click(
      await screen.findByRole('button', { name: /Caveat/ })
    );

    const created = (engine.block.create as ReturnType<typeof vi.fn>).mock
      .results[0].value;
    expect(engine.block.create).toHaveBeenCalledWith('text');
    expect(engine.block.setFont).toHaveBeenCalledWith(
      created,
      'Caveat-Regular.ttf',
      expect.objectContaining({ name: 'Caveat' })
    );
    expect(engine.block.setFloat).toHaveBeenCalledWith(
      created,
      'text/fontSize',
      40
    );
    expect(engine.block.setEnum).toHaveBeenCalledWith(
      created,
      'text/horizontalAlignment',
      'Center'
    );
    expect(engine.block.setHeightMode).toHaveBeenCalledWith(created, 'Auto');
    expect(engine.block.setWidth).toHaveBeenCalledWith(created, 400);
    expect(engine.block.appendChild).toHaveBeenCalledWith(PAGE_A, created);
    expect(engine.block.setSelected).toHaveBeenCalledWith(created, true);
  });

  it('falls back to the first font when the typeface has no regular cut', async () => {
    const handle = await renderBlockBar();
    handle.assets.set('ly.img.typeface', [
      {
        id: 'Coiny',
        payload: {
          typeface: {
            name: 'Coiny',
            fonts: [{ uri: 'Coiny-Bold.ttf', weight: 'bold', style: 'normal' }]
          }
        }
      }
    ]);

    await userEvent.click(screen.getByRole('button', { name: 'Text' }));
    await userEvent.click(await screen.findByRole('button', { name: /Coiny/ }));

    expect(handle.engine.block.setFont).toHaveBeenCalledWith(
      expect.any(Number),
      'Coiny-Bold.ttf',
      expect.objectContaining({ name: 'Coiny' })
    );
  });
});

describe('PB-C32 adding an image', () => {
  it('shows the uploaded images and applies the one the user picks', async () => {
    const { engine } = await renderBlockBar();

    await userEvent.click(screen.getByRole('button', { name: 'Image' }));
    const thumb = await screen.findByRole('button', { name: 'sample asset' });
    await userEvent.click(thumb);

    expect(engine.asset.findAssets).toHaveBeenCalledWith(
      'ly.img.image.upload',
      { page: 0, perPage: 9999 }
    );
    await waitFor(() => {
      expect(engine.asset.apply).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({ id: 'upload-1' })
      );
    });
  });

  it('queries Unsplash as well once that source is registered', async () => {
    const handle = await renderBlockBar();
    handle.assets.set('unsplash', [imageAsset('unsplash-1')]);

    await userEvent.click(screen.getByRole('button', { name: 'Image' }));

    await waitFor(() => {
      expect(handle.engine.asset.findAssets).toHaveBeenCalledWith('unsplash', {
        page: 0,
        perPage: 10,
        query: 'Disneyland'
      });
    });
  });

  it('shows the spinner until the images arrive', async () => {
    const handle = await renderBlockBar();
    handle.assets.set('ly.img.image.upload', []);

    await userEvent.click(screen.getByRole('button', { name: 'Image' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'sample asset' })).toBeNull();
    });
    expect(screen.getByRole('button', { name: 'Upload' })).toBeTruthy();
  });
});

describe('PB-C32b the image thumbnails', () => {
  it('disables a thumbnail while its asset is being applied', async () => {
    const ImagesBar = (await import('../../src/app/ui/ImageBar/ImageBar'))
      .default;
    let finish: () => void = () => {};
    const onClick = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    await renderWithProviders(<ImagesBar onClick={onClick} />);

    const thumb = await screen.findByRole('button', { name: 'sample asset' });
    await userEvent.click(thumb);

    await waitFor(() =>
      expect((thumb as HTMLButtonElement).disabled).toBe(true)
    );
    expect(thumb.querySelector('img')?.className).toContain('image--loading');
    finish();
    await waitFor(() =>
      expect((thumb as HTMLButtonElement).disabled).toBe(false)
    );
  });

  it('reloads the list after an upload replaces it', async () => {
    const ImagesBar = (await import('../../src/app/ui/ImageBar/ImageBar'))
      .default;
    const handle = await renderWithProviders(
      <ImagesBar onClick={vi.fn(async () => {})} />
    );
    await screen.findByRole('button', { name: 'sample asset' });
    (handle.engine.asset.findAssets as ReturnType<typeof vi.fn>).mockClear();

    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'photo.png', { type: 'image/png' })] }
    });

    await waitFor(() => {
      expect(handle.engine.asset.findAssets).toHaveBeenCalledWith(
        'ly.img.image.upload',
        { page: 0, perPage: 9999 }
      );
    });
  });
});

describe('PB-C33 uploading an image', () => {
  it('registers the picked file with the upload source and applies it', async () => {
    const { engine } = await renderBlockBar();

    await userEvent.click(screen.getByRole('button', { name: 'Image' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Upload' })
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input.getAttribute('accept')).toBe('image/png');
    expect(input.getAttribute('multiple')).toBe('true');

    fireEvent.change(input, {
      target: { files: [new File(['x'], 'photo.png', { type: 'image/png' })] }
    });

    await waitFor(() => {
      expect(engine.asset.addAssetToSource).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({
          meta: expect.objectContaining({
            kind: 'image',
            width: 320,
            height: 240
          })
        })
      );
    });
    await waitFor(() => {
      expect(engine.asset.apply).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({ active: false })
      );
    });
  });
});

describe('PB-C33b an image the browser cannot decode', () => {
  it('reports the failure instead of registering a broken asset', async () => {
    const { renderHook } = await import('@imgly/kit-test-harness/component');
    const { useImageUpload } =
      await import('../../src/app/contexts/UseImageUpload');
    const { EngineProvider } =
      await import('../../src/app/contexts/EngineContext');
    const { installFakeEngine } = await import('./support/engine-mock');

    class BrokenImage {
      onload: (() => void) | null = null;
      onerror: ((error: unknown) => void) | null = null;
      set src(_value: string) {
        queueMicrotask(() => this.onerror?.(new Error('decode failed')));
      }
    }
    vi.stubGlobal('Image', BrokenImage);
    const handle = installFakeEngine();
    const { result } = renderHook(() => useImageUpload({ onUpload: vi.fn() }), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <EngineProvider config={{}} LoadingComponent={<span>loading</span>}>
          {children}
        </EngineProvider>
      )
    });
    await waitFor(() => expect(result.current).toBeDefined());

    const pending = result.current.triggerFileUpload();
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await waitFor(() => expect(input.getAttribute('accept')).toBe('image/png'));
    fireEvent.change(input, {
      target: { files: [new File(['x'], 'photo.png', { type: 'image/png' })] }
    });

    await expect(pending).rejects.toBeDefined();
    expect(handle.engine.asset.addAssetToSource).not.toHaveBeenCalled();
  });
});

describe('PB-C33c a file dialog that hands back nothing', () => {
  it('reports that no file was selected', async () => {
    const { renderHook } = await import('@imgly/kit-test-harness/component');
    const { useImageUpload } =
      await import('../../src/app/contexts/UseImageUpload');
    const { EngineProvider } =
      await import('../../src/app/contexts/EngineContext');
    const { installFakeEngine } = await import('./support/engine-mock');
    installFakeEngine();

    const { result } = renderHook(() => useImageUpload({ onUpload: vi.fn() }), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <EngineProvider config={{}} LoadingComponent={<span>loading</span>}>
          {children}
        </EngineProvider>
      )
    });
    await waitFor(() => expect(result.current).toBeDefined());

    const pending = result.current.triggerFileUpload();
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await waitFor(() => expect(input.getAttribute('accept')).toBe('image/png'));
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: null
    });
    input.dispatchEvent(new Event('change'));

    await expect(pending).rejects.toThrow('No files selected');
  });
});

describe('PB-C34 adding a shape and a sticker', () => {
  it.each([
    ['Shape', 'ly.img.vector.shape', 'Add shape 0', 'shape-1'],
    ['Sticker', 'ly.img.sticker', 'Add sticker 0', 'sticker-1']
  ])(
    'queries %s from its own source and applies it',
    async (tab, sourceId, thumbName, assetId) => {
      const { engine } = await renderBlockBar();

      await userEvent.click(screen.getByRole('button', { name: tab }));
      await userEvent.click(
        await screen.findByRole('button', { name: thumbName })
      );

      expect(engine.asset.findAssets).toHaveBeenCalledWith(sourceId, {
        page: 0,
        perPage: 999
      });
      expect(engine.asset.apply).toHaveBeenCalledWith(
        'ly.img.image.upload',
        expect.objectContaining({ id: assetId })
      );
    }
  );
});
