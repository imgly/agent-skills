---
name: explain
description: |
  Explain CE.SDK Swift concepts, architecture, and workflows for CE.SDK Swift projects targeting iOS, macOS, or Mac Catalyst.
  Use it for first-party CreativeEditor SDK guidance, module scope, Xcode
  implementation, or bundled Swift references. It distinguishes cross-platform
  IMGLYEngine from iOS-only editor, camera, and UI modules. Prefer live Xcode
  symbols for the installed SDK, then bundled references. Do not use it for
  Web, Android, Flutter, or React Native.

  Example:
  Context: A developer is learning the engine model
  user: "Explain the CE.SDK block hierarchy in Swift."
  assistant: "I will explain the model with Swift examples and the correct module scope."

  Example:
  Context: A Catalyst developer needs architecture advice
  user: "How should I build an editor UI for Mac Catalyst?"
  assistant: "I will explain the engine-backed custom UI architecture and platform limitation."
---

# Explain CE.SDK for Swift

## Version Notice

> CE.SDK `1.81.0-nightly.20260808` · generated `2026-08-07` · plugin `cesdk-swift`
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
