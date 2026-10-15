# Engine

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
class Engine : SavedStateRegistry.SavedStateProvider
```


## Members

### addSurfaceCreatedListener

```kotlin
@MainThread
fun addSurfaceCreatedListener(listener: () -> Unit)
```

Registers a new listener that is invoked every time bound SurfaceView's or TextureView's Surface is created/recreated. This, for instance, can be used to update the android.graphics.SurfaceTexture instance in BlockApi.setNativePixelBuffer.

### applicationContext

```kotlin
val applicationContext: Context
```

The application context of the android app.

### asset

```kotlin
val asset: AssetApi
```

This object is used to invoke asset commands of Engine. It should be accessed after calling start and before calling stop otherwise it will throw an exception.

### awaitStart

```kotlin
suspend fun awaitStart()
```

### bindOffscreen

```kotlin
@MainThread
fun bindOffscreen(@IntRange(from = 1)width: Int, @IntRange(from = 1)height: Int)
```

Binds offscreen context to the Engine. This should be used when the Engine is used without UI. Note that only one engine instance can be bound at a time. Calling bindOffscreen unbinds other engine instances.

### bindSurfaceHolder

```kotlin
@MainThread
fun bindSurfaceHolder(surfaceHolder: SurfaceHolder)
```

Binds surfaceHolder to the Engine. All rendered frames will be drawn into the surface of surfaceHolder. Note that only one engine instance can be bound at a time. Calling bindSurfaceHolder unbinds other engine instances.

### bindSurfaceView

```kotlin
@MainThread
fun bindSurfaceView(surfaceView: SurfaceView)
```

Binds surfaceView to the Engine. All rendered frames will be drawn into the surfaceView. Note that only one engine instance can be bound at a time. Calling bindSurfaceView unbinds other engine instances.

### bindTextureView

```kotlin
@MainThread
fun bindTextureView(textureView: TextureView)
```

Binds textureView to the Engine. All rendered frames will be drawn into the textureView. Note that only one engine instance can be bound at a time. Calling bindTextureView unbinds other engine instances.

### block

```kotlin
val block: BlockApi
```

This object is used to invoke block commands of Engine. It should be accessed after calling start and before calling stop otherwise it will throw an exception.

### dispatcher

```kotlin
val dispatcher: MainCoroutineDispatcher
```

Coroutine dispatcher of the Engine thread. It is always main thread coroutine dispatcher for public usage.

### editor

```kotlin
val editor: EditorApi
```

This object is used to invoke editor commands of Engine. It should be accessed after calling start and before calling stop otherwise it will throw an exception.

### event

```kotlin
val event: EventApi
```

This object is used to invoke event commands of Engine. It should be accessed after calling start and before calling stop otherwise it will throw an exception.

### handler

```kotlin
val handler: Handler
```

### idlingEnabled

```kotlin
@get:MainThread
@set:MainThread
var idlingEnabled: Boolean
```

Set this flag as true if you want the Engine to become idle if it has no pending work. This is useful for UI testing, as Espresso expects UI thread to become idle before making any assertions (without this flag your UI tests will always be stuck as main thread is never idle due to the never ending Engine update calls). Default value is false. Note that the flag is experimental and might be changed/removed.

### isBound

```kotlin
@MainThread
fun isBound(): Boolean
```

Tells whether the engine is bound. The engine is being in bound state in between one of bound and unbind function invocations.

### isEngineRunning

```kotlin
@MainThread
fun isEngineRunning(): Boolean
```

Tells whether the engine is currently running.

### isTextActionModeHidden

```kotlin
@get:MainThread
@set:MainThread
var isTextActionModeHidden: Boolean
```

Hides the floating text-selection ActionMode window.

### looper

```kotlin
val looper: Looper
```

Looper of the Engine thread. It is always main thread looper for public usage.

### pause

```kotlin
@MainThread
fun pause()
```

Pauses the current engine. All the resources of the engine will remain in the memory, however the engine will not consume any processing power. Call unpause to revert the effect. This method is useful when you want to save processing power resources when the engine is inactive in your current UI. It is also useful, when you have multiple engine instances: we highly recommend that you always keep 1 active engine at a time. When switching the current active engine, call pause on the remaining engine instances.

### removeSurfaceCreatedListener

```kotlin
@MainThread
fun removeSurfaceCreatedListener(listener: () -> Unit)
```

Unregisters listener that was previously registered via addSurfaceCreatedListener.

### saveState

```kotlin
open override fun saveState(): Bundle
```

### scene

```kotlin
val scene: SceneApi
```

This object is used to invoke scene commands of Engine. It should be accessed after calling start and before calling stop otherwise it will throw an exception.

### start

```kotlin
@MainThread
suspend fun start(license: String? = null, userId: String? = null, savedStateRegistryOwner: SavedStateRegistryOwner? = null, buildHost: String = ""): Boolean
```

Starts the Engine. After this invocation all the APIs can be used. The opposite of this method is stop. Note that other than userId we also use the android.provider.Settings.Secure.ANDROID_ID for better data accuracy. You should include it in the Data safety form of your application when uploading it to the Play Store.

### stop

```kotlin
@MainThread
fun stop(): Boolean
```

Stops the engine. All the native resources will be released and scene will not be available anymore. All subsequent calls to any of the APIs will result to thrown exceptions. In order to use Engine again, start should be invoked. This method also invokes unbind if necessary. Note that after calling stop other Engine instances that have the same id will crash upon any usage.

### unbind

```kotlin
@MainThread
fun unbind()
```

Releases the surface buffers and clears the reference of SurfaceView if bindTextureView was called or of TextureView if bindTextureView was called.

### unpause

```kotlin
@MainThread
fun unpause()
```

Unpauses the current engine that was paused before via pause.

### variable

```kotlin
val variable: VariableApi
```

This object is used to invoke variable commands of Engine. It should be accessed after calling start and before calling stop otherwise it will throw an exception.
