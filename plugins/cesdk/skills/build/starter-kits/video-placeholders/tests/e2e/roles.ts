import {
  getEditor,
  waitForEditorReady,
  type Kit
} from '@imgly/kit-test-harness';

/**
 * Switch the role and hand back a handle to the editor the kit remounts.
 * The old instance keeps answering on `window.cesdk` until the new one
 * publishes itself, so the global is cleared before the click.
 */
export async function switchRole(kit: Kit, role: 'Creator' | 'Adopter') {
  await kit.page.evaluate(() => {
    delete (window as unknown as { cesdk?: unknown }).cesdk;
  });
  await kit.page.getByRole('button', { name: role, exact: true }).click();
  await waitForEditorReady(kit.page);
  return getEditor(kit.page);
}

export async function selectFirstGraphic(kit: Kit, editor = kit.editor) {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    engine.block
      .findAllSelected()
      .forEach((block: number) => engine.block.setSelected(block, false));
    const [graphic] = engine.block.findByType('graphic');
    engine.block.setSelected(graphic, true);
    return graphic;
  }, editor);
}
