> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [URI Resolver](./uri-resolver.md)

---

```swift file=@cesdk_swift_examples/engine-guides-uri-resolver/URIResolver.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func uriResolver(engine: Engine) async throws {
  // Resolve a path without loading the asset. With no custom resolver, a relative
  // path is prefixed with the `basePath` setting and absolute paths pass through.
  let resolved = try await engine.editor.getAbsoluteURI(relativePath: "/banana.jpg")
  print(resolved)

  try engine.editor.setURIResolver { [weak engine] uri in
    // Rewrite every .jpg request to the IMG.LY logo.
    if uri.hasSuffix(".jpg") {
      return URL(string: "https://img.ly/static/ubq_samples/imgly_logo.jpg")!
    }
    // Delegate everything else to the default resolution behavior.
    guard let engine else { return URL(string: uri)! }
    return URL(string: engine.editor.defaultURIResolver(relativePath: uri))!
  }

  // The resolver runs for every request, so .jpg paths now resolve to the logo
  // whether they are relative or absolute.
  print(try await engine.editor.getAbsoluteURI(relativePath: "/banana.jpg"))

  // Pre-compute the token; a synchronous resolver can't await a network call.
  let accessToken = "<your-access-token>"
  try engine.editor.setURIResolver { [weak engine] uri in
    guard let engine else { return URL(string: uri)! }
    let absoluteURI = engine.editor.defaultURIResolver(relativePath: uri)
    // Only protected assets need the token; pass everything else through unchanged.
    guard uri.contains("/protected/"), var components = URLComponents(string: absoluteURI) else {
      return URL(string: absoluteURI)!
    }
    components.queryItems = (components.queryItems ?? []) + [URLQueryItem(name: "token", value: accessToken)]
    return components.url ?? URL(string: absoluteURI)!
  }

  // When the token or signed URL must be fetched per request, use the async
  // resolver and await your backend. Replace the stand-in with a real request.
  let requestSignedURL: @Sendable (String) async throws -> URL = { absoluteURI in
    URL(string: absoluteURI)!
  }
  try engine.editor.setURIResolverAsync { [weak engine] uri in
    guard let engine else { throw URLError(.cancelled) }
    let absoluteURI = await engine.editor.defaultURIResolver(relativePath: uri)
    guard uri.contains("/protected/") else { return URL(string: absoluteURI)! }
    return try await requestSignedURL(absoluteURI)
  }

  // Pass nil to remove the custom resolver and restore the default behavior.
  try engine.editor.setURIResolver(nil)
  print(try await engine.editor.getAbsoluteURI(relativePath: "/banana.jpg"))
}
```

Learn how to intercept and transform asset URIs in CE.SDK, enabling authentication and custom resolution logic.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-uri-resolver)

<EngineReferenceNote {...props} />

When CE.SDK loads an asset, it resolves the requested URI to an absolute URL before fetching it. You can intercept this step to add authentication tokens, redirect to a different host, or transform URIs to match your application's needs.

## Default URI Resolution

By default, CE.SDK resolves URIs relative to the `basePath` setting: absolute URIs (with a scheme such as `https://` or `file://`) pass through unchanged, while relative paths are prefixed with `basePath`.

Use `getAbsoluteURI(relativePath:)` to preview how a path resolves without loading the asset:

```swift highlight-test-resolution
// Resolve a path without loading the asset. With no custom resolver, a relative
// path is prefixed with the `basePath` setting and absolute paths pass through.
let resolved = try await engine.editor.getAbsoluteURI(relativePath: "/banana.jpg")
print(resolved)
```

## Custom URI Resolver

Register a custom resolver with `setURIResolver(_:)`. CE.SDK then routes every requested URI through your closure and fetches whatever URL you return. The resolved URL is used only for that request and is never stored. Return `defaultURIResolver(relativePath:)` for any path you don't transform, otherwise it would be lost.

```swift highlight-set-resolver
  try engine.editor.setURIResolver { [weak engine] uri in
    // Rewrite every .jpg request to the IMG.LY logo.
    if uri.hasSuffix(".jpg") {
      return URL(string: "https://img.ly/static/ubq_samples/imgly_logo.jpg")!
    }
    // Delegate everything else to the default resolution behavior.
    guard let engine else { return URL(string: uri)! }
    return URL(string: engine.editor.defaultURIResolver(relativePath: uri))!
  }

  // The resolver runs for every request, so .jpg paths now resolve to the logo
  // whether they are relative or absolute.
  print(try await engine.editor.getAbsoluteURI(relativePath: "/banana.jpg"))
```

The resolver must return a `URL` that includes a scheme. The engine retains the resolver for as long as it is set, so capture anything that owns the engine weakly — for example `[weak self]` — to avoid a retain cycle.

## Adding Authentication

A common use case is attaching an authentication token to protected asset URIs. Because `setURIResolver(_:)` runs a closure that can't `await`, generate the token ahead of time and append it as a query parameter. Filter to your own protected paths so the token isn't sent to public or third-party hosts:

```swift highlight-auth-resolver
// Pre-compute the token; a synchronous resolver can't await a network call.
let accessToken = "<your-access-token>"
try engine.editor.setURIResolver { [weak engine] uri in
  guard let engine else { return URL(string: uri)! }
  let absoluteURI = engine.editor.defaultURIResolver(relativePath: uri)
  // Only protected assets need the token; pass everything else through unchanged.
  guard uri.contains("/protected/"), var components = URLComponents(string: absoluteURI) else {
    return URL(string: absoluteURI)!
  }
  components.queryItems = (components.queryItems ?? []) + [URLQueryItem(name: "token", value: accessToken)]
  return components.url ?? URL(string: absoluteURI)!
}
```

Your asset server then validates the token and serves the protected asset.

When the credential must be fetched per request — for example, exchanging a path for a short-lived pre-signed URL — use `setURIResolverAsync(_:)` and `await` your backend inside the closure:

```swift highlight-auth-resolver-async
// When the token or signed URL must be fetched per request, use the async
// resolver and await your backend. Replace the stand-in with a real request.
let requestSignedURL: @Sendable (String) async throws -> URL = { absoluteURI in
  URL(string: absoluteURI)!
}
try engine.editor.setURIResolverAsync { [weak engine] uri in
  guard let engine else { throw URLError(.cancelled) }
  let absoluteURI = await engine.editor.defaultURIResolver(relativePath: uri)
  guard uri.contains("/protected/") else { return URL(string: absoluteURI)! }
  return try await requestSignedURL(absoluteURI)
}
```

## Removing a Resolver

Pass `nil` to remove the custom resolver and restore the default behavior. `setURIResolver(_:)` and `setURIResolverAsync(_:)` share a single resolver slot, so `nil` clears whichever one is active:

```swift highlight-remove-resolver
// Pass nil to remove the custom resolver and restore the default behavior.
try engine.editor.setURIResolver(nil)
print(try await engine.editor.getAbsoluteURI(relativePath: "/banana.jpg"))
```

## Key Constraints

- **Sync vs async**: `setURIResolver(_:)` takes a non-throwing `(String) -> URL` closure and can't report errors. Use `setURIResolverAsync(_:)` when you need to `await` a backend call or surface a failure.
- **Return absolute URLs**: The resolver must return a `URL` with a scheme (`https://`, `file://`, …). The incoming path may be relative or even invalid.
- **One resolver at a time**: Both setters write the same slot, so a new call replaces the previous resolver, and passing `nil` removes it.
- **Delegate unmatched URIs**: Return `defaultURIResolver(relativePath:)` for any path you don't transform.

## Next Steps

- [Serve Assets](../serve-assets.md) — Host engine and content assets on your own servers instead of the IMG.LY CDN.
- [Import From Remote Source](../import-media/from-remote-source.md) — Connect CE.SDK to external sources like servers or third-party platforms to import assets remotely.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support