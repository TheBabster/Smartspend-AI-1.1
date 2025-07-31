import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModernSmartieAvatar from "@/components/ModernSmartieAvatar";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function SimpleDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [, navigate] = useLocation();
  const { user: firebaseUser, loading: authLoading } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      navigate("/auth");
    }
  }, [firebaseUser, authLoading, navigate]);

  // Sync Firebase user with PostgreSQL and fetch user data
  useEffect(() => {
    const syncAndFetchUser = async () => {
      if (!firebaseUser?.email) {
        console.log("No Firebase user available");
        setUserLoading(false);
        return;
      }

      try {
        console.log("🚀 Syncing Firebase user with PostgreSQL:", firebaseUser.email);
        
        // First, ensure user exists in PostgreSQL
        const syncResponse = await fetch("/api/auth/firebase-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
          })
        });

        if (!syncResponse.ok) {
          throw new Error(`Sync failed: ${syncResponse.statusText}`);
        }

        const userData = await syncResponse.json();
        console.log("✅ User synced successfully:", userData);
        setUser(userData);
        setUserLoading(false);
      } catch (error) {
        console.error("❌ Error syncing user data:", error);
        // Fallback: try to fetch existing user
        try {
          const fallbackResponse = await fetch(`/api/user/${encodeURIComponent(firebaseUser.email)}`);
          if (fallbackResponse.ok) {
            const fallbackUser = await fallbackResponse.json();
            setUser(fallbackUser);
          } else {
            throw new Error('User not found');
          }
        } catch (fallbackError) {
          console.error("❌ Fallback user fetch failed:", fallbackError);
          // Create basic user object for display
          setUser({
            id: 'temp-id',
            username: firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            password: '',
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            currency: 'GBP',
            monthlyIncome: null,
            onboardingCompleted: false,
            financialProfile: null,
            createdAt: new Date()
          } as User);
        }
        setUserLoading(false);
      }
    };

    syncAndFetchUser();
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while checking authentication or syncing user
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <ModernSmartieAvatar mood="thinking" size="xl" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            {authLoading ? "Authenticating..." : "Setting up your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!firebaseUser || !user) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <ModernSmartieAvatar mood="happy" size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {getGreeting()}, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome to your SmartSpend dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Actions - Now Functional */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Button 
            className="h-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => navigate("/purchase")}
          >
            <div className="text-center">
              <p className="font-semibold">Smart Purchase</p>
              <p className="text-xs opacity-90">Get AI advice</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20"
            onClick={() => navigate("/track-expense")}
          >
            <div className="text-center">
              <p className="font-semibold">Add Expense</p>
              <p className="text-xs opacity-70">Track spending</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20"
            onClick={() => navigate("/goals")}
          >
            <div className="text-center">
              <p className="font-semibold">View Budget</p>
              <p className="text-xs opacity-70">Check progress</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20"
            onClick={() => navigate("/chat")}
          >
            <div className="text-center">
              <p className="font-semibold">Chat with Smartie</p>
              <p className="text-xs opacity-70">Financial coaching</p>
            </div>
          </Button>
        </div>

        {/* New User Welcome or Dashboard Content */}
        {!user.onboardingCompleted ? (
          <div className="text-center">
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <ModernSmartieAvatar mood="celebrating" size="lg" />
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Welcome to SmartSpend, {user.name}!
                    </h3>
                    <p className="text-blue-700 dark:text-blue-400 mb-4">
                      You need to complete your financial setup to get personalized advice and start tracking your progress.
                    </p>
                    <Button 
                      onClick={() => navigate("/onboarding")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Complete Financial Setup (Required)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ModernSmartieAvatar mood="celebrating" size="sm" />
                  Welcome to SmartSpend!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Authentication is working perfectly! Your SmartSpend journey starts here with 
                  AI-powered financial coaching from Smartie.
                </p>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-300">Name:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-300">Email:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{firebaseUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-gray-300">Status:</span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">Authenticated</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm dark:text-gray-300">Set up your budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <span className="text-sm dark:text-gray-300">Add your first expense</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <span className="text-sm dark:text-gray-300">Chat with Smartie for advice</span>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Smartie Corner */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ModernSmartieAvatar mood="happy" size="lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  Hi {user.name}! I'm Smartie, your AI financial coach
                </h3>
                <p className="text-purple-700 dark:text-purple-400 mb-4">
                  Welcome to SmartSpend! I'm here to help you make smarter financial decisions. 
                  Ready to start your journey to better financial wellness?
                </p>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigate("/onboarding")}
                >
                  Start Financial Setup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}