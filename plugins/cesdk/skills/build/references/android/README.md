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
2. Use the Android guides on the docs site for integration workflows.
3. Cross-check the project's resolved Gradle dependency or IDE symbols when the
   installed CE.SDK version differs from this bundle.
4. Use pretrained knowledge only when the project and bundle do not answer.

If resolved project symbols disagree with a bundled digest, follow the installed
dependency and call out the version difference.

## Workflow

1. Inspect `settings.gradle(.kts)`, `build.gradle(.kts)`,
   `gradle/libs.versions.toml`, and the active Kotlin module.
2. Consult the sibling `docs` skill for exact APIs, guides, and known pitfalls.
3. For a new application, clone the closest starter kit repository below.
   It holds a complete Gradle project with `:app` and `:starter-kit` modules.
4. Keep `license = null` for evaluation mode with a watermark. For production,
   replace it with a license supplied by the app's existing secure
   configuration; never commit the license value.
5. Run `./gradlew :app:assembleDebug` to verify the project.
6. Keep engine work on `engine.dispatcher`, preserve Compose state, and clean
   up custom engines on every disposal.

## Android Starter Kits

| Kit | Repository | Use case |
|---|---|---|
| starter-kit-apparel | `imgly/starterkit-apparel-editor-android` | Apparel and product personalization |
| starter-kit-contentmoderation | `imgly/starterkit-content-moderation-editor-android` | Design editor that checks images and text against a moderation service |
| starter-kit-design | `imgly/starterkit-design-editor-android` | General-purpose design editor |
| starter-kit-memories | `imgly/starterkit-memories-editor-android` | Montages of photos and video clips |
| starter-kit-photo | `imgly/starterkit-photo-editor-android` | Photo editing and image adjustments |
| starter-kit-postcard | `imgly/starterkit-postcard-editor-android` | Postcard and greeting-card editor |
| starter-kit-video | `imgly/starterkit-video-editor-android` | Video editing and export |

Clone the kit into the user's project folder, then remove the copied `.git` folder:

```bash
git clone --depth 1 --branch v1.85.0-nightly.20261010 https://github.com/imgly/starterkit-apparel-editor-android.git <target>
rm -rf <target>/.git
```

The `v1.85.0-nightly.20261010` branch of each repository matches this bundle. If the branch
does not exist (a nightly build, or a kit added after this release), clone the
default branch without `--branch` and set the CE.SDK dependency to version `1.85.0-nightly.20261010`.

Open the cloned folder in Android Studio, or run `./gradlew installDebug`
from it. The kit's configuration starts in its `*ConfigurationBuilder.kt`.

```kotlin
Editor(
    license = null, // Evaluation mode; inject a secure value in production.
    configuration = { EditorConfiguration.remember() },
    onClose = { error -> /* close the destination or report error */ },
)
```

Use the sibling `explain` skill for architecture and the sibling `docs`
skill for reference lookup.
