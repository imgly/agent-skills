> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

A new exclusion area is a rectangle with no fill and shows a striped pattern, so it is visible as soon as you create it.

An exclusion area is a graphic. It takes a shape, a fill, a stroke, effects and a blur, so you can put the artwork of the obstruction into it. Assigning a fill replaces the stripes:

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

The engine washes every exclusion area in `page/exclusionAreaFillColor` and frames it in `page/exclusionAreaFrameColor`. The stripes on an exclusion area with no fill take the same color as the wash, at a lower alpha.

```js
engine.editor.setSettingColor('page/exclusionAreaFillColor', {
  r: 0.79,
  g: 0.12,
  b: 0.4,
  a: 0.35
});
```

Both are editor settings rather than block properties, so they apply to every exclusion area in the scene and neither reaches an export. A fully transparent `page/exclusionAreaFrameColor` hides the frame, and a fully transparent `page/exclusionAreaFillColor` hides the wash and the stripes.

## Exclusion Areas and Export

An exclusion area is authoring state, so it is left out of an export. Set `includedInExport` to `true` on the exclusion area to put its artwork in the file. The guide colors still stay out:

```js
engine.block.setIncludedInExport(exclusionArea, true);
```

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

## Limitations

An exclusion area marks a region. It does not yet stop a block from being moved into one.

## Next Steps

- [Pages](./concepts/pages.md) — page margins and the safety inset.
- [Blocks](./concepts/blocks.md) — block types, shapes and fills.



---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support