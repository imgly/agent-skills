> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

---

Turn on equal-distance snapping so a dragged block lands at an equal distance from its siblings, and a badge shows the size of each gap.

> **Reading time:** 4 minutes

While the user drags a block, the engine looks for sibling blocks that already sit at an equal distance from each other. When the dragged block comes close to a position that continues or splits that spacing, the engine pulls the block onto it. It then draws a line across each gap, a tick at both ends of the line, and a badge with the size of the gap.

The engine draws these indicators, so iOS, Android and Web all show the same thing. There is no iOS-only view to add.

## Turn the Feature On

Equal-distance snapping is off by default. Turn it on per engine instance with the `features/equalDistanceSnappingEnabled` setting.

```swift
try engine.editor.setSettingBool(
  "features/equalDistanceSnappingEnabled",
  value: true
)
```

Call this on the main thread, like every other engine call. A good place is the `onCreate` callback of your editor configuration, before the scene loads.

```swift
static let preCreateScene: OnCreate.Callback = { engine in
  try engine.editor.setSettingBool(
    "features/equalDistanceSnappingEnabled",
    value: true
  )
}
```

The setting takes effect on the next drag. You can turn it off again at any time.

## Understand When the Snap Fires

The engine measures gaps along one axis and needs the blocks to overlap across that axis. Two blocks in the same row form one horizontal gap. Two blocks in the same column form one vertical gap. The dragged block must overlap each block of the chain across that axis, and each pair of neighbours must overlap each other. Both axes are checked on every drag, so a block can snap on X and on Y at the same time.

From one chain of equal gaps, the engine offers three positions:

- **After the chain.** The dragged block continues the spacing on the right, or below.
- **Before the chain.** The dragged block continues the spacing on the left, or above.
- **Inside a single gap.** The dragged block splits one gap into two equal halves. This needs the block to fit in the gap.

Only blocks on the same page take part. A block that overlaps its neighbour has no gap with it, so the chain stops there.

## Control the Pull Distance

`positionSnappingThreshold` sets how close the drag must come before the block is pulled. Edge and center snapping share the same value. It is in screen points, so the pull feels the same at any zoom.

```swift
try engine.editor.setSettingFloat("positionSnappingThreshold", value: 4)
```

## Style the Indicators

`snappingGuideColor` sets the color of the measurement line, of the ticks, and of the badge background. `handleFillColor` sets the color of the label inside the badge, so pick a color with a strong contrast against the background.

```swift
try engine.editor.setSettingColor(
  "snappingGuideColor",
  r: 1, g: 0.004, b: 0.361, a: 1
)
```

The badge measures its own label, so it always fits the number. Every gap of a chain shows the same number: the spacing the snap holds, in design units, to one decimal. A badge wider than its gap moves above or beside the line.

## Combine With Other Snapping

Equal-distance snapping runs first on each axis. When an equal-distance position is in reach, it takes that axis, even when an edge or center guide sits nearer. The engine uses the edge and center guides only when no equal-distance position is in reach. The badge appears only on an axis that equal distance won.

While an equal-distance snap holds the block, the engine does not round the position to the pixel grid. Rounding would break the equality that the badges show.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support