> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Compatibility & Security](./compatibility.md) > [Browser Support](./browser-support.md)

---

The CreativeEditor SDK requires specific APIs to fully function.
For video-related features, the required APIs are only supported in certain browsers.
As a result, the list of supported browsers is currently limited to the following:

| Supported Browser | Graphics Editing                              | Video Editing     | Video Export      |
| ----------------- | --------------------------------------------- | ----------------- | ----------------- |
| Chrome            | **114** or newer                              | **114** or newer  | **114** or newer  |
| Chrome Android    | **114** or newer                              | not supported     | not supported     |
| Chrome iOS        | **114** or newer (on iOS/iPadOS 15 or newer)  | not supported     | not supported     |
| Edge              | **114** or newer                              | **114** or newer  | **114** or newer  |
| Firefox           | **115** or newer                              | **130** or newer  | not supported     |
| Safari            | **15.6** or newer                             | **26.0** or newer | **26.0** or newer |
| Safari iOS        | **15.6** or newer (on iOS/iPadOS 15 or newer) | not supported     | not supported     |

**Note:** Firefox supports video editing (decoding) starting with version 130 via the WebCodecs API. However, video export (encoding) is not supported because Firefox does not include the patent-encumbered H.264 and AAC codecs required for video encoding.

For video features, CE.SDK automatically shows warning dialogs when unsupported browsers try to use video functionality. You can also detect video support programmatically using the `video.decode.checkSupport` and `video.encode.checkSupport` actions, or the silent `cesdk.utils.supportsVideoDecode()` and `cesdk.utils.supportsVideoEncode()` utilities. See the [Actions API](./actions.md) for implementation details.

While other browsers based on the Chromium project might work fine (Arc, Brave, Opera, Vivaldi etc.) they are not officially supported.

## Host Platform Restrictions

All supported browsers rely on the host's platform APIs for different kind of functionality (e.g. video support). Check our [known editor limitations](./compatibility.md) for more details on these.



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support