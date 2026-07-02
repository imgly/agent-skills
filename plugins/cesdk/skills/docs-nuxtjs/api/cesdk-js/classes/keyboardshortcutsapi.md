> This is one page of the CE.SDK Nuxt.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

`cesdk.shortcuts` — the editor-facing keyboard shortcut API.

A thin wrapper over the engine's `engine.shortcuts` registry that translates
the editor-facing KeyboardShortcut (whose `when`/`run` receive a context with
`cesdk`) to/from the engine Shortcut (whose callbacks receive a context with
`engine`). The `cesdk` instance is closed over here so the engine layer
never needs to know about it.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>KeyboardShortcutsAPI</code></p>
  </summary>
</details>

## Methods

<details>
  <summary>
    ### set()

    <br /><p>Register one keyboard shortcut, or many at once.</p>
  </summary>

  A shortcut's identity is its `keys` + `scope`: registering the same
  combination again replaces it. Pass an array to register several in one
  call.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `shortcut` | | [`KeyboardShortcut`](./api/cesdk-js/interfaces/keyboardshortcut.md) | [`KeyboardShortcut`](./api/cesdk-js/interfaces/keyboardshortcut.md)\[] | A shortcut, or an array of them. |

  #### Returns

  A disposer that removes everything this call registered.

  () => `void`

  #### Signature

  ```typescript
  set(shortcut: KeyboardShortcut | KeyboardShortcut[]): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### list()

    <br /><p>List the keyboard shortcuts whose scope matches <code>options.scopes</code>
    (glob-matched). <code>scopes</code> is required and must be non-empty; <code>\{ scopes: '\*' }</code>
    lists everything. Throws on an empty <code>scopes</code>. To find a shortcut by chord
    use <code>get</code>/<code>has</code>.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options` | \{ `scopes`: `any`; } |
  | `options.scopes` | `any` |

  #### Returns

  [`KeyboardShortcut`](./api/cesdk-js/interfaces/keyboardshortcut.md)\[]

  #### Signature

  ```typescript
  list(options: object): KeyboardShortcut[]
  ```

  ***
</details>

<details>
  <summary>
    ### get()

    <br /><p>Get the first keyboard shortcut matching <code>options</code>, or <code>undefined</code>. See
    <code>list</code> for the matching rules.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options` | \{ `keys`: `string` | `string`\[]; `scopes`: `any`; } |
  | `options.keys` | `string` | `string`\[] |
  | `options.scopes` | `any` |

  #### Returns

  [`KeyboardShortcut`](./api/cesdk-js/interfaces/keyboardshortcut.md)

  #### Signature

  ```typescript
  get(options: object): KeyboardShortcut
  ```

  ***
</details>

<details>
  <summary>
    ### remove()

    <br /><p>Remove every keyboard shortcut matching <code>options</code> (<code>keys</code> AND <code>scopes</code>).
    Both fields are required and must be non-empty; use <code>'\*'</code> to match all —
    for example, <code>keys: 'Mod+s'</code> with <code>scopes: '\*'</code> removes that chord from
    every scope. Throws on an empty field.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options` | \{ `keys`: `string` | `string`\[]; `scopes`: `any`; } |
  | `options.keys` | `string` | `string`\[] |
  | `options.scopes` | `any` |

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

    <br /><p>Whether a key combination or sequence is in use.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `keys` | | `string` | [`KeyboardKey`](./api/cesdk-js/type-aliases/keyboardkey.md)\[] | The chord (e.g. `'Mod+s'`) or sequence steps. |

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  has(keys: string | KeyboardKey[]): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### clear()

    <br /><p>Remove every registered keyboard shortcut.</p>
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

    <br /><p>Enable or disable the whole keyboard layer. Disabling detaches the listener
    without unregistering shortcuts, so re-enabling restores them.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `enabled` | `boolean` | `true` to enable, `false` to disable. |

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
    active scope. The editor wires its built-in scopes automatically; use this
    for custom surfaces stamped with <code>data-shortcut-scope</code>.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `any` | The scope id to recognise. |

  #### Returns

  A disposer that unregisters the scope id.

  () => `void`

  #### Signature

  ```typescript
  addScope(id: any): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### setRoot()

    <br /><p>Set the DOM root the keyboard layer binds to (the capture-phase keydown
    listener and scope resolution). The editor sets this to its container
    automatically; override only for custom mounting.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `target` | `ShortcutRoot` | The element/document to bind to. |

  #### Returns

  A disposer that stops listening.

  () => `void`

  #### Signature

  ```typescript
  setRoot(target: ShortcutRoot): () => void
  ```
</details>


---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/docs/cesdk/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support