import ExpoModulesCore
import ARKit
import RealityKit

/**
 * World-space AR view (RealityKit + ARKit world tracking).
 *
 * Receives semantic world entities from JS via the `entities` prop and
 * anchors simple resonant markers at their true world positions relative to
 * the session origin (the player's start pose). Presentation only — all
 * gameplay state stays in the JS semantic engine.
 *
 * Coordinate mapping (semantic -> ARKit):
 *   semantic x (east)      -> AR x
 *   semantic z (elevation) -> AR y
 *   semantic y (north)     -> AR -z
 */
class ResonanceARView: ExpoView {
  private let arView = ARView(frame: .zero)
  private var anchors: [String: AnchorEntity] = [:]
  private var sessionStarted = false

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    // We own the ARKit configuration so RealityKit cannot replace the
    // carefully selected environment, depth and lighting options.
    arView.automaticallyConfigureSession = false
    addSubview(arView)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    arView.frame = bounds
    startSessionIfNeeded()
  }

  private func startSessionIfNeeded() {
    guard !sessionStarted, ARWorldTrackingConfiguration.isSupported else { return }
    let configuration = ARWorldTrackingConfiguration()
    configuration.worldAlignment = .gravityAndHeading // AR -z = true north, matching semantic +y
    configuration.planeDetection = [.horizontal, .vertical]
    configuration.environmentTexturing = .automatic
    configuration.isLightEstimationEnabled = true
    // Real surfaces can hide virtual geometry on LiDAR-capable devices.
    // Non-LiDAR devices keep the ordinary tracked placement instead.
    if ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh) {
      configuration.sceneReconstruction = .mesh
      arView.environment.sceneUnderstanding.options.insert(.occlusion)
    }
    // People can also pass in front of the objects if depth segmentation
    // is supported. Never force this on unsupported older hardware.
    if ARWorldTrackingConfiguration.supportsFrameSemantics(.personSegmentationWithDepth) {
      configuration.frameSemantics.insert(.personSegmentationWithDepth)
    }
    arView.session.run(configuration)
    sessionStarted = true
  }

  /// entities: [{ id, x, y, z, kind, resolved }]
  func setEntities(_ entities: [[String: Any]]) {
    var seen = Set<String>()
    for entity in entities {
      guard
        let id = entity["id"] as? String,
        let x = entity["x"] as? Double,
        let y = entity["y"] as? Double,
        let z = entity["z"] as? Double,
        x.isFinite, y.isFinite, z.isFinite
      else { continue }
      seen.insert(id)
      let resolved = entity["resolved"] as? Bool ?? false
      let kind = entity["kind"] as? String ?? "landmark"
      let position = SIMD3<Float>(Float(x), Float(z) + 1.2, Float(-y))

      if let anchor = anchors[id] {
        anchor.position = position
        updateMaterial(anchor: anchor, kind: kind, resolved: resolved)
      } else {
        let anchor = AnchorEntity(world: position)
        anchor.addChild(makeMarker(kind: kind, resolved: resolved))
        arView.scene.addAnchor(anchor)
        anchors[id] = anchor
      }
    }
    // Remove anchors for entities no longer present.
    for id in Array(anchors.keys) where !seen.contains(id) {
      if let anchor = anchors.removeValue(forKey: id) {
        arView.scene.removeAnchor(anchor)
      }
    }
  }

  private func makeMarker(kind: String, resolved: Bool) -> ModelEntity {
    let mesh: MeshResource
    switch kind {
    case "fracture": mesh = .generateBox(size: 0.35, cornerRadius: 0.04)
    case "pillar": mesh = .generateCylinder(height: 0.8, radius: 0.12)
    case "signal": mesh = .generateSphere(radius: 0.18)
    default: mesh = .generateSphere(radius: 0.12)
    }
    let entity = ModelEntity(mesh: mesh, materials: [material(kind: kind, resolved: resolved)])
    entity.name = "marker"
    return entity
  }

  private func updateMaterial(anchor: AnchorEntity, kind: String, resolved: Bool) {
    guard let marker = anchor.findEntity(named: "marker") as? ModelEntity else { return }
    marker.model?.materials = [material(kind: kind, resolved: resolved)]
  }

  private func material(kind: String, resolved: Bool) -> PhysicallyBasedMaterial {
    let color: UIColor
    if resolved {
      color = UIColor(red: 0.35, green: 0.85, blue: 0.75, alpha: 1.0) // attuned teal
    } else {
      switch kind {
      case "fracture": color = UIColor(red: 0.95, green: 0.45, blue: 0.35, alpha: 1.0)
      case "pillar": color = UIColor(red: 0.55, green: 0.65, blue: 0.95, alpha: 1.0)
      case "signal": color = UIColor(red: 0.95, green: 0.85, blue: 0.40, alpha: 1.0)
      default: color = UIColor(white: 0.85, alpha: 1.0)
      }
    }
    var finish = PhysicallyBasedMaterial()
    finish.baseColor = .init(tint: color)
    finish.metallic = .float(kind == "pillar" ? 0.78 : 0.32)
    finish.roughness = .float(resolved ? 0.32 : 0.57)
    return finish
  }
}
