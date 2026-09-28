> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Exclusion Areas](./concepts/exclusion-areas.md)

---

An exclusion area marks a region of a page that content must stay clear of — an envelope window, a book spine, a glue flap, an address panel on a mailer. This guide covers creating an exclusion area, putting the artwork of the obstruction into it, controlling how it looks on the canvas, and cutting it out of an export.

An exclusion area is authoring geometry. It is visible while you design and stays out of the exported file, so a region you must respect no longer has to be faked with a locked graphic.

## Creating an Exclusion Area

Create an exclusion area with the `exclusionArea` block type and append it to a page:

```js
const exclusionArea = engine.block.create('exclusionArea');
engine.block.setPositionX(exclusionArea, 20);
engine.block.setPositionY(exclusionArea, 20);
engine.block.setWidth(exclusionArea, 40);
engine.block.setHeight(exclusionArea, 40);
engine.block.appendChild(page, exclusionArea);
```

A new exclusion area is a rectangle with a stripe fill (`//ly.img.ubq/fill/stripe`), so it is visible as soon as you create it. The stripes leave their gaps transparent, so the exclusion area marks the region without hiding what is behind it.

An exclusion area is a graphic. It takes a shape, a fill, a stroke, effects and a blur, so you can put the artwork of the obstruction into it. Assigning another fill replaces the stripes:

```js
const fill = engine.block.createFill('image');
engine.block.setString(
  fill,
  'fill/image/imageFileURI',
  'https://img.ly/static/ubq_samples/sample_1.jpg'
);
engine.block.setFill(exclusionArea, fill);
```

Because an exclusion area takes any shape a graphic takes, a round window or a die cut outline is an exclusion area with that shape assigned:

```js
engine.block.setShape(exclusionArea, engine.block.createShape('ellipse'));
```

## Appearance

The engine washes every exclusion area in `page/exclusionAreaFillColor` and frames it in `page/exclusionAreaFrameColor`.

```js
engine.editor.setSettingColor('page/exclusionAreaFillColor', {
  r: 0.79,
  g: 0.12,
  b: 0.4,
  a: 0.35
});
```

Both are editor settings rather than block properties, so they apply to every exclusion area in the scene and neither reaches an export. A fully transparent `page/exclusionAreaFrameColor` hides the frame, and a fully transparent `page/exclusionAreaFillColor` hides the wash. The stripes are the exclusion area's fill, so neither setting changes them.

Reach the stripes of one exclusion area through its fill:

```js
const stripes = engine.block.getFill(exclusion area);
engine.block.setColor(stripes, 'fill/stripe/color', {
  r: 0.79,
  g: 0.12,
  b: 0.4,
  a: 0.25
});
engine.block.setFloat(stripes, 'fill/stripe/width', 4);
engine.block.setFloat(stripes, 'fill/stripe/gap', 4);
engine.block.setFloat(stripes, 'fill/stripe/angle', 90);
```

`fill/stripe/width` and `fill/stripe/gap` are in pixels at the resolution of the scene, so they keep their size when you scale the exclusion area or change the design unit, and `fill/stripe/angle` is in degrees, where 0 stands the stripes upright and 90 lays them flat.

## Exclusion Areas and Export

An exclusion area is authoring state, so it is left out of an export. Set `includedInExport` to `true` on the exclusion area to put its artwork in the file. The guide colors still stay out:

```js
engine.block.setIncludedInExport(exclusionArea, true);
```

The stripes are the exclusion area's fill, so an exclusion area that still has the fill it was created with brings its stripes into the file. Assign the artwork of the obstruction to the exclusion area to export that in place of the stripes.

Set `exclusionArea/punchOut` to `true` to cut the exclusion area out of an export instead. The page and everything on it get a hole where the exclusion area is, so a die cut window in the design becomes a window in the exported file:

```js
engine.block.setBool(exclusionArea, 'exclusionArea/punchOut', true);
```

The hole is transparent, which a print workflow reads as an absence of ink rather than as white. Punch-out is off by default, and the canvas keeps showing the content either way.

An exclusion area never changes the size of an export. An exclusion area that hangs over the edge of a page cannot grow the exported page, and an exclusion area parented to the scene does not grow an exported scene unless you opt it into the export.

## Selection

An exclusion area is the author's to move and resize. An adopter cannot select one, because a block created in the creator role carries no selection scope. Take the exclusion area out of reach in every role with:

```js
engine.editor.setSelectionEnabled(exclusionArea, false);
```

## Holding Content Out

An exclusion area marks a region, and on its own it moves nothing. Set `exclusionArea/constrains` to `true` for a region the engine must hold content out of, such as an envelope window or a die cut:

```js
engine.block.setBool(exclusion area, 'exclusion area/constrains', true);
```

The exclusion area is then a wall while the user drags, nudges or resizes a block. The block stops against the exclusion area's own shape and slides along its edge, and the user drags around the exclusion area to reach the other side. An exclusion area shaped as a ring keeps blocks out of the ring and leaves the hole free, which is how a forbidden outer edge of a page is expressed. The exclusion area the block is up against draws a border on the canvas, so the user sees what stopped them. An exclusion area that marks without constraining draws that border too.

The engine never moves a block on its own, so a block that already overlaps an exclusion area stays where it is, and a call through the API is never constrained. Ask which blocks overlap an exclusion area with:

```js
const offending = engine.block.findAllInExclusionAreas();
```

## Limitations

Arrow keys are not constrained, and a block added through the API is placed wherever it is asked for. An exclusion area snaps by its bounding box while it constrains by its shape, so a curved exclusion area snaps as a rectangle.

## Next Steps

- [Pages](./concepts/pages.md) — page margins and the safety inset.
- [Blocks](./concepts/blocks.md) — block types, shapes and fills.



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support