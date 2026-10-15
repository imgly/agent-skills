# EditorResult

- **Package:** `@imgly/editor-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { EditorResult } from '@imgly/editor-react-native';`

An editor result is returned from a successful
editor export and contains the relevant export
information.

```typescript
interface EditorResult
```

## Members

### scene

- **Kind:** Property

```typescript
scene?: string
```

The scene.
⚠️ On Android, this scene might contain blocks that reference
`content://` Uri(s) (e.g. when media is picked from gallery or camera).
These may not be resolvable when loading the scene again, especially
outside the original app context.

If you need to support reloading such scenes, consider using a custom
implementation with `EngineConfiguration.onUpload` and
`engine.editor.setUriResolver` to handle these Uri(s) appropriately.

### artifact

- **Kind:** Property

```typescript
artifact?: string
```

The path of the exported image/video/pdf.

### thumbnail

- **Kind:** Property

```typescript
thumbnail?: string
```

The path of the thumbnail of the artifact.

### metadata

- **Kind:** Property

```typescript
metadata: {[key: string]: unknown}
```

Metadata associated with the export.
Should be customizable by the customer
using the onExport interface.
