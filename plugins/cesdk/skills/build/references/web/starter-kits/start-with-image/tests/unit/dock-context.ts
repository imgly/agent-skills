export interface OpenPanel {
  id: string;
  payload?: unknown;
}

export interface DockContext {
  cesdk: any;
  calls: string[];
  open: OpenPanel[];
  editMode: string;
  currentPage: number | null;
  selected: number[];
}

function samePayload(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/**
 * A stand-in for the editor that the dock entries drive. `createApiSpy` cannot
 * serve here because the entries branch on what `isPanelOpen` and
 * `getEditMode` return.
 */
export function createDockContext(
  initial: Partial<Pick<DockContext, 'editMode' | 'currentPage' | 'open'>> = {}
): DockContext {
  const context: DockContext = {
    cesdk: null,
    calls: [],
    open: initial.open ?? [],
    editMode: initial.editMode ?? 'Transform',
    currentPage: initial.currentPage === undefined ? 1 : initial.currentPage,
    selected: []
  };

  context.cesdk = {
    engine: {
      editor: {
        setSetting: (key: string, value: unknown) =>
          context.calls.push(`setSetting ${key}=${String(value)}`),
        getEditMode: () => context.editMode,
        setEditMode: (mode: string) => {
          context.calls.push(`setEditMode ${mode}`);
          context.editMode = mode;
        }
      },
      scene: { getCurrentPage: () => context.currentPage },
      block: {
        select: (block: number) => {
          context.calls.push(`select ${block}`);
          context.selected = [block];
        }
      }
    },
    ui: {
      setComponentOrder: () => {},
      isPanelOpen: (id: string, options?: { payload?: unknown }) =>
        context.open.some(
          (panel) =>
            panel.id === id &&
            (options === undefined ||
              samePayload(panel.payload, options.payload))
        ),
      openPanel: (id: string, options?: { payload?: unknown }) => {
        context.calls.push(`openPanel ${id}`);
        context.open.push({ id, payload: options?.payload });
      },
      closePanel: (id: string) => {
        context.calls.push(`closePanel ${id}`);
        context.open =
          id === '*' ? [] : context.open.filter((p) => p.id !== id);
      }
    }
  };

  return context;
}
