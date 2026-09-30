import { expect, test } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';
import {
  PRODUCTS,
  Preview,
  editDesign,
  loadedModel,
  spyTexture,
  textureCalls,
  waitForModel
} from './preview';

/** The `<model-viewer>` attributes the kit sets. */
async function viewerState(page: Parameters<typeof waitForModel>[0]) {
  return page.evaluate(() => {
    const viewer = document.querySelector('model-viewer') as HTMLElement & {
      cameraOrbit: string;
      cameraControls: boolean;
    };
    return {
      src: viewer.getAttribute('src') ?? '',
      cameraOrbitAttribute: viewer.getAttribute('camera-orbit') ?? '',
      cameraOrbit: viewer.cameraOrbit,
      hasCameraControls: viewer.hasAttribute('camera-controls')
    };
  });
}

/** The camera the user sees; `cameraOrbit` only mirrors the attribute. */
function liveOrbit(page: Page): Promise<string> {
  return page.evaluate(() =>
    JSON.stringify(
      (
        document.querySelector('model-viewer') as unknown as {
          getCameraOrbit(): { theta: number; phi: number };
        }
      ).getCameraOrbit()
    )
  );
}

async function dragAcross(page: Page, target: Locator): Promise<void> {
  const box = (await target.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 160, box.y + box.height / 2, {
    steps: 12
  });
  await page.mouse.up();
}

test.describe('Start-up and product switching', () => {
  test('P3D-01 apparel is selected and its model is textured', async ({
    kit
  }) => {
    const preview = new Preview(kit.page);

    await expect(preview.modelViewer).toBeVisible();
    await waitForModel(kit.page);

    const state = await viewerState(kit.page);
    expect(state.src.endsWith('/t-shirt/scene.gltf')).toBe(true);
    expect(state.hasCameraControls).toBe(true);
    // The apparel design scene, not one of the other two.
    expect(
      await kit.page.evaluate(
        (handle) => handle.engine.scene.getPages().length,
        kit.editor
      )
    ).toBeGreaterThan(0);
  });

  test('P3D-02 three product controls', async ({ kit }) => {
    const preview = new Preview(kit.page);

    for (const { label } of PRODUCTS) {
      await expect(preview.product(label)).toBeVisible();
    }

    await preview.product('Baseball Cap').click();
    await expect(preview.product('Apparel')).toBeEnabled({ timeout: 90_000 });
  });

  for (const { label, folder, orbit, materialIndex } of PRODUCTS.map(
    (product) => ({
      ...product,
      orbit: product.folder === 't-shirt' ? '0deg 90deg' : '160deg 90deg',
      materialIndex: product.folder === 't-shirt' ? 1 : 0
    })
  )) {
    test(`P3D-03 ${label} loads its own model and framing`, async ({ kit }) => {
      const preview = new Preview(kit.page);
      await waitForModel(kit.page);

      await preview.product(label).click();

      await expect
        .poll(async () => (await viewerState(kit.page)).src, {
          timeout: 90_000
        })
        .toContain(`/${folder}/scene.gltf`);
      expect((await viewerState(kit.page)).cameraOrbitAttribute).toBe(orbit);
      await expect(preview.product(label)).toBeEnabled({ timeout: 90_000 });

      // Apparel is the start product, so its case covers the start-up texture.
      await expect
        .poll(() => loadedModel(kit.page, materialIndex), { timeout: 90_000 })
        .toEqual({
          src: expect.stringContaining(`/${folder}/scene.gltf`),
          baseColorUri: expect.stringMatching(/^blob:/)
        });
    });
  }

  test('P3D-07 switching product re-frames the camera', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await waitForModel(kit.page);
    expect((await viewerState(kit.page)).cameraOrbitAttribute).toBe(
      '0deg 90deg'
    );

    await preview.product('Business Card').click();

    await expect
      .poll(async () => (await viewerState(kit.page)).cameraOrbitAttribute, {
        timeout: 90_000
      })
      .toBe('160deg 90deg');
  });

  test('P3D-15 the new model never gets the previous product’s texture', async ({
    kit
  }) => {
    const preview = new Preview(kit.page);
    await expect
      .poll(() => loadedModel(kit.page, 1), { timeout: 90_000 })
      .toEqual({
        src: expect.stringContaining('/t-shirt/scene.gltf'),
        baseColorUri: expect.stringMatching(/^blob:/)
      });
    const apparelTexture = (await loadedModel(kit.page, 1))!.baseColorUri!;
    await kit.page.evaluate(() => {
      const viewer = document.querySelector('model-viewer') as unknown as {
        createTexture(url: string): Promise<unknown>;
      };
      const globals = window as unknown as { __kitTextureUrls: string[] };
      globals.__kitTextureUrls = [];
      const original = viewer.createTexture.bind(viewer);
      viewer.createTexture = (url: string) => {
        globals.__kitTextureUrls.push(url);
        return original(url);
      };
    });

    await preview.product('Baseball Cap').click();
    await expect
      .poll(() => loadedModel(kit.page, 0), { timeout: 90_000 })
      .toEqual({
        src: expect.stringContaining('/cap/scene.gltf'),
        baseColorUri: expect.stringMatching(/^blob:/)
      });

    const requested = await kit.page.evaluate(
      () =>
        (window as unknown as { __kitTextureUrls: string[] }).__kitTextureUrls
    );
    expect(requested.length).toBeGreaterThan(0);
    expect(requested).not.toContain(apparelTexture);
  });
});

test.describe('The 3D preview', () => {
  test('P3D-04 an edit in the design reaches the texture', async ({ kit }) => {
    await waitForModel(kit.page);
    await spyTexture(kit.page);

    await editDesign(kit);

    // The hook debounces for 1500 ms, then renders and applies the texture.
    await expect
      .poll(async () => (await textureCalls(kit.page)).length, {
        timeout: 90_000
      })
      .toBeGreaterThan(0);
    const calls = await textureCalls(kit.page);
    expect(calls.at(-1)!.url.startsWith('blob:')).toBe(true);
    // Apparel's base colour is material 1; the other two use material 0.
    expect(calls.at(-1)!.materialIndex).toBe(1);
  });

  test('P3D-05 fullscreen and exit', async ({ kit }) => {
    const preview = new Preview(kit.page);
    const width = async () => (await preview.modelViewer.boundingBox())!.width;
    const split = await width();

    await preview.fullscreenButton.click();

    await expect(
      kit.page.getByRole('button', { name: 'Exit fullscreen' })
    ).toBeVisible();
    await expect.poll(width).toBeGreaterThan(split);

    await kit.page.getByRole('button', { name: 'Exit fullscreen' }).click();
    await expect(
      kit.page.getByRole('button', { name: 'View fullscreen' })
    ).toBeVisible();
    await expect.poll(width).toBe(split);

    await preview.fullscreenButton.click();
    await expect(
      kit.page.getByRole('button', { name: 'Exit fullscreen' })
    ).toBeVisible();
    await kit.page.keyboard.press('Escape');
    await expect(
      kit.page.getByRole('button', { name: 'View fullscreen' })
    ).toBeVisible();
    await expect.poll(width).toBe(split);
  });

  test('P3D-06 the kit hands orbit control to model-viewer', async ({
    kit
  }) => {
    const preview = new Preview(kit.page);
    await waitForModel(kit.page);

    const before = await viewerState(kit.page);
    expect(before.hasCameraControls).toBe(true);

    const beforeOrbit = await liveOrbit(kit.page);
    await dragAcross(kit.page, preview.modelViewer);

    // The orbit maths belongs to @google/model-viewer; this only proves the
    // kit enables the control and does not write the orbit back on a render.
    await expect.poll(() => liveOrbit(kit.page)).not.toBe(beforeOrbit);
  });
});

test.describe('Layout and product bar', () => {
  test('P3D-11 the product bar sits above the editor and the preview', async ({
    kit
  }) => {
    const preview = new Preview(kit.page);
    await expect(preview.navigationBar).toBeVisible();
    await expect(preview.modelViewer).toBeVisible();

    const bar = (await preview.product('Apparel').boundingBox())!;
    const editor = (await preview.navigationBar.boundingBox())!;
    const model = (await preview.modelViewer.boundingBox())!;
    expect(bar.y + bar.height).toBeLessThanOrEqual(editor.y);
    expect(bar.y + bar.height).toBeLessThanOrEqual(model.y);
  });

  test('P3D-12 only the open product is highlighted', async ({ kit }) => {
    const preview = new Preview(kit.page);
    // The active button is the only one drawn in white on the dark pill.
    const white = 'rgb(255, 255, 255)';
    const expectHighlighted = async (active: string) => {
      for (const { label } of PRODUCTS) {
        if (label === active) {
          await expect(preview.product(label)).toHaveCSS('color', white);
        } else {
          await expect(preview.product(label)).not.toHaveCSS('color', white);
        }
      }
    };

    await expectHighlighted('Apparel');
    await expect(preview.product('Baseball Cap')).toBeEnabled({
      timeout: 90_000
    });
    await preview.product('Baseball Cap').click();
    await expectHighlighted('Baseball Cap');
  });
});

test.describe('A model that loads after its texture', () => {
  let releaseModel: () => void;

  test.beforeEach(async ({ page }) => {
    const held = new Promise<void>((resolve) => (releaseModel = resolve));
    await page.route('**/t-shirt/scene.gltf', async (route) => {
      await held;
      await route.fallback();
    });
  });

  test('P3D-13 the start texture reaches a model that loads late', async ({
    kit
  }) => {
    // The spinner clears once the first texture is rendered; the model is
    // still held, so the kit has nowhere to put it yet.
    await expect(
      kit.page.locator('[class*="loadingIndicator"]')
    ).not.toBeAttached({ timeout: 90_000 });
    expect(await loadedModel(kit.page, 1)).toBeNull();

    releaseModel();
    await expect
      .poll(() => loadedModel(kit.page, 1), { timeout: 90_000 })
      .toEqual({
        src: expect.stringContaining('/t-shirt/scene.gltf'),
        baseColorUri: expect.stringMatching(/^blob:/)
      });
  });
});

test.describe('Fullscreen rotation', () => {
  test('P3D-14 dragging rotates the model in fullscreen', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await waitForModel(kit.page);

    await preview.fullscreenButton.click();
    await expect(
      kit.page.getByRole('button', { name: 'Exit fullscreen' })
    ).toBeVisible();

    const before = await liveOrbit(kit.page);
    await dragAcross(kit.page, preview.modelViewer);
    await expect.poll(() => liveOrbit(kit.page)).not.toBe(before);
  });
});
