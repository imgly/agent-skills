> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/react-native/guides-8d8b00/) > [Configuration](./configuration.md)

---

```typescript file=@cesdk_react_native_examples/editor-guides-configuration-basics/basic_editor_solution.ts reference-only
import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel
} from '@imgly/editor-react-native';

export const basicEditor = async (): Promise<void> => {
  const settings = new EditorSettingsModel({
    license: 'YOUR_LICENSE_KEY', // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
    baseUri: 'YOUR_BASE_URI',
    userId: 'YOUR_USER_ID'
  });

  const source = require('MY_CUSTOM_SOURCE');
  const preset: EditorPreset = EditorPreset.DESIGN;
  const metadata = {
    MY_KEY: 'MY_VALUE'
  };

  const result = await IMGLYEditor?.openEditor(
    settings,
    source,
    preset,
    metadata
  );
};
```

In this example, we will show you how to make basic configurations for the mobile editor. The example is based on the [`Design Editor`](https://img.ly/showcases/cesdk/default-ui/ios), however, it is exactly the same for all the other [solutions](./prebuilt-solutions.md).

## Configuration

The `openEditor` function allows for some further basic configuration of the editor.

### Editor Settings

All the basic configuration settings are part of the `EditorConfiguration` which is required to initialize the editor.

```javascript highlight-configuration
const settings = new EditorSettingsModel({
  license: 'YOUR_LICENSE_KEY', // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
  baseUri: 'YOUR_BASE_URI',
  userId: 'YOUR_USER_ID'
});
```

- `license` - the license to activate the [Engine](./get-started/overview.md) with.

```javascript highlight-license
license: 'YOUR_LICENSE_KEY', // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
```

- `baseUri` - the base URI used by the engine for built-in assets like emoji and fallback fonts, and by the editor for its default and demo asset sources (stickers, filters, and more). The default value points at the versioned IMG.LY CDN `https://cdn.img.ly/packages/imgly/cesdk-react-native/<version>/assets`. For production use, we recommend [downloading the assets](https://cdn.img.ly/packages/imgly/cesdk-react-native/1.85.0-nightly.20261008/imgly-assets.zip), hosting them on your own server, and setting `baseUri` to your hosted location.

```javascript highlight-baseUri
baseUri: 'YOUR_BASE_URI',
```

- `userID` - an optional unique ID tied to your application's user. This helps us accurately calculate monthly active users (MAU). Especially useful when one person uses the app on multiple devices with a sign-in feature, ensuring they're counted once. Providing this aids in better data accuracy. The default value is `nil`.

```javascript highlight-userId
userId: 'YOUR_USER_ID'
```

### Source

- `source` - is used to load in a custom source, e.g. a scene, image or video file.

```javascript highlight-source
const source = require('MY_CUSTOM_SOURCE');
```

### EditorPreset

- `preset` - is used to determine which predefined editor variant you want to use - if any.

```javascript highlight-preset
const preset: EditorPreset = EditorPreset.DESIGN;
```

### Metadata

- `metadata` - can be used to provide any custom `{ [key: string]: unknown }` to the underlying native plugin which you can use for further custom handling.

```javascript highlight-metadata
const metadata = {
  MY_KEY: 'MY_VALUE'
};
```

## Full Code

```typescript
import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel,
} from '@imgly/editor-react-native';

export const basicEditor = async (): Promise<void> => {
  const settings = new EditorSettingsModel({
    license: 'YOUR_LICENSE_KEY',
    baseUri: 'YOUR_BASE_URI',
    userId: 'YOUR_USER_ID',
  });

  const source = require('MY_CUSTOM_SOURCE');
  const preset: EditorPreset = EditorPreset.DESIGN;
  const metadata = {
    MY_KEY: 'MY_VALUE',
  };

  const result = await IMGLYEditor?.openEditor(
    settings,
    source,
    preset,
    metadata,
  );
};
```



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support