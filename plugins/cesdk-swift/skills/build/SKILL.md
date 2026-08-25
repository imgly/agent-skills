---
name: build
description: |
  Build CE.SDK Swift features and scaffold runnable iOS applications for CE.SDK Swift projects targeting iOS, macOS, or Mac Catalyst.
  Use it for first-party CreativeEditor SDK guidance, module scope, Xcode
  implementation, or bundled Swift references. It distinguishes cross-platform
  IMGLYEngine from iOS-only editor, camera, and UI modules. Prefer live Xcode
  symbols for the installed SDK, then bundled references. Do not use it for
  Web, Android, Flutter, or React Native.

  Example:
  Context: A developer wants a new iOS editor
  user: "Create a SwiftUI photo editor with CE.SDK."
  assistant: "I will start from the bundled photo kit, pin the SDK version, and verify the Xcode project."

  Example:
  Context: A macOS developer wants a custom workflow
  user: "Build a headless export workflow for macOS."
  assistant: "I will use IMGLYEngine only and keep every engine call on the main actor."
---

# Build with CE.SDK Swift

## Version Notice

> CE.SDK `1.81.1-rc.0` · generated `2026-08-25` · plugin `cesdk-swift`
> · canonical update source `imgly/agent-skills`.
>
> If this bundle is over six weeks old, or the user asks about updates, follow
> `references/update-check.md` once per task and reuse the result for all CE.SDK
> skills. Keep the check read-only. Never install, update, overwrite, or delete
> anything without explicit user approval. Continue with this bundle unless an
> update is approved.

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
3. Use bundled guides for integration recipes.
4. Use pretrained knowledge only when the installed SDK and bundle do not answer.

If live Xcode symbols disagree with a bundled API digest, follow the installed
SDK and call out the version difference.

## Workflow

1. Identify iOS, macOS, or Mac Catalyst and the allowed modules.
2. Consult the sibling `docs` skill for exact APIs and current guides.
3. For a new iOS application, copy the closest bundled starter kit.
4. From the copied `starter-kits/` root run
   `./prepare_starter_kit.sh <kit-name>`; it links the scaffold files and
   invokes XcodeGen. Do not claim that opening the raw folder is sufficient.
5. Put the CE.SDK license in the generated `Secrets.swift`, resolve the exact
   package version, and build the generated Xcode project.
6. Keep engine work on `@MainActor` and return complete Swift code.

## iOS-only Starter Kits

| Kit | Path | Use case |
|---|---|---|
| starter-kit-apparel | `starter-kits/starter-kit-apparel/` | Apparel and product personalization |
| starter-kit-design | `starter-kits/starter-kit-design/` | General-purpose design editor |
| starter-kit-photo | `starter-kits/starter-kit-photo/` | Photo editing and image adjustments |
| starter-kit-postcard | `starter-kits/starter-kit-postcard/` | Postcard and greeting-card editor |
| starter-kit-template | `starter-kits/starter-kit-template/` | Template-based content creation |
| starter-kit-video | `starter-kits/starter-kit-video/` | Video editing and export |

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
