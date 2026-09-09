> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Editor Compatibility](./concepts/editor-compatibility.md)

---

Your editor configuration and your CE.SDK package move independently. Pin the
version a configuration was written for, and upgrading the package leaves the
editor it produces alone.

CE.SDK sometimes changes what an unchanged configuration produces: a surface that was hardcoded becomes configurable, or a surface that was always visible gains a feature key. Pinning tells CE.SDK which generation your configuration was written against, so those changes are undone for it.

## Pin a version

```typescript
cesdk.resetEditor();
cesdk.setEditorCompatibilityVersion('1.82.0');
```

Pass the CE.SDK version your configuration was written for, as `'1.82'` or `'1.82.0'`. A value CE.SDK cannot parse is ignored with a warning.

`resetEditor()` clears any pin, so the call goes **after** it. Any configuration that resets should pin.

## Where the call goes

The pin has to be in place before your configuration sets up features and UI, because the behavior it restores is a default your own calls should be able to override:

```typescript
cesdk.resetEditor();
cesdk.setEditorCompatibilityVersion('1.82.0');

// Your configuration. `enable` and `disable` are last-wins, so anything
// stated here beats what the pin restored.
cesdk.feature.enable('ly.img.video.timeline.controls.bar');
cesdk.ui.setDockOrder([...]);
```

Each call stores the version and runs its backfills. Pin once, before your own setup: a later call runs the backfills again over whatever you set in between.

## What a pin covers

CE.SDK keeps a list of the behavior changes a configuration can predate, each with the release it landed in. Pinning below a release undoes the entries above it, by making the same public API calls your configuration makes — no component behaves differently because a pin is set.

A pin does **not** hold back new capabilities. A feature that ships with its own feature key stays off until you enable it, so there is nothing to undo. See [To v1.82](./to-v1-82.md) for the first change a pin covers.

## Read the pin

```typescript
cesdk.getEditorCompatibilityVersion(); // '1.82.0', or undefined
```

An unpinned configuration gets the current release's behavior. Only a pin restores an older generation, so a configuration written before this API existed adopts it by pinning the version it was written for.

## When a pin gets too old

Old generations are retired together, in an announced release. Pinning below the oldest supported version logs a warning. The editor still runs and gets every backfill this release still has, which is the oldest supported generation, not the one you asked for. `getEditorCompatibilityVersion()` keeps returning the version you pinned. Move the pin up and adopt the changes it was holding back.

## Enable feature keys individually

`cesdk.feature.enable('ly.img.crop')` enables that key **and every key below it**. A feature added under `ly.img.crop` in a later release therefore turns itself on in a configuration you have not changed.

List the keys you want instead:

```typescript
cesdk.feature.enable(['ly.img.crop.size', 'ly.img.crop.rotation']);

// Or enable the children without the parent:
cesdk.feature.enable('ly.img.crop.*');
```

The CE.SDK starter kits list every key in their `features.ts`, commented out where the editor does not use it, so a new key is visible as something to opt into.



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support