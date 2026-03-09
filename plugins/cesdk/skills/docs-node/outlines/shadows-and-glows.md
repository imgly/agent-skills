> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Outlines](./outlines.md) > [Shadows and Glows](./outlines/shadows-and-glows.md)

---

Add visual depth and emphasis to design elements using drop shadows and glow effects in CE.SDK.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-outlines-shadows-and-glows-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-outlines-shadows-and-glows-server-js)

Drop shadows create the illusion of elements floating above the canvas, while glow effects add luminous halos that make elements stand out. CE.SDK provides two approaches: **drop shadows** as native block properties and **glow effects** through the effects system. Both can be applied to graphic blocks, text, and shapes.

\`\`\`typescript file=@cesdk\_web\_examples/guides-outlines-shadows-and-glows-server-js/server-js.ts reference-only

\`\`\`

This guide covers configuring drop shadows with dedicated API methods and applying glow effects through the effects system.

## Drop Shadow Configuration

Drop shadows are native block properties configured directly through dedicated API methods.

### Check Support and Enable

Before configuring drop shadows, verify the block supports them using \`supportsDropShadow()\`. Enable the shadow with \`setDropShadowEnabled()\`.

\`\`\`typescript highlight=highlight-setup

\`\`\`

Use \`supportsDropShadow()\` to check if the block supports shadows:

\`\`\`typescript highlight=highlight-check-drop-shadow-support

\`\`\`

Once verified, enable the drop shadow:

\`\`\`typescript highlight=highlight-enable-drop-shadow

\`\`\`

### Set Shadow Color

Configure the shadow color using \`setDropShadowColor()\` with an RGBA color object. Color values range from 0.0 to 1.0.

\`\`\`typescript highlight=highlight-set-drop-shadow-color

\`\`\`

### Set Shadow Position

Control horizontal and vertical offset using \`setDropShadowOffsetX()\` and \`setDropShadowOffsetY()\`. Positive values move the shadow right and down, negative values move left and up.

\`\`\`typescript highlight=highlight-set-drop-shadow-offset

\`\`\`

### Configure Blur Radius

Set shadow softness with \`setDropShadowBlurRadiusX()\` and \`setDropShadowBlurRadiusY()\`. Higher values create softer shadows.

\`\`\`typescript highlight=highlight-set-drop-shadow-blur

\`\`\`

## Glow Effect Configuration

Glow effects are created through the effects system and attached to blocks that support effects.

### Check Support and Create Glow

Verify the block supports effects using \`supportsEffects()\`, then create a glow effect with \`createEffect('glow')\` and attach it using \`appendEffect()\`.

\`\`\`typescript highlight=highlight-check-glow-support

\`\`\`

Create the glow effect and attach it to the block:

\`\`\`typescript highlight=highlight-create-glow-effect

\`\`\`

### Configure Glow Parameters

Adjust glow appearance using \`setFloat()\` with glow-specific properties:

- \`effect/glow/size\` - Controls the spread of the glow
- \`effect/glow/amount\` - Controls glow intensity (0.0 to 1.0)
- \`effect/glow/darkness\` - Controls the darkness/opacity of the glow

\`\`\`typescript highlight=highlight-configure-glow

\`\`\`

## Combining Shadows and Glows

Drop shadows and glow effects can both be applied to the same block. Drop shadows render independently of the effects stack, so both appear simultaneously.

\`\`\`typescript highlight=highlight-combine-shadow-glow

\`\`\`

## Managing Shadow and Glow State

### Toggle Drop Shadows

Enable or disable drop shadows with \`setDropShadowEnabled()\`. Query the current state with \`isDropShadowEnabled()\`.

\`\`\`typescript highlight=highlight-toggle-shadow

\`\`\`

### Toggle Glow Effects

Enable or disable glow effects with \`setEffectEnabled()\`. Query the state with \`isEffectEnabled()\`.

\`\`\`typescript highlight=highlight-toggle-glow

\`\`\`

## Export Result

After applying shadows and glows, export the scene to a file.

\`\`\`typescript highlight=highlight-export

\`\`\`

## Cleanup

Always dispose of the engine when finished to free resources.

\`\`\`typescript highlight=highlight-cleanup

\`\`\`

## Troubleshooting

### Shadow Not Visible

- Verify the block supports drop shadows using \`supportsDropShadow()\`
- Check that drop shadow is enabled with \`isDropShadowEnabled()\`
- Ensure offset values are non-zero to see the shadow
- Verify the shadow color has sufficient opacity (alpha channel)

### Glow Not Appearing

- Verify the block supports effects using \`supportsEffects()\`
- Check that the effect is enabled with \`isEffectEnabled()\`
- Ensure glow amount and size are greater than 0

### Performance Issues

- Limit the number of effects per block on mobile devices
- Consider disabling shadows/glows during intensive editing operations
- Use reasonable blur radius values to maintain performance

## API Reference

| Method                                             | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| \`block.supportsDropShadow(block)\`                  | Check if block supports drop shadows |
| \`block.setDropShadowEnabled(block, enabled)\`       | Enable or disable drop shadow       |
| \`block.isDropShadowEnabled(block)\`                 | Check if drop shadow is enabled     |
| \`block.setDropShadowColor(block, color)\`           | Set shadow color (RGBA)             |
| \`block.getDropShadowColor(block)\`                  | Get current shadow color            |
| \`block.setDropShadowOffsetX(block, offset)\`        | Set horizontal shadow offset        |
| \`block.setDropShadowOffsetY(block, offset)\`        | Set vertical shadow offset          |
| \`block.getDropShadowOffsetX(block)\`                | Get horizontal offset               |
| \`block.getDropShadowOffsetY(block)\`                | Get vertical offset                 |
| \`block.setDropShadowBlurRadiusX(block, radius)\`    | Set horizontal blur radius          |
| \`block.setDropShadowBlurRadiusY(block, radius)\`    | Set vertical blur radius            |
| \`block.getDropShadowBlurRadiusX(block)\`            | Get horizontal blur radius          |
| \`block.getDropShadowBlurRadiusY(block)\`            | Get vertical blur radius            |
| \`block.supportsEffects(block)\`                     | Check if block supports effects     |
| \`block.createEffect('glow')\`                       | Create a glow effect instance       |
| \`block.appendEffect(block, effect)\`                | Attach glow to a block              |
| \`block.setFloat(effect, property, value)\`          | Set glow parameters                 |
| \`block.setEffectEnabled(effect, enabled)\`          | Enable or disable glow              |
| \`block.isEffectEnabled(effect)\`                    | Check if glow is enabled            |
| \`block.getEffects(block)\`                          | Get all effects on a block          |

## Next Steps

[Using Strokes](./outlines/strokes.md) - Add border outlines to elements

[Apply Filters and Effects](./filters-and-effects/apply.md) - Explore additional visual effects

[Blur Effects](./filters-and-effects/blur.md) - Apply blur effects to elements



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support