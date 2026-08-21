> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Compatibility & Security](./compatibility-fef719.md) > [Bundle Size](./bundle-size.md)

---

## Engine Download Size

The `IMGLYEngine.xcframework` file, which is downloaded by Swift Package Manager or Cocoapods, has a compressed size exceeding 130 MB. However, it's essential to understand that this does not directly translate to an equivalent increase in your application's size.

In fact, the framework itself will only add around **11.9 MB** to your app's download size, which is relatively small considering the rich feature set that IMGLYEngine provides. The actual impact on your app's size may vary depending on various factors, as discussed in the sections below.

## Mobile Editor and Mobile Camera Download Size

The mobile editor and mobile camera are part of the [IMGLYUI package](https://github.com/imgly/IMGLYUI-swift) built on top of the [IMGLYEngine](https://github.com/imgly/IMGLYEngine-swift). This means that you can expect the download size of the mobile editor and camera to be around the size of the engine plus a few additional megabytes. The precise size increase may depend on the bundled assets (scene files, images, stickers), however, with the default resources you can expect it to be around **3.5 MB** plus the size of the engine.

## Assets

IMGLYEngine does not include any assets, such as scene files, images, or stickers. However, the engine does provide a convenient API for loading assets from your app's bundle or serving them from a remote location. The size of your assets will directly impact your app's size.

## Architectures

IMGLYEngine is designed to support the iOS platform and provides slices for both `x86_64` and `arm64` architectures. The `x86_64` architecture is specifically utilized for running apps within the iOS Simulator, whereas the `arm64` architecture is intended for executing apps on actual iOS devices.

## Debug symbols (dSYMs)

Debug symbols, also known as dSYMs, are substantial in size but essential for comprehending crash logs and debugging your application. They establish a link between your app's binary code and the human-readable source code, enabling you to determine the cause of a crash. The `IMGLYEngine.xcframework` file includes debug symbols, which are primarily used for crash symbolication when uploading to external tools. Importantly, they won't negatively impact your app's size.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support