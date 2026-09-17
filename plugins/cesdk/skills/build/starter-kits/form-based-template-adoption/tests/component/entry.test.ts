// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const create = vi.fn();
const initFormBasedTemplateAdoption = vi.fn();

vi.mock('@cesdk/cesdk-js', () => ({
  default: { create: (...args: unknown[]) => create(...args) }
}));
vi.mock('../../src/imgly', () => ({
  initFormBasedTemplateAdoption: (...args: unknown[]) =>
    initFormBasedTemplateAdoption(...args)
}));

const reportDemoPhase = vi.fn();

vi.mock('../../../shared/demo-preview/lifecycle', () => ({ reportDemoPhase }));

/** The entry runs at import time, so each case needs its own module instance. */
async function importEntry(): Promise<typeof import('../../src/index')> {
  vi.resetModules();
  return import('../../src/index');
}

beforeEach(() => {
  document.body.innerHTML = '<div id="cesdk_container"></div>';
  create.mockReset();
  initFormBasedTemplateAdoption.mockReset();
  reportDemoPhase.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('FTA-U25 the entry point', () => {
  it('configures the editor and loads the template scene archive', async () => {
    const load = vi.fn().mockResolvedValue(undefined);
    const cesdk = { engine: { scene: { load } } };
    create.mockResolvedValue(cesdk);

    const { DEMO_ASSETS_BASE_URL } = await importEntry();
    await vi.waitFor(() => expect(load).toHaveBeenCalled());

    expect(create).toHaveBeenCalledWith('#cesdk_container', expect.anything());
    expect(initFormBasedTemplateAdoption).toHaveBeenCalledWith(cesdk);
    expect(load).toHaveBeenCalledWith(
      `${DEMO_ASSETS_BASE_URL}/cases/form-based-template-adoption/scene/scene.scene`
    );
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['created', 'ready']);
  });

  it("falls back to the kit's own URL when the environment names none", async () => {
    vi.stubEnv('VITE_DEMO_ASSETS_BASE_URL', undefined);
    create.mockResolvedValue({
      engine: { scene: { load: vi.fn().mockResolvedValue(undefined) } }
    });

    const { DEMO_ASSETS_BASE_URL } = await importEntry();

    expect(DEMO_ASSETS_BASE_URL).toBe(
      new URL(import.meta.env.BASE_URL, window.location.href).href.replace(
        /\/$/,
        ''
      )
    );
  });

  it('logs a failed start-up instead of leaving an unhandled rejection', async () => {
    const error = new Error('no license');
    create.mockRejectedValue(error);
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});

    await importEntry();
    await vi.waitFor(() => expect(logged).toHaveBeenCalled());

    expect(logged).toHaveBeenCalledWith('Failed to initialize CE.SDK:', error);
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['failed']);
  });
});
