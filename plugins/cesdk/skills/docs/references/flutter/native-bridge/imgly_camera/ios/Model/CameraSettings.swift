import Foundation

/// A struct containing all necessary settings to setup the camera.
@objc @objcMembers public class CameraSettings: NSObject, Codable {
  /// The license key. Pass `nil` to run the SDK in evaluation mode with a watermark.
  public let license: String?

  /// The id of the current user.
  public let userId: String?

  /// Optional camera configuration. When `nil`, native defaults apply.
  public let configuration: CameraConfiguration?

  /// Creates a new instance from a given dictionary.
  ///
  /// - Parameters:
  ///   - dictionary: The dictionary to convert the instance from.
  /// - Returns: The `CameraSettings` instance.
  public static func fromDictionary(_ dictionary: [String: Any]) -> CameraSettings? {
    do {
      let data = try JSONSerialization.data(withJSONObject: dictionary, options: [])
      return try JSONDecoder().decode(CameraSettings.self, from: data)
    } catch {
      print("Error decoding dictionary: \(error)")
      return nil
    }
  }
}

/// Camera configuration options forwarded from the Dart layer.
@objc @objcMembers public class CameraConfiguration: NSObject, Codable {
  /// The kind of media the camera captures (`"photo"`, `"video"`, `"mixed"`).
  public let captureType: String?

  /// How many captures the session produces (`"single"`, `"multi"`).
  public let captureCount: String?

  /// The duration in seconds stamped on each captured photo.
  public let photoClipDuration: Double?
}
