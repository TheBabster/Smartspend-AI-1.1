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

        {/* Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to SmartSpend!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your authentication is working perfectly! Your name "{userName}" 
                was successfully fetched from Firebase Firestore.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Firebase User Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {firebaseUser.email}</p>
                <p><strong>User ID:</strong> {firebaseUser.uid}</p>
                <p><strong>Display Name:</strong> {userName}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Now that authentication is working, we can integrate all the 
                advanced SmartSpend features like budgets, expenses, and AI coaching.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}