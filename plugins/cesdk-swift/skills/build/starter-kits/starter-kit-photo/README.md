# Photo Editor Starter Kit for iOS

Professional photo editing for your iOS app — apply filters, adjustments, cropping, and effects. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly).

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
git clone https://github.com/imgly/starterkit-photo-editor-ios.git
cd starterkit-photo-editor-ios
```

### Open in Xcode

```bash
open StarterKit-PhotoEditor.xcodeproj
```

Xcode will resolve the Swift Package dependencies automatically. Select an iOS Simulator or device and press **Run** (Cmd+R).

## Configuration

### License Key

Add your CE.SDK license key in `StarterKit-PhotoEditor/Secrets.swift`:

```swift
let secrets = Secrets(
  // ...
  licenseKey: "your-license-key"
)
```

Without a license key, the editor runs in evaluation mode with a watermark.

### Customization

The starter kit files in `StarterKit/` demonstrate how to customize the editor:

- **Configuration** — `PhotoEditorConfiguration.swift`
- **Callbacks** — `callbacks/` (onCreate, onChanged, onExport, onLoaded)
- **Components** — `components/` (navigation bar, dock, inspector bar, canvas menu)

## Architecture

```
starterkit-photo-editor-ios/
├── StarterKit-PhotoEditor.xcodeproj/
├── StarterKit-PhotoEditor/
│   ├── StarterKit_PhotoEditorApp.swift  # @main entry point
│   ├── ContentView.swift               # Root view launching the starter kit
│   └── Secrets.swift                   # License key configuration
└── StarterKit/
    ├── PhotoEditorStarterKit.swift
    ├── PhotoEditorConfiguration.swift
    ├── callbacks/                      # Lifecycle callbacks
    └── components/                     # UI component customization
```

## Key Capabilities

- **Filters** — Professional photo filters and effects
- **Adjustments** — Brightness, contrast, saturation, and more
- **Cutouts** — Background removal and selective editing
- **Stickers** — Add stickers and overlays
- **Text** — Add text with typography controls
- **Export** — PNG, JPEG with quality controls

## Documentation

For complete integration guides and API reference, visit the [CE.SDK iOS Documentation](https://img.ly/docs/cesdk/ios/quickstart/).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-photo-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-photo-editor">IMG.LY</a></p>
