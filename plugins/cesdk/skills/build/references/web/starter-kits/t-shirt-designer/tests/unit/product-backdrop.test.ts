// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import { ProductBackdrop } from '../../src/imgly/plugins/product-backdrop';

function registerActions(currentPage: number | null) {
  const actions = new Map<string, (...args: never[]) => unknown>();
  const cesdk = {
    actions: {
      register: (id: string, handler: (...args: never[]) => unknown) => {
        actions.set(id, handler);
      }
    },
    engine: {
      editor: { setSetting: vi.fn() },
      scene: { getCurrentPage: () => currentPage },
      block: { getName: (page: number) => `area-${page}` }
    }
  };
  return { actions, cesdk };
}

describe('TSD-U21 product.getVisibleAreaId', () => {
  it('names the page the editor currently shows', async () => {
    const { actions, cesdk } = registerActions(7);
    await new ProductBackdrop().initialize({ cesdk } as never);

    expect(actions.get('product.getVisibleAreaId')!()).toBe('area-7');
  });

  it('reports no area while the editor shows no page', async () => {
    const { actions, cesdk } = registerActions(null);
    await new ProductBackdrop().initialize({ cesdk } as never);

    expect(actions.get('product.getVisibleAreaId')!()).toBeNull();
  });

  it('registers nothing without an editor', async () => {
    await expect(
      new ProductBackdrop().initialize({ cesdk: undefined } as never)
    ).resolves.toBeUndefined();
  });
});
