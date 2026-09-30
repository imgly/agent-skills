pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven {
            name = "IMG.LY Artifactory"
            url = uri("https://maven.img.ly/maven")
            mavenContent {
                includeGroup("ly.img")
            }
        }
    }
}

val propertiesFile = File(rootDir, "starter-kit-config.properties")
if (propertiesFile.exists()) {
    val properties = java.util.Properties().apply {
        propertiesFile.inputStream().use { load(it) }
    }
    gradle.extra.apply {
        set("gradleProjectName", properties.getProperty("gradle_project_name") ?: "starter-kit-unknown")
        set("appName", properties.getProperty("app_name") ?: "Unknown")
        set("packageSuffix", properties.getProperty("package_suffix") ?: ".unknown")
    }
}

rootProject.name = (gradle.extra["gradleProjectName"] as? String) ?: "starter-kit-unknown"
include(":app")
include(":starter-kit")

// Internal use only
val editorDir = file("../../../../apps/cesdk_android")
if (editorDir.exists() && System.getenv("UBQ_ANDROID_USE_ARTIFACTS") != "true") {
    includeBuild(editorDir) {
        dependencySubstitution {
            substitute(module("ly.img:editor")).using(project(":editor"))
            substitute(module("ly.img:camera")).using(project(":camera"))
        }
    }
}
// Internal use only
