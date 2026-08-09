import { useLocation } from "wouter";
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
      <ul className="mt-8 grid gap-4 sm:grid-cols-2" role="list">
        {CHARACTERS.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => choose(c.id, c.name)}
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
