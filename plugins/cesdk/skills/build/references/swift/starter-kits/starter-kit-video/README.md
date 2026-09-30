# Video Editor Starter Kit for iOS

Edit videos in your iOS app — trim clips, add transitions, text overlays, and audio tracks, then export to MP4. Built with [CE.SDK](https://img.ly/creative-sdk) by [IMG.LY](https://img.ly).

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
git clone https://github.com/imgly/starterkit-video-editor-ios.git
cd starterkit-video-editor-ios
```

### Open in Xcode

```bash
open StarterKit-VideoEditor.xcodeproj
```

Xcode will resolve the Swift Package dependencies automatically. Select an iOS Simulator or device and press **Run** (Cmd+R).

## Configuration

### License Key

Add your CE.SDK license key in `StarterKit-VideoEditor/Secrets.swift`:

```swift
let secrets = Secrets(
  // ...
  licenseKey: "your-license-key"
)
```

Without a license key, the editor runs in evaluation mode with a watermark.

### Customization

The starter kit files in `StarterKit/` demonstrate how to customize the editor:

- **Configuration** — `VideoEditorConfiguration.swift`
- **Callbacks** — `callbacks/` (onCreate, onExport)
- **Components** — `components/` (navigation bar, dock, inspector bar, canvas menu, bottom panel)

## Architecture

```
starterkit-video-editor-ios/
├── StarterKit-VideoEditor.xcodeproj/
├── StarterKit-VideoEditor/
│   ├── StarterKit_VideoEditorApp.swift  # @main entry point
│   ├── ContentView.swift               # Root view launching the starter kit
│   └── Secrets.swift                   # License key configuration
└── StarterKit/
    ├── VideoEditorStarterKit.swift
    ├── VideoEditorConfiguration.swift
    ├── callbacks/                      # Lifecycle callbacks
    └── components/                     # UI component customization
```

## Key Capabilities

- **Timeline** — Multi-track video editing with timeline
- **Trim & Split** — Precise video trimming and splitting
- **Effects** — Video filters and visual effects
- **Transitions** — Smooth transitions between clips
- **Audio** — Background music and audio mixing
- **Export** — MP4 with quality controls

## Documentation

For complete integration guides and API reference, visit the [CE.SDK iOS Documentation](https://img.ly/docs/cesdk/ios/quickstart/).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with <a href="https://img.ly/creative-sdk?utm_source=github&utm_medium=project&utm_campaign=starterkit-video-editor">CE.SDK</a> by <a href="https://img.ly?utm_source=github&utm_medium=project&utm_campaign=starterkit-video-editor">IMG.LY</a></p>
