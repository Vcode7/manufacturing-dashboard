import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/lib/theme";
import { AnimatePresence } from "framer-motion";

import Dashboard from "@/pages/Dashboard";
import Production from "@/pages/Production";
import Inventory from "@/pages/Inventory";
import SupplyChain from "@/pages/SupplyChain";
import Analytics from "@/pages/Analytics";
import Machines from "@/pages/Machines";
import Settings from "@/pages/Settings";
import AIAnalysis from "@/pages/AIAnalysis";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/production" component={Production} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/supply-chain" component={SupplyChain} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/machines" component={Machines} />
          <Route path="/ai-analysis" component={AIAnalysis} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
