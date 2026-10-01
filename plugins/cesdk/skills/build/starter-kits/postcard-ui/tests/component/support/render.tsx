import { render, screen, waitFor } from '@imgly/kit-test-harness/component';
import { Component, type ReactNode } from 'react';
import { expect } from 'vitest';

import { EditorProvider } from '@/app/contexts/EditorContext';
import { EngineProvider } from '@/app/contexts/EngineContext';
import { PageSettingsProvider } from '@/app/contexts/PageSettingsContext';
import { SelectionProvider } from '@/app/contexts/SelectionContext';
import { SinglePageModeProvider } from '@/app/contexts/SinglePageModeContext';
import { setupActions } from '@/imgly/config/actions';
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
  /** Runs on the fresh engine before anything is mounted. */
  configure?: (handle: FakeEngine) => void;
  /** The kit's own text-scroll padding by default; `null` asks for the fallback. */
  textScrollPadding?: number | null;
}

/**
 * Mount `ui` under the kit's real provider stack over a fake engine, the same
 * nesting `App` uses. `EngineProvider` reaches the fake through the mocked
 * `@cesdk/engine`, so every provider in between runs unchanged, and the kit's
 * own actions are registered on it the way `initPostcardEditor` does.
 */
export async function renderWithProviders(
  ui: ReactNode,
  {
    configure,
    textScrollPadding = 110,
    ...engineOptions
  }: RenderWithProvidersOptions = {}
): Promise<
  FakeEngine & { rendered: ReturnType<typeof render>; errors: Error[] }
> {
  installBrowserStubs();
  const installed = installFakeEngine(engineOptions);
  setupActions(installed.engine);
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
          defaultRefocusCropModeEnabled={false}
          defaultTextScrollTopPadding={textScrollPadding}
          defaultTextScrollBottomPadding={textScrollPadding == null ? null : 92}
          defaultPaddingBottom={92}
          defaultPaddingLeft={40}
          defaultPaddingRight={40}
          defaultPaddingTop={110}
        >
          <EditorProvider>
            <PageSettingsProvider>
              <SelectionProvider engine={fakeEngine().engine}>
                {ui}
              </SelectionProvider>
            </PageSettingsProvider>
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
