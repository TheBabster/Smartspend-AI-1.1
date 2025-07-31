import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import ModernSmartieAvatar from "@/components/ModernSmartieAvatar";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAuth = async () => {
    if (loading) return;
    
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        console.log("Login successful:", result.user.uid);
        setMessage("✅ Welcome back! Redirecting to your dashboard...");
        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 1500);
      } else {
        if (!name.trim()) {
          setMessage("❌ Please enter your name.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;
        console.log("Account created:", user.uid);

        // Save the user's name and email to Firestore
        const userData = {
          name: name.trim(),
          email: email.trim(),
          createdAt: new Date()
        };
        console.log("💾 Saving user data to Firestore:", userData);
        await setDoc(doc(db, "users", user.uid), userData);
        console.log("✅ User data successfully saved to Firestore with UID:", user.uid);

        setMessage("✅ Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 1500);
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Auth error:", error);
      const errorMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' 
        ? "Invalid email or password" 
        : error.code === 'auth/email-already-in-use'
        ? "Email already in use"
        : error.code === 'auth/weak-password'
        ? "Password should be at least 6 characters"
        : error.message;
      setMessage("❌ " + errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="drop-shadow-lg">
                <ModernSmartieAvatar 
                  mood="happy" 
                  size="lg" 
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isLogin ? "Welcome Back!" : "Join SmartSpend"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isLogin ? "Sign in to continue your financial journey" : "Start your smart spending journey today"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  disabled={loading}
                />
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Create a password (6+ characters)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className={message.startsWith("✅") ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Button
              onClick={handleAuth}
              disabled={loading || !email || !password || (!isLogin && !name)}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold"
                disabled={loading}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Auth;