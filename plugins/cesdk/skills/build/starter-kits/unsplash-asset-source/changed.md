# Changes Made During Import

## Repository Reference Updates

### Airtable Starterkit (React-based)

Updated all repository references from `-ts-web` to `-react-web` since this starterkit uses React:

**Files modified:**

1. `apps/cesdk_web_examples/starterkit-airtable-asset-source/README.md`
2. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/angular.mdx`
3. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/browser.mdx`
4. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/electron.mdx`
5. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/nextjs.mdx`
6. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/nuxtjs.mdx`
7. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/react.mdx`
8. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/svelte.mdx`
9. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/sveltekit.mdx`
10. `apps/documentation/src/content/docs/starterkits/airtable-image-editor+artbl1/vue.mdx`

**Change pattern:**
```
- starterkit-airtable-image-editor-ts-web
+ starterkit-airtable-image-editor-react-web
```

### Other Starterkits (Non-React)

The following starterkits do **not** use React and retain their `-ts-web` references:

- starterkit-unsplash-asset-source
- starterkit-pexels-asset-source
- starterkit-getty-asset-source
- starterkit-layouts-editor
- starterkit-page-sizes-editor
