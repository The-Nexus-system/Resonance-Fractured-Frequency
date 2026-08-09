import { Link } from "wouter";
import { useA11y } from "@/components/a11y-provider";
import { loadSave } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Play, Users, Settings, Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { announce } = useA11y();
  const [hasDayOne, setHasDayOne] = useState(false);

  useEffect(() => {
    announce("Main Menu. Resonance Fractured Frequency.");
    const save = loadSave();
    setHasDayOne(Boolean(save.gateOne?.characterId));
  }, [announce]);

  return (
    <main id="main-content" className="min-h-[100dvh] flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full gap-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Resonance
          <span className="block text-2xl text-foreground font-light mt-2">Fractured Frequency</span>
        </h1>
        <p className="text-muted-foreground">Day One. The CSV Hearth is waiting.</p>
      </header>

      <nav className="flex flex-col gap-4 w-full" aria-label="Main menu">
        {hasDayOne ? (
          <Button asChild size="lg" className="w-full text-lg h-14 flex items-center gap-3">
            <Link href="/day-one" data-testid="link-continue-day-one">
              <Play className="w-6 h-6" aria-hidden="true" />
              Continue Day One
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full text-lg h-14 flex items-center gap-3">
            <Link href="/characters" data-testid="link-begin-day-one">
              <Play className="w-6 h-6" aria-hidden="true" />
              Begin Day One
            </Link>
          </Button>
        )}

        <Button asChild variant="secondary" size="lg" className="w-full text-lg h-14 flex items-center gap-3">
          <Link href="/characters" data-testid="link-characters">
            <Users className="w-6 h-6" aria-hidden="true" />
            Crew
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="w-full text-lg h-14 flex items-center gap-3">
          <Link href="/settings">
            <Settings className="w-6 h-6" aria-hidden="true" />
            Settings
          </Link>
        </Button>

        <Button asChild variant="ghost" size="lg" className="w-full text-lg h-14 flex items-center gap-3">
          <Link href="/about">
            <Info className="w-6 h-6" aria-hidden="true" />
            About & Accessibility
          </Link>
        </Button>
      </nav>
    </main>
  );
}
