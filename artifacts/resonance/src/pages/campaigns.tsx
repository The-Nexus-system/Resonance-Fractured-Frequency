import { Link } from "wouter";
import { useA11y } from "@/components/a11y-provider";
import { loadSave } from "@/lib/settings";
import { campaigns } from "@/lib/campaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Lock, PlayCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Campaigns() {
  const { announce } = useA11y();
  const [saveProgress, setSaveProgress] = useState<Record<string, { currentNodeIndex: number; completed: boolean }>>({});

  useEffect(() => {
    announce("Campaign Select Screen");
    const save = loadSave();
    setSaveProgress(save.progress);
  }, [announce]);

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full gap-6">
      <header className="flex items-center gap-4 border-b pb-4 mb-4">
        <Link href="/">
          <Button variant="ghost" size="icon" aria-label="Back to main menu">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 id="main-content" className="text-3xl font-bold">Campaigns</h1>
      </header>

      <main className="flex flex-col gap-6" aria-label="Campaign list">
        {campaigns.map((campaign) => {
          const progress = saveProgress[campaign.id] || { currentNodeIndex: 0, completed: false };
          const percent = campaign.nodes.length > 0 
            ? (progress.currentNodeIndex / campaign.nodes.length) * 100 
            : 0;

          return (
            <Card key={campaign.id} className={campaign.locked ? "opacity-75 bg-muted/50" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {campaign.locked && <Lock className="w-5 h-5 text-muted-foreground" aria-hidden="true" />}
                    {campaign.title}
                  </CardTitle>
                  {!campaign.locked && progress.completed && (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>
                <CardDescription className="text-base">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign.locked ? (
                  <p className="text-sm font-medium text-muted-foreground bg-muted p-3 rounded-md inline-block">
                    Locked: {campaign.lockReason}
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.completed ? "100%" : `${Math.round(percent)}%`}</span>
                      </div>
                      <Progress value={progress.completed ? 100 : percent} aria-label={`${Math.round(percent)}% complete`} />
                    </div>
                    
                    <div className="pt-2">
                      <Link href={`/play/${campaign.id}`}>
                        <Button className="w-full sm:w-auto flex items-center gap-2 h-12 text-base">
                          <PlayCircle className="w-5 h-5" />
                          {progress.currentNodeIndex === 0 && !progress.completed ? "Start Campaign" : 
                           progress.completed ? "Replay Campaign" : "Continue Campaign"}
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
}