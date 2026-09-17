import { render, screen, waitFor } from '@imgly/kit-test-harness/component';
import { Component, type ReactNode } from 'react';
import { expect } from 'vitest';

import { EditorProvider } from '../../../src/app/contexts/EditorContext';
import { EngineProvider } from '../../../src/app/contexts/EngineContext';
import { SinglePageModeProvider } from '../../../src/app/contexts/SinglePageModeContext';
import { SelectionProvider } from '../../../src/app/contexts/UseSelection';
import { fakeEngine, installFakeEngine } from './engine-mock';
import type { FakeEngine, FakeEngineOptions } from './fake-engine';

const resizeCallbacks = new Set<() => void>();

class ResizeObserverStub {
  constructor(private readonly callback: () => void) {}
  observe(): void {
    resizeCallbacks.add(this.callback);
  }
  unobserve(): void {
    resizeCallbacks.delete(this.callback);
  }
  disconnect(): void {
    resizeCallbacks.delete(this.callback);
  }
}

/** Run every live `ResizeObserver` callback, which jsdom never fires. */
export function resizeObservedElements(): void {
  for (const callback of [...resizeCallbacks]) callback();
}

/** jsdom implements none of these, and the kit uses all of them. */
export function installBrowserStubs(): void {
  // Assigned rather than defaulted: another test file may have installed a
  // no-op observer first, and these tests have to be able to fire it.
  globalThis.ResizeObserver = ResizeObserverStub as never;
  URL.createObjectURL = () => 'blob:preview';
  URL.revokeObjectURL = () => {};
  if (window.visualViewport == null) {
    const viewport = new EventTarget() as EventTarget & { height: number };
    viewport.height = 800;
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: viewport
    });
  }
  Element.prototype.scrollIntoView ??= () => {};
}

/**
 * The export label is `display: none` in the kit's own stylesheet until a media
 * query widens it, and jsdom applies no media queries, so the control has no
 * computed accessible name here. Its visible label still identifies it.
 */
export function exportButton(): HTMLButtonElement {
  const label = screen.getByText('Export');
  const button = label.closest('button');
  if (button == null) throw new Error('the Export label has no button');
  return button;
}

/**
 * React reports an error thrown from a provider effect to the nearest boundary
 * only. Without one it escapes the test as an unhandled rejection, so every
 * mount gets a boundary and the caller reads the errors off the handle.
 */
class ErrorBoundary extends Component<
  { children: ReactNode; onError: (error: Error) => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error): void {
    this.props.onError(error);
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

export interface RenderWithProvidersOptions extends FakeEngineOptions {
  /** Padding the provider hands the canvas; the kit's own values by default. */
  paddingBottom?: number;
  /** Runs on the fresh engine before anything is mounted. */
  configure?: (handle: FakeEngine) => void;
}

/**
 * Mount `ui` under the kit's real provider stack over a fake engine, the same
 * nesting `App` uses. `EngineProvider` reaches the fake through the mocked
 * `@cesdk/engine`, so every provider in between runs unchanged.
 */
export async function renderWithProviders(
  ui: ReactNode,
  {
    paddingBottom = 92,
    configure,
    ...engineOptions
  }: RenderWithProvidersOptions = {}
): Promise<
  FakeEngine & { rendered: ReturnType<typeof render>; errors: Error[] }
> {
  installBrowserStubs();
  const installed = installFakeEngine(engineOptions);
  configure?.(installed);
  const errors: Error[] = [];

  const rendered = render(
    <ErrorBoundary onError={(error) => errors.push(error)}>
      <EngineProvider
        config={{}}
        LoadingComponent={<div data-testid="engine-loading" />}
      >
        <SinglePageModeProvider
          defaultVerticalTextScrollEnabled
          defaultPaddingBottom={paddingBottom}
          defaultPaddingLeft={40}
          defaultPaddingRight={40}
          defaultPaddingTop={110}
          defaultRefocusCropModeEnabled={false}
          defaultTextScrollTopPadding={null}
          defaultTextScrollBottomPadding={null}
        >
          <EditorProvider>
            <SelectionProvider engine={fakeEngine().engine}>
              {ui}
            </SelectionProvider>
          </EditorProvider>
        </SinglePageModeProvider>
      </EngineProvider>
    </ErrorBoundary>
  );

  await waitFor(() => {
    expect(screen.queryByTestId('engine-loading')).toBeNull();
  });

  return { ...installed, rendered, errors };
}
