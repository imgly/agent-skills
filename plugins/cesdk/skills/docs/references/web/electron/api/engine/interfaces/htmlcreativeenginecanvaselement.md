> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A wrapper around a plain canvas

The idea is to shield the user from the weird semantics of changing width
and height of a canvas by making this a opaque block element instead and
managing the internal render resolution of the canvas dynamically

## Extends

- `HTMLElement`

## Accessors

### classList

#### Get Signature

```ts
get classList(): DOMTokenList;
```

The **`Element.classList`** is a read-only property that returns a live DOMTokenList collection of the `class` attributes of the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/classList)

##### Returns

`DOMTokenList`

#### Set Signature

```ts
set classList(value): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

```ts
HTMLElement.classList
```

***

### part

#### Get Signature

```ts
get part(): DOMTokenList;
```

The **`part`** property of the Element interface represents the part identifier(s) of the element (i.e., set using the `part` attribute), returned as a DOMTokenList.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/part)

##### Returns

`DOMTokenList`

#### Set Signature

```ts
set part(value): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

```ts
HTMLElement.part
```

***

### textContent

#### Get Signature

```ts
get textContent(): string;
```

[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

##### Returns

`string`

#### Set Signature

```ts
set textContent(value): void;
```

The **`textContent`** property of the Node interface represents the text content of the node and its descendants.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/textContent)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

```ts
HTMLElement.textContent
```

***

### style

#### Get Signature

```ts
get style(): CSSStyleDeclaration;
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/style)

##### Returns

`CSSStyleDeclaration`

#### Set Signature

```ts
set style(cssText): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `cssText` | `string` |

##### Returns

`void`

#### Inherited from

```ts
HTMLElement.style
```

## Methods

### clear()

```ts
clear(): void;
```

Clear the canvas

This is useful when mounting the canvas into a new position in the DOM.
If the canvas is not cleared, it will appear in the new DOM position, with
its contents stretched to the new size. It will re-render correctly during
the next animation frame, but for a brief moment the canvas contents can
flash distorted.

Call `clear()` before mounting into the DOM to avoid this. This will cause
the canvas to be cleared until rendering the next frame.

#### Returns

`void`

***

### animate()

```ts
animate(keyframes, options?): Animation;
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animate)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `keyframes` | `Keyframe`\[] | `PropertyIndexedKeyframes` |
| `options?` | `number` | `KeyframeAnimationOptions` |

#### Returns

`Animation`

#### Inherited from

```ts
HTMLElement.animate
```

***

### getAnimations()

```ts
getAnimations(options?): Animation[];
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAnimations)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `GetAnimationsOptions` |

#### Returns

`Animation`\[]

#### Inherited from

```ts
HTMLElement.getAnimations
```

***

### after()

```ts
after(...nodes): void;
```

Inserts nodes just after node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/after)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` | `Node`)\[] |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.after
```

***

### before()

```ts
before(...nodes): void;
```

Inserts nodes just before node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/before)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` | `Node`)\[] |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.before
```

***

### remove()

```ts
remove(): void;
```

Removes node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/remove)

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.remove
```

***

### replaceWith()

```ts
replaceWith(...nodes): void;
```

Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/replaceWith)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` | `Node`)\[] |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.replaceWith
```

***

### attachShadow()

```ts
attachShadow(init): ShadowRoot;
```

The **`Element.attachShadow()`** method attaches a shadow DOM tree to the specified element and returns a reference to its ShadowRoot.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/attachShadow)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `init` | `ShadowRootInit` |

#### Returns

`ShadowRoot`

#### Inherited from

```ts
HTMLElement.attachShadow
```

***

### checkVisibility()

```ts
checkVisibility(options?): boolean;
```

The **`checkVisibility()`** method of the Element interface checks whether the element is visible.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/checkVisibility)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `CheckVisibilityOptions` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.checkVisibility
```

***

### closest()

#### Call Signature

```ts
closest<K>(selector): HTMLElementTagNameMap[K];
```

The **`closest()`** method of the Element interface traverses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/closest)

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

##### Returns

`HTMLElementTagNameMap`\[`K`]

##### Inherited from

```ts
HTMLElement.closest
```

#### Call Signature

```ts
closest<K>(selector): SVGElementTagNameMap[K];
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

##### Returns

`SVGElementTagNameMap`\[`K`]

##### Inherited from

```ts
HTMLElement.closest
```

#### Call Signature

```ts
closest<K>(selector): MathMLElementTagNameMap[K];
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | `K` |

##### Returns

`MathMLElementTagNameMap`\[`K`]

##### Inherited from

```ts
HTMLElement.closest
```

#### Call Signature

```ts
closest<E>(selectors): E;
```

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element` | `Element` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

##### Returns

`E`

##### Inherited from

```ts
HTMLElement.closest
```

***

### computedStyleMap()

```ts
computedStyleMap(): StylePropertyMapReadOnly;
```

The **`computedStyleMap()`** method of the Element interface returns a StylePropertyMapReadOnly interface which provides a read-only representation of a CSS declaration block that is an alternative to CSSStyleDeclaration.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/computedStyleMap)

#### Returns

`StylePropertyMapReadOnly`

#### Inherited from

```ts
HTMLElement.computedStyleMap
```

***

### getAttribute()

```ts
getAttribute(qualifiedName): string;
```

The **`getAttribute()`** method of the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttribute)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

#### Returns

`string`

#### Inherited from

```ts
HTMLElement.getAttribute
```

***

### getAttributeNS()

```ts
getAttributeNS(namespace, localName): string;
```

The **`getAttributeNS()`** method of the Element interface returns the string value of the attribute with the specified namespace and name.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNS)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

#### Returns

`string`

#### Inherited from

```ts
HTMLElement.getAttributeNS
```

***

### getAttributeNames()

```ts
getAttributeNames(): string[];
```

The **`getAttributeNames()`** method of the array.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNames)

#### Returns

`string`\[]

#### Inherited from

```ts
HTMLElement.getAttributeNames
```

***

### getAttributeNode()

```ts
getAttributeNode(qualifiedName): Attr;
```

Returns the specified attribute of the specified element, as an Attr node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNode)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

#### Returns

`Attr`

#### Inherited from

```ts
HTMLElement.getAttributeNode
```

***

### getAttributeNodeNS()

```ts
getAttributeNodeNS(namespace, localName): Attr;
```

The **`getAttributeNodeNS()`** method of the Element interface returns the namespaced Attr node of an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getAttributeNodeNS)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

#### Returns

`Attr`

#### Inherited from

```ts
HTMLElement.getAttributeNodeNS
```

***

### getBoundingClientRect()

```ts
getBoundingClientRect(): DOMRect;
```

The **`Element.getBoundingClientRect()`** method returns a position relative to the viewport.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getBoundingClientRect)

#### Returns

`DOMRect`

#### Inherited from

```ts
HTMLElement.getBoundingClientRect
```

***

### getClientRects()

```ts
getClientRects(): DOMRectList;
```

The **`getClientRects()`** method of the Element interface returns a collection of DOMRect objects that indicate the bounding rectangles for each CSS border box in a client.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getClientRects)

#### Returns

`DOMRectList`

#### Inherited from

```ts
HTMLElement.getClientRects
```

***

### getElementsByClassName()

```ts
getElementsByClassName(classNames): HTMLCollectionOf<Element>;
```

The Element method **`getElementsByClassName()`** returns a live specified class name or names.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByClassName)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `classNames` | `string` |

#### Returns

`HTMLCollectionOf`\<`Element`>

#### Inherited from

```ts
HTMLElement.getElementsByClassName
```

***

### getElementsByTagName()

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
```

The **`Element.getElementsByTagName()`** method returns a live All descendants of the specified element are searched, but not the element itself.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByTagName)

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

##### Returns

`HTMLCollectionOf`\<`HTMLElementTagNameMap`\[`K`]>

##### Inherited from

```ts
HTMLElement.getElementsByTagName
```

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<SVGElementTagNameMap[K]>;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

##### Returns

`HTMLCollectionOf`\<`SVGElementTagNameMap`\[`K`]>

##### Inherited from

```ts
HTMLElement.getElementsByTagName
```

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

##### Returns

`HTMLCollectionOf`\<`MathMLElementTagNameMap`\[`K`]>

##### Inherited from

```ts
HTMLElement.getElementsByTagName
```

#### Call Signature

```ts
getElementsByTagName<K>(qualifiedName): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `K` |

##### Returns

`HTMLCollectionOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`]>

##### Deprecated

##### Inherited from

```ts
HTMLElement.getElementsByTagName
```

#### Call Signature

```ts
getElementsByTagName(qualifiedName): HTMLCollectionOf<Element>;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

##### Returns

`HTMLCollectionOf`\<`Element`>

##### Inherited from

```ts
HTMLElement.getElementsByTagName
```

***

### getElementsByTagNameNS()

#### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<HTMLElement>;
```

The **`Element.getElementsByTagNameNS()`** method returns a live HTMLCollection of elements with the given tag name belonging to the given namespace.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getElementsByTagNameNS)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/1999/xhtml"` |
| `localName` | `string` |

##### Returns

`HTMLCollectionOf`\<`HTMLElement`>

##### Inherited from

```ts
HTMLElement.getElementsByTagNameNS
```

#### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<SVGElement>;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/2000/svg"` |
| `localName` | `string` |

##### Returns

`HTMLCollectionOf`\<`SVGElement`>

##### Inherited from

```ts
HTMLElement.getElementsByTagNameNS
```

#### Call Signature

```ts
getElementsByTagNameNS(namespaceURI, localName): HTMLCollectionOf<MathMLElement>;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaceURI` | `"http://www.w3.org/1998/Math/MathML"` |
| `localName` | `string` |

##### Returns

`HTMLCollectionOf`\<`MathMLElement`>

##### Inherited from

```ts
HTMLElement.getElementsByTagNameNS
```

#### Call Signature

```ts
getElementsByTagNameNS(namespace, localName): HTMLCollectionOf<Element>;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

##### Returns

`HTMLCollectionOf`\<`Element`>

##### Inherited from

```ts
HTMLElement.getElementsByTagNameNS
```

***

### getHTML()

```ts
getHTML(options?): string;
```

The **`getHTML()`** method of the Element interface is used to serialize an element's DOM to an HTML string.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/getHTML)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `GetHTMLOptions` |

#### Returns

`string`

#### Inherited from

```ts
HTMLElement.getHTML
```

***

### hasAttribute()

```ts
hasAttribute(qualifiedName): boolean;
```

The **`Element.hasAttribute()`** method returns a **Boolean** value indicating whether the specified element has the specified attribute or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasAttribute)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.hasAttribute
```

***

### hasAttributeNS()

```ts
hasAttributeNS(namespace, localName): boolean;
```

The **`hasAttributeNS()`** method of the Element interface returns a boolean value indicating whether the current element has the specified attribute with the specified namespace.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasAttributeNS)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.hasAttributeNS
```

***

### hasAttributes()

```ts
hasAttributes(): boolean;
```

The **`hasAttributes()`** method of the Element interface returns a boolean value indicating whether the current element has any attributes or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasAttributes)

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.hasAttributes
```

***

### hasPointerCapture()

```ts
hasPointerCapture(pointerId): boolean;
```

The **`hasPointerCapture()`** method of the pointer capture for the pointer identified by the given pointer ID.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/hasPointerCapture)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.hasPointerCapture
```

***

### insertAdjacentElement()

```ts
insertAdjacentElement(where, element): Element;
```

The **`insertAdjacentElement()`** method of the relative to the element it is invoked upon.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentElement)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `where` | `InsertPosition` |
| `element` | `Element` |

#### Returns

`Element`

#### Inherited from

```ts
HTMLElement.insertAdjacentElement
```

***

### insertAdjacentHTML()

```ts
insertAdjacentHTML(position, string): void;
```

The **`insertAdjacentHTML()`** method of the the resulting nodes into the DOM tree at a specified position.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `position` | `InsertPosition` |
| `string` | `string` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.insertAdjacentHTML
```

***

### insertAdjacentText()

```ts
insertAdjacentText(where, data): void;
```

The **`insertAdjacentText()`** method of the Element interface, given a relative position and a string, inserts a new text node at the given position relative to the element it is called from.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentText)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `where` | `InsertPosition` |
| `data` | `string` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.insertAdjacentText
```

***

### matches()

```ts
matches(selectors): boolean;
```

The **`matches()`** method of the Element interface tests whether the element would be selected by the specified CSS selector.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/matches)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.matches
```

***

### releasePointerCapture()

```ts
releasePointerCapture(pointerId): void;
```

The **`releasePointerCapture()`** method of the previously set for a specific (PointerEvent) *pointer*.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/releasePointerCapture)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.releasePointerCapture
```

***

### removeAttribute()

```ts
removeAttribute(qualifiedName): void;
```

The Element method **`removeAttribute()`** removes the attribute with the specified name from the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttribute)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.removeAttribute
```

***

### removeAttributeNS()

```ts
removeAttributeNS(namespace, localName): void;
```

The **`removeAttributeNS()`** method of the If you are working with HTML and you don't need to specify the requested attribute as being part of a specific namespace, use the Element.removeAttribute() method instead.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttributeNS)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `localName` | `string` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.removeAttributeNS
```

***

### removeAttributeNode()

```ts
removeAttributeNode(attr): Attr;
```

The **`removeAttributeNode()`** method of the Element interface removes the specified Attr node from the element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/removeAttributeNode)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

#### Returns

`Attr`

#### Inherited from

```ts
HTMLElement.removeAttributeNode
```

***

### requestFullscreen()

```ts
requestFullscreen(options?): Promise<void>;
```

The **`Element.requestFullscreen()`** method issues an asynchronous request to make the element be displayed in fullscreen mode.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/requestFullscreen)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `FullscreenOptions` |

#### Returns

`Promise`\<`void`>

#### Inherited from

```ts
HTMLElement.requestFullscreen
```

***

### requestPointerLock()

```ts
requestPointerLock(options?): Promise<void>;
```

The **`requestPointerLock()`** method of the Element interface lets you asynchronously ask for the pointer to be locked on the given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/requestPointerLock)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `PointerLockOptions` |

#### Returns

`Promise`\<`void`>

#### Inherited from

```ts
HTMLElement.requestPointerLock
```

***

### scroll()

#### Call Signature

```ts
scroll(options?): void;
```

The **`scroll()`** method of the Element interface scrolls the element to a particular set of coordinates inside a given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scroll)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.scroll
```

#### Call Signature

```ts
scroll(x, y): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.scroll
```

***

### scrollBy()

#### Call Signature

```ts
scrollBy(options?): void;
```

The **`scrollBy()`** method of the Element interface scrolls an element by the given amount.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollBy)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.scrollBy
```

#### Call Signature

```ts
scrollBy(x, y): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.scrollBy
```

***

### scrollIntoView()

```ts
scrollIntoView(arg?): void;
```

The Element interface's **`scrollIntoView()`** method scrolls the element's ancestor containers such that the element on which `scrollIntoView()` is called is visible to the user.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `arg?` | `boolean` | `ScrollIntoViewOptions` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.scrollIntoView
```

***

### scrollTo()

#### Call Signature

```ts
scrollTo(options?): void;
```

The **`scrollTo()`** method of the Element interface scrolls to a particular set of coordinates inside a given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTo)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `ScrollToOptions` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.scrollTo
```

#### Call Signature

```ts
scrollTo(x, y): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.scrollTo
```

***

### setAttribute()

```ts
setAttribute(qualifiedName, value): void;
```

The **`setAttribute()`** method of the Element interface sets the value of an attribute on the specified element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttribute)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |
| `value` | `string` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.setAttribute
```

***

### setAttributeNS()

```ts
setAttributeNS(
   namespace, 
   qualifiedName, 
   value): void;
```

`setAttributeNS` adds a new attribute or changes the value of an attribute with the given namespace and name.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNS)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `qualifiedName` | `string` |
| `value` | `string` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.setAttributeNS
```

***

### setAttributeNode()

```ts
setAttributeNode(attr): Attr;
```

The **`setAttributeNode()`** method of the Element interface adds a new Attr node to the specified element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNode)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

#### Returns

`Attr`

#### Inherited from

```ts
HTMLElement.setAttributeNode
```

***

### setAttributeNodeNS()

```ts
setAttributeNodeNS(attr): Attr;
```

The **`setAttributeNodeNS()`** method of the Element interface adds a new namespaced Attr node to an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttributeNodeNS)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `Attr` |

#### Returns

`Attr`

#### Inherited from

```ts
HTMLElement.setAttributeNodeNS
```

***

### setHTMLUnsafe()

```ts
setHTMLUnsafe(html): void;
```

The **`setHTMLUnsafe()`** method of the Element interface is used to parse a string of HTML into a DocumentFragment, optionally filtering out unwanted elements and attributes, and those that don't belong in the context, and then using it to replace the element's subtree in the DOM.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setHTMLUnsafe)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `html` | `string` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.setHTMLUnsafe
```

***

### setPointerCapture()

```ts
setPointerCapture(pointerId): void;
```

The **`setPointerCapture()`** method of the *capture target* of future pointer events.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setPointerCapture)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pointerId` | `number` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.setPointerCapture
```

***

### toggleAttribute()

```ts
toggleAttribute(qualifiedName, force?): boolean;
```

The **`toggleAttribute()`** method of the present and adding it if it is not present) on the given element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/toggleAttribute)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `qualifiedName` | `string` |
| `force?` | `boolean` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.toggleAttribute
```

***

### ~~webkitMatchesSelector()~~

```ts
webkitMatchesSelector(selectors): boolean;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

#### Returns

`boolean`

#### Deprecated

This is a legacy alias of `matches`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/matches)

#### Inherited from

```ts
HTMLElement.webkitMatchesSelector
```

***

### dispatchEvent()

```ts
dispatchEvent(event): boolean;
```

The **`dispatchEvent()`** method of the EventTarget sends an Event to the object, (synchronously) invoking the affected event listeners in the appropriate order.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `Event` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.dispatchEvent
```

***

### attachInternals()

```ts
attachInternals(): ElementInternals;
```

The **`HTMLElement.attachInternals()`** method returns an ElementInternals object.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/attachInternals)

#### Returns

`ElementInternals`

#### Inherited from

```ts
HTMLElement.attachInternals
```

***

### click()

```ts
click(): void;
```

The **`HTMLElement.click()`** method simulates a mouse click on an element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/click)

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.click
```

***

### hidePopover()

```ts
hidePopover(): void;
```

The **`hidePopover()`** method of the HTMLElement interface hides a popover element (i.e., one that has a valid `popover` attribute) by removing it from the top layer and styling it with `display: none`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/hidePopover)

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.hidePopover
```

***

### showPopover()

```ts
showPopover(): void;
```

The **`showPopover()`** method of the HTMLElement interface shows a Popover\_API element (i.e., one that has a valid `popover` attribute) by adding it to the top layer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/showPopover)

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.showPopover
```

***

### togglePopover()

```ts
togglePopover(options?): boolean;
```

The **`togglePopover()`** method of the HTMLElement interface toggles a Popover\_API element (i.e., one that has a valid `popover` attribute) between the hidden and showing states.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/togglePopover)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `boolean` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.togglePopover
```

***

### addEventListener()

#### Call Signature

```ts
addEventListener<K>(
   type, 
   listener, 
   options?): void;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementEventMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `K` |
| `listener` | (`this`, `ev`) => `any` |
| `options?` | `boolean` | `AddEventListenerOptions` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.addEventListener
```

#### Call Signature

```ts
addEventListener(
   type, 
   listener, 
   options?): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` | `AddEventListenerOptions` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.addEventListener
```

***

### removeEventListener()

#### Call Signature

```ts
removeEventListener<K>(
   type, 
   listener, 
   options?): void;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementEventMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `K` |
| `listener` | (`this`, `ev`) => `any` |
| `options?` | `boolean` | `EventListenerOptions` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.removeEventListener
```

#### Call Signature

```ts
removeEventListener(
   type, 
   listener, 
   options?): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` | `EventListenerOptions` |

##### Returns

`void`

##### Inherited from

```ts
HTMLElement.removeEventListener
```

***

### blur()

```ts
blur(): void;
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur)

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.blur
```

***

### focus()

```ts
focus(options?): void;
```

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/focus)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `FocusOptions` |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.focus
```

***

### appendChild()

```ts
appendChild<T>(node): T;
```

The **`appendChild()`** method of the Node interface adds a node to the end of the list of children of a specified parent node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/appendChild)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `T` |

#### Returns

`T`

#### Inherited from

```ts
HTMLElement.appendChild
```

***

### cloneNode()

```ts
cloneNode(subtree?): Node;
```

The **`cloneNode()`** method of the Node interface returns a duplicate of the node on which this method was called.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/cloneNode)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `subtree?` | `boolean` |

#### Returns

`Node`

#### Inherited from

```ts
HTMLElement.cloneNode
```

***

### compareDocumentPosition()

```ts
compareDocumentPosition(other): number;
```

The **`compareDocumentPosition()`** method of the Node interface reports the position of its argument node relative to the node on which it is called.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/compareDocumentPosition)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Node` |

#### Returns

`number`

#### Inherited from

```ts
HTMLElement.compareDocumentPosition
```

***

### contains()

```ts
contains(other): boolean;
```

The **`contains()`** method of the Node interface returns a boolean value indicating whether a node is a descendant of a given node, that is the node itself, one of its direct children (Node.childNodes), one of the children's direct children, and so on.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/contains)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Node` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.contains
```

***

### getRootNode()

```ts
getRootNode(options?): Node;
```

The **`getRootNode()`** method of the Node interface returns the context object's root, which optionally includes the shadow root if it is available.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/getRootNode)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `GetRootNodeOptions` |

#### Returns

`Node`

#### Inherited from

```ts
HTMLElement.getRootNode
```

***

### hasChildNodes()

```ts
hasChildNodes(): boolean;
```

The **`hasChildNodes()`** method of the Node interface returns a boolean value indicating whether the given Node has child nodes or not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/hasChildNodes)

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.hasChildNodes
```

***

### insertBefore()

```ts
insertBefore<T>(node, child): T;
```

The **`insertBefore()`** method of the Node interface inserts a node before a *reference node* as a child of a specified *parent node*.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/insertBefore)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `T` |
| `child` | `Node` |

#### Returns

`T`

#### Inherited from

```ts
HTMLElement.insertBefore
```

***

### isDefaultNamespace()

```ts
isDefaultNamespace(namespace): boolean;
```

The **`isDefaultNamespace()`** method of the Node interface accepts a namespace URI as an argument.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isDefaultNamespace)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.isDefaultNamespace
```

***

### isEqualNode()

```ts
isEqualNode(otherNode): boolean;
```

The **`isEqualNode()`** method of the Node interface tests whether two nodes are equal.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isEqualNode)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `otherNode` | `Node` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.isEqualNode
```

***

### isSameNode()

```ts
isSameNode(otherNode): boolean;
```

The **`isSameNode()`** method of the Node interface is a legacy alias the for the `===` strict equality operator.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isSameNode)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `otherNode` | `Node` |

#### Returns

`boolean`

#### Inherited from

```ts
HTMLElement.isSameNode
```

***

### lookupNamespaceURI()

```ts
lookupNamespaceURI(prefix): string;
```

The **`lookupNamespaceURI()`** method of the Node interface takes a prefix as parameter and returns the namespace URI associated with it on the given node if found (and `null` if not).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/lookupNamespaceURI)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prefix` | `string` |

#### Returns

`string`

#### Inherited from

```ts
HTMLElement.lookupNamespaceURI
```

***

### lookupPrefix()

```ts
lookupPrefix(namespace): string;
```

The **`lookupPrefix()`** method of the Node interface returns a string containing the prefix for a given namespace URI, if present, and `null` if not.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/lookupPrefix)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

#### Returns

`string`

#### Inherited from

```ts
HTMLElement.lookupPrefix
```

***

### normalize()

```ts
normalize(): void;
```

The **`normalize()`** method of the Node interface puts the specified node and all of its sub-tree into a *normalized* form.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/normalize)

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.normalize
```

***

### removeChild()

```ts
removeChild<T>(child): T;
```

The **`removeChild()`** method of the Node interface removes a child node from the DOM and returns the removed node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/removeChild)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `child` | `T` |

#### Returns

`T`

#### Inherited from

```ts
HTMLElement.removeChild
```

***

### replaceChild()

```ts
replaceChild<T>(node, child): T;
```

The **`replaceChild()`** method of the Node interface replaces a child node within the given (parent) node.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/replaceChild)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Node` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `Node` |
| `child` | `T` |

#### Returns

`T`

#### Inherited from

```ts
HTMLElement.replaceChild
```

***

### append()

```ts
append(...nodes): void;
```

Inserts nodes after the last child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/append)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` | `Node`)\[] |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.append
```

***

### prepend()

```ts
prepend(...nodes): void;
```

Inserts nodes before the first child of node, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/prepend)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` | `Node`)\[] |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.prepend
```

***

### querySelector()

#### Call Signature

```ts
querySelector<K>(selectors): HTMLElementTagNameMap[K];
```

Returns the first element that is a descendant of node that matches selectors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelector)

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`HTMLElementTagNameMap`\[`K`]

##### Inherited from

```ts
HTMLElement.querySelector
```

#### Call Signature

```ts
querySelector<K>(selectors): SVGElementTagNameMap[K];
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`SVGElementTagNameMap`\[`K`]

##### Inherited from

```ts
HTMLElement.querySelector
```

#### Call Signature

```ts
querySelector<K>(selectors): MathMLElementTagNameMap[K];
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`MathMLElementTagNameMap`\[`K`]

##### Inherited from

```ts
HTMLElement.querySelector
```

#### Call Signature

```ts
querySelector<K>(selectors): HTMLElementDeprecatedTagNameMap[K];
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`HTMLElementDeprecatedTagNameMap`\[`K`]

##### Deprecated

##### Inherited from

```ts
HTMLElement.querySelector
```

#### Call Signature

```ts
querySelector<E>(selectors): E;
```

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element` | `Element` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

##### Returns

`E`

##### Inherited from

```ts
HTMLElement.querySelector
```

***

### querySelectorAll()

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementTagNameMap[K]>;
```

Returns all element descendants of node that match selectors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll)

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`NodeListOf`\<`HTMLElementTagNameMap`\[`K`]>

##### Inherited from

```ts
HTMLElement.querySelectorAll
```

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<SVGElementTagNameMap[K]>;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `SVGElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`NodeListOf`\<`SVGElementTagNameMap`\[`K`]>

##### Inherited from

```ts
HTMLElement.querySelectorAll
```

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<MathMLElementTagNameMap[K]>;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `MathMLElementTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`NodeListOf`\<`MathMLElementTagNameMap`\[`K`]>

##### Inherited from

```ts
HTMLElement.querySelectorAll
```

#### Call Signature

```ts
querySelectorAll<K>(selectors): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
```

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof `HTMLElementDeprecatedTagNameMap` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `K` |

##### Returns

`NodeListOf`\<`HTMLElementDeprecatedTagNameMap`\[`K`]>

##### Deprecated

##### Inherited from

```ts
HTMLElement.querySelectorAll
```

#### Call Signature

```ts
querySelectorAll<E>(selectors): NodeListOf<E>;
```

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `E` *extends* `Element` | `Element` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `selectors` | `string` |

##### Returns

`NodeListOf`\<`E`>

##### Inherited from

```ts
HTMLElement.querySelectorAll
```

***

### replaceChildren()

```ts
replaceChildren(...nodes): void;
```

Replace all children of node with nodes, while replacing strings in nodes with equivalent Text nodes.

Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/replaceChildren)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`nodes` | (`string` | `Node`)\[] |

#### Returns

`void`

#### Inherited from

```ts
HTMLElement.replaceChildren
```

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
|  `ariaActiveDescendantElement` | `public` | `Element` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaActiveDescendantElement) | `HTMLElement.ariaActiveDescendantElement` |
|  `ariaAtomic` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAtomic) | `HTMLElement.ariaAtomic` |
|  `ariaAutoComplete` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAutoComplete) | `HTMLElement.ariaAutoComplete` |
|  `ariaBrailleLabel` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleLabel) | `HTMLElement.ariaBrailleLabel` |
|  `ariaBrailleRoleDescription` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleRoleDescription) | `HTMLElement.ariaBrailleRoleDescription` |
|  `ariaBusy` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBusy) | `HTMLElement.ariaBusy` |
|  `ariaChecked` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaChecked) | `HTMLElement.ariaChecked` |
|  `ariaColCount` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColCount) | `HTMLElement.ariaColCount` |
|  `ariaColIndex` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndex) | `HTMLElement.ariaColIndex` |
|  `ariaColIndexText` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndexText) | `HTMLElement.ariaColIndexText` |
|  `ariaColSpan` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColSpan) | `HTMLElement.ariaColSpan` |
|  `ariaControlsElements` | `public` | readonly `Element`\[] | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaControlsElements) | `HTMLElement.ariaControlsElements` |
|  `ariaCurrent` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaCurrent) | `HTMLElement.ariaCurrent` |
|  `ariaDescribedByElements` | `public` | readonly `Element`\[] | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescribedByElements) | `HTMLElement.ariaDescribedByElements` |
|  `ariaDescription` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescription) | `HTMLElement.ariaDescription` |
|  `ariaDetailsElements` | `public` | readonly `Element`\[] | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDetailsElements) | `HTMLElement.ariaDetailsElements` |
|  `ariaDisabled` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDisabled) | `HTMLElement.ariaDisabled` |
|  `ariaErrorMessageElements` | `public` | readonly `Element`\[] | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaErrorMessageElements) | `HTMLElement.ariaErrorMessageElements` |
|  `ariaExpanded` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaExpanded) | `HTMLElement.ariaExpanded` |
|  `ariaFlowToElements` | `public` | readonly `Element`\[] | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaFlowToElements) | `HTMLElement.ariaFlowToElements` |
|  `ariaHasPopup` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHasPopup) | `HTMLElement.ariaHasPopup` |
|  `ariaHidden` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHidden) | `HTMLElement.ariaHidden` |
|  `ariaInvalid` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaInvalid) | `HTMLElement.ariaInvalid` |
|  `ariaKeyShortcuts` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaKeyShortcuts) | `HTMLElement.ariaKeyShortcuts` |
|  `ariaLabel` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabel) | `HTMLElement.ariaLabel` |
|  `ariaLabelledByElements` | `public` | readonly `Element`\[] | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabelledByElements) | `HTMLElement.ariaLabelledByElements` |
|  `ariaLevel` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLevel) | `HTMLElement.ariaLevel` |
|  `ariaLive` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLive) | `HTMLElement.ariaLive` |
|  `ariaModal` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaModal) | `HTMLElement.ariaModal` |
|  `ariaMultiLine` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiLine) | `HTMLElement.ariaMultiLine` |
|  `ariaMultiSelectable` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiSelectable) | `HTMLElement.ariaMultiSelectable` |
|  `ariaOrientation` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOrientation) | `HTMLElement.ariaOrientation` |
|  `ariaOwnsElements` | `public` | readonly `Element`\[] | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOwnsElements) | `HTMLElement.ariaOwnsElements` |
|  `ariaPlaceholder` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPlaceholder) | `HTMLElement.ariaPlaceholder` |
|  `ariaPosInSet` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPosInSet) | `HTMLElement.ariaPosInSet` |
|  `ariaPressed` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPressed) | `HTMLElement.ariaPressed` |
|  `ariaReadOnly` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaReadOnly) | `HTMLElement.ariaReadOnly` |
|  `ariaRelevant` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRelevant) | `HTMLElement.ariaRelevant` |
|  `ariaRequired` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRequired) | `HTMLElement.ariaRequired` |
|  `ariaRoleDescription` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRoleDescription) | `HTMLElement.ariaRoleDescription` |
|  `ariaRowCount` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowCount) | `HTMLElement.ariaRowCount` |
|  `ariaRowIndex` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndex) | `HTMLElement.ariaRowIndex` |
|  `ariaRowIndexText` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndexText) | `HTMLElement.ariaRowIndexText` |
|  `ariaRowSpan` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowSpan) | `HTMLElement.ariaRowSpan` |
|  `ariaSelected` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSelected) | `HTMLElement.ariaSelected` |
|  `ariaSetSize` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSetSize) | `HTMLElement.ariaSetSize` |
|  `ariaSort` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSort) | `HTMLElement.ariaSort` |
|  `ariaValueMax` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMax) | `HTMLElement.ariaValueMax` |
|  `ariaValueMin` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMin) | `HTMLElement.ariaValueMin` |
|  `ariaValueNow` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueNow) | `HTMLElement.ariaValueNow` |
|  `ariaValueText` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueText) | `HTMLElement.ariaValueText` |
|  `role` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/role) | `HTMLElement.role` |
|  `attributes` | `readonly` | `NamedNodeMap` | The **`Element.attributes`** property returns a live collection of all attribute nodes registered to the specified node. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/attributes) | `HTMLElement.attributes` |
|  `className` | `public` | `string` | The **`className`** property of the of the specified element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/className) | `HTMLElement.className` |
|  `clientHeight` | `readonly` | `number` | The **`clientHeight`** read-only property of the Element interface is zero for elements with no CSS or inline layout boxes; otherwise, it's the inner height of an element in pixels. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientHeight) | `HTMLElement.clientHeight` |
|  `clientLeft` | `readonly` | `number` | The **`clientLeft`** read-only property of the Element interface returns the width of the left border of an element in pixels. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientLeft) | `HTMLElement.clientLeft` |
|  `clientTop` | `readonly` | `number` | The **`clientTop`** read-only property of the Element interface returns the width of the top border of an element in pixels. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientTop) | `HTMLElement.clientTop` |
|  `clientWidth` | `readonly` | `number` | The **`clientWidth`** read-only property of the Element interface is zero for inline elements and elements with no CSS; otherwise, it's the inner width of an element in pixels. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/clientWidth) | `HTMLElement.clientWidth` |
|  `currentCSSZoom` | `readonly` | `number` | The **`currentCSSZoom`** read-only property of the Element interface provides the 'effective' CSS `zoom` of an element, taking into account the zoom applied to the element and all its parent elements. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/currentCSSZoom) | `HTMLElement.currentCSSZoom` |
|  `id` | `public` | `string` | The **`id`** property of the Element interface represents the element's identifier, reflecting the **`id`** global attribute. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/id) | `HTMLElement.id` |
|  `innerHTML` | `public` | `string` | The **`innerHTML`** property of the Element interface gets or sets the HTML or XML markup contained within the element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/innerHTML) | `HTMLElement.innerHTML` |
|  `localName` | `readonly` | `string` | The **`Element.localName`** read-only property returns the local part of the qualified name of an element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/localName) | `HTMLElement.localName` |
|  `namespaceURI` | `readonly` | `string` | The **`Element.namespaceURI`** read-only property returns the namespace URI of the element, or `null` if the element is not in a namespace. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/namespaceURI) | `HTMLElement.namespaceURI` |
|  `onfullscreenchange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenchange_event) | `HTMLElement.onfullscreenchange` |
|  `onfullscreenerror` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenerror_event) | `HTMLElement.onfullscreenerror` |
|  `outerHTML` | `public` | `string` | The **`outerHTML`** attribute of the Element DOM interface gets the serialized HTML fragment describing the element including its descendants. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/outerHTML) | `HTMLElement.outerHTML` |
|  `ownerDocument` | `readonly` | `Document` | The read-only **`ownerDocument`** property of the Node interface returns the top-level document object of the node. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/ownerDocument) | `HTMLElement.ownerDocument` |
|  `prefix` | `readonly` | `string` | The **`Element.prefix`** read-only property returns the namespace prefix of the specified element, or `null` if no prefix is specified. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/prefix) | `HTMLElement.prefix` |
|  `scrollHeight` | `readonly` | `number` | The **`scrollHeight`** read-only property of the Element interface is a measurement of the height of an element's content, including content not visible on the screen due to overflow. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollHeight) | `HTMLElement.scrollHeight` |
|  `scrollLeft` | `public` | `number` | The **`scrollLeft`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its left edge. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollLeft) | `HTMLElement.scrollLeft` |
|  `scrollTop` | `public` | `number` | The **`scrollTop`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its top edge. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTop) | `HTMLElement.scrollTop` |
|  `scrollWidth` | `readonly` | `number` | The **`scrollWidth`** read-only property of the Element interface is a measurement of the width of an element's content, including content not visible on the screen due to overflow. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollWidth) | `HTMLElement.scrollWidth` |
|  `shadowRoot` | `readonly` | `ShadowRoot` | The `Element.shadowRoot` read-only property represents the shadow root hosted by the element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/shadowRoot) | `HTMLElement.shadowRoot` |
|  `slot` | `public` | `string` | The **`slot`** property of the Element interface returns the name of the shadow DOM slot the element is inserted in. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/slot) | `HTMLElement.slot` |
|  `tagName` | `readonly` | `string` | The **`tagName`** read-only property of the Element interface returns the tag name of the element on which it's called. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/tagName) | `HTMLElement.tagName` |
|  `attributeStyleMap` | `readonly` | `StylePropertyMap` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/attributeStyleMap) | `HTMLElement.attributeStyleMap` |
|  `contentEditable` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/contentEditable) | `HTMLElement.contentEditable` |
|  `enterKeyHint` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/enterKeyHint) | `HTMLElement.enterKeyHint` |
|  `inputMode` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inputMode) | `HTMLElement.inputMode` |
|  `isContentEditable` | `readonly` | `boolean` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/isContentEditable) | `HTMLElement.isContentEditable` |
|  `onabort` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/abort_event) | `HTMLElement.onabort` |
|  `onanimationcancel` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationcancel_event) | `HTMLElement.onanimationcancel` |
|  `onanimationend` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event) | `HTMLElement.onanimationend` |
|  `onanimationiteration` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event) | `HTMLElement.onanimationiteration` |
|  `onanimationstart` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event) | `HTMLElement.onanimationstart` |
|  `onauxclick` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/auxclick_event) | `HTMLElement.onauxclick` |
|  `onbeforeinput` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforeinput_event) | `HTMLElement.onbeforeinput` |
|  `onbeforematch` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforematch_event) | `HTMLElement.onbeforematch` |
|  `onbeforetoggle` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/beforetoggle_event) | `HTMLElement.onbeforetoggle` |
|  `onblur` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/blur_event) | `HTMLElement.onblur` |
|  `oncancel` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/cancel_event) | `HTMLElement.oncancel` |
|  `oncanplay` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplay_event) | `HTMLElement.oncanplay` |
|  `oncanplaythrough` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplaythrough_event) | `HTMLElement.oncanplaythrough` |
|  `onchange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event) | `HTMLElement.onchange` |
|  `onclick` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/click_event) | `HTMLElement.onclick` |
|  `onclose` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/close_event) | `HTMLElement.onclose` |
|  `oncontextlost` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextlost_event) | `HTMLElement.oncontextlost` |
|  `oncontextmenu` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/contextmenu_event) | `HTMLElement.oncontextmenu` |
|  `oncontextrestored` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextrestored_event) | `HTMLElement.oncontextrestored` |
|  `oncopy` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/copy_event) | `HTMLElement.oncopy` |
|  `oncuechange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/cuechange_event) | `HTMLElement.oncuechange` |
|  `oncut` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/cut_event) | `HTMLElement.oncut` |
|  `ondblclick` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/dblclick_event) | `HTMLElement.ondblclick` |
|  `ondrag` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drag_event) | `HTMLElement.ondrag` |
|  `ondragend` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragend_event) | `HTMLElement.ondragend` |
|  `ondragenter` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragenter_event) | `HTMLElement.ondragenter` |
|  `ondragleave` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragleave_event) | `HTMLElement.ondragleave` |
|  `ondragover` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragover_event) | `HTMLElement.ondragover` |
|  `ondragstart` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragstart_event) | `HTMLElement.ondragstart` |
|  `ondrop` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drop_event) | `HTMLElement.ondrop` |
|  `ondurationchange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/durationchange_event) | `HTMLElement.ondurationchange` |
|  `onemptied` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/emptied_event) | `HTMLElement.onemptied` |
|  `onended` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ended_event) | `HTMLElement.onended` |
|  `onerror` | `public` | `OnErrorEventHandlerNonNull` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/error_event) | `HTMLElement.onerror` |
|  `onfocus` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/focus_event) | `HTMLElement.onfocus` |
|  `onformdata` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/formdata_event) | `HTMLElement.onformdata` |
|  `ongotpointercapture` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/gotpointercapture_event) | `HTMLElement.ongotpointercapture` |
|  `oninput` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/input_event) | `HTMLElement.oninput` |
|  `oninvalid` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/invalid_event) | `HTMLElement.oninvalid` |
|  `onkeydown` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keydown_event) | `HTMLElement.onkeydown` |
|  ~~`onkeypress`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keypress_event) | `HTMLElement.onkeypress` |
|  `onkeyup` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keyup_event) | `HTMLElement.onkeyup` |
|  `onload` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/load_event) | `HTMLElement.onload` |
|  `onloadeddata` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadeddata_event) | `HTMLElement.onloadeddata` |
|  `onloadedmetadata` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadedmetadata_event) | `HTMLElement.onloadedmetadata` |
|  `onloadstart` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadstart_event) | `HTMLElement.onloadstart` |
|  `onlostpointercapture` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/lostpointercapture_event) | `HTMLElement.onlostpointercapture` |
|  `onmousedown` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousedown_event) | `HTMLElement.onmousedown` |
|  `onmouseenter` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseenter_event) | `HTMLElement.onmouseenter` |
|  `onmouseleave` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseleave_event) | `HTMLElement.onmouseleave` |
|  `onmousemove` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousemove_event) | `HTMLElement.onmousemove` |
|  `onmouseout` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseout_event) | `HTMLElement.onmouseout` |
|  `onmouseover` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseover_event) | `HTMLElement.onmouseover` |
|  `onmouseup` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseup_event) | `HTMLElement.onmouseup` |
|  `onpaste` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/paste_event) | `HTMLElement.onpaste` |
|  `onpause` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/pause_event) | `HTMLElement.onpause` |
|  `onplay` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play_event) | `HTMLElement.onplay` |
|  `onplaying` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playing_event) | `HTMLElement.onplaying` |
|  `onpointercancel` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointercancel_event) | `HTMLElement.onpointercancel` |
|  `onpointerdown` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerdown_event) | `HTMLElement.onpointerdown` |
|  `onpointerenter` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerenter_event) | `HTMLElement.onpointerenter` |
|  `onpointerleave` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerleave_event) | `HTMLElement.onpointerleave` |
|  `onpointermove` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointermove_event) | `HTMLElement.onpointermove` |
|  `onpointerout` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerout_event) | `HTMLElement.onpointerout` |
|  `onpointerover` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerover_event) | `HTMLElement.onpointerover` |
|  `onpointerrawupdate` | `public` | (`this`, `ev`) => `any` | Available only in secure contexts. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerrawupdate_event) | `HTMLElement.onpointerrawupdate` |
|  `onpointerup` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerup_event) | `HTMLElement.onpointerup` |
|  `onprogress` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/progress_event) | `HTMLElement.onprogress` |
|  `onratechange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ratechange_event) | `HTMLElement.onratechange` |
|  `onreset` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/reset_event) | `HTMLElement.onreset` |
|  `onresize` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/resize_event) | `HTMLElement.onresize` |
|  `onscroll` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scroll_event) | `HTMLElement.onscroll` |
|  `onscrollend` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scrollend_event) | `HTMLElement.onscrollend` |
|  `onsecuritypolicyviolation` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/securitypolicyviolation_event) | `HTMLElement.onsecuritypolicyviolation` |
|  `onseeked` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeked_event) | `HTMLElement.onseeked` |
|  `onseeking` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeking_event) | `HTMLElement.onseeking` |
|  `onselect` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/select_event) | `HTMLElement.onselect` |
|  `onselectionchange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/selectionchange_event) | `HTMLElement.onselectionchange` |
|  `onselectstart` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/selectstart_event) | `HTMLElement.onselectstart` |
|  `onslotchange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement/slotchange_event) | `HTMLElement.onslotchange` |
|  `onstalled` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/stalled_event) | `HTMLElement.onstalled` |
|  `onsubmit` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/submit_event) | `HTMLElement.onsubmit` |
|  `onsuspend` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/suspend_event) | `HTMLElement.onsuspend` |
|  `ontimeupdate` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/timeupdate_event) | `HTMLElement.ontimeupdate` |
|  `ontoggle` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/toggle_event) | `HTMLElement.ontoggle` |
|  `ontouchcancel?` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchcancel_event) | `HTMLElement.ontouchcancel` |
|  `ontouchend?` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchend_event) | `HTMLElement.ontouchend` |
|  `ontouchmove?` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchmove_event) | `HTMLElement.ontouchmove` |
|  `ontouchstart?` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchstart_event) | `HTMLElement.ontouchstart` |
|  `ontransitioncancel` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitioncancel_event) | `HTMLElement.ontransitioncancel` |
|  `ontransitionend` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event) | `HTMLElement.ontransitionend` |
|  `ontransitionrun` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionrun_event) | `HTMLElement.ontransitionrun` |
|  `ontransitionstart` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionstart_event) | `HTMLElement.ontransitionstart` |
|  `onvolumechange` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/volumechange_event) | `HTMLElement.onvolumechange` |
|  `onwaiting` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/waiting_event) | `HTMLElement.onwaiting` |
|  ~~`onwebkitanimationend`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationend`. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event) | `HTMLElement.onwebkitanimationend` |
|  ~~`onwebkitanimationiteration`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationiteration`. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event) | `HTMLElement.onwebkitanimationiteration` |
|  ~~`onwebkitanimationstart`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `onanimationstart`. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event) | `HTMLElement.onwebkitanimationstart` |
|  ~~`onwebkittransitionend`~~ | `public` | (`this`, `ev`) => `any` | **Deprecated** This is a legacy alias of `ontransitionend`. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event) | `HTMLElement.onwebkittransitionend` |
|  `onwheel` | `public` | (`this`, `ev`) => `any` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/wheel_event) | `HTMLElement.onwheel` |
|  `accessKey` | `public` | `string` | The **`HTMLElement.accessKey`** property sets the keystroke which a user can press to jump to a given element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/accessKey) | `HTMLElement.accessKey` |
|  `accessKeyLabel` | `readonly` | `string` | The **`HTMLElement.accessKeyLabel`** read-only property returns a string containing the element's browser-assigned access key (if any); otherwise it returns an empty string. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/accessKeyLabel) | `HTMLElement.accessKeyLabel` |
|  `autocapitalize` | `public` | `string` | The **`autocapitalize`** property of the HTMLElement interface represents the element's capitalization behavior for user input. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocapitalize) | `HTMLElement.autocapitalize` |
|  `autocorrect` | `public` | `boolean` | The **`autocorrect`** property of the HTMLElement interface controls whether or not autocorrection of editable text is enabled for spelling and/or punctuation errors. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocorrect) | `HTMLElement.autocorrect` |
|  `dir` | `public` | `string` | The **`HTMLElement.dir`** property indicates the text writing directionality of the content of the current element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dir) | `HTMLElement.dir` |
|  `draggable` | `public` | `boolean` | The **`draggable`** property of the HTMLElement interface gets and sets a Boolean primitive indicating if the element is draggable. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/draggable) | `HTMLElement.draggable` |
|  `hidden` | `public` | `boolean` | The HTMLElement property **`hidden`** reflects the value of the element's `hidden` attribute. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/hidden) | `HTMLElement.hidden` |
|  `inert` | `public` | `boolean` | The HTMLElement property **`inert`** reflects the value of the element's `inert` attribute. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inert) | `HTMLElement.inert` |
|  `innerText` | `public` | `string` | The **`innerText`** property of the HTMLElement interface represents the rendered text content of a node and its descendants. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/innerText) | `HTMLElement.innerText` |
|  `lang` | `public` | `string` | The **`lang`** property of the HTMLElement interface indicates the base language of an element's attribute values and text content, in the form of a MISSING: RFC(5646, 'BCP 47 language identifier tag')]. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/lang) | `HTMLElement.lang` |
|  `offsetHeight` | `readonly` | `number` | The **`offsetHeight`** read-only property of the HTMLElement interface returns the height of an element, including vertical padding and borders, as an integer. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetHeight) | `HTMLElement.offsetHeight` |
|  `offsetLeft` | `readonly` | `number` | The **`offsetLeft`** read-only property of the HTMLElement interface returns the number of pixels that the *upper left corner* of the current element is offset to the left within the HTMLElement.offsetParent node. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetLeft) | `HTMLElement.offsetLeft` |
|  `offsetParent` | `readonly` | `Element` | The **`HTMLElement.offsetParent`** read-only property returns a reference to the element which is the closest (nearest in the containment hierarchy) positioned ancestor element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetParent) | `HTMLElement.offsetParent` |
|  `offsetTop` | `readonly` | `number` | The **`offsetTop`** read-only property of the HTMLElement interface returns the distance from the outer border of the current element (including its margin) to the top padding edge of the HTMLelement.offsetParent, the *closest positioned* ancestor element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetTop) | `HTMLElement.offsetTop` |
|  `offsetWidth` | `readonly` | `number` | The **`offsetWidth`** read-only property of the HTMLElement interface returns the layout width of an element as an integer. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetWidth) | `HTMLElement.offsetWidth` |
|  `outerText` | `public` | `string` | The **`outerText`** property of the HTMLElement interface returns the same value as HTMLElement.innerText. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/outerText) | `HTMLElement.outerText` |
|  `popover` | `public` | `string` | The **`popover`** property of the HTMLElement interface gets and sets an element's popover state via JavaScript (`'auto'`, `'hint'`, or `'manual'`), and can be used for feature detection. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/popover) | `HTMLElement.popover` |
|  `spellcheck` | `public` | `boolean` | The **`spellcheck`** property of the HTMLElement interface represents a boolean value that controls the spell-checking hint. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/spellcheck) | `HTMLElement.spellcheck` |
|  `title` | `public` | `string` | The **`HTMLElement.title`** property represents the title of the element: the text usually displayed in a 'tooltip' popup when the mouse is over the node. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/title) | `HTMLElement.title` |
|  `translate` | `public` | `boolean` | The **`translate`** property of the HTMLElement interface indicates whether an element's attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/translate) | `HTMLElement.translate` |
|  `writingSuggestions` | `public` | `string` | The **`writingSuggestions`** property of the HTMLElement interface is a string indicating if browser-provided writing suggestions should be enabled under the scope of the element or not. [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/writingSuggestions) | `HTMLElement.writingSuggestions` |
|  `autofocus` | `public` | `boolean` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autofocus) | `HTMLElement.autofocus` |
|  `dataset` | `readonly` | `DOMStringMap` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dataset) | `HTMLElement.dataset` |
|  `nonce?` | `public` | `string` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/nonce) | `HTMLElement.nonce` |
|  `tabIndex` | `public` | `number` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/tabIndex) | `HTMLElement.tabIndex` |
|  `baseURI` | `readonly` | `string` | The read-only **`baseURI`** property of the Node interface returns the absolute base URL of the document containing the node. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/baseURI) | `HTMLElement.baseURI` |
|  `childNodes` | `readonly` | `NodeListOf`\<`ChildNode`> | The read-only **`childNodes`** property of the Node interface returns a live the first child node is assigned index `0`. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/childNodes) | `HTMLElement.childNodes` |
|  `firstChild` | `readonly` | `ChildNode` | The read-only **`firstChild`** property of the Node interface returns the node's first child in the tree, or `null` if the node has no children. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/firstChild) | `HTMLElement.firstChild` |
|  `isConnected` | `readonly` | `boolean` | The read-only **`isConnected`** property of the Node interface returns a boolean indicating whether the node is connected (directly or indirectly) to a Document object. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/isConnected) | `HTMLElement.isConnected` |
|  `lastChild` | `readonly` | `ChildNode` | The read-only **`lastChild`** property of the Node interface returns the last child of the node, or `null` if there are no child nodes. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/lastChild) | `HTMLElement.lastChild` |
|  `nextSibling` | `readonly` | `ChildNode` | The read-only **`nextSibling`** property of the Node interface returns the node immediately following the specified one in their parent's Node.childNodes, or returns `null` if the specified node is the last child in the parent element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nextSibling) | `HTMLElement.nextSibling` |
|  `nodeName` | `readonly` | `string` | The read-only **`nodeName`** property of Node returns the name of the current node as a string. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeName) | `HTMLElement.nodeName` |
|  `nodeType` | `readonly` | `number` | The read-only **`nodeType`** property of a Node interface is an integer that identifies what the node is. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeType) | `HTMLElement.nodeType` |
|  `nodeValue` | `public` | `string` | The **`nodeValue`** property of the Node interface returns or sets the value of the current node. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/nodeValue) | `HTMLElement.nodeValue` |
|  `parentElement` | `readonly` | `HTMLElement` | The read-only **`parentElement`** property of Node interface returns the DOM node's parent Element, or `null` if the node either has no parent, or its parent isn't a DOM Element. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentElement) | `HTMLElement.parentElement` |
|  `parentNode` | `readonly` | `ParentNode` | The read-only **`parentNode`** property of the Node interface returns the parent of the specified node in the DOM tree. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentNode) | `HTMLElement.parentNode` |
|  `previousSibling` | `readonly` | `ChildNode` | The read-only **`previousSibling`** property of the Node interface returns the node immediately preceding the specified one in its parent's or `null` if the specified node is the first in that list. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/previousSibling) | `HTMLElement.previousSibling` |
|  `ELEMENT_NODE` | `readonly` | `1` | node is an element. | `HTMLElement.ELEMENT_NODE` |
|  `ATTRIBUTE_NODE` | `readonly` | `2` | - | `HTMLElement.ATTRIBUTE_NODE` |
|  `TEXT_NODE` | `readonly` | `3` | node is a Text node. | `HTMLElement.TEXT_NODE` |
|  `CDATA_SECTION_NODE` | `readonly` | `4` | node is a CDATASection node. | `HTMLElement.CDATA_SECTION_NODE` |
|  `ENTITY_REFERENCE_NODE` | `readonly` | `5` | - | `HTMLElement.ENTITY_REFERENCE_NODE` |
|  `ENTITY_NODE` | `readonly` | `6` | - | `HTMLElement.ENTITY_NODE` |
|  `PROCESSING_INSTRUCTION_NODE` | `readonly` | `7` | node is a ProcessingInstruction node. | `HTMLElement.PROCESSING_INSTRUCTION_NODE` |
|  `COMMENT_NODE` | `readonly` | `8` | node is a Comment node. | `HTMLElement.COMMENT_NODE` |
|  `DOCUMENT_NODE` | `readonly` | `9` | node is a document. | `HTMLElement.DOCUMENT_NODE` |
|  `DOCUMENT_TYPE_NODE` | `readonly` | `10` | node is a doctype. | `HTMLElement.DOCUMENT_TYPE_NODE` |
|  `DOCUMENT_FRAGMENT_NODE` | `readonly` | `11` | node is a DocumentFragment node. | `HTMLElement.DOCUMENT_FRAGMENT_NODE` |
|  `NOTATION_NODE` | `readonly` | `12` | - | `HTMLElement.NOTATION_NODE` |
|  `DOCUMENT_POSITION_DISCONNECTED` | `readonly` | `1` | Set when node and other are not in the same tree. | `HTMLElement.DOCUMENT_POSITION_DISCONNECTED` |
|  `DOCUMENT_POSITION_PRECEDING` | `readonly` | `2` | Set when other is preceding node. | `HTMLElement.DOCUMENT_POSITION_PRECEDING` |
|  `DOCUMENT_POSITION_FOLLOWING` | `readonly` | `4` | Set when other is following node. | `HTMLElement.DOCUMENT_POSITION_FOLLOWING` |
|  `DOCUMENT_POSITION_CONTAINS` | `readonly` | `8` | Set when other is an ancestor of node. | `HTMLElement.DOCUMENT_POSITION_CONTAINS` |
|  `DOCUMENT_POSITION_CONTAINED_BY` | `readonly` | `16` | Set when other is a descendant of node. | `HTMLElement.DOCUMENT_POSITION_CONTAINED_BY` |
|  `DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` | `readonly` | `32` | - | `HTMLElement.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` |
|  `nextElementSibling` | `readonly` | `Element` | Returns the first following sibling that is an element, and null otherwise. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/nextElementSibling) | `HTMLElement.nextElementSibling` |
|  `previousElementSibling` | `readonly` | `Element` | Returns the first preceding sibling that is an element, and null otherwise. [MDN Reference](https://developer.mozilla.org/docs/Web/API/CharacterData/previousElementSibling) | `HTMLElement.previousElementSibling` |
|  `childElementCount` | `readonly` | `number` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/childElementCount) | `HTMLElement.childElementCount` |
|  `children` | `readonly` | `HTMLCollection` | Returns the child elements. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/children) | `HTMLElement.children` |
|  `firstElementChild` | `readonly` | `Element` | Returns the first child that is an element, and null otherwise. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/firstElementChild) | `HTMLElement.firstElementChild` |
|  `lastElementChild` | `readonly` | `Element` | Returns the last child that is an element, and null otherwise. [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/lastElementChild) | `HTMLElement.lastElementChild` |
|  `assignedSlot` | `readonly` | `HTMLSlotElement` | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/assignedSlot) | `HTMLElement.assignedSlot` |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support