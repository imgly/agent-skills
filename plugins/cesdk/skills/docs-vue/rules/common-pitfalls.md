# Common Pitfalls

Non-obvious failure modes when building with CE.SDK and their solutions.

## `alwaysOnBottom` Is Unreliable for Page Children

**Problem:** Setting `alwaysOnBottom: true` on a graphic block that is a child of a page does not reliably keep it behind other page children. The block may render on top of user content.

**Solution:** For background images (like product mockups), attach the graphic block to the **scene** — not to the page. Use `engine.block.insertChild(sceneBlock, block, 0)` to place it behind all pages.

See: `mockup-editor-architecture.md` (in the rules directory)

---

## SVGs Don't Render Reliably

**Problem:** CE.SDK uses a Skia-based rendering engine that has limited SVG support. SVGs with `<linearGradient>`, `<radialGradient>`, complex `<path>` elements, or certain filters may render as blank or broken.

**Solution:** Convert SVGs to PNG (or WebP) before using them in CE.SDK. Use a library like `sharp`:

```javascript
import sharp from 'sharp';
await sharp('mockup.svg')
  .resize(800, 940)
  .png()
  .toFile('mockup.png');
```

Ensure PNGs preserve alpha transparency (`hasAlpha: true`).

---

## Relative URIs Resolve Against the CDN, Not Your App

**Problem:** CE.SDK resolves relative URIs against `config.baseURL` (typically `https://cdn.img.ly/packages/imgly/cesdk-js/...`). A URI like `/mockups/tshirt.png` will resolve to the CDN, not your app's origin.

**Solution:** Convert local asset paths to absolute URLs:

```typescript
function resolveLocalUri(uri: string): string {
  if (uri.startsWith('/')) {
    return `${window.location.origin}${uri}`;
  }
  return uri;
}
```

Apply this before passing URIs to `setSourceSet` or `setString('fill/image/imageFileURI', ...)`.

---

## `createDesignScene()` Can Reset Feature Flags

**Problem:** Calling `cesdk.createDesignScene()` may reset editor settings like `singlePageMode` or `page/dimOutOfPageAreas`. Settings applied in the config's `featureFlags` may not survive scene creation.

**Solution:** Either:
- Use `engine.scene.create('Free')` instead (gives full control, no side effects)
- Or re-apply settings **after** calling `createDesignScene()`

```typescript
// Approach A: Manual scene creation (preferred for mockup editors)
engine.scene.create('Free');
engine.editor.setSettingBool('page/dimOutOfPageAreas', false);

// Approach B: Re-apply after createDesignScene
await cesdk.createDesignScene();
engine.editor.setSettingBool('page/dimOutOfPageAreas', false);
engine.editor.setSettingBool('page/title/show', false);
```

---

## White-on-White Invisible Fills

**Problem:** Setting a white product mockup as a page's image fill makes it invisible — white image on white canvas background.

**Solution:** Don't use page image fills for mockups. The correct architecture uses:
1. **Transparent** page fill (`{ r: 0, g: 0, b: 0, a: 0 }`)
2. **Scene-level mockup block** behind the page
3. CE.SDK's gray canvas background provides contrast

See: `mockup-editor-architecture.md` (in the rules directory)

---

## `contentFillMode` Is Block-Level, Not Fill-Level

**Problem:** Trying to set `fill/content/fillMode` or `contentFillMode` on an `ImageFill` block throws:

```
Property not found: "fill/content/fillMode"
Type of member named "contentFillMode" on "ImageFill" is not reflected.
```

**Solution:** Content fill mode is set on the **block**, not the fill:

```typescript
// Wrong
engine.block.setString(fill, 'fill/content/fillMode', 'Cover');

// Correct
engine.block.setContentFillMode(graphicBlock, 'Cover');
```

---

## Use `setSourceSet` Instead of `setString` for Images

**Problem:** Using `setString(fill, 'fill/image/imageFileURI', uri)` works but doesn't provide image dimensions to the engine, which can cause layout and cropping issues.

**Solution:** Use `setSourceSet` which includes width and height metadata:

```typescript
// Preferred
engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
  { uri: 'https://example.com/image.png', width: 800, height: 940 }
]);

// Avoid for production use
engine.block.setString(fill, 'fill/image/imageFileURI', 'https://example.com/image.png');
```

The `Source` type from `@cesdk/engine` defines the shape: `{ uri: string; width: number; height: number }`.

---

## `zoomToBlock` Is Not for Page Switching

**Problem:** Using `engine.scene.zoomToBlock(pageBlock, ...)` to switch between pages in single-page mode does not reliably change the active page. The engine may still consider the previous page as "current."

**Solution:** Use `cesdk.unstable_switchPage(pageId)` which properly updates the active page:

```typescript
// Wrong — only changes viewport, not active page
await engine.scene.zoomToBlock(pageBlock, 40, 40, 40, 40);

// Correct — switches active page
await cesdk.unstable_switchPage(pageBlock);
```

After switching, zoom to the associated mockup block (not the page) for proper framing.

---

## Page `editor/select` Scope and Canvas Interactions

**Problem:** When the page itself is selectable, users may accidentally select and move it, breaking the layout.

**Solution:** Disable the select scope on page blocks:

```typescript
engine.block.setScopeEnabled(page, 'editor/select', false);
```

This prevents the page from being selected while still allowing interaction with child elements (text, images, shapes).
