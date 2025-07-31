import Auth from "@/pages/Auth";
import "./firebase";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import SimpleDashboard from "@/pages/SimpleDashboard";
import OnboardingFlow from "@/pages/OnboardingFlow";
import Decisions from "@/pages/Decisions";
import EnhancedGoals from "@/pages/EnhancedGoals";
import Analytics from "@/pages/Analytics";
import EnhancedAnalytics from "@/pages/EnhancedAnalytics";
import SmartieCorner from "@/pages/SmartieCorner";
import Growth from "@/pages/Growth";
import TrackExpense from "@/pages/TrackExpense";
import SmartPurchase from "@/pages/SmartPurchase";
import { LogoDemo } from "./pages/LogoDemo";



function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleDashboard} />
      <Route path="/full" component={Dashboard} />
      <Route path="/auth" component={Auth} />
      <Route path="/onboarding" component={OnboardingFlow} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/simple" component={SimpleDashboard} />
      <Route path="/decisions" component={Decisions} />
      <Route path="/goals" component={EnhancedGoals} />
      <Route path="/analytics" component={EnhancedAnalytics} />
      <Route path="/analytics-old" component={Analytics} />
      <Route path="/smartie" component={SmartieCorner} />
      <Route path="/growth" component={Growth} />
      <Route path="/purchase" component={SmartPurchase} />
      <Route path="/track-expense" component={TrackExpense} />
      <Route path="/expenses" component={TrackExpense} />
      <Route path="/logo" component={LogoDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="smartspend-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;