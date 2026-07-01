import { Link } from "wouter";
import { useA11y } from "@/components/a11y-provider";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

export default function About() {
  const { announce } = useA11y();

  useEffect(() => {
    announce("About and Accessibility Statement");
  }, [announce]);

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full gap-6">
      <header className="flex items-center gap-4 border-b pb-4 mb-4">
        <Link href="/">
          <Button variant="ghost" size="icon" aria-label="Back to main menu">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 id="main-content" className="text-3xl font-bold">About & Accessibility</h1>
      </header>

      <main className="flex flex-col gap-8 pb-12 leading-relaxed">
        
        <section aria-labelledby="about-heading" className="space-y-4">
          <h2 id="about-heading" className="text-2xl font-bold">About Resonance</h2>
          <p className="text-lg">
            Resonance Fractured Frequency is a calm, narrative puzzle game about aligning broken signals.
            Designed from the ground up to be welcoming, it never punishes, never rushes, and provides 
            multiple pathways to understand and solve its puzzles.
          </p>
        </section>

        <section aria-labelledby="a11y-heading" className="space-y-4">
          <h2 id="a11y-heading" className="text-2xl font-bold">Accessibility Statement</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <p className="text-lg font-medium text-primary">
                We are committed to making Resonance playable by everyone.
              </p>
              
              <ul className="space-y-4 list-disc list-inside px-2">
                <li>
                  <strong>Blind & Low Vision:</strong> Full screen reader support with descriptive alternative text, semantic HTML, high contrast themes, and scalable text up to 130%.
                </li>
                <li>
                  <strong>Deaf & Hard of Hearing:</strong> Audio is completely optional. All tones have visual equivalents and descriptive captions.
                </li>
                <li>
                  <strong>Motor & AAC Needs:</strong> Playable with a single hand, full keyboard navigation, large target toggle for easier tapping, and predictable layout.
                </li>
                <li>
                  <strong>Neurodivergent & Cognitive Needs:</strong> Dyslexia-friendly font options, reduced motion support, no timers, and simple plain-language instructions.
                </li>
                <li>
                  <strong>Color Vision Deficiencies:</strong> Color is never used as the sole method of conveying information. A specific colorblind-safe palette is available.
                </li>
              </ul>
              
              <p className="text-sm text-muted-foreground mt-4 italic">
                If you encounter any barriers, please let us know. The journey of alignment includes aligning our software with your needs.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}