> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ClipContextMenuComponentId = 
  | "ly.img.separator"
  | "ly.img.video.clip.menu.moveLeft"
  | "ly.img.video.clip.menu.moveRight"
  | "ly.img.video.clip.menu.bringForward"
  | "ly.img.video.clip.menu.sendBackward"
  | "ly.img.video.clip.menu.setAsOverlay"
  | "ly.img.video.clip.menu.setAsClip"
  | "ly.img.video.clip.menu.mute"
  | "ly.img.video.clip.menu.trim"
  | "ly.img.video.clip.menu.caption.merge"
  | "ly.img.video.clip.menu.caption.add"
  | "ly.img.video.clip.menu.replace"
  | "ly.img.video.clip.menu.placeholder"
  | "ly.img.video.clip.menu.duplicate"
  | "ly.img.video.clip.menu.delete"
  | "ly.img.video.clip.menu.action"
  | string & object;
```

Represents the ID of a video clip menu component.

The ClipContextMenuComponentId type defines the possible IDs for components that can be used in the video clip context menu.
It includes predefined IDs for separators and various clip menu items, as well as a catch-all type for custom IDs.


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support