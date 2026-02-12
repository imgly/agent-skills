> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Get Started](./get-started/overview.md) > [Quickstart Vue](./get-started/new-project.md)

---

This guide walks you through integrating the **CreativeEditor SDK (CE.SDK)** into a new Vue.js application. By the end, you'll have a functional editor rendered within a Vue component — ready for editing, templating, or further customization.

## **Who is This Guide For?**

This guide is for developers who:

- Are using **Vue 2 or 3** (Vue CLI or Vite).
- Want to embed **a powerful creative editor** directly into a web app.
- Prefer a **component-based approach** for SDK initialization and teardown.

## **What You'll Achieve**

- Create a Vue.js project with CE.SDK installed.
- Load the editor via CDN or npm.
- Add default assets and templates to get started quickly.

## **Prerequisites**

Make sure you have the following:

- **Node.js (v20 or later)**
- **npm or yarn**
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial))
- **Vue CLI** (for Vue 2/3)
  Install with:
  ```bash
  npm install -g @vue/cli
  ```

````

## **Step 1: Create a New Vue Project**

```bash
vue create cesdk-vue-app
````

- Choose the default preset or manually select Babel, Router, etc.
- Navigate to your project folder:
  ```bash
  cd cesdk-vue-app
  ```

````

## **Step 2: Install CE.SDK**

```bash
npm install --save @cesdk/cesdk-js
````

## **Step 3: Create the Editor Component**

Create `src/components/CreativeEditor.vue`:

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

## **Step 4: Use the Component in App.vue**

Replace your template/script in `App.vue`:

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

### **Editor Setup Disclaimer**

> Note: For convenience, CE.SDK serves assets (e.g., images, stickers, fonts) from IMG.LY's CDN by default. In production, you should serve assets from your own server

## **Step 6: Run the Project**

```bash
npm run serve
```

Go to `http://localhost:8080/` to see CE.SDK running in your Vue app.

## **Troubleshooting & Common Errors**

❌ **CE.SDK not visible**

Ensure the `#cesdk_container` element is full-screen and not obstructed by parent layout.

❌ **Invalid license key**

Use a valid [trial or production license key](https://img.ly/forms/free-trial).

❌ **Runtime error: Cannot read private member `#e`**

This is caused by Babel transpiling CE.SDK's internal code, which uses modern features like `#privateFields`.

**Fix this by excluding CE.SDK modules from Babel:**

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

Restart your dev server with:

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