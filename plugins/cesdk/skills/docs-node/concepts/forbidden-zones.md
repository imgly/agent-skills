> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Forbidden Zones](./concepts/forbidden-zones.md)

---

A forbidden zone marks a region of a page that content must stay clear of — an envelope window, a book spine, a glue flap, an address panel on a mailer. Headless, a zone matters for what it does to the export: it stays out of the file by default, and can cut a hole in it.

The guide colors described in the browser guide only draw in preview mode, so a headless engine never renders them. Everything else behaves the same.

## Creating a Zone

Create a zone with the `zone` block type and append it to a page:

```js
const zone = engine.block.create('zone');
engine.block.setPositionX(zone, 20);
engine.block.setPositionY(zone, 20);
engine.block.setWidth(zone, 40);
engine.block.setHeight(zone, 40);
engine.block.appendChild(page, zone);
```

A zone is a graphic, so it takes a shape, a fill, a stroke, effects and a blur. A round window or a die cut outline is a zone with that shape assigned:

```js
engine.block.setShape(zone, engine.block.createShape('ellipse'));
```

## Zones and Export

A zone is authoring state, so it is left out of an export. A scene that arrives with zones in it exports as though they were not there:

```js
const blob = await engine.block.export(page, { mimeType: 'image/png' });
```

Set `includedInExport` to `true` on the zone to put its artwork in the file. The guide colors still stay out:

```js
engine.block.setIncludedInExport(zone, true);
```

Set `zone/punchOut` to `true` to cut the zone out of an export instead. The page and everything on it get a hole where the zone is, so a die cut window in the design becomes a window in the exported file:

```js
engine.block.setBool(zone, 'zone/punchOut', true);
```

The hole is transparent, so export to a format that carries an alpha channel — PNG or PDF — if the absence of ink has to survive into the file. Punch-out is off by default.

A zone never changes the size of an export. A zone that hangs over the edge of a page cannot grow the exported page, and a zone parented to the scene does not grow an exported scene unless you opt it into the export.

## Limitations

A zone marks a region. It does not yet stop a block from being placed in one, so a server-side validation pass still has to compare block bounds against zone bounds itself.

## Next Steps

- [Pages](./concepts/pages.md) — page margins and the safety area.
- [Headless Mode](./concepts/headless-mode.md) — running the engine without a canvas.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support