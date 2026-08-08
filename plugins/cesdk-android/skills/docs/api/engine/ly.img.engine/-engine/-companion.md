# Companion

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
object Companion
```


## Members

### $disableInternalDeployMode

```kotlin
var $disableInternalDeployMode: Boolean
```

### getInstance

```kotlin
fun getInstance(id: String, audioContext: AudioContext = AudioContext.AUTO): Engine
```

Returns an instance of Engine class. Note that if an Engine instance already exists with id, same instance will be returned.

### init

```kotlin
@MainThread
fun init(application: Application)
```

Initializer for Engine. This needs to be invoked before calling any of the Engine methods. It is recommended to invoke this method in the onCreate() method of application.
