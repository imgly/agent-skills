> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- [Integrate AI Into CE.SDK](#broken-link-8e906c) — Full walkthrough: register the plugins, configure the dock and canvas menu, and connect providers.
- [Managed Gateway (IMG.LY)](#broken-link-06df22) — **Recommended.** Connect every capability through one managed endpoint, with no proxy to run.
- [Image Generation](#broken-link-0540d9) — Configure text-to-image and image-to-image providers.
- [Video Generation](#broken-link-b3122d) — Configure text-to-video and image-to-video providers.
- [Audio Generation](#broken-link-2d502a) — Configure speech and audio providers.
- [Text Generation](#broken-link-3e8302) — Configure text generation and rewriting providers.
- [Auto Captions](#broken-link-73368c) — Transcribe audio into captions for video.



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support