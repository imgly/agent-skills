# Explain CE.SDK for Android

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
