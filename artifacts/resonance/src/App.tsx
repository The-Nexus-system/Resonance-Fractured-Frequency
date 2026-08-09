import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { A11yProvider } from "@/components/a11y-provider";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CharacterSelect from "@/pages/character-select";
import DayOne from "@/pages/day-one";
import Settings from "@/pages/settings";
import About from "@/pages/about";

const queryClient = new QueryClient();

/**
 * Moves keyboard/screen-reader focus to the main content heading after
 * client-side navigation, so focus never remains on a control that no
 * longer exists. Skipped on initial page load (browser handles that).
 */
function RouteFocusManager() {
  const [location] = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Some pages render their content asynchronously (e.g. the play page
    // loads campaign state first), so retry briefly until the target exists.
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const tryFocus = () => {
      const target = document.getElementById("main-content");
      if (target) {
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: false });
        return;
      }
      if (attempts < 20) {
        attempts += 1;
        timer = setTimeout(tryFocus, 50);
      }
    };
    tryFocus();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/characters" component={CharacterSelect} />
      <Route path="/day-one" component={DayOne} />
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
            <RouteFocusManager />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </A11yProvider>
    </QueryClientProvider>
  );
}

export default App;
