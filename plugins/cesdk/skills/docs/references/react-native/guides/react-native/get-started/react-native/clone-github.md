> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart Expo](./new-project-a1234y.md)

---

This comprehensive guide walks you through cloning and running the CE.SDK
official React Native Expo sample project, which includes complete
CreativeEditor SDK (CE.SDK) integration examples. By the end, you'll have a
fully functional React Native Expo application with multiple editor examples
running on your device.

## Who Is This Guide For?

This guide is for developers who:

- Want to explore working CreativeEditor SDK examples before implementing in their own project
- Need to understand different integration patterns and use cases
- Want to test the CreativeEditor SDK features with minimal setup
- Are looking for reference implementations to learn from
- Want to quickly get started with a pre-configured React Native Expo project
- Prefer using Expo for React Native development

## What You'll Achieve

By following this guide, you will:

- Clone the official IMG.LY React Native examples repository
- Set up the project with your license key
- Run multiple CreativeEditor SDK examples on your device
- Explore different editor presets and configurations
- Understand common integration patterns
- Have a working reference implementation to learn from

[View on GitHub](https://github.com/imgly/cesdk-react-native-examples)

[Explore React Native Demos](https://img.ly/showcases/cesdk/?tags=react-native)

## Prerequisites

Before you begin, ensure you have the following requirements:

### Development Environment

- **Node.js**: 22.0 or later
- **React Native**: 0.73 or later
- **Expo CLI**: Latest version
- **Android Studio** or **VS Code** with React Native extensions
- **Git CLI** for version control

### Platform Requirements

- **iOS**: 16.0+ (Xcode $XCODE\_VERSION$+, Swift $SWIFT\_VERSION$+)
- **Android**: 7.0+ (API level 24+)

### License

- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial)), pass `null` to run in evaluation mode with watermark.

### Verify Your Setup

Run the following command to verify your React Native installation:

```bash
npx react-native --version
```

This command checks your React Native installation and reports any issues to resolve before proceeding.

> **Note:** Always use native code when customizing the CreativeEditor SDK for React Native (Swift/Kotlin), and refer to the [configuration overview section](../../user-interface/customization.md).

## Step 1: Clone the GitHub Repository

First, navigate to your preferred working directory:

```bash
# Navigate to your preferred directory
cd ~/Downloads  # or any directory of your choice
```

Clone the official IMG.LY React Native examples repository:

```bash
git clone https://github.com/imgly/cesdk-react-native-examples.git
cd cesdk-react-native-examples
```

### Repository Structure

The cloned repository contains:

```
cesdk-react-native-examples/
├── showcases/           # Main React Native app with multiple examples
├── shared/             # Shared configuration files
├── scripts/            # Build and deployment scripts
├── fastlane/           # CI/CD configuration
├── README.md           # Project documentation
├── package.json        # React Native dependencies
└── app.json            # Expo configuration
```

## Step 2: Configure Your License Key

The examples require a valid CreativeEditor SDK license key to function.

### 2.1 Locate the Secrets File

Navigate to the main React Native app directory:

```bash
cd showcases
```

The license configuration is in `src/secrets/secrets.ts`:

```typescript title="secrets.ts"
export class Secrets {
  // Enter your license here.
  static license = String.fromEnvironment("SHOWCASES_LICENSE_REACT_NATIVE", defaultValue: "");
}
```

### 2.2 Set Your License Key

You have two options for setting your license key:

**Option A: Direct in secrets file (for testing)**
Since this is a cloned repository for testing, you can add your license key directly:

```typescript title="secrets.ts"
export class Secrets {
  // Enter your license here.
  static license = String.fromEnvironment("SHOWCASES_LICENSE_REACT_NATIVE", defaultValue: "your_actual_license_key_here");
}
```

**Option B: Environment variable (recommended)**
Pass the license key as an environment variable when running:

```bash
EXPO_PUBLIC_SHOWCASES_LICENSE_REACT_NATIVE=your_actual_license_key_here npx expo start
```

> **Security Note**: For production projects, always use environment variables or secure key management systems. Direct key placement is only recommended for testing and learning purposes.

## Step 3: Install Dependencies

Install the React Native dependencies:

<Install />

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
gradle clean
cd ..
```

### 4.2 iOS Configuration

The iOS configuration is already set up with:

- Deployment target: 16.0
- Framework linkage: dynamic (useFrameworks)
- Required permissions (camera, microphone)
- Swift support

Install iOS dependencies:

```bash
cd ios
pod install
cd ..
```

## Step 5: Run the Examples

Now you can run the React Native examples on your device:

### 5.1 List Available Devices

```bash
npx expo start
```

This command shows available devices and simulators.

### 5.2 Run on Android Device

```bash
# Run with license key
EXPO_PUBLIC_SHOWCASES_LICENSE_REACT_NATIVE=your_actual_license_key_here npx expo start --android

# Or run on specific device
EXPO_PUBLIC_SHOWCASES_LICENSE_REACT_NATIVE=your_actual_license_key_here npx expo start --android -d your_device_id
```

### 5.3 Run on iOS Device

```bash
# Run with license key
EXPO_PUBLIC_SHOWCASES_LICENSE_REACT_NATIVE=your_actual_license_key_here npx expo start --ios

# Or run on specific device
EXPO_PUBLIC_SHOWCASES_LICENSE_REACT_NATIVE=your_actual_license_key_here npx expo start --ios -d your_device_id
```

## Step 6: Explore the Examples

The React Native examples app includes multiple showcases demonstrating different CreativeEditor SDK features:

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
showcases/
├── App.tsx                 # App entry point
├── src/
│   ├── secrets/
│   │   └── secrets.ts      # License key configuration
│   ├── services/
│   │   └── editorService.ts # Editor integration service
│   ├── screens/
│   │   └── showcases/      # Example screens
│   └── components/         # Reusable UI components
├── app.json                # Expo configuration
└── package.json            # Dependencies
```

### 7.2 Integration Patterns

The examples show different integration approaches:

- **Service-based integration**: Centralized editor service
- **Screen-specific integration**: Direct integration in screens
- **Preset variations**: Different editor configurations
- **Result handling**: Common ways to process editor results

### 7.3 Key Implementation Details

Study these important aspects:

- **License Management**: How license keys are handled securely
- **Error Handling**: Comprehensive error handling patterns
- **State Management**: How app state is managed during editor sessions
- **Platform Configuration**: Expo build properties and native setup
- **UI Integration**: How the editor integrates with React Native UI

## Troubleshooting

### Common Issues and Solutions

#### 1. License Key Errors

**Error:**

```
Invalid license key
```

**Solution:**

1. Ensure you have a valid license key from [IMG.LY](https://img.ly/forms/free-trial) (or pass `null` for evaluation mode with watermark)
2. Verify the license key is correctly set in `src/secrets/secrets.ts`
3. Check that the license key is for the correct platform (React Native)
4. Ensure there are no extra spaces or characters in the license key
5. Make sure you're passing the license key with `EXPO_PUBLIC_SHOWCASES_LICENSE_REACT_NATIVE=your_key`

#### 2. Build Errors

**Error:**

```
Dependencies not found
```

**Solution:**

1. Run `npm install`/`yarn`/`pnpm install` to install dependencies
2. Check your internet connection
3. Verify React Native version compatibility

#### 3. Platform-Specific Issues

**Android Issues:**

```bash
cd android
gradle clean
cd ..
npx expo start --android
```

**iOS Issues:**

```bash
cd ios
pod install
cd ..
npx expo start --ios
```

#### 4. Device Connection Issues

**Error:**

```
No devices found
```

**Solution:**

1. Ensure your device is connected and unlocked
2. Enable USB debugging (Android) or trust the computer (iOS)
3. Run `npx expo start` to verify device detection

#### 5. Expo Build Issues

**Error:**

```
Prebuild failed
```

**Solution:**

1. Clean your project: `npx expo prebuild --clean`
2. Check that all plugins are properly configured in `app.json`
3. Verify your Expo SDK version is compatible

#### 6. TypeScript Errors

**Error:**

```
TypeScript compilation errors
```

**Solution:**

1. Check that all TypeScript dependencies are installed
2. Verify TypeScript version compatibility
3. Run `npx tsc --noEmit` to check for type errors

## Next Steps

Now that you have the examples running, you can:

1. **Study the Code**: Examine the implementation patterns in the examples
2. **Test Features**: Try different editor presets and configurations
3. **Customize Examples**: Modify the examples to test your own use cases
4. **Integrate into Your Project**: Use the examples as reference for your own implementation
5. **Explore Advanced Features**: Test advanced editing capabilities

### Related Guides

- **[New Project Setup](./new-project-a1234y.md)**: Create a new React Native project with CreativeEditor SDK
- **[Existing Project Integration](./existing-project-b4312d.md)**: Add CreativeEditor SDK to your existing React Native app
- **[Configuration Guide](../../configuration.md)**: Learn about advanced configuration options

## Additional Resources

- [CreativeEditor SDK Documentation](https://img.ly/docs/cesdk/)
- [React Native Examples Repository](https://github.com/imgly/cesdk-react-native-examples)

## Support

If you encounter any issues or need assistance:

- Check the [troubleshooting section](#troubleshooting) above
- Review the [GitHub repository issues](https://github.com/imgly/cesdk-react-native-examples/issues)
- Contact [IMG.LY support](https://img.ly/support) for technical assistance

Congratulations! You've successfully cloned and are running the official CreativeEditor SDK React Native examples. You now have a comprehensive reference implementation to learn from and test available CreativeEditor SDK features.



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support