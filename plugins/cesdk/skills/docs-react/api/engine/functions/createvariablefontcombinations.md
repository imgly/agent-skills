> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
function createVariableFontCombinations(
   uri, 
   variantWeight, 
   variantItalic): Font[];
```

Generates an array of [Font](./api/engine/interfaces/font.md) entries for a variable font file.

Variable fonts pack multiple weight/style variants into a single file.
This helper builds every combination of weight and style that the font
supports so you can pass the result straight into a [Typeface](./api/engine/interfaces/typeface.md).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uri` | `string` | The URI of the variable font file. |
| `variantWeight` | `boolean` | When `true`, generates entries for all nine standard weights (Thin through Heavy). When `false`, only Normal (400) is used. |
| `variantItalic` | `boolean` | When `true`, generates italic variants in addition to normal style variants. When `false`, only normal style is used. |

## Returns

[`Font`](./api/engine/interfaces/font.md)\[]

An array of [Font](./api/engine/interfaces/font.md) objects covering every requested combination.

## Example

```ts
const fonts = createVariableFontCombinations(
  'https://example.com/font.woff2',
  true,  // weight variants
  true   // italic variants
);
// → 18 entries: 9 weights × 2 styles

engine.block.setTypeface(block, {
  name: 'My Variable Font',
  fonts
});
```


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support