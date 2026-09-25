plugins {
    kotlin("android")
    id("com.android.application")
    id("org.jetbrains.kotlin.plugin.compose")
}

val packageSuffix = (gradle as ExtensionAware).extra["packageSuffix"] as? String ?: "unknown"
val appName = (gradle as ExtensionAware).extra["appName"] as? String ?: "Unknown"

android {
    namespace = "ly.img.starterkit"
    compileSdk = 36

    defaultConfig {
        applicationId = "ly.img.starterkit.$packageSuffix"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        resValue("string", "app_name", appName)
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    // Allows starter-kit apps to use Jetpack Compose (e.g. a Compose-based MainActivity).
    // No-op for kits whose app is the default View-based launcher screen.
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(project(":starter-kit"))
}
