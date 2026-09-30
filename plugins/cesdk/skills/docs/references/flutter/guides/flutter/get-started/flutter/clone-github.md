> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart Flutter](./new-project.md)

---

This comprehensive guide walks you through cloning and running the CE.SDK
official Flutter sample project, which includes complete CreativeEditor SDK
(CE.SDK) integration examples. By the end, you'll have a fully functional
Flutter application with multiple editor examples running on your device.

## Who Is This Guide For?

This guide is for developers who:

- Want to explore working CreativeEditor SDK examples before implementing in their own project
- Need to understand different integration patterns and use cases
- Want to test the CreativeEditor SDK features with minimal setup
- Are looking for reference implementations to learn from
- Want to quickly get started with a pre-configured Flutter project

## What You'll Achieve

By following this guide, you will:

- Clone the official IMG.LY Flutter examples repository
- Set up the project with your license key
- Run multiple CreativeEditor SDK examples on your device
- Explore different editor presets and configurations
- Understand common integration patterns
- Have a working reference implementation to learn from

[View on GitHub](https://github.com/imgly/cesdk-flutter-examples)

[Explore Flutter Demos](https://img.ly/showcases/cesdk/?tags=flutter)

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

## Step 1: Clone the GitHub Repository

First, navigate to your preferred working directory:

```bash
# Navigate to your preferred directory
cd ~/Downloads  # or any directory of your choice
```

Clone the official IMG.LY Flutter examples repository:

```bash
git clone https://github.com/imgly/cesdk-flutter-examples.git
cd cesdk-flutter-examples
```

### Repository Structure

The cloned repository contains:

```
cesdk-flutter-examples/
├── showcases/           # Main Flutter app with multiple examples
├── shared/             # Shared configuration files
├── scripts/            # Build and deployment scripts
├── fastlane/           # CI/CD configuration
├── README.md           # Project documentation
└── pubspec.yaml        # Flutter dependencies
```

## Step 2: Configure Your License Key

The examples require a valid CreativeEditor SDK license key to function.

### 2.1 Locate the Secrets File

Navigate to the main Flutter app directory:

```bash
cd showcases
```

The license configuration is in `lib/secrets/secrets.dart`:

```dart
class Secrets {
  // Enter your license here.
  static const String license =
      String.fromEnvironment("SHOWCASES_LICENSE_FLUTTER", defaultValue: "");
}
```

### 2.2 Set Your License Key

You have two options for setting your license key:

**Option A: Direct in secrets file (for testing)**
Since this is a cloned repository for testing, you can add your license key directly:

```dart
class Secrets {
  // Enter your license here.
  static const String license =
      String.fromEnvironment("SHOWCASES_LICENSE_FLUTTER", defaultValue: "your_actual_license_key_here");
}
```

**Option B: Environment variable (recommended)**
Pass the license key as an environment variable when running:

```bash
flutter run --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here
```

> **Security Note**: For production projects, always use environment variables or secure key management systems. Direct key placement is only recommended for testing and learning purposes.

## Step 3: Install Dependencies

Install the Flutter dependencies:

```bash
flutter pub get
```

This downloads and installs all required packages, including the CreativeEditor SDK.

## Step 4: Configure Platform-Specific Settings

The repository includes pre-configured platform settings, but you may need to verify them:

### 4.1 Android Configuration

The Android configuration is already set up with:

- Minimum SDK: 24
- Kotlin version: 1.9.10
- IMG.LY Maven repository
- Required permissions

Verify the configuration by running:

```bash
cd android
./gradlew clean
cd ..
```

### 4.2 iOS Configuration

The iOS configuration is already set up with:

- Deployment target: 16.0
- Required permissions (camera, microphone)
- Swift support

On Flutter 3.44 or later the IMG.LY plugins resolve through [Swift Package Manager](https://docs.flutter.dev/packages-and-plugins/swift-package-manager/for-app-developers) automatically during the build — no manual dependency step is needed.

**CocoaPods path only** (Flutter before 3.44) — install the pods:

```bash
cd ios
pod install
cd ..
```

## Step 5: Run the Examples

Now you can run the Flutter examples on your device:

### 5.1 List Available Devices

```bash
flutter devices
```

### 5.2 Run on Android Device

```bash
# Run with license key
flutter run --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here

# Or run on specific device
flutter run -d your_device_id --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here
```

### 5.3 Run on iOS Device

```bash
# Run with license key
flutter run --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here

# Or run on specific device
flutter run -d your_device_id --dart-define=SHOWCASES_LICENSE_FLUTTER=your_actual_license_key_here
```

## Step 6: Explore the Examples

The Flutter examples app repository includes multiple showcases demonstrating different CreativeEditor SDK features:

### 6.1 Available Examples

The app contains examples for:

- **Photo Editing**: Basic photo editing with filters and adjustments
- **Design Creation**: Full-featured design editor for creating graphics
- **Video Editing**: Video processing and editing capabilities
- **Apparel Design**: T-shirt and merchandise design tools
- **Postcard Design**: Greeting cards and postcard creation

### 6.2 Navigation

- Use the app's navigation to explore different examples
- Each example demonstrates specific CreativeEditor SDK features
- Tap on examples to launch the editor with different presets
- Test available editing capabilities and workflows

### 6.3 Learning from Examples

Study the example implementations to understand:

- How to integrate the CreativeEditor SDK
- Different preset configurations
- Result handling patterns
- Error handling approaches
- UI integration patterns

## Step 7: Understand the Code Structure

The examples demonstrate best practices for CreativeEditor SDK integration:

### 7.1 Key Files to Study

```
lib/
├── main.dart              # App entry point
├── secrets/
│   └── secrets.dart       # License key configuration
├── services/
│   └── editor_service.dart # Editor integration service
├── screens/
│   └── showcases/         # Example screens
└── widgets/               # Reusable UI components
```

### 7.2 Integration Patterns

The examples show different integration approaches:

- **Service-based integration**: Centralized editor service
- **Screen-specific integration**: Direct integration in screens
- **Preset variations**: Different editor configurations
- **Result handling**: Common ways to process editor results

## Troubleshooting

### Common Issues and Solutions

#### 1. License Key Errors

**Error:**

```
Invalid license key
```

**Solution:**

1. Ensure you have a valid license key from [IMG.LY](https://img.ly/forms/free-trial) (or pass `null` for evaluation mode with watermark)
2. Verify the license key is correctly set in `lib/secrets/secrets.dart`
3. Check that the license key is for the correct platform (Flutter)
4. Ensure there are no extra spaces or characters in the license key

#### 2. Build Errors

**Error:**

```
Dependencies not found
```

**Solution:**

1. Run `flutter pub get` to install dependencies
2. Check your internet connection
3. Verify Flutter version compatibility

#### 3. Platform-Specific Issues

**Android Issues:**

```bash
cd android
./gradlew clean
cd ..
flutter run
```

**iOS Issues:**

```bash
flutter clean
flutter run
```

**CocoaPods path only** — if the build fails on pod resolution, run `cd ios && pod install` and retry.

#### 4. Device Connection Issues

**Error:**

```
No devices found
```

**Solution:**

1. Ensure your device is connected and unlocked
2. Enable USB debugging (Android) or trust the computer (iOS)
3. Run `flutter devices` to verify device detection

## Next Steps

Now that you have the examples running, you can:

1. **Study the Code**: Examine the implementation patterns in the examples
2. **Test Features**: Try different editor presets and configurations
3. **Customize Examples**: Modify the examples to test your own use cases
4. **Integrate into Your Project**: Use the examples as reference for your own implementation
5. **Explore Advanced Features**: Test advanced editing capabilities

### Related Guides

- **[New Project Setup](./new-project.md)**: Create a new Flutter project with CreativeEditor SDK
- **[Existing Project Integration](./existing-project.md)**: Add CreativeEditor SDK to your existing Flutter app
- **[Configuration Guide](../../configuration.md)**: Learn about advanced configuration options

## Support

If you encounter any issues or need assistance:

- Check the [troubleshooting section](./existing-project.md#troubleshooting) above
- Review the [Flutter examples](https://github.com/imgly/cesdk-flutter-examples) for working implementations
- Contact [IMG.LY support](https://img.ly/support) for technical assistance

Congratulations! You've successfully cloned and are running the official CreativeEditor SDK Flutter examples. You now have a comprehensive reference implementation to learn from and test various CreativeEditor SDK features.



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support