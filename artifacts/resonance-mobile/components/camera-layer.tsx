/**
 * Optional camera/AR presentation layer (Phase 4).
 *
 * The camera is PRESENTATION ONLY: it never owns game state. It renders the
 * same discovered semantic objects as the text/audio modes, positioned by
 * their relative bearing to the player's virtual heading. Camera permission
 * denial never blocks anything — the standard view carries all gameplay.
 *
 * True world-anchored AR tracking requires native ARKit and real-device
 * verification; this layer is the architecture seam for it.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameButton, ThemedText } from '@/components/ui';
import { useGame } from '@/context/game-provider';
import { visibleObjects, relativeAngleDeg, type SpatialWorld } from '@/lib/spatial/world';

export function CameraLayer({ world, onClose }: { world: SpatialWorld; onClose: () => void }) {
  const { colors } = useGame();
  const [permission, requestPermission] = useCameraPermissions();

  const markers = visibleObjects(world)
    .map((v) => ({ v, angle: relativeAngleDeg(world.player, v.object.position) }))
    // Only objects roughly within the camera's field of view (~±35°).
    .filter((m) => Math.abs(m.angle) <= 35);

  if (!permission?.granted) {
    return (
      <View style={[styles.fallback, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ThemedText variant="body">
          Camera view is optional. Everything can be played without it.
        </ThemedText>
        {permission?.canAskAgain !== false ? (
          <GameButton label="Allow camera" variant="outline" testID="button-camera-allow" onPress={() => void requestPermission()} />
        ) : (
          <ThemedText variant="caption" color={colors.mutedForeground}>
            Camera permission is off. The standard view below carries the full game.
          </ThemedText>
        )}
        <GameButton label="Close camera view" variant="ghost" testID="button-camera-close" onPress={onClose} />
      </View>
    );
  }

  return (
    <View style={styles.frame} testID="camera-layer">
      <CameraView style={StyleSheet.absoluteFill} facing="back" />
      {/* High-contrast readable overlay above camera content. */}
      <View style={styles.overlay} pointerEvents="none">
        {markers.length === 0 ? (
          <View style={styles.badge}>
            <ThemedText variant="caption" color="#ffffff">
              Nothing discovered in view — turn to scan
            </ThemedText>
          </View>
        ) : (
          markers.map((m) => (
            <View
              key={m.v.object.id}
              style={[
                styles.badge,
                { transform: [{ translateX: (m.angle / 35) * 120 }] },
              ]}
            >
              <MaterialCommunityIcons
                name={m.v.object.state === 'attuned' ? 'circle-slice-8' : 'circle-double'}
                size={18}
                color="#ffffff"
              />
              <ThemedText variant="caption" color="#ffffff">
                {m.v.object.label} · {m.v.distanceCategory}
              </ThemedText>
            </View>
          ))
        )}
      </View>
      <View style={styles.closeRow}>
        <GameButton label="Close camera view" variant="outline" testID="button-camera-close" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { height: 260, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  closeRow: { position: 'absolute', bottom: 8, left: 8, right: 8 },
  fallback: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 12, marginBottom: 12 },
});
