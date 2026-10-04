> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart Flutter](./new-project.md)

---

This comprehensive guide walks you through integrating the CreativeEditor SDK
(CE.SDK) into your existing Flutter project. By the end, you'll have a fully
functional creative editor running in your Flutter application, ready for: -
photo editing - design creation - video processing

## Who Is This Guide For?

This guide is for developers who:

- Have an existing Flutter project that's already set up and running
- Want to add CreativeEditor SDK capabilities to their current app
- Need to support both Android and iOS platforms
- Want to integrate professional-grade:
  - image editing
  - video editing
  - design editing into their existing mobile app

## What You'll Achieve

By following this guide, you will:

- Add the CreativeEditor SDK to your existing Flutter project
- Configure platform-specific requirements for Android and iOS
- Implement a secure license key management system
- Create a service layer for editor integration
- Test the integration and verify everything works correctly
- Understand how to customize the editor for different use cases
- Learn how to integrate editor features into your existing app structure

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

- **iOS**: 16.0+ (Xcode 26.4.1+, Swift 6.3.1+)
- **Android**: 7.0+ (API level 24+)

### License

- A valid **CE.SDK license key** ([Request a license](https://img.ly/forms/contact-sales/)), pass `null` to run in evaluation mode with watermark.

### Verify Your Setup

Run the following command to verify your Flutter installation:

```bash
flutter doctor
```

This command checks your Flutter installation and reports any issues to resolve before proceeding.

> **Note:** You can customize the CreativeEditor SDK for Flutter exclusively through
> native code (Swift/Kotlin), as described in the
> [configuration overview section](../../user-interface/customization.md).

## Step 1: Add the CreativeEditor SDK Dependency

Navigate to your existing Flutter project directory and add the CreativeEditor SDK dependency:

```bash
cd your_existing_flutter_project
flutter pub add imgly_editor
```

This command adds the latest version of the CreativeEditor SDK to your `pubspec.yaml` file:

```yaml
dependencies:
  flutter:
    sdk: flutter
  imgly_editor: ^1.53.0 # or the latest version
```

### Verify Dependency Installation

After adding the dependency, run:

```bash
flutter pub get
```

This downloads and installs the CreativeEditor SDK and its dependencies.

## Step 2: Configure Android Platform

If your existing project targets Android, you'll need to update your Android configuration:

### 2.1 Update Minimum SDK Version

Open `android/app/build.gradle.kts` and ensure your `minSdk` is set to at least 24 (update if currently lower):

```kotlin
android {
    namespace = "com.example.your_app_name"
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
        applicationId = "com.example.your_app_name"
        minSdk = 24  // Required for CE.SDK (update if currently lower)
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }
}
```

> **Note**: Apps with `minSdk = 24` or higher don't require any changes. If `minSdk` is lower than 24 in your project, update it to meet the CreativeEditor SDK requirements.

> **Note**: The `compileOptions` and `kotlinOptions` ensure compatibility with the CreativeEditor SDK and prevent common build issues.

### 2.2 Update Kotlin Version

Open `android/settings.gradle.kts` and ensure the Kotlin version is at least 1.9.10 (update if currently lower):

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id("dev.flutter.flutter-plugin-loader") version "1.0.0"
    id("com.android.application") version "8.7.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.10" apply false
}
```

> **Note**: Apps using Kotlin version 1.9.10 or higher don't require any changes. If Kotlin version is lower in your project, update it to meet the CreativeEditor SDK requirements. The Kotlin version must be compatible with your Flutter version — new Flutter project templates pin Kotlin 2, and Flutter 3.44 or later builds with Kotlin 2 even if your project pins an older version. If you enable Jetpack Compose for native customization, Kotlin 2 additionally requires the Compose Compiler Gradle plugin — see the [editor customization guide](../../user-interface/customization.md) for the setup.

### 2.3 Verify Android Configuration

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

### 2.4 Add Required Permissions

The CreativeEditor SDK requires camera and microphone access. Add these permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

> **Note**: If your app already declares these permissions, you can skip adding them again. The CreativeEditor SDK automatically uses the existing permissions. Make sure all required permissions appear in your AndroidManifest.xml file.

### 2.5 ProGuard Rules (Optional)

If you're using ProGuard for release builds, add these rules to `android/app/proguard-rules.pro`:

```proguard
# CreativeEditor SDK ProGuard rules
-keep class ly.img.** { *; }
-keep class com.example.your_app_name.** { *; }
```

## Step 3: Configure iOS Platform

If your existing project targets iOS, you'll need to update your iOS configuration:

### 3.1 iOS Dependency Management

From Flutter 3.44, the IMG.LY plugins resolve through [Swift Package Manager](https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers) — no manual dependency step is needed, and the deployment target comes from your Xcode project settings (next section).

**CocoaPods path only** (Flutter before 3.44) — open `ios/Podfile` and ensure the iOS deployment target is set to 16.0 or later:

```ruby
# Uncomment this line to define a global platform for your project
platform :ios, '16.0'
```

### 3.2 Update iOS Project Settings

The easiest way to configure iOS settings is through Xcode:

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select the Runner project
3. In the General tab, set "Minimum Deployments" to iOS 16.0 (update if currently lower)

Alternatively, you can update `ios/Flutter/AppFrameworkInfo.plist`:

```xml
<key>MinimumOSVersion</key>
<string>16.0</string>
```

> **Note**: Projects with iOS minimum deployment target 16.0 or higher don't require any changes. If the deployment target is currently lower, update it to meet the CreativeEditor SDK requirements.

### 3.3 Add Required Permissions

The CreativeEditor SDK may require certain permissions depending on which features you use. Add the relevant permissions to `ios/Runner/Info.plist` (if not already present):

```xml

<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos for editing</string>

<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for video recording and voiceovers</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to import images for editing</string>
```

> **Note**: The photo library permission is optional. By default, CE.SDK uses the system photos picker which doesn't require permissions. Only add `NSPhotoLibraryUsageDescription` if you explicitly enable full photo library access using `PhotoRollAssetSource(engine: engine, mode: .fullLibraryAccess)` in your iOS code. If your existing app already has these permissions for other features, you can update the existing permission descriptions to include the editing feature.

### 3.4 Swift Support (Required)

The CreativeEditor SDK requires Swift support. If your project doesn't already have Swift files, create a bridging header:

```bash
# Create a Swift bridging header if the project doesn't have one
touch ios/Runner/Runner-Bridging-Header.h
```

### 3.5 Verify iOS Configuration

After making changes, verify your iOS setup:

```bash
flutter clean
flutter run --release
```

## Step 4: Implement the Creative Editor

Now let's implement the CreativeEditor SDK in your existing Flutter application:

### 4.1 Create Configuration File

First, create a secure configuration file for your license key. Create `lib/secrets/secrets.dart` (if not already present):

```dart
class Secrets {
  // License key will be provided via environment variable
  static const String license =
      String.fromEnvironment("SHOWCASES_LICENSE_FLUTTER", defaultValue: "");
}
```

> **Important**: Add `lib/secrets/secrets.dart` to your `.gitignore` file to prevent accidentally committing your license key to version control.

Add this line to your `.gitignore` file (if not already present):

```
lib/secrets/secrets.dart
```

> **Note**: If your project already has a secrets configuration file, you can either update it to include the CreativeEditor SDK license key or create a separate file for this purpose.

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

### 4.2 Create the Editor Service

Create a new file `lib/services/editor_service.dart` (if not already present):

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

> **Note**: If your project already has a services directory or similar architecture, you can integrate this service into your existing service layer structure.

### 4.3 Integrate with Your Existing App

You can integrate the editor into your existing app in several ways:

#### Option A: Add a Button to Your Main Screen

Add this to any existing screen in your app:

```dart
import 'package:your_app_name/services/editor_service.dart';

// In your existing widget
ElevatedButton(
  onPressed: () async {
    try {
      await EditorService.openEditor();
    } catch (error) {
      // Handle error in your existing error handling system
      print('Failed to open editor: $error');
    }
  },
  child: Text('Open Creative Editor'),
)
```

#### Option B: Create a Dedicated Editor Screen

Create a new screen file `lib/screens/editor_screen.dart`:

```dart
import 'package:flutter/material.dart';
import '../services/editor_service.dart';

class EditorScreen extends StatefulWidget {
  @override
  _EditorScreenState createState() => _EditorScreenState();
}

class _EditorScreenState extends State<EditorScreen> {
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
        title: Text('Creative Editor'),
      ),
      body: Center(
        child: ElevatedButton(
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
          child: Text('Launch Editor'),
        ),
      ),
    );
  }
}
```

Then add it to your existing navigation:

```dart
// In your existing navigation/routing
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => EditorScreen()),
);
```

#### Option C: Integrate with Existing Workflow

If you have an existing photo/design workflow, you can integrate the editor at the appropriate point:

```dart
// Example: After user selects an image
Future<void> editSelectedImage(String imagePath) async {
  try {
    await EditorService.openEditor();
    // Handle the result and continue your existing workflow
  } catch (error) {
    // Handle error in your existing error handling system
  }
}
```

## Step 5: Test Your Integration

Now let's test your CreativeEditor SDK integration:

### 5.1 Verify Dependencies

First, ensure all dependencies are properly installed:

```bash
flutter pub get
```

### 5.2 Test on Android Device

Connect your Android device and run:

```bash
# List available devices
flutter devices

# Run on specific device (replace with your device ID)
flutter run -d your_device_id

# Or run with license key
flutter run -d your_device_id --dart-define=SHOWCASES_LICENSE_FLUTTER=your_license_key
```

### 5.3 Test on iOS Device

For iOS testing:

```bash
# Run on iOS device or simulator (dependencies resolve automatically)
flutter run
```

**CocoaPods path only** — if the build fails on pod resolution, run `cd ios && pod install` and retry.

### 5.4 Verify Features

When the app launches successfully, you should see:

1. **Your Existing App**: Your app should load normally with the new editor features
2. **Editor Integration**: The editor should open when triggered from your integration point
3. **Editor Features**: You should be able to access:
   - photo editing
   - design tools
   - other features
4. **Return to App**: After editing, you should return to your existing app

### 5.5 Common Test Scenarios

Test these scenarios to ensure everything works:

- **App Launch**: Your existing app should launch normally
- **Editor Integration**: Your editor integration point should work
- **Camera Access**: Test camera features within the editor
- **Photo Import**: Import photos from your device gallery
- **Basic Editing**: Try basic editing features like:
  - filters
  - text
  - shapes
- **Save/Export**: Test saving and exporting edited content
- **App Continuity**: Ensure your app continues to work normally after editor sessions

> **Note**: The first build may take several minutes as it compiles all native dependencies. Subsequent builds will be faster.

## Step 6: Customize for Your Use Case

The CreativeEditor SDK offers different presets for common use cases:

### 6.1 Configuration Options

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

### 6.2 Handle Editor Results

You can handle the editor results to integrate with your existing app:

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
Because your_app_name depends on imgly_editor x.xx.x which doesn't match any versions, version solving failed.
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

**Error:**

```
NDK version mismatch
```

**Solution:** Update the `ndkVersion` in `android/app/build.gradle.kts` to `"27.0.12077973"`.

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

1. Ensure you have a valid license key from [IMG.LY](https://img.ly/forms/contact-sales/) (or pass `null` for evaluation mode with watermark).
2. Verify the license key is correctly configured in your `lib/secrets/secrets.dart` file.
3. Check that the license key is for the correct platform (Flutter).
4. Ensure there are no extra spaces or characters in the license key.
5. Make sure you're passing the license key with `--dart-define=SHOWCASES_LICENSE_FLUTTER=your_key`.

#### 5. Existing App Conflicts

**Error:**

```
Conflicting dependencies
```

**Solution:**

1. Check for any conflicting dependencies in your existing `pubspec.yaml`.
2. Update conflicting packages to compatible versions.
3. Run `flutter pub deps` to analyze dependency conflicts.

## Next Steps

Now that you have successfully integrated the CreativeEditor SDK into your existing Flutter project, you can:

1. **Customize the Integration**: Adapt the editor integration to fit your app's specific workflow
2. **Handle Results**: Implement proper result handling for your app's use case
3. **Add More Features**: Explore advanced features like custom presets and configurations
4. **Optimize Performance**: Fine-tune the integration for your app's performance requirements
5. **Add Analytics**: Track editor usage and user engagement
6. **Implement Caching**: Add caching for better user experience

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

## Support

If you encounter any issues or need assistance:

- Check the [troubleshooting section](./existing-project.md#troubleshooting) above
- Review the [Flutter examples](https://github.com/imgly/cesdk-flutter-examples) for working implementations
- Contact [IMG.LY support](https://img.ly/support) for technical assistance

Congratulations! You've successfully integrated the CreativeEditor SDK into your existing Flutter application. Your app now has powerful creative editing capabilities that work seamlessly on both Android and iOS platforms.



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support