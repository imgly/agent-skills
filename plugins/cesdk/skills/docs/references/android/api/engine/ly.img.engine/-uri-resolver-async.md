# UriResolverAsync

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Internal helper class used by EditorApi.setUriResolverAsync. This type is invoked from native code via JNI, so the class name and method signatures must be kept stable.

```kotlin
class UriResolverAsync(resolver: suspend (Uri) -> Uri)
```


## Members

### UriResolverAsync

```kotlin
constructor(resolver: suspend (Uri) -> Uri)
```
