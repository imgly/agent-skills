import { render, screen, waitFor } from '@imgly/kit-test-harness/component';
import { expect } from 'vitest';

import './jsdomEnv';
import App from '../../../src/app/App';
import { engineHolder } from './engineHolder';
import type { FakeEngine } from './fakeEngine';

/** Mount the whole kit over `engine` and wait until the editor is up. */
export async function renderEditor(engine: FakeEngine) {
  engineHolder.engine = engine;
  const result = render(<App engineConfig={{ license: 'test' }} />);
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Canvas size' })).toBeTruthy()
  );
  // The top bar can render before the effects of the same commit run. The
  // canvas mount is one of them, so it shows the editor's subscriptions exist.
  await waitFor(() => expect(engine.element.parentElement?.id).toBe('cesdk'));
  return result;
}
