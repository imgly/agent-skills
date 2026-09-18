import {
  createFakeEngine,
  type FakeEngine,
  type FakeEngineOptions
} from './fake-engine';

let current: FakeEngine | null = null;

/** Build the engine the next `renderWithProviders` will hand the kit. */
export function installFakeEngine(options?: FakeEngineOptions): FakeEngine {
  current = createFakeEngine(options);
  return current;
}

export function fakeEngine(): FakeEngine {
  if (current == null) {
    throw new Error('installFakeEngine() must run before the engine is read');
  }
  return current;
}

/**
 * The `@cesdk/engine` module shape `EngineProvider` uses. A test file installs
 * it with
 * `vi.mock('@cesdk/engine', async () => (await import('./support/engine-mock')).cesdkEngineModule)`,
 * which keeps the kit's real provider in the tree instead of stubbing it out.
 */
export const cesdkEngineModule = {
  default: { init: async () => fakeEngine().engine }
};
