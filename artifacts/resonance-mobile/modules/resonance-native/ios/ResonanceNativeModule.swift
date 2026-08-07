import ExpoModulesCore
import ARKit

/**
 * ResonanceNative — presentation-only native layer.
 *
 * Exposes true 3-D positional audio (AVAudioEnvironmentNode/HRTF) and a
 * RealityKit world-space AR view to the JS semantic engine, which remains
 * the single owner of canonical gameplay state.
 */
public class ResonanceNativeModule: Module {
  private let audio = SpatialAudioEngine()

  public func definition() -> ModuleDefinition {
    Name("ResonanceNative")

    Constants([
      "isARSupported": ARWorldTrackingConfiguration.isSupported,
      "isSpatialAudioSupported": true,
    ])

    AsyncFunction("startSpatialAudio") {
      try self.audio.start()
    }

    AsyncFunction("stopSpatialAudio") {
      self.audio.stop()
    }

    AsyncFunction("setListenerPose") { (x: Double, y: Double, z: Double, headingDeg: Double) in
      self.audio.setListenerPose(x: x, y: y, z: z, headingDeg: headingDeg)
    }

    AsyncFunction("upsertAudioSource") { (id: String, x: Double, y: Double, z: Double, frequency: Double, resolved: Bool) in
      try self.audio.upsertSource(id: id, x: x, y: y, z: z, frequency: frequency, resolved: resolved)
    }

    AsyncFunction("removeAudioSource") { (id: String) in
      self.audio.removeSource(id: id)
    }

    View(ResonanceARView.self) {
      Prop("entities") { (view: ResonanceARView, entities: [[String: Any]]) in
        view.setEntities(entities)
      }
    }
  }
}
