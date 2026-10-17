import { useLocation } from "wouter";
import { useState } from "react";
import type { CharacterId } from "@/lib/gateone/characters";
import { CrewWardrobePreview } from "@/components/crew-wardrobe-visual";
import { WARDROBE_VISUALS } from "@/lib/visuals/wardrobe";
import { useA11y } from "@/components/a11y-provider";
import { CHARACTERS } from "@/lib/gateone/characters";
import { loadSave, saveGame, defaultGateOne } from "@/lib/settings";

/**
 * Day One begins after the player has already chosen one of the six authored
 * crew. This screen is that pre-opening choice — the characters are canon,
 * not created here.
 */
export default function CharacterSelect() {
  const [, navigate] = useLocation();
  const { announce } = useA11y();
  const [previewId, setPreviewId] = useState<CharacterId>("nia");
  const preview = WARDROBE_VISUALS[previewId];

  const choose = (id: string, name: string) => {
    const save = loadSave();
    save.gateOne = { ...defaultGateOne, characterId: id };
    saveGame(save);
    announce(`Playing as ${name}. Day One begins.`);
    navigate("/day-one");
  };

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Choose your crew member</h1>
      <p className="mt-3 text-muted-foreground">
        Six people are reporting to the CSV Hearth today. You will live Day One as one of
        them. Their lives, bodies, and histories are already their own — you are stepping
        into one, not building one.
      </p>
      {/* A real single 3D garment preview, shared across all six profiles.
          Decorative and never required for choosing a character. All final
          clothing decisions remain subject to Nexus review. */}
      <section className="mt-7 rounded-xl border border-border bg-card p-4" aria-labelledby="wardrobe-preview-title">
        <h2 id="wardrobe-preview-title" className="text-lg font-semibold">
          Wardrobe concept preview — not final clothing canon
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-[220px_1fr]">
          <div className="h-56 w-full max-w-xs">
            <CrewWardrobePreview characterId={previewId} />
          </div>
          <div className="self-center">
            <p className="font-medium">{preview.displayName}: {preview.uniformType}</p>
            <p className="mt-2 text-sm text-muted-foreground">{preview.garmentDescription}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Visual garment shapes are reusable. Fabrics, equipment placement and closures are
              proposed and still subject to creator review. Audio cues are Wren's separate work.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Focus or hover over a crew member below to preview that outfit concept.
            </p>
          </div>
        </div>
      </section>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2" role="list">
        {CHARACTERS.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => choose(c.id, c.name)}
              onFocus={() => setPreviewId(c.id)}
              onMouseEnter={() => setPreviewId(c.id)}
              data-testid={`button-character-${c.id}`}
              className="w-full rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block text-lg font-semibold">{c.name}</span>
              <span className="block text-sm text-muted-foreground">
                {c.rank} · {c.role} · {c.pronouns}
              </span>
              <span className="mt-2 block text-sm">{c.blurb}</span>
              <span className="mt-2 block text-xs text-muted-foreground">From {c.origin}.</span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
