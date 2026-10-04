> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

`engine.shortcuts` — a remappable map of keyboard shortcuts to actions.

Each shortcut maps a chord (e.g. `Mod+z`, `Shift+ArrowUp`) to a `run` (an
action id run via `engine.actions.run`, or an inline function), plus a `scope`
(the UI scopes it is restricted to) and an optional `when` gate. This web layer owns the key map and the listener; the C++ engine stays
input-agnostic.

The API is engine-only: `when`/`run` receive `{ engine }`. Scope is filtered
by the dispatcher (via each shortcut's `scope`), not the predicate. A host
that needs richer state (the web editor's `cesdk.ui.shortcuts`) closes over it
in the predicates it registers — the engine never sees it.

## Remarks

Browser-only. The editor mounts it on its container automatically.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>ShortcutsAPI</code></p>
  </summary>
</details>

## Methods

<details>
  <summary>
    ### set()

    <br /><p>Register one keyboard shortcut, or many at once. A shortcut's identity is
    its <code>keys</code>+<code>scope</code>: registering that combination again replaces it.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `shortcut` | | [`Shortcut`](./api/engine/interfaces/shortcut.md) | [`Shortcut`](./api/engine/interfaces/shortcut.md)\[] | A shortcut, or an array of them. |

  #### Returns

  A disposer that removes everything this call registered.

  () => `void`

  #### Signature

  ```typescript
  set(shortcut: Shortcut | Shortcut[]): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### remove()

    <br /><p>Remove every shortcut matching <code>options</code> (<code>keys</code> AND <code>scopes</code>, glob-matched).
    Both fields are required and must be non-empty; use <code>'\*'</code> to match all (e.g.
    <code>\{ keys: 'Mod+s', scopes: '\*' }</code>). Throws on an empty <code>keys</code>/<code>scopes</code>.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options` | \{ `keys`: `string` | `string`\[]; `scopes`: | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md) | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md)\[]; } |
  | `options.keys` | `string` | `string`\[] |
  | `options.scopes` | | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md) | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md)\[] |

  #### Returns

  `void`

  #### Signature

  ```typescript
  remove(options: object): void
  ```

  ***
</details>

<details>
  <summary>
    ### has()

    <br /><p>Whether a shortcut is bound to the given key combo or sequence.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `keys` | `string` | `string`\[] |

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  has(keys: string | string[]): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### get()

    <br /><p>Get the first shortcut matching <code>options</code>, or <code>undefined</code>. See <code>list</code> for the
    matching rules.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options` | \{ `keys`: `string` | `string`\[]; `scopes`: | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md) | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md)\[]; } |
  | `options.keys` | `string` | `string`\[] |
  | `options.scopes` | | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md) | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md)\[] |

  #### Returns

  [`Shortcut`](./api/engine/interfaces/shortcut.md)

  #### Signature

  ```typescript
  get(options: object): Shortcut
  ```

  ***
</details>

<details>
  <summary>
    ### list()

    <br /><p>List the shortcuts whose scope matches <code>options.scopes</code> (glob-matched).
    <code>scopes</code> is required and must be non-empty; <code>\{ scopes: '\*' }</code> lists
    everything. Throws on an empty <code>scopes</code>. To find a rule by chord use
    <code>get</code>/<code>has</code>.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options` | \{ `scopes`: | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md) | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md)\[]; } |
  | `options.scopes` | | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md) | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md)\[] |

  #### Returns

  [`Shortcut`](./api/engine/interfaces/shortcut.md)\[]

  #### Signature

  ```typescript
  list(options: object): Shortcut[]
  ```

  ***
</details>

<details>
  <summary>
    ### clear()

    <br /><p>Remove every registered shortcut. Scopes and the listener are untouched.</p>
  </summary>

  #### Returns

  `void`

  #### Signature

  ```typescript
  clear(): void
  ```

  ***
</details>

<details>
  <summary>
    ### setEnabled()

    <br /><p>Enable or disable the whole keyboard layer.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `enabled` | `boolean` |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setEnabled(enabled: boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### addScope()

    <br /><p>Register a UI scope id the dispatcher should recognise while resolving the
    active scope. Hosts stamp <code>data-shortcut-scope="\<id>"</code> on the matching DOM
    surface; the walk returns the nearest such ancestor's id.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | [`ShortcutScopeId`](./api/engine/type-aliases/shortcutscopeid.md) |

  #### Returns

  A disposer that unregisters this scope id.

  () => `void`

  #### Signature

  ```typescript
  addScope(id: ShortcutScopeId): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### setRoot()

    <br /><p>Set the DOM root the keyboard layer binds to: the capture-phase <code>keydown</code>
    listener is attached to <code>target</code>, and scope resolution walks up to it.
    Defaults to the engine canvas, so a headless integration is scoped out of
    the box and never swallows the host app's keys. A host UI passes its editor
    container to widen coverage.</p>
  </summary>

  Calling it again re-binds onto the new target — this is how you change the
  root. Returns a disposer that stops listening.

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `target?` | [`ShortcutRoot`](./api/engine/type-aliases/shortcutroot.md) |

  #### Returns

  () => `void`

  #### Signature

  ```typescript
  setRoot(target?: ShortcutRoot): () => void
  ```
</details>


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support