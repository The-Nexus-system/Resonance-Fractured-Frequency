import AVFoundation

/**
 * True 3-D positional audio using AVAudioEngine + AVAudioEnvironmentNode.
 *
 * Each semantic world object becomes a looping tone source (same tone
 * identity as the JS engine: fracture 220 Hz, pillar 330 Hz, signal 440 Hz,
 * landmark 550 Hz) positioned at its real world coordinates. The listener
 * pose mirrors the semantic player pose. Rendering uses Apple's HRTF
 * algorithm, so front/back and elevation are real cues — not the stereo-pan
 * approximation used in the browser fallback.
 *
 * Coordinate mapping (semantic -> AVAudio3DPoint / ARKit convention):
 *   semantic x (east)      -> native x (right)
 *   semantic z (elevation) -> native y (up)
 *   semantic y (north)     -> native -z (forward is -z)
 *
 * This layer is presentation only: it never owns gameplay state.
 */
final class SpatialAudioEngine {
  struct Source {
    let node: AVAudioPlayerNode
    let frequency: Double
  }

  private let engine = AVAudioEngine()
  private let environment = AVAudioEnvironmentNode()
  private var sources: [String: Source] = [:]
  private var running = false

  private let sampleRate: Double = 44100

  init() {
    engine.attach(environment)
    engine.connect(environment, to: engine.mainMixerNode, format: nil)
    environment.renderingAlgorithm = .HRTFHQ
    environment.distanceAttenuationParameters.distanceAttenuationModel = .inverse
    environment.distanceAttenuationParameters.referenceDistance = 1.0
    environment.distanceAttenuationParameters.maximumDistance = 40.0
    environment.distanceAttenuationParameters.rolloffFactor = 1.0
  }

  func start() throws {
    guard !running else { return }
    let session = AVAudioSession.sharedInstance()
    try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
    try session.setActive(true)
    try engine.start()
    running = true
  }

  func stop() {
    guard running else { return }
    for (_, source) in sources {
      source.node.stop()
      engine.detach(source.node)
    }
    sources.removeAll()
    engine.stop()
    running = false
  }

  func setListenerPose(x: Double, y: Double, z: Double, headingDeg: Double) {
    // Semantic heading: 0 = north (-z native), 90 = east (+x native).
    environment.listenerPosition = AVAudio3DPoint(x: Float(x), y: Float(z), z: Float(-y))
    environment.listenerAngularOrientation = AVAudio3DAngularOrientation(
      yaw: Float(-headingDeg),
      pitch: 0,
      roll: 0
    )
  }

  /// Add or move a tone source. `state` "resolved" mutes it softly.
  func upsertSource(id: String, x: Double, y: Double, z: Double, frequency: Double, resolved: Bool) throws {
    if !running { try start() }
    let position = AVAudio3DPoint(x: Float(x), y: Float(z), z: Float(-y))
    if let existing = sources[id] {
      existing.node.position = position
      existing.node.volume = resolved ? 0.08 : 0.9
      return
    }
    let node = AVAudioPlayerNode()
    engine.attach(node)
    let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1)!
    engine.connect(node, to: environment, format: format)
    node.position = position
    node.renderingAlgorithm = .HRTFHQ
    node.volume = resolved ? 0.08 : 0.9

    let buffer = makeToneBuffer(frequency: frequency, format: format)
    node.scheduleBuffer(buffer, at: nil, options: [.loops], completionHandler: nil)
    node.play()
    sources[id] = Source(node: node, frequency: frequency)
  }

  func removeSource(id: String) {
    guard let source = sources.removeValue(forKey: id) else { return }
    source.node.stop()
    engine.detach(source.node)
  }

  /// One-second looping sine with a gentle amplitude envelope so loops click-free.
  private func makeToneBuffer(frequency: Double, format: AVAudioFormat) -> AVAudioPCMBuffer {
    let frames = AVAudioFrameCount(sampleRate)
    let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frames)!
    buffer.frameLength = frames
    let data = buffer.floatChannelData![0]
    let cycles = (frequency * Double(frames) / sampleRate).rounded() // integer cycles => seamless loop
    let effectiveFreq = cycles * sampleRate / Double(frames)
    for i in 0..<Int(frames) {
      let t = Double(i) / sampleRate
      let envelope = 0.55 + 0.45 * sin(2.0 * .pi * 0.5 * t) // slow pulse, never fully silent
      data[i] = Float(sin(2.0 * .pi * effectiveFreq * t) * 0.35 * envelope)
    }
    return buffer
  }
}
