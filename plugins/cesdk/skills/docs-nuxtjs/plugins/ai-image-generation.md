> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Plugins](./plugins.md) > [AI Feature Plugins](./plugins/ai-image-generation.md)

---

The AI feature plugins add generative capabilities — image, video, audio, and
text generation — directly to the CE.SDK editor. This page gets the packages
installed; the AI Features guides cover how to configure and connect them.

## Install the Plugins

Add CE.SDK and the AI plugins you need. The `@imgly/plugin-ai-apps-web` package orchestrates the generation providers and their editor UI; install it alongside the capabilities you want.

```bash
npm install @cesdk/cesdk-js@$UBQ_VERSION$
npm install @imgly/plugin-ai-apps-web@$UBQ_VERSION$

# Add the generation capabilities you need
npm install @imgly/plugin-ai-image-generation-web@$UBQ_VERSION$
npm install @imgly/plugin-ai-video-generation-web@$UBQ_VERSION$
npm install @imgly/plugin-ai-audio-generation-web@$UBQ_VERSION$
npm install @imgly/plugin-ai-text-generation-web@$UBQ_VERSION$
```

Each plugin adds one capability:

- **`@imgly/plugin-ai-apps-web`** — orchestrates the AI apps, wiring the generation providers into the dock and canvas menu.
- **`@imgly/plugin-ai-image-generation-web`** — text-to-image and image-to-image generation.
- **`@imgly/plugin-ai-video-generation-web`** — text-to-video and image-to-video generation.
- **`@imgly/plugin-ai-audio-generation-web`** — audio and speech generation.
- **`@imgly/plugin-ai-text-generation-web`** — text generation and rewriting.

## Set It Up

Installing the packages is only the first step — each plugin still needs a provider and an AI connection. Start with the overview, then follow the guide for your path and capabilities:

- [Integrate AI Into CE.SDK](./user-interface/ai-integration/integrate.md) — Full walkthrough: register the plugins, configure the dock and canvas menu, and connect providers.
- [Managed Gateway (IMG.LY)](./user-interface/ai-integration/gateway-provider.md) — **Recommended.** Connect every capability through one managed endpoint, with no proxy to run.
- [Image Generation](./user-interface/ai-integration/image-generation.md) — Configure text-to-image and image-to-image providers.
- [Video Generation](./user-interface/ai-integration/video-generation.md) — Configure text-to-video and image-to-video providers.
- [Audio Generation](./user-interface/ai-integration/audio-generation.md) — Configure speech and audio providers.
- [Text Generation](./user-interface/ai-integration/text-generation.md) — Configure text generation and rewriting providers.
- [Auto Captions](./user-interface/ai-integration/auto-captions.md) — Transcribe audio into captions for video.



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support