> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Prebuilt XCFramework](./create-prebuilt-xcframework.md)

---

This guide walks you through compiling the IMGLYUI Swift dependency and its dependencies into a XCFramework usable for Xcode builds without internet access or Swift Package Manager access.

## Requirements

To work with the SDK, you'll need:

- A Mac running a recent version of [Xcode](https://developer.apple.com/xcode/)
- macOS Tahoe (26) or newer, as required by Scipio
- Your application project for reference

## Install [Scipio](https://github.com/giginet/Scipio)

We will make use of the [Scipio](https://github.com/giginet/Scipio) tool, which automates the process of building XCFrameworks from Swift Package Manager dependencies.

You can install Scipio with standard Swift package management tools such as [nest](https://github.com/mtj0928/nest), [Mint](https://github.com/yonaskolb/Mint) or directly from source:

```bash
nest install giginet/Scipio
scipio --help
# Or
mint install giginet/Scipio
mint run scipio --help
# Or
git clone https://github.com/giginet/Scipio.git
cd Scipio
swift run -c release scipio --help
```

## Prepare a dummy Swift Package Manager project to pull in all the dependencies for precompilation

First, create an empty directory somewhere and create a `Package.swift` file inside with the following contents:

```swift
// swift-tools-version: $SWIFT_VERSION$
// swift-tools-version: $SWIFT_VERSION$
import PackageDescription

// Dummy package to bundle dependencies as a precompiled XCFramework
let package = Package(
  name: "DummyApp",
  // Match the app target version here
  platforms: [.iOS(.v16)],
  products: [
    .library(name: "DummyApp", targets: ["DummyApp"])
  ],
  // Custom dependencies can be added here
  dependencies: [
    .package(url: "https://github.com/imgly/IMGLYUI-swift.git", exact: "1.83.0-nightly.20260904"),
    // If you use these libraries in your app, make sure to match exact versions here
    .package(url: "https://github.com/siteline/SwiftUI-Introspect.git", exact: "26.0.0"),
    .package(url: "https://github.com/onevcat/Kingfisher.git", exact: "8.5.0"),
  ],
  targets: [
    .target(
      name: "DummyApp",
      // Make sure to add any custom packages to the list here too
      dependencies: [.product(name: "IMGLYUI", package: "IMGLYUI-swift")]
    )
  ]
)
```

You can tweak the dependency lists and versions as needed to precompile all your project dependencies into XCFramework bundles.

Then, create an empty source file in `Sources/DummyApp/DummyApp.swift` to match the package definition.

Make sure the Swift package builds by running `xcodebuild` in the package directory:

```bash
xcodebuild -scheme DummyApp -destination 'platform=iOS Simulator,arch=arm64,OS=26.0,name=iPhone SE (3rd generation)' build
```

## Compile XCFrameworks for all the dependencies with Scipio

Run the following command to create a [mergeable](https://developer.apple.com/documentation/xcode/configuring-your-project-to-use-mergeable-libraries) XCFramework for every dependency of the project: (including transitive dependencies)

```bash
scipio prepare --support-simulators --framework-type mergeable --enable-library-evolution --overwrite
```

## Use the resulting XCFrameworks

The resulting frameworks are located in the `XCFrameworks` subdirectory by default, and can be added to Xcode projects as dependencies.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support