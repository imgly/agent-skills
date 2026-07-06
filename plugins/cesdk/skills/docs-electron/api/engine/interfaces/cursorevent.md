> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Dispatched on the engine canvas when the text input has been blurred.
Call `preventDefault()` to disallow this and refocus the engine text input.

## Extends

- `CustomEvent`\<`string`>

## Methods

### preventDefault()

```ts
preventDefault(): void;
```

If default is prevented, the Creative Engine won't apply the cursor style to itself.

#### Returns

`void`

#### Overrides

```ts
CustomEvent.preventDefault
```

***

### ~~initCustomEvent()~~

```ts
initCustomEvent(
   type, 
   bubbles?, 
   cancelable?, 
   detail?): void;
```

The **`CustomEvent.initCustomEvent()`** method initializes a CustomEvent object.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `bubbles?` | `boolean` |
| `cancelable?` | `boolean` |
| `detail?` | `string` |

#### Returns

`void`

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomEvent/initCustomEvent)

#### Inherited from

```ts
CustomEvent.initCustomEvent
```

***

### composedPath()

```ts
composedPath(): EventTarget[];
```

The **`composedPath()`** method of the Event interface returns the event's path which is an array of the objects on which listeners will be invoked.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/composedPath)

#### Returns

`EventTarget`\[]

#### Inherited from

```ts
CustomEvent.composedPath
```

***

### ~~initEvent()~~

```ts
initEvent(
   type, 
   bubbles?, 
   cancelable?): void;
```

The **`Event.initEvent()`** method is used to initialize the value of an event created using Document.createEvent().

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `bubbles?` | `boolean` |
| `cancelable?` | `boolean` |

#### Returns

`void`

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/initEvent)

#### Inherited from

```ts
CustomEvent.initEvent
```

***

### stopImmediatePropagation()

```ts
stopImmediatePropagation(): void;
```

The **`stopImmediatePropagation()`** method of the If several listeners are attached to the same element for the same event type, they are called in the order in which they were added.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/stopImmediatePropagation)

#### Returns

`void`

#### Inherited from

```ts
CustomEvent.stopImmediatePropagation
```

***

### stopPropagation()

```ts
stopPropagation(): void;
```

The **`stopPropagation()`** method of the Event interface prevents further propagation of the current event in the capturing and bubbling phases.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)

#### Returns

`void`

#### Inherited from

```ts
CustomEvent.stopPropagation
```

## Properties

| Property | Modifier | Type | Description | Overrides | Inherited from |
| ------ | ------ | ------ | ------ | ------ | ------ |
|  `type` | `readonly` | `"cesdk-cursor"` | The **`type`** read-only property of the Event interface returns a string containing the event's type. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/type) | `CustomEvent.type` | - |
|  `detail` | `readonly` | `string` | Contains the cursor style | `CustomEvent.detail` | - |
|  `bubbles` | `readonly` | `boolean` | The **`bubbles`** read-only property of the Event interface indicates whether the event bubbles up through the DOM tree or not. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/bubbles) | - | `CustomEvent.bubbles` |
|  ~~`cancelBubble`~~ | `public` | `boolean` | The **`cancelBubble`** property of the Event interface is deprecated. **Deprecated** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/cancelBubble) | - | `CustomEvent.cancelBubble` |
|  `cancelable` | `readonly` | `boolean` | The **`cancelable`** read-only property of the Event interface indicates whether the event can be canceled, and therefore prevented as if the event never happened. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/cancelable) | - | `CustomEvent.cancelable` |
|  `composed` | `readonly` | `boolean` | The read-only **`composed`** property of the or not the event will propagate across the shadow DOM boundary into the standard DOM. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/composed) | - | `CustomEvent.composed` |
|  `currentTarget` | `readonly` | `EventTarget` | The **`currentTarget`** read-only property of the Event interface identifies the element to which the event handler has been attached. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/currentTarget) | - | `CustomEvent.currentTarget` |
|  `defaultPrevented` | `readonly` | `boolean` | The **`defaultPrevented`** read-only property of the Event interface returns a boolean value indicating whether or not the call to Event.preventDefault() canceled the event. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/defaultPrevented) | - | `CustomEvent.defaultPrevented` |
|  `eventPhase` | `readonly` | `number` | The **`eventPhase`** read-only property of the being evaluated. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/eventPhase) | - | `CustomEvent.eventPhase` |
|  `isTrusted` | `readonly` | `boolean` | The **`isTrusted`** read-only property of the when the event was generated by the user agent (including via user actions and programmatic methods such as HTMLElement.focus()), and `false` when the event was dispatched via The only exception is the `click` event, which initializes the `isTrusted` property to `false` in user agents. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/isTrusted) | - | `CustomEvent.isTrusted` |
|  ~~`returnValue`~~ | `public` | `boolean` | The Event property **`returnValue`** indicates whether the default action for this event has been prevented or not. **Deprecated** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/returnValue) | - | `CustomEvent.returnValue` |
|  ~~`srcElement`~~ | `readonly` | `EventTarget` | The deprecated **`Event.srcElement`** is an alias for the Event.target property. **Deprecated** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/srcElement) | - | `CustomEvent.srcElement` |
|  `target` | `readonly` | `EventTarget` | The read-only **`target`** property of the dispatched. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/target) | - | `CustomEvent.target` |
|  `timeStamp` | `readonly` | `number` | The **`timeStamp`** read-only property of the Event interface returns the time (in milliseconds) at which the event was created. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/timeStamp) | - | `CustomEvent.timeStamp` |
|  `NONE` | `readonly` | `0` | - | - | `CustomEvent.NONE` |
|  `CAPTURING_PHASE` | `readonly` | `1` | - | - | `CustomEvent.CAPTURING_PHASE` |
|  `AT_TARGET` | `readonly` | `2` | - | - | `CustomEvent.AT_TARGET` |
|  `BUBBLING_PHASE` | `readonly` | `3` | - | - | `CustomEvent.BUBBLING_PHASE` |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support