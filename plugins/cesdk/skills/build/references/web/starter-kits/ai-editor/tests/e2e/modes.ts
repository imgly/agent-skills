import { getEditor, waitForEditorReady } from '@imgly/kit-test-harness';
import type { KitEditor } from '@imgly/kit-test-harness';
import type { JSHandle, Locator, Page } from '@playwright/test';

export type EditorMode = 'Design' | 'Photo' | 'Video';

export function modeButton(page: Page, mode: EditorMode): Locator {
  return page.getByRole('button', { name: mode, exact: true });
}

/**
 * Click a mode and wait for the editor the kit mounts in its place. The
 * previous instance stays on `window.cesdk` until the new one initializes, so
 * waiting for the swap is what makes every later read see the new editor.
 */
export async function switchMode(
  page: Page,
  mode: EditorMode
): Promise<JSHandle<KitEditor>> {
  return remount(page, () => modeButton(page, mode).click());
}

/** The same wait for anything else that remounts the editor. */
export async function remount(
  page: Page,
  action: () => Promise<void>
): Promise<JSHandle<KitEditor>> {
  const previous = await page.evaluateHandle(
    () => (window as unknown as { cesdk: unknown }).cesdk
  );
  await action();
  await page.waitForFunction((old) => {
    const current = (window as unknown as { cesdk: unknown }).cesdk;
    return current != null && current !== old;
  }, previous);
  await previous.dispose();
  await waitForEditorReady(page);
  return getEditor(page);
}

/** The ids of the asset sources the editor has registered. */
export async function assetSourceIds(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<string[]> {
  return page.evaluate(
    (handle) => handle.engine.asset.findAllSources() as string[],
    editor
  );
}

/** Apply the sidebar's pending selection and wait for the editor it remounts. */
export async function applyChanges(page: Page): Promise<JSHandle<KitEditor>> {
  return remount(page, () =>
    page.getByRole('button', { name: 'Apply Changes' }).click()
  );
}

/** A sidebar model row's checkbox, named after the model it carries. */
export function providerCheckbox(page: Page, model: string): Locator {
  return page.getByRole('checkbox', { name: new RegExp(`^${model}`) });
}

/**
 * Tick or untick a model. The checkbox itself is visually replaced by a styled
 * span, so the click goes to its label, as a user's would.
 */
export async function toggleProvider(page: Page, model: string): Promise<void> {
  await page.getByText(model, { exact: true }).click();
}

/** A capability group's header, which also carries its selected/total count. */
export function capabilityGroup(page: Page, capability: string): Locator {
  return page.getByRole('button', { name: new RegExp(`^${capability}\\b`) });
}

/**
 * Reveal a capability group's model list. The sidebar keeps its expanded
 * groups across an editor remount, so this has to be idempotent.
 */
export async function expandCapability(
  page: Page,
  capability: string
): Promise<void> {
  const group = capabilityGroup(page, capability);
  if ((await group.getAttribute('aria-expanded')) === 'false') {
    await group.click();
  }
}

/** Close the editor's "Export complete" dialog, which blocks the bar below. */
export async function dismissExportDialog(page: Page): Promise<void> {
  const dialog = page.getByRole('alertdialog');
  await dialog.getByRole('button').last().click();
  await dialog.waitFor({ state: 'detached' });
}
