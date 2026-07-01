import { Link, useParams, useLocation } from "wouter";
import { useA11y } from "@/components/a11y-provider";
import { loadSave, saveGame, GameSave } from "@/lib/settings";
import { campaigns, Campaign, Node, Choice } from "@/lib/campaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Volume2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Progress } from "@/components/ui/progress";

export default function Play() {
  const { campaignId } = useParams();
  const [, setLocation] = useLocation();
  const { settings, announce } = useA11y();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "error" | "success" } | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize
  useEffect(() => {
    const found = campaigns.find(c => c.id === campaignId);
    if (!found || found.locked) {
      setLocation("/campaigns");
      return;
    }
    setCampaign(found);
    
    const save = loadSave();
    const progress = save.progress[found.id] || { currentNodeIndex: 0, completed: false };
    
    if (progress.completed) {
      setCompleted(true);
      announce(`${found.title} campaign completed screen.`);
    } else {
      setNodeIndex(progress.currentNodeIndex);
      announce(`Playing ${found.title}, node ${progress.currentNodeIndex + 1}.`);
    }
  }, [campaignId, setLocation, announce]);

  const updateProgress = useCallback((newIndex: number, isCompleted: boolean) => {
    if (!campaign) return;
    const save = loadSave();
    if (!save.progress[campaign.id]) {
      save.progress[campaign.id] = { currentNodeIndex: 0, completed: false };
    }
    save.progress[campaign.id].currentNodeIndex = newIndex;
    save.progress[campaign.id].completed = isCompleted;
    saveGame(save);
  }, [campaign]);

  const playTone = useCallback((freq: number) => {
    if (!settings.sound) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = freq;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2);
    } catch (err) {
      console.warn("Audio playback failed", err);
    }
  }, [settings.sound]);

  const handleChoice = (choice: Choice, node: Node) => {
    if (choice.isCorrect) {
      setFeedback(null);
      announce("Correct! Resonance established.");
      playTone(node.toneFreq || 440); // Play happy tone
      
      setTimeout(() => {
        if (!campaign) return;
        const nextIndex = nodeIndex + 1;
        if (nextIndex >= campaign.nodes.length) {
          setCompleted(true);
          updateProgress(nextIndex, true);
          announce("Campaign complete! Returning to calm screen.");
        } else {
          setNodeIndex(nextIndex);
          updateProgress(nextIndex, false);
          announce(`Advanced to node ${nextIndex + 1}.`);
        }
      }, 1500);
    } else {
      const msg = choice.feedbackOnFail || "Incorrect resonance. Try a different alignment.";
      setFeedback({ message: msg, type: "error" });
      announce(`Incorrect. ${msg}`);
      
      if (settings.sound) {
        playTone(150); // low error buzz
      }
    }
  };

  const handleReplay = () => {
    setCompleted(false);
    setNodeIndex(0);
    setFeedback(null);
    updateProgress(0, false);
    announce("Restarting campaign.");
  };

  if (!campaign) return null;

  if (completed) {
    return (
      <div className="min-h-[100dvh] flex flex-col p-4 max-w-2xl mx-auto w-full gap-6 items-center justify-center text-center">
        <div className="space-y-6">
          <CheckCircle2 className="w-20 h-20 mx-auto text-primary" aria-hidden="true" />
          <h1 id="main-content" className="text-4xl font-bold">Signal Restored</h1>
          <p className="text-xl text-muted-foreground">
            You have successfully aligned all frequencies in {campaign.title}. The planetary network hums in harmony once more.
          </p>
          <div className="flex flex-col gap-4 mt-8 w-full max-w-xs mx-auto">
            <Link href="/campaigns" className="w-full">
              <Button size="lg" className="w-full h-14 text-lg">Return to Campaigns</Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full h-14 text-lg" onClick={handleReplay}>
              Replay Campaign
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const node = campaign.nodes[nodeIndex];
  const percent = ((nodeIndex) / campaign.nodes.length) * 100;

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-6 max-w-2xl mx-auto w-full gap-6">
      <header className="flex items-center gap-4">
        <Link href="/campaigns">
          <Button variant="ghost" size="icon" aria-label="Back to campaigns">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="sr-only">{campaign.title} - Puzzle {nodeIndex + 1}</h1>
          <div className="flex justify-between text-sm font-medium mb-2 text-muted-foreground" aria-hidden="true">
            <span>{campaign.title}</span>
            <span>{nodeIndex + 1} / {campaign.nodes.length}</span>
          </div>
          <Progress value={percent} aria-label={`Progress: Node ${nodeIndex + 1} of ${campaign.nodes.length}`} />
        </div>
      </header>

      <main id="main-content" className="flex-1 flex flex-col gap-8 py-4">
        
        {/* Narrative & Target */}
        <section aria-labelledby="narrative-heading" className="space-y-6">
          <h2 id="narrative-heading" className="sr-only">Current Node Status</h2>
          
          <p className="text-lg md:text-xl leading-relaxed">
            {node.narrative}
          </p>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-primary uppercase tracking-wider text-sm flex items-center gap-2">
                Target Resonance
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Visual Redundancy */}
                <div 
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center bg-background border shadow-inner ${node.targetVisual.colorClass}`}
                  aria-hidden="true"
                >
                  <node.targetVisual.shape className="w-12 h-12" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <p className="font-medium text-lg">
                    {node.targetDescription}
                  </p>
                  
                  {/* Visual alt text exposed to AT explicitly or as text redundancy */}
                  <p className="text-sm text-muted-foreground">
                    <span className="sr-only">Visual representation: </span>
                    {node.targetVisual.label}
                  </p>

                  {/* Audio Redundancy */}
                  {settings.sound && node.toneFreq && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2 flex items-center gap-2"
                      onClick={() => playTone(node.toneFreq!)}
                      aria-label={`Play target tone. ${settings.captions ? node.toneCaption : ""}`}
                    >
                      <Volume2 className="w-4 h-4" />
                      Play Tone
                    </Button>
                  )}
                  {settings.captions && node.toneCaption && (
                    <p className="text-sm italic text-muted-foreground mt-1" aria-hidden="true">
                      {node.toneCaption}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Feedback Area */}
        {feedback && (
          <div 
            className={`p-4 rounded-lg flex items-start gap-3 ${feedback.type === 'error' ? 'bg-destructive/10 text-destructive-foreground dark:text-destructive' : 'bg-green-100 text-green-900'}`}
            role="alert"
          >
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-medium text-base leading-snug">
              {feedback.message}
            </p>
          </div>
        )}

        {/* Choices */}
        <section aria-labelledby="choices-heading" className="mt-auto pb-8 space-y-4">
          <h2 id="choices-heading" className="text-xl font-bold mb-4">Select matching alignment:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {node.choices.map((choice) => (
              <Button
                key={choice.id}
                variant="outline"
                className="h-auto min-h-16 py-4 flex flex-row items-center justify-start gap-4 text-left hover:border-primary focus-visible:ring-primary text-lg"
                onClick={() => handleChoice(choice, node)}
              >
                <div className="bg-muted p-3 rounded-full" aria-hidden="true">
                  <choice.icon className="w-6 h-6" />
                </div>
                <span className="flex-1 break-words whitespace-normal">{choice.label}</span>
              </Button>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}