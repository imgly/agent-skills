# System

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Let the platform encoder choose the bitrate (the default). On Android there is no encoder-internal default, so this resolves to the same bounded resolution/framerate default as Auto.

```kotlin
data object System : VideoBitrate
```
