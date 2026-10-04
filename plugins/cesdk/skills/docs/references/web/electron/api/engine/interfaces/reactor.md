> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

The reactor coordinates the update of registered *Reactions*.

- Reactions are created with `createReaction()`
- `reaction.track(effect)` will run the effect and associate any engine read
  calls during the execution with the Reaction.
- `reaction.subscribe(handler)` will invoke the handler whenever the engine read calls
  in the reaction might have changed after an update.

## Methods

### createReaction()

```ts
createReaction(debugName?): Reaction;
```

Create and return a new Reaction that is associated with this Reactor.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `debugName?` | `string` |

#### Returns

[`Reaction`](./api/engine/interfaces/reaction.md)

***

### dispose()

```ts
dispose(): void;
```

Dispose the reactor and all reactions.
After this call, the reactor is no longer usable.

#### Returns

`void`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `nextReaction` | `Promise`\<`void`> | A promise that will resolve after the next update of the Reactor. This can be used to wait for the next update of the Reactor in an async function. `await reactor.nextReaction;` This is useful in situations where you want to make sure that the effects of a reactor update have propagated to any dependent code before continuing. Particularly, this can be used to ensure that the UI has updated before continuing with other operations. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support