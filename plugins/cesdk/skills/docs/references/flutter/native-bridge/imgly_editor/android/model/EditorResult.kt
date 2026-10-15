package ly.img.editor.flutter.plugin.model

import android.os.Parcel
import android.os.Parcelable

/**
 * A class representing the result of an editor export.
 * @property scene The source of the exported scene.
 * @property artifact The source of the exported artifact, e.g. image, video.
 * @property thumbnail The source of the exported thumbnail.
 * @property metadata The associated metadata.
 */
data class EditorResult(
    val scene: String?,
    val artifact: String?,
    val thumbnail: String?,
    val metadata: Map<String, Any> = emptyMap(),
) : Parcelable {
    /**
     * Creates a new instance from a given [Parcel].
     * @param parcel The [Parcel].
     */
    constructor(parcel: Parcel) : this(
        parcel.readString(),
        parcel.readString(),
        parcel.readString(),
        readMap(parcel),
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeString(scene)
        parcel.writeString(artifact)
        parcel.writeString(thumbnail)
        writeMap(parcel, metadata, flags)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<EditorResult> {
        override fun createFromParcel(parcel: Parcel): EditorResult = EditorResult(parcel)

        override fun newArray(size: Int): Array<EditorResult?> = arrayOfNulls(size)

        private fun writeMap(
            parcel: Parcel,
            map: Map<String, Any>?,
            flags: Int,
        ) {
            if (map == null) return

            parcel.writeInt(map.size)
            for ((key, value) in map) {
                parcel.writeString(key)
                when (value) {
                    is Int -> {
                        parcel.writeInt(0)
                        parcel.writeInt(value)
                    }

                    is Long -> {
                        parcel.writeInt(1)
                        parcel.writeLong(value)
                    }

                    is Float -> {
                        parcel.writeInt(2)
                        parcel.writeFloat(value)
                    }

                    is Double -> {
                        parcel.writeInt(3)
                        parcel.writeDouble(value)
                    }

                    is Boolean -> {
                        parcel.writeInt(4)
                        parcel.writeInt(if (value) 1 else 0)
                    }

                    is String -> {
                        parcel.writeInt(5)
                        parcel.writeString(value)
                    }

                    is Parcelable -> {
                        parcel.writeInt(6)
                        parcel.writeParcelable(value, flags)
                    }

                    else -> {
                        throw IllegalArgumentException("Unsupported value type: ${value::class.java}")
                    }
                }
            }
        }

        private fun readMap(parcel: Parcel): Map<String, Any> {
            val size = parcel.readInt()
            val map = mutableMapOf<String, Any>()
            repeat(size) {
                val key = parcel.readString()
                val value: Any = when (val valueType = parcel.readInt()) {
                    0 -> parcel.readInt()
                    1 -> parcel.readLong()
                    2 -> parcel.readFloat()
                    3 -> parcel.readDouble()
                    4 -> parcel.readInt() == 1
                    5 -> parcel.readString() ?: ""
                    6 -> parcel.readParcelable<Parcelable>(Parcelable::class.java.classLoader)!!
                    else -> throw IllegalArgumentException("Unsupported value type: $valueType")
                }
                if (key == null) {
                    throw (IllegalStateException("Key must not be null."))
                }

                map[key] = value
            }
            return map
        }
    }
}
