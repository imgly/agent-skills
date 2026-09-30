> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A public interface for controlling the UI of the Creative Editor SDK

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>UserInterfaceAPI</code></p>
  </summary>
</details>

## Methods

<details>
  <summary>
    ### setGlobalStateValue()

    <br /><p>| Type Parameter |
    | ------ |
    | <code>T</code> |</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |
  | `value` | `T` |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setGlobalStateValue(id: string, value: T): void
  ```

  ***
</details>

<details>
  <summary>
    ### getGlobalStateValue()

    <br /><p>| Type Parameter |
    | ------ |
    | <code>T</code> |</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |
  | `defaultValue?` | `T` |

  #### Returns

  `T`

  #### Signature

  ```typescript
  getGlobalStateValue(id: string, defaultValue?: T): T
  ```

  ***
</details>

<details>
  <summary>
    ### hasGlobalStateValue()

    <br /><p>| Parameter | Type |
    | ------ | ------ |
    | <code>id</code> | <code>string</code> |</p>
  </summary>

  #### Returns

  `boolean`

  #### Signature

  ```typescript
  hasGlobalStateValue(id: string): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### onGlobalStateChanged()

    <br /><p>| Type Parameter |
    | ------ |
    | <code>T</code> |</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `id` | `string` |
  | `callback` | (`value`) => `void` |

  #### Returns

  () => `void`

  #### Signature

  ```typescript
  onGlobalStateChanged(id: string, callback: (value: T) => void): () => void
  ```
</details>


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support