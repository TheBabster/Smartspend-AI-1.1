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
import { useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import SimpleDashboard from "@/pages/SimpleDashboard";
import ComprehensiveOnboarding from "@/pages/ComprehensiveOnboarding";
import Decisions from "@/pages/Decisions";
import EnhancedGoals from "@/pages/EnhancedGoals";
import EnhancedSmartieChat from "@/pages/EnhancedSmartieChat";
import Analytics from "@/pages/Analytics";
import EnhancedAnalytics from "@/pages/EnhancedAnalytics";
import SmartieCorner from "@/pages/SmartieCorner";
import Growth from "@/pages/Growth";
import TrackExpense from "@/pages/TrackExpense";
import SmartPurchase from "@/pages/SmartPurchase";
import { LogoDemo } from "./pages/LogoDemo";



// Protected route component that enforces mandatory onboarding
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { user: firebaseUser, loading } = useAuth();
  const [location, navigate] = useLocation();
  const [dbUser, setDbUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const checkUserOnboarding = async () => {
      if (!firebaseUser || loading || redirected) return;

      try {
        // Sync Firebase user with database
        const response = await fetch('/api/auth/firebase-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
          })
        });

        if (response.ok) {
          const userData = await response.json();
          setDbUser(userData);
          
          // Use wouter navigation instead of window.location.href to prevent infinite loops
          if (!userData.onboardingCompleted && location !== '/onboarding') {
            console.log('🚀 Redirecting to onboarding for incomplete setup');
            setRedirected(true);
            navigate('/onboarding');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking user onboarding:', error);
        // Don't block the app if there's an error
      } finally {
        setUserLoading(false);
      }
    };

    checkUserOnboarding();
  }, [firebaseUser, loading, location, navigate, redirected]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SmartSpend...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <Auth />;
  }

  // Allow onboarding page even if not completed
  if (location === '/onboarding') {
    return <Component />;
  }

  // Block all other routes if onboarding not completed
  if (dbUser && !dbUser.onboardingCompleted) {
    return <ComprehensiveOnboarding />;
  }

  return <Component />;
};

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/onboarding">
        <ProtectedRoute component={ComprehensiveOnboarding} />
      </Route>
      <Route path="/">
        <ProtectedRoute component={SimpleDashboard} />
      </Route>
      <Route path="/decisions">
        <ProtectedRoute component={Decisions} />
      </Route>
      <Route path="/goals">
        <ProtectedRoute component={EnhancedGoals} />
      </Route>
      <Route path="/chat">
        <ProtectedRoute component={EnhancedSmartieChat} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={EnhancedAnalytics} />
      </Route>
      <Route path="/purchase">
        <ProtectedRoute component={SmartPurchase} />
      </Route>
      <Route path="/track-expense">
        <ProtectedRoute component={TrackExpense} />
      </Route>
      <Route path="/expenses">
        <ProtectedRoute component={TrackExpense} />
      </Route>
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