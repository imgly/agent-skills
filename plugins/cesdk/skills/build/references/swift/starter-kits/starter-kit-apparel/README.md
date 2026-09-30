# Apparel Editor Starter Kit for iOS

Design custom apparel graphics in your iOS app — add text, images, and design elements for t-shirts and clothing. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly).

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
git clone https://github.com/imgly/starterkit-apparel-editor-ios.git
cd starterkit-apparel-editor-ios
```

### Open in Xcode

```bash
open StarterKit-ApparelEditor.xcodeproj
```

Xcode will resolve the Swift Package dependencies automatically. Select an iOS Simulator or device and press **Run** (Cmd+R).

## Configuration

### License Key

Add your CE.SDK license key in `StarterKit-ApparelEditor/Secrets.swift`:

```swift
let secrets = Secrets(
  // ...
  licenseKey: "your-license-key"
)
```

Without a license key, the editor runs in evaluation mode with a watermark.

### Customization

The starter kit files in `StarterKit/` demonstrate how to customize the editor:

- **Configuration** — `ApparelEditorConfiguration.swift`
- **Callbacks** — `callbacks/` (onCreate, onChanged, onExport)
- **Components** — `components/` (navigation bar, dock, inspector bar, canvas menu)

## Architecture

```
starterkit-apparel-editor-ios/
├── StarterKit-ApparelEditor.xcodeproj/
├── StarterKit-ApparelEditor/
│   ├── StarterKit_ApparelEditorApp.swift  # @main entry point
│   ├── ContentView.swift                 # Root view launching the starter kit
│   └── Secrets.swift                     # License key configuration
└── StarterKit/
    ├── ApparelEditorStarterKit.swift
    ├── ApparelEditorConfiguration.swift
    ├── callbacks/                        # Lifecycle callbacks
    └── components/                       # UI component customization
```

## Key Capabilities

- **Apparel Templates** — Pre-built t-shirt and clothing templates
- **Text & Graphics** — Add custom text and design elements
- **Image Upload** — Add custom images and logos
- **Color Zones** — Customize apparel colors
- **Export** — PNG, JPEG, PDF with quality controls

## Documentation

For complete integration guides and API reference, visit the [CE.SDK iOS Documentation](https://img.ly/docs/cesdk/ios/quickstart/).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-apparel-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-apparel-editor">IMG.LY</a></p>
