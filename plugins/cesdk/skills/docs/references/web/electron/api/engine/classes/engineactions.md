> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Named actions for one engine, one per id. The engine registers its own actions (e.g.
undo/redo) and you register yours; registering an id replaces whatever was there, whoever
registered it.

Actions you register run directly in JS, so on the web you get full fidelity: [get](./api/engine/classes/engineactions.md) hands back your function and [run](./api/engine/classes/engineactions.md) passes args/results by
reference (non-serializable payloads like File/Blob work). The engine also keeps
a JSON trampoline per action so the engine's own actions run natively and yours stay
reachable across the FFI — that path is JSON-only and async.

## Remarks

Main-thread only.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Registry` *extends* `object` | [`EngineActionsRegistry`](./api/engine/interfaces/engineactionsregistry.md) |

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>EngineActions\<Registry</code>></p>
  </summary>
</details>

## Methods

<details>
  <summary>
    ### register()

    <br /><p>Register an action, replacing any existing one with the same id.</p>
  </summary>

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* `string` |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `K` | The action id (e.g. `undo`). Registering an id the engine uses replaces the engine's action. |
  | `fn` | `Registry`\[`K`] *extends* (...`args`) => `any` ? `any`\[`any`] : [`EngineCustomActionFunction`](./api/engine/type-aliases/enginecustomactionfunction.md) | The action body (sync or async). On the web it runs directly with any JS values. Across the FFI args/results are JSON, so only serializable payloads work there. |

  ##### Returns

  `void`

  #### Call Signature

  ```ts
  register(id, fn): void;
  ```

  Register an action, replacing any existing one with the same id.

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The action id (e.g. `undo`). Registering an id the engine uses replaces the engine's action. |
  | `fn` | [`EngineCustomActionFunction`](./api/engine/type-aliases/enginecustomactionfunction.md) | The action body (sync or async). On the web it runs directly with any JS values. Across the FFI args/results are JSON, so only serializable payloads work there. |

  ##### Returns

  `void`

  #### Signatures

  ```typescript
  register(id: K, fn: Registry[K] extends (args: any[]) => any ? any[any] : EngineCustomActionFunction): void
  ```

  ```typescript
  register(id: string, fn: EngineCustomActionFunction): void
  ```

  ***
</details>

<details>
  <summary>
    ### get()

    <br /><p>Get the action registered for an id, as a function.</p>
  </summary>

  For an action you registered, returns your function, which you can call synchronously. For
  an action the engine registered, returns an async function with JSON arguments and result.
  Either way the function keeps running that action after the id is registered over or
  unregistered, so get it first to build on it, and register it again to restore it. Registering
  it puts back the engine's action itself, so it runs in the same tick as before:

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* `string` |

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `K` |

  ##### Returns

  `Registry`\[`K`]

  The function, or `undefined` for an unknown id.

  ##### Example

  ```ts
  const undo = engine.actions.get('history.undo')!;
  engine.actions.register('history.undo', async () => {
    console.log('undo');
    return undo();
  });
  // Later: put the engine's undo back.
  engine.actions.register('history.undo', undo);
  ```

  ##### Remarks

  Available on the web bindings and on `@cesdk/node-native`.

  #### Call Signature

  ```ts
  get(id): EngineCustomActionFunction;
  ```

  Get the action registered for an id, as a function.

  For an action you registered, returns your function, which you can call synchronously. For
  an action the engine registered, returns an async function with JSON arguments and result.
  Either way the function keeps running that action after the id is registered over or
  unregistered, so get it first to build on it, and register it again to restore it. Registering
  it puts back the engine's action itself, so it runs in the same tick as before:

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |

  ##### Returns

  [`EngineCustomActionFunction`](./api/engine/type-aliases/enginecustomactionfunction.md)

  The function, or `undefined` for an unknown id.

  ##### Example

  ```ts
  const undo = engine.actions.get('history.undo')!;
  engine.actions.register('history.undo', async () => {
    console.log('undo');
    return undo();
  });
  // Later: put the engine's undo back.
  engine.actions.register('history.undo', undo);
  ```

  ##### Remarks

  Available on the web bindings and on `@cesdk/node-native`.

  #### Signatures

  ```typescript
  get(id: K): Registry[K]
  ```

  ```typescript
  get(id: string): EngineCustomActionFunction
  ```

  ***
</details>

<details>
  <summary>
    ### run()

    <br /><p>Run an action by id and return its result as a Promise.</p>
  </summary>

  JS-registered actions are called directly (args/result by reference). Actions the
  engine registered go across the FFI (JSON args/result).

  ##### Type Parameters

  | Type Parameter |
  | ------ |
  | `K` *extends* `string` |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `K` | The action id. |
  | ...`args` | `Registry`\[`K`] *extends* (...`args`) => `any` ? `A` : `unknown`\[] | Arguments forwarded to the action. |

  ##### Returns

  `Promise`\<`Registry`\[`K`] *extends* (...`args`) => `R` ? `Awaited`\<`R`> : `unknown`>

  The action's result, or a rejection if the id is unknown, it threw, or
  the engine was disposed while the run was still in flight.

  #### Call Signature

  ```ts
  run<R>(id, ...args): Promise<R>;
  ```

  Run an action by id and return its result as a Promise.

  JS-registered actions are called directly (args/result by reference). Actions the
  engine registered go across the FFI (JSON args/result).

  ##### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `R` | `unknown` |

  ##### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The action id. |
  | ...`args` | `unknown`\[] | Arguments forwarded to the action. |

  ##### Returns

  `Promise`\<`R`>

  The action's result, or a rejection if the id is unknown, it threw, or
  the engine was disposed while the run was still in flight.

  #### Signatures

  ```typescript
  run(id: K, args: Registry[K] extends (args: A) => any ? A : unknown[]): Promise<Registry[K] extends (args: any[]) => R ? Awaited<R> : unknown>
  ```

  ```typescript
  run(id: string, args: unknown[]): Promise<R>
  ```

  ***
</details>

<details>
  <summary>
    ### has()

    <br /><p>Whether an action with this id is registered, whoever registered it.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  has(id: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### unregister()

    <br /><p>Remove the action registered for an id, whoever registered it. Returns <code>false</code> when the id is
    unknown.</p>
  </summary>

  Nothing comes back in its place. To restore an action you replaced, register the function [get](./api/engine/classes/engineactions.md) returned for it. Unregistering an id the engine runs itself, such as `select`,
  `zoom`, `pan` or `asset.drop`, turns that interaction off; register a replacement to change it.

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  unregister(id: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### list()

    <br /><p>List registered actions, optionally filtered by a <code>\*</code> glob matcher on the id.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `options?` | \{ `matcher?`: `string`; } |
  | `options.matcher?` | `string` |

  #### Returns

  [`EngineActionInfo`](./api/engine/interfaces/engineactioninfo.md)\[]

  #### Signature

  ```typescript
  list(options?: object): EngineActionInfo[]
  ```
</details>


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support