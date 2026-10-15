import Foundation
#if canImport(IMGLYCameraModuleObjC)
  // Swift Package Manager builds the Objective-C++ bridge as a separate target.
  // Under CocoaPods both languages share one module, so no import is needed.
  import IMGLYCameraModuleObjC
#endif

/// The Swift implementation behind the Objective-C++ React Native bridge.
///
/// The bridge resolves this class at runtime by its stable Objective-C name
/// (see `IMGLYCameraModuleImplementationProvider`), so no static
/// Objective-C → Swift reference exists. This is what allows building the
/// module with Swift Package Manager, which cannot compile mixed
/// Swift/Objective-C++ targets (SE-0403).
@objc(IMGLYCameraModuleDefaultImplementation)
final class IMGLYCameraModuleDefaultImplementation: NSObject, IMGLYCameraModuleImplementation {
  func openCamera(
    withSettings settings: [AnyHashable: Any],
    video: String?,
    metadata: [AnyHashable: Any]?,
    resolve: @escaping IMGLYCameraResolveBlock,
    reject: @escaping IMGLYCameraRejectBlock,
  ) {
    guard let settings = settings as? [String: Any],
          let cameraSettings = CameraSettings.fromDictionary(settings) else {
      reject("E_PARSING", "Unable to parse the argument(s): ", nil)
      return
    }
    let metadata = metadata as? [String: Any]

    DispatchQueue.main.async {
      IMGLYCameraModuleSwiftAdapter.shared.openCamera(
        settings: cameraSettings,
        video: video,
        metadata: metadata,
      ) { result, error in
        if let result {
          resolve(result.toDictionary())
        } else if let error {
          reject("E_RECORDING_FAILED", "The recording failed due to: ", error)
        } else {
          resolve(NSNull())
        }
      }
    }
  }
}
