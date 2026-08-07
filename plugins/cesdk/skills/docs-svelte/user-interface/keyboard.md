> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Keyboard Shortcuts](./user-interface/keyboard.md)

---

Register, remove, and gate keyboard shortcuts in CE.SDK. Override the built-in
catalog or add your own bindings — chords, single keys, and sequences are all
supported.

![Keyboard shortcuts in CE.SDK — the design editor with the default catalog loaded](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-user-interface-keyboard-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-user-interface-keyboard-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.0-nightly.20260807/examples/guides-user-interface-keyboard-browser/index.html)

Power users live on the keyboard. CE.SDK ships with a complete shortcut catalog — undo, redo, copy, paste, nudge, group, save, zoom, text formatting, playback — so the moment your users open the editor, every common action is one chord away. Bind your own shortcuts on top, replace the defaults with your brand's conventions, or scope them to specific surfaces — without writing a keyboard event handler yourself.

```typescript file=@cesdk_web_examples/guides-user-interface-keyboard-browser/browser.ts reference-only
import {
  CANVAS_SHORTCUT_SCOPE,
  EDITOR_SHORTCUT_SCOPE,
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import packageJson from './package.json';

class KeyboardExample implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Loading the design editor config registers the default keyboard
    // shortcut catalog automatically (undo/redo, copy/paste, save,
    // zoom, text formatting, etc.).
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create');

    // Inspect the current state of the shortcut subsystem
    const enabled = cesdk.feature.isEnabled('ly.img.keyboard.shortcuts');
    console.log('Keyboard shortcuts enabled:', enabled);

    // Disable shortcuts at runtime — the runtime detaches its listener
    // immediately. Re-enable later to restore everything without
    // re-registering the catalog.
    // cesdk.feature.enable('ly.img.keyboard.shortcuts', false);
    // cesdk.feature.enable('ly.img.keyboard.shortcuts', true);

    // Add a chord shortcut. `Mod` resolves to Cmd on macOS and Ctrl
    // elsewhere, so one registration covers both platforms. Press
    // Cmd/Ctrl+Alt+H to surface a notification — a stand-in for
    // opening a help dialog.
    cesdk.shortcuts.set({
      keys: 'Mod+Alt+h',
      description: 'Show keyboard help',
      category: 'Help',
      scope: [EDITOR_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        console.log('Help shortcut triggered');
        cesdk.ui.showNotification({
          message: 'Keyboard help triggered (Mod+Alt+H)',
          type: 'info',
          duration: 3000
        });
      }
    });

    // Single-key shortcuts work the same way — just omit the modifier.
    // Press '?' to log a quick hint.
    cesdk.shortcuts.set({
      keys: 'Shift+?',
      description: 'Quick hint',
      category: 'Help',
      scope: [CANVAS_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        cesdk.ui.showNotification({
          message: 'Tip: press Cmd/Ctrl+Alt+H for help',
          type: 'info',
          duration: 3000
        });
      }
    });

    // Sequences are arrays of chord strings pressed within `sequenceTimeout`
    // milliseconds of each other. Press 'g' then 'p' to jump to the first page.
    cesdk.shortcuts.set({
      keys: ['g', 'p'],
      description: 'Go to first page',
      category: 'Navigation',
      scope: [CANVAS_SHORTCUT_SCOPE],
      sequenceTimeout: 1000,
      run: ({ cesdk }) => {
        const [firstPage] = cesdk.engine.scene.getPages();
        if (firstPage != null) {
          cesdk.engine.block.select(firstPage);
          cesdk.ui.showNotification({
            message: 'Jumped to the first page',
            type: 'success',
            duration: 2000
          });
        }
      }
    });

    // Replace the default save binding with a custom handler. Remove
    // the existing entry first, then register the replacement on the
    // same keys. `Mod+s` matches both Cmd+S (macOS) and Ctrl+S
    // (Windows/Linux), so one call covers both.
    cesdk.shortcuts.remove({ keys: 'Mod+s', scopes: '*' });
    cesdk.shortcuts.set({
      keys: 'Mod+s',
      description: 'Custom save handler',
      category: 'File',
      scope: [EDITOR_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        console.log('Custom save triggered — replace this with your own logic');
        cesdk.ui.showNotification({
          message: 'Custom save triggered',
          type: 'info',
          duration: 2000
        });
      }
    });

    // Use the `when:` predicate to gate execution on the active scope
    // and the current selection. The runtime resolves `uiScope` from
    // the focused element so the predicate doesn't need to query it.
    // Press Cmd/Ctrl+Shift+M while a text block is selected to mark it
    // as reviewed (here, just a log + notification).
    cesdk.shortcuts.set({
      keys: 'Mod+Shift+m',
      description: 'Mark selected text as reviewed',
      category: 'Editing',
      scope: [CANVAS_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        const [selected] = cesdk.engine.block.findAllSelected();
        console.log('Marked text block as reviewed:', selected);
        cesdk.ui.showNotification({
          message: 'Marked as reviewed',
          type: 'success',
          duration: 2000
        });
      },
      // `scope` already gates this to the canvas; `when` only checks state.
      when: ({ cesdk }) => {
        const selected = cesdk.engine.block.findAllSelected();
        if (selected.length === 0) return false;
        return selected.every(
          (id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text'
        );
      }
    });

    // List every registered shortcut. Combine with `get` and `has` to build
    // help dialogs or to detect conflicts before registering custom bindings.
    const allShortcuts = cesdk.shortcuts.list({ scopes: '*' });
    console.log(`Registered shortcuts: ${allShortcuts.length}`);

    // A chord is a single `+`-joined string; an array is a multi-step sequence.
    const undoShortcut = cesdk.shortcuts.get({ keys: 'Mod+z', scopes: '*' });
    console.log('Undo shortcut:', undoShortcut);

    const conflict = cesdk.shortcuts.has('Mod+k');
    console.log('Mod+K already in use?', conflict);

    // `list` takes a `{ scopes }` selector and lists by scope; `get` and
    // `remove` take a `{ keys, scopes }` selector and match when keys AND scopes
    // both match. Each field is a glob (or array of globs); `'*'` matches
    // everything, `[]` matches nothing. To list by key, list a scope and filter.

    // Every Mod+<key> shortcut in the canvas scope.
    const modCanvas = cesdk.shortcuts
      .list({ scopes: [CANVAS_SHORTCUT_SCOPE] })
      .filter((shortcut) => String(shortcut.keys).startsWith('Mod+'));
    console.log('Mod+ canvas shortcuts:', modCanvas.length);

    // Find the shortcut bound to a chord.
    const boldShortcut = cesdk.shortcuts.get({ keys: 'Mod+b', scopes: '*' });
    console.log('Bold shortcut:', boldShortcut);

    // Remove a chord in a specific scope (narrow with `scopes`, or `'*'` for all).
    cesdk.shortcuts.remove({
      keys: 'Mod+b',
      scopes: [CANVAS_SHORTCUT_SCOPE]
    });
  }
}

export default KeyboardExample;
```

## Enabling and Disabling Keyboard Shortcuts

The whole subsystem is gated by the `ly.img.keyboard.shortcuts` feature flag. The runtime watches it reactively — toggling does not unregister shortcuts from the store, it only attaches or detaches the keydown listener, so flipping the flag back on restores everything without re-registration.

```typescript highlight-toggle-feature
    // Inspect the current state of the shortcut subsystem
    const enabled = cesdk.feature.isEnabled('ly.img.keyboard.shortcuts');
    console.log('Keyboard shortcuts enabled:', enabled);

    // Disable shortcuts at runtime — the runtime detaches its listener
    // immediately. Re-enable later to restore everything without
    // re-registering the catalog.
    // cesdk.feature.enable('ly.img.keyboard.shortcuts', false);
    // cesdk.feature.enable('ly.img.keyboard.shortcuts', true);
```

## Platform Key Mapping

CE.SDK recognises a `Mod` modifier alias that resolves to `Meta` (the Command key) on macOS and `Control` everywhere else, matching the convention used by VS Code, Electron, and most editor stacks. One `Mod+...` entry covers both platforms — no need to register a Mac variant and a Windows / Linux variant separately.

`Meta` and `Control` remain available as literal modifiers when you need a platform-specific binding (for example, a Mac-only `Meta+,` for preferences). The `Mod` alias is purely sugar on top.

## UI Scopes

A UI scope identifies which surface of the editor currently owns keyboard focus. The runtime computes the active scope on every keypress by walking from `document.activeElement` upward to the nearest ancestor that carries a `data-shortcut-scope` attribute.

You restrict a shortcut to one or more scopes with its `scope` array: the shortcut is a candidate only when the active scope is in that array. Omit `scope` to let it fire in any scope. Scope filtering happens before the `when:` predicate runs, so `when:` only checks editor state (`cesdk`) — it does not receive or check the scope.

The editor stamps these scopes onto its surfaces. Every scope id follows the `ly.img.*.*` convention — the same shape feature ids, panel ids, and component ids use, so a single grep against `ly.img` surfaces every CE.SDK identifier in your codebase.

Each scope id is also exported as a named constant from `@cesdk/cesdk-js` (`CANVAS_SHORTCUT_SCOPE`, etc.), so you can list it in `scope` via the constant instead of the string literal.

- **`ly.img.scope.editor`** — the default fallback. Returned when focus is somewhere inside the editor root but not under any of the more specific surfaces below. Use this when your shortcut should fire from anywhere in the UI.
- **`ly.img.scope.canvas`** — the canvas region. Focus rests here when a block is selected or the user clicked an empty canvas area. Most editing shortcuts (copy, paste, duplicate, nudge, group, text formatting) gate on this scope.
- **`ly.img.scope.videoTimeline`** — the video timeline strip and its clips. Playback shortcuts (Space) and clip-level operations live here so they don't fire when focus is on the design canvas.
- **Any panel id** — every panel mounted via `PanelPortal` auto-scopes itself with its own id (`//ly.img.panel/inspector/pageResize`, `//ly.img.panel/inspector/adjustments`, etc.). The `ShortcutScopeId` type includes every built-in `PanelId`, so `scope: [PanelId.PageResizePanel]` is fully typed.

Authors registering custom shortcuts should always set `scope: [CANVAS_SHORTCUT_SCOPE]` (or another specific scope) on selection-sensitive bindings so they don't fire from unrelated surfaces.

## Default Keyboard Shortcuts

These are the shortcuts the core configs register out of the box. `Mod` resolves to Cmd (⌘) on macOS and Ctrl on Windows / Linux.

### Selection

| Action                           | Shortcut |
| -------------------------------- | -------- |
| Select all elements on the page  | `Mod+A`  |
| Enter or exit the selected group | `Enter`  |
| Select parent group or deselect  | `Escape` |

### Editing

| Action                                       | Shortcut               |
| -------------------------------------------- | ---------------------- |
| Delete selected elements                     | `Delete` / `Backspace` |
| Delete selected vector node or control point | `Delete` / `Backspace` |
| Duplicate selected elements                  | `Mod+D`                |
| Group selected elements                      | `Mod+G`                |
| Ungroup the selected group                   | `Mod+Shift+G`          |
| Copy                                         | `Mod+C`                |
| Cut                                          | `Mod+X`                |
| Paste                                        | `Mod+V`                |
| Split the selected clip at the playhead      | `S`                    |

### Text Formatting

| Action                                | Shortcut                      |
| ------------------------------------- | ----------------------------- |
| Toggle bold on selected text          | `Mod+B`                       |
| Toggle italic on selected text        | `Mod+I`                       |
| Toggle underline on selected text     | `Mod+U`                       |
| Toggle strikethrough on selected text | `Mod+Shift+X` / `Alt+Shift+5` |

### Movement

| Action                                                  | Shortcut                                                                                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Nudge selection                                         | `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight`                                                                         |
| Nudge selection (extended step)                         | `Shift+ArrowUp` / `Shift+ArrowDown` / `Shift+ArrowLeft` / `Shift+ArrowRight`                                                 |
| Rotate selection                                        | `Alt+ArrowLeft` / `Alt+ArrowRight`                                                                                           |
| Rotate selection (extended step)                        | `Alt+Shift+ArrowLeft` / `Alt+Shift+ArrowRight`                                                                               |
| Resize selection                                        | `Mod+ArrowRight` / `Mod+ArrowLeft` / `Mod+ArrowDown` / `Mod+ArrowUp`                                                         |
| Resize selection (extended step)                        | `Mod+Shift+ArrowRight` / `Mod+Shift+ArrowLeft` / `Mod+Shift+ArrowDown` / `Mod+Shift+ArrowUp`                                 |
| Resize selection from the opposite edge                 | `Mod+Control+ArrowLeft` / `Mod+Control+ArrowRight` / `Mod+Control+ArrowUp` / `Mod+Control+ArrowDown`                         |
| Resize selection from the opposite edge (extended step) | `Mod+Control+Shift+ArrowLeft` / `Mod+Control+Shift+ArrowRight` / `Mod+Control+Shift+ArrowUp` / `Mod+Control+Shift+ArrowDown` |
| Move the image inside its crop frame                    | `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight` — while cropping                                                        |
| Move the image inside its crop frame (extended step)    | `Shift+ArrowUp` / `Shift+ArrowDown` / `Shift+ArrowLeft` / `Shift+ArrowRight` — while cropping                                |

### Page Navigation

| Action                  | Shortcut                   | Notes                                |
| ----------------------- | -------------------------- | ------------------------------------ |
| Scroll to next page     | `ArrowDown` / `ArrowRight` | Only when editor role is `Presenter` |
| Scroll to previous page | `ArrowUp` / `ArrowLeft`    | Only when editor role is `Presenter` |

### Playback

| Action                        | Shortcut | Notes                                    |
| ----------------------------- | -------- | ---------------------------------------- |
| Play / pause the current page | `Space`  | Only when focus is in the video timeline |

### Timeline

All timeline shortcuts fire only when focus is in the video timeline and act on every selected clip. Trim adjusts the selected clip directly — no separate trim mode required.

| Action                                               | Shortcut                                       |
| ---------------------------------------------------- | ---------------------------------------------- |
| Move the selected clips in time                      | `ArrowLeft` / `ArrowRight`                     |
| Move the selected clips in time (extended step)      | `Shift+ArrowLeft` / `Shift+ArrowRight`         |
| Move the selected clips to the track above / below   | `ArrowUp` / `ArrowDown`                        |
| Move the selected clips to a new track above / below | `Shift+ArrowUp` / `Shift+ArrowDown`            |
| Move the playhead                                    | `,` / `.`                                      |
| Move the playhead to start / end                     | `Home` / `End`                                 |
| Adjust the trim out point                            | `Alt+ArrowLeft` / `Alt+ArrowRight`             |
| Adjust the trim in point                             | `Alt+Shift+ArrowLeft` / `Alt+Shift+ArrowRight` |

### View

| Action                          | Shortcut        |
| ------------------------------- | --------------- |
| Zoom to fit                     | `Shift+1`       |
| Zoom to 100%                    | `Shift+2`       |
| Zoom in                         | `+` / `Shift++` |
| Zoom out                        | `-`             |
| Show or hide the user interface | `Mod+.`         |

### History

| Action                  | Shortcut      |
| ----------------------- | ------------- |
| Undo last action        | `Mod+Z`       |
| Redo last undone action | `Mod+Shift+Z` |

### File

| Action       | Shortcut      |
| ------------ | ------------- |
| Save scene   | `Mod+S`       |
| Save archive | `Mod+Shift+S` |

## Customizing Keyboard Shortcuts

Every entry in the catalog goes through the same public API: `cesdk.shortcuts.set`. The methods below build on it.

### Registering a Chord

Bind any combination of `Mod`, `Meta`, `Control`, `Alt`, `Shift` with one main key. Prefer `Mod` for cross-platform shortcuts — it resolves to Cmd on macOS and Ctrl elsewhere, so a single registration covers both platforms.

```typescript highlight-register-chord
// Add a chord shortcut. `Mod` resolves to Cmd on macOS and Ctrl
// elsewhere, so one registration covers both platforms. Press
// Cmd/Ctrl+Alt+H to surface a notification — a stand-in for
// opening a help dialog.
cesdk.shortcuts.set({
  keys: 'Mod+Alt+h',
  description: 'Show keyboard help',
  category: 'Help',
  scope: [EDITOR_SHORTCUT_SCOPE],
  run: ({ cesdk }) => {
    console.log('Help shortcut triggered');
    cesdk.ui.showNotification({
      message: 'Keyboard help triggered (Mod+Alt+H)',
      type: 'info',
      duration: 3000
    });
  }
});
```

### Registering a Single Key

The same API — pass a string with no modifier. Use the `scope` array to restrict the binding to the canvas so it doesn't fire while the user is in a panel input.

```typescript highlight-register-single-key
// Single-key shortcuts work the same way — just omit the modifier.
// Press '?' to log a quick hint.
cesdk.shortcuts.set({
  keys: 'Shift+?',
  description: 'Quick hint',
  category: 'Help',
  scope: [CANVAS_SHORTCUT_SCOPE],
  run: ({ cesdk }) => {
    cesdk.ui.showNotification({
      message: 'Tip: press Cmd/Ctrl+Alt+H for help',
      type: 'info',
      duration: 3000
    });
  }
});
```

### Registering a Sequence

Pass an array of chord strings. The runtime waits up to `sequenceTimeout` milliseconds (default 1000) between steps before forgetting an in-progress sequence. Sequences are not part of the default catalog — they're available if you want them.

```typescript highlight-register-sequence
// Sequences are arrays of chord strings pressed within `sequenceTimeout`
// milliseconds of each other. Press 'g' then 'p' to jump to the first page.
cesdk.shortcuts.set({
  keys: ['g', 'p'],
  description: 'Go to first page',
  category: 'Navigation',
  scope: [CANVAS_SHORTCUT_SCOPE],
  sequenceTimeout: 1000,
  run: ({ cesdk }) => {
    const [firstPage] = cesdk.engine.scene.getPages();
    if (firstPage != null) {
      cesdk.engine.block.select(firstPage);
      cesdk.ui.showNotification({
        message: 'Jumped to the first page',
        type: 'success',
        duration: 2000
      });
    }
  }
});
```

### Overriding a Default

Remove the existing entry with `cesdk.shortcuts.remove`, then register your replacement under the same keys.

```typescript highlight-override-default
// Replace the default save binding with a custom handler. Remove
// the existing entry first, then register the replacement on the
// same keys. `Mod+s` matches both Cmd+S (macOS) and Ctrl+S
// (Windows/Linux), so one call covers both.
cesdk.shortcuts.remove({ keys: 'Mod+s', scopes: '*' });
cesdk.shortcuts.set({
  keys: 'Mod+s',
  description: 'Custom save handler',
  category: 'File',
  scope: [EDITOR_SHORTCUT_SCOPE],
  run: ({ cesdk }) => {
    console.log('Custom save triggered — replace this with your own logic');
    cesdk.ui.showNotification({
      message: 'Custom save triggered',
      type: 'info',
      duration: 2000
    });
  }
});
```

### Scopes and Predicates

Restrict a shortcut to surfaces with its `scope` array (see the [UI Scopes](#ui-scopes) section above for the full list); the runtime filters by scope before running `when:`. The `when:` predicate then receives only the `cesdk` instance, so use it for editor-state checks (edit mode, selection, role) while `scope` handles where the shortcut fires.

```typescript highlight-when-predicate
// Use the `when:` predicate to gate execution on the active scope
// and the current selection. The runtime resolves `uiScope` from
// the focused element so the predicate doesn't need to query it.
// Press Cmd/Ctrl+Shift+M while a text block is selected to mark it
// as reviewed (here, just a log + notification).
cesdk.shortcuts.set({
  keys: 'Mod+Shift+m',
  description: 'Mark selected text as reviewed',
  category: 'Editing',
  scope: [CANVAS_SHORTCUT_SCOPE],
  run: ({ cesdk }) => {
    const [selected] = cesdk.engine.block.findAllSelected();
    console.log('Marked text block as reviewed:', selected);
    cesdk.ui.showNotification({
      message: 'Marked as reviewed',
      type: 'success',
      duration: 2000
    });
  },
  // `scope` already gates this to the canvas; `when` only checks state.
  when: ({ cesdk }) => {
    const selected = cesdk.engine.block.findAllSelected();
    if (selected.length === 0) return false;
    return selected.every(
      (id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text'
    );
  }
});
```

## API Reference

### Methods

A shortcut's identity is its `keys` + `scope`: `set` registers, and re-registering
the same `keys`+`scope` replaces it. `get` and `remove` take a `{ keys, scopes }`
selector; `list` takes a `{ scopes }` selector (it lists by scope — use `get`/`has`
to find a shortcut by chord). Every selector field is required and must be
non-empty; use `'*'` to match all (see [Filtering by Selector](#filtering-by-selector)).

```javascript
// Register a shortcut (re-using the same keys + scope replaces it). Returns a
// disposer.
const dispose = cesdk.shortcuts.set(shortcut);

// Remove a shortcut. Both keys and scopes are required; use '*' to match all.
cesdk.shortcuts.remove({ keys: 'Mod+s', scopes: '*' });

// List every registered shortcut.
const all = cesdk.shortcuts.list({ scopes: '*' });

// Filter by scope: every shortcut in the canvas scope.
const canvasShortcuts = cesdk.shortcuts.list({
  scopes: [CANVAS_SHORTCUT_SCOPE]
});

// Look up a shortcut. A chord is a single `+`-joined string; an array is a
// multi-step sequence.
const found = cesdk.shortcuts.get({ keys: 'Mod+Shift+p', scopes: '*' });

// Test whether a key combination is already bound.
const inUse = cesdk.shortcuts.has('Mod+Shift+p');

// Remove every registered shortcut.
cesdk.shortcuts.clear();
```

### Inspecting Registered Shortcuts

```typescript highlight-list-inspect
    // List every registered shortcut. Combine with `get` and `has` to build
    // help dialogs or to detect conflicts before registering custom bindings.
    const allShortcuts = cesdk.shortcuts.list({ scopes: '*' });
    console.log(`Registered shortcuts: ${allShortcuts.length}`);

    // A chord is a single `+`-joined string; an array is a multi-step sequence.
    const undoShortcut = cesdk.shortcuts.get({ keys: 'Mod+z', scopes: '*' });
    console.log('Undo shortcut:', undoShortcut);

    const conflict = cesdk.shortcuts.has('Mod+k');
    console.log('Mod+K already in use?', conflict);
```

### Filtering by Selector

`get` and `remove` take a `{ keys, scopes }` selector; `list` takes a `{ scopes }`
selector (it filters by scope only). Every field is required and must be
non-empty — an empty string or array throws. Each value is a glob pattern (or
array of them) — `*` matches any run of characters, so `{ keys: '*', scopes: '*' }`
matches everything and `{ scopes: '*' }` lists everything. For `get`/`remove` a
shortcut matches when its `keys` **and** `scopes` both match.

```typescript highlight-filter-selector
    // `list` takes a `{ scopes }` selector and lists by scope; `get` and
    // `remove` take a `{ keys, scopes }` selector and match when keys AND scopes
    // both match. Each field is a glob (or array of globs); `'*'` matches
    // everything, `[]` matches nothing. To list by key, list a scope and filter.

    // Every Mod+<key> shortcut in the canvas scope.
    const modCanvas = cesdk.shortcuts
      .list({ scopes: [CANVAS_SHORTCUT_SCOPE] })
      .filter((shortcut) => String(shortcut.keys).startsWith('Mod+'));
    console.log('Mod+ canvas shortcuts:', modCanvas.length);

    // Find the shortcut bound to a chord.
    const boldShortcut = cesdk.shortcuts.get({ keys: 'Mod+b', scopes: '*' });
    console.log('Bold shortcut:', boldShortcut);
```

`remove` matches the same way: pass `scopes: '*'` to clear a chord everywhere, or
a specific scope to limit the removal to one surface.

```typescript highlight-remove-selector
// Remove a chord in a specific scope (narrow with `scopes`, or `'*'` for all).
cesdk.shortcuts.remove({
  keys: 'Mod+b',
  scopes: [CANVAS_SHORTCUT_SCOPE]
});
```

### Where Defaults Come From

The default catalog lives next to the other configuration in the core-config plugin you load:

- `@cesdk/core-configs-web/advanced-editor` registers the full set
- The other configs (`design-editor`, `video-editor`, `advanced-video-editor`, `photo-editor`, `player-editor`, `viewer-editor`) register the same set today

Each config's `setupKeyboardShortcuts(cesdk)` calls `cesdk.shortcuts.set` for each entry. Forking that file is the supported way to ship a customized default catalog.

## Best Practices

1. **Always set `scope` for selection-sensitive shortcuts** (e.g. `scope: [CANVAS_SHORTCUT_SCOPE]`) so they don't fire while the user is typing in an unrelated input or panel, and use `when:` for the editor-state checks.
2. **Use `Mod` for cross-platform shortcuts.** `Mod` resolves to Cmd on macOS and Ctrl elsewhere, so one registration covers both platforms. Reserve the literal `Meta` and `Control` tokens for platform-specific bindings.
3. **Reuse the action system.** Prefer `run: 'action.id'` over inlining a function so the same code path is reachable from menus, the catalog, and direct `cesdk.actions.run` calls.
4. **Pick action ids that namespace your domain** (`myapp.publish`, not `publish`) to avoid colliding with the built-in catalog.
5. **Sequences are powerful but discoverable only via documentation** — use them sparingly.

## Troubleshooting

### A Shortcut Does Not Fire

- Confirm `ly.img.keyboard.shortcuts` is enabled.
- Confirm focus is inside the editor root. The listener is scoped to the editor container, not the window — host-page focus does not trigger CE.SDK shortcuts.
- Confirm the active scope matches the shortcut's `scope` — if focus has moved off the intended surface, a scoped shortcut won't be a candidate.
- Confirm the `when:` predicate is returning `true` for the current state.
- If focus is in an `<input>`, `<textarea>`, `contenteditable`, or `role="textbox"` element, all shortcuts are suppressed by design. Shortcuts that must fire inside text inputs are a planned runtime feature; until then they live on the legacy widget hook.
- Confirm the chord is not a [reserved keyword](#reserved-keywords) (`F6`, `Shift+F6`, `Alt+1`, `Alt+2`, `Alt+3`). The reserved accessibility layer handles these first, so a catalog binding on the same chord never runs.

### Browser or OS Conflicts

Some combinations cannot be reliably preempted. `Cmd+W`, `Cmd+T`, `Cmd+Q` are reserved by the browser or OS. Pick a different binding.

## Reserved Keywords

A small set of chords is **reserved** by the editor for accessibility — `F6`, `Shift+F6`, `Alt+1`, `Alt+2`, and `Alt+3` (focus navigation between the canvas, inspector bar, and canvas menu).

- Are always active and are not affected by the `ly.img.keyboard.shortcuts` feature flag.
- Fire even while focus is in a text input, so keyboard users can always move focus back out to the canvas.
- Cannot be listed, removed, or rebound through `cesdk.shortcuts`.
- **Take precedence over application-level shortcuts**: if you register one of these chords with `cesdk.shortcuts.set`, the reserved binding runs and your binding never fires.



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support