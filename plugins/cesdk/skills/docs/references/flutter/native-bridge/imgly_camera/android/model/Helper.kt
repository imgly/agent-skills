package ly.img.camera.flutter.plugin.model

import android.content.Intent
import android.os.Build
import android.os.Parcelable
import java.lang.ref.WeakReference
import kotlin.reflect.KProperty

/**
 * Helper to handle the deprecation of getParcelableExtra in Android 33
 */
inline fun <reified T : Parcelable> Intent.getParcelableExtraCompat(key: String): T? = when {
    Build.VERSION.SDK_INT >= 33 -> getParcelableExtra(key, T::class.java)
    else ->
        @Suppress("DEPRECATION")
        getParcelableExtra(key)
            as? T
}

/**
 * A delegate for weak references.
 */
internal class WeakDelegate<TYPE>(
    private var weakReference: WeakReference<TYPE>,
) {
    operator fun getValue(
        thisRef: Any,
        property: KProperty<*>,
    ): TYPE? = weakReference.get()

    operator fun setValue(
        thisRef: Any,
        property: KProperty<*>,
        value: TYPE,
    ) {
        weakReference = WeakReference(value)
    }
}

internal fun <TYPE> weak(value: TYPE? = null) = WeakDelegate(WeakReference(value))
