> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Compatibility & Security](./compatibility-fef719.md) > [System Compatibility](./compatibility-139ef9.md)

---

CE.SDK runs entirely on clients and makes use of hardware acceleration provided within that environment. Therefore, the user’s hardware always acts as an upper bound of what’s achievable.

The editor's performance scales with scene complexity. We generally found scenes with up to 200 blocks well usable, but complex blocks like auto-sizing text or high-resolution image fills may affect performance negatively. This is always constrained by the processing power available on the user's device, so for low-end devices, the experience may suffer earlier. Therefore, it’s generally desirable to keep scenes only as complex as needed.

## Hardware Limitations

Each device has a limited amount of high performance hardware decoders and encoders. If the maximum number is reached it will fall back to (slow) software de- and encoding. Therefore users may encounter slow export performance when trying to export in parallel with other software that utilizes encoders and decoders, e.g. Zoom, Teams or video content in other tabs / apps. This, unfortunately, is a limitation of hardware, operating system and browser and cannot be solved.

## Targets

On Apple platforms, CE.SDK makes use of system-frameworks to benefit from hardware acceleration and platform native performance. The following targets are supported:

- iOS & iPadOS 14 or later
- macOS 12 or later

## Recommended Hardware

- iPhone 8 or later
- iPad (6th gen) or later
- Macs released in the last 7 years

## Video

Playback and exporting is **supported for all codecs** mentioned in the general section.

However, mobile devices have stricter limits around the number of parallel encoders and decoders compared to fully fledged desktop machines. This means, that very large scenes with more than 10 videos shown in parallel may fail to play all videos at the same time and can’t be exported.

## Export Limitations

The export size is limited by the hardware capabilities of the device, e.g., due to the maximum texture size that can be allocated. The maximum possible export size can be queried via API, see [export guide](./export-save-publish/export/overview.md).



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support