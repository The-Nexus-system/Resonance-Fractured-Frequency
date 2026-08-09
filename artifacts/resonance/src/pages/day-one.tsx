import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useA11y } from "@/components/a11y-provider";
import { GateOneEngine, type Caption, type EngineSnapshot } from "@/lib/gateone/engine";
import { getCharacter } from "@/lib/gateone/characters";
import { WALKABLE, PLACES, zoneAt } from "@/lib/gateone/world";
import { loadSave, saveGame, defaultGateOne } from "@/lib/settings";

/**
 * Day One — Gate One: Earth transport → lunar concourse → Hearth reveal →
 * boarding bridge → "Medical intake first." / Deck Three guidance.
 *
 * Continuous physical traversal only. No location cards, destination menus,
 * dialogue wheels, or teleports. Look Around / Repeat Guidance describe; they
 * never move the player.
 */

const HOLD_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"];

export default function DayOne() {
  const [, navigate] = useLocation();
  const { settings, announce } = useA11y();
  const save = useMemo(() => loadSave(), []);
  const character = getCharacter(save.gateOne?.characterId);

  const [started, setStarted] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [complete, setComplete] = useState(save.gateOne?.complete === true);
  const engineRef = useRef<GateOneEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionsRef = useRef<HTMLOListElement | null>(null);
  const lastSaveRef = useRef(0);

  useEffect(() => {
    if (!character) navigate("/characters");
  }, [character, navigate]);

  const persist = useCallback(() => {
    const e = engineRef.current;
    if (!e || !character) return;
    const s = loadSave();
    s.gateOne = {
      ...defaultGateOne,
      characterId: character.id,
      x: e.x,
      y: e.y,
      heading: e.heading,
      hatchOpen: e.hatchOpen,
      firedEvents: e.getFiredEvents(),
      complete: e.gateOneComplete,
    };
    saveGame(s);
  }, [character]);

  const begin = useCallback(async () => {
    if (!character || engineRef.current) return;
    const g = loadSave().gateOne;
    const restore =
      g && g.characterId === character.id && (g.x !== defaultGateOne.x || g.firedEvents.length > 0)
        ? { x: g.x, y: g.y, heading: g.heading, fired: g.firedEvents, hatchOpen: g.hatchOpen }
        : undefined;
    const engine = new GateOneEngine(
      character.id,
      {
        onCaption: (c) => setCaptions((prev) => [...prev.slice(-60), c]),
        onAnnounce: announce,
        onStateChange: () => {
          setSnap(engineRef.current?.snapshot() ?? null);
          const now = performance.now();
          if (now - lastSaveRef.current > 4000) {
            lastSaveRef.current = now;
            persist();
          }
        },
        onGateOneComplete: () => {
          setComplete(true);
          persist();
        },
      },
      restore,
    );
    engineRef.current = engine;
    setStarted(true);
    await engine.start(settings.sound, settings.sound);
  }, [character, announce, persist, settings.sound]);

  useEffect(() => {
    return () => {
      persist();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [persist]);

  useEffect(() => {
    engineRef.current?.setSound(settings.sound);
    engineRef.current?.setSpeech(settings.sound);
  }, [settings.sound]);

  // keyboard
  useEffect(() => {
    if (!started) return;
    const down = (ev: KeyboardEvent) => {
      if (ev.target instanceof HTMLInputElement || ev.target instanceof HTMLTextAreaElement) return;
      if (HOLD_KEYS.includes(ev.code)) {
        ev.preventDefault();
        engineRef.current?.keyDown(ev.code);
      } else if (ev.code === "KeyL") {
        ev.preventDefault();
        announce(engineRef.current?.lookAround() ?? "");
      } else if (ev.code === "KeyG") {
        ev.preventDefault();
        announce(engineRef.current?.repeatGuidance() ?? "");
      }
    };
    const up = (ev: KeyboardEvent) => {
      if (HOLD_KEYS.includes(ev.code)) engineRef.current?.keyUp(ev.code);
    };
    const blur = () => engineRef.current?.clearKeys();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [started, announce]);

  // captions autoscroll
  useEffect(() => {
    captionsRef.current?.scrollTo({ top: captionsRef.current.scrollHeight });
  }, [captions]);

  // top-down render (stable geometry; simple shapes; respects reduce-motion by lower fps upstream)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !snap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // camera: 8px per metre, centred on player
    const S = 8;
    const cx = W / 2 - snap.x * S;
    const cy = H / 2 + snap.y * S;
    const px = (wx: number) => cx + wx * S;
    const py = (wy: number) => cy - wy * S;
    // walkable floor
    ctx.fillStyle = "rgba(45, 212, 191, 0.12)";
    for (const r of WALKABLE) {
      ctx.fillRect(px(r.x1), py(r.y2), (r.x2 - r.x1) * S, (r.y2 - r.y1) * S);
    }
    // hatch state
    ctx.fillStyle = snap.hatchOpen ? "rgba(45,212,191,0.35)" : "rgba(220,80,80,0.5)";
    ctx.fillRect(px(-1.2), py(14), 2.4 * S, 2 * S);
    // fixed places
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    for (const key of Object.keys(PLACES) as (keyof typeof PLACES)[]) {
      const p = PLACES[key];
      ctx.beginPath();
      ctx.arc(px(p.x), py(p.y), 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // NPCs
    ctx.fillStyle = "rgba(96,165,250,0.95)";
    for (const n of snap.npcs) {
      ctx.beginPath();
      ctx.arc(px(n.x), py(n.y), 4, 0, Math.PI * 2);
      ctx.fill();
    }
    // player
    ctx.save();
    ctx.translate(px(snap.x), py(snap.y));
    ctx.rotate(snap.heading);
    ctx.fillStyle = "rgb(45, 212, 191)";
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5, 6);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [snap]);

  if (!character) return null;

  const hold = (code: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      engineRef.current?.keyDown(code);
    },
    onPointerUp: () => engineRef.current?.keyUp(code),
    onPointerCancel: () => engineRef.current?.keyUp(code),
    onPointerLeave: () => engineRef.current?.keyUp(code),
  });

  return (
    <main id="main-content" className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Day One</h1>
        <p className="text-sm text-muted-foreground" data-testid="text-playing-as">
          {character.name} — {character.rank}, {character.role}
        </p>
      </header>

      {!started && !complete && (
        <section className="mt-10 max-w-xl">
          <h2 className="text-xl font-semibold">Earth transport, final approach</h2>
          <p className="mt-3 text-muted-foreground">
            You are aboard a transport from Earth, bound for the lunar transfer concourse
            and the ship that will be your home: the CSV Hearth. Move with the arrow keys
            or W A S D, or the on-screen controls. Press L to hear your surroundings.
            Press G to repeat your badge's guidance. Sound is spatial — headphones help,
            but every sound also arrives as captions and descriptions.
          </p>
          <button
            type="button"
            onClick={begin}
            data-testid="button-begin-day-one"
            className="mt-6 rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Begin Day One
          </button>
        </section>
      )}

      {complete && (
        <section className="mt-10 max-w-xl" aria-live="polite">
          <h2 className="text-xl font-semibold">You have reached the first lift</h2>
          <p className="mt-3 text-muted-foreground">
            "Medical intake first. Everybody." The lift to Deck Three waits ahead. Day One
            continues beyond this point — that part of the story is written, and it is not
            open yet.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              data-testid="button-restart-day-one"
              className="rounded-lg border border-border px-5 py-2.5 font-medium hover:border-primary"
              onClick={() => {
                const s = loadSave();
                s.gateOne = { ...defaultGateOne, characterId: character.id };
                saveGame(s);
                engineRef.current?.dispose();
                engineRef.current = null;
                setCaptions([]);
                setComplete(false);
                setStarted(false);
                announce("Day One reset to the Earth transport.");
              }}
            >
              Live the morning again
            </button>
            <button
              type="button"
              data-testid="button-change-character"
              className="rounded-lg border border-border px-5 py-2.5 font-medium hover:border-primary"
              onClick={() => navigate("/characters")}
            >
              Choose a different crew member
            </button>
          </div>
        </section>
      )}

      {started && !complete && (
        <div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1fr_minmax(280px,380px)]">
          <section aria-label="World view" className="flex flex-col gap-3">
            <div className="rounded-xl border border-border bg-card p-2">
              <canvas
                ref={canvasRef}
                width={640}
                height={420}
                className="h-auto w-full rounded-lg bg-background"
                role="img"
                aria-label={`Top-down view. ${snap ? `You are in the ${snap.zoneName}.` : ""}`}
                data-testid="canvas-world"
              />
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-zone">
              {snap ? snap.zoneName : ""}
            </p>
            {/* touch controls */}
            <div className="grid max-w-xs grid-cols-3 gap-2 self-center" role="group" aria-label="Movement controls">
              <span />
              <button type="button" className="ctl" data-testid="button-move-forward" aria-label="Move forward" {...hold("ArrowUp")}>↑</button>
              <span />
              <button type="button" className="ctl" data-testid="button-turn-left" aria-label="Turn left" {...hold("ArrowLeft")}>⟲</button>
              <button type="button" className="ctl" data-testid="button-move-back" aria-label="Step back" {...hold("ArrowDown")}>↓</button>
              <button type="button" className="ctl" data-testid="button-turn-right" aria-label="Turn right" {...hold("ArrowRight")}>⟳</button>
            </div>
            <div className="flex gap-2 self-center">
              <button
                type="button"
                data-testid="button-look-around"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary"
                onClick={() => announce(engineRef.current?.lookAround() ?? "")}
              >
                Look around (L)
              </button>
              <button
                type="button"
                data-testid="button-repeat-guidance"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary"
                onClick={() => announce(engineRef.current?.repeatGuidance() ?? "")}
              >
                Badge guidance (G)
              </button>
            </div>
          </section>

          <section aria-label="Captions" className="flex min-h-[240px] flex-col rounded-xl border border-border bg-card">
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold text-muted-foreground">
              Captions
            </h2>
            <ol
              ref={captionsRef}
              className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm"
              data-testid="list-captions"
            >
              {captions.map((c) => (
                <li key={c.id} className={c.kind === "badge" ? "text-primary" : c.kind === "narration" ? "italic text-muted-foreground" : ""}>
                  {c.speaker ? <strong>{c.speaker}: </strong> : null}
                  {c.text}
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </main>
  );
}
