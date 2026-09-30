> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Overview](./overview.md)

---

Add editable text blocks to Android designs, then style, resize, animate, and
update them through the CE.SDK editor UI or CreativeEngine APIs.

In CreativeEditor SDK (CE.SDK), text is an editable [design block](../concepts/blocks.md) that carries text content, layout, styling, and effects. Use the editor UI when users should write and adjust copy themselves, or use CreativeEngine APIs when your app needs to create templates, localize scenes, or update text from data.

[Explore Demos](https://img.ly/showcases/cesdk?tags=android)

[Get Started](../get-started/overview.md)

## Text Capabilities in CE.SDK

Text blocks can be created, edited, selected, moved, resized, and layered with the rest of a scene. The editor UI supports inline editing for user-driven workflows, while CreativeEngine lets integrations update text content, geometry, styling, and animation programmatically.

Use text blocks for titles, labels, captions, localized marketing copy, template placeholders, and data-driven layouts. The same block model works across image and video scenes, so text can be part of static designs or time-based compositions.

## Styling, Formatting, Effects, and Spacing

CE.SDK separates text content from its visual treatment. You can style complete text blocks or ranges with typefaces, font sizes, colors, backgrounds, font weights, styles, and case transformations.

Text also supports decoration and layout controls:

- Use [Text Styling](./styling.md) for colors, backgrounds, typefaces, and range formatting.
- Use [Text Decorations](./decorations.md) for underline, strikethrough, and overline styles.
- Use [Adjust Text Spacing](./adjust-spacing.md) for letter spacing, line height, and paragraph spacing.

Effects such as strokes, shadows, and glows help text stand out from busy designs. Choose them when contrast or emphasis matters, and keep the effect values consistent with the surrounding template style.

## Text Containers and Dynamic Content

Text frames can be fixed when a template needs strict boundaries, or configured to adapt when the content length changes. Dynamic sizing is useful for localized strings, user-generated captions, and placeholders populated from external data.

When content can vary significantly, plan the text frame, wrapping behavior, and minimum readable font size together. This keeps longer copy from clipping and helps short copy remain visually balanced.

## Emojis, Fonts, and Language Support

Text blocks can include Unicode emoji characters alongside regular text. CE.SDK renders emojis with a configurable emoji font, so Android integrations can keep emoji appearance consistent across devices when needed. See [Emojis](./emojis.md) for the Android-specific setup.

Typefaces are managed through the asset system, which lets integrations provide brand fonts or curated font collections. For multilingual designs, use fonts with the character coverage your content requires; CE.SDK handles Unicode text, mixed scripts, right-to-left text, and font fallback when suitable fonts are available.

## UI and API Workflows

Use the CE.SDK editor UI when people need direct control over copy, typography, and placement. This is the right fit for creative workflows where text is part of an interactive editing session.

Use CreativeEngine APIs when your app owns the content pipeline. Programmatic text editing is useful for automation, template personalization, batch generation, localization, and server- or app-driven scene updates.

## Next Steps

- [Edit Text](./edit.md) - Update text content directly on the canvas or from your app.
- [Text Styling](./styling.md) - Apply fonts, colors, backgrounds, and range formatting.
- [Adjust Text Spacing](./adjust-spacing.md) - Control letter spacing, line height, and paragraph spacing.
- [Emojis](./emojis.md) - Insert emoji characters and configure emoji rendering.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support