import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/firebase";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModernSmartieAvatar from "@/components/ModernSmartieAvatar";
import { LogOut } from "lucide-react";

export default function SimpleDashboard() {
  const [userName, setUserName] = useState("SmartSpender");
  const [, navigate] = useLocation();
  const { user: firebaseUser, loading: authLoading } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      navigate("/auth");
    }
  }, [firebaseUser, authLoading, navigate]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      if (!firebaseUser) return;

      try {
        console.log("Fetching user data for:", firebaseUser.uid);
        const userDoc = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Firestore user data:", data);
          if (data.name) {
            setUserName(data.name);
            console.log("User name set to:", data.name);
          }
        } else {
          console.log("No Firestore document found for user");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <ModernSmartieAvatar mood="thinking" size="xl" />
          </div>
          <p className="text-lg font-medium text-gray-600">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!firebaseUser) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <ModernSmartieAvatar mood="happy" size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {getGreeting()}, {userName}!
              </h1>
              <p className="text-gray-600">Welcome to your SmartSpend dashboard</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Button className="h-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <div className="text-center">
              <p className="font-semibold">Smart Purchase</p>
              <p className="text-xs opacity-90">Get AI advice</p>
            </div>
          </Button>
          
          <Button variant="outline" className="h-20">
            <div className="text-center">
              <p className="font-semibold">Add Expense</p>
              <p className="text-xs opacity-70">Track spending</p>
            </div>
          </Button>
          
          <Button variant="outline" className="h-20">
            <div className="text-center">
              <p className="font-semibold">View Budget</p>
              <p className="text-xs opacity-70">Check progress</p>
            </div>
          </Button>
          
          <Button variant="outline" className="h-20">
            <div className="text-center">
              <p className="font-semibold">Chat with Smartie</p>
              <p className="text-xs opacity-70">Financial coaching</p>
            </div>
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ModernSmartieAvatar mood="celebrating" size="sm" />
                Welcome to SmartSpend!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
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
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm text-gray-600">{userName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm text-gray-600">{firebaseUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-green-600 font-medium">Authenticated</span>
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
                  <span className="text-sm">Set up your budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Add your first expense</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">Chat with Smartie for advice</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smartie Corner */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ModernSmartieAvatar mood="happy" size="lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-800 mb-2">
                  Hi {userName}! I'm Smartie, your AI financial coach
                </h3>
                <p className="text-purple-700 mb-4">
                  Welcome to SmartSpend! I'm here to help you make smarter financial decisions. 
                  Ready to start your journey to better financial wellness?
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
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