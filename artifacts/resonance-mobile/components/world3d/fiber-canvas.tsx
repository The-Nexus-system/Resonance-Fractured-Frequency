/**
 * Platform-resolved react-three-fiber Canvas.
 * Web bundles the DOM entry; fiber-canvas.native.tsx substitutes the
 * expo-gl entry on iOS/Android via Metro's platform resolution.
 */
export { Canvas } from '@react-three/fiber';
