import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { A11yProvider } from "@/components/a11y-provider";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Campaigns from "@/pages/campaigns";
import Play from "@/pages/play";
import Settings from "@/pages/settings";
import About from "@/pages/about";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/play/:campaignId" component={Play} />
      <Route path="/settings" component={Settings} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <A11yProvider>
        <TooltipProvider>
          {/* Skip link for keyboard users */}
          <a 
            href="#main-content" 
            className="skip-link sr-only focus:not-sr-only"
          >
            Skip to main content
          </a>
          
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </A11yProvider>
    </QueryClientProvider>
  );
}

export default App;
