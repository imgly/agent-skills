// @vitest-environment jsdom
import { render, renderHook, waitFor } from '@imgly/kit-test-harness/component';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { argsOf, createFakeEngine, type FakeEngine } from './fake-engine';

const hoisted = vi.hoisted(() => ({
  engine: undefined as { api: unknown } | undefined,
  initGate: Promise.resolve(),
  editorGate: Promise.resolve()
}));

vi.mock('@cesdk/engine', () => ({
  default: {
    init: async () => {
      await hoisted.initGate;
      return hoisted.engine?.api;
    }
  }
}));

vi.mock('../../src/imgly', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/imgly')>()),
  initPhotoEditor: async (engine: {
    editor: { setEditMode(m: string): void };
  }) => {
    // A state change before `setEngine` runs is the only way to reach the
    // "no engine yet" guard in the editor's own state listener.
    engine.editor.setEditMode('Transform');
    await hoisted.editorGate;
  },
  setupPhotoScene: async () => {},
  setImageSource: async () => {},
  getImageSize: async () => ({ width: 800, height: 600 })
}));

const { EditorProvider, useEditor } =
  await import('../../src/app/contexts/EditorContext');

let engine: FakeEngine;

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??= ResizeObserverStub as never;
  const viewport = new EventTarget() as EventTarget & { height: number };
  viewport.height = 800;
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: viewport
  });
});

beforeEach(() => {
  engine = createFakeEngine();
  hoisted.engine = engine;
  hoisted.initGate = Promise.resolve();
  hoisted.editorGate = Promise.resolve();
});

/** Resolves on the tick the test chooses, so an unmount can beat it. */
function gate(): { promise: Promise<void>; open: () => void } {
  let open = () => {};
  const promise = new Promise<void>((resolve) => {
    open = () => resolve();
  });
  return { promise, open };
}

describe('PH-C23 useEditor outside a provider', () => {
  it('says which provider is missing', () => {
    expect(() => renderHook(() => useEditor())).toThrow(
      'useEditor must be used within an EditorProvider'
    );
  });
});

describe('PH-C25 Editing before the engine is there', () => {
  it('ignores a photo swap requested while the engine is still starting', async () => {
    const started = gate();
    hoisted.initGate = started.promise;
    let changeImage:
      | ((src: string, keep: boolean) => Promise<void>)
      | undefined;
    const Probe = () => {
      changeImage = useEditor().changeImage;
      return null;
    };

    render(
      <EditorProvider engineConfig={{}}>
        <Probe />
      </EditorProvider>
    );
    await changeImage!('other.jpg', true);
    expect(engine.calls).toEqual([]);

    started.open();
  });
});

describe('PH-C24 Unmounting while the engine is still starting', () => {
  it('disposes an engine that arrives after the provider is gone', async () => {
    const started = gate();
    hoisted.initGate = started.promise;

    const { unmount } = render(
      <EditorProvider engineConfig={{}}>ok</EditorProvider>
    );
    unmount();
    started.open();

    await waitFor(() =>
      expect(argsOf(engine, 'dispose').length).toBeGreaterThan(0)
    );
    expect(argsOf(engine, 'setVisible')).toEqual([]);
  });

  it('disposes an engine whose scene finishes after the provider is gone', async () => {
    const configured = gate();
    hoisted.editorGate = configured.promise;

    const { unmount } = render(
      <EditorProvider engineConfig={{}}>ok</EditorProvider>
    );
    await waitFor(() => expect(argsOf(engine, 'setEditMode')).toHaveLength(1));
    unmount();
    configured.open();

    await waitFor(() =>
      expect(argsOf(engine, 'dispose').length).toBeGreaterThan(0)
    );
    expect(argsOf(engine, 'setVisible')).toEqual([]);
  });
});
