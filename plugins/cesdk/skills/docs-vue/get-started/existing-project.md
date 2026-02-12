> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Vue](./get-started/new-project.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)** into an existing Vue.js application. By the end, you'll have a functional editor rendered within a Vue component — ready for editing, templating, or further customization.

## **Who is This Guide For?**

This guide is for developers who:

- Are already working with a **Vue 2 or 3** project (Vue CLI or Vite).
- Want to embed a **powerful creative editor** directly into their app.
- Prefer a **component-based integration** without starting from scratch.

## **What You'll Achieve**

- Add CE.SDK to your existing Vue project.
- Render the editor inside a reusable component.
- Configure basic asset sources and scene loading.

## **Prerequisites**

Ensure you have:

- An existing **Vue.js project**.
- **Node.js v20+**
- **npm** or **yarn**
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)).

## **Step 1: Install CE.SDK**

In your project root, run:

```bash
npm install --save @cesdk/cesdk-js
```

## **Step 2: Create the Editor Component**

Create a file at `src/components/CreativeEditor.vue`:

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
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      init: async cesdk => {
        await cesdk.addDefaultAssetSources();
        await cesdk.addDemoAssetSources({
          sceneMode: 'Design',
          withUploadAssetSources: true,
        });
        await cesdk.createDesignScene();
      },
    };
  },
};
</script>
```

## **Step 3: Use the Component in App.vue**

Open `App.vue` (or any parent view), and replace or extend the template/script like so:

```vue
<template>
  <CreativeEditorWrapper :config="editorConfig" />
</template>

<script>
import CreativeEditorWrapper from './components/CreativeEditor.vue';

export default {
  name: 'App',
  components: { CreativeEditorWrapper },
  data() {
    return {
      editorConfig: {
        // license: 'YOUR_CESDK_LICENSE_KEY',
        baseURL:
          'https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets',
      },
    };
  },
};
</script>
```

## **Editor Setup Disclaimer**

> Note: CE.SDK serves all assets (images, fonts, templates) from IMG.LY's CDN by default. In production, you should serve assets from your own servers.

## **Step 4: Run Your Project**

If using Vue CLI:

```bash
npm run serve
```

Then visit `http://localhost:8080/` to see the editor.

## **Troubleshooting & Common Errors**

❌ **CE.SDK not visible**

Ensure the container `<div>` is full screen and styled correctly.

❌ **Invalid license key**

Check that your license key is correct and not expired. You can get a free trial [here](https://img.ly/forms/free-trial).

❌ **Runtime error: Cannot read private member `#e`**

This is caused by Babel transpiling CE.SDK code, which uses modern JS features like `#privateFields`.

**Fix this by excluding CE.SDK from Babel transpilation:**

Create or update `vue.config.js` in your project root:

```jsx
const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set(
        '@cesdk/engine',
        path.resolve(__dirname, 'node_modules/@cesdk/engine'),
      )
      .set(
        '@cesdk/cesdk-js',
        path.resolve(__dirname, 'node_modules/@cesdk/cesdk-js'),
      );

    config.module
      .rule('js')
      .exclude.add(path.resolve(__dirname, 'node_modules/@cesdk/engine'))
      .add(path.resolve(__dirname, 'node_modules/@cesdk/cesdk-js'))
      .end();
  },
};
```

Then clean and reinstall:

```bash
rm -rf node_modules
npm install
```

And restart:

```bash
npm run serve
```

## **Next Steps**

- [Customize the Editor Configuration](./user-interface/customization.md)
- [Adapt the UI and Themes](./user-interface/appearance/theming.md)
- [Serve Your Own Assets](./serve-assets.md)



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support