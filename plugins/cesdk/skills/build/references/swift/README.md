# Build with CE.SDK Swift

## Platform and Module Scope

Determine the target from the request, active Xcode destination, Package.swift,
or project settings. If the answer materially changes and the target remains
unclear, ask whether it is iOS, macOS, or Mac Catalyst.

| Module surface | iOS | macOS | Mac Catalyst |
|---|---:|---:|---:|
| `IMGLYEngine` | Yes | Yes | Yes |
| `IMGLYCore`, `IMGLYCoreUI`, `IMGLYCamera`, `IMGLYEditor` | Yes | No | No |
| Prebuilt editor products and SwiftUI starter kits | Yes | No | No |

For macOS or Mac Catalyst editor-UI requests, explain that the prebuilt editor
UI is unavailable and offer an `IMGLYEngine`-backed custom UI instead.

## Source Priority

1. Prefer live Xcode symbol or documentation lookup, when available, for exact
   installed-SDK signatures, generic constraints, availability, and deprecations.
2. Use bundled API digests for discovery, planning, and portable lookup.
3. Use the guides on the docs site for integration recipes.
4. Use pretrained knowledge only when the installed SDK, the bundle, and the
   docs site do not answer.

If live Xcode symbols disagree with a bundled API digest, follow the installed
SDK and call out the version difference.

## Workflow

1. Identify iOS, macOS, or Mac Catalyst and the allowed modules.
2. Consult the sibling `docs` skill for exact APIs and current guides.
3. For a new iOS application, clone the closest starter kit repository below.
   It holds a complete Xcode project.
4. Put the CE.SDK license in the kit's `Secrets.swift`, resolve the exact
   package version, and build the Xcode project.
5. Keep engine work on `@MainActor` and return complete Swift code.

## iOS-only Starter Kits

| Kit | Repository | Use case |
|---|---|---|
| starter-kit-apparel | `imgly/starterkit-apparel-editor-ios` | Apparel and product personalization |
| starter-kit-content-moderation | `imgly/starterkit-content-moderation-ios` | Design editor that checks images and text against a moderation service |
| starter-kit-design | `imgly/starterkit-design-editor-ios` | General-purpose design editor |
| starter-kit-photo | `imgly/starterkit-photo-editor-ios` | Photo editing and image adjustments |
| starter-kit-postcard | `imgly/starterkit-postcard-editor-ios` | Postcard and greeting-card editor |
| starter-kit-video | `imgly/starterkit-video-editor-ios` | Video editing and export |

Clone the kit into the user's project folder, then remove the copied `.git` folder:

```bash
git clone --depth 1 --branch v1.85.0-nightly.20261010 https://github.com/imgly/starterkit-apparel-editor-ios.git <target>
rm -rf <target>/.git
```

The `v1.85.0-nightly.20261010` branch of each repository matches this bundle. If the branch
does not exist (a nightly build, or a kit added after this release), clone the
default branch without `--branch` and set the CE.SDK dependency to version `1.85.0-nightly.20261010`.

The starter kits do not support macOS or Mac Catalyst. For those targets,
create an engine-backed custom UI without importing iOS-only UI modules.

```swift
@MainActor
func configure(engine: Engine) throws {
  // Fill in using signatures verified against the installed SDK.
}
```

Use the sibling `explain` skill for architecture and the sibling `docs`
skill for reference lookup.
