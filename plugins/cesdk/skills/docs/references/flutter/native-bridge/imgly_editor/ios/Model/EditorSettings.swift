/// A struct containing all necessary settings to setup the editor.
public struct EditorSettings: Codable {
  /// The license key. Pass `nil` to run the SDK in evaluation mode with a watermark.
  public let license: String?

  /// The base URI used by the engine for built-in assets like emoji and fallback
  /// fonts, and by the editor for its default and demo asset sources (stickers,
  /// filters, and more).
  public let baseUri: String

  /// The id of the current user.
  public let userId: String?

  /// The source to load into the editor.
  public var source: Source?
}
