import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const initializeProviders = vi.fn(async () => ({
  panel: { builderRenderFunction: () => {} }
}));

vi.mock('@imgly/plugin-ai-generation-web', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@imgly/plugin-ai-generation-web')>()),
  initializeProviders,
  CommonProperties: { StyleTransfer: vi.fn(() => ({})) }
}));

const { AiPhotoEditConfig } =
  await import('../../src/imgly/plugins/ai-photo-edit');

interface ButtonOptions {
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function fakeCesdk({ panelOpen = false } = {}) {
  const calls: { path: string; args: unknown[] }[] = [];
  const components = new Map<string, (context: never) => void>();
  const record =
    (path: string) =>
    (...args: unknown[]) => {
      calls.push({ path, args });
    };
  const cesdk = {
    feature: { enable: record('feature.enable'), set: record('feature.set') },
    i18n: { setTranslations: record('i18n.setTranslations') },
    engine: {
      scene: { getCurrentPage: () => null },
      block: { getFill: () => 1, getSourceSet: () => [], getString: () => '' }
    },
    ui: {
      registerPanel: record('ui.registerPanel'),
      registerComponent: (id: string, render: (context: never) => void) => {
        calls.push({ path: 'ui.registerComponent', args: [id] });
        components.set(id, render);
      },
      insertOrderComponent: record('ui.insertOrderComponent'),
      isPanelOpen: () => panelOpen,
      openPanel: record('ui.openPanel'),
      closePanel: record('ui.closePanel')
    }
  };
  return {
    cesdk: cesdk as unknown as CreativeEditorSDK,
    calls,
    components,
    pathsOf: () => calls.map((call) => call.path)
  };
}

/** The provider the factory hands back, in the shape the kit rewires. */
function provider() {
  const panel: Record<string, unknown> = { type: 'schema' };
  Object.defineProperty(panel, 'renderCustomProperty', {
    configurable: true,
    get: () => ({}),
    set: () => {}
  });
  return { id: 'vendor/model', input: { panel }, output: {} };
}

beforeEach(() => {
  initializeProviders.mockClear();
});

describe('AIE-U29 the AI photo-edit plugin', () => {
  it('AIE-U29 does nothing without an editor', async () => {
    await new AiPhotoEditConfig({ image2image: [vi.fn()] }).initialize(
      {} as never
    );

    expect(initializeProviders).not.toHaveBeenCalled();
  });

  it('AIE-U29 does nothing without an image-to-image provider', async () => {
    const host = fakeCesdk();

    await new AiPhotoEditConfig({}).initialize({
      cesdk: host.cesdk
    } as never);

    expect(host.calls).toEqual([]);
  });

  it('AIE-U29 registers the panel, the dock entry and its translations', async () => {
    const host = fakeCesdk();

    await new AiPhotoEditConfig({
      image2image: [async () => provider() as never]
    }).initialize({ cesdk: host.cesdk } as never);

    expect(host.pathsOf()).toEqual([
      'feature.set',
      'i18n.setTranslations',
      'ui.registerPanel',
      'ui.registerComponent',
      'ui.insertOrderComponent'
    ]);
    expect(host.calls[0].args).toEqual([
      'ly.img.plugin-ai-image-generation-web.providerSelect',
      true
    ]);
  });

  it('AIE-U29 leaves the panel unregistered when the provider renders none', async () => {
    initializeProviders.mockResolvedValueOnce({ panel: {} } as never);
    const host = fakeCesdk();

    await new AiPhotoEditConfig({
      image2image: [async () => provider() as never]
    }).initialize({ cesdk: host.cesdk } as never);

    expect(host.pathsOf()).not.toContain('ui.registerPanel');
  });

  it.each([
    ['opens the panel', false, 'ui.openPanel'],
    ['closes the panel', true, 'ui.closePanel']
  ])('AIE-U29 the dock button %s', async (_case, panelOpen, expected) => {
    const host = fakeCesdk({ panelOpen });
    await new AiPhotoEditConfig({
      image2image: [async () => provider() as never]
    }).initialize({ cesdk: host.cesdk } as never);

    let options: ButtonOptions | undefined;
    host.components.get('ly.img.ai.photoeditor.dock')!({
      builder: {
        Button: (_key: string, given: ButtonOptions) => {
          options = given;
        }
      }
    } as never);
    options!.onClick();

    expect(options!.isSelected).toBe(panelOpen);
    expect(host.pathsOf()).toContain(expected);
  });
});
