> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart Flutter](./new-project.md)

---

This comprehensive guide walks you through integrating the CreativeEditor SDK
(CE.SDK) into a new Flutter project from scratch. By the end, you'll have a
fully functional creative editor running in your Flutter application, ready
for: - photo editing - design creation - video processing

## Who Is This Guide For?

This guide is for developers who:

- Have experience with Flutter and Dart
- Want to create a new Flutter project with integrated creative editing capabilities
- Need to support both Android and iOS platforms
- Want to add professional-grade:
  - image editing
  - video editing
  - design editing to their mobile apps

## What You'll Achieve

By following this guide, you will:

- Verify your Flutter development environment is properly configured
- Create a new Flutter project with proper structure and naming conventions
- Integrate the CreativeEditor SDK with all necessary configurations
- Set up platform-specific requirements for Android and iOS
- Implement a basic editor integration that you can launch from your app
- Test the integration and verify everything works correctly
- Understand how to customize the editor for different use cases
- Learn how to capture media and create compositions on mobile devices

[Explore Flutter Demos](https://img.ly/showcases/cesdk/?tags=flutter)

[View on GitHub](https://github.com/imgly/cesdk-flutter-examples)

## Prerequisites

Before you begin, ensure you have the following requirements:

### Development Environment

- **Flutter SDK**: 3.16.0 or later
- **Dart SDK**: 2.12.0 or later
- **Android Studio** or **VS Code** with Flutter extensions
- **Git CLI** for version control

### Platform Requirements

- **iOS**: 16.0+ (Xcode $XCODE\_VERSION$+, Swift $SWIFT\_VERSION$+)
- **Android**: 7.0+ (API level 24+)
- **Android compile SDK**: 34 or higher. Keep a higher `compileSdk` value if required by Flutter or other dependencies.

### License

- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)), pass `null` to run in evaluation mode with watermark.

### Verify Your Setup

Run the following command to verify your Flutter installation:

```bash
flutter doctor
```

This command checks your Flutter installation and reports any issues to resolve before proceeding.

> **Note:** You can customize the CreativeEditor SDK for Flutter exclusively through
> native code (Swift/Kotlin), as described in the
> [configuration overview section](../../user-interface/customization.md).

## Step 1: Create a New Flutter Project

First, verify your Flutter installation and version:

```bash
flutter --version
```

Start by creating a new Flutter project using the Flutter CLI:

```bash
flutter create cesdk_flutter_app
cd cesdk_flutter_app
```

### Project Creation Options

You can customize your project creation with common options:

```bash
# For specific platforms only
flutter create --platforms=ios,android cesdk_flutter_app

# With a specific organization identifier
flutter create --org com.example cesdk_flutter_app

# With a specific template
flutter create --template=app cesdk_flutter_app
```

This creates a new Flutter project with the following structure:

```
cesdk_flutter_app/
├── android/              # Android-specific configuration
├── ios/                  # iOS-specific configuration
├── lib/                  # Dart source code
│   └── main.dart         # Main application entry point
├── test/                 # Unit and widget tests
├── pubspec.yaml          # Project dependencies and configuration
├── pubspec.lock          # Locked versions of dependencies
├── README.md             # Project documentation
└── .gitignore            # Git ignore file
```

### Initial Project Setup

After creating and entering the project, run these commands to ensure everything is set up correctly:

```bash
# Install dependencies
flutter pub get

# Run the project to verify setup
flutter run
```

<ImageContainer image="flutter-project-structure.png" />

## Step 2: Add the CreativeEditor SDK Dependency

Add the CreativeEditor SDK to your project by updating the `pubspec.yaml` file:

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
  imgly_editor: ^1.53.0
```

Alternatively, you can add the dependency using the Flutter CLI:

```bash
flutter pub add imgly_editor
```

Then run the following command to install the dependencies:

```bash
flutter pub get
```

> **Note**: The `flutter pub get` command downloads and installs all dependencies specified in your `pubspec.yaml` file. This is required whenever you add new dependencies or when you first clone a project.

### Troubleshooting Dependency Issues

If you encounter dependency conflicts or installation issues:

```bash
# For verbose output to debug issues
flutter pub get --verbose

# Clean and reinstall dependencies
flutter clean && flutter pub get

# Check for newer versions of dependencies
flutter pub outdated
```

> **Important**: Some SDKs require additional platform-specific configuration. After adding `imgly_editor`, you may need to configure iOS and Android settings as outlined in the platform-specific sections below.

<ImageContainer image="pubspec-dependencies.png" />

## Step 3: Configure Android Platform

The CreativeEditor SDK requires specific Android configuration. Follow these steps to ensure proper integration:

### 3.1 Update Minimum SDK Version

Open `android/app/build.gradle.kts` and set the `minSdk` to at least 24:

```kotlin
android {
    namespace = "com.example.cesdk_flutter_app"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = "27.0.12077973"  // Required for CE.SDK

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    defaultConfig {
        applicationId = "com.example.cesdk_flutter_app"
        minSdk = 24  // Required for CE.SDK
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }
}
```

> **Note**: The `compileOptions` and `kotlinOptions` ensure compatibility with the CreativeEditor SDK and prevent common build issues.

<ImageContainer image="android-minsdk-config.png" />

### 3.2 Add IMG.LY Maven Repository

Open `android/build.gradle.kts` and add the IMG.LY maven repository:

```kotlin
buildscript {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://maven.img.ly/maven") }
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://maven.img.ly/maven") }
    }
}
```

> **Note**: The Maven URL is correct and complete. This repository contains the CreativeEditor SDK dependencies for Android.

<ImageContainer image="maven-repository-config.png" />

### 3.3 Update Kotlin Version

Open `android/settings.gradle.kts` and ensure the Kotlin version is at least 1.9.10:

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
id("org.jetbrains.kotlin.android") version "1.9.10" apply false
    // Note: Ensure this Kotlin version is compatible with your Flutter version
}
```

> **Note**: The Kotlin version must be compatible with your Flutter version — new Flutter project templates pin Kotlin 2, and Flutter 3.44 or later builds with Kotlin 2 even if your project pins an older version. If you enable Jetpack Compose for native customization, Kotlin 2 additionally requires the Compose Compiler Gradle plugin — see the [editor customization guide](../../user-interface/customization.md) for the setup.

<ImageContainer image="kotlin-version-config.png" />

### 3.4 Verify Android Configuration

After making changes to your Android configuration, verify everything is set up correctly:

```bash
# Navigate to the Android directory
cd android

# Clean and build the project
./gradlew clean
```

If you encounter any build issues, check that:

- All Maven repositories are accessible
- The Kotlin version is compatible with your Flutter version
- The minimum SDK version is set to 24 or higher

> **Note**: You may see a warning about NDK version mismatch. If so, update the `ndkVersion` in `android/app/build.gradle.kts` to `"27.0.12077973"` as shown in the configuration above.

### 3.5 ProGuard Rules (Optional)

If you're using ProGuard for release builds, add these rules to `android/app/proguard-rules.pro`:

```proguard
# CreativeEditor SDK ProGuard rules
-keep class ly.img.** { *; }
-keep class com.example.cesdk_flutter_app.** { *; }
```

## Step 4: Configure iOS Platform

The iOS configuration requires minimal setup for the CreativeEditor SDK:

### 4.1 iOS Dependency Management

A project created with Flutter 3.44 or later resolves the IMG.LY plugins through [Swift Package Manager](https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers) — no manual dependency step is needed, and the deployment target comes from your Xcode project settings (next section).

**CocoaPods path only** (Flutter before 3.44) — open `ios/Podfile` and ensure the iOS deployment target is set to 16.0 or later:

```ruby
# Uncomment this line to define a global platform for your project
platform :ios, '16.0'
```

### 4.2 Update iOS Project Settings

The easiest way to configure iOS settings is through Xcode:

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select the Runner project
3. In the General tab, set "Minimum Deployments" to iOS 16.0

Alternatively, you can update `ios/Flutter/AppFrameworkInfo.plist`:

```xml
<key>MinimumOSVersion</key>
<string>16.0</string>
```

### 4.3 Add Required Permissions

The CreativeEditor SDK may require certain permissions depending on which features you use. Add the relevant permissions to `ios/Runner/Info.plist`:

```xml

<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos for editing</string>

<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for video recording and voiceovers</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to import images for editing</string>
```

Note: The photo library permission is optional. By default, CE.SDK uses the system photos picker which doesn't require permissions. Only add `NSPhotoLibraryUsageDescription` if you explicitly enable full photo library access using `PhotoRollAssetSource(engine: engine, mode: .fullLibraryAccess)` in your iOS code.

### 4.4 Swift Support (Required)

The CreativeEditor SDK requires Swift support. If your project doesn't have Swift files, create a bridging header:

```bash
# Create a Swift bridging header if the project doesn't have one
touch ios/Runner/Runner-Bridging-Header.h
```

### 4.5 Verify iOS Configuration

After making changes, verify your iOS setup:

```bash
flutter clean
flutter run --release
```

> **Note**: The CreativeEditor SDK for Flutter requires camera, microphone, and photo library permissions along with Swift support. These are essential for the editor to function properly.

## Step 5: Implement the Creative Editor

Now let's implement the CreativeEditor SDK in your Flutter application:

### 5.1 Create Configuration File

First, create a secure configuration file for your license key. Create `lib/secrets/secrets.dart`:

```dart
class Secrets {
  // License key will be provided via environment variable
  static const String license =
      String.fromEnvironment("SHOWCASES_LICENSE_FLUTTER", defaultValue: "");
}
```

> **Important**: Add `lib/secrets/secrets.dart` to your `.gitignore` file to prevent accidentally committing your license key to version control.

Add this line to your `.gitignore` file:

```
lib/secrets/secrets.dart
```

### Setting Your License Key

Always pass your license key as an environment variable when running your app:

```bash
# For development
flutter run --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here
# Example: flutter run --dart-define=SHOWCASES_LICENSE_FLUTTER=1eleI20eS2ot6_GzA22CKighDuOlXVZs-8oQAdqawTSQb-hBTsGNeRNyglfFJvJ2

# For release builds
flutter build apk --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here
flutter build ios --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here
```

> **Security Best Practice**: Never include license keys in your source code, even in files excluded from version control. Always use environment variables or secure key management systems.

### 5.2 Create the Editor Service

Create a new file `lib/services/editor_service.dart`:

```dart
import 'package:imgly_editor/imgly_editor.dart';
import '../secrets/secrets.dart';

class EditorService {
  /// Opens the CreativeEditor with basic configuration
  static Future<void> openEditor() async {
    try {
      // Validate license key
      if (Secrets.license.isEmpty) {
        throw Exception('Please set your IMG.LY license key using --dart-define=SHOWCASES_LICENSE_FLUTTER=your_key');
      }

            final settings = EditorSettings(
        license: Secrets.license, // pass null for evaluation mode with watermark
        userId: "YOUR_USER_ID"
      );
      final result = await IMGLYEditor.openEditor(
          preset: EditorPreset.design, settings: settings);

      if (result != null) {
        print('Editor completed successfully');
        // Process the result based on your needs
        // result contains the edited content that you can save or upload
      } else {
        print('Editor was cancelled');
      }
    } catch (error) {
      print('Error opening editor: $error');
      rethrow;
    }
  }
}
```

### 5.3 Update the Main Application

Update your `lib/main.dart` file to include a button that launches the editor:

```dart
import 'package:flutter/material.dart';
import 'package:cesdk_flutter_app/services/editor_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CE.SDK Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'CE.SDK Flutter Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool _mounted = true;

  @override
  void dispose() {
    _mounted = false;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Welcome to CE.SDK Flutter Integration',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            const Text(
              'Tap the button below to open the Creative Editor',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () async {
                try {
                  await EditorService.openEditor();
                } catch (error) {
                  if (_mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Failed to open editor: ${error.toString()}'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                }
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
              ),
              child: const Text(
                'Open Creative Editor',
                style: TextStyle(fontSize: 18),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

<ImageContainer image="flutter-editor-integration.png" />

## Step 6: Test Your Integration

Now you can test your CreativeEditor SDK integration:

### 6.1 Run on Android

```bash
flutter run -d android
```

### 6.2 Run on iOS

```bash
flutter run -d ios
```

### 6.3 Verify Your Setup

After running the app, you should see:

- A welcome screen with a button labeled "Open Creative Editor"
- Tapping the button launches the CreativeEditor SDK
- The editor opens with the design preset

If you encounter any issues, check the [troubleshooting section](#troubleshooting) below.

## Configuration Options

### Editor Presets

The CreativeEditor SDK provides several predefined presets for different use cases:

| Preset                  | Description                 | Use Case                            |
| ----------------------- | --------------------------- | ----------------------------------- |
| `EditorPreset.design`   | Full-featured design editor | General design creation and editing |
| `EditorPreset.photo`    | Photo editing focused       | Image enhancement and photo editing |
| `EditorPreset.video`    | Video editing focused       | Video processing and editing        |
| `EditorPreset.apparel`  | Apparel design focused      | T-shirt and merchandise design      |
| `EditorPreset.postcard` | Postcard design focused     | Greeting cards and postcards        |

Choose the appropriate preset based on your use case:

```dart
// For photo editing
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.photo,
);

// For video editing
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.video,
);
```

> **Mobile-Specific Features**: Flutter apps can leverage camera integration for direct media capture, making them ideal for mobile-first creative workflows.

## Step 6: Test Your Integration

Now let's test your CreativeEditor SDK integration:

### 6.1 Verify Dependencies

First, ensure all dependencies are properly installed:

```bash
flutter pub get
```

### 6.2 Test on Android Device

Connect your Android device and run:

```bash
# List available devices
flutter devices

# Run on specific device (replace with your device ID)
flutter run -d your_device_id

# Or run with license key
flutter run -d your_device_id --dart-define=SHOWCASES_LICENSE_FLUTTER=your_license_key
```

### 6.3 Test on iOS Device

For iOS testing:

```bash
# Run on iOS device or simulator (dependencies resolve automatically)
flutter run
```

**CocoaPods path only** — if the build fails on pod resolution, run `cd ios && pod install` and retry.

### 6.4 Verify Features

When the app launches successfully, you should see:

1. **Main Screen**: A clean Material Design interface with "CE.SDK Flutter Demo" title
2. **Editor Button**: A prominent "Open Creative Editor" button
3. **Editor Launch**: Tapping the button should open the CreativeEditor
4. **Editor Features**: You should be able to access:
   - photo editing
   - design tools
   - other features

### 6.5 Common Test Scenarios

Test these scenarios to ensure everything works:

- **Basic Editor Launch**: Tap the button and verify the editor opens
- **Camera Access**: Test camera features within the editor
- **Photo Import**: Import photos from your device gallery
- **Basic Editing**: Try basic editing features like:
  - filters
  - text
  - shapes
- **Save/Export**: Test saving and exporting edited content

> **Note**: The first build may take several minutes as it compiles all native dependencies. Subsequent builds will be faster.

## Step 7: Customize for Your Use Case

The CreativeEditor SDK offers different presets for common use cases:

### 7.1 Configuration Options

#### Editor Presets

The CreativeEditor SDK provides several predefined presets for different use cases:

| Preset                  | Description                 | Use Case                            |
| ----------------------- | --------------------------- | ----------------------------------- |
| `EditorPreset.design`   | Full-featured design editor | General design creation and editing |
| `EditorPreset.photo`    | Photo editing focused       | Image enhancement and photo editing |
| `EditorPreset.video`    | Video editing focused       | Video processing and editing        |
| `EditorPreset.apparel`  | Apparel design focused      | T-shirt and merchandise design      |
| `EditorPreset.postcard` | Postcard design focused     | Greeting cards and postcards        |

Choose the appropriate preset based on your use case:

```dart
// For photo editing
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.photo,
);

// For design creation
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.design,
);

// For video editing
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.video,
);

// For apparel design
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.apparel,
);

// For postcard design
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.postcard,
);
```

### 7.2 Handle Editor Results

You can handle the editor results to integrate with your app:

```dart
final result = await IMGLYEditor.openEditor(
  settings: settings,
  preset: EditorPreset.design,
);

if (result != null) {
  // Handle the edited content
  // result contains the edited image/video data
  // You can:
  // - save it
  // - upload it
  // - process it further

  // Example: Save to your app's storage
  await saveEditedContent(result);

  // Example: Update your app's UI
  setState(() {
    // Update your app state
  });
}
```

> **Mobile-Specific Features**: Flutter apps can leverage camera integration for direct media capture, making them ideal for mobile-first creative workflows.

## Troubleshooting

### Common Issues and Solutions

#### 1. Dependency Resolution Errors

**Error:**

```
Because cesdk_flutter_app depends on imgly_editor x.xx.x which doesn't match any versions, version solving failed.
```

**Solution:**

1. Ensure you're using a valid version of the CreativeEditor SDK. Check the latest version in the [pub.dev registry](https://pub.dev/packages/imgly_editor).
2. Run `flutter pub get` to refresh dependencies.
3. Check your internet connection and try again.

#### 2. Android Build Errors

**Error:**

```
minSdk (API level 21) < 24
```

**Solution:** Update your `android/app/build.gradle.kts` to set `minSdk = 24`.

#### 3. iOS Build Errors

**Error:**

```
iOS deployment target '12.0' is less than the minimum deployment target '16.0'
```

**Solution:** Set "Minimum Deployments" of the Runner target to iOS 16.0 in Xcode. **CocoaPods path only** — also update `ios/Podfile` to set `platform :ios, '16.0'`.

#### 4. License Key Errors

**Error:**

```
Invalid license key
```

**Solution:**

1. Ensure you have a valid license key from [IMG.LY](https://img.ly/forms/free-trial) (or pass `null` for evaluation mode with watermark).
2. Verify the license key is correctly configured in your `lib/secrets/secrets.dart` file.
3. Check that the license key is for the correct platform (Flutter).
4. Ensure there are no extra spaces or characters in the license key.
5. Make sure you're passing the license key with `--dart-define=SHOWCASES_LICENSE_FLUTTER=your_key`.

## Next Steps

Now that you have a basic CreativeEditor SDK integration, you can:

1. **Import and Capture Media**: Learn how to capture photos and videos directly from your Flutter app
2. **Create Compositions**: Explore how to build complex designs and layouts
3. **Customize the UI**: Use native interfaces (Swift/Kotlin) to customize the editor appearance and functionality
4. **Add Text and Shapes**: Learn how to add and edit:
   - text
   - shapes
   - other design elements
5. **Export and Save**: Implement proper result handling and export functionality for your specific workflow
6. **Automate Workflows**: Explore advanced automation capabilities for batch processing

### Related Guides

- **[Import and Capture Media](https://img.ly/docs/cesdk/flutter/import-media-4e3703/)**: Learn how to integrate camera features
- **[Create Compositions](https://img.ly/docs/cesdk/flutter/create-composition-db709c/)**: Build complex designs and layouts
- **[Customize the UI](../../user-interface/customization.md)**: Customize the editor interface
- **[Add Text](https://img.ly/docs/cesdk/flutter/text-8a993a/)**: Work with text and typography
- **[Add Shapes](https://img.ly/docs/cesdk/flutter/shapes-9f1b2c/)**: Create and manipulate shapes
- **[Engine Interface](../../engine-interface.md)**: Handle editor results and exports programmatically

## Additional Resources

- [CreativeEditor SDK Documentation](https://img.ly/docs/cesdk/)
- [Flutter Examples Repository](https://github.com/imgly/cesdk-flutter-examples)

#

## Support

If you encounter any issues or need assistance:

- Check the [troubleshooting section](./new-project.md#troubleshooting) above
- Review the [Flutter examples](https://github.com/imgly/cesdk-flutter-examples) for working implementations
- Contact [IMG.LY support](https://img.ly/support) for technical assistance

Congratulations! You've successfully integrated the CreativeEditor SDK into your Flutter application. Your app now has powerful creative editing capabilities that work seamlessly on both Android and iOS platforms.



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support