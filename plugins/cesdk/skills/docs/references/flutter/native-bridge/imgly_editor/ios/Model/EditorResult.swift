/// A struct representing the result of an editor export.
public struct EditorResult {
  /// The source of the exported scene.
  let scene: String?

  /// The source of the exported artifact, e.g. image, video.
  let artifact: String?

  /// The source of the exported thumbnail.
  let thumbnail: String?

  /// The associated metadata.
  let metadata: [String: Any]

  /// Creates a new `EditorResult`.
  /// - Parameters:
  ///   - scene: The source of the exported scene.
  ///   - artifact: The source of the exported artifact, e.g. image, video.
  ///   - thumbnail: The source of the exported thumbnail.
  ///   - metadata: The associated metadata.
  public init(scene: String?, artifact: String?, thumbnail: String?, metadata: [String: Any] = [:]) {
    self.scene = scene
    self.artifact = artifact
    self.thumbnail = thumbnail
    self.metadata = metadata
  }
}
