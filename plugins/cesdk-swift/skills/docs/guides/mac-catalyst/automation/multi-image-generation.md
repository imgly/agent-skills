> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Multiple Image Generation](./multi-image-generation.md)

---

Generate image variants, such as square, portrait, or landscape layouts, from a single data record using the CreativeEditor SDK’s Engine API. This pattern lets you populate templates programmatically with text, images, and colors to create consistent, on‑brand designs across all formats.

## What You’ll Learn

- Load multiple templates into CE.SDK and populate them with structured data.
- Replace text and image placeholders dynamically using variables and named blocks.
- Apply consistent brand color themes across scenes.
- Export each variant as PNG, JPEG, or PDF.
- Build a SwiftUI preview for the generated images.

## When to Use It

Use multi‑image generation when a single record (like a restaurant listing or product) needs to produce multiple layout variants. For larger datasets, many records generating many images, refer to the [Batch Processing](./batch-processing.md) guide.

## Core Concepts

**Templates and Instances**:

Templates define reusable layout and placeholders. An instance is a populated version with specific data. Use `scene.saveToString()` to serialize a template and `scene.load(from:)` to load it for processing.

**Variables for Dynamic Text**:

Define variables in your templates for fields like `RestaurantName` or `Rating`. Set them at runtime with `engine.variable.setString(name:value:)`. Use `engine.variable.findAll()` to verify available variable names.

**Named Blocks for Image Replacement**:

Name your image placeholders (for example, `RestaurantImage`, `Logo`). Retrieve them with `engine.block.findByName()`, access the fill with `getFill()`, then update its source URI using `setString(..., property: "fill/image/imageFileURI")`. Always reset the crop after replacing an image fill for proper framing.

**Brand and Conditional Styling**:

Use predictable block naming for elements such as star ratings. Apply color changes programmatically with `setTextColor` or `setColor` to visualize rating or brand status.

**Sequential Template Processing**:

Process each variant one at a time to reduce memory pressure and simplify export tracking.

## Prerequisites

- CE.SDK for iOS integrated through Swift Package Manager.
- A valid license key.
- Templates archived as `.scene` or `.archive` files.
- Template variables and named blocks prepared for population.

## Initialize the Engine

```swift
import IMGLYEngine
import IMGLYCore

@MainActor
func makeEngine() async throws -> Engine {
    let engine = try Engine(license: "<your license key>")

    let baseURL = URL(string: "https://cdn.img.ly/packages/imgly/cesdk-swift/1.81.1-rc.0/assets")!
    let sourceIDs = [
        "ly.img.sticker", "ly.img.vector.shape", "ly.img.filter", "ly.img.color.palette",
        "ly.img.effect", "ly.img.blur", "ly.img.typeface", "ly.img.crop.presets",
        "ly.img.page.presets", "ly.img.text", "ly.img.text.components",
    ]
    for id in sourceIDs {
        try await engine.asset.addLocalAssetSourceFromJSON(
            baseURL.appendingPathComponent(id).appendingPathComponent("content.json")
        )
    }
    return engine
}
```

## Define Your Data Model

Your data model can use proper typing for variables. When you insert values into the templates, you will often need to convert them to strings.

```swift
struct Restaurant: Identifiable, Sendable {
    let id: UUID
    let name: String
    let rating: Double
    let reviewCount: Int
    let imageURL: String
    let logoURL: String
    let brandPrimary: String
    let brandSecondary: String
}
```

This model provides a data record for the example code below.

## Populate Templates and Export Variants

Use one template per format such as:

- square
- portrait
- landscape

Populate the templates sequentially.

```swift
@MainActor
func generateVariants(engine: Engine, for restaurant: Restaurant) async throws -> [URL] {
  let templates = [
    "restaurant_square",
    "restaurant_portrait",
    "restaurant_landscape"
  ].compactMap { Bundle.main.url(forResource: $0, withExtension: "scene") }

  var results: [URL] = []

  for template in templates {
    let scene = try await engine.scene.load(from: template)

      // Set text variables
      try engine.variable.setString("RestaurantName", value: restaurant.name)
      try engine.variable.setString("Rating", value: String(format: "%.1f ★", restaurant.rating))
      try engine.variable.setString("ReviewCount", value: "\(restaurant.reviewCount)")

      // Replace images
      try replaceImage(engine: engine, name: "RestaurantImage", with: restaurant.imageURL)
      try replaceImage(engine: engine, name: "Logo", with: restaurant.logoURL)

      // Apply brand theme
      try applyBrandTheme(engine: engine,
                          primary: Color.fromHex(restaurant.brandPrimary),
                          secondary: Color.fromHex(restaurant.brandSecondary))

      // Export variant
      let output = try await exportJPEG(engine: engine, name: outputName(for: restaurant, template: template))
      results.append(output)
  }
  return results
}
```

**Helper Functions**:

The preceding code example uses some helper functions. These aren’t part of the CE.SDK. Possible implementations of the functions follow. The function for `Color.fromHex()` is at the end of the guide as it’s used in another example as well.

```swift
private func replaceImage(engine: Engine, name: String, with uri: String) throws {
  if let block = engine.block.find(byName: name).first {
    let fill = try engine.block.getFill(block)
    try engine.block.setString(fill, property: "fill/image/fileURI", value: uri)
    try engine.block.resetCrop(fill)
    }
}

private func applyBrandTheme(engine: Engine, primary: Color, secondary: Color) throws {

  for block in try engine.block.findAll() {
    switch try engine.block.getType(block) {
      case "//ly.img.ubq/text":
        try engine.block.setTextColor(block, color: primary)
      case "//ly.img.ubq/graphic":
        if let fill = try? engine.block.getFill(block) {
          try engine.block.setColor(fill, property: "fill/color/value", color: secondary)
        }
      default: break
      }
  }
}

private func exportJPEG(engine: Engine, name: String) async throws -> URL {
  guard let page = try engine.block.find(byType: .page).first else { throw NSError(domain: "no-page", code: 1) }

  let data = try await engine.block.export(page, mimeType: .jpeg)
  let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
  let url = dir.appendingPathComponent("\(name).jpg")
  try data.write(to: url, options: .atomic)
  return url
}
```

## Preview the Generated Variants

Use SwiftUI to display and share generated images.

```swift
struct VariantsGrid: View {
    let urls: [URL]
    @State private var shareURL: URL?

    var body: some View {
        ScrollView {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 160), spacing: 12)]) {
                ForEach(urls, id: \.self) { url in
                    if let image = UIImage(contentsOfFile: url.path) {
                        Button { shareURL = url } label: {
                            Image(uiImage: image)
                                .resizable().scaledToFit()
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .shadow(radius: 2)
                        }
                    }
                }
            }.padding()
        }
        .sheet(item: $shareURL) { url in
            ShareLink(items: [url]) { Text("Share \(url.lastPathComponent)") }
        }
    }
}
```

## Advanced Use Cases

**Conditional Content**:

Show or hide elements based on data values—for example, color stars according to the rating.

```swift
func colorStars(engine: Engine, rating: Int, baseName: String = "Rating") throws {
    for index in 1...5 {
        guard let star = try engine.block.find(byName:"\(baseName)\(index)").first,
              let fill = try? engine.block.getFill(star) else { continue }
        let color = index <= rating ? Color.hex("#FFD60A") : Color.hex("#CCCCCC")
        try engine.block.setColor(fill, property: "fill/color/value", color: color)
    }
}
```

**Custom Assets**:

Add your own logos or fonts by registering a custom asset source. See the [Unsplash](../import-media/from-remote-source/unsplash.md) guide for a complete custom asset source example covering search, pagination, and asset mapping.

**Adopter Mode Editing**

Allow users to open the generated design in the editor UI for minor edits. Serialize the populated scene with `scene.saveToString()` and load it into the Design Editor configured for [restricted content](../create-templates/lock.md) editing.

## Troubleshooting

**❌ Variables not updating**:

- Verify variable names in both template and code.

**❌ Images missing**:

- Confirm local path or remote URL points to a valid image.

**❌ Colors incorrect**:

- Check block type before applying color.

**❌ Memory spikes**:

- Process templates sequentially.

**❌ Export size unexpected**:

- Confirm consistent `page`, `scene` and `block` dimensions across templates.

**Debugging Tips**:

- Print variable names using `engine.variable.findAll()`
- Log block names with `engine.block.getName(id)`
- Test with one minimal template before expanding

## Next Steps

Multi-image generation is one way to automate your workflow. Some other ways the CE.SDK can automate are in these guides:

- [Batch Processing](./batch-processing.md) lets you process many data records at once.
- Adapt layouts across aspect ratios using [auto resize](./auto-resize.md).
- Explore [export formats](../export-save-publish/export.md) and settings.
- Add branded fonts, logos, and graphics by creating custom asset sources, following the [Unsplash](../import-media/from-remote-source/unsplash.md) example.

***

## Utility Extension

Add this helper to convert hex strings into CE.SDK `Color` values. Use it in the guide examples as `Color.fromHex("#FFD60A")` or `Color.fromHex(restaurant.brandPrimary)`.

```swift
import IMGLYCore

extension Color {
    /// Create a CE.SDK Color from a hex string like "#FFAA33" or "#FFAA33FF"
    static func fromHex(_ hex: String) -> Color {
        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: "#", with: "")

        if hexString.count == 6 { hexString.append("FF") } // add alpha if missing

        var hexValue: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&hexValue)

        let r = Float((hexValue & 0xFF000000) >> 24) / 255.0
        let g = Float((hexValue & 0x00FF0000) >> 16) / 255.0
        let b = Float((hexValue & 0x0000FF00) >> 8) / 255.0
        let a = Float((hexValue & 0x000000FF)) / 255.0

        return Color(r: r, g: g, b: b, a: a)
    }
}
```



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support