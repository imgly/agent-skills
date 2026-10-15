# Explain CE.SDK for Swift

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

Explain from first principles, then connect the concept to concrete Swift APIs.
Keep all engine calls on the main actor:

```swift
@MainActor
func updateScene(using engine: Engine) throws {
  // Use the exact installed-SDK signature discovered in Xcode.
}
```

State assumptions and platform limits explicitly. Use the sibling `docs`
skill for exact reference lookup and the sibling `build` skill when the user
wants runnable implementation.
