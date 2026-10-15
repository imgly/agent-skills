# IMGLYEditor

- **Package:** `@imgly/editor-react-native` (React Native, TypeScript)
- **Kind:** class
- **Import:** `import IMGLYEditor from '@imgly/editor-react-native';`

The IMG.LY Creative Editor.

```typescript
class IMGLYEditor
```

## Members

### openEditor

- **Kind:** Method

```typescript
static async openEditor(settings: EditorSettings, source?: Source, preset?: EditorPreset, metadata?: {[key: string]: unknown}): Promise<EditorResult | null>
```

Open the Creative Editor.
- **settings**: The `EditorSettings`.
- **source**: The `Source` to open.
- **preset**: The editor variant to open.
- **metadata**: The metadata to pass to the native module.
