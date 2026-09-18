import { exerciseLayerListDockEntry } from '@imgly/kit-test-harness/vitest';
import { describe, expect, it } from 'vitest';

import { setupDock as advancedEditorDock } from '../../src/imgly/config/advanced-editor/ui/dock';
import { setupDock as designEditorDock } from '../../src/imgly/config/design-editor/ui/dock';

const LAYERS_PANEL = '//ly.img.panel/layers';

describe.each([
  ['advanced-editor', advancedEditorDock],
  ['design-editor', designEditorDock]
])('%s layer list dock entry', (_mode, setupDock) => {
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
