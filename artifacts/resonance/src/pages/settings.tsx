import { Link } from "wouter";
import { useA11y } from "@/components/a11y-provider";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

export default function Settings() {
  const { settings, updateSettings, announce } = useA11y();

  useEffect(() => {
    announce("Settings and Accessibility Preferences");
  }, [announce]);

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full gap-6">
      <header className="flex items-center gap-4 border-b pb-4 mb-4">
        <Link href="/">
          <Button variant="ghost" size="icon" aria-label="Back to main menu">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 id="main-content" className="text-3xl font-bold">Settings & Accessibility</h1>
      </header>

      <main className="flex flex-col gap-8 pb-12">
        
        <section aria-labelledby="visual-heading">
          <h2 id="visual-heading" className="text-xl font-bold mb-4 border-b pb-2">Visual</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              
              <div className="p-4 md:p-6 space-y-4">
                <Label className="text-base font-semibold block">Theme</Label>
                <RadioGroup 
                  value={settings.theme} 
                  onValueChange={(val: any) => updateSettings({ theme: val })}
                  className="flex flex-col sm:flex-row gap-4"
                  aria-label="Application Theme"
                >
                  <div className="flex items-center space-x-3 bg-muted p-3 rounded-md flex-1">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="flex-1 cursor-pointer">Light</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted p-3 rounded-md flex-1">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="flex-1 cursor-pointer">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted p-3 rounded-md flex-1">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="flex-1 cursor-pointer">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="high-contrast" className="text-base font-semibold cursor-pointer">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increases contrast ratio for better readability.</p>
                </div>
                <Switch 
                  id="high-contrast" 
                  checked={settings.highContrast} 
                  onCheckedChange={(c) => updateSettings({ highContrast: c })} 
                />
              </div>

              <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="colorblind-safe" className="text-base font-semibold cursor-pointer">Colorblind Safe Mode</Label>
                  <p className="text-sm text-muted-foreground">Adjusts colors to be distinguishable for color vision deficiencies.</p>
                </div>
                <Switch 
                  id="colorblind-safe" 
                  checked={settings.colorblindSafe} 
                  onCheckedChange={(c) => updateSettings({ colorblindSafe: c })} 
                />
              </div>

              <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="reduce-motion" className="text-base font-semibold cursor-pointer">Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimizes animations and transitions across the app.</p>
                </div>
                <Switch 
                  id="reduce-motion" 
                  checked={settings.reduceMotion} 
                  onCheckedChange={(c) => updateSettings({ reduceMotion: c })} 
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="typography-heading">
          <h2 id="typography-heading" className="text-xl font-bold mb-4 border-b pb-2">Typography & Readability</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              
              <div className="p-4 md:p-6 space-y-4">
                <Label className="text-base font-semibold block">Text Size</Label>
                <RadioGroup 
                  value={settings.textSize} 
                  onValueChange={(val: any) => updateSettings({ textSize: val })}
                  className="flex flex-col sm:flex-row gap-4"
                  aria-label="Text Size"
                >
                  <div className="flex items-center space-x-3 bg-muted p-3 rounded-md flex-1">
                    <RadioGroupItem value="normal" id="text-normal" />
                    <Label htmlFor="text-normal" className="flex-1 cursor-pointer">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted p-3 rounded-md flex-1">
                    <RadioGroupItem value="large" id="text-large" />
                    <Label htmlFor="text-large" className="flex-1 cursor-pointer">Large</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-muted p-3 rounded-md flex-1">
                    <RadioGroupItem value="xl" id="text-xl" />
                    <Label htmlFor="text-xl" className="flex-1 cursor-pointer">Extra Large</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="dyslexia-font" className="text-base font-semibold cursor-pointer">Dyslexia Friendly Font</Label>
                  <p className="text-sm text-muted-foreground">Uses a typeface designed to improve readability.</p>
                </div>
                <Switch 
                  id="dyslexia-font" 
                  checked={settings.dyslexiaFont} 
                  onCheckedChange={(c) => updateSettings({ dyslexiaFont: c })} 
                />
              </div>

            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="audio-heading">
          <h2 id="audio-heading" className="text-xl font-bold mb-4 border-b pb-2">Audio & Motor</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              
              <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="sound" className="text-base font-semibold cursor-pointer">Play Audio Tones</Label>
                  <p className="text-sm text-muted-foreground">Play puzzle frequencies using Web Audio.</p>
                </div>
                <Switch 
                  id="sound" 
                  checked={settings.sound} 
                  onCheckedChange={(c) => updateSettings({ sound: c })} 
                />
              </div>

              <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="captions" className="text-base font-semibold cursor-pointer">Show Captions</Label>
                  <p className="text-sm text-muted-foreground">Show text descriptions for all audio tones.</p>
                </div>
                <Switch 
                  id="captions" 
                  checked={settings.captions} 
                  onCheckedChange={(c) => updateSettings({ captions: c })} 
                />
              </div>

              <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="large-targets" className="text-base font-semibold cursor-pointer">Large Tap Targets (AAC)</Label>
                  <p className="text-sm text-muted-foreground">Increases the size of all interactive buttons and links.</p>
                </div>
                <Switch 
                  id="large-targets" 
                  checked={settings.largeTargets} 
                  onCheckedChange={(c) => updateSettings({ largeTargets: c })} 
                />
              </div>

            </CardContent>
          </Card>
        </section>

      </main>
    </div>
  );
}