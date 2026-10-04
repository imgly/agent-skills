## Photo Editor Starter Kit in Android

The starter kit is built on top of the Creative Editor SDK. 
Built to provide versatile photo editing capabilities.
Toggling from edit and preview modes enables users to evaluate their edited photo before export.
A dock at the bottom of the editor provides quick access to the most essential photo editing tools allowing users to tweak adjustments, crop the photo, and add filters, effects, blur, text, shapes, as well as stickers.

### Repository Structure

- Repository is a fully functional Android project with `:starter-kit` and `:app` modules.
- `:starter-kit` library module encapsulates the implementation of the starter kit. Starting point of the starter kit implementation is at `PhotoConfigurationBuilder.kt`.
- `:app` application module launches `EditorActivity.kt` that displays the `Editor` composable using `PhotoConfigurationBuilder`.

### Building The Repository

1. Clone the repository.
2. [Create and launch](https://developer.android.com/studio/run/managing-avds) a new android emulator or use an existing one. 
3. Open the local repository via `Android Studio` and click the `Run` button or go to the local repository via terminal and call `./gradlew installDebug`.

### Useful links

- [Starter Kit Documentation](https://img.ly/docs/cesdk/android/starterkits/photo-editor-r6kq0u/)
- [CESDK Android Documentation](https://img.ly/docs/cesdk/android)
- [CESDK Android Source Code](https://github.com/imgly/cesdk-android)
- [CESDK Android Examples and Play Store App Code](https://github.com/imgly/cesdk-android-examples)
