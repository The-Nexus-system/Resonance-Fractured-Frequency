/**
 * JS bridge to the ResonanceNative Swift module.
 *
 * Safe everywhere: in Expo Go, on web, and in the browser preview the
 * native module simply is not present, so `ResonanceNative` is null and all
 * helpers report "unavailable" without crashing. The real implementation is
 * compiled into the native iOS build by Expo Launch (EAS cloud build).
 */
import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

type ResonanceNativeType = {
  isARSupported: boolean;
  isSpatialAudioSupported: boolean;
  startSpatialAudio(): Promise<void>;
  stopSpatialAudio(): Promise<void>;
  setListenerPose(x: number, y: number, z: number, headingDeg: number): Promise<void>;
  upsertAudioSource(
    id: string,
    x: number,
    y: number,
    z: number,
    frequency: number,
    resolved: boolean,
  ): Promise<void>;
  removeAudioSource(id: string): Promise<void>;
};

export const ResonanceNative: ResonanceNativeType | null =
  Platform.OS === 'ios' ? requireOptionalNativeModule<ResonanceNativeType>('ResonanceNative') : null;

/** True only inside a native iOS build that contains the module. */
export function isNativeSpatialAudioAvailable(): boolean {
  return ResonanceNative != null && ResonanceNative.isSpatialAudioSupported === true;
}

/** True only on ARKit-capable hardware inside a native iOS build. */
export function isNativeARAvailable(): boolean {
  return ResonanceNative != null && ResonanceNative.isARSupported === true;
}
