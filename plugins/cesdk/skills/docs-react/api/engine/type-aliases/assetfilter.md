> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AssetFilter = 
  | AssetPropertyFilter
  | {
  and: AssetFilter[];
  or?: never;
  not?: never;
  property?: never;
}
  | {
  or: AssetFilter[];
  and?: never;
  not?: never;
  property?: never;
}
  | {
  not: AssetFilter;
  and?: never;
  or?: never;
  property?: never;
};
```

Filter expression — predicate or logical combinator. Combinators nest
arbitrarily. The union is mutually exclusive: an object with both
`and` and `or`, or with `property` next to a combinator key, is
rejected at the type level.

Missing-key semantics for `not`: a predicate is `false` on an asset
that lacks the targeted field, so a negated `meta.foo === 'x'` matches
assets where `meta.foo !== 'x'` **and** assets that lack `meta.foo`
entirely.


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support