# Postcard Editor Starter Kit for iOS

Design personalized postcards in your iOS app — choose templates, add text, images, and export print-ready files. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly).

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
git clone https://github.com/imgly/starterkit-postcard-editor-ios.git
cd starterkit-postcard-editor-ios
```

### Open in Xcode

```bash
open StarterKit-PostcardEditor.xcodeproj
```

Xcode will resolve the Swift Package dependencies automatically. Select an iOS Simulator or device and press **Run** (Cmd+R).

## Configuration

### License Key

Add your CE.SDK license key in `StarterKit-PostcardEditor/Secrets.swift`:

```swift
let secrets = Secrets(
  // ...
  licenseKey: "your-license-key"
)
```

Without a license key, the editor runs in evaluation mode with a watermark.

### Customization

The starter kit files in `StarterKit/` demonstrate how to customize the editor:

- **Configuration** — `PostcardEditorConfiguration.swift`
- **Callbacks** — `callbacks/` (onCreate, onChanged, onExport)
- **Components** — `components/` (navigation bar, dock, inspector bar, canvas menu)

## Architecture

```
starterkit-postcard-editor-ios/
├── StarterKit-PostcardEditor.xcodeproj/
├── StarterKit-PostcardEditor/
│   ├── StarterKit_PostcardEditorApp.swift  # @main entry point
│   ├── ContentView.swift                  # Root view launching the starter kit
│   └── Secrets.swift                      # License key configuration
└── StarterKit/
    ├── PostcardEditorStarterKit.swift
    ├── PostcardEditorConfiguration.swift
    ├── callbacks/                         # Lifecycle callbacks
    └── components/                        # UI component customization
```

## Key Capabilities

- **Templates** — Pre-built postcard design templates
- **Text Editing** — Typography with fonts and styles
- **Image Placement** — Add and arrange photos
- **Front & Back** — Multi-page postcard editing
- **Export** — PNG, JPEG, PDF with quality controls

## Documentation

For complete integration guides and API reference, visit the [CE.SDK iOS Documentation](https://img.ly/docs/cesdk/ios/quickstart/).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-postcard-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-postcard-editor">IMG.LY</a></p>
