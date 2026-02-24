> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)** into a Nuxt.js app. You'll create a client-only component that loads CE.SDK after hydration to avoid SSR issues.

## **Who is This Guide For?**

This guide is for developers who:

- Are building with **Nuxt.js** (v2 or v3).
- Want to embed CE.SDK in a page, layout, or app view.
- Need a browser-only (client-side) editor integration.

## **What You'll Achieve**

- Set up a Nuxt.js app (v2 or v3).
- Install and load CE.SDK from the CDN.
- Render CE.SDK inside a fully responsive editor container.
- Avoid server-side rendering issues with client-only loading.

## **Prerequisites**

Make sure you have the following:

- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial))

## **Step 1: Set Up a Nuxt.js Project**

### For Nuxt 3

```bash
npx nuxi init cesdk-nuxt-app
cd cesdk-nuxt-app
npm install
npm run dev
```

> Learn more: [Nuxt 3 docs](https://nuxt.com/docs/getting-started/installation)

### For Nuxt 2

```bash
npx create-nuxt-app cesdk-nuxt2-app
cd cesdk-nuxt2-app
npm run dev
```

Choose appropriate options during setup.

## **Step 2: Install CE.SDK**

Even though we're using the CDN for loading, it's helpful to install the npm package:

```bash
npm install @cesdk/cesdk-js
```

## **Step 3: Create a Client-Only Editor Component**

Create `components/CreativeEditor.vue`:

```vue
<template>
  <CreativeEditor :config="config" :init="init" width="100vw" height="100vh" />
</template>

<script>
import CreativeEditor from '@cesdk/cesdk-js/vue';

export default {
  name: 'CreativeEditorWrapper',
  components: {
    CreativeEditor,
  },
  data() {
    return {
      config: {
        // license: 'YOUR_CESDK_LICENSE_KEY',
        baseURL:
          'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets',
      },
      init: async cesdk => {
        await cesdk.addDefaultAssetSources();
        await cesdk.addDemoAssetSources({
          sceneMode: 'Design',
          withUploadAssetSources: true,
        });
        await cesdk.actions.run('scene.create');
      },
    };
  },
};
</script>
```

## **Editor Setup Disclaimer**

> CE.SDK assets (fonts, templates, images) are loaded from IMG.LY's CDN by default. For production, you can host your own assets.

## **Step 4: Use the Component in a Page**

### Nuxt 2 – Example `pages/index.vue`

```vue
<template>
  <client-only>
    <CreativeEditorWrapper />
  </client-only>
</template>

<script>
import CreativeEditorWrapper from '~/components/CreativeEditor.vue';

export default {
  components: {
    CreativeEditorWrapper,
  },
};
</script>
```

### Nuxt 3 – Example `pages/index.vue`

```vue
<template>
  <ClientOnly>
    <CreativeEditorWrapper />
  </ClientOnly>
</template>

<script setup>
import CreativeEditorWrapper from '~/components/CreativeEditor.vue';
</script>
```

- `client-only` (Nuxt 2) and `ClientOnly` (Nuxt 3) ensure CE.SDK loads **only on the client**.
- These tags are crucial to prevent hydration errors.

## **Troubleshooting & Common Errors**

❌ **ReferenceError: `window` is not defined**

You're rendering CE.SDK on the server. Use `<client-only>` or `<ClientOnly>` to restrict to client-side rendering.

❌ **`create is not a function`**

Make sure you're using dynamic `import()` — not `require()` — to load CE.SDK from the CDN.

❌ **Editor does not load**

- Check your license key.
- Ensure the container div is visible and styled correctly.
- Inspect console logs for CORS issues when loading from CDN.

## **Next Steps**

- [Customize CE.SDK configuration](./user-interface/customization.md)
- [Theming & UI adaptation](./user-interface/appearance/theming.md)
- Scene exporting



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support