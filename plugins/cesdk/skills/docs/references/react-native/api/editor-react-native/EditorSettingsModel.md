# EditorSettingsModel

- **Package:** `@imgly/editor-react-native` (React Native, TypeScript)
- **Kind:** class
- **Import:** `import { EditorSettingsModel } from '@imgly/editor-react-native';`

Default implementation of the `EditorSettings`.

The EditorSettings are used to provide the
information needed by the editor to operate.

```typescript
class EditorSettingsModel implements EditorSettings
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
baseUri: string = 'https://cdn.img.ly/packages/imgly/cesdk-react-native/1.82.1/assets'
```

The base URI used by the engine for built-in assets like emoji and
fallback fonts, and by the editor for its default and demo asset
sources (stickers, filters, and more).

### userId

- **Kind:** Property

```typescript
userId?: string
```

Unique ID tied to your application's user.
This helps us accurately calculate monthly
active users (MAU).

### constructor

- **Kind:** Constructor

```typescript
constructor(settings: Partial<EditorSettings> = {})
```
