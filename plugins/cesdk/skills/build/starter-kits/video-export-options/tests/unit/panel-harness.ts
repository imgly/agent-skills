import type CreativeEditorSDK from '@cesdk/cesdk-js';

export interface BuilderCall {
  component: string;
  id: string;
  options: Record<string, any>;
}

export interface RecordedCall {
  path: string;
  args: unknown[];
}

export interface PanelHarness {
  /** Render the panel once against `engine`, keeping the state of earlier renders. */
  render(engine: unknown): BuilderCall[];
  /** The builder calls of the last render. */
  builderCalls: BuilderCall[];
  /** Every method the plugin called on the fake editor. */
  calls: RecordedCall[];
  callsTo(path: string): RecordedCall[];
  find(component: string, id: string): BuilderCall | undefined;
  /** The `scene.onActiveChanged` callback the plugin registered. */
  onActiveChanged?: () => void;
}

export interface FakeEngineOptions {
  width: number;
  height: number;
  currentPage?: number | null;
}

/** An engine whose current page has the given laid-out size. */
export function fakeEngine({
  width,
  height,
  currentPage = 1
}: FakeEngineOptions) {
  return {
    scene: { getCurrentPage: () => currentPage },
    block: {
      getFrameWidth: () => width,
      getFrameHeight: () => height
    }
  };
}

export interface HarnessOptions {
  /** Replaces `cesdk.utils.export`, so a case can control when it settles. */
  exportImpl?: (options: Record<string, unknown>) => Promise<{ blobs: Blob[] }>;
  /** Answers `cesdk.ui.isPanelOpen`. */
  isPanelOpen?: boolean;
}

/**
 * Drives `ExportVideoPanelPlugin` without an editor: it records what the plugin
 * registers, then replays the registered panel function against a fake builder
 * whose state survives between renders, the way the editor's does.
 */
export async function createPanelHarness(
  plugin: { initialize: (context: { cesdk: unknown }) => Promise<void> | void },
  options: HarnessOptions = {}
): Promise<PanelHarness> {
  const calls: RecordedCall[] = [];
  const record =
    (path: string) =>
    (...args: unknown[]) => {
      calls.push({ path, args });
    };

  const harness: PanelHarness = {
    builderCalls: [],
    calls,
    callsTo: (path) => calls.filter((call) => call.path === path),
    find: (component, id) =>
      harness.builderCalls.find(
        (call) => call.component === component && call.id === id
      ),
    render: () => {
      throw new Error('The plugin registered no panel.');
    }
  };

  let panel:
    | ((context: { builder: unknown; engine: unknown; state: unknown }) => void)
    | undefined;

  const cesdk = {
    i18n: { setTranslations: record('i18n.setTranslations') },
    engine: {
      scene: {
        onActiveChanged: (callback: () => void) => {
          calls.push({ path: 'scene.onActiveChanged', args: [] });
          harness.onActiveChanged = callback;
        }
      }
    },
    ui: {
      registerComponent: (id: string, fn: unknown) =>
        calls.push({ path: 'ui.registerComponent', args: [id, fn] }),
      registerPanel: (id: string, fn: typeof panel) => {
        calls.push({ path: 'ui.registerPanel', args: [id] });
        panel = fn;
      },
      setPanelPosition: record('ui.setPanelPosition'),
      insertOrderComponent: record('ui.insertOrderComponent'),
      openPanel: record('ui.openPanel'),
      closePanel: record('ui.closePanel'),
      isPanelOpen: () => options.isPanelOpen === true
    },
    utils: {
      export:
        options.exportImpl ??
        ((exportOptions: Record<string, unknown>) => {
          calls.push({ path: 'utils.export', args: [exportOptions] });
          return Promise.resolve({ blobs: [new Blob(['stub'])] });
        }),
      downloadFile: record('utils.downloadFile')
    }
  };
  if (options.exportImpl != null) {
    const impl = options.exportImpl;
    cesdk.utils.export = (exportOptions: Record<string, unknown>) => {
      calls.push({ path: 'utils.export', args: [exportOptions] });
      return impl(exportOptions);
    };
  }

  await plugin.initialize({ cesdk: cesdk as unknown as CreativeEditorSDK });

  const store = new Map<string, unknown>();
  const state = (key: string, initial: unknown) => {
    if (!store.has(key)) {
      store.set(key, initial);
    }
    return {
      get value() {
        return store.get(key);
      },
      setValue: (next: unknown) => store.set(key, next)
    };
  };

  harness.render = (engine: unknown) => {
    if (panel == null) {
      throw new Error('The plugin registered no panel.');
    }
    const builderCalls: BuilderCall[] = [];
    const component =
      (name: string) => (id: string, componentOptions: Record<string, any>) => {
        builderCalls.push({ component: name, id, options: componentOptions });
        componentOptions?.children?.();
      };
    const builder = {
      Section: component('Section'),
      Text: component('Text'),
      Select: component('Select'),
      NumberInput: component('NumberInput'),
      Button: component('Button')
    };
    panel({ builder, engine, state });
    harness.builderCalls = builderCalls;
    return builderCalls;
  };

  return harness;
}
