import { useAuth } from "@/hooks/useAuth";

import Auth from "@/pages/Auth"; // 🔑 Sign in / Sign up page
import "./firebase"; // This will run the Firebase init when the app loads

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

function Router({ user }: { user: any }) {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={user ? Dashboard : Auth} />
      <Route path="/decisions" component={user ? Decisions : Auth} />
      <Route path="/goals" component={user ? EnhancedGoals : Auth} />
      <Route path="/analytics" component={user ? EnhancedAnalytics : Auth} />
      <Route path="/analytics-old" component={user ? Analytics : Auth} />
      <Route path="/smartie" component={user ? SmartieCorner : Auth} />
      <Route path="/growth" component={user ? Growth : Auth} />
      <Route path="/purchase" component={user ? SmartPurchase : Auth} />
      <Route path="/track-expense" component={user ? TrackExpense : Auth} />
      <Route path="/expenses" component={user ? TrackExpense : Auth} />
      <Route path="/logo" component={LogoDemo} />
      <Route path="/auth" component={Auth} /> {/* 🔑 Sign In/Sign Up */}
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
          <Router user={user} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;