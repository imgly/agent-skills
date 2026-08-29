> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Batch Processing](./batch-processing.md)

---

Batch processing lets your app automatically generate scores of assets from a single design template. For example, you might create 100 personalized posters or social posts from a CSV file of names and photos, without opening the editor for each one. CE.SDK’s headless engine makes this possible entirely in Swift.

This guide shows you how to do that in Swift for iOS, macOS, and Catalyst. You’ll learn how to load a saved design, substitute text and images, and export each variation as an asset file. The same techniques apply to more complex outputs like PDFs or videos.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-automation-batch)

## What You’ll Learn

- How to start CE.SDK’s **headless engine** without a UI editor.
- How to **load a template** from an archive and attach it to a new scene.
- How to **replace variables and images** for each record in your data.
- How to **export** each generated design as a common format like PNG, JPEG or PDF.

## When You’ll Use This

Headless batch generation is ideal for tasks that need automation, not user interaction. Use it to mass-produce:

- Branded materials
- Social media graphics
- Dynamic thumbnails

Because you're not displaying the editor UI, it works equally well on iOS, macOS, and Catalyst.

## Headless Engine

At the center of CE.SDK is the `Engine`, a lightweight rendering system you can use without the prebuilt editors. It can run in the background, respond to async tasks, and render scenes directly to image data.

```swift
let engine = try await Engine(license: "<your license>")
```

For automation, you’ll typically create one `Engine` instance for the full batch run.

- **On mobile**, a single-engine, sequential approach is safest.
- **On more powerful hardware**, you can explore modest parallelism, as each instance of `Engine` is independent.

## Loading Templates

The template defines the design you’ll use for all generated images. You can:

1. Create a template in the CE.SDK editor.
2. Save it as an archive.
3. Add that archive to your app bundle under **Copy Bundle Resources** in Xcode. Or host it somewhere with a valid `URL` for the batch to use.

```swift
static var archiveURL: URL {
  guard let url = Bundle.main.url(forResource: "Template", withExtension: "archive") else {
    fatalError("Missing Template.archive in bundle")
  }
  return url
}
```

**Archives** are self-contained, they include:

- Your layout
- Text
- All linked assets.

They’re ideal for predictable batch exports. You can choose to save templates as `String` types, but in those cases, the `URL` of every asset must resolve correctly at runtime.

Once loaded, always validate the structure before using it.

```swift
let blocks = try await engine.block.loadArchive(from: url)
if blocks.isEmpty { throw BatchError.invalidTemplate }
```

This ensures that missing or corrupt templates don’t interrupt your batch.

`loadArchive(from:)` returns the blocks for your design, which you then attach to a page so the engine can render, modify, and export it.

If you want the archive to replace the whole scene, load it with `engine.scene.load(from:)` instead.

```swift
  let scene = try await engine.scene.load(from: url)
```

## Supplying Data from JSON

Every batch needs a list of records. Each record holds the values to apply to the template. A common pattern is:

1. Store them as a JSON array.
2. Decode them during the batch.

A record might have these properties.

```swift
struct Record: Codable, Hashable {
var id: String
var variables: [String: String]
var outputFileName: String
var images: [String: String]? // optional blockName → bundled image name
}
```

Then decode any JSON using a standard pattern.

```swift
func loadRecords() -> [Record] {
  guard let url = Bundle.main.url(forResource: "records", withExtension: "json"),
  let data = try? Data(contentsOf: url) else { return [] }
  return (try? JSONDecoder().decode([Record].self, from: data)) ?? []
}
```

Example `records.json`

```json
[
  {
    "id": "001",
    "variables": { "name": "Ruth", "tagline": "Ship great apps" },
    "outputFileName": "badge-ruth"
  },
  {
    "id": "002",
    "variables": { "name": "Chris", "tagline": "Move fast, polish later" },
    "outputFileName": "badge-chris"
}
]
```

In a production environment, you’ll load data from an API or database instead of the bundle. If your dataset is large, consider streaming it in chunks instead of loading everything at once.

## Templates and Variables

Templates often include placeholders, or variables, that you can update with real data at runtime. In CE.SDK (Swift), template variables follow a key/value pattern and are **always stored as strings**. Your app can convert them into types like numbers or colors when needed. For text blocks, CE.SDK automatically matches placeholders in the template with variable names. Displaying `\{\{username\}\}` as the text in a text box, becomes the variable `username` you can replace with a person’s name before exporting.

```swift
// All variables are set via (key:String, value:String)
try engine.variable.set(key: "name", value: "Chris") // text
try engine.variable.set(key: "price", value: "9.99") // number encoded as string
try engine.variable.set(key: "brandColor", value: "#FFD60A") // color as hex string
try engine.variable.set(key: "isFeatured", value: "true") // boolean as "true" / "false"
try engine.variable.set(key: "imageURL", value: record.imageURL.absoluteString) // URL as string
```

Discover the available variable keys at runtime to validate a template using:

```swift
let keys = engine.variable.findAll()
// assert or log missing keys before a long batch run
```

## Applying Data to the Template

Once the engine loads the template, you can fill in variables. These correspond to the placeholders you set in your CE.SDK scene, like `\{\{name\}\}` or `\{\{tagline\}\}`.

```swift
@MainActor
func applyVariables(_ engine: Engine, values: [String: String]) throws {
  for (key, value) in values {
    try engine.variable.set(key: key, value: value)
  }
}
```

You can also swap out placeholder images at runtime. The simplest method is to find the block by its name and update its image fill.

```swift
let matches = try engine.block.find(byName: "productImage")
if let imageBlock = matches.first {
  let fill = try engine.block.getFill(block)
  try engine.block.setString(fill, property: "fill/image/fileURI", value: record.imageURL.absoluteString)
  try engine.block.setFill(imageBlock, fill: fill)
  try engine.block.setKind(imageBlock, kind: "image")
}
```

This snippet looks up a block named `productImage` and replaces its image fill with the URL of the new image.

> **Note:** Using block names keeps your automation readable and less fragile than referencing IDs.

## Create Thumbnails

You can generate previews by exporting a scaled version of each result:

```swift
func exportThumbnail(from engine: Engine, fileName: String, scale: CGFloat = 0.25) throws -> URL {
  let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
  let thumbURL = dir.appendingPathComponent("thumb_\(fileName).jpg")
  let root = try engine.scene.get()
  let width = try engine.block.getFrameWidth(root) * Float(scale)
  let height = try engine.block.getFrameHeight(root) * Float(scale)

  let options = ExportOptions(jpegQuality: 0.7, targetWidth: width, targetHeight: height)
  let exportData = try engine.block.export(root, mimeType: .jpeg, options: options)
  try exportData.write(to:url)
  
 return thumbURL
}
```

## Exporting to Multiple Formats

Exports can target different output types. Just switch the mime type you pass:

```swift
let pngData = try await engine.block.export(page, mimeType: .png, options: ExportOptions(targetHeight: 1080))
let pdfData = try await engine.block.export(page, mimeType: .pdf)
```

|Format|	MimeType|	Typical Use|
|---|---|---|
|PNG	|image/png	|Lossless images with transparency|
|JPEG	|image/jpeg	|Photos and smaller files|
|PDF	|application/pdf	|Printable designs|
|MP4	|video/mp4	|Animated or timed templates|

Use an `ExportOptions` struct to tune output quality, size and other properties of the export. You can get the details in the [Export](../export-save-publish/export.md) guides.

If you need multiple formats at once, run several export calls back-to-back using the same engine and page.

## Managing Memory and Resources

Each export involves GPU textures, image buffers, and temporary files. To keep your app responsive:

- Reuse a single engine for sequential jobs.
- Clean up temporary directories between batches.

## Performance Tuning Checklist

- Use JPEG quality 0.8–0.9 to balance file size and speed.
- Keep templates plain. Avoid unnecessary effects or large images.
- Chunk data into smaller groups for large datasets.
- Limit concurrency to 2–3 parallel tasks.
- Profile on the lowest device you support.

## Error Handling and Retries

Batch jobs can fail for network hiccups or invalid data. Use Swift’s do/catch blocks to retry a few times before giving up.

```swift

for record in records {
  var attempts = 0
  while attempts < 3 {
    do {
      try await exportRecord(record)
        break
       } catch {
         attempts += 1
         try await Task.sleep(nanoseconds: UInt64(Double(attempts) * 0.5e9))
    }
  }
}
```

You can also log each attempt for easier debugging.

## Logging and Monitoring Progress

Adding logging helps track how long each export takes:

```swift
import os.log
let logger = Logger(subsystem: "com.example.batch", category: "automation")
logger.info("Exported \(record.name, privacy: .public)")
```

Wrap your entire run in timestamps using standard Swift `Date` or `DispatchTime` to measure throughput and display progress in your SwiftUI interface.

## Batch Workflow

Batch processing isn’t limited to mobile apps. The same logic can run on backends or web services using CE.SDK for Web or Node. If your workload scales beyond device limits, consider:

1. Migrating automation to a server workflow.
2. Sending results back to the app.

An example batch process, below, calls `processRecord(_:)` for each record in the data set. The record is processed by:

1. loading the template
2. setting variables
3. replacing images
4. exporting the result

```swift
@MainActor
func processRecord(_ record: Record) async throws -> URL {
    let engine = try await EngineFactory.make()
    let scene = try await engine.scene.load(from: Template.archiveURL)
    try applyVariables(engine, values: record.variables)

    if let imgs = record.images {
        for (blockName, fileName) in imgs {
            try replaceNamedImage(engine, name: blockName, fileName: fileName)
        }
    }

    let outURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!.appendingPathComponent("\(record.outputFileName).jpg")
    
    try Exporter.exportJPEG(engine, sceneBlock: scene, to: outURL, quality: 0.9)

  return outURL
}

struct EngineFactory {
    static func make() async throws -> Engine {
        let engine = try await Engine(license: secrets.licenseKey)
        return engine
    }
}

func replaceNamedImage(_ engine: Engine, name: String, fileName: String) throws {
    guard let fileURL = Bundle.main.url(forResource: fileName, withExtension: nil) else { return }
    if let block = try engine.block.find(byName: name).first {
         // Update the block's image fill via its fileURI
      let fill = try engine.block.getFill(block)
        try engine.block.setString(fill, property: "fill/image/fileURI", value: fileURL.absoluteString)
      try engine.block.setFill(block, fill: fill)
    }
}

enum Exporter {
  @MainActor
  static func exportJPEG(_ engine: Engine, sceneOrPage: DesignBlockID, to url: URL, quality: Float = 0.9) async throws {
    let options = ExportOptions(jpegQuality: quality)
    let exportedData = try await engine.block.export(sceneOrPage, mimeType: .jpeg, options: options)
    try exportedData.write(to: url)
  }
}
```

Use a small concurrency limit for parallel runs:

```swift
@MainActor
func runBatchParallel(records: [Record], maxConcurrent: Int = 3) async {
    await withTaskGroup(of: Void.self) { group in
        var iterator = records.makeIterator()
        for _ in 0..<min(maxConcurrent, records.count) {
            if let next = iterator.next() { group.addTask { await process(next) } }
        }
        for await _ in group {
            if let next = iterator.next() { group.addTask { await process(next) } }
        }
    }

    @Sendable func process(_ record: Record) async {
        do { _ = try await processRecord(record) } catch { print(error) }
    }
}
```

## Troubleshooting

**❌ Your exports appear blank**:

- Remember that `loadArchive(from:)` returns detached blocks. Always attach them to a scene and page before exporting.

**❌ Text variables don’t update**:

- Double-check their names in the template and verify case sensitivity with `engine.variable.findAll()`.

**❌ Your image placeholder doesn’t update**:

- Ensure you’re setting the correct property path: `fill/image/fileURI`. Also confirm that the block’s kind is `image` after applying the new fill.
- Verify that the `URL` of the new image fill is valid.

**❌ The batch job becomes sluggish**:

- Performance issues are rare in sequential runs, but if you attempt parallel exports:

- Limit concurrency to a few simultaneous tasks.

- Reuse a single engine instance.

## Next Steps

Continue learning about automation and export workflows with these related guides:

- Use Templates to  [generate content](../use-templates/generate.md).
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) & [Placeholders](../create-templates/add-dynamic-content/placeholders.md) for dynamic content.
- [Export assets](../export-save-publish/export.md) in different forms.
- Generate [multiple assets](./multi-image-generation.md) from a single record.
- Create [Preview Thumbnails](../export-save-publish/create-thumbnail.md).

These guides expand on how to prepare templates, manage variable data, and optimize export pipelines for larger-scale automation.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support