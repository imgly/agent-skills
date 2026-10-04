> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Size Limits](./import-media/size-limits.md)

---

CreativeEditor SDK (CE.SDK) supports importing high-resolution images, video, and audio, but there are practical limits to consider based on the user's device capabilities.

## Image Resolution Limits

| Constraint            | Recommendation / Limit                                                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Input Resolution**  | Maximum input resolution is **4096×4096 pixels**. Images from external sources (e.g., Unsplash) are resized to this size before rendering on the canvas. You can modify this value using the `maxImageSize` setting.  |
| **Output Resolution** | There is no enforced output resolution limit. Theoretically, the editor supports output sizes up to **16,384×16,384 pixels**. However, practical limits depend on the device's GPU capabilities and available memory. |

All image processing in CE.SDK happens on the device running the engine, so these values depend on the **maximum texture size** supported by its hardware. The default limit of 4096×4096 is a safe baseline that works universally. Higher resolutions (e.g., 8192×8192) may work on certain devices but could fail on others during export if the GPU texture size is exceeded.

> **Note:** To ensure consistent results across devices, it’s best to test higher output
> sizes on your target hardware and set conservative defaults in production.

## Video Resolution & Duration Limits

| Constraint     | Recommendation / Limit                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Resolution** | Up to **4K UHD** is supported for **playback** and **export**, depending on the user's hardware and available GPU resources. For **import**, CE.SDK does not impose artificial limits, but maximum video size is bounded by available memory: WASM-based builds (browser and `@cesdk/node`) are limited by the **32-bit address space of WebAssembly (wasm32)** and, in the browser, the **tab’s memory cap (~2 GB)**, while native builds such as `@cesdk/node-native` can use the full process memory. |
| **Frame Rate** | 30 FPS at 1080p is broadly supported; 60 FPS and high-res exports benefit from hardware acceleration                                                                                                                                                                                                                           |
| **Duration**   | Stories and reels of up to **2 minutes** are fully supported. Longer videos are also supported, but we generally found a maximum duration of **10 minutes** to be a good balance for a smooth editing experience and a pleasant export duration of around one minute on modern hardware.                                       |

> **Note:** Performance scales with the host hardware. For best results with high-resolution
> or high-frame-rate video, modern CPUs/GPUs with hardware acceleration are
> recommended.



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support