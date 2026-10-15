import CoreGraphics
import Foundation
import IMGLYCamera

/// The result type for a camera reaction session.
@objc @objcMembers public class CameraReaction: NSObject {
  /// The video that was reacted to.
  public let video: Recording

  /// The recorded videos.
  public let recordings: [Recording]

  /// Creates a new `CameraReaction` from the `IMGLYCamera` result types.
  /// - Parameters:
  ///   - video: The `IMGLYCamera.Recording` video that was reacted to.
  ///   - recordings: The recorded `IMGLYCamera.Recording` videos.
  public convenience init(video: IMGLYCamera.Recording, recordings: [IMGLYCamera.Recording]) {
    self.init(
      video: Recording(recording: video),
      recordings: recordings.compactMap { Recording(recording: $0) },
    )
  }

  /// Creates a new `CameraReaction` instance..
  /// - Parameters:
  ///   - video: The `Recording` video that was reacted to.
  ///   - recordings: The recorded `Recording` videos.
  public init(video: Recording, recordings: [Recording]) {
    self.video = video
    self.recordings = recordings
  }

  func toDictionary() -> [String: Any] {
    [
      "video": video.toDictionary(),
      "recordings": recordings.compactMap { $0.toDictionary() },
    ]
  }
}

/// The result type for a camera capture session producing photos, videos, or both.
@objc @objcMembers public class CameraCapture: NSObject {
  /// The individual captures from the session.
  public let captures: [Capture]

  /// Creates a new `CameraCapture` from the `IMGLYCamera` result types.
  /// - Parameter captures: The `IMGLYCamera.Capture` items.
  public convenience init(captures: [IMGLYCamera.Capture]) {
    self.init(captures: captures.map { Capture(capture: $0) })
  }

  /// Creates a new `CameraCapture` instance.
  /// - Parameter captures: The captures from the session.
  public init(captures: [Capture]) {
    self.captures = captures
  }

  func toDictionary() -> [String: Any] {
    [
      "captures": captures.map { $0.toDictionary() },
    ]
  }
}

/// A single capture from the camera. Either a still photo or a video recording.
@objc @objcMembers public class Capture: NSObject {
  /// The captured still photo, when this is a photo capture.
  public let photo: Photo?

  /// The video recording, when this is a video capture.
  public let video: Recording?

  /// Creates a new photo `Capture`.
  public convenience init(photo: Photo) {
    self.init(photo: photo, video: nil)
  }

  /// Creates a new video `Capture`.
  public convenience init(video: Recording) {
    self.init(photo: nil, video: video)
  }

  /// Creates a new `Capture` from the `IMGLYCamera.Capture` enum.
  public convenience init(capture: IMGLYCamera.Capture) {
    switch capture {
    case let .photo(photo):
      self.init(photo: Photo(photo: photo))
    case let .video(recording):
      self.init(video: Recording(recording: recording))
    }
  }

  private init(photo: Photo?, video: Recording?) {
    self.photo = photo
    self.video = video
  }

  func toDictionary() -> [String: Any] {
    var dictionary: [String: Any] = [:]
    if let photo {
      dictionary["photo"] = photo.toDictionary()
    }
    if let video {
      dictionary["video"] = video.toDictionary()
    }
    return dictionary
  }
}

/// A captured still photo. Contains one image in standard mode or two stacked images in dual camera mode.
@objc @objcMembers public class Photo: NSObject {
  /// The individual image(s) of the photo capture.
  public let images: [PhotoImage]

  /// The duration in seconds stamped on the photo.
  public let duration: Double

  /// Creates a new `Photo`.
  /// - Parameters:
  ///   - images: The individual image(s) of the photo capture.
  ///   - duration: The duration in seconds stamped on the photo.
  public init(images: [PhotoImage], duration: Double) {
    self.images = images
    self.duration = duration
  }

  /// Creates a new `Photo` from an `IMGLYCamera.Photo`.
  public convenience init(photo: IMGLYCamera.Photo) {
    self.init(
      images: photo.images.map { PhotoImage(image: $0) },
      duration: photo.duration.seconds,
    )
  }

  func toDictionary() -> [String: Any] {
    [
      "images": images.map { $0.toDictionary() },
      "duration": duration,
    ]
  }
}

/// A single image inside a photo capture.
@objc @objcMembers public class PhotoImage: NSObject {
  /// The `URL` to the source of the image.
  public let url: URL

  /// The position and size of the image inside the dual-camera layout.
  public let rect: CGRect

  /// Creates a new `PhotoImage`.
  public init(url: URL, rect: CGRect) {
    self.url = url
    self.rect = rect
  }

  /// Creates a new `PhotoImage` from an `IMGLYCamera.Photo.Image`.
  public convenience init(image: IMGLYCamera.Photo.Image) {
    self.init(url: image.url, rect: image.rect)
  }

  func toDictionary() -> [String: Any] {
    [
      "uri": url.absoluteString,
      "rect": [
        "x": rect.origin.x,
        "y": rect.origin.y,
        "width": Double(rect.width),
        "height": Double(rect.height),
      ],
    ]
  }
}

/// The result of a camera session.
@objc @objcMembers public class CameraResult: NSObject {
  /// The reaction session result.
  public let reaction: CameraReaction?

  /// The capture result for a photo, video, or mixed session.
  public let capture: CameraCapture?

  /// The associated metadata.
  public let metadata: [String: Any]

  /// Creates a new `CameraResult`.
  /// - Parameters:
  ///   - reaction: The reaction session result.
  ///   - metadata: The associated metadata.
  public convenience init(reaction: CameraReaction, metadata: [String: Any] = [:]) {
    self.init(reaction: reaction, capture: nil, metadata: metadata)
  }

  /// Creates a new `CameraResult`.
  /// - Parameters:
  ///   - capture: The capture session result.
  ///   - metadata: The associated metadata.
  public convenience init(capture: CameraCapture, metadata: [String: Any] = [:]) {
    self.init(reaction: nil, capture: capture, metadata: metadata)
  }

  private init(
    reaction: CameraReaction?,
    capture: CameraCapture?,
    metadata: [String: Any] = [:],
  ) {
    self.reaction = reaction
    self.capture = capture
    self.metadata = metadata
  }

  /// Converts the instance to a dictionary.
  public func toDictionary() -> [String: Any] {
    var dictionary: [String: Any] = ["metadata": metadata]
    if let reaction {
      dictionary["reaction"] = reaction.toDictionary()
    }
    if let capture {
      dictionary["capture"] = capture.toDictionary()
    }
    return dictionary
  }
}

/// A recording of the camera that can contain multiple video sections.
@objc @objcMembers public class Recording: NSObject {
  /// The individual video sections.
  public let videos: [Video]

  /// The duration in seconds.
  public let duration: Double

  /// Creates a new `Recording` instance.
  /// - Parameters:
  ///   - videos: The individual video sections.
  ///   - duration: The duration in seconds.
  public init(videos: [Video], duration: Double) {
    self.videos = videos
    self.duration = duration
  }

  /// Creates a new `Recording` instance from a `IMGLYCamera.Recording`.
  /// - Parameter recording: The `IMGLYCamera.Recording`.
  public convenience init(recording: IMGLYCamera.Recording) {
    self.init(videos: recording.videos.compactMap { Video(video: $0) }, duration: recording.duration.seconds)
  }

  func toDictionary() -> [String: Any] {
    [
      "videos": videos.compactMap { $0.toDictionary() },
      "duration": duration,
    ]
  }
}

/// An individual video.
@objc @objcMembers public class Video: NSObject {
  /// The `URL` to the source of the video.
  public let url: URL

  /// The height of the video.
  public let rect: CGRect

  /// Creates a new `Video`.
  /// - Parameters:
  ///   - url: The `URL` to the source of the video.
  ///   - height: The height of the video.
  ///   - width: The width of the video.
  public init(url: URL, rect: CGRect) {
    self.url = url
    self.rect = rect
  }

  /// Creates a new `Video` instance from a `IMGLYCamera.Recording.Video`.
  /// - Parameter recording: The `IMGLYCamera.Recording.Video`.
  public convenience init(video: IMGLYCamera.Recording.Video) {
    self.init(url: video.url, rect: video.rect)
  }

  func toDictionary() -> [String: Any] {
    [
      "uri": url.absoluteString,
      "rect": [
        "x": rect.origin.x,
        "y": rect.origin.y,
        "width": Double(rect.width),
        "height": Double(rect.height),
      ],
    ]
  }
}
