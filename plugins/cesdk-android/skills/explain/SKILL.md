---
name: explain
description: |
  Explain CE.SDK Android concepts, Compose architecture, and engine workflows for CE.SDK Android projects using Kotlin and Jetpack Compose.
  Use it for first-party CreativeEditor SDK guidance, Gradle setup, Compose
  integration, direct engine workflows, and bundled Android references. Prefer
  the bundled Dokka digests and guides, then resolved project symbols. Do not
  use it for Web, Swift, Flutter, or React Native.

  Example:
  Context: A developer is learning the Android engine model
  user: "Explain the CE.SDK block hierarchy in Kotlin."
  assistant: "I will explain the model with Kotlin examples grounded in the Android API digests."

  Example:
  Context: A Compose developer needs lifecycle guidance
  user: "How does EditorConfiguration.remember work?"
  assistant: "I will explain its one-time builder semantics and Editor scope requirement."
---

# Explain CE.SDK for Android

## Version Notice

> CE.SDK `1.83.0-nightly.20260901` · generated `2026-08-31` · plugin `cesdk-android`
> · canonical update source `imgly/agent-skills`.
>
> If this bundle is over six weeks old, or the user asks about updates, follow
> `references/update-check.md` once per task and reuse the result for all CE.SDK
> skills. Keep the check read-only. Never install, update, overwrite, or delete
> anything without explicit user approval. Continue with this bundle unless an
> update is approved.

## Platform and Module Scope

Target Android projects written in Kotlin, including Jetpack Compose editor and
camera integrations plus direct engine workflows. Detect the active module from
`settings.gradle(.kts)`, `build.gradle(.kts)`,
`gradle/libs.versions.toml`, and Kotlin sources.

The bundled API corpus covers the first-party engine, editor, camera, and plugin
modules. Keep engine API work on `engine.dispatcher` (the main thread for
public engines), and use the `Editor` composable lifecycle unless the request
explicitly requires a custom engine surface.

## Source Priority

1. Use bundled Dokka API digests for exact Kotlin declarations and deprecations.
2. Use bundled Android guides for integration workflows.
3. Cross-check the project's resolved Gradle dependency or IDE symbols when the
   installed CE.SDK version differs from this bundle.
4. Use pretrained knowledge only when the project and bundle do not answer.

If resolved project symbols disagree with a bundled digest, follow the installed
dependency and call out the version difference.

Explain from first principles, then connect the concept to concrete Kotlin APIs.
Keep public engine work on its dispatcher:

```kotlin
withContext(engine.dispatcher) {
    // Use the declaration verified in the bundled Dokka digest.
}
```

State lifecycle, Compose state, and Gradle-version assumptions explicitly. Use the sibling `docs` skill for exact reference lookup
and the sibling `build` skill when the user wants runnable implementation.
