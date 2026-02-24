> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

This guide shows you how to add the **CreativeEditor SDK (CE.SDK)** to your current Nuxt.js app. You’ll create a client-only component to safely load CE.SDK after hydration and avoid SSR issues.

## **Who is This Guide For?**

This guide is for developers who:

- Already have a working **Nuxt.js** (v2 or v3) project.
- Want to embed CE.SDK in an existing page, layout, or component.
- Need a client-only (browser-side) editor integration.

## **What You’ll Achieve**

- Install CE.SDK and load it from the CDN.
- Create a responsive editor component for CE.SDK.
- Integrate the component using client-only rendering to avoid SSR issues.

## **Prerequisites**

Make sure you have the following:

- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial))

## **Step 1: Install CE.SDK**

While you’ll load CE.SDK from the CDN, installing the npm package provides better compatibility and editor support.

```bash
npm install @cesdk/cesdk-js
```

## **Step 2: Create a Client-Only Editor Component**

Inside your existing project, add a new file: `components/CreativeEditor.vue`.

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

> By default, CE.SDK assets like fonts, templates, and images are loaded from the IMG.LY CDN. For production use, consider self-hosting assets.

## **Step 3: Use the Component in Your App**

Update an existing page or layout where you want to embed CE.SDK.

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

- Use `<client-only>` (Nuxt 2) or `<ClientOnly>` (Nuxt 3) to prevent CE.SDK from running on the server.
- These wrappers are required to avoid hydration errors.

## **Troubleshooting & Common Errors**

❌ **ReferenceError: `window` is not defined**

> CE.SDK is being rendered on the server. Wrap the component in `<client-only>` (Nuxt 2) or `<ClientOnly>` (Nuxt 3).

❌ **`create is not a function`**

> Ensure CE.SDK is loaded using dynamic import() syntax — not require().

❌ **Editor does not load**

- Check the console for errors.
- Confirm the container div is styled and visible.
- Make sure your license key is valid and assets are accessible.

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