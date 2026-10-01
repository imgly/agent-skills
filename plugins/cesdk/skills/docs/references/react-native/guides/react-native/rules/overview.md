> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/react-native/guides-8d8b00/) > [Rules](https://img.ly/docs/cesdk/react-native/rules-1427c0/) > [Overview](./overview.md)

---

In CreativeEditor SDK (CE.SDK), *rules*—referred to as **scopes** in the API and code—are automated validations that help enforce design and layout standards during editing. You can use scopes to maintain brand guidelines, ensure print readiness, moderate content, and enhance the overall editing experience.

Scopes can be applied to both designs and videos, helping you deliver high-quality outputs while reducing the risk of common mistakes.

[Explore Demos](https://img.ly/showcases/cesdk?tags=android%2Cios)

[Get Started](../get-started/overview.md)

## Understanding Rules in CE.SDK

CE.SDK's Rules system (scopes in code) can enable you to build validation logic to enforce a wide range of design and content requirements automatically. Here are some examples of what can be built on top of the SDK:

- **Design constraints:**
  - Minimum image resolution
  - No elements placed outside visible canvas bounds
- **Brand guidelines:**
  - Approved fonts, colors, and logo usage
- **Print-readiness:**
  - Safe zones for trimming
  - Bleed margin requirements
  - High-resolution assets for print
- **Content moderation:**
  - Flagging potentially inappropriate images or text
- **UI-specific constraints:**
  - Safe zones to prevent critical content from being obscured by app UI elements
- **Video editing rules:**
  - Enforcing required trimming
  - Protecting key content regions

## How Rules Work

Validation with scopes happens continuously and automatically in the background as users edit their designs or videos. When a rule (scope) violation occurs, the SDK immediately notifies the user without requiring manual checks.

If the user corrects an issue (for example, by replacing a low-resolution image), the related notification clears automatically without needing a manual refresh or revalidation step. This dynamic, always-on validation keeps the editing workflow smooth and responsive.

## Automatic Notifications

When a scope is violated, CE.SDK surfaces a notification directly in the user interface. Notifications provide clear feedback and guide users to correct issues easily.

- **Severity indicators:**
  - **Critical errors** are shown in red (e.g., content outside the printable area)
  - **Warnings** are shown in yellow (e.g., low-resolution image detected)
- **Actionable feedback:**
  - Clicking a notification brings the user directly to the affected element.
  - Users can quickly resolve issues without needing technical expertise.

This system simplifies workflows, especially for users who are not familiar with technical print requirements or detailed layout standards.

## Benefits of Using Rules

Integrating scopes into your CE.SDK experience offers multiple advantages:

- **Reduce errors:** Minimize risks of misprints, layout problems, and brand inconsistency.
- **Automatic compliance:** Validate designs and videos in real time without disrupting the creative process.
- **Professional results:** Help users — including those without technical or print knowledge — achieve polished, production-ready outputs.
- **Streamlined workflows:** Speed up editing and reduce manual review by surfacing issues early and clearly.

By leveraging scopes, you can ensure a higher standard of quality, consistency, and reliability across all designs created with CE.SDK.



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support