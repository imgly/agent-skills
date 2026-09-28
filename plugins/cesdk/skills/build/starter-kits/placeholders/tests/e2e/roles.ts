import type { JSHandle, Locator, Page } from '@playwright/test';
import { getEditor, type KitEditor } from '@imgly/kit-test-harness';

export type Role = 'Creator' | 'Adopter';

/** The kit's role segmented control. */
export class RoleSwitcher {
  constructor(private readonly page: Page) {}

  button(role: Role): Locator {
    return this.page.getByRole('button', { name: role, exact: true });
  }

  /**
   * Switch role and wait for the remount. The kit replaces the CE.SDK instance,
   * so the old `window.cesdk` handle is stale until the new one has its scene.
   */
  async switchTo(role: Role): Promise<JSHandle<KitEditor>> {
    await this.button(role).click();
    await this.page.waitForFunction(
      (wanted) => {
        const cesdk = (window as any).cesdk;
        return (
          cesdk?.engine?.scene?.get() != null &&
          cesdk.engine.editor.getRole() === wanted
        );
      },
      role,
      { timeout: 90_000 }
    );
    return getEditor(this.page) as Promise<JSHandle<KitEditor>>;
  }
}

/** Names of the blocks on the page, in child order. */
export async function blockNames(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<string[]> {
  return page.evaluate(
    (cesdk) =>
      cesdk.engine.block
        .getChildren(cesdk.engine.scene.getPages()[0])
        .map((id: number) => cesdk.engine.block.getName(id)),
    editor
  );
}
