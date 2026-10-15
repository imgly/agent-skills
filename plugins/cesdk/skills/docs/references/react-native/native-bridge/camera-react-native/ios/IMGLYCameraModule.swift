import IMGLYCamera
import UIKit

/// The iOS implementation for the `@imgly/camera-react-native` native React Native module.
@objc(IMGLYCameraModuleSwiftAdapter) @objcMembers public class IMGLYCameraModuleSwiftAdapter: NSObject {
  // MARK: - Typealias

  /// A closure to specify an `CameraBuilder.Builder` based on a given `metadata`.
  public typealias CameraBuilderClosure = (_ metadata: [String: Any]?) -> CameraBuilder.Builder

  // MARK: - Properties

  /// The shared instance.
  public static var shared = IMGLYCameraModuleSwiftAdapter()

  /// The `CameraBuilderClosure` to use for UI creation.
  public var cameraBuilderClosure: CameraBuilderClosure?

  /// The `UIViewController` hosting the editor.
  private var presentationController: UIViewController?

  /// Opens the camera.
  /// - Parameters:
  ///   - settings: The `CameraSettings` containing all relevant information for the editor.
  ///   - video: The source of the video to react to.
  ///   - metadata: Any custom metadata used for the `CameraBuilder.Builder`.
  ///   - completion: The completion handler to execute once the camera failed, cancelled or exported.
  public func openCamera(
    settings: CameraSettings,
    video: String?,
    metadata: [String: Any]?,
    completion: @escaping (_ result: CameraResult?, _ error: NSError?) -> Void,
  ) {
    var videoURL: URL?
    if let video {
      if let sourceUrl = URL(string: video), sourceUrl.scheme != nil {
        videoURL = sourceUrl
      } else {
        completion(nil, nil)
      }
    }

    let builder = cameraBuilderClosure?(metadata) ?? CameraBuilder.default()
    presentationController = builder(settings, videoURL, metadata) { [weak self] result in
      DispatchQueue.main.async {
        switch result {
        case let .success(artifact):
          completion(artifact, nil)
        case let .failure(error):
          switch error {
          case CameraError.cancelled:
            completion(nil, nil)
          default:
            completion(nil, error as NSError)
          }
        }
        self?.presentationController?.presentingViewController?.dismiss(animated: true)
      }
    }
    presentationController?.modalPresentationStyle = .fullScreen
    if let presentationController, let windowScene = UIApplication.shared.connectedScenes
      .filter({ $0.activationState == .foregroundActive })
      .first as? UIWindowScene {
      if let rootViewController = windowScene.windows
        .filter(\.isKeyWindow).first?.rootViewController {
        // Walk up the presentation chain to the topmost view controller.
        // Presenting on a VC that is already presenting another VC silently
        // no-ops in UIKit, which leaves the SDK Promise hanging forever when
        // the host app uses react-native-screens / Expo Router / RN <Modal>.
        var topViewController: UIViewController = rootViewController
        while let presented = topViewController.presentedViewController {
          topViewController = presented
        }
        topViewController.present(presentationController, animated: true, completion: nil)
      }
    }
  }
}
