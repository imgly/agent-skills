> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Moderate Content](./moderate-content.md)

---

```swift file=@cesdk_swift_examples/engine-guides-moderate-content/ModerateContent.swift reference-only
import Foundation
import IMGLYEngine

/// Severity level derived from a moderation confidence score.
private enum ModerationState {
  case success
  case warning
  case failed
}

/// A content category returned by a moderation service.
private struct ModerationCategory: Sendable {
  let name: String
  let description: String
  let state: ModerationState
}

/// A graphic block with an image fill, ready to moderate.
private struct ModerationImageBlock: Sendable {
  let blockID: DesignBlockID
  let blockName: String
  let url: URL
}

/// A text block, ready to moderate.
private struct ModerationTextBlock: Sendable {
  let blockID: DesignBlockID
  let blockName: String
  let text: String
}

/// A moderation result tied to a specific design block.
private struct ModerationResult: Sendable {
  let id: String
  let blockID: DesignBlockID
  let blockName: String
  let category: ModerationCategory
  let content: String
}

// Caches keyed by content to avoid redundant moderation calls. In production,
// back these with a persistent store such as NSCache.
@MainActor private var imageModerationCache: [URL: [ModerationCategory]] = [:]
@MainActor private var textModerationCache: [String: [ModerationCategory]] = [:]

@MainActor
func moderateContent(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  // Demo scaffolding: build a page with one image block and one text block so
  // there is content to moderate. In your app the scene already holds the
  // user's content.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1200)
  try engine.block.setHeight(page, value: 800)
  try engine.block.appendChild(to: scene, child: page)

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.setPositionX(imageBlock, value: 100)
  try engine.block.setPositionY(imageBlock, value: 200)
  try engine.block.setWidth(imageBlock, value: 500)
  try engine.block.setHeight(imageBlock, value: 400)
  try engine.block.appendChild(to: page, child: imageBlock)

  let textBlock = try engine.block.create(.text)
  try engine.block.setString(textBlock, property: "text/text", value: "Sample text content for moderation testing")
  try engine.block.setFloat(textBlock, property: "text/fontSize", value: 48)
  try engine.block.setPositionX(textBlock, value: 650)
  try engine.block.setPositionY(textBlock, value: 340)
  try engine.block.setWidth(textBlock, value: 450)
  try engine.block.setHeight(textBlock, value: 120)
  try engine.block.appendChild(to: page, child: textBlock)

  // Find and moderate every image and text block.
  let imageResults = try await checkImageContent(engine: engine)
  let textResults = try await checkTextContent(engine: engine)
  let allResults = imageResults + textResults

  // Report the results, highlight the first violation, and gate export on them.
  displayResults(allResults)
  try selectFirstViolation(engine: engine, results: allResults)
  try await exportIfAllowed(engine: engine, page: page, results: allResults)
}

/// Returns the image URL for a graphic block, or `nil` when the block's fill is
/// not an image fill. Filtering by fill type catches every image reliably,
/// regardless of the block's `kind`.
@MainActor
private func getImageURL(engine: Engine, blockID: DesignBlockID) -> URL? {
  guard let fill = try? engine.block.getFill(blockID),
        (try? engine.block.getType(fill)) == FillType.image.rawValue else {
    return nil
  }

  if let url = try? engine.block.getURL(fill, property: "fill/image/imageFileURI") {
    return url
  }

  if let sourceSet = try? engine.block.getSourceSet(fill, property: "fill/image/sourceSet"),
     let first = sourceSet.first {
    return first.uri
  }

  return nil
}

/// Finds every graphic block with an image fill and moderates each one concurrently.
@MainActor
private func checkImageContent(engine: Engine) async throws -> [ModerationResult] {
  let graphicBlockIDs = try engine.block.find(byType: .graphic)
  let imageBlocks: [ModerationImageBlock] = try graphicBlockIDs.compactMap { blockID in
    guard let url = getImageURL(engine: engine, blockID: blockID) else { return nil }
    return ModerationImageBlock(
      blockID: blockID,
      blockName: try engine.block.getName(blockID),
      url: url,
    )
  }

  return try await withThrowingTaskGroup(of: [ModerationResult].self) { group in
    for block in imageBlocks {
      group.addTask {
        let categories = try await checkImageContentAPI(url: block.url)
        return categories.map { category in
          ModerationResult(
            id: "\(block.blockID)-\(category.name)",
            blockID: block.blockID,
            blockName: block.blockName,
            category: category,
            content: block.url.absoluteString,
          )
        }
      }
    }

    var results: [ModerationResult] = []
    for try await batch in group {
      results.append(contentsOf: batch)
    }
    return results
  }
}

/// Extracts the text content from a text block.
@MainActor
private func getTextContent(engine: Engine, blockID: DesignBlockID) -> String {
  (try? engine.block.getString(blockID, property: "text/text")) ?? ""
}

/// Finds every text block, extracts its content, and moderates each one concurrently.
@MainActor
private func checkTextContent(engine: Engine) async throws -> [ModerationResult] {
  let textBlockIDs = try engine.block.find(byType: .text)
  let textBlocks: [ModerationTextBlock] = try textBlockIDs.compactMap { blockID in
    let text = getTextContent(engine: engine, blockID: blockID)
    guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      return nil
    }
    return ModerationTextBlock(
      blockID: blockID,
      blockName: try engine.block.getName(blockID),
      text: text,
    )
  }

  return try await withThrowingTaskGroup(of: [ModerationResult].self) { group in
    for block in textBlocks {
      group.addTask {
        let categories = try await checkTextContentAPI(text: block.text)
        return categories.map { category in
          ModerationResult(
            id: "\(block.blockID)-\(category.name)",
            blockID: block.blockID,
            blockName: block.blockName,
            category: category,
            content: block.text,
          )
        }
      }
    }

    var results: [ModerationResult] = []
    for try await batch in group {
      results.append(contentsOf: batch)
    }
    return results
  }
}

/// Simulates an image moderation API call. Replace this with a real request to
/// your moderation service, proxied through your backend.
@MainActor
private func checkImageContentAPI(url: URL) async throws -> [ModerationCategory] {
  if let cached = imageModerationCache[url] {
    return cached
  }

  // Simulate network latency before the service responds.
  try await Task.sleep(nanoseconds: 100_000_000)

  let categories = [
    ModerationCategory(
      name: "Weapons",
      description: "Handguns, rifles, machine guns, threatening knives",
      state: percentageToState(.random(in: 0.0 ... 0.3)),
    ),
    ModerationCategory(
      name: "Alcohol",
      description: "Wine, beer, cocktails, champagne",
      state: percentageToState(.random(in: 0.0 ... 0.4)),
    ),
    ModerationCategory(
      name: "Drugs",
      description: "Cannabis, syringes, glass pipes, bongs, pills",
      state: percentageToState(.random(in: 0.0 ... 0.2)),
    ),
    ModerationCategory(
      name: "Nudity",
      description: "Raw or partial nudity",
      state: percentageToState(.random(in: 0.0 ... 0.3)),
    ),
  ]

  imageModerationCache[url] = categories
  return categories
}

/// Simulates a text moderation API call. Replace this with a real request to
/// your moderation service, proxied through your backend.
@MainActor
private func checkTextContentAPI(text: String) async throws -> [ModerationCategory] {
  if let cached = textModerationCache[text] {
    return cached
  }

  // Simulate network latency before the service responds.
  try await Task.sleep(nanoseconds: 100_000_000)

  let categories = [
    ModerationCategory(
      name: "Profanity",
      description: "Offensive or vulgar language",
      state: percentageToState(.random(in: 0.0 ... 0.3)),
    ),
    ModerationCategory(
      name: "Hate Speech",
      description: "Content promoting hatred or discrimination",
      state: percentageToState(.random(in: 0.0 ... 0.2)),
    ),
    ModerationCategory(
      name: "Threats",
      description: "Threatening or violent language",
      state: percentageToState(.random(in: 0.0 ... 0.1)),
    ),
  ]

  textModerationCache[text] = categories
  return categories
}

/// Maps a moderation confidence score to a severity level.
private func percentageToState(_ percentage: Double) -> ModerationState {
  if percentage > 0.8 {
    .failed
  } else if percentage > 0.4 {
    .warning
  } else {
    .success
  }
}

/// Groups results by severity and prints a summary.
private func displayResults(_ results: [ModerationResult]) {
  let failed = results.filter { $0.category.state == .failed }
  let warnings = results.filter { $0.category.state == .warning }
  let passed = results.filter { $0.category.state == .success }

  print("Content moderation results:")
  print("- Total checks: \(results.count)")
  print("- Violations: \(failed.count)")
  print("- Warnings: \(warnings.count)")
  print("- Passed: \(passed.count)")

  for violation in failed {
    print("Violation — \(violation.category.name) in \(violation.blockName): \(violation.content)")
  }
}

/// Selects the block tied to the first violation so the user can locate it.
@MainActor
private func selectFirstViolation(engine: Engine, results: [ModerationResult]) throws {
  guard let violation = results.first(where: { $0.category.state == .failed }) else {
    return
  }

  for selected in engine.block.findAllSelected() {
    try engine.block.setSelected(selected, selected: false)
  }
  try engine.block.setSelected(violation.blockID, selected: true)
}

/// Exports the page only when no moderation violations are present.
@MainActor
private func exportIfAllowed(engine: Engine, page: DesignBlockID, results: [ModerationResult]) async throws {
  let violations = results.filter { $0.category.state == .failed }
  guard violations.isEmpty else {
    print("Export blocked: \(violations.count) policy violation(s) detected.")
    return
  }

  let data = try await engine.block.export(page, mimeType: .png)
  print("Validation passed — exported \(data.count) bytes.")
}

```

Use CE.SDK's Engine API to extract images and text from designs, then
integrate third-party moderation services to detect inappropriate content.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-moderate-content)

<EngineReferenceNote {...props} />

CE.SDK does not provide prebuilt content moderation workflows. Instead, it provides engine APIs that extract images and text from designs for moderation by third-party services of your choice. This is intentional: moderation requirements are specific to each business — which categories to check, what thresholds to apply, and which services to use. When and where to check content (during editing, before export, on upload) also varies with your workflow.

Content moderation helps maintain quality standards and comply with content policies. Unlike built-in validation rules that check technical aspects like resolution or layout, content moderation relies on external AI services (Sightengine, AWS Rekognition, OpenAI Moderation API) to analyze visual content (images for weapons, drugs, nudity) and textual content (profanity, hate speech, threats).

Each finding is a `ModerationResult` built from a `ModerationCategory`. The example source also defines the small `ModerationImageBlock` and `ModerationTextBlock` value types that the extraction helpers return.

## Finding Content in Designs

Locate all images and text blocks, then extract the data needed for moderation.

**Images**: Use `find(byType:)` with `DesignBlockType.graphic` to find graphic blocks, then keep the ones whose fill is an image fill. Comparing the fill's type to `FillType.image` reliably catches every image — a block's `kind` is a free-form string that isn't guaranteed to be set, so filtering by fill type is the dependable approach. `getFill(_:)` returns the fill block, and `getURL(_:property:)` reads its `fill/image/imageFileURI` property as a Swift `URL`, with the source set as a fallback:

```swift highlight-moderateContent-getImageURL
/// Returns the image URL for a graphic block, or `nil` when the block's fill is
/// not an image fill. Filtering by fill type catches every image reliably,
/// regardless of the block's `kind`.
@MainActor
private func getImageURL(engine: Engine, blockID: DesignBlockID) -> URL? {
  guard let fill = try? engine.block.getFill(blockID),
        (try? engine.block.getType(fill)) == FillType.image.rawValue else {
    return nil
  }

  if let url = try? engine.block.getURL(fill, property: "fill/image/imageFileURI") {
    return url
  }

  if let sourceSet = try? engine.block.getSourceSet(fill, property: "fill/image/sourceSet"),
     let first = sourceSet.first {
    return first.uri
  }

  return nil
}
```

Process every image by checking each URL against the moderation service:

```swift highlight-moderateContent-checkAllImages
/// Finds every graphic block with an image fill and moderates each one concurrently.
@MainActor
private func checkImageContent(engine: Engine) async throws -> [ModerationResult] {
  let graphicBlockIDs = try engine.block.find(byType: .graphic)
  let imageBlocks: [ModerationImageBlock] = try graphicBlockIDs.compactMap { blockID in
    guard let url = getImageURL(engine: engine, blockID: blockID) else { return nil }
    return ModerationImageBlock(
      blockID: blockID,
      blockName: try engine.block.getName(blockID),
      url: url,
    )
  }

  return try await withThrowingTaskGroup(of: [ModerationResult].self) { group in
    for block in imageBlocks {
      group.addTask {
        let categories = try await checkImageContentAPI(url: block.url)
        return categories.map { category in
          ModerationResult(
            id: "\(block.blockID)-\(category.name)",
            blockID: block.blockID,
            blockName: block.blockName,
            category: category,
            content: block.url.absoluteString,
          )
        }
      }
    }

    var results: [ModerationResult] = []
    for try await batch in group {
      results.append(contentsOf: batch)
    }
    return results
  }
}
```

**Text**: Use `find(byType:)` with `DesignBlockType.text` to find text blocks, then read their content from the `text/text` property:

```swift highlight-moderateContent-getTextContent
/// Extracts the text content from a text block.
@MainActor
private func getTextContent(engine: Engine, blockID: DesignBlockID) -> String {
  (try? engine.block.getString(blockID, property: "text/text")) ?? ""
}
```

Process every text block by checking each string against the moderation service:

```swift highlight-moderateContent-checkAllText
/// Finds every text block, extracts its content, and moderates each one concurrently.
@MainActor
private func checkTextContent(engine: Engine) async throws -> [ModerationResult] {
  let textBlockIDs = try engine.block.find(byType: .text)
  let textBlocks: [ModerationTextBlock] = try textBlockIDs.compactMap { blockID in
    let text = getTextContent(engine: engine, blockID: blockID)
    guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      return nil
    }
    return ModerationTextBlock(
      blockID: blockID,
      blockName: try engine.block.getName(blockID),
      text: text,
    )
  }

  return try await withThrowingTaskGroup(of: [ModerationResult].self) { group in
    for block in textBlocks {
      group.addTask {
        let categories = try await checkTextContentAPI(text: block.text)
        return categories.map { category in
          ModerationResult(
            id: "\(block.blockID)-\(category.name)",
            blockID: block.blockID,
            blockName: block.blockName,
            category: category,
            content: block.text,
          )
        }
      }
    }

    var results: [ModerationResult] = []
    for try await batch in group {
      results.append(contentsOf: batch)
    }
    return results
  }
}
```

Both checks use a `withThrowingTaskGroup` to moderate multiple items concurrently.

## Integrating Moderation APIs

Integrate external AI services (Sightengine, AWS Rekognition, OpenAI Moderation API) to analyze content. Always proxy requests through your backend so credentials never ship in your app, and apply rate limiting and authentication there.

**Image Moderation** — The example uses a simulated API call that you replace with your moderation service. It returns content categories with confidence scores and caches them by URL to avoid redundant calls:

```swift highlight-moderateContent-imageModerationAPI
/// Simulates an image moderation API call. Replace this with a real request to
/// your moderation service, proxied through your backend.
@MainActor
private func checkImageContentAPI(url: URL) async throws -> [ModerationCategory] {
  if let cached = imageModerationCache[url] {
    return cached
  }

  // Simulate network latency before the service responds.
  try await Task.sleep(nanoseconds: 100_000_000)

  let categories = [
    ModerationCategory(
      name: "Weapons",
      description: "Handguns, rifles, machine guns, threatening knives",
      state: percentageToState(.random(in: 0.0 ... 0.3)),
    ),
    ModerationCategory(
      name: "Alcohol",
      description: "Wine, beer, cocktails, champagne",
      state: percentageToState(.random(in: 0.0 ... 0.4)),
    ),
    ModerationCategory(
      name: "Drugs",
      description: "Cannabis, syringes, glass pipes, bongs, pills",
      state: percentageToState(.random(in: 0.0 ... 0.2)),
    ),
    ModerationCategory(
      name: "Nudity",
      description: "Raw or partial nudity",
      state: percentageToState(.random(in: 0.0 ... 0.3)),
    ),
  ]

  imageModerationCache[url] = categories
  return categories
}
```

In production, replace the simulated body with a request to your backend endpoint that proxies services like Sightengine or AWS Rekognition.

**Text Moderation** — The text check follows the same shape. Replace the simulated body with your text moderation service:

```swift highlight-moderateContent-textModerationAPI
/// Simulates a text moderation API call. Replace this with a real request to
/// your moderation service, proxied through your backend.
@MainActor
private func checkTextContentAPI(text: String) async throws -> [ModerationCategory] {
  if let cached = textModerationCache[text] {
    return cached
  }

  // Simulate network latency before the service responds.
  try await Task.sleep(nanoseconds: 100_000_000)

  let categories = [
    ModerationCategory(
      name: "Profanity",
      description: "Offensive or vulgar language",
      state: percentageToState(.random(in: 0.0 ... 0.3)),
    ),
    ModerationCategory(
      name: "Hate Speech",
      description: "Content promoting hatred or discrimination",
      state: percentageToState(.random(in: 0.0 ... 0.2)),
    ),
    ModerationCategory(
      name: "Threats",
      description: "Threatening or violent language",
      state: percentageToState(.random(in: 0.0 ... 0.1)),
    ),
  ]

  textModerationCache[text] = categories
  return categories
}
```

In production, replace the simulation with calls to services like the OpenAI Moderation API or Perspective API through your backend.

**Processing Results** — Map confidence scores to severity levels (failed above `0.8`, warning above `0.4`, success at or below `0.4`):

```swift highlight-moderateContent-thresholdMapping
/// Maps a moderation confidence score to a severity level.
private func percentageToState(_ percentage: Double) -> ModerationState {
  if percentage > 0.8 {
    .failed
  } else if percentage > 0.4 {
    .warning
  } else {
    .success
  }
}
```

## Displaying Validation Results

Group results by severity and surface them to the user:

```swift highlight-moderateContent-displayResults
/// Groups results by severity and prints a summary.
private func displayResults(_ results: [ModerationResult]) {
  let failed = results.filter { $0.category.state == .failed }
  let warnings = results.filter { $0.category.state == .warning }
  let passed = results.filter { $0.category.state == .success }

  print("Content moderation results:")
  print("- Total checks: \(results.count)")
  print("- Violations: \(failed.count)")
  print("- Warnings: \(warnings.count)")
  print("- Passed: \(passed.count)")

  for violation in failed {
    print("Violation — \(violation.category.name) in \(violation.blockName): \(violation.content)")
  }
}
```

Make results actionable by selecting the corresponding block when the user picks a finding. This helps them locate problematic content on the canvas. `findAllSelected()` returns the current selection so you can clear it before selecting the flagged block:

```swift highlight-moderateContent-interactiveResults
/// Selects the block tied to the first violation so the user can locate it.
@MainActor
private func selectFirstViolation(engine: Engine, results: [ModerationResult]) throws {
  guard let violation = results.first(where: { $0.category.state == .failed }) else {
    return
  }

  for selected in engine.block.findAllSelected() {
    try engine.block.setSelected(selected, selected: false)
  }
  try engine.block.setSelected(violation.blockID, selected: true)
}
```

## Integration Points

Run validation at the point that fits your workflow. The most common gate is export: validate the design and refuse to render it when violations exist. The example checks the results and only then renders the page to PNG with `engine.block.export(_:mimeType:)` using `MIMEType.png`:

```swift highlight-moderateContent-exportValidation
/// Exports the page only when no moderation violations are present.
@MainActor
private func exportIfAllowed(engine: Engine, page: DesignBlockID, results: [ModerationResult]) async throws {
  let violations = results.filter { $0.category.state == .failed }
  guard violations.isEmpty else {
    print("Export blocked: \(violations.count) policy violation(s) detected.")
    return
  }

  let data = try await engine.block.export(page, mimeType: .png)
  print("Validation passed — exported \(data.count) bytes.")
}
```

Other integration points follow the same pattern:

- **Pre-upload validation**: Check before allowing uploads to your platform.
- **Review queue**: Flag designs with warnings for manual review.
- **Batch validation**: Check all content on demand when the user requests it.

## Best Practices

**Security**: Always proxy moderation requests through your backend to protect credentials. Apply rate limiting and require authentication. Log checks for compliance and auditing.

**Performance**: Cache results by URL and text to avoid redundant calls. Moderate multiple items concurrently with a task group.

**User Experience**: Run checks asynchronously so they never block the main actor. Provide clear, actionable messages and let users jump to flagged blocks.

**Timing**: Validate at export time for the best balance between policy enforcement and creative freedom.

## Troubleshooting

**Checks not running**: Verify the engine is initialized, content exists, the moderation endpoint is reachable, and credentials are valid.

**Content not found**: Ensure graphic blocks have an image fill, text blocks aren't empty, and the scene has loaded. Find image blocks with `find(byType: .graphic)` and keep those whose fill type is `FillType.image`. Filtering by a block's `kind` is unreliable — the kind is a free-form string that may be unset on blocks created or loaded outside the editor's image flow.

**API errors**: Check API key validity, endpoint URL, image URL accessibility, rate limits, and service-specific error codes.

**Inconsistent results**: Verify caching behaves as expected, threshold values are appropriate, and API responses parse correctly.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.find(byType:)` | Find all blocks of a `DesignBlockType`, for example `.graphic` or `.text` |
| `engine.block.getFill(_:)` | Get the fill block for a graphic block |
| `engine.block.getType(_:)` | Read a block's or fill's type identifier; compare a fill's type to `FillType.image.rawValue` to detect image fills |
| `engine.block.getURL(_:property:)` | Read a `URL` property such as `fill/image/imageFileURI` |
| `engine.block.getString(_:property:)` | Read a string property such as `text/text` |
| `engine.block.getSourceSet(_:property:)` | Read the image source set as `[Source]` (each `Source.uri` is a `URL`) |
| `engine.block.getName(_:)` | Read a block's display name |
| `engine.block.setSelected(_:selected:)` | Select or deselect a block |
| `engine.block.findAllSelected()` | Get the currently selected blocks |
| `engine.block.export(_:mimeType:)` | Render a block to image data |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `fill/image/imageFileURI` | String | Primary image URL |
| `fill/image/sourceSet` | Array | Responsive image sources with URIs |
| `text/text` | String | Text content of a text block |

## Next Steps

Now that you understand content moderation, explore related validation features:

- [Rules Overview](./overview.md) — Understand the scopes and permission model behind CE.SDK rules



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support