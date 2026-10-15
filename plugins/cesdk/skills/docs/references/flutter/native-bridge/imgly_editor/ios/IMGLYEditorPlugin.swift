import Flutter
import UIKit

/// The iOS implementation for the `imgly_editor` Flutter plugin.
public class IMGLYEditorPlugin: NSObject, FlutterPlugin {
  // MARK: - Typealias

  /// A closure to specify an `EditorBuilder.Builder` based on a given `preset` and `metadata`.
  public typealias IMGLYBuilderClosure = (_ preset: EditorPreset?, _ metadata: [String: Any]?) -> EditorBuilder.Builder

  // MARK: - Properties

  /// The `IMGLYBuilderClosure` to use for UI creation.
  public static var builderClosure: IMGLYBuilderClosure?

  /// The `UIViewController` hosting the editor.
  private var presentationController: UIViewController?

  /// The `FlutterPluginRegistrar`.
  private static var registrar: FlutterPluginRegistrar?

  // MARK: - Constants

  /// IMGLY constants for the plugin use.
  private enum IMGLYConstants {
    static let kErrorMissingArguments = "E_MISSING_ARGUMENTS"
    static let kErrorExportFailed = "E_EXPORT_FAILED"
    static let kErrorParsing = "E_PARSING"

    static let kErrorMissingArgumentsMessage = "Unable to find required arguments for the method: "
    static let kErrorExportFailedMessage = "The export of the asset failed due to: "
    static let kErrorParsingMessage = "Unable to parse the argument(s): "
  }

  // MARK: - MethodChannel

  /// Registers for the channel in order to communicate with the
  /// Flutter plugin.
  /// - Parameter registrar: The `FlutterPluginRegistrar` used to register.
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "imgly_editor", binaryMessenger: registrar.messenger())
    let instance = IMGLYEditorPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
    Self.registrar = registrar
  }

  /// Retrieves the methods and initiates the fitting behavior.
  /// - Parameters:
  ///   - call: The `FlutterMethodCall` containig the information about the method.
  ///   - result: The `FlutterResult` to return to the Flutter plugin.
  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case "openEditor":
      guard let arguments = call.arguments as? [String: Any],
            let settings = arguments["settings"] as? [String: Any] else {
        result(FlutterError(
          code: IMGLYConstants.kErrorMissingArguments,
          message: IMGLYConstants.kErrorMissingArgumentsMessage,
          details: "openEditor()",
        ))
        return
      }

      do {
        let data = try JSONSerialization.data(withJSONObject: settings, options: [])
        var settings = try JSONDecoder().decode(EditorSettings.self, from: data)
        if let source = settings.source {
          if let resolvedSource = resolveAsset(source: source.source) {
            settings.source?.source = resolvedSource
          } else {
            result(FlutterError(code: IMGLYConstants.kErrorParsing, message: IMGLYConstants.kErrorParsingMessage,
                                details: source))
            return
          }
        }

        var preset: EditorPreset?
        if let pres = arguments["preset"] as? String {
          preset = EditorPreset(rawValue: pres)
        }
        let metadata = arguments["metadata"] as? [String: Any]

        openEditor(preset, settings: settings, metadata: metadata) { editorResult in
          switch editorResult {
          case let .success(success):
            if let success {
              let resultDict: [String: Any?] = [
                "artifact": success.artifact,
                "scene": success.scene,
                "thumbnail": success.thumbnail,
                "metadata": success.metadata,
              ]
              result(resultDict)
            } else {
              result(nil)
            }
          case let .failure(failure):
            result(FlutterError(
              code: IMGLYConstants.kErrorExportFailed,
              message: IMGLYConstants.kErrorExportFailedMessage,
              details: failure.localizedDescription,
            ))
          }
        }
      } catch {
        result(FlutterError(
          code: IMGLYConstants.kErrorMissingArguments,
          message: IMGLYConstants.kErrorMissingArgumentsMessage,
          details: "openEditor()",
        ))
      }
    default:
      result(FlutterMethodNotImplemented)
    }
  }

  // MARK: - Editor

  /// Opens the creative editor.
  /// - Parameters:
  ///   - preset: The `EditorPreset` used to determine which UI preset to use.
  ///   - settings: The `EditorSettings` containing all relevant information for the editor.
  ///   - metadata: Any custom metadata used for the `EditorBuilder.Builder`.
  ///   - completion: The completion handler to execute once the editor failed, cancelled or exported.
  func openEditor(
    _ preset: EditorPreset?,
    settings: EditorSettings,
    metadata: [String: Any]?,
    completion: @escaping (_ result: Result<EditorResult?, Error>) -> Void,
  ) {
    let builder = Self.builderClosure?(preset, metadata) ?? builderForPreset(preset)

    presentationController = MainActor.assumeIsolated {
      builder(settings, preset, metadata) { [weak self] result in
        completion(result)
        // Release the editor, otherwise it stays alive and keeps playing until the next openEditor.
        let controller = self?.presentationController
        self?.presentationController = nil
        controller?.presentingViewController?.dismiss(animated: true)
      }
    }
    presentationController?.modalPresentationStyle = .fullScreen

    if let presentationController, let windowScene = UIApplication.shared.connectedScenes
      .filter({ $0.activationState == .foregroundActive })
      .first as? UIWindowScene {
      if let rootViewController = windowScene.windows
        .filter(\.isKeyWindow).first?.rootViewController {
        rootViewController.present(presentationController, animated: true, completion: nil)
      }
    }
  }

  // MARK: - Helpers

  /// Returns the suitable `EditorBuilder.Builder` for a given `EditorPreset`.
  /// - Parameter preset: The `EditorPreset`.
  /// - Returns: The suitable `EditorBuilder.Builder`. Defaults to `EditorPreset.design`.
  private func builderForPreset(_ preset: EditorPreset?) -> EditorBuilder.Builder {
    switch preset {
    case .apparel:
      EditorBuilder.apparel()
    case .postcard:
      EditorBuilder.postcard()
    case .photo:
      EditorBuilder.photo()
    case .video:
      EditorBuilder.video()
    case .design:
      EditorBuilder.design()
    default:
      EditorBuilder.design()
    }
  }

  /// Resolves an asset at the given `source`
  /// - Parameter source: The source of the asset.
  /// - Returns: The resolved asset source.
  private func resolveAsset(source: String) -> String? {
    if source.starts(with: "/") {
      return URL(fileURLWithPath: source).absoluteString
    } else if let url = URL(string: source), url.scheme != nil {
      return url.absoluteString
    } else {
      let lookUpKey = Self.registrar?.lookupKey(forAsset: source)
      let url = Bundle.main.url(forResource: lookUpKey, withExtension: nil)
      return url?.absoluteString
    }
  }
}
