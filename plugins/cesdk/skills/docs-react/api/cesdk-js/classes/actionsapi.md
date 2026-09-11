> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

ActionsAPI provides a centralized way to manage and customize actions
for various user interactions in the Creative Engine SDK.

This API allows you to:

- Register custom actions for events (export, load, download, etc.)
- Use default implementations when no custom action is registered
- Maintain consistent behavior across different UI components

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>ActionsAPI</code></p>
  </summary>
</details>

## Methods

<details>
  <summary>
    ### register()

    <br /><p>Registers a custom action for a specific event type.</p>
  </summary>

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* [`ActionId`](./api/cesdk-js/type-aliases/actionid.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `actionId` | `T` | The event type to register an action for |
  | `action` | [`ActionFunction`](./api/cesdk-js/type-aliases/actionfunction.md)\<`T`> | The custom action function |

  #### Returns

  `void`

  #### Example

  ```typescript
  actionsAPI.register('downloadFile', async (blob, mimeType) => {
    // Custom download logic
    await customDownloadAction(blob, mimeType);
  });
  ```

  #### Signature

  ```typescript
  register(actionId: T, action: ActionFunction<T>): void
  ```

  ***
</details>

<details>
  <summary>
    ### get()

    <br /><p>Returns the custom export video action if registered, otherwise returns the default.</p>
  </summary>

  #### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `T` *extends* [`ActionId`](./api/cesdk-js/type-aliases/actionid.md) | - |
  | `C` | [`CustomActionFunction`](./api/cesdk-js/type-aliases/customactionfunction.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `actionId` | `T` | The event type to get an action for |

  #### Returns

  [`ActionFunction`](./api/cesdk-js/type-aliases/actionfunction.md)\<`T`, `C`>

  #### Example

  ```typescript
  const exportAction = actionsAPI.get('export');
  if (exportAction) {
    const result = await exportAction(options);
  }
  ```

  #### Signature

  ```typescript
  get(actionId: T): ActionFunction<T, C>
  ```

  ***
</details>

<details>
  <summary>
    ### run()

    <br /><p>Executes a registered action with the provided parameters.
    Throws an error if the action is not registered.</p>
  </summary>

  #### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `T` *extends* [`ActionId`](./api/cesdk-js/type-aliases/actionid.md) | - |
  | `C` | [`CustomActionFunction`](./api/cesdk-js/type-aliases/customactionfunction.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `actionId` | `T` | The event type to execute |
  | ...`args` | [`ActionFunction`](./api/cesdk-js/type-aliases/actionfunction.md)\<`T`, `C`> *extends* [`CustomActionFunction`](./api/cesdk-js/type-aliases/customactionfunction.md) ? `Parameters`\<[`ActionFunction`](./api/cesdk-js/type-aliases/actionfunction.md)> : `never`\[] | The arguments to pass to the action |

  #### Returns

  `Promise`\<[`ActionFunction`](./api/cesdk-js/type-aliases/actionfunction.md)\<`T`, `C`> *extends* (...`args`) => `R` ? `R` : `never`>

  The result of the action execution

  #### Throws

  Error if the action is not registered

  #### Example

  ```typescript
  try {
    const result = await actionsAPI.run('exportDesign', exportOptions);
    console.log('Export completed', result);
  } catch (error) {
    console.error('Export action not registered');
  }
  ```

  #### Signature

  ```typescript
  run(actionId: T, args: ActionFunction<T, C> extends CustomActionFunction ? Parameters<ActionFunction> : never[]): Promise<ActionFunction<T, C> extends (args: any[]) => R ? R : never>
  ```

  ***
</details>

<details>
  <summary>
    ### list()

    <br /><p>Returns all registered action IDs.</p>
  </summary>

  This method retrieves a list of all action identifiers that are
  available.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `matcher?`: `string`; } | Optional configuration object with the following properties: - `matcher`: Optional pattern to match against. Use `*` for wildcard matching. |
  | `options.matcher?` | `string` | - |

  #### Returns

  [`ActionId`](./api/cesdk-js/type-aliases/actionid.md)\[]

  An array of action IDs currently registered in the store

  #### Example

  ```typescript
  const registeredActions = actionsAPI.list();
  console.log('Available actions:', registeredActions);
  // Output: ['saveScene', 'exportDesign', 'customAction1', ...]

  // Find all export-related actions using wildcard
  const exportActions = actionsAPI.list({ matcher: 'export*' });
  console.log('Export actions:', exportActions);
  // Output: ['exportDesign', 'exportScene', ...]
  ```

  #### Signature

  ```typescript
  list(options?: object): ActionId[]
  ```
</details>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support