> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Compatibility & Security](./compatibility-fef719.md) > [Bundle Size](./bundle-size.md)

---

## Engine Download Size

When included in your app, the download size of the engine is different depending on the architecture:

- arm64-v8a ~ 14.9MB
- armeabi-v7a ~ 13.7MB
- x86\_64 ~ 14.9MB
- x86 ~ 14.9MB

This means that the download size from Play Store will be increased by the amount mentioned above.

## Mobile Editor Download Size

In order to use the mobile editor, you either have to use the gradle dependency, or directly copy the solutions from our [repository](https://github.com/imgly/cesdk-android-examples). No matter which approach you choose, you can expect the download size of the mobile editor to be around the size of the engine plus a few additional megabytes. The precise size may depend on the bundled assets (scene files, images, stickers), however, with the default resources you can expect it to be around **3 MB** plus the size of the engine. Note that this does not include the size of the Jetpack Compose library. Also note that this is measured without R8 optimizations. Enabling it in your project will shrink it further. For more information on R8, follow this [link](https://developer.android.com/build/shrink-code).

## Including as a Dynamic Feature

If you want to include the engine or the mobile editor via dependency as a dynamic feature, create an android module, add the dependency of the engine/mobile editor to that module and make that module dynamic. Here is the [link](https://developer.android.com/guide/playcore/feature-delivery) on how to create a dynamic module and load it. If you want to include the mobile editor by copying our repository, you do not need to create an extra module. Simply declare the `:editor` module as dynamic when you copy that module to your project.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support