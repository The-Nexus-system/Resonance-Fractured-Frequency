/**
 * Campaign data — shared canon with the web reference build.
 * Content must stay in sync with artifacts/resonance/src/lib/campaigns.ts.
 * Icons use MaterialCommunityIcons names (native equivalent of the web's
 * lucide shapes).
 */

export type IconName =
  | 'circle-outline'
  | 'triangle-outline'
  | 'waves'
  | 'weather-windy'
  | 'cube-outline'
  | 'radio-tower'
  | 'pulse'
  | 'hexagon-outline';

export type Choice = {
  id: string;
  label: string;
  icon: IconName;
  isCorrect: boolean;
  feedbackOnFail?: string;
};

export type Node = {
  id: string;
  targetDescription: string;
  targetVisual: {
    label: string;
    shape: IconName;
    color: string; // token-like accent for the target shape
  };
  toneFreq?: number;
  toneCaption?: string;
  narrative: string;
  choices: Choice[];
};

export type Campaign = {
  id: string;
  title: string;
  description: string;
  locked?: boolean;
  lockReason?: string;
  nodes: Node[];
};

export const campaigns: Campaign[] = [
  {
    id: 'the-first-fracture',
    title: 'The First Fracture',
    description:
      'Learn to realign the simplest discordant frequencies to repair a broken beacon signal.',
    nodes: [
      {
        id: 'node-1',
        targetDescription: 'A low, steady hum emitting a smooth circular wavelength.',
        targetVisual: { label: 'Smooth Blue Circle', shape: 'circle-outline', color: '#3b82f6' },
        toneFreq: 220,
        toneCaption: '[Low, steady humming sound]',
        narrative:
          'The signal is faint. It expects a matching calm resonance to establish the handshake.',
        choices: [
          {
            id: 'c1',
            label: 'Sharp Triangle',
            icon: 'triangle-outline',
            isCorrect: false,
            feedbackOnFail:
              'Too sharp. The frequency jaggedness disrupted the signal. Try a smoother approach.',
          },
          { id: 'c2', label: 'Smooth Circle', icon: 'circle-outline', isCorrect: true },
          {
            id: 'c3',
            label: 'Chaotic Waves',
            icon: 'waves',
            isCorrect: false,
            feedbackOnFail: 'Too chaotic. The signal needs a single steady point of focus.',
          },
        ],
      },
      {
        id: 'node-2',
        targetDescription: 'A fluctuating, airy breeze passing through a wide gap.',
        targetVisual: { label: 'Flowing Teal Waves', shape: 'weather-windy', color: '#14b8a6' },
        toneFreq: 330,
        toneCaption: '[Soft, airy whooshing sound]',
        narrative:
          "A connection is forming, but it's unstable. You must breathe life into the channel without overwhelming it.",
        choices: [
          {
            id: 'c1',
            label: 'Rigid Box',
            icon: 'cube-outline',
            isCorrect: false,
            feedbackOnFail: 'Too rigid. The signal bounced off.',
          },
          { id: 'c2', label: 'Flowing Wind', icon: 'weather-windy', isCorrect: true },
          {
            id: 'c3',
            label: 'Pulsing Radio',
            icon: 'radio-tower',
            isCorrect: false,
            feedbackOnFail: 'Too mechanical. It needs a natural flow.',
          },
        ],
      },
      {
        id: 'node-3',
        targetDescription: 'An energetic, rhythmic pulsing from deep within the beacon.',
        targetVisual: { label: 'Vibrant Purple Pulse', shape: 'pulse', color: '#a855f7' },
        toneFreq: 440,
        toneCaption: '[Energetic, rhythmic pulsing]',
        narrative:
          'The connection is stable. Now the beacon needs power to broadcast. Match its energetic rhythm.',
        choices: [
          { id: 'c1', label: 'Rhythmic Pulse', icon: 'pulse', isCorrect: true },
          {
            id: 'c2',
            label: 'Static Hexagon',
            icon: 'hexagon-outline',
            isCorrect: false,
            feedbackOnFail: 'Too static. The beacon requires energy to activate.',
          },
          {
            id: 'c3',
            label: 'Soft Circle',
            icon: 'circle-outline',
            isCorrect: false,
            feedbackOnFail: 'Too gentle. Give it more rhythm.',
          },
        ],
      },
      {
        id: 'node-4',
        targetDescription: 'A multi-layered broadcast spanning all directions.',
        targetVisual: { label: 'Radiating Green Signals', shape: 'radio-tower', color: '#22c55e' },
        toneFreq: 550,
        toneCaption: '[Harmonic, expansive broadcasting chime]',
        narrative:
          'The beacon is powered! Finalize the synchronization to let the signal reach the atmosphere.',
        choices: [
          {
            id: 'c1',
            label: 'Single Triangle',
            icon: 'triangle-outline',
            isCorrect: false,
            feedbackOnFail: 'Too narrow. The signal must reach outwards.',
          },
          {
            id: 'c2',
            label: 'Contained Box',
            icon: 'cube-outline',
            isCorrect: false,
            feedbackOnFail: 'Too closed. The broadcast cannot be contained.',
          },
          { id: 'c3', label: 'Radiating Broadcast', icon: 'radio-tower', isCorrect: true },
        ],
      },
    ],
  },
  {
    id: 'the-echoing-chasm',
    title: 'The Echoing Chasm',
    description: 'Deep within the planetary crust, ancient signals repeat and twist.',
    locked: true,
    lockReason: 'Coming Soon',
    nodes: [],
  },
];
