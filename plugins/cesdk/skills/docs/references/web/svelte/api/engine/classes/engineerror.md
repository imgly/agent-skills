> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Structured CE.SDK error. Extends the standard JS `Error` so existing
`try { ... } catch (error) { console.log(error.message); }` flows keep working — `message` is
the engine's rendered English string. The structured fields (`code`, `category`, `hint`, `args`,
`docsUrl`, `silent`) let consumers branch on stable identifiers instead of matching on
the message string and surface customer-facing copy + doc links.

Every engine error carries a stable, non-empty catalog `code`. Branch on the codes you handle
and keep a `default` fallback to the message for the rest — the catalog is append-only, so
existing codes never change meaning but new codes ship over time.

The error's `name` embeds the code (`"EngineError [SCENE.NOT_VALID]"`), so stack traces
and `String(error)` identify the failure without inspecting fields. Don't match on `name` —
narrow with [isEngineError](./api/engine/functions/isengineerror.md) (or `instanceof`) and branch on [code](./api/engine/classes/engineerror.md).

When logging to an external service, note that `JSON.stringify(error)` serializes the
structured own fields but — as with any `Error` — omits `message` and `stack`. Extract the
payload explicitly, e.g.
`{ code: error.code, message: error.message, hint: error.hint, args: error.args }`.

## Example

```typescript
try {
  engine.block.setTextFontSize(blockId, 0);
} catch (error) {
  if (error instanceof EngineError && error.code === 'BLOCK.TEXT_INVALID_FONT_SIZE') {
    toast.show(t(`error.${camelCase(error.code)}`, error.args));
    if (error.docsUrl) window.open(error.docsUrl);
  } else {
    throw error;
  }
}
```

## Extends

- `Error`

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p>| Parameter | Type |
    | ------ | ------ |
    | <code>message?</code> | <code>string</code> |</p>
  </summary>

  #### Returns

  `EngineError`

  #### Inherited from

  ```ts
  Error.constructor
  ```
</details>

<details>
  <summary>
    ### Constructor

    <br /><p>| Parameter | Type |
    | ------ | ------ |
    | <code>message?</code> | <code>string</code> |
    | <code>options?</code> | <code>ErrorOptions</code> |</p>
  </summary>

  #### Returns

  `EngineError`

  #### Inherited from

  ```ts
  Error.constructor
  ```
</details>

## Methods

<details>
  <summary>
    ### captureStackTrace()

    <br /><p>Creates a <code>.stack</code> property on <code>targetObject</code>, which when accessed returns
    a string representing the location in the code at which
    <code>Error.captureStackTrace()</code> was called.</p>
  </summary>

  ```js
  const myObject = {};
  Error.captureStackTrace(myObject);
  myObject.stack;  // Similar to `new Error().stack`
  ```

  The first line of the trace will be prefixed with
  `${myObject.name}: ${myObject.message}`.

  The optional `constructorOpt` argument accepts a function. If given, all frames
  above `constructorOpt`, including `constructorOpt`, will be omitted from the
  generated stack trace.

  The `constructorOpt` argument is useful for hiding implementation
  details of error generation from the user. For instance:

  ```js
  function a() {
    b();
  }

  function b() {
    c();
  }

  function c() {
    // Create an error without stack trace to avoid calculating the stack trace twice.
    const { stackTraceLimit } = Error;
    Error.stackTraceLimit = 0;
    const error = new Error();
    Error.stackTraceLimit = stackTraceLimit;

    // Capture the stack trace above function b
    Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
    throw error;
  }

  a();
  ```

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `targetObject` | `object` |
  | `constructorOpt?` | `Function` |

  #### Returns

  `void`

  #### Inherited from

  ```ts
  Error.captureStackTrace
  ```

  #### Signature

  ```typescript
  captureStackTrace(targetObject: object, constructorOpt?: Function): void
  ```

  ***
</details>

<details>
  <summary>
    ### prepareStackTrace()

    <br /><p>| Parameter | Type |
    | ------ | ------ |
    | <code>err</code> | <code>Error</code> |
    | <code>stackTraces</code> | <code>CallSite</code>\[] |</p>
  </summary>

  #### Returns

  `any`

  #### See

  https://v8.dev/docs/stack-trace-api#customizing-stack-traces

  #### Inherited from

  ```ts
  Error.prepareStackTrace
  ```

  #### Signature

  ```typescript
  prepareStackTrace(err: Error, stackTraces: CallSite[]): any
  ```
</details>

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `stackTraceLimit` | `static` | `number` | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured *after* the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | `Error.stackTraceLimit` |
|  `code` | `readonly` | `string` | Stable catalog id (e.g. `"SCENE.NOT_VALID"`). Non-empty for every engine error. | - |
|  `category` | `readonly` | `string` | Category prefix of [code](./api/engine/classes/engineerror.md) (e.g. `"SCENE"`). | - |
|  `hint` | `readonly` | `string` | English "what to do next" hint, already interpolated with [args](./api/engine/classes/engineerror.md). Empty when the catalog entry does not declare a hint. | - |
|  `args` | `readonly` | `Record`\<`string`, [`EngineErrorArg`](./api/engine/type-aliases/engineerrorarg.md)> | Typed template arguments. Numbers stay numbers, booleans stay booleans, strings stay strings — pass this map straight into `i18next`/`Intl.NumberFormat`/etc. | - |
|  `silent` | `readonly` | `boolean` | Whether the catalog marks this error as silent (expected platform limitation that should not be logged). Consumers may still surface it programmatically. | - |
|  `docsUrl` | `readonly` | `string` | Fully-qualified docs URL on `img.ly`, e.g. `https://img.ly/docs/cesdk/js/user-interface/font-size-d194d1/`. `null` when the catalog entry links no docs page. | - |
|  `cause?` | `public` | `unknown` | - | `Error.cause` |
|  `name` | `public` | `string` | - | `Error.name` |
|  `message` | `public` | `string` | - | `Error.message` |
|  `stack?` | `public` | `string` | - | `Error.stack` |


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support