import { expect, test } from '@imgly/kit-test-harness';
import {
  PRODUCTS,
  Preview,
  editDesign,
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

  for (const { label, folder, orbit } of PRODUCTS.map((product) => ({
    ...product,
    orbit: product.folder === 't-shirt' ? '0deg 90deg' : '160deg 90deg'
  }))) {
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

    const liveOrbit = () =>
      kit.page.evaluate(() =>
        JSON.stringify(
          (
            document.querySelector('model-viewer') as unknown as {
              getCameraOrbit(): { theta: number; phi: number };
            }
          ).getCameraOrbit()
        )
      );
    const beforeOrbit = await liveOrbit();

    const box = (await preview.modelViewer.boundingBox())!;
    await kit.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await kit.page.mouse.down();
    await kit.page.mouse.move(
      box.x + box.width / 2 + 160,
      box.y + box.height / 2,
      { steps: 12 }
    );
    await kit.page.mouse.up();

    // The orbit maths belongs to @google/model-viewer; this only proves the
    // kit enables the control and does not write the orbit back on a render.
    await expect.poll(liveOrbit).not.toBe(beforeOrbit);
  });
});
