# Build with CE.SDK Android

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

## Workflow

1. Inspect `settings.gradle(.kts)`, `build.gradle(.kts)`,
   `gradle/libs.versions.toml`, and the active Kotlin module.
2. Consult the sibling `docs` skill for exact APIs, guides, and known pitfalls.
3. For a new application, copy the closest bundled starter kit together with
   `starter-kit-scaffold` and `prepare_starter_kit.sh`.
4. From the copied `starter-kits/` root run
   `./prepare_starter_kit.sh <kit-name>` before opening or building the kit.
5. Keep `license = null` for evaluation mode with a watermark. For production,
   replace it with a license supplied by the app's existing secure
   configuration; never commit the license value.
6. Run `./gradlew :app:assembleDebug` to verify the project.
7. Keep engine work on `engine.dispatcher`, preserve Compose state, and clean
   up custom engines on every disposal.

## Android Starter Kits

| Kit | Path | Use case |
|---|---|---|
| starter-kit-apparel | `starter-kits/starter-kit-apparel/` | Apparel and product personalization |
| starter-kit-design | `starter-kits/starter-kit-design/` | General-purpose design editor |
| starter-kit-photo | `starter-kits/starter-kit-photo/` | Photo editing and image adjustments |
| starter-kit-postcard | `starter-kits/starter-kit-postcard/` | Postcard and greeting-card editor |
| starter-kit-template | `starter-kits/starter-kit-template/` | Template-based content creation |
| starter-kit-video | `starter-kits/starter-kit-video/` | Video editing and export |

Each product kit relies on the bundled `starter-kit-scaffold`. Run the
preparation script after copying; the raw product directory is not a complete
Gradle project on its own.

```kotlin
Editor(
    license = null, // Evaluation mode; inject a secure value in production.
    configuration = { EditorConfiguration.remember() },
    onClose = { error -> /* close the destination or report error */ },
)
```

Use the sibling `explain` skill for architecture and the sibling `docs`
skill for reference lookup.
