import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { setupActions } from '../../src/imgly/config/actions';

describe('PRP-U3 setupActions', () => {
  const spy = createApiSpy<CreativeEditorSDK>();
  setupActions(spy.api);
  const registered = spy
    .callsTo('actions.register')
    .map(({ args }) => args[0] as string);

  it('registers the five actions the kit ships', () => {
    expect(registered).toEqual([
      'saveScene',
      'exportDesign',
      'importScene',
      'exportScene',
      'uploadFile'
    ]);
  });
});
