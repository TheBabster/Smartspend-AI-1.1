import Auth from "@/pages/Auth";
import "./firebase";
import { useAuth } from "@/hooks/useAuth";

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
import Decisions from "@/pages/Decisions";
import EnhancedGoals from "@/pages/EnhancedGoals";
import Analytics from "@/pages/Analytics";
import EnhancedAnalytics from "@/pages/EnhancedAnalytics";
import SmartieCorner from "@/pages/SmartieCorner";
import Growth from "@/pages/Growth";
import TrackExpense from "@/pages/TrackExpense";
import SmartPurchase from "@/pages/SmartPurchase";
import { LogoDemo } from "./pages/LogoDemo";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return <div data-theme={theme}>{children}</div>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/auth" component={Auth} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
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
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;