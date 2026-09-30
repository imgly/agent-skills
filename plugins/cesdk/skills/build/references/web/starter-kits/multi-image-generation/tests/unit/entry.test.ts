// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { engineStub } = vi.hoisted(() => ({ engineStub: { id: 'engine' } }));

const render = vi.fn();
const createRoot = vi.fn(() => ({ render }));
const initMultiImageGenerationHeadlessEngine = vi.fn(async () => engineStub);
const registerMultiImageGenerationAssetSources = vi.fn(async () => undefined);

vi.mock('react-dom/client', () => ({ createRoot }));
vi.mock('../../src/imgly', () => ({
  initMultiImageGenerationHeadlessEngine,
  registerMultiImageGenerationAssetSources
}));
vi.mock('../../src/app/App', () => ({ default: () => null }));

describe('MIG-U11 src/index.tsx', () => {
  beforeEach(() => {
    vi.resetModules();
    createRoot.mockClear();
    render.mockClear();
    initMultiImageGenerationHeadlessEngine.mockClear();
    initMultiImageGenerationHeadlessEngine.mockResolvedValue(engineStub);
    registerMultiImageGenerationAssetSources.mockClear();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    delete (window as { engine?: unknown }).engine;
  });

  it('boots the headless engine, registers its asset sources and renders the app', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);

    await import('../../src/index');
    await vi.waitFor(() => expect(render).toHaveBeenCalledTimes(1));

    expect(registerMultiImageGenerationAssetSources).toHaveBeenCalledWith(
      engineStub
    );
    expect(createRoot).toHaveBeenCalledWith(container);
    expect((window as { engine?: unknown }).engine).toBe(engineStub);
  });

  it('reports a failed start-up instead of leaving an unhandled rejection', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await import('../../src/index');
    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledTimes(1));

    const [message, error] = consoleError.mock.calls[0] as [string, Error];
    expect(message).toBe('Failed to initialize application:');
    expect(error.message).toBe('Root container not found');
    expect(createRoot).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
