/**
 * JS bridge to the ResonanceNative Swift module.
 *
 * Safe everywhere: in Expo Go, on web, and in the browser preview the
 * native module simply is not present, so `ResonanceNative` is null and all
 * helpers report "unavailable" without crashing. The real implementation is
 * compiled into the native iOS build by Expo Launch (EAS cloud build).
 */
import React from 'react';
import { requireOptionalNativeModule } from 'expo';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';

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

export type NativeAREntity = {
  id: string;
  x: number;
  y: number;
  z: number;
  kind: string;
  resolved: boolean;
};

type NativeARViewProps = {
  entities: NativeAREntity[];
  style?: StyleProp<ViewStyle>;
};

// Resolve the native view lazily and safely: absent in Expo Go/web.
let NativeARViewComponent: React.ComponentType<NativeARViewProps> | null = null;
if (ResonanceNative != null) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { requireNativeViewManager } = require('expo-modules-core');
    NativeARViewComponent = requireNativeViewManager('ResonanceNative');
  } catch {
    NativeARViewComponent = null;
  }
}

/**
 * World-space AR view (RealityKit). Renders null anywhere the native
 * module is not present, so it is always safe to mount.
 */
export function NativeARView(props: NativeARViewProps): React.ReactElement | null {
  if (!NativeARViewComponent || !isNativeARAvailable()) return null;
  return React.createElement(NativeARViewComponent, props);
}
