import IMGLYCamera
import SwiftUI

public enum CameraBuilder {
  /// A closure used to return a `Result<CameraResult?, Error>` from the camera.
  public typealias CameraBuilderResult = (Result<CameraResult?, Error>) -> Void

  /// Closure allowing to return a custom UI based on various input.
  /// - Parameters:
  ///   - settings: The `CameraSettings`.
  ///   - url: The `URL` of the video to react to.
  ///   - metadata: The metadata.
  ///   - result: The `CameraBuilderResult` used to return a result.
  /// - Returns: A `UIViewController`.
  public typealias Builder = (
    _ settings: CameraSettings,
    _ url: URL?,
    _ metadata: [String: Any]?,
    _ result: @escaping CameraBuilderResult,
  ) -> UIViewController

  /// The default camera implementation.
  public static func `default`() -> Builder {
    { settings, url, _, result in
      @ViewBuilder func camera(settings: CameraSettings, result: @escaping CameraBuilderResult) -> some View {
        ModalCamera(settings: settings, result: result, url: url)
      }
      return UIHostingController(rootView: camera(settings: settings, result: result))
    }
  }

  /// A custom camera implementation.
  /// - Parameter contentProvider: Used to provide a custom view.
  /// - Returns: A `Builder` providing the custom view.
  public static func custom(_ contentProvider: @escaping (
    _ settings: CameraSettings,
    _ url: URL?,
    _ metadata: [String: Any]?,
    _ result: @escaping CameraBuilderResult,
  ) -> some View) -> Builder {
    { settings, preset, metadata, result in
      UIHostingController(rootView: contentProvider(settings, preset, metadata, result))
    }
  }
}

extension CameraBuilder {
  /// Generates `EngineSettings` based on an `CameraSettings`.
  /// - Parameter settings: The `CameraSettings`.
  /// - Returns: The derived `EngineSettings`.
  private static func engineSettings(for settings: CameraSettings) -> EngineSettings {
    EngineSettings(license: settings.license, userID: settings.userId)
  }

  /// Builds a native `IMGLYCamera.CameraConfiguration` from the bridged config dict.
  /// Missing or unknown fields fall back to the native defaults.
  private static func nativeConfiguration(
    from configuration: CameraConfiguration?,
  ) -> IMGLYCamera.CameraConfiguration {
    IMGLYCamera.CameraConfiguration(
      captureType: nativeCaptureType(configuration?.captureType),
      captureCount: nativeCaptureCount(configuration?.captureCount),
      photoClipDuration: configuration?.photoClipDuration ?? 5,
    )
  }

  private static func nativeCaptureType(_ raw: String?) -> IMGLYCamera.CaptureType {
    switch raw {
    case "photo": .photo
    case "mixed": .mixed
    default: .video
    }
  }

  private static func nativeCaptureCount(_ raw: String?) -> IMGLYCamera.CaptureCount {
    switch raw {
    case "single": .single
    default: .multi
    }
  }

  /// A modal camera implementation.
  public struct ModalCamera: View {
    private let settings: CameraSettings
    private let result: CameraBuilderResult
    private let url: URL?
    private let config: IMGLYCamera.CameraConfiguration
    private let onDismiss: (Result<IMGLYCamera.CameraResult, CameraError>) -> Void

    public init(settings: CameraSettings, result: @escaping CameraBuilderResult, url: URL? = nil) {
      self.settings = settings
      self.result = result
      self.url = url
      config = CameraBuilder.nativeConfiguration(from: settings.configuration)

      onDismiss = { cameraResult in
        switch cameraResult {
        case let .success(.reaction(video: recording, reaction: reaction)):
          let reaction = CameraReaction(video: recording, recordings: reaction)
          result(.success(CameraResult(reaction: reaction)))
        case let .success(.capture(captures)):
          let capture = CameraCapture(captures: captures)
          result(.success(CameraResult(capture: capture)))
        case let .failure(error):
          result(.failure(error))
        }
      }
    }

    public var body: some View {
      if let url {
        Camera(
          engineSettings(for: settings),
          config: config,
          mode: .reaction(.horizontal, video: url, positionsSwapped: false),
          onDismiss: onDismiss,
        )
      } else {
        Camera(engineSettings(for: settings), config: config, onDismiss: onDismiss)
      }
    }
  }
}
