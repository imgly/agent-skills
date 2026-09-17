import { vi } from 'vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

/** What a kit's `setComponentOrder` call puts into a bar or the dock. */
export type DockEntry =
  | string
  | {
      id: string;
      key?: string;
      children?: string[];
      onClick: () => void;
      isSelected: () => boolean;
    };

export interface EditorMockState {
  /** The block id `engine.scene.getCurrentPage()` answers with. */
  currentPage: number | null;
  editMode: string;
  openPanels: string[];
  selectedBlockTypes: Record<number, string>;
  /** Handlers the kit passed to `cesdk.onReset`, so a test can run them. */
  resetHandlers: (() => void)[];
}

/**
 * A `CreativeEditorSDK` stand-in whose queries answer with real values, so a
 * kit handler that branches on the edit mode, the open panel or the selection
 * takes the branch the test is about.
 */
export function createEditorMock(overrides: Partial<EditorMockState> = {}) {
  const state: EditorMockState = {
    currentPage: 42,
    editMode: 'Transform',
    openPanels: [],
    selectedBlockTypes: { 42: '//ly.img.ubq/page' },
    resetHandlers: [],
    ...overrides
  };

  const engine = {
    scene: { getCurrentPage: vi.fn(() => state.currentPage) },
    editor: {
      setSetting: vi.fn(),
      getEditMode: vi.fn(() => state.editMode),
      setEditMode: vi.fn((mode: string) => {
        state.editMode = mode;
      })
    },
    block: {
      setContentFillMode: vi.fn(),
      setScopeEnabled: vi.fn(),
      setClipped: vi.fn(),
      select: vi.fn(),
      findAllSelected: vi.fn(() =>
        Object.keys(state.selectedBlockTypes).map(Number)
      ),
      getType: vi.fn((id: number) => state.selectedBlockTypes[id])
    },
    asset: { addLocalSource: vi.fn(), addAssetToSource: vi.fn() }
  };

  const ui = {
    setComponentOrder: vi.fn(
      (_location: unknown, _order: DockEntry[]) => undefined
    ),
    insertOrderComponent: vi.fn(),
    isPanelOpen: vi.fn((id: string) => state.openPanels.includes(id)),
    openPanel: vi.fn((id: string) => {
      state.openPanels.push(id);
    }),
    closePanel: vi.fn((id: string) => {
      state.openPanels =
        id === '*' ? [] : state.openPanels.filter((p) => p !== id);
    }),
    applyForceCrop: vi.fn(
      async (_page: number, _options: unknown) => undefined
    ),
    setPanelPosition: vi.fn(),
    setPanelFloating: vi.fn()
  };

  const cesdk = {
    engine,
    ui,
    addPlugin: vi.fn(async (_plugin: { name: string }) => undefined),
    createFromImage: vi.fn(async (_url: string) => undefined),
    feature: {
      enable: vi.fn((_features: string[]) => undefined),
      set: vi.fn(
        (
          _feature: string,
          _predicate: (context: { engine: unknown }) => boolean
        ) => undefined
      )
    },
    i18n: { setTranslations: vi.fn() },
    actions: {
      register: vi.fn(
        (_id: string, _handler: (options?: unknown) => unknown) => undefined
      )
    },
    utils: {
      export: vi.fn(async (options: unknown) => ({
        blobs: ['blob'],
        options
      })),
      downloadFile: vi.fn(
        async (_data: unknown, _mimeType: unknown) => undefined
      )
    },
    shortcuts: { set: vi.fn() },
    onReset: vi.fn((handler: () => void) => {
      state.resetHandlers.push(handler);
    }),
    resetEditor: vi.fn(),
    setEditorCompatibilityVersion: vi.fn((_version: string) => undefined),
    reapplyLegacyUserConfiguration: vi.fn()
  };

  return {
    cesdk: cesdk as unknown as CreativeEditorSDK,
    raw: cesdk,
    engine,
    ui,
    state
  };
}
