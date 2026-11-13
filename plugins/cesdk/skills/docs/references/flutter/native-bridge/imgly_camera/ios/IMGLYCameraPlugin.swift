import AVFoundation
import Flutter
import IMGLYCamera
import UIKit

public class IMGLYCameraPlugin: NSObject, FlutterPlugin {
  // MARK: - Typealias

  /// A closure to specify a `CameraBuilder.Builder` based on a given `metadata`.
  public typealias CameraBuilderClosure = (_ metadata: [String: Any]?) -> CameraBuilder.Builder

  // MARK: - Static

  /// Optional builder closure for customizing camera UI.
  public static var builderClosure: CameraBuilderClosure?

  // MARK: - FlutterPlugin

  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "imgly_camera", binaryMessenger: registrar.messenger())
    registrar.addMethodCallDelegate(IMGLYCameraPlugin(), channel: channel)
  }

  // MARK: - Private

  private var presentingVC: UIViewController?

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    guard call.method == "openCamera" else {
      result(FlutterMethodNotImplemented)
      return
    }

    guard
      let args = call.arguments as? [String: Any],
      let settingsDict = args["settings"] as? [String: Any],
      let settings = CameraSettings.fromDictionary(settingsDict)
    else {
      result(FlutterError(code: "INVALID_ARGUMENTS",
                          message: "Missing settings / license",
                          details: nil))
      return
    }

    let videoURL = (args["video"] as? String).flatMap(URL.init(string:))
    let metadata = args["metadata"] as? [String: Any]

    let builder = Self.builderClosure?(metadata) ?? CameraBuilder.default()

    presentingVC = builder(settings, videoURL, metadata) { [weak self] buildResult in
      DispatchQueue.main.async {
        switch buildResult {
        case let .success(cameraResult):
          result(cameraResult?.toDictionary() ?? [:])

        case let .failure(error as CameraError):
          if error == .cancelled {
            result(nil)
          } else {
            result(FlutterError(code: "CAMERA_ERROR",
                                message: error.localizedDescription,
                                details: nil))
          }

        case let .failure(error):
          result(FlutterError(code: "UNKNOWN_ERROR",
                              message: error.localizedDescription,
                              details: nil))
        }

        self?.presentingVC?.presentingViewController?.dismiss(animated: true)
      }
    }

    if
      let vc = presentingVC,
      let root = UIApplication.shared
      .connectedScenes
      .compactMap({ $0 as? UIWindowScene })
      .first(where: { $0.activationState == .foregroundActive })?
      .windows
      .first(where: \.isKeyWindow)?
      .rootViewController {
      vc.modalPresentationStyle = .fullScreen
      root.present(vc, animated: true)
    }
  }
}
