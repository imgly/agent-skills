> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Manage text variables within design templates.

Text variables enable dynamic content replacement in design templates. Variables are stored
as key-value pairs and can be referenced in text blocks for automated content updates.

```ts
// Configure a text block that displays 'Hello, World'
const block = cesdk.engine.block.create('text');
cesdk.engine.block.setText(block, 'Hello, {{name}}!');
cesdk.engine.variable.setString('name', 'World');
```

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>VariableAPI</code></p>
  </summary>
</details>

## Variable Management

Create, update, retrieve, and remove text variables from the engine.

<details>
  <summary>
    ### findAll()

    <br /><p>Get all text variable names currently stored in the engine.</p>
  </summary>

  #### Returns

  `string`\[]

  List of variable names.

  #### Signature

  ```typescript
  findAll(): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### setString()

    <br /><p>Set a text variable's value.</p>
  </summary>

  Creates a new variable if the key doesn't exist, or updates an existing one.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `key` | `string` | The variable's key. |
  | `value` | `string` | The text value to assign to the variable. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setString(key: string, value: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### getString()

    <br /><p>Get a text variable's value.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `key` | `string` | The variable's key. |

  #### Returns

  `string`

  The text value of the variable.

  #### Signature

  ```typescript
  getString(key: string): string
  ```

  ***
</details>

<details>
  <summary>
    ### remove()

    <br /><p>Remove a text variable from the engine.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `key` | `string` | The variable's key to remove. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  remove(key: string): void
  ```
</details>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support