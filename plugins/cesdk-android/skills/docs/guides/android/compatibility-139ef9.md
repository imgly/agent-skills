> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Compatibility & Security](./compatibility-fef719.md) > [System Compatibility](./compatibility-139ef9.md)

---

## Targets

On Android, CE.SDK makes use of system-frameworks to benefit from hardware acceleration and platform native performance. The following targets are supported:

- Android 7 or later (`minSdk 24`)

## Recommended Hardware

Android phones released in the last 5 years, e.g. Asus Zenfone 3, Samsung M31s, or Google Pixel 5. Video capabilities directly depend on the video capabilities of the individual phone.

## Video

Playback and exporting is **supported for all codecs** mentioned in the general section.

However, mobile devices have stricter limits around the number of parallel encoders and decoders compared to fully fledged desktop machines. This means, that very large scenes with more than 10 videos shown in parallel may fail to play all videos at the same time.

## Export Limitations

The export size is limited by the hardware capabilities of the device, e.g., due to the maximum texture size that can be allocated. The maximum possible export size can be queried via API, see [export guide](./export-save-publish/export/overview.md).



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support