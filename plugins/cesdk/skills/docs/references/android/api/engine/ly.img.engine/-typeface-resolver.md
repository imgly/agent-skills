# TypefaceResolver

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Internal helper class used by EditorApi.setTypefaceResolver. This type is invoked from native code via JNI, so the class name and method signatures must be kept stable.

```kotlin
class TypefaceResolver(resolver: suspend (FontRequest) -> FontResolverResult?)
```


## Members

### TypefaceResolver

```kotlin
constructor(resolver: suspend (FontRequest) -> FontResolverResult?)
```
