# Hidden Blocks in starterkit-apparel-ui

## Summary

Found **1 file** with hidden blocks containing development configuration.

---

### Block 1: src/app/contexts/EngineContext.tsx:30-33

```typescript
//START_HIDDEN_BLOCK
if (import.meta.env.CESDK_USE_LOCAL)
  config.baseURL = `${window.location.origin}/assets`;
//END_HIDDEN_BLOCK
```

**Purpose:** Local development mode - sets CE.SDK assets base URL to local server when running in local development.

**Extraction:** Move to environment-based configuration:
```typescript
const config: Partial<Configuration> = {
  ...baseConfig,
  ...(import.meta.env.VITE_CESDK_ASSETS_BASE_URL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  })
};
```

---

### Block 2: src/app/contexts/EngineContext.tsx:41-46

```typescript
//START_HIDDEN_BLOCK
if (import.meta.env.VITE_ADD_CESDK_GLOBALS === 'true') {
  // @ts-ignore
  window.imgly = { ...window.imgly, cesdk: localEngine };
}
//END_HIDDEN_BLOCK
```

**Purpose:** Debug mode - exposes CE.SDK engine instance on `window.imgly` for browser console debugging during development.

**Extraction:** Remove entirely for production builds, or gate behind development environment check:
```typescript
if (process.env.NODE_ENV === 'development') {
  window.imgly = { ...window.imgly, cesdk: localEngine };
}
```

---

## Recommendations

1. **Local development config:** Use environment variables instead of hardcoding:
   ```bash
   # .env.local
   CESDK_USE_LOCAL=true
   VITE_CESDK_ASSETS_BASE_URL=http://localhost:5173/assets
   ```

2. **Debug globals:** Remove for production or gate behind NODE_ENV check.

## Build-step Hiding

For the release build, the `release/src/index.ts` already re-exports the App component. To hide the blocks during build:

1. Use a Vite plugin to strip `//START_HIDDEN_BLOCK` to `//END_HIDDEN_BLOCK` content
2. Or use conditional compilation with environment variables

Example vite plugin for stripping hidden blocks:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';

function stripHiddenBlocks() {
  return {
    name: 'strip-hidden-blocks',
    transform(code: string, id: string) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        return code.replace(
          /\/\/START_HIDDEN_BLOCK[\s\S]*?\/\/END_HIDDEN_BLOCK/g,
          ''
        );
      }
    }
  };
}

export default defineConfig({
  plugins: [stripHiddenBlocks()]
});
```
