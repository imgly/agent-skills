import { exerciseLayerListDockEntry } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it } from 'vitest';

import { setupDock } from '../../src/imgly/config/ui/dock';

const LAYERS_PANEL = '//ly.img.panel/layers';

describe('layer list dock entry', () => {
  const result = exerciseLayerListDockEntry(setupDock);

  it('opens the layers panel while it is closed', () => {
    expect(result.whileClosed).toEqual({
      selected: false,
      opened: [[LAYERS_PANEL]],
      closed: []
    });
  });

  it('closes the layers panel while it is open', () => {
    expect(result.whileOpen).toEqual({
      selected: true,
      opened: [],
      closed: [[LAYERS_PANEL]]
    });
  });
});
