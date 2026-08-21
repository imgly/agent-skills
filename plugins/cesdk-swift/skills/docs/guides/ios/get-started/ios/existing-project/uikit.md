> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

---

This guide walks you through integrating the CE.SDK into an existing UIKit app. In this example, we'll assume your app has a `UIButton` or `UITableViewRow` that when selected, presents the editor full screen.

## Requirements

To work with the SDK, you'll need:

- A Mac running a recent version of [Xcode](https://developer.apple.com/xcode/)
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial))
- Your application project

## Add the CE.SDK Swift package

**1.** With your project open, use the `File` menu to select `Add Package Dependencies...`

![Screen grab of the dependencies menu option](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/dependencies-menu.png)

**2.** Copy the package URL and add it to the Search field at the top right of the modal

https://github.com/imgly/IMGLYUI-swift

![Image of the packages modal screen](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/add-package.png)

**3.** Once you see the IMGLY UI package in the window, click `Add Package`

**4.** After downloading the package and its dependencies, you'll be presented with a list of libraries. For this demo choose the `IMGLYUI` library to add to your project target. This adds all of the capabilities of the SDK to your project. In a production app, you would select only those libraries that contain the functions you want to help conserve app space.

![Image of the list of packages](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/add-package-to-target.png)

## Add Code to Use the CE.SDK

**1.** Open the View Controller of your app that will launch the editor. This demo will use the "Design Editor" features of the SDK, so at the top of your View Controller with the other `import` statements, add these lines

```swift
import IMGLYEditor
import SwiftUI
```

**2.** Create the control to launch the editor. It might be a button or table row or tab. As long as the element can trigger an action it should work.

**3.** Add code to the element's action to launch the editor.

```swift
//Create an engine for the editor
let engineSettings = EngineSettings(license: "<your license key>", // pass nil for evaluation mode with watermark,
                                     userID: "<your unique user id>")

//initialize an editor with the engine settings, wrapped in a Navigation aware container
let editorVC = UIHostingController(rootView:
  NavigationView {
    Editor(engineSettings)
      .imgly.configuration { DesignEditorConfiguration() }
  }
  .navigationViewStyle(.stack)
)

//set the presentation style to full screen
editorVC.modalPresentationStyle = .fullScreen

//present the editor from the current view controller
present(editorVC, animated: true)
```

> The editor must be presented in a navigation-aware container like `NavigationView`. This ensures proper toolbar rendering.

Now select an iOS device or a Simulator and Build and Run.

## Using the Editor in Your App

Navigate to the view with the control you built to launch the editor and tap it. When the editor launches you'll see a blank page with a toolbar at the bottom. Use the different buttons to add assets to your creation. You can add pages to your creation using the button in the top toolbar. Once you're happy with it, use the share button to export your creation as a pdf.

![Simulator screens running the demo app](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/hello-world.png)

## Troubleshooting

Here are some issues you may encounter and their causes. If you need additional help, you can [visit our support page](https://img.ly/company/contact-us).

- Xcode does not know about the `EngineSettings` or `Editor`.
  ![Import error message](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/import-error.png)

Make sure that every Swift file that needs to interact with the editor has an `import` statement before the first line of code. Like this one, for example `import IMGLYEditor`

- You get build errors about missing modules.
  ![Examples of build errors](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/missing-package.png)

Make sure that you didn't accidentally choose the wrong target when you imported the SDK to your project. You can check a target's imports on the `General` tab of the target settings.

![Screen shot showing the settings pane with the right imports](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/check-import.png)

If you don't see the SDK, you can add it using the `+` button at the bottom of the list.

- When you run the application, you get an error message about the license key:

![Modal of the error for a missing license](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/license-error.png)

Make sure that your `EngineSettings` has the exact license key with matching capitalization and that your app bundle id matches the license key. If you don't have a license you can [register for a free trial](https://img.ly/forms/free-trial) to get a demonstration license.

- When you run the demo app you don't get any errors, but have a blank top bar and are missing controls.
  ![Simulator screen with no top controls](https://img.ly/docs/cesdk/ios/get-started/ios/existing-project/uikit-v9890b/assets/missing-controls.png)

Make sure that the code that instantiates your `Editor` is wrapped in some kind of navigation view, like a `NavigationView` and also `UIHostingController`. Don't place it at the root of the view hierarchy.

Don't do this:

```swift
let editor = Editor(engineSettings)
  .imgly.configuration { DesignEditorConfiguration() }
let editorVC = UIHostingController(rootView: editor)
present(editorVC, animated: true)
```

Instead, wrap it in a `NavigationView` as shown above.

### What's Next?

Now that your integration is working, you can explore more advanced features like custom templates, user uploads, and localized UI. Check out our [documentation site](https://img.ly/docs) for more tutorials and guides.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support