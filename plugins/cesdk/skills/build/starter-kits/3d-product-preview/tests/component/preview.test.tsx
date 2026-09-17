// @vitest-environment jsdom
import {
  act,
  fireEvent,
  render,
  screen
} from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The real element needs WebGL, which jsdom has not got. React renders the
// `<model-viewer>` tag as an unknown element either way.
vi.mock('@google/model-viewer', () => ({}));

import { Mockup3DPreview } from '../../src/app/Mockup3DPreview/Mockup3DPreview';

interface FakeMaterial {
  pbrMetallicRoughness?: {
    baseColorTexture?: { setTexture: (t: unknown) => void };
  };
}

const defaults = {
  mockupImageUrl: null as string | null,
  modelUrl: 'https://assets.test/t-shirt/model.glb',
  cameraOrbit: '0deg 90deg',
  baseColorTextureIndex: 1,
  isLoading: false,
  renderError: null as string | null,
  isFullscreen: false,
  onToggleFullscreen: vi.fn()
};

const viewer = () =>
  document.querySelector('model-viewer') as HTMLElement & {
    model?: { materials: FakeMaterial[] };
    createTexture?: (url: string) => Promise<unknown>;
    jumpCameraToGoal?: () => void;
    cameraOrbit?: string;
  };

const setTexture = vi.fn();

/** Give the rendered element the model-viewer API the component reaches for. */
function equipViewer(options: { fails?: boolean; withTexture?: boolean } = {}) {
  const element = viewer();
  element.createTexture = vi.fn(async () => {
    if (options.fails) throw new Error('texture decode failed');
    return { id: 'texture' };
  });
  element.jumpCameraToGoal = vi.fn();
  element.model = {
    materials: [
      {},
      options.withTexture === false
        ? {}
        : { pbrMetallicRoughness: { baseColorTexture: { setTexture } } }
    ]
  };
  return element;
}

beforeEach(() => {
  setTexture.mockClear();
  defaults.onToggleFullscreen.mockClear();
});

describe('P3D-C1 the 3D preview panel', () => {
  it('shows the spinner while a render is in flight and no error yet', () => {
    const { container } = render(
      <Mockup3DPreview {...defaults} isLoading renderError="stale" />
    );
    expect(container.querySelector('.spinner')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows the message of the last failed render once it is idle', () => {
    render(<Mockup3DPreview {...defaults} renderError="export failed" />);
    expect(screen.getByRole('alert').textContent).toContain('export failed');
  });

  it('applies the camera orbit to the element and jumps the camera', () => {
    const { rerender } = render(<Mockup3DPreview {...defaults} />);
    const element = equipViewer();
    rerender(<Mockup3DPreview {...defaults} cameraOrbit="90deg 60deg" />);
    expect(element.cameraOrbit).toBe('90deg 60deg');
    expect(element.jumpCameraToGoal).toHaveBeenCalled();
  });

  it('toggles fullscreen from the control and from Escape', async () => {
    const { rerender } = render(<Mockup3DPreview {...defaults} />);
    fireEvent.click(screen.getByTitle('View fullscreen'));
    expect(defaults.onToggleFullscreen).toHaveBeenCalledTimes(1);

    rerender(<Mockup3DPreview {...defaults} isFullscreen />);
    expect(screen.getByTitle('Exit fullscreen')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaults.onToggleFullscreen).toHaveBeenCalledTimes(2);
  });

  it('leaves the model alone for any other key and while it is not fullscreen', () => {
    render(<Mockup3DPreview {...defaults} isFullscreen />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(defaults.onToggleFullscreen).not.toHaveBeenCalled();
  });
});

describe('P3D-C2 applying the rendered texture', () => {
  it('does nothing while the model has not loaded', async () => {
    const { rerender } = render(<Mockup3DPreview {...defaults} />);
    const element = viewer();
    element.createTexture = vi.fn();
    await act(async () => {
      rerender(<Mockup3DPreview {...defaults} mockupImageUrl="blob:one" />);
    });
    expect(element.createTexture).not.toHaveBeenCalled();
  });

  it('applies the texture to the product material once the model loads', async () => {
    const { rerender } = render(
      <Mockup3DPreview {...defaults} mockupImageUrl="blob:one" />
    );
    const element = equipViewer();
    await act(async () => {
      element.dispatchEvent(new Event('load'));
    });
    expect(element.createTexture).toHaveBeenCalledWith('blob:one');
    expect(setTexture).toHaveBeenCalledWith({ id: 'texture' });

    // The url is remembered, so the next render does not apply it again.
    await act(async () => {
      rerender(<Mockup3DPreview {...defaults} mockupImageUrl="blob:one" />);
    });
    expect(setTexture).toHaveBeenCalledTimes(1);
  });

  it('ignores a material that carries no base colour texture', async () => {
    render(<Mockup3DPreview {...defaults} mockupImageUrl="blob:one" />);
    const element = equipViewer({ withTexture: false });
    await act(async () => {
      element.dispatchEvent(new Event('load'));
    });
    expect(element.createTexture).toHaveBeenCalled();
    expect(setTexture).not.toHaveBeenCalled();
  });

  it('logs a texture that cannot be created instead of failing the render', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Mockup3DPreview {...defaults} mockupImageUrl="blob:one" />);
    const element = equipViewer({ fails: true });
    await act(async () => {
      element.dispatchEvent(new Event('load'));
    });
    expect(error).toHaveBeenCalledWith(
      'Failed to apply texture:',
      expect.any(Error)
    );
  });

  it('does not reach for a texture while the model reports no image', async () => {
    render(<Mockup3DPreview {...defaults} />);
    const element = equipViewer();
    await act(async () => {
      element.dispatchEvent(new Event('load'));
    });
    expect(element.createTexture).not.toHaveBeenCalled();
  });
});
