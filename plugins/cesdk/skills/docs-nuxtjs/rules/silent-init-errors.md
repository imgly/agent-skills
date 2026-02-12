# CreativeEditor Init Callback Fails Silently

The `init` callback passed to `<CreativeEditor>` swallows thrown errors. If any line in `init` throws, all subsequent lines are skipped with **no console error or warning**. This results in a partially-built scene that appears "broken" with no obvious cause.

## Rule

During development, wrap sections of the `init` callback in `try/catch` with `console.error` logging. For production, wrap the entire `init` body in a `try/catch` to surface failures.

```tsx
<CreativeEditor
  init={async (cesdk) => {
    try {
      await cesdk.addDefaultAssetSources();
      await cesdk.createDesignScene();

      const engine = cesdk.engine;
      const page = engine.block.findByType('page')[0];

      // ... scene setup ...
    } catch (error) {
      console.error('[CE.SDK init] Failed:', error);
    }
  }}
/>
```

## Symptoms of Silent Init Failure

- The editor loads but the scene is empty or partially built
- Some blocks are missing that should have been created
- No errors in the browser console
- The issue is intermittent (depends on which line throws)

## Debugging Strategy

Add section markers to isolate which part of `init` is failing:

```ts
init={async (cesdk) => {
  console.log('[init] Starting');
  try {
    await cesdk.addDefaultAssetSources();
    console.log('[init] Assets loaded');

    await cesdk.createDesignScene();
    console.log('[init] Scene created');

    // ... more setup ...
    console.log('[init] Complete');
  } catch (error) {
    console.error('[init] Failed:', error);
  }
}}
```

If `[init] Complete` never appears but no error is logged, the error is being swallowed by the `<CreativeEditor>` component itself. Adding the `try/catch` makes the error visible.
