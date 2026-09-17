import { vi } from 'vitest';

/** One control the kit's render function asked the builder for. */
export interface BuiltControl {
  kind: string;
  id: string;
  options: Record<string, unknown>;
  children: BuiltControl[];
}

type Renderer = (context: {
  builder: unknown;
  engine: unknown;
  state: unknown;
}) => void;

/**
 * Drives a panel render function the way the editor does: a builder that
 * records every control, and panel state that survives a re-render.
 */
export class PanelHarness {
  readonly state = new Map<string, unknown>();
  controls: BuiltControl[] = [];

  constructor(
    private readonly render: Renderer,
    private readonly pageCount: number
  ) {}

  run(): void {
    this.controls = [];
    const stack: BuiltControl[][] = [this.controls];

    const record =
      (kind: string) =>
      (id: string, options: unknown = {}) => {
        const control: BuiltControl = {
          kind,
          id,
          options: (options ?? {}) as Record<string, unknown>,
          children: []
        };
        stack.at(-1)!.push(control);
        const children = control.options.children;
        if (typeof children === 'function') {
          stack.push(control.children);
          (children as () => void)();
          stack.pop();
        }
      };

    const builder = {
      Section: record('Section'),
      ButtonGroup: record('ButtonGroup'),
      Button: record('Button'),
      Text: record('Text'),
      NumberInput: record('NumberInput')
    };

    const store = this.state;
    const state = <T>(key: string, initial: T) => {
      if (!store.has(key)) {
        store.set(key, initial);
      }
      return {
        get value(): T {
          return store.get(key) as T;
        },
        setValue: (next: T) => store.set(key, next)
      };
    };

    const pages = Array.from({ length: this.pageCount }, (_, i) => i + 1);
    const engine = { block: { findByType: () => pages } };

    this.render({ builder, engine, state });
  }

  find(id: string): BuiltControl {
    const walk = (controls: BuiltControl[]): BuiltControl | undefined => {
      for (const control of controls) {
        if (control.id === id) {
          return control;
        }
        const found = walk(control.children);
        if (found != null) {
          return found;
        }
      }
      return undefined;
    };
    const control = walk(this.controls);
    if (control == null) {
      throw new Error(`No control named ${id} in the rendered panel.`);
    }
    return control;
  }

  has(id: string): boolean {
    try {
      this.find(id);
      return true;
    } catch {
      return false;
    }
  }

  /** Run the control's `onClick`, then re-render, as the editor does. */
  async click(id: string): Promise<void> {
    await (this.find(id).options.onClick as () => unknown)();
    this.run();
  }
}

/** The `cesdk` surface the plugin's `initialize` reaches. */
export function createCesdkDouble() {
  const panels = new Map<string, Renderer>();
  const components = new Map<string, unknown>();
  const translations: Record<string, unknown>[] = [];
  const panelPositions: [string, string][] = [];
  const inserted: unknown[][] = [];

  const cesdk = {
    i18n: { setTranslations: (value: never) => translations.push(value) },
    ui: {
      registerComponent: (id: string, render: unknown) =>
        components.set(id, render),
      registerPanel: (id: string, render: Renderer) => panels.set(id, render),
      setPanelPosition: (id: string, position: string) =>
        panelPositions.push([id, position]),
      insertOrderComponent: (...args: unknown[]) => inserted.push(args),
      isPanelOpen: vi.fn(() => false),
      openPanel: vi.fn(),
      closePanel: vi.fn()
    }
  };

  return {
    cesdk,
    panels,
    components,
    translations,
    panelPositions,
    inserted
  };
}
