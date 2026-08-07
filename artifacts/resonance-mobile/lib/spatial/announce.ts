/**
 * Speech-safe announcement coalescing — Phase 3.
 *
 * Routine spatial changes (turns, steps) must not flood the VoiceOver
 * speech queue: rapid actions collapse into a single trailing announcement
 * carrying only the LATEST state. Critical announcements (discoveries,
 * interaction results, errors) bypass coalescing, are spoken immediately,
 * and cancel any pending routine announcement so stale movement text never
 * speaks over an important one.
 *
 * All information announced here is also always visible as on-screen text,
 * so no information exists exclusively in speech.
 */

export type AnnouncementCoalescer = {
  /** Routine update: rate-limited, trailing-coalesced, latest wins. */
  routine: (message: string) => void;
  /** Critical update: immediate; cancels any pending routine message. */
  critical: (message: string) => void;
  /** Cancel pending work (call on unmount). */
  dispose: () => void;
};

export function createAnnouncementCoalescer(
  speak: (message: string) => void,
  minIntervalMs = 1500,
  now: () => number = Date.now,
  schedule: (fn: () => void, ms: number) => ReturnType<typeof setTimeout> = setTimeout,
  cancel: (t: ReturnType<typeof setTimeout>) => void = clearTimeout,
): AnnouncementCoalescer {
  let lastSpokenAt = -Infinity;
  let pending: string | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearPending = () => {
    if (timer !== null) {
      cancel(timer);
      timer = null;
    }
    pending = null;
  };

  const speakNow = (message: string) => {
    lastSpokenAt = now();
    speak(message);
  };

  return {
    routine(message: string) {
      const elapsed = now() - lastSpokenAt;
      if (elapsed >= minIntervalMs && timer === null) {
        speakNow(message);
        return;
      }
      // Coalesce: only the latest routine message survives.
      pending = message;
      if (timer === null) {
        const wait = Math.max(0, minIntervalMs - elapsed);
        timer = schedule(() => {
          timer = null;
          if (pending !== null) {
            const msg = pending;
            pending = null;
            speakNow(msg);
          }
        }, wait);
      }
    },
    critical(message: string) {
      clearPending();
      speakNow(message);
    },
    dispose: clearPending,
  };
}
