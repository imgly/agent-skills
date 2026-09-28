import type { FakeEngine } from './fakeEngine';

/**
 * The engine `@cesdk/engine` hands the provider. A test file mocks the module
 * with a factory that reads this holder, so the fake can differ per test. The
 * module imports nothing at run time: a mock factory that reached the kit's
 * own sources would deadlock on the mock it is defining.
 */
export const engineHolder: { engine?: FakeEngine } = {};
