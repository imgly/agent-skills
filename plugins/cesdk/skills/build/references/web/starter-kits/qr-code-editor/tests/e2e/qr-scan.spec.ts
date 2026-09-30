import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import type { KitEditor } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import jsQR from 'jsqr';
import { qrBlocks, typeUrl } from './qr';

type Change = 'none' | 'colour' | 'gradient' | 'image' | 'shadow' | 'white';

/**
 * Applies `change` to a copy of `source`, exports the copy on white with a
 * quiet zone around it, and returns what a QR reader decodes from it.
 */
async function scanAfter(
  page: Page,
  editor: JSHandle<KitEditor>,
  source: number,
  change: Change
): Promise<string | null> {
  const pixels = await page.evaluate(
    async ({ handle, id, kind }) => {
      const engine = handle.engine as any;
      const block = engine.block.duplicate(id);
      const colour = (r: number, g: number, b: number) => ({ r, g, b, a: 1 });

      if (kind === 'colour' || kind === 'white') {
        const fill = engine.block.createFill('color');
        engine.block.setColor(
          fill,
          'fill/color/value',
          kind === 'white' ? colour(1, 1, 1) : colour(0.1, 0.2, 0.6)
        );
        engine.block.setFill(block, fill);
      }
      if (kind === 'gradient') {
        const fill = engine.block.createFill('gradient/linear');
        engine.block.setGradientColorStops(fill, 'fill/gradient/colors', [
          { color: colour(0.5, 0, 0.1), stop: 0 },
          { color: colour(0, 0.1, 0.4), stop: 1 }
        ]);
        engine.block.setFill(block, fill);
      }
      if (kind === 'image') {
        // A dark photo-like texture, drawn locally so no network is involved.
        const canvas = new OffscreenCanvas(256, 256);
        const ctx = canvas.getContext('2d')!;
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, '#20303a');
        gradient.addColorStop(1, '#402010');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        const url = URL.createObjectURL(await canvas.convertToBlob());
        const fill = engine.block.createFill('image');
        engine.block.setString(fill, 'fill/image/imageFileURI', url);
        engine.block.setFill(block, fill);
        const adjustments = engine.block.createEffect('adjustments');
        engine.block.setFloat(adjustments, 'effect/adjustments/contrast', 0.3);
        engine.block.appendEffect(block, adjustments);
        const blur = engine.block.createBlur('uniform');
        engine.block.setFloat(blur, 'blur/uniform/intensity', 0.1);
        engine.block.setBlur(block, blur);
        engine.block.setBlurEnabled(block, true);
        await engine.block.forceLoadResources([block]);
      }
      if (kind === 'shadow') {
        engine.block.setDropShadowEnabled(block, true);
      }

      const png: Blob = await engine.block.export(block, {
        mimeType: 'image/png',
        targetWidth: 300,
        targetHeight: 300
      });
      engine.block.destroy(block);

      const bitmap = await createImageBitmap(png);
      const margin = 30;
      const canvas = new OffscreenCanvas(
        bitmap.width + 2 * margin,
        bitmap.height + 2 * margin
      );
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, margin, margin);
      const { data, width, height } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      return { data: Array.from(data), width, height };
    },
    { handle: editor, id: source, kind: change }
  );

  const result = jsQR(
    Uint8ClampedArray.from(pixels.data),
    pixels.width,
    pixels.height
  );
  return result?.data ?? null;
}

test.describe('QR codes scan', () => {
  test('QR-12 the demo QR codes scan to the URL stored on them', async ({
    kit
  }) => {
    const codes = await qrBlocks(kit.page, kit.editor);
    expect(codes.length).toBeGreaterThan(0);

    for (const code of codes) {
      expect(await scanAfter(kit.page, kit.editor, code.id, 'none')).toBe(
        code.url
      );
    }
  });

  test('QR-13 a QR code still scans after its colour, fill or shadow changes', async ({
    kit
  }) => {
    const [code] = await qrBlocks(kit.page, kit.editor);

    for (const change of ['colour', 'gradient', 'image', 'shadow'] as const) {
      expect(
        await scanAfter(kit.page, kit.editor, code.id, change),
        `after the ${change} change`
      ).toBe(code.url);
    }

    // A code drawn white on white must not scan, or the reader proves nothing.
    expect(await scanAfter(kit.page, kit.editor, code.id, 'white')).toBeNull();
  });

  test('QR-14 a QR code generated with a picked colour is drawn in it and scans', async ({
    kit
  }) => {
    const panelId = '//ly.img.panel/generate-qr';
    const panel = editorPanel(kit.page, panelId);
    await kit.page
      .locator('#cesdk_container')
      .getByRole('button', { name: 'QR Code', exact: true })
      .click();
    await typeUrl(kit.page, panelId, 'https://example.com/colour');

    await panel.getByRole('button', { name: 'Foreground Color' }).click();
    const hex = kit.page.getByRole('textbox', { name: /^Hex/ });
    await hex.fill('1A4DB3');
    await hex.press('Enter');
    await kit.page.keyboard.press('Escape');
    const before = await qrBlocks(kit.page, kit.editor);
    await panel.getByRole('button', { name: 'Generate QR Code' }).click();

    await expect
      .poll(async () => (await qrBlocks(kit.page, kit.editor)).length)
      .toBe(before.length + 1);
    const added = (await qrBlocks(kit.page, kit.editor)).find(
      (block) => !before.some((old) => old.id === block.id)
    )!;
    const fill = await kit.page.evaluate(
      ({ handle, id }) => {
        const engine = handle.engine as any;
        return engine.block.getColor(
          engine.block.getFill(id),
          'fill/color/value'
        );
      },
      { handle: kit.editor, id: added.id }
    );
    expect(fill.r).toBeCloseTo(0x1a / 255, 2);
    expect(fill.g).toBeCloseTo(0x4d / 255, 2);
    expect(fill.b).toBeCloseTo(0xb3 / 255, 2);
    expect(await scanAfter(kit.page, kit.editor, added.id, 'none')).toBe(
      'https://example.com/colour'
    );
  });
});
