/**
 * Gate One's licensed recorded-audio layer.
 *
 * Only documented CC0 and SONNISS GDC recordings are bundled here. The web
 * build has additional community-soundpack effects whose per-file licence is
 * still unresolved; those are intentionally NOT copied into the native build.
 *
 * This augments (does not replace) the engine's native HRTF sound positions,
 * narration, captions, haptics and badge cues. Every audible event retains
 * its independent non-auditory counterpart from the semantic engine.
 */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import type { ZoneId } from './world';

// Static imports make Expo/Metro bundle real Ogg media into the app offline.
const FOOTSTEPS = [
  require('../../assets/audio/gateone/Fantozzi-StoneL1.ogg'),
  require('../../assets/audio/gateone/Fantozzi-StoneR1.ogg'),
  require('../../assets/audio/gateone/Fantozzi-StoneL2.ogg'),
  require('../../assets/audio/gateone/Fantozzi-StoneR2.ogg'),
  require('../../assets/audio/gateone/Fantozzi-StoneL3.ogg'),
  require('../../assets/audio/gateone/Fantozzi-StoneR3.ogg'),
] as const;

const AMBIENCE = {
  concourse: require('../../assets/audio/gateone/boilerRoom06.ogg'),
  bridge: require('../../assets/audio/gateone/geofon17.ogg'),
  hearth: require('../../assets/audio/gateone/geofon24.ogg'),
} as const;

const HATCH_SWITCH = require('../../assets/audio/gateone/leverSwitch014.ogg');
const HATCH_GEARS = require('../../assets/audio/gateone/tinyGears003.ogg');
const SECOND_SWITCH = require('../../assets/audio/gateone/leverSwitchSmall003.ogg');

const MAX_ONESHOTS = 4;

export class GateOneRecordedAudio {
  private enabled = false;
  private zone: ZoneId | null = null;
  private bed: AudioPlayer | null = null;
  private oneshots = new Set<AudioPlayer>();
  private stepIndex = 0;
  private stepTime = 0;
  private disposed = false;

  setEnabled(on: boolean) {
    if (this.disposed || this.enabled === on) return;
    this.enabled = on;
    if (!on) {
      this.stopBed();
      for (const player of this.oneshots) this.release(player);
    } else if (this.zone) {
      this.startBed(this.zone);
    }
  }

  setZone(zone: ZoneId) {
    if (this.disposed || this.zone === zone) return;
    this.zone = zone;
    this.stopBed();
    if (this.enabled) this.startBed(zone);
  }

  private startBed(zone: ZoneId) {
    const asset = zone === 'cabin' ? null : AMBIENCE[zone];
    if (!asset || this.bed || !this.enabled) return;
    try {
      const player = createAudioPlayer(asset);
      player.loop = true;
      // Position-specific audio remains owned by the HRTF engine; these beds
      // are quiet diffuse environmental texture, not wayfinding signals.
      player.volume = zone === 'concourse' ? 0.17 : 0.22;
      this.bed = player;
      player.play();
    } catch (error) {
      console.warn('Gate One recorded ambience unavailable', error);
    }
  }

  private stopBed() {
    if (!this.bed) return;
    const old = this.bed;
    this.bed = null;
    try { old.pause(); old.remove(); } catch { /* already released */ }
  }

  private release(player: AudioPlayer) {
    this.oneshots.delete(player);
    try { player.remove(); } catch { /* already released */ }
  }

  private oneShot(asset: number, volume: number) {
    if (!this.enabled || this.disposed) return;
    if (this.oneshots.size >= MAX_ONESHOTS) return;
    try {
      const player = createAudioPlayer(asset);
      this.oneshots.add(player);
      player.volume = volume;
      const subscription = player.addListener('playbackStatusUpdate', status => {
        if (status.didJustFinish) {
          subscription.remove();
          this.release(player);
        }
      });
      player.play();
    } catch (error) {
      console.warn('Gate One recorded cue unavailable', error);
    }
  }

  /** Called only when the existing gameplay engine reports a physical step. */
  step(zone: ZoneId) {
    if (zone !== 'concourse' && zone !== 'hearth') return;
    const now = Date.now();
    if (now - this.stepTime < 280) return;
    this.stepTime = now;
    this.oneShot(FOOTSTEPS[this.stepIndex % FOOTSTEPS.length], 0.37);
    this.stepIndex += 1;
  }

  /** Layered mechanical release, once at the actual hatch state change. */
  hatchRelease() {
    this.oneShot(HATCH_SWITCH, 0.58);
    this.oneShot(HATCH_GEARS, 0.40);
  }

  /** A subtle mechanical beat at the pre-existing boarding threshold. */
  collar() {
    this.oneShot(SECOND_SWITCH, 0.3);
  }

  dispose() {
    if (this.disposed) return;
    this.setEnabled(false);
    this.disposed = true;
    this.zone = null;
  }
}
