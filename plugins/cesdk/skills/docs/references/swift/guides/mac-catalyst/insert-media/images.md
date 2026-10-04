> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Insert Images](./images.md)

---

You can insert images into a scene using CE.SDK, either through the prebuilt UI for iOS or programmatically via Swift for all platforms. This gives you the flexibility to build interactive design workflows, enable user-generated content, or automate image placement based on logic or data.

> **Note:** CE.SDK supports a wide range of image formats, including:* `.png`
> * `.jpeg`, `.jpg`
> * `.gif`
> * `.webp`
> * `.svg`
> * `.bmp`See a [full list](../file-format-support.md) of supported file types.

## What You’ll Learn

- Two ways to insert images:
  - Programmatically (iOS/macOS/catalyst) by creating a graphic block, applying an image fill, and setting its position/size/rotation/z-index.
  - With Editor UI (iOS Only) using the controls and asset libraries of a prebuilt editor such as the Design Editor or Photo Editor.
- Supported image sources such as bundled assets, app file URLs, and remote URLs.
- Practical transforms after insertion such as move, scale, rotate and order.

## When to Use It

- You’re building custom UI or automation flow to add images to compositions.
- You want a ready-made editing experience on iOS with an image picker and panels.

> **Note:** Prefer the programmatic approach and custom UI on macOS/Catalyst/iPad. Use the prebuilt editors on the iPhone only.

## Inserting Images Using the UI

CE.SDK’s UI includes a built-in **image tool** that lets users add images from device sources directly onto the canvas. Once inserted, users can move, resize, crop, rotate, or stack images visually.

<img src={iosUiImage} alt="Image controls on the IMGLY UI" />

**Supported image sources:**

- Photo Roll (Photos app)
- Disk (Files app)
- Camera (device camera)
- Image (project asset library)

In the Asset Library, a user can add images from the Photos app, the camera or the Files app.

<img src={addButtonImage} alt="Add button in the Asset Library" />

You can customize how the image tool appears in the user interface.

## Inserting Images Programmatically

For apps with automation, batch workflows, or logic-driven design experiences, you can insert images into a scene using the block API and the graphics engine.

Here’s how to do it:

```swift
// 1. Create a graphic block
let imageBlock = try engine.block.create(.graphic)

// 2. Create a shape for the image
let shape = try engine.block.createShape(.rect)
try engine.block.setShape(imageBlock, shape: shape)

// 3. Create an image fill
let imageFill = try engine.block.createFill(.image)
try engine.block.setString(
    imageFill,
    property: "fill/image/imageFileURI",
    value: "https://img.ly/static/ubq_samples/sample_4.jpg"
)
try engine.block.setFill(imageBlock, fill: imageFill)

// 4. (Optional) Set semantic kind to "image" for clarity
try engine.block.setKind(imageBlock, kind: "image")

// 5. Add image to the scene
let page = try engine.block.find(byType: .page).first!
try engine.block.appendChild(page, child: imageBlock)
```

The `shape` can be any of the supported shapes `.rect`, `.star`, etc and masks the inserted image. The asset URI in step 3 can either be a remote URL or a local asset URI represented as a String.

For assets in the app bundle, get a URL:

```swift
let url = Bundle.main.url(forResource: "poster", withExtension: "jpg")
```

For file assets, use the standard `FileManager`:

```swift
let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
let file = docs.appendingPathComponent("uploads/avatar.png")
```

When working with the asset catalog, you can apply an image that’s an `AssetResult` either to:

- The scene directly
- A block

In the code below `assetList` is an `AssetQueryResult` which is the result of a call to `findAssets` to get assets from an asset catalog.

```swift
guard let newAsset = assetList.assets.first else { return }

// Creates a new block that contains the image
let imageBlock = try await engine.asset.defaultApplyAsset(assetResult: newAsset)

// Applies the image to a block that already exists
try await engine.asset.defaultApplyAssetToBlock(assetResult: newAsset, block: someBlock)
```

## Image Properties

After inserting the image, you can change the block's layout properties using standard methods in the `engine.block` API.

### Positioning

Refer to the guide in the Transform Section for [Move](../edit-image/transform/move.md) for more details and other options.

```swift
// Set X/Y position on the canvas (in absolute units)
try engine.block.setPositionX(imageBlock, value: 100)
try engine.block.setPositionY(imageBlock, value: 200)
```

### Scaling

Refer to the guide in the Transform Section for [Scale](../edit-image/transform/scale.md) for more details and other options.

```swift
// Uniform scale
try engine.block.setFloat(imageBlock, property: "transform/scale/x", value: 1.5)
try engine.block.setFloat(imageBlock, property: "transform/scale/y", value: 1.5)

// Non-uniform (stretching)
try engine.block.setFloat(imageBlock, property: "transform/scale/x", value: 2.0)
try engine.block.setFloat(imageBlock, property: "transform/scale/y", value: 1.0)
```

### Rotation

Refer to the guide in the Transform Section for [Rotate](../edit-image/transform/rotate.md) for more details and other options.

```swift
// Rotate 45 degrees (in radians)
let degrees = 45.0
let radians = degrees * (.pi / 180)
try engine.block.setFloat(imageBlock, property: "transform/rotation", value: Float(radians))
```

### Layering

Control stack order using the helper methods to move blocks forward (towards the user) or backwards. You can also pin a block to the front or back of the stack.

```swift
try engine.block.bringToFront(block) // Move above siblings
try engine.block.sendToBack(block) // Move below siblings
try engine.block.bringForward(block) // One step forward
try engine.block.sendBackward(block) // One step backward

try engine.block.setAlwaysOnTop(block, enabled: true)
```

> **Note:** You can also group images and other elements using `engine.block.group()` for easier layer management.

## Insert Into an Existing Block

If your template exposes a placeholder block or you are creating an automated workflow, you can **replace an image fill** instead of creating a new block. Locate the block using its `name` property (this pairs well with the process for text variables) or by its known `id`.

When you know the `id` of the target:

```swift
let fill = try engine.block.createFill(.image)
try engine.block.setString(fill, property: "fill/image/imageFileURI", value: imageURI)
try engine.block.setFill(targetBlock, fill: fill)
```

When you’re using the `name` property to find the block, `find(byName:)` returns the block `id`:

```swift
guard let targetBlock = engine.block.find(byName: "HeroTile") else { return }

let fill = try engine.block.createFill(.image)
try engine.block.setString(fill, property: "fill/image/imageFileURI", value: imageURI)
try engine.block.setFill(targetBlock, fill: fill)
```

> **Note:** When generating templates, assign names so downstream replacement stays straightforward:```swift
> try engine.block.setString(imageBlock, property: "name", value: "HeroImage")
> ```

## Troubleshooting

**❌ Nothing appears after insert**:

- Verify that the block is attached to the page.
- Verify the URL string is correct (use `.absoluteString` property).
- Check the scene’s current zoom and camera framing.

**❌ Remote images fail**:

- Confirm HTTPS, CORS, or ATS settings.
- Test the URL in a browser.

**❌ Pixelated result**:

- Change the block size or use a higher-resolution source image.

**❌ Unexpected orientation of image**:

- Some formats carry EXIF orientation information. Apply `setRotation` or normalize the asset during import.

## Next Steps

Now that you’ve learned about inserting images into your compositions, here are some topics to explore to deepen your understanding.

- Apply more [transformations](../edit-image/transform.md) such as crop, or scale.
- Create [templates](../create-templates.md) for automating content creation and formatting.
- [Export](../export-save-publish/export.md) compositions in a variety of formats.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support