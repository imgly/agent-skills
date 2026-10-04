> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Reactions track read calls and provide a way to react if they change.

- Read calls are tracked by passing a function to `track`. That function
  will be executed, and any read calls made during that execution will be
  tracked and associated with this reaction.
- Reactions can be subscribed to by passing a callback to `subscribe`. That
  callback will be executed whenever any of the read calls associated with
  this reaction change.

## Methods

### track()

```ts
track<T>(cb): T;
```

Execute the callback and track all engine read calls that happen during
the execution. These read calls are associated with this reaction.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | () => `T` |

#### Returns

`T`

***

### subscribe()

```ts
subscribe(cb): () => void;
```

When the Reactor detects that the engine read calls associated with this
reaction might have changed, it will invoke the subscription handler.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | () => `void` |

#### Returns

A function that can be called to unsubscribe the handler.

() => `void`

***

### dispose()

```ts
dispose(): void;
```

Unsubscribe all handlers, nullify the reference to the Reactor
and dispose the reaction.

#### Returns

`void`


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support