# EditorSettings

- **Package:** `@imgly/editor-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { EditorSettings } from '@imgly/editor-react-native';`

The EditorSettings are used to provide the
information needed by the editor to operate.

```typescript
interface EditorSettings
```

## Members

### license

- **Kind:** Property

```typescript
license?: string
```

The license of the editor. Pass `null` to run the SDK in evaluation mode with a watermark.

### baseUri

- **Kind:** Property

```typescript
baseUri: string
```

The base URI used by the engine for built-in assets like emoji and
fallback fonts, and by the editor for its default and demo asset
sources (stickers, filters, and more).

By default, assets are loaded from the IMG.LY CDN at
`https://cdn.img.ly/packages/imgly/cesdk-react-native/<version>/assets`.
For production use, we recommend downloading the assets from
`https://cdn.img.ly/packages/imgly/cesdk-react-native/<version>/imgly-assets.zip`,
hosting them on your own server, and setting `baseUri` to your
hosted location.

### userId

- **Kind:** Property

```typescript
userId?: string
```

Unique ID tied to your application's user.
This helps us accurately calculate monthly
active users (MAU).
