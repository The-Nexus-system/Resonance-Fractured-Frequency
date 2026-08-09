/**
 * react-three-fiber v9 JSX element typing (React 19 no longer has a global
 * JSX namespace, so fiber's ThreeElements must be merged in explicitly).
 */
import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
