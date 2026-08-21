# Companion

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
object Companion
```


## Members

### fromCMYK

```kotlin
fun fromCMYK(@FloatRange(from = 0.0, to = 1.0)c: Float, @FloatRange(from = 0.0, to = 1.0)m: Float, @FloatRange(from = 0.0, to = 1.0)y: Float, @FloatRange(from = 0.0, to = 1.0)k: Float, @FloatRange(from = 0.0, to = 1.0)tint: Float = 1.0f): CMYKColor
```

Returns a new instance of CMYKColor from separate 0-1 CMYK components. Default tint value is 1F.

### fromColor

```kotlin
fun fromColor(@ColorInt color: Int): RGBAColor
```

Returns a new instance of RGBAColor from color int (0xRRGGBBAA).

### fromHex

```kotlin
fun fromHex(colorString: String): RGBAColor
```

Returns a new instance of RGBAColor by parsing the colorString. It should be a valid hexadecimal color string, such as "#FFFFFFFF" or "#000000".

### fromRGBA

```kotlin
fun fromRGBA(@IntRange(from = 0, to = 255)r: Int, @IntRange(from = 0, to = 255)g: Int, @IntRange(from = 0, to = 255)b: Int, @IntRange(from = 0, to = 255)a: Int = 255): RGBAColor
```

```kotlin
fun fromRGBA(@FloatRange(from = 0.0, to = 1.0)r: Float, @FloatRange(from = 0.0, to = 1.0)g: Float, @FloatRange(from = 0.0, to = 1.0)b: Float, @FloatRange(from = 0.0, to = 1.0)a: Float = 1.0f): RGBAColor
```

Returns a new instance of RGBAColor from separate 0-255 RGBA components. Default alpha value is 255. Returns a new instance of RGBAColor from separate 0-1 RGBA components. Default alpha value is 1F.

### fromResource

```kotlin
fun fromResource(@ColorRes colorResource: Int, context: Context = ApplicationContextHolder.applicationContext): RGBAColor
```

Returns a new instance of RGBAColor from android color resource colorResource. Starting in Build.VERSION_CODES.M, the returned color is styled for the specified context's theme. If no context is specified, application context is used by default.

### fromSpotColor

```kotlin
fun fromSpotColor(name: String, tint: Float = 1.0f, externalReference: String? = null): SpotColor
```

Returns a new instance of SpotColor from name, i.e. "PANTONE 102 C" or "HKS 47". Default tint value is 1F. Default externalReference is null.
