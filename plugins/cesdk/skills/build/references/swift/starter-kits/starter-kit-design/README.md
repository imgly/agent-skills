# Design Editor Starter Kit for iOS

Create stunning graphics and layouts for your iOS app — add text, images, shapes, and export to multiple formats. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly).

<p>
  <a href="https://img.ly/docs/cesdk/ios/quickstart/">Documentation</a> |
  <a href="https://img.ly/showcases/cesdk">Live Demo</a>
</p>

## Getting Started

### Prerequisites

- [Xcode](https://developer.apple.com/xcode/)
- Swift 6+
- iOS 16+ deployment target

### Clone the Repository

```bash
git clone https://github.com/imgly/starterkit-design-editor-ios.git
cd starterkit-design-editor-ios
```

### Open in Xcode

```bash
open StarterKit-DesignEditor.xcodeproj
```

Xcode will resolve the Swift Package dependencies automatically. Select an iOS Simulator or device and press **Run** (Cmd+R).

## Configuration

### License Key

Add your CE.SDK license key in `StarterKit-DesignEditor/Secrets.swift`:

```swift
let secrets = Secrets(
  // ...
  licenseKey: "your-license-key"
)
```

Without a license key, the editor runs in evaluation mode with a watermark.

### Customization

The starter kit files in `StarterKit/` demonstrate how to customize the editor:

- **Configuration** — `DesignEditorConfiguration.swift`
- **Callbacks** — `callbacks/` (onCreate, onExport)
- **Components** — `components/` (navigation bar, dock, inspector bar, canvas menu)

## Architecture

```
starterkit-design-editor-ios/
├── StarterKit-DesignEditor.xcodeproj/
├── StarterKit-DesignEditor/
│   ├── StarterKit_DesignEditorApp.swift  # @main entry point
│   ├── ContentView.swift                # Root view launching the starter kit
│   └── Secrets.swift                    # License key configuration
└── StarterKit/
    ├── DesignEditorStarterKit.swift
    ├── DesignEditorConfiguration.swift
    ├── callbacks/                       # Lifecycle callbacks
    └── components/                      # UI component customization
```

## Key Capabilities

- **Text Editing** — Typography with fonts, styles, and effects
- **Image Placement** — Add, crop, and arrange images
- **Shapes & Graphics** — Vector shapes and design elements
- **Templates** — Start from pre-built design templates
- **Multi-Page** — Create multi-page documents
- **Export** — PNG, JPEG, PDF with quality controls

## Documentation

For complete integration guides and API reference, visit the [CE.SDK iOS Documentation](https://img.ly/docs/cesdk/ios/quickstart/).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-design-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-design-editor">IMG.LY</a></p>
