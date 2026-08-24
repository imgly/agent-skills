plugins {
    kotlin("android")
    id("com.android.library")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "ly.img.editor.configuration"
    compileSdk = 36

    defaultConfig {
        minSdk = 24
        targetSdk = 36

        ndk {
            abiFilters += listOf("arm64-v8a", "armeabi-v7a", "x86_64", "x86")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    api("ly.img:editor:1.82.0-nightly.20260824")
    // Required for enableEdgeToEdge
    implementation("androidx.activity:activity-ktx:1.9.0")
}

// Optional per-starter-kit dependencies (Coil, ExifInterface, extra Compose libs). Kept in a
// sibling `starter-kit-dependencies.gradle` — a separate file so the showcases/examples apps can
// apply the same list to their merged sources. Resolve it next to this module (not via
// rootProject) so it is found whether the kit is built standalone or copied into another project,
// as long as the file is kept beside the module.
val starterKitDependencies = file("../starter-kit-dependencies.gradle")
if (starterKitDependencies.exists()) {
    apply(from = starterKitDependencies)
}
