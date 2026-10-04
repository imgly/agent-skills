> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [AI Features](./user-interface/ai-integration.md) > [Customize Connection](./user-interface/ai-integration/customize-connection.md)

---

Most integrations connect to AI through the Managed Model Gateway. Customize
the connection only when you need your own models or want to keep API keys on
your own servers.

The [Managed Model Gateway](./user-interface/ai-integration/gateway-provider.md) is the recommended way to connect CE.SDK to AI: IMG.LY runs the proxy, authentication, model routing, and billing, so you don't operate any AI infrastructure. Start there unless you have a specific reason not to.

Customize the connection when the managed gateway doesn't fit:

- [Custom Model Provider](./user-interface/ai-integration/custom-provider.md) — Connect your own AI model or service by implementing the provider interface with your own input schema and generation logic.
- [Self-Hosted Model Proxy](./user-interface/ai-integration/proxy-server.md) — Keep the built-in providers (fal.ai, OpenAI, Anthropic, ElevenLabs) but route their requests through your own server so your API keys never reach the browser.

Whichever connection you choose, you configure the individual capabilities the same way — see the [Image Generation](./user-interface/ai-integration/image-generation.md), [Video Generation](./user-interface/ai-integration/video-generation.md), [Audio Generation](./user-interface/ai-integration/audio-generation.md), [Text Generation](./user-interface/ai-integration/text-generation.md), and [Auto Captions](./user-interface/ai-integration/auto-captions.md) guides.



---

## Related Pages

- [Custom Model Provider](./user-interface/ai-integration/custom-provider.md) - Connect your own AI service for design automation, asset generation, or enhancements.
- [Self-Hosted Model Proxy](./user-interface/ai-integration/proxy-server.md) - Route AI requests through a secure proxy server to meet privacy or infrastructure needs.


---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support